/**
 * SRObro - Player Entity Class
 * Represents a player character in the game world
 */

import { Entity, EntityState } from './Entity';
import { Position, EntityType, CharacterRace, Character as SharedCharacter, cumulativeXpForLevel } from '@srobro/shared';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';

const logger = createLogger('PlayerEntity');

/**
 * Player entity options
 */
export interface PlayerEntityOptions {
  id: string;
  name: string;
  accountId: string;
  race: CharacterRace;
  level: number;
  exp: number;
  sp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  str: number;
  int: number;
  position: Position;
  rotation: number;
  gold: number;
  zoneId: string;
  modelId: string;
  skillPoints: number;
  statPoints: number;
  gender?: string;
  /** Maîtrises du perso: clé normalisée (bicheon|heuksal|pacheon|fire|cold|lightning|force|warrior|...) → niveau. */
  masteries?: Map<string, number>;
}

/**
 * Player Entity class
 */
export class PlayerEntity extends Entity {
  public readonly accountId: string;
  public readonly race: CharacterRace;
  public readonly gender: string;
  public exp: number;
  public sp: number;
  public hp: number;
  public maxHp: number;
  public mp: number;
  public maxMp: number;
  public str: number;
  public int: number;
  public gold: number;
  public skillPoints: number;
  public statPoints: number;
  /** Maîtrises { clé normalisée → niveau } (GAP + formules officielles). */
  public masteries: Map<string, number>;

  // Drapeaux GM (phase 6): hors combat normal, jamais persistés en base
  public godMode = false;
  public invisible = false;
  public frozen = false;
  public speedMultiplier = 1;

  // Cached combat stats (calculated from equipment, buffs, etc.)
  public stats: {
    attackPower: { min: number; max: number };
    magicalAttackPower: { min: number; max: number };
    defense: number;
    magicalDefense: number;
    parryRatio: number;
    blockRatio: number;
    criticalChance: number;
    attackRating: number;
  };

  private autoSaveInterval: NodeJS.Timeout | null = null;
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  // Accumulateurs de régénération fractionnaire (le tick de 50 ms donne des
  // deltas trop petits pour un floor() direct — sans accumulation la régén
  // resterait à 0 pour toujours)
  private hpRegenAccumulator = 0;
  private mpRegenAccumulator = 0;

  /** Niveau d'une maîtrise (clé normalisée: 'bicheon', 'fire'...), 0 si absente. */
  getMasteryLevel(key: string): number {
    return this.masteries?.get(key.toLowerCase()) ?? 0;
  }

  /** Maîtrise la plus haute (utilisée par le système de GAP). */
  highestMasteryLevel(): number {
    let max = 0;
    for (const lv of this.masteries?.values() ?? []) max = Math.max(max, lv);
    return max;
  }

  constructor(options: PlayerEntityOptions) {
    super({
      id: options.id,
      name: options.name,
      type: EntityType.PLAYER,
      level: options.level,
      position: options.position,
      rotation: options.rotation,
      modelId: options.modelId,
      zoneId: options.zoneId,
    });

    this.accountId = options.accountId;
    this.gender = options.gender ?? 'male';
    this.race = options.race;
    this.exp = options.exp;
    this.sp = options.sp;
    this.hp = options.hp;
    this.maxHp = options.maxHp;
    this.mp = options.mp;
    this.maxMp = options.maxMp;
    this.str = options.str;
    this.int = options.int;
    this.gold = options.gold;
    this.skillPoints = options.skillPoints;
    this.statPoints = options.statPoints;
    this.masteries = options.masteries ?? new Map();

    // Calculate initial combat stats
    this.stats = this.calculateStats();

    // Start auto-save
    this.startAutoSave();

    logger.info(`Player entity created: ${this.name}`, {
      id: this.id,
      level: this.level,
      race: this.race,
    });
  }

  /**
   * Update player (called every tick)
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Regenerate HP/MP
    this.regenerate(deltaTime);
  }

  /**
   * Recalcule les stats de combat en intégrant l'arme équipée (phase 3).
   * attackPower de base (calculé par calculateStats selon STR) + bonus arme.
   */
  applyWeaponStats(weapon: { attackMin: number; attackMax: number } | null): void {
    this.equippedWeapon = weapon;
    this.recalculateAttackPower();
    logger.info(`Stats recalculées pour ${this.name}: atk ${this.stats.attackPower.min}-${this.stats.attackPower.max}`);
  }

  /**
   * Attaque effective: dégâts de l'arme (officiel) + bonus de force
   * (1 point de dégât par tranche de 10 STR) — la répartition de points a
   * ainsi un effet visible même armé.
   */
  recalculateAttackPower(): void {
    this.stats = this.calculateStats();
    if (this.equippedWeapon) {
      const strBonus = Math.floor(this.str / 10);
      this.stats.attackPower = {
        min: this.equippedWeapon.attackMin + strBonus,
        max: Math.max(this.equippedWeapon.attackMin, this.equippedWeapon.attackMax) + strBonus,
      };
    }
  }

  /** Arme équipée (stats officielles de l'item). */
  equippedWeapon: { attackMin: number; attackMax: number } | null = null;

  /**
   * Set HP
   */
  setHp(hp: number): void {
    const oldHp = this.hp;
    this.hp = Math.max(0, Math.min(hp, this.maxHp));

    if (this.hp === 0 && oldHp > 0) {
      this.setState(EntityState.DEAD);
      this.handleDeath();
    }

    this.emit('hpChanged', { entityId: this.id, oldHp, newHp: this.hp });
  }

  /**
   * Set MP
   */
  setMp(mp: number): void {
    const oldMp = this.mp;
    this.mp = Math.max(0, Math.min(mp, this.maxMp));
    this.emit('mpChanged', { entityId: this.id, oldMp, newMp: this.mp });
  }

  /**
   * Add experience
   */
  addExp(amount: number): void {
    const oldExp = this.exp;
    this.exp += amount;

    // Un gros gain d'XP peut franchir plusieurs niveaux d'un coup
    let leveled = false;
    while (this.exp >= this.getExpNeededForLevel(this.level + 1)) {
      this.levelUp();
      leveled = true;
    }

    this.emit('expGained', {
      entityId: this.id,
      amount,
      oldExp,
      newExp: this.exp,
      leveledUp: leveled,
    });
  }

  /**
   * Add SP
   */
  addSp(amount: number): void {
    const oldSp = this.sp;
    this.sp += amount;
    this.emit('spGained', { entityId: this.id, amount, oldSp, newSp: this.sp });
  }

  /**
   * Add gold
   */
  addGold(amount: number): void {
    const oldGold = this.gold;
    this.gold += amount;
    this.emit('goldGained', { entityId: this.id, amount, oldGold, newGold: this.gold });
  }

  /**
   * Remove gold
   */
  removeGold(amount: number): boolean {
    if (this.gold < amount) {
      return false;
    }
    const oldGold = this.gold;
    this.gold -= amount;
    this.emit('goldSpent', { entityId: this.id, amount, oldGold, newGold: this.gold });
    return true;
  }

  /**
   * Add stat point
   */
  addStatPoint(stat: 'str' | 'int'): boolean {
    if (this.statPoints <= 0) {
      return false;
    }

    this.statPoints--;
    if (stat === 'str') {
      this.str++;
      this.recalculateAttackPower();
      this.maxHp += 20; // HP per STR
    } else {
      this.int++;
      this.maxMp += 15; // MP per INT
    }

    // Recalcul complet (y compris bonus STR sur l'arme équipée)
    this.recalculateAttackPower();

    this.emit('statAdded', { entityId: this.id, stat, value: this[stat] });
    return true;
  }

  /**
   * Level up
   */
  private levelUp(): void {
    const oldLevel = this.level;
    this.level++;

    // Give stat points
    this.statPoints += 3;

    // Increase HP/MP
    this.maxHp += 20;
    this.maxMp += 10;
    this.hp = this.maxHp;
    this.mp = this.maxMp;

    // Recalculate stats
    this.stats = this.calculateStats();

    logger.info(`Player leveled up: ${this.name}`, {
      oldLevel,
      newLevel: this.level,
    });

    this.emit('levelUp', { entityId: this.id, oldLevel, newLevel: this.level });
  }

  /**
   * Niveau direct (commande GM /level): aligne l'XP cumulé sur la courbe
   * officielle, accorde les points de stats manquants et recalcul les maxima.
   */
  setLevel(target: number): void {
    const n = Math.max(1, Math.min(140, Math.floor(target)));
    const oldLevel = this.level;
    this.level = n;
    this.exp = cumulativeXpForLevel(n);
    // 3 points de stats par niveau franchi (comme levelUp)
    if (n > oldLevel) this.statPoints += 3 * (n - oldLevel);
    // Base niveau 1 (200 HP / 100 MP au CharacterManager) + 20/10 par niveau,
    // + bonus de stats déjà réparties (20 HP/STR, 15 MP/INT)
    this.maxHp = 200 + (n - 1) * 20 + (this.str - 20) * 20;
    this.maxMp = 100 + (n - 1) * 10 + (this.int - 20) * 15;
    this.hp = this.maxHp;
    this.mp = this.maxMp;
    this.stats = this.calculateStats();
    this.emit('levelUp', { entityId: this.id, oldLevel, newLevel: n });
  }

  /**
   * Get exp needed for a level
   */
  private getExpNeededForLevel(level: number): number {
    // Courbe OFFICIELLE (leveldata.txt du client): seuil cumulé pour
    // atteindre ce niveau. L'XP du perso est cumulative.
    return cumulativeXpForLevel(level);
  }

  /**
   * Regenerate HP/MP
   * @param deltaTime en SECONDES (le tick serveur fournit des secondes)
   */
  private regenerate(deltaTime: number): void {
    if (this.state === EntityState.DEAD || this.state === EntityState.RESPawning) {
      return;
    }

    // HP regen: 1% per 10 seconds
    const hpRegenRate = this.maxHp * 0.001; // per second
    if (this.hp < this.maxHp) {
      this.hpRegenAccumulator += hpRegenRate * deltaTime;
      if (this.hpRegenAccumulator >= 1) {
        const regen = Math.floor(this.hpRegenAccumulator);
        this.hpRegenAccumulator -= regen;
        this.setHp(Math.min(this.maxHp, this.hp + regen));
      }
    } else {
      this.hpRegenAccumulator = 0;
    }

    // MP regen: 1% per 5 seconds
    const mpRegenRate = this.maxMp * 0.002; // per second
    if (this.mp < this.maxMp) {
      this.mpRegenAccumulator += mpRegenRate * deltaTime;
      if (this.mpRegenAccumulator >= 1) {
        const regen = Math.floor(this.mpRegenAccumulator);
        this.mpRegenAccumulator -= regen;
        this.setMp(Math.min(this.maxMp, this.mp + regen));
      }
    } else {
      this.mpRegenAccumulator = 0;
    }
  }

  /**
   * Calculate combat stats
   */
  private calculateStats(): PlayerEntity['stats'] {
    // Base stats from STR/INT. Défense de base quasi-nulle sans équipement
    // (officiel: defense = armure + renforts — un perso nu encaisse presque
    // tout) [APROX: courbe ≈ niveau + 10% de la stat].
    const baseAttack = Math.floor(this.str * 1.5);
    const baseMagicAttack = Math.floor(this.int * 1.5);
    const baseDefense = this.level + Math.floor(this.str * 0.1);
    const baseMagicDefense = this.level + Math.floor(this.int * 0.1);

    // Level-based bonuses (attaque)
    const levelBonus = this.level * 2;

    return {
      attackPower: {
        min: baseAttack + levelBonus,
        max: baseAttack + levelBonus + 10,
      },
      magicalAttackPower: {
        min: baseMagicAttack + levelBonus,
        max: baseMagicAttack + levelBonus + 10,
      },
      defense: baseDefense,
      magicalDefense: baseMagicDefense,
      parryRatio: Math.min(50, 5 + this.level),
      blockRatio: Math.min(40, this.level),
      criticalChance: Math.min(30, 3 + this.level * 0.5),
      attackRating: this.level * 10,
    };
  }

  /**
   * Handle death
   */
  private handleDeath(): void {
    logger.info(`Player died: ${this.name}`, { level: this.level, position: this.position });

    // Death penalty: lose 3% exp
    const expPenalty = Math.floor(this.exp * 0.03);
    this.exp = Math.max(0, this.exp - expPenalty);

    this.emit('death', { entityId: this.id, expPenalty });
  }

  /**
   * Respawn
   */
  respawn(position: Position): void {
    this.hp = this.maxHp;
    this.mp = this.maxMp;
    this.setPosition(position);
    this.setState(EntityState.IDLE);

    logger.info(`Player respawned: ${this.name}`, { position });

    this.emit('respawn', { entityId: this.id, position });
  }

  /**
   * Start auto-save
   */
  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(async () => {
      await this.saveToDatabase();
    }, this.AUTO_SAVE_INTERVAL);
  }

  /**
   * Stop auto-save
   */
  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Save to database
   */
  async saveToDatabase(): Promise<void> {
    try {
      await prisma.character.update({
        where: { id: this.id },
        data: {
          level: this.level,
          exp: BigInt(this.exp),
          sp: BigInt(this.sp),
          hp: this.hp,
          mp: this.mp,
          maxHp: this.maxHp,
          maxMp: this.maxMp,
          str: this.str,
          int: this.int,
          positionX: this.position.x,
          positionY: this.position.y,
          positionZ: this.position.z,
          rotation: this.rotation,
          gold: BigInt(this.gold),
          skillPoints: this.skillPoints,
          statPoints: this.statPoints,
          isOnline: true,
        },
      });

      logger.debug(`Player saved to database: ${this.name}`);
    } catch (error) {
      logger.error(`Failed to save player to database: ${this.name}`, error);
    }
  }

  /**
   * Serialize for network
   */
  serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      race: this.race,
      hp: this.hp,
      maxHp: this.maxHp,
      mp: this.mp,
      maxMp: this.maxMp,
      gold: this.gold,
      stats: this.stats,
    };
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.stopAutoSave();
    super.destroy();
  }
}

/**
 * Create a PlayerEntity from database character
 * `zoneId` is provided by the server-side character record
 */
export async function createPlayerEntityFromDb(
  character: SharedCharacter & { zoneId: string; skillPoints?: number }
): Promise<PlayerEntity> {
  return new PlayerEntity({
    id: character.id,
    name: character.name,
    accountId: character.accountId,
    race: character.race,
    level: character.level,
    exp: character.exp,
    sp: character.sp,
    hp: character.hp,
    maxHp: character.maxHp,
    mp: character.mp,
    maxMp: character.maxMp,
    str: character.stats.str,
    int: character.stats.int,
    position: character.position,
    rotation: character.rotation,
    gold: character.gold,
    zoneId: character.zoneId,
    modelId: 'char_chinese_male', // Default model
    skillPoints: character.skillPoints ?? 0,
    statPoints: character.statPoints,
  });
}
