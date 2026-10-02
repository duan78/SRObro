// ============================================
// SRObro - Auth Handlers
// Socket.IO handlers pour l'authentification et la gestion des personnages:
// register / login / logout / character:list / character:create / character:select
//
// RÈGLE: le compte authentifié vit sur le Client (token de session), le
// characterId sélectionné est TOUJOURS vérifié comme appartenant à ce compte.
// ============================================

import type { Socket } from 'socket.io';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import type { ClientManager } from './ClientManager';
import type { WorldManager } from '../game/WorldManager';

const logger = createLogger('AuthHandlers');

// Point d'apparition des nouveaux personnages: centre de Jangan (ville),
// aligné sur JANGAN_CONFIG.playerSpawnPoint du client (évite les bâtiments).
const NEW_CHARACTER_SPAWN = { x: 0, y: 0, z: 500 };

// Un compte ne peut pas avoir une armée de persos inutiles
const MAX_CHARACTERS_PER_ACCOUNT = 4;

const USERNAME_RE = /^[a-zA-Z0-9_]{3,16}$/;

// Coût SP pour amener une maîtrise AU niveau n (formule croissante classique
// 2n² — doc 26_SP_FARMING: coûts croissants, centaines/milliers en 70+).
function masterySpCost(level: number): number {
  return Math.max(1, 2 * level * level);
}
const PASSWORD_MIN = 4;
const CHARACTER_NAME_RE = /^[a-zA-Z0-9]{3,12}$/;

export class AuthHandlers {
  private clientManager: ClientManager;
  private worldManager: WorldManager | null = null;

  constructor(clientManager: ClientManager) {
    this.clientManager = clientManager;
  }

  setWorldManager(worldManager: WorldManager): void {
    this.worldManager = worldManager;
  }

  registerHandlers(socket: Socket): void {
    socket.on('auth:register', (data, ack) => this.handleRegister(data, ack));
    socket.on('auth:login', (data, ack) => this.handleLogin(socket, data, ack));
    socket.on('auth:resume', (data, ack) => this.handleResume(socket, data, ack));
    socket.on('auth:logout', (_data, ack) => this.handleLogout(socket, ack));
    socket.on('character:list', (_data, ack) => this.handleCharacterList(socket, ack));
    socket.on('character:create', (data, ack) => this.handleCharacterCreate(socket, data, ack));
    socket.on('character:select', (data, ack) => this.handleCharacterSelect(socket, data, ack));
    socket.on('character:delete', (data, ack) => this.handleCharacterDelete(socket, data, ack));
    socket.on('character:allocate', (data, ack) => this.handleCharacterAllocate(socket, data, ack));
    socket.on('character:masteries', (_d, ack) => this.handleMasteriesList(socket, ack));
    socket.on('mastery:levelup', (data, ack) => this.handleMasteryLevelUp(socket, data, ack));
  }

  /**
   * Masteries du personnage (arbre CH pour les chinois, EU pour les européens)
   * avec le coût SP du prochain niveau.
   */
  private async handleMasteriesList(socket: Socket, ack?: (r: any) => void): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const characterId = client?.getCharacterId();
      if (!characterId) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }
      const character = await prisma.character.findUnique({ where: { id: characterId } });
      if (!character) { this.ack(ack, { success: false, error: 'Perso introuvable' }); return; }

      const isChinese = character.race === 'chinese';
      const trees = isChinese
        ? ['BICHEON', 'HEUKSAL', 'PACHEON', 'FIRE', 'COLD', 'LIGHTNING', 'FORCE']
        : ['WARRIOR', 'ROGUE', 'WIZARD', 'WARLOCK', 'CLERIC', 'BARD'];
      const masteries = await prisma.mastery.findMany({ where: { tree: { in: trees as any[] } } });
      const mine = await prisma.characterMastery.findMany({ where: { characterId } });
      const byMastery = new Map(mine.map((m) => [m.masteryId, m.level]));

      const list = masteries.map((m) => {
        const level = byMastery.get(m.id) ?? 0;
        const nextCost = masterySpCost(level + 1);
        return {
          masteryId: m.id,
          name: m.name,
          tree: m.tree,
          level,
          nextCost,
          canUp: level < character.level && character.sp >= nextCost,
        };
      });
      this.ack(ack, { success: true, masteries: list, sp: Number(character.sp), level: character.level });
    } catch (error: any) {
      logger.error('Masteries list error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  /**
   * Monter une maîtrise d'un niveau (dépense de SP, cap = niveau du perso).
   */
  private async handleMasteryLevelUp(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const characterId = client?.getCharacterId();
      const player = this.worldManager?.getPlayer(characterId ?? '');
      if (!characterId || !player) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }

      const masteryId = String(data?.masteryId ?? '');
      const mastery = await prisma.mastery.findUnique({ where: { id: masteryId } });
      if (!mastery) { this.ack(ack, { success: false, error: 'Maîtrise inconnue' }); return; }

      const existing = await prisma.characterMastery.findUnique({
        where: { characterId_masteryId: { characterId, masteryId } },
      });
      const level = existing?.level ?? 0;
      if (level >= player.level) {
        this.ack(ack, { success: false, error: `Cap atteint (niveau ${player.level})` });
        return;
      }
      const cost = masterySpCost(level + 1);
      if (player.sp < cost) {
        this.ack(ack, { success: false, error: `SP insuffisants (${cost} requis)` });
        return;
      }

      player.sp -= cost;
      if (existing) {
        await prisma.characterMastery.update({
          where: { id: existing.id },
          data: { level: level + 1 },
        });
      } else {
        await prisma.characterMastery.create({
          data: { characterId, masteryId, level: 1 },
        });
      }
      // Miroir vers l'entité EN JEU: la map masteries alimente le GAP et les
      // formules officielles (sinon elle reste vide jusqu'à la reconnexion)
      const key = (mastery.name ?? '').toLowerCase().split(/[\s(]/)[0];
      player.masteries.set(key, level + 1);
      void player.saveToDatabase().catch(() => undefined);
      this.worldManager?.combatBridge?.sendPlayerState(characterId);
      this.ack(ack, { success: true, level: level + 1, spent: cost, sp: player.sp });
    } catch (error: any) {
      logger.error('Mastery levelup error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  /**
   * Répartition d'un point de statistique (STR/INT) — phase 4.
   */
  private async handleCharacterAllocate(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const characterId = client?.getCharacterId();
      if (!client || !characterId || !this.worldManager) {
        this.ack(ack, { success: false, error: 'Non authentifié' });
        return;
      }
      const stat = data?.stat === 'int' ? 'int' : data?.stat === 'str' ? 'str' : null;
      if (!stat) {
        this.ack(ack, { success: false, error: 'Stat invalide' });
        return;
      }
      const player = this.worldManager.getPlayer(characterId);
      if (!player) {
        this.ack(ack, { success: false, error: 'Joueur hors ligne' });
        return;
      }
      const ok = player.addStatPoint(stat);
      if (!ok) {
        this.ack(ack, { success: false, error: 'Aucun point disponible' });
        return;
      }
      // Persistance immédiate + état HUD
      void player.saveToDatabase().catch(() => undefined);
      this.worldManager.combatBridge?.sendPlayerState(characterId);
      this.ack(ack, {
        success: true,
        str: player.str,
        int: player.int,
        statPoints: player.statPoints,
        attackMin: player.stats.attackPower.min,
        attackMax: player.stats.attackPower.max,
      });
    } catch (error: any) {
      logger.error('Allocate error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  // ============================================
  // COMPTE
  // ============================================

  private async handleRegister(data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const username = String(data?.username ?? '').trim();
      const password = String(data?.password ?? '');

      if (!USERNAME_RE.test(username)) {
        this.ack(ack, { success: false, error: "Nom d'utilisateur invalide (3-16 caractères alphanumériques)" });
        return;
      }
      if (password.length < PASSWORD_MIN) {
        this.ack(ack, { success: false, error: `Mot de passe trop court (${PASSWORD_MIN} caractères min.)` });
        return;
      }

      const existing = await prisma.account.findUnique({ where: { username } });
      if (existing) {
        this.ack(ack, { success: false, error: "Nom d'utilisateur déjà pris" });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      // Le premier compte créé devient admin (owner) — il pourra promouvoir
      // les autres via /gm (suite admin, phase 6).
      const accountCount = await prisma.account.count();
      const role = accountCount === 0 ? 'admin' : 'player';

      const account = await prisma.account.create({
        data: {
          username,
          email: `${username.toLowerCase()}@local.srobro`, // email obligatoire en schéma, non utilisé
          passwordHash,
          role,
        },
      });

      logger.info(`Account registered: ${username} (role=${role})`);
      this.ack(ack, { success: true, account: { id: account.id, username: account.username, role } });
    } catch (error: any) {
      logger.error('Register error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur lors de la création du compte' });
    }
  }

  private async handleLogin(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const username = String(data?.username ?? '').trim();
      const password = String(data?.password ?? '');

      const account = await prisma.account.findUnique({ where: { username } });
      if (!account) {
        this.ack(ack, { success: false, error: 'Identifiants incorrects' });
        return;
      }

      const valid = await bcrypt.compare(password, account.passwordHash);
      if (!valid) {
        this.ack(ack, { success: false, error: 'Identifiants incorrects' });
        return;
      }

      if (account.isBanned) {
        const until = account.banUntil ? ` jusqu'au ${account.banUntil.toLocaleString('fr-FR')}` : '';
        this.ack(ack, { success: false, error: `Compte banni${until} : ${account.banReason ?? 'aucune raison'}` });
        return;
      }

      // Session en base (token transmis au client pour reconnexion auto)
      const token = randomUUID() + '.' + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
      await prisma.session.create({ data: { token, accountId: account.id, expiresAt } });
      await prisma.account.update({ where: { id: account.id }, data: { lastLoginAt: new Date() } });

      this.authenticateSocket(socket, account.id);

      logger.info(`Login OK: ${username}`);
      this.ack(ack, {
        success: true,
        token,
        account: { id: account.id, username: account.username, role: account.role },
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur lors de la connexion' });
    }
  }

  private async handleResume(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const token = String(data?.token ?? '');
      if (!token) {
        this.ack(ack, { success: false, error: 'Pas de token' });
        return;
      }
      const session = await prisma.session.findUnique({
        where: { token },
        include: { account: true },
      });
      if (!session || session.expiresAt < new Date()) {
        this.ack(ack, { success: false, error: 'Session expirée' });
        return;
      }
      if (session.account.isBanned) {
        this.ack(ack, { success: false, error: 'Compte banni' });
        return;
      }

      this.authenticateSocket(socket, session.accountId);
      this.ack(ack, {
        success: true,
        account: { id: session.account.id, username: session.account.username, role: session.account.role },
      });
    } catch (error: any) {
      logger.error('Resume error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  private handleLogout(socket: Socket, ack?: (r: any) => void): void {
    const client = this.clientManager.getClient(socket.id);
    const characterId = client?.getCharacterId();
    if (client && characterId && this.worldManager) {
      this.worldManager
        .handlePlayerLogout(client, characterId)
        .catch((err) => logger.error(`Logout cleanup failed for ${characterId}:`, err));
    }
    if (client) {
      client.clearAuthentication();
    }
    this.ack(ack, { success: true });
  }

  // ============================================
  // PERSONNAGES
  // ============================================

  private async handleCharacterList(socket: Socket, ack?: (r: any) => void): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const accountId = client?.getAccountId();
      if (!accountId) {
        this.ack(ack, { success: false, error: 'Non authentifié' });
        return;
      }

      const characters = await prisma.character.findMany({
        where: { accountId },
        orderBy: { lastLoginAt: 'desc' },
        select: {
          id: true, name: true, race: true, gender: true, level: true,
          exp: true, sp: true, gold: true, positionX: true, positionZ: true,
        },
      });

      this.ack(ack, {
        success: true,
        characters: characters.map((c) => ({
          id: c.id,
          name: c.name,
          race: c.race,
          gender: c.gender,
          level: c.level,
          exp: Number(c.exp),
          sp: Number(c.sp),
          gold: Number(c.gold),
          zone: 'Jangan',
        })),
      });
    } catch (error: any) {
      logger.error('Character list error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  private async handleCharacterCreate(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const accountId = client?.getAccountId();
      if (!accountId) {
        this.ack(ack, { success: false, error: 'Non authentifié' });
        return;
      }

      const name = String(data?.name ?? '').trim();
      const race = data?.race === 'european' ? 'european' : 'chinese';
      const gender = data?.gender === 'female' ? 'female' : 'male';

      if (!CHARACTER_NAME_RE.test(name)) {
        this.ack(ack, { success: false, error: 'Nom invalide (3-12 lettres/chiffres, sans accents)' });
        return;
      }

      const count = await prisma.character.count({ where: { accountId } });
      if (count >= MAX_CHARACTERS_PER_ACCOUNT) {
        this.ack(ack, { success: false, error: `Maximum ${MAX_CHARACTERS_PER_ACCOUNT} personnages par compte` });
        return;
      }

      const nameTaken = await prisma.character.findUnique({ where: { name } });
      if (nameTaken) {
        this.ack(ack, { success: false, error: 'Ce nom est déjà utilisé' });
        return;
      }

      const character = await prisma.character.create({
        data: {
          accountId,
          name,
          race,
          gender,
          level: 1,
          exp: 0n,
          sp: 0n,
          hp: 200,
          mp: 100,
          maxHp: 200,
          maxMp: 100,
          str: 20,
          int: 20,
          positionX: NEW_CHARACTER_SPAWN.x,
          positionY: NEW_CHARACTER_SPAWN.y,
          positionZ: NEW_CHARACTER_SPAWN.z,
          zoneId: 'zone_jangan',
          gold: 10000n,
        },
      });

      // Kit de départ (potions + lame degré 1) — items officiels
      const { ItemHandlers: IH } = await import('./ItemHandlers.js');
      await IH.giveStarterKit(character.id);

      // Skills de départ (Phase C): premières séries officielles de la race.
      // Le vrai apprentissage passe par la fenêtre Skills (SP + maîtrise,
      // données officielles) — ces skills ouvrent le gameplay immédiatement.
      const starterSkills = race === 'european'
        ? ['SKILL_EU_WARRIOR_ONEHANDA_STRIKE_A_01'] // Slash (Warrior, série A)
        : ['SKILL_CH_SWORD_SMASH_A_01', 'SKILL_CH_SWORD_SMASH_B_01', 'SKILL_CH_SWORD_CHAIN_A_1S_01'];
      // Les Mastery.id sont des UUID: résoudre l'id réel par l'arbre (la FK
      // Skill.masteryId rejette les ids symboliques — erreurs auparavant
      // silencieuses → persos sans skills de départ)
      const masteryTree = race === 'european' ? 'WARRIOR' : 'BICHEON';
      const masteryRow = await prisma.mastery.findFirst({ where: { tree: masteryTree } });
      if (masteryRow) {
        for (const code of starterSkills) {
          await prisma.skill.upsert({
            where: { id: code },
            update: {},
            create: {
              id: code,
              masteryId: masteryRow.id,
              name: code, type: 'active', level: 1,
            },
          });
          await prisma.characterSkill.create({
            data: { characterId: character.id, skillId: code, level: 1 },
          }).catch(() => undefined); // idempotent
        }
      }

      logger.info(`Character created: ${name} (${race}/${gender}) for account ${accountId}`);
      this.ack(ack, {
        success: true,
        character: {
          id: character.id, name: character.name, race: character.race,
          gender: character.gender, level: character.level,
          exp: 0, sp: 0, gold: 10000, zone: 'Jangan',
        },
      });
    } catch (error: any) {
      logger.error('Character create error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur lors de la création' });
    }
  }

  private async handleCharacterSelect(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const accountId = client?.getAccountId();
      if (!accountId) {
        this.ack(ack, { success: false, error: 'Non authentifié' });
        return;
      }

      const characterId = String(data?.characterId ?? '');
      const character = await prisma.character.findUnique({ where: { id: characterId } });
      if (!character || character.accountId !== accountId) {
        this.ack(ack, { success: false, error: 'Personnage introuvable' });
        return;
      }
      if (character.isOnline) {
        // Un doublon de connexion (autre onglet crashé) — on déconnecte l'ancien client
        const other = this.clientManager.getClientByCharacterId(characterId);
        if (other && other.getSocketId() !== socket.id) {
          try {
            await this.worldManager?.handlePlayerLogout(other, characterId);
          } catch { /* l'entité sera remplacée */ }
          other.clearAuthentication();
          other.send('auth:kicked', { reason: 'Connexion depuis un autre client' });
        }
      }

      await client!.loadCharacter(characterId);
      await this.worldManager?.handlePlayerLogin(client!, characterId);

      // Appliquer l'arme équipée aux stats de combat (si présente en base)
      try {
        const eq = await prisma.equipment.findUnique({ where: { characterId } });
        if (eq?.weapon) {
          const w = await prisma.item.findUnique({ where: { id: eq.weapon } });
          if (w) {
            this.worldManager?.getPlayer(characterId)?.applyWeaponStats({
              attackMin: w.attackPowerMin,
              attackMax: w.attackPowerMax,
            });
          }
        }
      } catch { /* non bloquant */ }

      // État complet du perso pour le client (spawn, HUD, progression locale)
      const payload = this.buildCharacterPayload(character);
      this.ack(ack, { success: true, character: payload });
      logger.info(`Character selected: ${character.name}`);
    } catch (error: any) {
      logger.error('Character select error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur lors de la sélection' });
    }
  }

  private async handleCharacterDelete(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const accountId = client?.getAccountId();
      if (!accountId) {
        this.ack(ack, { success: false, error: 'Non authentifié' });
        return;
      }
      const characterId = String(data?.characterId ?? '');
      const character = await prisma.character.findUnique({ where: { id: characterId } });
      if (!character || character.accountId !== accountId) {
        this.ack(ack, { success: false, error: 'Personnage introuvable' });
        return;
      }
      if (character.isOnline) {
        this.ack(ack, { success: false, error: 'Déconnectez-vous avant de supprimer' });
        return;
      }
      await prisma.character.delete({ where: { id: characterId } });
      logger.info(`Character deleted: ${character.name}`);
      this.ack(ack, { success: true });
    } catch (error: any) {
      logger.error('Character delete error:', error);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private authenticateSocket(socket: Socket, accountId: string): void {
    const client = this.clientManager.getClient(socket.id);
    if (client) {
      client.authenticateAccount(accountId);
    }
  }

  private buildCharacterPayload(character: {
    id: string; name: string; race: string; gender: string; level: number;
    exp: bigint; sp: bigint; hp: number; mp: number; maxHp: number; maxMp: number;
    str: number; int: number; statPoints: number; skillPoints: number;
    positionX: number; positionY: number; positionZ: number; rotation: number;
    gold: bigint; zoneId: string;
  }) {
    return {
      id: character.id,
      name: character.name,
      race: character.race,
      gender: character.gender,
      level: character.level,
      exp: Number(character.exp),
      sp: Number(character.sp),
      hp: character.hp,
      mp: character.mp,
      maxHp: character.maxHp,
      maxMp: character.maxMp,
      str: character.str,
      int: character.int,
      statPoints: character.statPoints,
      skillPoints: character.skillPoints,
      position: { x: character.positionX, y: character.positionY, z: character.positionZ },
      rotation: character.rotation,
      gold: Number(character.gold),
      zone: character.zoneId,
    };
  }

  private ack(ack: ((r: any) => void) | undefined, response: any): void {
    if (typeof ack === 'function') {
      ack(response);
    }
  }
}

export default AuthHandlers;
