# Base de données Skills - Hub Central

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Hub Classes](HUB_CLASSES.md) → [Skills Database](30_SKILLS_DATABASE.md)

> ⚠️ **Révision majeure (2026-10)** : ce hub a été resynchronisé avec [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md) et [SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md), réécrits à partir des **vraies données iSRO** (fichier `skills.txt` du client, traductions elitepvpers, Silkroad Origin Mobile, PhBot). L'ancienne version du hub contenait des noms de skills **inventés** (« Flying Chain Series », « Two-Handed Warrior » comme classe…) — tout est corrigé ci-dessous.

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Skills Chinois (vue d'ensemble)](#-skills-chinois-vue-densemble)
- [Skills Européens (vue d'ensemble)](#-skills-européens-vue-densemble)
- [Arbres de Mastery](#-arbres-de-mastery)
- [Mécaniques de Skills](#-mécaniques-de-skills)
- [Recherche par Type](#-recherche-par-type)
- [Guide d'Optimisation / SP](#-guide-doptimisation--sp)
- [Implémentation Technique](#-implémentation-technique)
- [FAQ](#-faq)
- [Voir aussi](#-voir-aussi)

---

## 🎯 Introduction

Ce **hub centralise les bases de données skills** de Silkroad Online, classées par race puis par mastery. Les compétences sont identifiées par leurs **noms officiels iSRO** et, côté chinois, par leurs **codenames client** (`SKILL_CH_…`) qui servent de clé universelle (identique KSRO/iSRO/vSRO) — recommandation forte pour SRObro.

### Points Clés
- 🇨🇳 **Chinois :** 7 maîtrises (3 armes + 4 forces), organisées en **séries** de 5-8 **livres** (A→F/H)
- 🇪🇺 **Européens :** **6 maîtrises** (Warrior, Rogue, Wizard, Warlock, Bard, Cleric), grille de lignes avec **book 1 / book 2**
- 🔢 **400 skill exp = 1 SP** (constante universelle) · paliers de déverrouillage **+2 niveaux de maîtrise** par niveau de skill (CH)
- 🧬 **Identifiants** : les plages d'IDs classiques CH — Bicheon 3-39, Heuksal 41-69, Pacheon 71-89, Cold 90-106, Lightning 107-123, Fire 124-142, Force 143-159

---

## 🇨🇳 Skills Chinois (vue d'ensemble)

👉 **[SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md)** — base complète : séries, livres, maîtrises, cast, cooldowns, nombres de niveaux

### Structure d'une maîtrise
Chaque maîtrise = **séries** (lignes de progression), chaque série = **livres A→F/H** débloqués par paliers de maîtrise (5, 27, 49, 71, 96, 120…), chaque livre = 9+ niveaux d'upgrade (+2 maîtrise par niveau). Pattern des codenames : `<SERIE>_<LETTRE>_<N°hit>S?_<NIVEAU>` (ex. `SKILL_CH_SWORD_CHAIN_C_2S_04`).

### Les 7 maîtrises et leurs séries signatures

| Maîtrise | Codename | Séries principales | Passif (maîtrise 10) |
|---|---|---|---|
| ⚔️ **Bicheon** (Sword/Blade) | `SKILL_CH_SWORD_*` | Smashing Sword · Chain Sword Attack (3-5 hits) · Shield Technique · Blade Force (distance) · Hidden Blade (KD) · Killing Heaven Blade (cibles au sol) · Sword Dance (AoE) · Bicheon Force (buffs tardifs) | Shield Protection (block ratio) |
| 🗡️ **Heuksal** (Spear/Glaive) | `SKILL_CH_SPEAR_*` | Pierce · Storm/spin (tourbillon AoE permanent) · Heuksal Spear · **Soul Departs (stun — le meilleur du jeu)** · Ghost Spear (AoE 360°) · Chain Spear · Flying Dragon Spear (distance) | Cheolsam Force (HP max) |
| 🏹 **Pacheon** (Bow) | `SKILL_CH_BOW_*` | Anti Devil Bow (critique) · Arrow Combo (2-7 flèches) · Hawk Summon · Autumn Wind (perforantes) · **Soul Arrow (portée, must-have)** · Explosion Arrow (AoE) · Strong Bow (chargé) · Mind Bow (360°) | Mind Concentration (attack rating) |
| ❄️ **Cold** | `SKILL_CH_COLD_*` | Cold Force (imbue gel) · Frost Guard (DEF PHY) · Cold Wave (gel à distance) · Frost Wall · Frost Nova (AoE gel) · Snow Storm (nuke) · **Snow Shield (dégâts → MP)** | Cold Armor (DEF PHY) |
| ⚡ **Lightning** | `SKILL_CH_LIGHTNING_*` | Thunder Force (imbue shock) · Piercing Force (%ATK MAG) · Wind Walk / **Ghost Walk (téléport)** · Lion Shout (mini-nukes, groupes de CD liés) · Concentration (parry) · Thunderbolt Force (nuke) | Heaven's Force (parry ratio) |
| 🔥 **Fire** | `SKILL_CH_FIRE_*` | Fire Force (**imbue la plus forte** + Burn) · Fire Shield (anti-statuts) · Flame Body (%ATK PHY) · Fire Protection (DEF MAG) · Fire Wall · **Flame Wave (le nuke le plus puissant CH)** · Fire Combustion (MP) | Flame Devil Force (ATK PHY) |
| 💪 **Force** (« Water ») | `SKILL_CH_WATER_*` | Self Heal · Force Cure (dissipe statuts) · Heal (cible) · Rebirth Art (résurrection) · Harmony Therapy (HoT) · **Vital Spot (debuffs nommés : Decay/Weaken/Impotent/Division)** · Cure Therapy · Vital Flow | Force Increasing (MP max) |

Détails complets (tableaux livre par livre, cast/CD, puissances Origin Mobile) → [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md)

---

## 🇪🇺 Skills Européens (vue d'ensemble)

👉 **[SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md)** — base complète par mastery avec effets documentés et cooldowns notoires

### Structure d'une maîtrise
Grille de **lignes (R1, R2…)** débloquées par paliers de mastery ; chaque ligne possède un **book 1** (précoce) et un **book 2** amélioré (ex. `Moving March → Swing March`, `Blaze → Dark Blaze`, `Healing Cycle → Healing Orbit`). **2 masteries max** par personnage (total plafonné à 2 × niveau).

### ⚠️ Correction importante
L'ancienne version du hub listait « 8 classes européennes » dont **Two-Handed Warrior** et **Warlock/Rogue Hybrid** comme masteries séparées : **faux**. Les lignes 1H/2H/dual-axe sont des **lignes internes de la mastery Warrior**, et les « hybrides » sont juste des combinaisons de 2 masteries. Les maîtrises EU sont **6** : Warrior, Rogue, Wizard, Warlock, Bard, Cleric.

### Les 6 maîtrises et leurs skills signatures

| Maîtrise | Rôle | Skills clés (vérifiés) |
|---|---|---|
| 🛡️ **Warrior** | Tank / DPS melee / interrupteur | **Dare Devil** (plus grosse attaque), Bash, Turn Rising, Triple Swing, Sprint Assault (interrupt), Shield Trash/Crush, Taunting Target/Howling Shout (taunts), **Pain Quota** (partage dégâts, 5 min), Iron/Mana Skin, Vital Increase, Physical/Magical/Ultimate Screen |
| 🗡️ **Rogue** | Assassin burst / lurer | **Prick** (finisher dague), Mortal Wounds (bonus cibles au sol), Butterfly Blow (5 hits + Dull), Hurricane Shot (KD), **Rapid Shot** (lure), Distance Shot, Crossbow Extreme / Dagger Desperate (burst), Stealth, Scorn (taunt-interrupt) |
| 🔮 **Wizard** | Nuker AoE | **Meteor** (CD 10 s partagé avec Fire Bolt), Fire Blow → Salamander Blow (7-9 hits, animation ~9 s annulable), Blizzard (80 % frostbite), Earth Quake, Charged Squall (knockback), Root/Mesh Root, Earth Barrier/Fence (cycle 20 s/CD 60 s), **Life Control + Life Turnover** (+25 % MAG cumulés, −50 % HP), Teleport |
| 🎭 **Warlock** | Debuffer / DoT / contrôle | Séries **Raze → Ravage** (Decay/Weaken/Impotent/**Division +30 % dégâts subis**, ~80 %, 30 s), DoT Blaze/Toxin/Decayed (+ books 2 AoE), **Stun** (80 %), Slumber, Vampire Touch/Kiss (vol de vie + Disease), **Reflect** (35 % @135 %, ignore Pain Quota), Scream Mask |
| 🎵 **Bard** | Buffer / batterie de mana | **Moving March → Swing March**, Hit March, Guard Tambour (DEF PHY) / Mana Tambour (DEF MAG, non cumulables), **Mana Cycle** (MP fixe/s pendant 16 s), Mana Orbit, **Noise** (aggro −, permanent), Cure Music (cleanse party), Tuning Noise/Sound (dégâts absolus), danses (Dance of Magic…), Awesome World (danser seul, effet /2) |
| ⛪ **Cleric** | Healer / buffs défensifs | **Healing Cycle → Healing Orbit** (HoT tick 3 s, **zéro aggro**), Group Healing/Recovery, **Recovery Division** (HoT party 300 s), Bless Spell (DEF PHY+MAG), Body/Soul/Force/Mental Blessing (30 min), Holy Word/Spell (anti-curses), Resurrection, **Offering** (attaque la plus forte du jeu, consomme 95 % HP) |

Détails complets (buffs par portée, rotations, tips) → [SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md)

---

## 🌳 Arbres de Mastery

### Chinois
- **Total mastery points : 300** au cap (3 × ~90-120 selon l'époque du cap) ; chaque mastery monte jusqu'au cap serveur (90/110/120).
- Les combos classiques limitent à **2-3 maîtrises effectives** (mastery ≤ niveau du perso).
- **Le GAP** (niveau perso − maîtrise la plus haute) gouverne le ratio XP/SP — voir [TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md#-formulas-and-calculations).

| Build type | Arme | Éléments | Style |
|---|---|---|---|
| Tank / Blader | Bicheon | Cold (+ Force) | Survie, block, KD |
| DPS PHY | Heuksal (glaive) | Fire + Lightning | Spin AoE, burst |
| Nuker INT | — (sword passive) | Lightning + Fire (nuke) | Burst magique |
| Kiter | Pacheon | Lightning + Cold | Distance, CC |
| Support | — | Force | Heals, cures, debuffs |

### Européens
- **2 masteries max** (total ≤ 2 × niveau : 220 au cap 110, 240 au cap 120).
- La seconde mastery est souvent un **sub rôle** : Cleric (survivie), Bard (mana), Warrior (tank sub)…

| Combo | Rôle | Note |
|---|---|---|
| Warrior + Cleric | Tank/Support | Le tank autarcique |
| Wizard + Bard | Nuker party | ~**760 000 SP** pour tout maxer au cap 90 (documenté) |
| Rogue + Cleric | Assassin PvP | Burst + self-heal |
| Warlock + Bard | Debuffer party | Curses + mana battery |

---

## ⚙️ Mécaniques de Skills

### Imbues (Chinois uniquement)
- **Une seule imbue active** à la fois (toggle). Le CD de réactivation croît avec le livre (6 → 21 s).
- Fire = dégâts max + **Burn** (DoT) · Cold = **Frostbite** (~40 %) + **Freeze** (~20 %) · Lightning = **Shock** (réduit le parry ratio) + splash.

### Statuts et pilules
| Statut | Source | Pilule universelle ? |
|---|---|---|
| Burn / Freeze | Imbues Fire/Cold, Flame Wave | ❌ → **Force Cure** |
| Frostbite / Shock | Imbues Cold/Lightning | ✅ (small/medium/large : ~33/50/76 unités) |
| Stun (état) | Soul Departs Spear, skills EU | ❌ incurable pendant la durée |
| Decay/Weaken/Impotent/Division | Vital Spot (Force), Raze/Ravage (Warlock) | Cure party (Cure Music, Recovery Division) |

### Cooldowns — règles structurelles
- **CH** : attaques 3-5 s · chaînes/AoE 8 s · murs 5-10 s · buffs lourds 180-300 s · postures 60 s.
- **EU** : gros burst ⇒ long CD **et/ou** longue animation (Salamander Blow ~9 s annulable ; Earth Barrier 20 s/CD 60 s → cycle à 3 Wizards ; Meteor CD 10 s **partagé** avec Fire Bolt, l'ordre de cast change le CD : Meteor→Fire Bolt = 10 s, Fire Bolt→Meteor = 3 s).
- **Délai de potion EU : 15 s** entre chaque potion (règle de compensation EU).

### Coûts et progression SP
- **400 skill exp = 1 SP** (constante).
- CH : coût SP d'un niveau = table au **(maîtrise requise + 1)** ; déverrouillage **+2 maîtrise** par niveau de skill ; ~80k-200k SP « fully farmed » cap 80 selon build.
- EU : **pas de farming SP requis** (gap optionnel) ; ~760 k SP pour Wizard+Bard cap 90 ; extrapolation ~1,2-1,5 M SP pour 2 masteries cap 110-120.
- Reskill CH : quête Skill Resuscitation (lvl 20+, **80 % du SP remboursé**).
- 👉 Guide détaillé : [26_SP_FARMING.md](26_SP_FARMING.md)

---

## 🔍 Recherche par Type

### Burst / Finishers
- **CH** : Heaven Chain / Thousand Army Chain (Bicheon), Chain Spear - Dragon, Flame Wave - Disintegrate, Strong Bow - Destruction
- **EU** : **Dare Devil** (Warrior), **Prick** (Rogue), **Meteor** (Wizard), **Offering** (Cleric — 95 % HP), Tuning Sound (Bard, dégâts absolus)

### AoE / Farm
- **CH** : Bloody Fan Storm (spin glaive), Ghost Spear (360°), Sword Dance, Explosion Arrow, Flame Wave - Wide, Frost Nova, Snow Storm
- **EU** : Earth Quake, Ground Rave, Blizzard, Charged Squall, Booming Wave, Curse Breath/Dark Breath

### Contrôle (CC)
- **Stun** : Soul Departs Spear (CH), Stun/Daze Warlock (80 %), Sudden Twist, Sprint Assault
- **KD/combo au sol** : Hidden Blade + Killing Heaven Blade (CH), Turn Rising/Triple Swing, Hurricane Shot + Mortal Wounds (Rogue)
- **Root/Immo** : Root → Mesh Root (20 % d'échec), Frostbite/Freeze
- **Sleep/Fear** : Slumber (Warlock), Lightning Shock (80 % Fear, 20 s)

### Debuffs nommés
- **CH (Force)** : Vital Spot — Muscle/Spirit/Body(Decay)/Mind(Weaken)/Zero(Impotent)/Brain(Division)
- **EU (Warlock)** : Physical/Medical/Combat/Courage Raze→Ravage (Decay/Weaken/Impotent/**Division**)

### Buffs / Soutien
- **Offensifs** : Piercing Force (%MAG), Flame Body (%PHY), Pain Quota, Warcry, Dance of Magic, Force/Mental Blessing
- **Défensifs** : Frost Guard, Fire Protection, Iron/Mana Skin, Screens (1 min), Earth Barrier (party), Bless Spell, Snow Shield (dégâts→MP)
- **Soins** : Healing Cycle/Orbit (tick 3 s, 0 aggro), Recovery Division (300 s), Group Recovery, Heal (Force), Harmony Therapy
- **Utilitaires** : Wind Walk/Ghost Walk, Teleport, Stealth/Invisible, Noise (aggro), Detect (anti-stealth)

---

## 🎯 Guide d'Optimisation / SP

1. **Priorités CH** : maxer 1-2 séries cœur (spin glaive / chaîne épée / nuke) + passifs utiles ; l'imbue d'élément dès son palier ; Soul Arrow minimum 1 niveau (bow).
2. **Priorités EU** : lignes de dégâts du main → book 1 des lignes clés du sub (heals/mana) → **books 2** (Meteor, Dare Devil, Recovery Division, Guard Tambour) → passifs en dernier.
3. **SP farming** : le GAP (0 → 9) multiplie le SP par ~9 au prix de l'XP — voir les tables vérifiées dans [TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md).
4. **Spots** : Jangan (débutant) → Donwhang (moyen) → Hotan (élevé) → Forgotten World / uniques (voir [29_FORGOTTEN_WORLD.md](29_FORGOTTEN_WORLD.md)).

---

## 💻 Implémentation Technique

### Clés d'identification (SRObro)

```typescript
// CH: le codename client est la clé universelle (identique KSRO/iSRO/vSRO)
interface SkillIdentity {
  codename: string;      // ex. "SKILL_CH_SWORD_CHAIN_C_2S_04" (série, livre, hit, niveau)
  seriesPrefix: string;  // ex. "SKILL_CH_SWORD_CHAIN_*"
  masteryGroup: number;  // 257 (Bicheon), 258 (Heuksal), 259 (Pacheon), 277 (Cold/Lightning/Fire), 276 (Force)
  book: 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H';
  level: number;         // niveau du skill (déverrouillage: +2 maîtrise par niveau)
}

// EU: pas de codenames publics fiables -> clé = (mastery, ligne R, book 1|2)
interface EUSkillIdentity {
  mastery: 'warrior'|'rogue'|'wizard'|'warlock'|'bard'|'cleric';
  row: number;           // R1..R9
  book: 1 | 2;
  displayName: string;   // ex. "Meteor", "Healing Orbit"
}
```

### Schéma BDD (résumé)

```typescript
model Mastery {
  id          String   @id        // BICHEON, HEUKSAL... | WARRIOR, ROGUE...
  race        Race                // CHINESE | EUROPEAN
  maxLevel    Int                 // = cap serveur (90/110/120)
  skills      Skill[]
}

model Skill {
  id            String   @id      // codename client (CH) ou clé générée (EU)
  masteryId     String
  series        String?           // série/ligne (CH: CHAIN, EU: row)
  book          String?           // A-H (CH) | 1-2 (EU)
  level         Int               // niveau du skill
  masteryReq    Int               // maîtrise requise (paliers +2)
  castTime      Float?            // secondes (skills.txt)
  cooldown      Float?            // secondes (skills.txt)
  effectFlags   String[]          // burn/freeze/shock/stun/kd/...
  spCost        Int               // table à maîtrise+1
}
```

> 📡 Les dégâts min/max et coûts MP par niveau **ne sont pas dans `skills.txt`** : à extraire de `skilldata_5000.txt` / `_RefSkill` (colonnes d'effets + codes Param documentés — voir [TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md)) et les « Skill Power » Origin Mobile ne sont que des proxys relatifs.

---

## ❓ FAQ

**Q: Combien de maîtrises peut-on monter ?**
R: Chinois : jusqu'à 3 efficacement (total 300 points au cap historique). Européens : **2 maximum** (total ≤ 2 × niveau). Les skills sont verrouillés par race.

**Q: Quelle est la clé de référence pour les skills CH ?**
R: Le **codename client** (`SKILL_CH_…`) : identique sur toutes les versions (KSRO/iSRO/vSRO), contrairement aux noms affichés qui varient.

**Q: Peut-on réinitialiser ses compétences ?**
R: Oui — quête **Skill Resuscitation** (CH, lvl 20+, rembourse **80 % du SP**) ; les nuances EU dépendent du serveur (l'ancien « NPC Skill Master à 100k gold » de ce hub n'était pas sourcé).

**Q: Pourquoi mes skills EU partagent-ils des cooldowns ?**
R: Certaines lignes EU ont des **groupes de CD partagés** (ex. Meteor ↔ Fire Bolt : l'ordre de cast détermine le CD restant). C'est un mécanisme officiel documenté, pas un bug.

**Q: Les skills « book 2 » EU remplacent-ils le book 1 ?**
R: Ce sont les rangs supérieurs de la même ligne (`Root → Mesh Root`, `Blaze → Dark Blaze`) — à apprendre à la place du book 1 une fois le palier atteint.

**Q: Où sont les chiffres exacts (dégâts/MP) ?**
R: Non publiés de façon fiable et absents de `skills.txt` — voir les sections « Données Manquantes »/« Incertitudes » des deux bases pour l'état exact de ce qui est vérifiable.

**Q: Meilleures compétences PvP ?**
R: Voir [33_PVP_BUILDS.md](33_PVP_BUILDS.md) ; les interrupts (Sprint Assault, Scorn, Soul Spear) et les debuffs nommés (Division) dominent le meta documenté.

---

## 🔗 Voir aussi

### Bases de Données
- [Skills Chinois — SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md) · [Skills Européens — SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md)

### Guides de Classes
- [Classes Chinoises](02_CHINESE_CLASSES.md) · [Classes Européennes](03_EUROPEAN_CLASSES.md) · [Hub Classes](HUB_CLASSES.md)

### Mécaniques & Builds
- [Système de Combat](04_COMBAT_SYSTEM.md) · [Mécaniques Avancées](28_ADVANCED_MECHANICS.md)
- [SP Farming](26_SP_FARMING.md) · [Builds PvP](33_PVP_BUILDS.md) · [Builds PvE](34_PVE_BUILDS.md) · [Index des Builds](INDEX_BUILDS.md)

### Technique
- [Technical Specifications](TECHNICAL_SPECIFICATIONS.md) — formules, protocole officiel, `_RefSkill`
- [Development Technical Guide](DEVELOPMENT_TECHNICAL_GUIDE.md) — architecture SRObro

---

**Dernière mise à jour : 2026-10-01**
*Hub resynchronisé avec les bases CH/EU révisées (noms iSRO réels, codenames, structure séries/livres et book 1-2 ; correction : 6 maîtrises EU, pas 8 « classes »). Les listes de skills non sourcés de l'ancienne version ont été remplacées par les skills vérifiés des bases détaillées.*
