// ============================================
// CHARACTER TYPES
// ============================================

export enum CharacterRace {
  CHINESE = 'chinese',
  EUROPEAN = 'european'
}

export interface CharacterStats {
  str: number;  // Strength
  int: number;  // Intelligence
}

export interface Character {
  id: string;
  accountId: string;
  name: string;
  race: CharacterRace;
  level: number;
  exp: number;
  sp: number;
  hp: number;
  mp: number;
  maxHp: number;
  maxMp: number;
  stats: CharacterStats;
  statPoints: number;  // Available stat points to allocate
  masteries: Mastery[];
  equipment: EquipmentSlot[];
  inventory: InventoryItem[];
  skills: Skill[];
  position: Position;
  rotation: number;
  gold: number;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Mastery {
  id: string;
  name: string;
  level: number; // Max 80 for Chinese, 60 for European
}

// ============================================
// SKILL TYPES
// ============================================

export type SkillType = 'passive' | 'active' | 'buff' | 'debuff';

export type Element =
  | 'physical'
  | 'fire'
  | 'cold'
  | 'lightning'
  | 'force';

export interface Skill {
  id: string;
  masteryId: string;
  name: string;
  type: SkillType;
  level: number;
  element?: Element;
  damage: number;
  mpCost: number;
  castTime: number; // in milliseconds
  cooldown: number; // in milliseconds
  range: number;
  requiredLevel: number;
  requiredMasteryLevel: number;
}

// ============================================
// EQUIPMENT TYPES
// ============================================

export type EquipmentSlotType =
  | 'weapon'
  | 'shield'
  | 'helmet'
  | 'chest'
  | 'shoulder'
  | 'legs'
  | 'boots'
  | 'ring1'
  | 'ring2'
  | 'necklace'
  | 'earring1'
  | 'earring2';

export type ItemRarity = 'common' | 'rare' | 'legendary' | 'unique';

export type ItemType =
  | 'weapon'
  | 'shield'
  | 'helmet'
  | 'chest'
  | 'shoulder'
  | 'legs'
  | 'boots'
  | 'ring'
  | 'necklace'
  | 'earring'
  | 'potion'
  | 'skill'
  | 'material'
  | 'quest';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  requiredLevel: number;
  requiredStats?: Partial<CharacterStats>;
  stats?: Partial<CharacterStats>;
  price: number;
  stackable: boolean;
  maxStack: number;
}

export interface EquipmentSlot {
  slot: EquipmentSlotType;
  item: Item & {
    plus: number; // +1 to +12
    durability: number;
    maxDurability: number;
  };
}

export interface InventoryItem {
  id: string;
  item: Item & {
    plus?: number;
    durability?: number;
    maxDurability?: number;
    quantity?: number;
  };
  slot: number;
}

// ============================================
// POSITION & MOVEMENT
// ============================================

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface MovementState {
  position: Position;
  rotation: number;
  velocity: { x: number; y: number; z: number };
  isMoving: boolean;
  isRunning: boolean;
  timestamp: number;
}

// ============================================
// COMBAT TYPES
// ============================================

export type DamageType = 'physical' | 'magical';

export interface CombatStats {
  attackPower: { min: number; max: number };
  magicalAttackPower: { min: number; max: number };
  defense: number;
  magicalDefense: number;
  parryRatio: number;
  blockRatio: number;
  criticalChance: number;
  attackRating: number;
}

export interface DamageResult {
  damage: number;
  type: DamageType;
  isCritical: boolean;
  isBlocked: boolean;
  targetHp: number;
  targetMp?: number;
}

// ============================================
// JOB SYSTEM TYPES
// ============================================

export type JobType = 'trader' | 'thief' | 'hunter' | 'none';

export interface JobState {
  type: JobType;
  level: number;
  exp: number;
  contribution: number;
  starPoints?: number; // For traders
  transport?: Transport;
}

export interface Transport {
  id: string;
  type: 'one_star' | 'two_star' | 'three_star' | 'four_star' | 'five_star';
  hp: number;
  maxHp: number;
  position: Position;
  goods: TradeGood[];
}

export interface TradeGood {
  itemId: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  sourceCity: string;
  destinationCity: string;
}

// ============================================
// NETWORK TYPES
// ============================================

export type PacketType =
  | 'connect'
  | 'disconnect'
  | 'login'
  | 'logout'
  | 'move'
  | 'attack'
  | 'cast_skill'
  | 'damage'
  | 'chat'
  | 'interact'
  | 'spawn'
  | 'despawn'
  | 'update'
  | 'party_invite'
  | 'party_accept'
  | 'party_leave'
  | 'job_change'
  // Priority 1 packets
  | 'hotkey_use'
  | 'hotkey_bind'
  | 'hotkey_bind_response'
  | 'pickup_item'
  | 'pickup_all'
  | 'pickup_success'
  | 'pickup_failed'
  | 'pickup_all_response'
  | 'minimap_request'
  | 'minimap_update'
  | 'casting_start'
  | 'casting_interrupt'
  | 'casting_complete'
  | 'xp_gain'
  | 'sp_gain'
  | 'level_up'
  | 'drop_item'
  | 'remove_dropped_item'
  // Phase B V2: monde complet
  | 'unique:spawned'
  // Phase 2: combat complet
  | 'skill_rejected'
  | 'player:death'
  | 'player:respawned'
  | 'player:state'
  | 'player:respawn';

export interface BasePacket {
  type: PacketType;
  timestamp: number;
}

export interface C2SPacket extends BasePacket {
  playerId?: string;
  data: unknown;
}

export interface S2CPacket extends BasePacket {
  data: unknown;
}

// Movement packet
export interface MovePacket extends C2SPacket {
  type: 'move';
  data: {
    position: Position;
    rotation: number;
    isRunning: boolean;
  };
}

// Attack packet
export interface AttackPacket extends C2SPacket {
  type: 'attack' | 'cast_skill';
  data: {
    targetId: string;
    skillId?: string;
  };
}

// Chat packet
export interface ChatPacket extends C2SPacket {
  type: 'chat';
  data: {
    message: string;
    channel: 'general' | 'whisper' | 'party' | 'guild' | 'global';
    targetId?: string;
  };
}

// ============================================
// ENTITY TYPES
// ============================================

export enum EntityType {
  PLAYER = 'CHARACTER',
  NPC = 'NPC',
  MONSTER = 'MONSTER',
  TRANSPORT = 'TRANSPORT'
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  level: number;
  position: Position;
  rotation: number;
  modelId: string;
}

export interface Monster extends Entity {
  type: EntityType.MONSTER;
  hp: number;
  maxHp: number;
  attackPower: { min: number; max: number };
  defense: number;
  exp: number;
  sp: number;
  aggroRange: number;
  respawnTime: number; // in seconds
  drops: DropTable[];
}

export interface DropTable {
  itemId: string;
  chance: number; // 0-1
  quantity: { min: number; max: number };
}

export interface NPC extends Entity {
  type: EntityType.NPC;
  npcType: 'shop' | 'storage' | 'stable' | 'quest' | 'teleport';
  dialogue?: string[];
  shopItems?: string[];
}

// ============================================
// WORLD TYPES
// ============================================

export interface Zone {
  id: string;
  name: string;
  levelRange: { min: number; max: number };
  size: { width: number; height: number };
  spawnPoints: SpawnPoint[];
  npcs: NPC[];
  monsters: MonsterSpawn[];
  teleportPoints: TeleportPoint[];
}

export interface SpawnPoint {
  position: Position;
  rotation: number;
}

export interface MonsterSpawn {
  monsterId: string;
  position: Position;
  rotation: number;
  respawnTime: number;
  maxCount: number;
}

export interface TeleportPoint {
  id: string;
  name: string;
  position: Position;
  destinationZoneId: string;
  destinationPosition: Position;
  cost: number;
}

// ============================================
// PARTY & GUILD TYPES
// ============================================

export interface Party {
  id: string;
  leaderId: string;
  members: PartyMember[];
  experienceSharing: 'equal' | 'level';
  itemDistribution: 'freeforall' | 'sequential' | 'random';
  createdAt: Date;
}

export interface PartyMember {
  playerId: string;
  characterName: string;
  level: number;
  joinedAt: Date;
}

export interface Guild {
  id: string;
  name: string;
  leaderId: string;
  level: number;
  exp: number;
  members: GuildMember[];
  notice: string;
  createdAt: Date;
}

export interface GuildMember {
  playerId: string;
  characterName: string;
  rank: GuildRank;
  joinedAt: Date;
  contribution: number;
}

export type GuildRank =
  | 'leader'
  | 'assistant'
  | 'senior'
  | 'member'
  | 'junior';

// ============================================
// STATUS EFFECT TYPES
// ============================================

export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'dot' | 'hot' | 'stun' | 'knockback' | 'knockdown';
  duration: number; // in milliseconds
  remainingTime: number;
  value?: number;
  sourceId?: string;
}

// ============================================
// ALCHEMY TYPES
// ============================================

export type ElixirType = 'weapon' | 'armor' | 'accessory';
export type LuckyPowderGrade = 'A' | 'B' | 'C' | null;

export interface AlchemyResult {
  success: boolean;
  critical: boolean;  // +2 instead of +1
  destroyed: boolean;
  oldPlus: number;
  newPlus: number;
  probability: {
    baseSuccessRate: number;
    finalSuccessRate: number;
    criticalRate: number;
    destructionRate: number;
  };
}

export interface AlchemyOptions {
  luckyPowder?: LuckyPowderGrade;
  protector?: boolean;  // Tablet/Stone
  elixirType: ElixirType;
}

// ============================================
// ALCHEMY PROBABILITY RATES
// ============================================

export const ALCHEMY_RATES = {
  WEAPON: {
    1: 1.00, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00,
    6: 0.60, 7: 0.50, 8: 0.40, 9: 0.30,
    10: 0.20, 11: 0.10, 12: 0.05
  },
  ARMOR: {
    1: 1.00, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00,
    6: 0.70, 7: 0.60, 8: 0.50, 9: 0.40,
    10: 0.20, 11: 0.10, 12: 0.05
  },
  ACCESSORY: {
    1: 1.00, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00,
    6: 0.65, 7: 0.55, 8: 0.45, 9: 0.35,
    10: 0.20, 11: 0.10, 12: 0.05
  }
} as const;

export const LUCKY_POWDER_BONUS = {
  'C': 0.05,  // +5%
  'B': 0.10,  // +10%
  'A': 0.15   // +15%
} as const;

export const CRITICAL_RATE = 0.05; // 5%

// ============================================
// PK/PVP TYPES
// ============================================

export type MurdererLevel = 0 | 1 | 2 | 3 | 4;

export interface PKStatus {
  pkPoints: number;
  murdererLevel: MurdererLevel;
  penaltyExp: number;
  penaltyTimer: number;  // seconds
  lastKillAt?: Date;
}

export const PK_THRESHOLDS = {
  NORMAL: 0,          // White name
  MURDERER_1: 100,    // Blue name
  MURDERER_2: 500,    // Purple name
  MURDERER_3: 1000,   // Red name
  MURDERER_4: 2000    // Dark red name
} as const;

export const PK_PENALTIES = {
  0: { teleportBlock: false, npcBlock: false, dropRate: 0 },
  1: { teleportBlock: false, npcBlock: false, dropRate: 0.05 },
  2: { teleportBlock: true, npcBlock: true, dropRate: 0.10 },
  3: { teleportBlock: true, npcBlock: true, dropRate: 0.25 },
  4: { teleportBlock: true, npcBlock: true, dropRate: 0.50 }
} as const;

// ============================================
// STALL NETWORK TYPES
// ============================================

export interface Stall {
  id: string;
  characterId: string;
  characterName: string;
  title: string;
  zoneId: string;
  position: { x: number; y: number; z: number };
  isOpen: boolean;
  items: StallItem[];
}

export interface StallItem {
  inventoryItemId: string;
  price: number;
  item: Item & { plus: number };
}

// ============================================
// SOCKET SYSTEM TYPES
// ============================================

export type SocketType =
  | 'attack_fire'
  | 'attack_cold'
  | 'attack_lightning'
  | 'defense_fire'
  | 'defense_cold'
  | 'hp'
  | 'mp'
  | 'str'
  | 'int'
  | 'critical'
  | 'parry'
  | 'block';

export interface Socket {
  type: SocketType;
  value: number;
}

export const SOCKET_COUNT_BY_DEGREE = {
  9: 1,
  10: 2,
  11: 2,
  12: 2,
  13: 3
} as const;

// ============================================
// ACCOUNT TYPES
// ============================================

export interface Account {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  characters: string[]; // Character IDs
  createdAt: Date;
  lastLoginAt: Date;
  isBanned: boolean;
  banReason?: string;
  banUntil?: Date;
}

// ============================================
// QUEST TYPES
// ============================================

export type QuestType =
  | 'tutorial'
  | 'collection'
  | 'hunting'
  | 'delivery'
  | 'daily'
  | 'story'
  | 'chain';

export type QuestStatus = 'available' | 'in_progress' | 'completed' | 'failed';

export type ObjectiveType = 'kill' | 'collect' | 'talk' | 'reach' | 'use';

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  minLevel: number;
  maxLevel?: number;
  prerequisite?: string[]; // Quest IDs
  objectives: QuestObjective[];
  rewards: QuestReward;
  startsAt: string[]; // NPC IDs
  endsAt: string[]; // NPC IDs
  canRepeat: boolean;
  repeatCooldown?: number; // seconds
  timeLimit?: number; // seconds
}

export interface QuestObjective {
  type: ObjectiveType;
  targetId: string;
  targetName: string;
  count: number;
  description?: string;
}

export interface QuestReward {
  exp: bigint;
  sp?: bigint;
  gold: bigint;
  items?: QuestRewardItem[];
}

export interface QuestRewardItem {
  itemId: string;
  name: string;
  quantity: number;
  plus?: number;
}

export interface QuestProgress {
  id: string;
  characterId: string;
  questId: string;
  status: QuestStatus;
  progress: Record<string, number>; // objectiveIndex: currentCount
  startedAt: Date;
  completedAt?: Date;
  canRepeatAt?: Date;
}

// ============================================
// FORTRESS TYPES
// ============================================

export type FortressState = 'peace' | 'registration' | 'preparation' | 'active' | 'ended';

export interface Fortress {
  id: string;
  name: string;
  level: number; // 1, 3, or 5
  ownerGuildId?: string;
  taxRate: number; // -20 to +20 percent
  nextWarTime: Date;
  warDuration: number; // minutes
  registrationDay: string; // "Saturday"
  registrationHour: number; // 18 = 6 PM
  state: FortressState;
  createdAt: Date;
}

export interface FortressRegistration {
  id: string;
  fortressId: string;
  guildId: string;
  registeredAt: Date;
}

export interface FortressHistory {
  id: string;
  fortressId: string;
  winnerGuildId: string;
  warDate: Date;
  duration: number; // minutes
}

// ============================================
// GUILD STORAGE & UNION TYPES
// ============================================

export interface GuildStorage {
  id: string;
  guildId: string;
  gold: bigint;
  items: GuildStorageItem[];
  lastAccess: Date;
}

export interface GuildStorageItem {
  itemId: string;
  name: string;
  quantity: number;
  slot: number;
  rarity?: string;
  plus?: number;
}

export interface Union {
  id: string;
  name: string;
  leaderGuildId: string;
  guildIds: string[]; // Max 8 guilds
  createdAt: Date;
}

// ============================================
// MOUNT & PET TYPES
// ============================================

export type MountType = 'horse_a' | 'horse_b' | 'horse_c';

export interface Mount {
  id: string;
  characterId: string;
  mountType: MountType;
  level: number; // 1-35
  exp: bigint;
  hp: number;
  maxHp: number;
  hunger: number; // 0-100
  isActive: boolean;
  summonedAt?: Date;
  inventory: MountInventory[];
}

export interface MountInventory {
  id: string;
  mountId: string;
  itemId: string;
  name: string;
  quantity: number;
  slot: number;
}

export type PetType = 'wolf' | 'raven' | 'bear' | 'fox';

export interface Pet {
  id: string;
  characterId: string;
  petType: PetType;
  level: number;
  exp: bigint;
  hp: number;
  maxHp: number;
  name: string;
  isSummoned: boolean;
  skills: string[]; // Skill IDs
}

// ============================================
// EXTENDED SKILL TYPES (European)
// ============================================

export type MasteryTree =
  // Chinese
  | 'bicheon'
  | 'heuksal'
  | 'pacheon'
  | 'fire_force'
  | 'cold_force'
  | 'lightning_force'
  | 'force_force'
  // European
  | 'warrior_2h'
  | 'warrior_1h'
  | 'warrior_defense'
  | 'rogue_dagger'
  | 'rogue_crossbow'
  | 'rogue_stealth'
  | 'wizard_fire'
  | 'wizard_ice'
  | 'wizard_lightning'
  | 'wizard_earth'
  | 'warlock_dot'
  | 'warlock_debuff'
  | 'cleric_heal'
  | 'cleric_buff'
  | 'bard_mana'
  | 'bard_speed';

export interface GameSkill {
  id: string;
  name: string;
  baseDamage: number;
  mpCost: number;
  castTime: number; // milliseconds
  cooldown: number; // milliseconds
  range: number;
  element: Element;
  type: SkillType;
  requiredLevel: number;
  requiredMasteryLevel: number;
  iconId?: string;
  description?: string;
}

// ============================================
// MINIMAP TYPES
// ============================================

export interface MinimapMarker {
  entityId: string;
  type: 'player' | 'npc' | 'monster' | 'party' | 'waypoint' | 'transport';
  position: { x: number; z: number };
  color?: string;
  icon?: string;
  name?: string;
  level?: number;
}

export interface MinimapConfig {
  size: number;
  range: number; // World units to display
  updateRate: number; // Hz
}

export interface MinimapUpdate {
  playerPosition: { x: number; z: number };
  markers: MinimapMarker[];
  zoneName: string;
}

// ============================================
// HOTKEY TYPES
// ============================================

export type HotkeySlotType = 'F1-F8' | '1-9' | 'ctrl_F1-F8' | 'alt_1-9';

export interface HotkeyBinding {
  slotIndex: number;
  slotType: HotkeySlotType;
  itemId?: string;
  skillId?: string;
}

export interface HotkeyData {
  bindings: HotkeyBinding[];
  characterId: string;
}

// ============================================
// DROP & PICKUP TYPES
// ============================================

export interface DroppedItem {
  id: string;
  itemId: string;
  itemData: Item & { plus: number; durability: number; quantity: number };
  position: Position;
  ownerId?: string;
  expiresAt: Date;
  droppedAt: Date;
}

export interface DropPickupOptions {
  autoPickup: boolean;
  lootFilter: {
    common: boolean;
    rare: boolean;
    legendary: boolean;
    unique: boolean;
  };
  pickupRange: number; // meters
}

// ============================================
// CASTING TYPES
// ============================================

export interface CastingState {
  isCasting: boolean;
  skillId?: string;
  skillName?: string;
  progress: number; // 0-1
  castTime: number; // milliseconds
  startTime: number;
  canBeInterrupted: boolean;
}

export interface CastingUpdate {
  entityId: string;
  casting: CastingState;
}

// ============================================
// TOOLTIP TYPES
// ============================================

export interface ItemTooltipData {
  name: string;
  rarity: ItemRarity;
  type: ItemType;
  requiredLevel: number;
  requiredStats?: Partial<CharacterStats>;
  stats?: {
    attackPower?: { min: number; max: number };
    magicalAttack?: { min: number; max: number };
    defense?: number;
    magicalDefense?: number;
    str?: number;
    int?: number;
    critical?: number;
    parry?: number;
    block?: number;
  };
  plus: number;
  durability: number;
  maxDurability: number;
  sockets: Socket[];
  price: number;
  description?: string;
}

export interface SkillTooltipData {
  name: string;
  level: number;
  type: SkillType;
  element?: Element;
  damage: number;
  mpCost: number;
  castTime: number;
  cooldown: number;
  range: number;
  description?: string;
  requiredLevel: number;
  requiredMasteryLevel: number;
}

export interface EntityTooltipData {
  name: string;
  level: number;
  type: EntityType;
  hp: number;
  maxHp: number;
  title?: string;
  guildName?: string;
  isAggressive?: boolean;
  isChampion?: boolean;
  isGiant?: boolean;
  isUnique?: boolean;
  pkStatus?: PKStatus;
}

export interface TooltipConfig {
  delay: number; // milliseconds before showing
  maxWidth: number;
  padding: number;
}

