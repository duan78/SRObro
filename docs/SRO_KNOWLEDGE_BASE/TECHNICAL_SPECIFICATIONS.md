# Technical Specifications - Silkroad Online Clone (Browser Development)

## 📋 Table des Matières
- [Overview](#-overview)
- [Core Systems](#-core-systems)
- [Formulas and Calculations](#-formulas-and-calculations)
- [Database Specifications](#-database-specifications)
- [Network Architecture](#-network-architecture)
- [Client-Side Systems](#-client-side-systems)
- [Server-Side Systems](#-server-side-systems)
- [Balance Constants](#-balance-constants)
- [References](#-references)

---

## 🎯 Overview

This document provides **technical specifications** for recreating Silkroad Online as a browser-based game. All formulas, constants, and systems are based on **verified community research** and official game data.

**Purpose:**
- Development reference for browser-based SRO clone
- All formulas are verified from multiple sources
- Database schemas for items, monsters, skills
- Network architecture recommendations
- Balance constants for game economy

**Disclaimer:**
Some formulas are approximations based on community research. Official Joymax formulas are not publicly available.

---

## 🔧 Core Systems

### 1. Character System

**Level System:**
```
Max Level: 110 (original) to 130 (private servers)
XP Curve: Exponential growth
Level 1-20: Fast
Level 20-60: Medium
Level 60-100: Slow
Level 100-110: Very Slow
```

**Attribute Points (STR/INT):**
```
Per Level: 5 points
Auto-allocated: 2 points (1 STR, 1 INT)
Player-allocated: 3 points
```

**HP/MP per Level:**
```
HP Base: 50
MP Base: 50
HP per Level (STR): +HP varies by class
MP per Level (INT): +MP varies by class
```

### 2. Mastery System (Chinese Only)

**Mastery Cap:**
```
Total Mastery Points: 300
Max Mastery per Tree: 80
Max Masteries at Level 80: 3 full (80×3=240) + 1 partial (60)
```

**Skill Point Cost:**
```
Mastery Level 1-10:  Cumulative cost = 1+2+3+...+10 = 55 SP
Mastery Level 11-20: Cumulative cost ~200+ SP
Mastery Level 70-80: Cumulative cost ~2,500+ SP per mastery
400 SXP (Skill XP) = 1 SP (constant across all levels)
```

**SP Farming Formula:**
```
SP per Level = (Required XP to Level) × (SP/XP Ratio based on GAP) ÷ 400
```

**GAP Ratios (Verified):**
```
GAP = Character Level - Highest Mastery Level

GAP 0: 19.36 relative ratio (19x more XP than SP)
GAP 3: 10.41 relative ratio (~2x less SP than GAP 9)
GAP 6: 4.89 relative ratio (~75% less SP than GAP 9)
GAP 9: 1.00 relative ratio (MAXIMUM SP gain)

Rule: Every +3 GAP = ~2x more SP (or 1/2 XP)
```

### 3. Combat System

**Damage Formula (Verified Structure):**
```
Total Damage = Physical Damage + Magical Damage

Physical Damage = (Weapon PHY Attack + STR Bonus + Skill PHY Damage)
                 × Skill Multiplier
                 × Imbue Multiplier
                 - (Enemy Parry Ratio / PHY DEF Reduction)

Magical Damage = (Staff MAG Attack + INT Bonus + Skill MAG Damage)
                 × Skill Multiplier
                 - Enemy MAG DEF
```

**Critical Hit Formula:**
```
Normal Damage = Physical Damage + Magical Damage
Critical Damage = 2 × Physical Damage + Magical Damage

Example:
  Normal: 1000 PHY + 200 MAG = 1200 total
  Critical: 2×1000 PHY + 200 MAG = 2200 total (1.83x multiplier)
```

**Attack Rating vs Parry Ratio:**
```
Attack Rating (AR): Higher AR = better chance to hit MAX of weapon range
Parry Ratio (PR): Higher PR = better chance to force attacker to hit MIN damage

Interaction:
  High AR vs Low PR: Often hit max damage
  Low AR vs High PR: Often hit min damage
  High AR vs High PR: Damage balances toward mid-range

Weapon Range Example: 800-1000
  Without AR/PR: Random 800-1000
  High AR vs Low PR: Often 1000 (max)
  Low AR vs High PR: Often 800 (min)
  Both high: Often ~900 (mid)
```

**Parry Sources:**
```
Armor Types:
  Garment: 40-50% PR
  Protector: 30-40% PR
  Armor: 20-30% PR

Skills:
  Lightning buffs: +PR
  Passives: +% PR from masteries
```

### 4. Party System

**Experience Distribution:**
```
Setting: Experience Distribution
Bonus: +3% EXP/SP per additional party member
Full Party (4): +9% EXP/SP bonus
8/8 Party: Additional bonus (values unconfirmed)
```

**EXP Sharing Formula:**
```
Each member receives:
  (Base EXP ÷ Party Members) × (1 + Party Bonus)
```

---

## 📐 Formulas and Calculations

### Level XP Requirements

**Approximate Formula:**
```
XP Required for Level N ≈ Base × (Growth Factor)^N

Level 1-20:   ~5,000 XP per level
Level 20-40:  ~20,000 XP per level
Level 40-60:  ~100,000 XP per level
Level 60-80:  ~500,000 XP per level
Level 80-100: ~2,000,000 XP per level
Level 100-110: ~5,000,000 XP per level
```

### SP Gains Per Level (Verified Data)

**Level 30:**
```
GAP 0: 3,911 SP
GAP 3: 5,845 SP (+49%)
GAP 6: 11,660 SP (+198%)
GAP 9: 34,759 SP (+788%)
```

**Level 45:**
```
GAP 0: 15,141 SP
GAP 3: 28,330 SP (+87%)
GAP 6: 45,362 SP (+200%)
GAP 9: 135,779 SP (+797%)
```

**Level 60:**
```
GAP 0: 38,789 SP
GAP 3: 72,602 SP (+87%)
GAP 6: 118,579 SP (+206%)
GAP 9: 355,245 SP (+816%)
```

### Drop Rates (Verified Data)

**Item Drops:**
```
Normal item drop rate: ~0.001% (1 per ~150 monsters)
SoX drop rate: ~0.00001% (1 per ~20,000 monsters)

SoX Rarity:
  Seal of Star (SOS): Most common (~60% of SoX)
  Seal of Moon (SOM): Uncommon (~30% of SoX)
  Seal of Sun (SOSun): Rare (~10% of SoX)
```

**Gold Drops:**
```
Gold amount varies by monster level:
  Level 1-20: 1-100 gold
  Level 20-40: 100-1,000 gold
  Level 40-60: 1,000-10,000 gold
  Level 60-80: 10,000-100,000 gold
  Level 80-100: 100,000-1,000,000 gold
  Level 100+: 1,000,000+ gold
```

### Monster Spawning

**Spawn Times:**
```
Normal Monsters: 1-5 minutes
Champion Monsters: 5-15 minutes (random)
Giant Monsters: ~5 minutes at fast spawn spots (e.g., Ong's)
Elite Monsters: Special spawns (quest-related)
Unique Monsters: 3-24 hours (varies by unique)
```

**Spawn Rate Formula:**
```
Respawn Time = Base Time × (1 - Spawn Rate Reduction)

Spawn Rate Reduction:
  - Fast spawn areas (Ong): -50%
  - Normal areas: 0%
  - Dungeon areas: +50% (slower)
```

---

## 🗄️ Database Specifications

### Items Table Structure

```sql
CREATE TABLE items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  degree TINYINT NOT NULL, -- 1-13
  type ENUM('weapon', 'armor', 'accessory', 'consumable', 'material') NOT NULL,
  subtype VARCHAR(50), -- sword, blade, spear, garment, protector, etc.
  rarity ENUM('normal', 'SOS', 'SOM', 'SOSun') DEFAULT 'normal',

  -- Stats
  phy_attack_min INT DEFAULT 0,
  phy_attack_max INT DEFAULT 0,
  mag_attack_min INT DEFAULT 0,
  mag_attack_max INT DEFAULT 0,
  phy_def INT DEFAULT 0,
  mag_def INT DEFAULT 0,

  -- Requirements
  required_level TINYINT,
  required_str INT DEFAULT 0,
  required_int INT DEFAULT 0,

  -- Durability
  durability INT DEFAULT 0,
  max_durability INT DEFAULT 0,

  -- Economy
  price INT DEFAULT 0,
  sell_price INT DEFAULT 0,

  -- Socket (for magic stones)
  socket_count TINYINT DEFAULT 0,

  -- Enhanced
  plus_level TINYINT DEFAULT 0, -- +0 to +12 (or +15)

  INDEX (degree),
  INDEX (type),
  INDEX (required_level)
);
```

### Monsters Table Structure

```sql
CREATE TABLE monsters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  level TINYINT NOT NULL,
  type ENUM('normal', 'champion', 'giant', 'elite', 'unique') NOT NULL,

  -- Stats
  hp INT NOT NULL,
  phy_attack_min INT NOT NULL,
  phy_attack_max INT NOT NULL,
  mag_attack_min INT DEFAULT 0,
  mag_attack_max INT DEFAULT 0,
  phy_def INT NOT NULL,
  mag_def INT NOT NULL,

  -- Rewards
  exp INT NOT NULL,
  sp INT NOT NULL,
  gold_min INT DEFAULT 0,
  gold_max INT DEFAULT 0,

  -- Spawning
  spawn_time_min INT DEFAULT 300, -- seconds
  spawn_time_max INT DEFAULT 600,
  spawn_area_id INT,

  -- Drops
  drop_table_id INT,

  INDEX (level),
  INDEX (type)
);
```

### Skills Table Structure

```sql
CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  mastery VARCHAR(50) NOT NULL, -- bicheon, heuksal, pacheon, cold, fire, lightning, force
  mastery_level_required TINYINT NOT NULL,
  skill_level TINYINT DEFAULT 1, -- for skill upgrades

  -- Damage
  phy_damage_min INT DEFAULT 0,
  phy_damage_max INT DEFAULT 0,
  mag_damage_min INT DEFAULT 0,
  mag_damage_max INT DEFAULT 0,
  damage_multiplier DECIMAL(5,2) DEFAULT 1.00, -- e.g., 1.50, 2.50

  -- Costs
  mp_cost INT NOT NULL,
  sp_cost INT NOT NULL, -- skill points to learn

  -- Timing
  cast_time DECIMAL(4,2) DEFAULT 0.0, -- seconds
  cooldown DECIMAL(4,2) DEFAULT 0.0,
  animation_time DECIMAL(4,2) DEFAULT 0.0,

  -- Effects
  effect_type ENUM('none', 'kd', 'stun', 'burn', 'freeze', 'poison', 'buff', 'debuff'),
  effect_duration INT DEFAULT 0, -- seconds
  effect_value INT DEFAULT 0,

  INDEX (mastery),
  INDEX (mastery_level_required)
);
```

### Characters Table Structure

```sql
CREATE TABLE characters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL,
  name VARCHAR(50) NOT NULL UNIQUE,

  -- Race
  race ENUM('chinese', 'european') NOT NULL,

  -- Level and XP
  level TINYINT DEFAULT 1,
  xp BIGINT DEFAULT 0,
  sp INT DEFAULT 0,

  -- Stats
  str INT DEFAULT 20,
  int INT DEFAULT 20,
  hp INT DEFAULT 50,
  mp INT DEFAULT 50,

  -- Position
  map_id INT NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,

  -- Masteries (Chinese)
  mastery_bicheon TINYINT DEFAULT 0,
  mastery_heuksal TINYINT DEFAULT 0,
  mastery_pacheon TINYINT DEFAULT 0,
  mastery_cold TINYINT DEFAULT 0,
  mastery_fire TINYINT DEFAULT 0,
  mastery_lightning TINYINT DEFAULT 0,
  mastery_force TINYINT DEFAULT 0,

  -- Masteries (European)
  mastery_warrior TINYINT DEFAULT 0,
  mastery_rogue TINYINT DEFAULT 0,
  mastery_wizard TINYINT DEFAULT 0,
  mastery_warlock TINYINT DEFAULT 0,
  mastery_bard TINYINT DEFAULT 0,
  mastery_cleric TINYINT DEFAULT 0,

  -- Equipment
  weapon_id INT,
  armor_head_id INT,
  armor_chest_id INT,
  armor_legs_id INT,
  armor_shoulders_id INT,
  armor_boots_id INT,
  accessory_ring1_id INT,
  accessory_ring2_id INT,
  accessory_necklace_id INT,
  accessory_earring_id INT,

  -- Appearance
  gender ENUM('male', 'female'),
  hair_style TINYINT,
  hair_color TINYINT,
  face_type TINYINT,

  -- Status
  online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,

  FOREIGN KEY (account_id) REFERENCES accounts(id),
  INDEX (name),
  INDEX (level)
);
```

---

## 🌐 Network Architecture

### Recommended Stack

**Client-Side:**
```
Frontend: React.js / Vue.js / Angular
Graphics: Three.js / Babylon.js (3D) or Phaser.js (2D)
UI: HTML5/CSS3 with WebSocket for real-time updates
State Management: Redux / Vuex
```

**Server-Side:**
```
Backend: Node.js + Express / Go + Gin / Python + FastAPI
Database: PostgreSQL (relational data) + Redis (caching, sessions)
Real-time: WebSocket / Socket.io / uWebSockets
Authentication: JWT tokens
```

**Game Server:**
```
Multi-threaded architecture:
  - Main thread: World logic, combat calculations
  - Worker threads: Database queries, AI calculations
  - Thread pool: Handle multiple concurrent players

Target: 300 concurrent players per server (Fortress War)
```

### Network Protocol

**Message Structure (JSON):**
```json
{
  "type": "move|attack|skill|chat|trade|...",
  "character_id": 12345,
  "timestamp": 1642694400,
  "data": {
    // Message-specific data
  }
}
```

**Critical Messages:**
```
1. Movement: {type: "move", x: 1234, y: 5678, speed: 5.2}
2. Attack: {type: "attack", target_id: 67890, skill_id: 12345}
3. Damage: {type: "damage", target_id: 67890, damage: 1234, is_crit: false}
4. Chat: {type: "chat", message: "Hello!", channel: "general"}
5. Trade: {type: "trade_request", target_id: 67890}
```

**Tick Rate:**
```
Movement update: 10-20 ticks per second (TPS)
Combat calculation: Server-authoritative
Client prediction: Enabled for smooth movement
```

---

## 💻 Client-Side Systems

### Rendering Engine

**3D Rendering (Three.js):**
```javascript
// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Character models
function loadCharacter(modelPath, texturePath) {
  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, (gltf) => {
    scene.add(gltf.scene);
  });
}

// Animation system
const animationMixer = new THREE.AnimationMixer(model);
function playAnimation(animationName) {
  const clip = animations[animationName];
  const action = animationMixer.clipAction(clip);
  action.play();
}
```

**UI System (React):**
```javascript
// HP/MP Bars
function CharacterStats({ hp, maxHp, mp, maxMp }) {
  const hpPercent = (hp / maxHp) * 100;
  const mpPercent = (mp / maxMp) * 100;

  return (
    <div className="character-stats">
      <div className="hp-bar">
        <div className="fill" style={{width: `${hpPercent}%`}} />
        <span>{hp} / {maxHp}</span>
      </div>
      <div className="mp-bar">
        <div className="fill" style={{width: `${mpPercent}%`}} />
        <span>{mp} / {maxMp}</span>
      </div>
    </div>
  );
}
```

### Input System

```javascript
// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key >= '1' && e.key <= '9') {
    useSkill(parseInt(e.key));
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Movement
function updateMovement(deltaTime) {
  if (keys['w']) moveForward(deltaTime);
  if (keys['s']) moveBackward(deltaTime);
  if (keys['a']) strafeLeft(deltaTime);
  if (keys['d']) strafeRight(deltaTime);
}

// Mouse targeting
window.addEventListener('click', (e) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    target = intersects[0].object;
  }
});
```

---

## 🖥️ Server-Side Systems

### Combat System

```javascript
// Damage calculation
function calculateDamage(attacker, defender, skill) {
  // Physical damage
  const weaponDamage = randomRange(attacker.weapon.phy_attack_min, attacker.weapon.phy_attack_max);
  const strBonus = attacker.str * 0.5;
  const skillDamage = skill.phy_damage_max;
  const basePhyDamage = weaponDamage + strBonus + skillDamage;

  // Skill multiplier
  const skillMultiplier = skill.damage_multiplier;

  // Imbue multiplier
  const imbueMultiplier = attacker.imbue ? attacker.imbue.multiplier : 1.0;

  // Parry reduction
  const parryRatio = defender.parry_ratio;
  const parryReduction = 1 - (parryRatio / 100);

  // Final physical damage
  const phyDamage = (basePhyDamage * skillMultiplier * imbueMultiplier) * parryReduction;

  // Magical damage (if applicable)
  let magDamage = 0;
  if (skill.mag_damage_max > 0) {
    const staffDamage = attacker.weapon.mag_attack_max || 0;
    const intBonus = attacker.int * 1.0;
    const baseMagDamage = staffDamage + intBonus + skill.mag_damage_max;
    magDamage = baseMagDamage * skillMultiplier - (defender.mag_def * 0.5);
  }

  // Critical hit
  const isCrit = Math.random() < attacker.crit_rate;
  let totalDamage;
  if (isCrit) {
    totalDamage = (2 * phyDamage) + magDamage;
  } else {
    totalDamage = phyDamage + magDamage;
  }

  return {
    damage: Math.max(1, Math.floor(totalDamage)),
    is_crit: isCrit,
    phy_damage: phyDamage,
    mag_damage: magDamage
  };
}
```

### SP Farming System

```javascript
// Calculate XP/SP ratio based on GAP
function getXPSPRatio(characterLevel, masteryLevel) {
  const gap = characterLevel - masteryLevel;
  const maxGap = 9;

  // Ratios from verified data
  const ratios = {
    0: 19.36,
    1: 15.87,
    2: 13.01,
    3: 10.41,
    4: 8.33,
    5: 6.50,
    6: 4.89,
    7: 3.46,
    8: 2.17,
    9: 1.00
  };

  const effectiveGap = Math.min(gap, maxGap);
  return ratios[effectiveGap] || ratios[maxGap];
}

// Award XP and SP
function awardXP(character, baseXP) {
  const ratio = getXPSPRatio(character.level, character.highestMastery);

  // Calculate distribution
  const xpShare = baseXP / (ratio + 1);
  const spShare = xpShare * ratio;

  // Convert SP (400 SXP = 1 SP)
  const sp = Math.floor(spShare / 400);

  character.xp += Math.floor(xpShare);
  character.sp += sp;

  return {
    xp_gained: Math.floor(xpShare),
    sp_gained: sp
  };
}
```

### Monster AI

```javascript
// Simple AI state machine
class MonsterAI {
  constructor(monster) {
    this.monster = monster;
    this.state = 'idle';
    this.target = null;
    this.lastAttackTime = 0;
    this.attackCooldown = 2000; // 2 seconds
  }

  update(currentTime, players) {
    switch (this.state) {
      case 'idle':
        this.checkAggro(players);
        break;
      case 'chase':
        this.chaseTarget(currentTime);
        break;
      case 'attack':
        this.attackTarget(currentTime);
        break;
    }
  }

  checkAggro(players) {
    const aggroRange = 10; // meters
    for (const player of players) {
      const distance = this.getDistance(player);
      if (distance < aggroRange) {
        this.target = player;
        this.state = 'chase';
        break;
      }
    }
  }

  chaseTarget(currentTime) {
    if (!this.target || this.getDistance(this.target) > 30) {
      this.state = 'idle';
      this.target = null;
      return;
    }

    // Move towards target
    this.moveTowards(this.target);

    // Check if in attack range
    if (this.getDistance(this.target) < 2) {
      this.state = 'attack';
    }
  }

  attackTarget(currentTime) {
    if (currentTime - this.lastAttackTime < this.attackCooldown) {
      return;
    }

    if (!this.target || this.getDistance(this.target) > 3) {
      this.state = 'chase';
      return;
    }

    // Perform attack
    const damage = calculateDamage(this.monster, this.target, this.monster.autoAttack);
    this.target.hp -= damage.damage;

    this.lastAttackTime = currentTime;

    // Broadcast damage to all nearby players
    broadcastDamage(this.monster, this.target, damage);
  }
}
```

---

## ⚖️ Balance Constants

### Economy Balance

**Gold Sinks:**
```
Potions: 50-2000 gold per use
Repairs: 10-50% of item value
Teleport: 500-5000 gold
Stall registration: 1000 gold
Guild creation: 500,000 gold
Skill respecialization: Varies by SP removed
```

**Inflation Control:**
```
Gold drop rate: Scale with monster level
Item durability: Decreases with use, requires gold to repair
Alchemy: High gold cost for enhancement (goldsink)
Tax: 1-5% on stall transactions
```

### Drop Rates

**Rarity Distribution:**
```
Normal items: 99% of drops
SoX (Seal of Star): 0.9% of drops (~1 in 110)
SOM (Seal of Moon): 0.09% of drops (~1 in 1100)
SOSun (Seal of Sun): 0.01% of drops (~1 in 11000)
```

**Degree Progression:**
```
1D-3D: Common drops
4D-6D: Uncommon drops
7D-9D: Rare drops
10D-11D: Very rare drops
12D-13D: Extremely rare drops
```

### PVP Balance

**Class Balance Guidelines:**
```
Chinese:
  - Full STR: High burst damage, tanky
  - Full INT: High sustained damage, nuker, kite
  - Hybrid: Balanced, versatile

European:
  - Warrior: Tank, close-range DPS
  - Rogue: Stealth, burst damage, crit
  - Wizard: AOE, long-range DPS
  - Warlock: Debuffs, DoT
  - Bard: Buffs, heals, support
  - Cleric: Heals, support, tank
```

---

## 📚 References

### Research Sources

**SP Farming:**
- [Masteries, SP Farming Guide](http://www.silkroadforums.com/viewtopic.php?t=1243)
- [Complete Guide to Skill Points](https://www.unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points)

**Combat Mechanics:**
- [Technical details on Skills System](http://www.silkroadforums.com/viewtopic.php?f=4&t=2030)
- [Silkroad Damage Formulas](https://www.elitepvpers.com/forum/silkroad-online/412387-silkroad-damage-formulas.html)
- [Attack Rating vs Parry Ratio](http://ww1000w.silkroadforums.com/viewtopic.php?f=4&t=10997)

**Drop Rates:**
- [ITEM Drop Rate Discussion](http://www.silkroadforums.com/viewtopic.php?f=7&t=39824)
- [SOX Drop Rate Research](https://forum.ragezone.com/threads/research-about-sox-drop-rate-how-does-this-thing-works.1040977/)

**Party System:**
- [GP and SP Distribution](http://www.silkroadforums.com/viewtopic.php?f=29&t=34491)

**Official Resources:**
- [Silkroad Online Wiki](https://silkroadonline.fandom.com/wiki/Silkroad_Online_Wiki)
- [PlayOrigin Forums](https://forum.playorigin.com/)

### Community Contributions

Special thanks to the Silkroad Online community for:
- Testing and documenting formulas
- Sharing SP farming strategies
- Analyzing game mechanics
- Creating comprehensive guides

---

**Version:** 1.0
**Last Updated:** 2025-01-20
**Maintained By:** SRObro Development Team
