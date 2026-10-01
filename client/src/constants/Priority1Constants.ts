/**
 * SRObro - Priority 1 Feature Constants
 *
 * Central configuration for all Priority 1 features
 */

// ============================================
// HOTKEY CONSTANTS
// ============================================

export const HOTKEY_CONFIG = {
  // Number of slots per row
  F1_F8_COUNT: 8,
  ONE_NINE_COUNT: 9,
  CTRL_F1_F8_COUNT: 8,
  ALT_ONE_NINE_COUNT: 9,

  // Total slots
  TOTAL_SLOTS: 34, // Note: Some overlap expected - actual unique is 27

  // Cooldown visualization
  COOLDOWN_OVERLAY_ALPHA: 0.7,
  COOLDOWN_TEXT_COLOR: '#FFFFFF',

  // Slot types
  SLOT_TYPES: {
    F1_F8: 'F1-F8',
    ONE_NINE: '1-9',
    CTRL_F1_F8: 'Ctrl+F1-F8',
    ALT_ONE_NINE: 'Alt+1-9'
  } as const
};

// Key codes for hotkeys
export const HOTKEY_KEYS = {
  // F1-F8
  'F1': { slotType: 'F1-F8', index: 0 },
  'F2': { slotType: 'F1-F8', index: 1 },
  'F3': { slotType: 'F1-F8', index: 2 },
  'F4': { slotType: 'F1-F8', index: 3 },
  'F5': { slotType: 'F1-F8', index: 4 },
  'F6': { slotType: 'F1-F8', index: 5 },
  'F7': { slotType: 'F1-F8', index: 6 },
  'F8': { slotType: 'F1-F8', index: 7 },

  // 1-9
  '1': { slotType: '1-9', index: 0 },
  '2': { slotType: '1-9', index: 1 },
  '3': { slotType: '1-9', index: 2 },
  '4': { slotType: '1-9', index: 3 },
  '5': { slotType: '1-9', index: 4 },
  '6': { slotType: '1-9', index: 5 },
  '7': { slotType: '1-9', index: 6 },
  '8': { slotType: '1-9', index: 7 },
  '9': { slotType: '1-9', index: 8 }
};

// ============================================
// MINIMAP CONSTANTS
// ============================================

export const MINIMAP_CONFIG = {
  // Size (pixels)
  SIZE: 200,

  // Display range (meters)
  RANGE: 200,

  // Update rate (Hz)
  UPDATE_RATE: 10, // 10 updates per second

  // Marker colors
  COLORS: {
    PLAYER: '#FFFFFF',      // White
    NPC: '#00FF00',         // Green
    MONSTER: '#FF0000',     // Red
    MONSTER_AGGRESSIVE: '#FF0000',
    MONSTER_PASSIVE: '#FFFF00',
    PARTY: '#00FFFF',       // Cyan
    TRANSPORT: '#FF8000',   // Orange
    UNIQUE: '#FF00FF',      // Magenta
    GIANT: '#FF4500',       // Orange-red
    CHAMPION: '#FF8C00'     // Dark orange
  },

  // Zoom levels (meters)
  ZOOM_LEVELS: [50, 75, 100, 150, 200, 250, 300, 400, 500, 600],

  // Default zoom level
  DEFAULT_ZOOM: 5
};

// ============================================
// XP/SP BAR CONSTANTS
// ============================================

export const XPSP_CONFIG = {
  // Bar dimensions
  WIDTH: 400,
  HEIGHT: 80,

  // Bar heights (pixels)
  BAR_HEIGHT: 12,
  BAR_SPACING: 6,

  // Colors
  XP_COLOR: '#FFD700',    // Gold/Yellow
  SP_COLOR: '#4169E1',    // Royal Blue
  BG_COLOR: 'rgba(30,30,30,0.9)',

  // Animation
  FLASH_DURATION: 200,     // milliseconds
  PULSE_DURATION: 500,     // milliseconds per iteration

  // Number formatting
  K_THRESHOLD: 1000,
  M_THRESHOLD: 1000000
};

// ============================================
// CASTING BAR CONSTANTS
// ============================================

export const CASTING_CONFIG = {
  // Dimensions (pixels)
  WIDTH: 250,
  HEIGHT: 40,

  // Progress bar
  BAR_HEIGHT: 12,

  // Colors (progress stages)
  COLOR_START: '#00FF00',     // Green
  COLOR_MID: '#FFFF00',       // Yellow
  COLOR_END: '#FF8C00',       // Orange
  COLOR_INTERRUPT: '#FF0000', // Red

  // Update rate
  UPDATE_RATE: 20,           // Hz (20 times per second)

  // Position
  TOP_OFFSET: -100,           // Pixels from center

  // Text
  FONT_SIZE_SKILL: 12,
  FONT_SIZE_TIME: 10
};

// ============================================
// DROP/PICKUP CONSTANTS
// ============================================

export const DROP_CONFIG = {
  // Pickup range (meters)
  PICKUP_RANGE: 3.0,

  // Default expiration (seconds)
  DEFAULT_DURATION: 300,      // 5 minutes

  // Owner protection (seconds)
  OWNER_PROTECTION: 30,       // 30 seconds

  // Item visualization
  ROTATION_SPEED: 1.0,        // Radians per second
  FLOAT_AMPLITUDE: 0.1,       // Meters
  FLOAT_FREQUENCY: 2.0,       // Hz

  // Cleanup interval (milliseconds)
  CLEANUP_INTERVAL: 60000     // Every minute
};

// Loot filter default settings
export const LOOT_FILTER_DEFAULT = {
  common: true,
  rare: true,
  legendary: true,
  unique: true
};

// ============================================
// TOOLTIP CONSTANTS
// ============================================

export const TOOLTIP_CONFIG = {
  // Delay before showing (milliseconds)
  DELAY: 300,

  // Dimensions
  MAX_WIDTH: 300,
  PADDING: 10,

  // Colors by rarity
  RARITY_COLORS: {
    common: '#FFFFFF',     // White
    rare: '#00FF00',        // Green
    legendary: '#0070DD',  // Blue
    unique: '#FF8000'       // Orange
  },

  // Type colors
  TYPE_COLORS: {
    weapon: '#FF0000',
    shield: '#FF0000',
    helmet: '#FF0000',
    chest: '#FF0000',
    shoulder: '#FF0000',
    legs: '#FF0000',
    boots: '#FF0000',
    ring: '#0070DD',
    necklace: '#0070DD',
    earring: '#0070DD',
    potion: '#FF8000',
    skill: '#800080',
    material: '#9D9D9D',
    quest: '#FFFF00'
  },

  // Element colors
  ELEMENT_COLORS: {
    physical: '#FFFFFF',
    fire: '#FF4500',
    cold: '#00BFFF',
    lightning: '#FFD700',
    force: '#00FF00'
  },

  // PK status colors
  PK_COLORS: {
    0: '#FFFFFF',   // Normal
    1: '#0000FF',   // Murderer 1 (Blue)
    2: '#800080',   // Murderer 2 (Purple)
    3: '#FF0000',   // Murderer 3 (Red)
    4: '#8B0000'    // Murderer 4 (Dark Red)
  }
};

// ============================================
// CHARACTER SETTINGS DEFAULTS
// ============================================

export const CHARACTER_SETTINGS_DEFAULTS = {
  autoPickup: false,
  lootFilter: LOOT_FILTER_DEFAULT,
  minimapZoom: 5,
  uiScale: 1.0,
  showTooltips: true,
  tooltipDelay: 300
};

// ============================================
// DATABASE SEED DEFAULTS
// ============================================

export const SEED_DEFAULTS = {
  // Default hotkey bindings for new characters
  DEFAULT_HOTKEYS: {
    // Slot 1 (number key 1): HP Potion
    ONE_NINE_0: {
      itemId: 'item_hp_potion_s',
      skillId: null
    },
    // F1: Basic Attack
    F1_F8_0: {
      itemId: null,
      skillId: 'skill_basic_attack'
    }
  },

  // Character settings
  CHARACTER_SETTINGS: CHARACTER_SETTINGS_DEFAULTS
};

// ============================================
// NETWORK PACKET TYPES
// ============================================

// C2S (Client → Server)
export const C2S_PACKETS = {
  HOTKEY_USE: 'hotkey_use',
  HOTKEY_BIND: 'hotkey_bind',
  PICKUP_ITEM: 'pickup_item',
  PICKUP_ALL: 'pickup_all',
  MINIMAP_REQUEST: 'minimap_request'
} as const;

// S2C (Server → Client)
export const S2C_PACKETS = {
  MINIMAP_UPDATE: 'minimap_update',
  CASTING_START: 'casting_start',
  CASTING_INTERRUPT: 'casting_interrupt',
  CASTING_COMPLETE: 'casting_complete',
  XP_GAIN: 'xp_gain',
  SP_GAIN: 'sp_gain',
  LEVEL_UP: 'level_up',
  DROP_ITEM: 'drop_item',
  REMOVE_DROPPED_ITEM: 'remove_dropped_item',
  PICKUP_SUCCESS: 'pickup_success',
  PICKUP_FAILED: 'pickup_failed',
  PICKUP_ALL_RESPONSE: 'pickup_all_response',
  HOTKEY_BIND_RESPONSE: 'hotkey_bind_response'
} as const;

// ============================================
// KEYBOARD EVENT MAPPINGS
// ============================================

export const KEYBOARD_MAPPINGS = {
  // Function keys
  'F1': { slotType: 'F1-F8', index: 0 },
  'F2': { slotType: 'F1-F8', index: 1 },
  'F3': { slotType: 'F1-F8', index: 2 },
  'F4': { slotType: 'F1-F8', index: 3 },
  'F5': { slotType: 'F1-F8', index: 4 },
  'F6': { slotType: 'F1-F8', index: 5 },
  'F7': { slotType: 'F1-F8', index: 6 },
  'F8': { slotType: 'F1-F8', index: 7 },

  // Number keys
  'Digit1': { slotType: '1-9', index: 0 },
  'Digit2': { slotType: '1-9', index: 1 },
  'Digit3': { slotType: '1-9', index: 2 },
  'Digit4': { slotType: '1-9', index: 3 },
  'Digit5': { slotType: '1-9', index: 4 },
  'Digit6': { slotType: '1-9', index: 5 },
  'Digit7': { slotType: '1-9', index: 6 },
  'Digit8': { slotType: '1-9', index: 7 },
  'Digit9': { slotType: '1-9', index: 8 },

  // Space for pickup
  'Space': 'pickup_all'
} as const;

// ============================================
// UI COLORS (SRO Style)
// ============================================

export const UI_COLORS = {
  // Primary
  PRIMARY: '#4a3728',           // Dark brown
  SECONDARY: '#6B5344',         // Light brown
  ACCENT: '#FFD700',             // Gold

  // Status
  HP: '#FF0000',                 // Red
  MP: '#0000FF',                 // Blue
  XP: '#FFFF00',                 // Yellow
  SP: '#4169E1',                 // Royal blue

  // Rarity
  COMMON: '#FFFFFF',             // White
  RARE: '#00FF00',               // Green
  LEGENDARY: '#0070DD',          // Blue
  UNIQUE: '#FF8000',              // Orange

  // Elements
  PHYSICAL: '#FFFFFF',
  FIRE: '#FF4500',
  COLD: '#00BFFF',
  LIGHTNING: '#FFD700',
  FORCE: '#00FF00'
};

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION = {
  HOTKEY: {
    MAX_BINDINGS_PER_CHARACTER: 27, // Total unique slots
    SLOT_TYPE_VALID: ['F1-F8', '1-9', 'ctrl_F1-F8', 'alt_1-9'],
    MUST_BIND_ITEM_OR_SKILL: true,
    CANNOT_BIND_BOTH: true
  },

  DROP: {
    MIN_RANGE: 1,               // Minimum pickup range (meters)
    MAX_RANGE: 10,              // Maximum pickup range (meters)
    DEFAULT_DURATION: 300,     // Default expiration (seconds)
    MIN_DURATION: 10,          // Minimum expiration (seconds)
    MAX_DURATION: 3600,        // Maximum expiration (1 hour)
    OWNER_PROTECTION: 30       // Owner protection duration (seconds)
  },

  MINIMAP: {
    MIN_ZOOM: 1,                // Minimum zoom level (50m)
    MAX_ZOOM: 10,               // Maximum zoom level (500m)
    MIN_UPDATE_RATE: 1,         // Minimum update rate (1 Hz)
    MAX_UPDATE_RATE: 20,        // Maximum update rate (20 Hz)
    DEFAULT_UPDATE_RATE: 10     // Default update rate (10 Hz)
  },

  XPSP: {
    MIN_LEVEL: 1,
    MAX_LEVEL: 120,
    MAX_SP_PER_LEVEL: 1000000   // 1 million SP max
  }
};

export default {
  HOTKEY_CONFIG,
  MINIMAP_CONFIG,
  XPSP_CONFIG,
  CASTING_CONFIG,
  DROP_CONFIG,
  TOOLTIP_CONFIG,
  CHARACTER_SETTINGS_DEFAULTS,
  SEED_DEFAULTS,
  C2S_PACKETS,
  S2C_PACKETS,
  KEYBOARD_MAPPINGS,
  UI_COLORS,
  VALIDATION
};
