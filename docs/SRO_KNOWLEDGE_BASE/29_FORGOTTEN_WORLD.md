# Forgotten World - Guide Complet

> ⚠️ **Révision majeure (2026-10)** : fichier reconstruit à partir du wikitext complet du wiki Fandom (Silkroad Online Wiki), des guides PlayOrigin (Togui Village / Flame Mountain), du tutorial Seidenkraft, du tutorial elitepvpers et des scripts communautaires ProjectHax. La version précédente contenait de **grosses erreurs sur les tranches de niveaux et les noms de donjons** (Green Abyss/Sea of Resentment mal placés, « Temple of Egypt » inexistant, Sereness présenté comme boss de tous les donjons) — tout est corrigé ci-dessous.

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Conditions d'Entrée (Dimension Hole)](#-conditions-dentrée-dimension-hole)
- [Les 4 Donjons (noms et niveaux VÉRIFIÉS)](#-les-4-donjons-noms-et-niveaux-vérifiés)
- [Système de Difficulté (Grades 1★-4★)](#-système-de-difficulté-grades-1-4)
- [Structure d'une Instance](#-structure-dune-instance)
- [Boss, Uniques et Monstres](#-boss-uniques-et-monstres)
- [Système de Talismans (Collections)](#-système-de-talismans-collections)
- [Quêtes du Forgotten World](#-quêtes-du-forgotten-world)
- [Récompenses](#-récompenses)
- [Stratégies de Groupe](#-stratégies-de-groupe)
- [Forgotten Coins (variante private servers)](#-forgotten-coins-variante-private-servers)
- [Donjons Liés (Job Temple, Qin-Shi Tomb, Holy Water Temple)](#-donjons-liés-job-temple-qin-shi-tomb-holy-water-temple)
- [Implémentation Technique](#-implémentation-technique)
- [FAQ](#-faq)
- [Incertitudes / Données Manquantes](#-incertitudes--données-manquantes)
- [Sources](#-sources)

---

## 🎯 Introduction

**Le Forgotten World (FW / FGW)** est le système de donjons instanciés introduit avec **Legend VI**. Chaque joueur (ou party) obtient **sa propre instance**. C'est la **seule source de talismans** du jeu, échangeables contre des armes scellées haut de gamme (jusqu'au degré 11 Seal of Nova).

### Points Clés (vérifiés)
- ✅ Joueurs de **niveau 35 à 110**
- ✅ **4 donjons** : Togui Village, Flame Mountain, Shipwreck – The Green Abyss, Shipwreck – The Sea of Resentment
- ✅ Accès via **Dimension Hole** obtenue en tuant des **Envies** (spawnées par un **Dimension Pillar**)
- ✅ **4 grades de difficulté** (1★-4★) : type de monstres, limite de party et taux de drop de talismans
- ✅ **Collections de 8 talismans** → arme scellée (SUN D8/D9, MOON D10, NOVA D11)
- ✅ La jauge **berserker est rechargée après chaque unique tué**

---

## 🔑 Conditions d'Entrée (Dimension Hole)

### Chaîne d'accès : Pillar → Envies → Hole

1. **Dimension Pillar** : pilier-cristal qui spawn **aléatoirement dans le monde** (hors villes), par paliers de niveau : **35-50, 51-60, 61-70, 71-80, 81-90**. ℹ️ Le palier 91-100 a été **retiré du spawn sur les serveurs officiels**. Il n'existe pas de carte statique : les piliers apparaissent dans les zones de chasse correspondant à leur palier.
2. Détruire le pilier fait spawner des monstres **Envy**. ⚠️ Les Envies en groupe font **très mal** — un build INT en dessous du level ~120 doit fuir (Seidenkraft).
3. Tuer les Envies peut dropper une **Dimension Hole** (ticket d'entrée). Les trous ont un **grade (1-4)** et un **niveau** — utilisables seulement si votre niveau correspond.
4. La Dimension Hole doit être activée **dans une ville** : clic droit → confirmation → un téléporteur **visible uniquement par vous** apparaît à côté.

### Timings et restrictions (wiki Fandom)

| Règle | Valeur |
|---|---|
| Durée de vie de l'item Dimension Hole | **24 h** (supprimé automatiquement) |
| Délai entre 2 activations de Dimension Hole | **30 minutes** |
| Timer de l'instance | **2 heures** pour tuer le boss (le donjon disparaît ensuite → retour au point de résurrection) |
| Délai de ré-entrée (tous donjons confondus) | **3 heures** après être entré |
| Bypass du délai de ré-entrée | **Forgotten World re-entry ticket** (Item Mall) |
| Despawn du Dimension Pillar si vous quittez le donjon | **15 minutes** pour y retourner (sinon le trou disparaît) |
| Sortir réapprovisionner/réparer | Autorisé (retour sous 15 min via Dungeon Exit / Gap of Dimensions) |

### Aider les autres joueurs
Le **leader de party** entre avec sa propre Dimension Hole ; les autres membres (bon niveau) sont téléportés dans **la même instance** via le **Pillar of Party Member Recall**. On peut toujours rejoindre l'instance d'un autre joueur.

---

## 🗺️ Les 4 Donjons (noms et niveaux VÉRIFIÉS)

| Donjon | Tranches de niveaux | Récompense Collection Book | NPC de quête |
|---|---|---|---|
| **Togui Village** | **35-50 / 51-60 / 61-70** (3 tranches) | Arme **Degré 8 Seal of Sun** | Merchant Associate **Asaman** (Hotan) |
| **Flame Mountain** | **71-80 / 81-90** (2 tranches) | Arme **Degré 9 Seal of Sun** | Hunter Associate **Ahmok** (Hotan) |
| **Shipwreck – The Green Abyss** | **91-100** | Arme **Degré 10 Seal of Moon** | Guild Manager **Musai** (Hotan) |
| **Shipwreck – The Sea of Resentment** | **101-110** | Arme **Degré 11 Seal of Nova A Power** | Governor **Senmut** (Alexandria, South Palace) |

> 🚫 **Corrections importantes par rapport à l'ancienne version de ce fichier** :
> - « Green Abyss (71-80) » et « Sea of Resentment (81-90) » étaient **faux** : ce sont les deux donjons **Shipwreck** (91-100 et 101-110).
> - « Flame Mountain (61-70) » était faux : Flame Mountain = **71-90**.
> - « Shipwreck Dimension (91-100) » et « Temple of Egypt (101-110) » **n'existent pas** sous ces noms. Les items « égyptiens » (Nova) viennent des drops rares de **Ghost Sereness** dans The Sea of Resentment.
> - « Togui's Tomb » (nom parfois cité) : le nom officiel du donjon est **Togui Village**.

---

## ⭐ Système de Difficulté (Grades 1★-4★)

La difficulté est portée par la **Dimension Hole elle-même** (grade affiché sur l'item). Contrairement à une croyance répandue :

- ❌ Les grades ne changent **pas** les HP/dégâts des uniques.
- ✅ Les grades changent le **type de monstres**, la **limite de party** et le **taux de drop des talismans** (grade supérieur = bien meilleures chances).

| Grade | Type de monstres | Limite de party | Notes |
|---|---|---|---|
| **Grade 1 ★** | Normal | **4 joueurs** | Faisable en petit groupe / haut niveau bien stuffé |
| **Grade 2 ★★** | Champion | **4 joueurs** | Solo possible pour un level 120 correctement équipé (Seidenkraft) |
| **Grade 3 ★★★** | ??? (élite) | **8 joueurs** | Conçu pour party ; la disposition des boxes change |
| **Grade 4 ★★★★** | ??? (élite) | **8 joueurs** | « Hardcore » : full party coordonnée, wipes faciles, meilleurs taux de talismans |

**Règle d'accès aux grades 3-4** : uniquement au-dessus du **level 70** — les Envies de niveau < 71 ne droppent jamais de trou de grade supérieur à 2 (wiki Fandom).

---

## 🏰 Structure d'une Instance

Tous les donjons FGW suivent **le même schéma** (wiki Fandom + guides Origin) :

### Camps (rooms)
- Chaque zone (« camp ») contient des monstres normaux + des **mini-boss (uniques)**.
- **Tuer tous les monstres** d'un segment ouvre automatiquement la zone bloquée suivante.
- Après le clear d'un camp, une **Envy** y spawne ; **tuer l'Envy fait spawner de nombreux monstres d'un coup** → quitter vite le camp.
- Certains camps contiennent un **Dungeon Exit** et/ou un **Pillar of Party Member Recall**.

### Boss Camp
- Toujours le **dernier camp** du donjon : le **boss final** n'apparaît qu'après le clear complet de toutes les zones précédentes.

### Treasure Box Room
- Salle avec monstres + **Treasure Box** (coffre). Le coffre **n'est pas obligatoire** pour progresser, mais c'est la **source principale de talismans** et de Faded Beads.

### Gap of Dimensions
- Le clear de certains camps fait apparaître un téléporteur **« Gap of Dimensions »** au début du donjon : permet aux joueurs qui rentrent de sauter directement vers les camps éloignés.

### Astuce officielle (wiki)
> **Ne registrez PAS les talismans au fur et à mesure** : collectez les 8 avant de les enregistrer dans le Collection Book. La jauge **berserker se recharge à chaque unique tué**.

---

## 👹 Boss, Uniques et Monstres

⚠️ L'ancienne version présentait « Sereness Ghost » comme boss final de TOUS les donjons et inventait un « Elder Earth Ghost » mid-donjon universel + des phases/chiffres de HP. **Réalité vérifiée : chaque donjon a SES uniques ; seul The Sea of Resentment a Ghost Sereness comme boss final.**

### Togui Village (35-70)
| Unique | Rôle | Notes |
|---|---|---|
| **Togui General** | Unique de camp | Vu dans les runs 51-60 (timestamp ~16 min des vidéos) |
| **Togui Elder** | Unique de camp | Fin de run (~1 h 06 dans les vidéos complètes) |
| **Elder Earth Ghost** | Unique majeur | **Meilleure probabilité de drop de talismans** (guide Origin). À **15 % de son HP**, il spawn des **mini-uniques et monstres** → la party doit switch sur les adds |

### Flame Mountain (71-90)
| Unique | Rôle | Notes |
|---|---|---|
| **Flame Cow King** | Unique majeur | Droppe des talismans (avec les Treasure Boxes). Il **se renforce (~+15 %)** pendant le combat (guide Origin) |
| *Mini-uniques* | Camps | Répartis dans les 3 « Areas » du donjon |

### Shipwreck – The Green Abyss (91-100)
- Uniques **non documentés nominativement** dans les sources trouvées (structure identique : camps + mini-uniques + boss camp). Voir [Incertitudes](#-incertitudes--données-manquantes).

### Shipwreck – The Sea of Resentment (101-110)
| Boss/monstre | Notes |
|---|---|
| **Ghost Sereness** (boss final) | **Seul après le clear complet.** Cast une **pétrification** (esquive en se déplaçant pendant le cast). Spawn des **adds à ~60 % et ~20 % de HP**. Les joueurs pétrifiés à bas HP peuvent mourir |
| **Ghost Curse** (monstre) | Monstre cité par les scripts communautaires (ProjectHax) dans le donjon 1★ |
| Vindictive Spirit / Phantom (monstres) | Thème « esprits vengeurs » du donjon |

### Drops rares de Ghost Sereness (wiki Fandom)
- **Degré 11 Seal of Nova B Fight** (arme)
- **Degré 11 Seal of Nova A Protection** (bouclier)
- **Degré 11 Seal of Nova B Guard** (bouclier)

> ℹ️ Les items « égyptiens » (Nova A/B) de fin de jeu viennent donc de **Sea of Resentment**, pas d'un hypothétique « Temple of Egypt ».

---

## 🃏 Système de Talismans (Collections)

Chaque donjon possède **une collection de 8 talismans** (noms officiels iSRO, croisés Fandom + Algarb + ProjectHax). Les talismans sont **vendables/échangeables** (tradeables) et droppent par les **Treasure Boxes** et les **boss/uniques**.

### 1. The Phantom of the Crimson Blood — Togui Village (D8)
1. Red Tears
2. Western Scriptures
3. Togui Mask
4. Red Talisman
5. Puppet
6. Dull Kitchen Knife
7. Spell Paper
8. Elder Staff

### 2. The Burning Abyss — Flame Mountain (D9)
1. Fire Flower
2. Horned Cattle
3. Flame of Oblivion
4. Flame Paper
5. Hearthstone Flame
6. Enchantress Necklace
7. Honghaeah Armor
8. Fire Dragon Sword

### 3. The Green Abyss — Shipwreck, The Green Abyss (D10)
1. Silver Pendant
2. Cobalt Emerald
3. Logbook
4. Love Letter
5. Portrait of a Woman
6. Jewelry Box
7. Diamond Watch
8. Mermaid's Tears

### 4. The Sea of Resentment — Shipwreck, The Sea of Resentment (D11)
1. Broken Key
2. Large Tong
3. Phantom Harp
4. Evil's Heart
5. Vindictive Spirit's Bead
6. Hook Hand
7. Commander's Patch *(plus rare)*
8. Sereness's Tears *(plus rare)*

### Compléter une collection
1. Loot les Treasure Boxes + tuer les uniques/boss (les taux montent avec le grade).
2. Astuce communauté : avoir un personnage avec **peu de talismans déjà collectés** augmente le taux de drop des boxes (Algarb).
3. **Enregistrer les 8 talismans** dans le Collection Book (clic droit) — la quête de collection se prend **AVANT d'entrer** (voir NPC par donjon dans le tableau ci-dessus) : D8 chez un marchand, D9/D10 « the general », D11 « Alex south, north from the porter » (Algarb).
4. Récompense : l'arme scellée correspondant au donjon (une fois par donjon par personnage).

---

## 📜 Quêtes du Forgotten World

| Type | Fréquence | Contenu |
|---|---|---|
| **Collection quest** | **1 fois par donjon par personnage** | Collecter + enregistrer les 8 talismans → arme scellée (sans plus, sans blues, valeurs basses) |
| **Série one-time** (~7 quêtes par tranche de niveau) | 1 fois | La plus longue, les plus grosses récompenses XP ; certaines donnent des items scellés |
| **Quêtes journalières** | Toutes les **24 h** | Petites tâches (kill ou collect), faisables en 1-2 sessions, plusieurs disponibles simultanément |

---

## 🏆 Récompenses

### Par collection (une fois par personnage)
| Donjon | Récompense |
|---|---|
| Togui Village | **Arme D8 Seal of Sun** (+0, sans blues) |
| Flame Mountain | **Arme D9 Seal of Sun** (+0, sans blues) |
| Green Abyss | **Arme D10 Seal of Moon** (+0, sans blues) |
| Sea of Resentment | **Arme D11 Seal of Nova A Power** (+0, sans blues — pas de bouclier) |

### Items FGW
- **Talismen** : droppés par Treasure Boxes et boss ; **vendables**.
- **Faded Beads** : droppées par Treasure Boxes, mini-boss et boss. À l'usage : **200 à 20 000 SP aléatoires**. Vendables aussi.
- **Drops rares de Ghost Sereness** : armes D11 Nova B Fight, boucliers Nova A Protection / Nova B Guard.
- Le boss du dernier camp peut aussi dropper une **arme égyptienne B-grade** (D11, extrêmement rare — rapporté par Algarb).

> ❌ L'ancienne version listait des récompenses par étoile (SP fixes, Arena Coins, SOS/SOM par grade) : **non documentées sur officiel** — les grades n'influencent que le taux de talismans, pas la nature de l'arme.

---

## 👥 Stratégies de Groupe

### Composition (grades 3-4, 8 joueurs max)
- Grades 1-2 : **4 joueurs max** — un duo XP + support suffit à haut niveau.
- Grades 3-4 : full party 8/8 avec tank (Warrior), DPS (Wizard/Rogue/CH), support (Cleric obligatoire, Bard pour mana/vitesse), Warlock pour Division (+30 % dégâts subis) sur les uniques.

### Conseils vérifiés
- **Envies** : très agressives — un build INT fragile doit éviter de les tanker en meute.
- **Après le kill d'une Envy dans un camp** : sortir vite, beaucoup de monstres apparaissent d'un coup.
- **Elder Earth Ghost (Togui)** : garder les AoE/stuns pour la vague d'adds à 15 % HP.
- **Flame Cow King (Flame Mountain)** : burst soutenu, il se buffe (~+15 %) en combat.
- **Ghost Sereness (Sea of Resentment)** : watch le cast de pétrification → **se déplacer pendant le cast** ; prévoir les adds à 60 %/20 % ; Instant Resurrection Scroll pour ne pas perdre l'XP du boss.
- **Berserker** : la jauge se recharge à chaque unique — enchaîner les camps en zerk.
- **Réparation/réappro** : sortir par le Dungeon Exit et revenir sous 15 min (via Gap of Dimensions pour rejoindre le camp lointain).

---

## 💰 Forgotten Coins (variante private servers)

⚠️ Le système « Forgotten Coins » (shop NPC qui échange des coins contre talismans) **n'existe pas sur les serveurs officiels** — c'est une mécanique récurrente des **private servers** modernes pour supprimer le RNG. Le principe : les coffres/boss droppent des coins, un NPC permet d'acheter le talisman manquant (prix croissant avec la rareté). Pour SRObro : à traiter comme **option de design** (réduit la frustration), pas comme donné officielle. Les taux chiffrés de l'ancienne version de ce fichier (coins par coffre, etc.) étaient **inventés** et ont été retirés.

---

## 🏛️ Donjons Liés (Job Temple, Qin-Shi Tomb, Holy Water Temple)

### ⚔️ Job Temple (Job Cave — uniques égyptiens)
Donjon **PvP job** (Thieves vs Hunters/Traders, **tenue de job requise**) — structure en « Sanctums » avec accès conditionnés aux **AP (Auction/Activity Points)** gagnés via les quêtes de job :

| Uniques | Sanctums | Accès | Cycle |
|---|---|---|---|
| **Selket & Neith** | Sanctum of Restriction / Sanctum of Blue Eye | **Aucune AP requise** | 2×/jour (03:30 / 15:30 SST) |
| **Anubis & Isis** | Sanctum of Punishment / Sanctum of Atonement | L'**union** avec le plus d'AP | 2×/jour (09:30 / 21:30 SST) |
| **Haroeris & Seth** | Sanctum of Immorality / Sanctum of Dark | Union avec AP ; **Haroeris doit mourir avant Seth** | 2×/jour (12:30 / 00:30 SST) |

- **Sanctum of Audience** = hub central avec le NPC de quêtes AP (job suit requis pour entrer dans le temple).
- Avertissements in-game 10 et 5 minutes avant l'ouverture des salles.
- Drops (vSRO-type) : **coins Gold/Silver/Iron/Copper**, items 12D, Immortal/Astral stones (les niveaux exacts des uniques varient selon les serveurs : ~110-130).

### 🐍 Qin-Shi Tomb (Jangan Cave, B1-B6)
Le donjon « Medusa » — entrée à l'**est de Jangan** (Jangan Cave), monstres ~81+, 6 sous-sols (B1→B6) :

- **B4** : l'unique **BeakYung** (garde) tué → la **Sarin Gate** (centre B4) s'ouvre **10 minutes** → accès B5.
- **B5** (croix) — 4 uniques, un par direction :
  - Nord : **JeonUk The Black Tortoise** (lv 98)
  - Sud : **YumJae The Red Hawk** (lv 98, magique)
  - Ouest : **TaeHo The Blue Dragon** (lv 99)
  - Est : **SoHaow The White Tiger** (lv 99, physique, ~80 % stun — le plus dur)
- Les 4 tués → **Shinmoo, The Man of Flames** (lv 100) au centre SW → drops d'équipement level 100 (10D).
- **B6** : 3 portails de cristal bleu → salle aléatoire parmi **Guardian Chamber** (vagues 92-99), **Man-Viper Chamber** (4 Snake Generals lv 95), **Black Viper Chamber** (**Soso The Black Viper**, lv 100). Au centre de B6, 4 cristaux verts téléportent vers B1-B4.
- **BeakYung The White Viper** alias **« Medusa »** : l'unique le plus haut niveau du donjon (**lv 105**, ~183,5 M HP), dégâts magiques, fear/poison/bind/**pétrification 1 min incurable** — les meilleurs drops 10D lv 100.

### 💧 Holy Water Temple (Alexandria South)
Donjon d'Alexandria à progression par quêtes (Pharaon/temple égyptien) :
- Progression : quête **Pharaoh Tomb Beginner** → **HWT Beginner** → **HWT Intermediate** (quêtes **Senior General** et **Baron**, chaîne « The Suspicious Sacrifice », ~lv 105) → **HWT Advanced**.
- Uniques communautaires documentés (vidéos/runs) : **Sphinx, Sekhmet, Nephthys, Horus**.
- Les runs typiques enchaînent ~5 uniques ; drops d'Arena Coins / scrolls selon serveur.
- Système de **titres** lié (voir guide titres Silkroad Latino : Knight-Captain → Chief General).

---

## 🛠️ Implémentation Technique

> 📡 **Packets officiels FGW (vSRO 1.188, SilkroadDoc)** — le protocole client-serveur a des opcodes dédiés au Forgotten World :
>
> | Opcode C→S | Opcode S→C | Nom |
> |---|---|---|
> | 0x7519 | 0xB519 | AGENT_FGW_RECALL_LIST (liste des membres rappelables) |
> | 0x751A | 0xB51A | AGENT_FGW_RECALL_MEMBER |
> | — | 0x741A | AGENT_FGW_RECALL_REQUEST |
> | 0x751C | 0xB51C | AGENT_FGW_RECALL_RESPONSE |
> | 0x751D | 0xB51D | AGENT_FGW_EXIT |
> | — | 0x351E | AGENT_FGW_UPDATE |
>
> Le **Pillar of Party Member Recall** s'appuie sur cette famille de packets. Note mouvement : dans les donjons, le `RegionID` porte le flag `0x8000` (`IsDungeon`) et les coordonnées passent en **int32** au lieu de int16 (packet 0x7021).

### Modèle de données (SRObro)

```typescript
// Configuration d'un donjon FGW — calée sur les données officielles vérifiées
interface FGWDungeonConfig {
  id: string;                      // 'togui_village' | 'flame_mountain' | 'green_abyss' | 'sea_of_resentment'
  name: string;
  levelBrackets: [number, number][];  // ex. Togui: [[35,50],[51,60],[61,70]]
  reward: {
    degree: number;                // 8 | 9 | 10 | 11
    seal: 'SUN' | 'MOON' | 'NOVA_A_POWER';
  };
  questNpc: { name: string; town: string };
  talismanCollection: string[];    // 8 talismans exacts (listes ci-dessus)
  bosses: FGWBossConfig[];
  timeLimitSeconds: 7200;          // 2 h (officiel)
}

// Grades de difficulté — type de monstres + limite de party + multiplicateur de drop talisman
interface FGWGrade {
  grade: 1 | 2 | 3 | 4;
  monsterType: 'NORMAL' | 'CHAMPION' | 'ELITE_A' | 'ELITE_B';  // G3/G4 = '???' officiel
  maxPartySize: 4 | 8;            // 4 pour G1/G2, 8 pour G3/G4
  talismanDropMultiplier: number; // croissant ; à calibrer (officiel non chiffré)
  minEnvyLevel?: 71;              // grades 3-4 seulement si Envies lv 71+
}

// Timers officiels à respecter
const FGW_TIMERS = {
  HOLE_ITEM_EXPIRY:   24 * 3600,  // l'item disparaît après 24 h
  HOLE_SPAWN_COOLDOWN: 30 * 60,   // 30 min entre 2 activations
  DUNGEON_TIME_LIMIT:  2 * 3600,  // 2 h pour tuer le boss
  REENTRY_LOCK:        3 * 3600,  // 3 h avant toute nouvelle entrée
  EXIT_DESPAWN:        15 * 60,   // 15 min hors donjon avant despawn
} as const;
```

### Gestion d'instance (squelette)

```typescript
class FGWInstanceManager {
  // Entrée : le leader utilise sa Dimension Hole en ville → téléporteur visible par lui seul
  spawnDimensionHole(playerId: string, hole: { grade: number; bracket: [number, number] }) {
    if (this.recentHoleAt[playerId] > Date.now() - 30 * 60_000) throw new Error('HOLE_COOLDOWN');
    if (player.level < hole.bracket[0] || player.level > hole.bracket[1]) throw new Error('LEVEL_MISMATCH');
    // téléporteur personnel -> teleportPartyToInstance() au clic
  }

  // Clear d'un camp : ouvre la zone suivante, spawn l'Envy, puis la vague après kill d'Envy
  onCampCleared(instanceId: string, campId: number) {
    const inst = this.instances.get(instanceId)!;
    inst.openDoor(campId + 1);
    inst.spawnEnvy(campId);          // kill de l'Envy -> spawnMonsterWave(campId)
    if (inst.config.camps[campId].spawnsGapOfDimensions) inst.spawnGapOfDimensions();
    if (campId === inst.config.camps.length - 1) inst.spawnFinalBoss(); // boss camp = dernier
  }

  // Le boss final ne spawn qu'après le clear COMPLET ; unique tué -> berserker refill
  onUniqueKilled(instanceId: string, uniqueId: string) {
    const inst = this.instances.get(instanceId)!;
    inst.players.forEach(p => p.refillBerserkerGauge());
    if (inst.isFinalBoss(uniqueId)) this.completeInstance(instanceId);
  }
}
```

### Boss — mécaniques documentées (remplace l'ancienne IA « 3 phases » inventée)

```typescript
// Ghost Sereness (Sea of Resentment) — seules mécaniques documentées
const GHOST_SERENESS = {
  spawnCondition: 'ALL_CAMPS_CLEARED',        // n'apparaît qu'au clear complet
  mechanics: [
    { type: 'PETRIFY_CAST', telegraph: 'visible cast', counter: 'move during cast' },
    { type: 'ADD_WAVE', atHpPercent: 0.60 },  // vague d'adds à ~60 %
    { type: 'ADD_WAVE', atHpPercent: 0.20 },  // vague d'adds à ~20 %
  ],
  rareDrops: ['D11_NOVA_B_FIGHT_WEAPON', 'D11_NOVA_A_PROTECTION_SHIELD', 'D11_NOVA_B_GUARD_SHIELD'],
};

// Elder Earth Ghost (Togui Village)
const ELDER_EARTH_GHOST = {
  highestTalismanDropRate: true,              // meilleure source de talismans du donjon
  mechanics: [{ type: 'SPAWN_MINI_UNIQUES', atHpPercent: 0.15 }], // adds à 15 % HP
};

// Flame Cow King (Flame Mountain)
const FLAME_COW_KING = {
  dropsTalismans: true,
  mechanics: [{ type: 'SELF_ENRAGE', rampUpPercent: 15 }], // se renforce ~+15 % en combat
};
```

### Schéma Prisma (résumé)

```prisma
model FGWDungeon {
  id           String   @id
  name         String
  levelMin     Int
  levelMax     Int
  degree       Int      // 8-11
  rewardSeal   String   // SUN | MOON | NOVA_A_POWER
  timeLimit    Int      @default(7200)
  reentryLock  Int      @default(10800)
  camps        FGWCamp[]
  talismans    FGWTalisman[]
}

model FGWCamp {
  id           String   @id
  dungeonId    String
  order        Int
  hasTreasureBox Boolean @default(false)
  hasDungeonExit Boolean @default(false)
  hasRecallPillar Boolean @default(false)
  spawnsGap      Boolean @default(false)
}

model FGWTalisman {
  id           String   @id
  collectionId String
  name         String   // noms officiels (Red Tears, Fire Flower, ...)
  rarity       Int      @default(1)
  @@unique([collectionId, name])
}

model FGWInstance {
  id          String   @id @default(cuid())
  dungeonId   String
  grade       Int      // 1-4
  holeOwnerId String   // joueur qui a spawné la Dimension Hole
  startedAt   DateTime @default(now())
  expiresAt   DateTime // startedAt + 2 h
  completed   Boolean  @default(false)
}
```

---

## ❓ FAQ

**Q: Combien de donjons FGW existent-il ?**
R: **4** : Togui Village (35-70, en 3 tranches), Flame Mountain (71-90, 2 tranches), Shipwreck – The Green Abyss (91-100), Shipwreck – The Sea of Resentment (101-110).

**Q: Comment entre-t-on ?**
R: Détruire un **Dimension Pillar** (spawn aléatoire dans le monde par paliers 35-90) → tuer les **Envies** → loot d'une **Dimension Hole** (grade 1-4) → l'activer **en ville** (clic droit).

**Q: Quel est le vrai rôle des étoiles/grades ?**
R: Le grade change le **type de monstres** (Normal/Champion/plus), la **limite de party** (4 en grade 1-2, 8 en grade 3-4) et le **taux de drop des talismans**. Les HP/dégâts des uniques ne changent pas. Grades 3-4 seulement via des Envies niveau 71+.

**Q: Peut-on faire le FGW solo ?**
R: Grade 1 oui (selon niveau/stuff), grade 2 possible pour un haut niveau bien équipé, grades 3-4 non (conçus pour 8).

**Q: Les talismans sont-ils tradeables ?**
R: **Oui**, ils sont vendables/échangeables sur officiel (attention aux arnaques « talismans 9dg/10dg pour quête A-grade » — Seidenkraft).

**Q: Ghost Sereness est-elle le boss de tous les donjons ?**
R: **Non.** Ghost Sereness est le boss final de **The Sea of Resentment (101-110)** uniquement. Chaque donjon a ses propres uniques (Togui General/Elder, Elder Earth Ghost, Flame Cow King…).

**Q: Que donne la complétion d'une collection ?**
R: Une **arme scellée** du degré du donjon (D8/D9 SUN, D10 MOON, D11 Nova A Power), sans plus ni blues — **une fois par donjon par personnage**.

**Q: Que sont les Faded Beads ?**
R: Items droppés (coffres/mini-boss/boss) donnant **200 à 20 000 SP aléatoires** à l'usage, vendables.

**Q: Combien de temps entre deux donjons ?**
R: **3 heures** de délai de ré-entrée (tous donjons confondus), contournable avec le Forgotten World re-entry ticket de l'Item Mall.

**Q: Que se passe-t-il si le timer de 2 h expire ?**
R: Le boss doit être tué dans les 2 h, sinon le donjon disparaît et vous êtes téléporté à votre point de résurrection.

---

## ⚠️ Incertitudes / Données Manquantes

1. **Uniques du Green Abyss (91-100)** : aucun nom d'unique/boss final trouvé dans les sources publiques — structure identique aux autres (camps + boss camp) confirmée, mais les noms restent à extraire (base `_RefObjCommon` d'un client vSRO ou videos iSRO).
2. **Type exact des monstres grades 3-4** : le wiki Fandom les note « ??? » — communément compris comme monstres élite/giant-like ; à confirmer dans les données.
3. **Multiplicateurs exacts de drop de talismans par grade** : « plus élevé = mieux » est documenté, pas les chiffres.
4. **Timer d'instance** : 2 h (Fandom) ; un post ProjectHax mentionne aussi une fenêtre totale de ~5 h autour — retenir 2 h comme référence officielle.
5. **Niveaux/HP exacts des uniques FGW** : non publiés de façon fiable (l'ancienne version inventait HP 2M-10M) — à extraire de `_RefObjCommon`/`characterdata_5000.txt` si besoin précis.
6. **Job Temple** : niveaux des uniques et loot exacts varient fortement selon les serveurs (données ici = eXay SRO/vSRO-type) ; cycles 12 h et conditions AP documentés.
7. **Holy Water Temple** : noms d'uniques issus de vidéos communautaires (Sphinx/Sekhmet/Nephthys/Horus) — croiser avec le client officiel avant implémentation.

---

## 🔗 Sources

### Wiki
- [Forgotten World — Silkroad Online Wiki (Fandom)](https://silkroadonline.fandom.com/wiki/Forgotten_World) — source principale (wikitext intégral : accès, grades, structure, quêtes, items, collections, récompenses)
- [Silkroad Online Wiki — Accueil](https://silkroadonline.fandom.com/wiki/Silkroad_Online_Wiki)

### Guides communautaires
- [The Forgotten World – Togui Village Instance (Origin Guides)](https://forum.playorigin.com/showthread.php?73-The-Forgotten-World-Togui-Village-Instance-Origin-Guide) — Elder Earth Ghost + adds à 15 %
- [The Forgotten World – Flame Mountain Instance (Origin Guides)](https://forum.playorigin.com/showthread.php?78-The-Forgotten-World-Flame-Mountain-Instance-Origin-Guide) — Flame Cow King, structure en 3 areas
- [The FGW Tutorial — Seidenkraft Blog](https://seidenkraftblog.wordpress.com/2012/09/14/the-fgw-tutorial/) — grades, envies, Ghost Sereness (pétrification, adds 60 %/20 %), récompenses Nova
- [Tutorial Forgotten World — Elitepvpers](http://www.elitepvpers.com/forum/sro-guides-templates/1147804-tutorial-forgotten-world.html)
- [Forgotten World (FGW) Community Scripts — ProjectHax](https://forum.projecthax.com/t/forgotten-world-fgw-community-scripts/22648) — noms des talismans, Ghost Curse, plugins xAutoDungeon/FGW Helper
- [Forgotten World — Guild Algarb](https://guildalgarb.wordpress.com/games/sro/maps/forgotten-world/) — talismans par donjon, NPC de quête SUN, grades
- [Legend VI: Forgotten World Shipwreck Dimension II — PrincessJane](https://princessjaneblog.wordpress.com/2011/03/18/legend-vi-forgotten-world-shipwreck-dimension-ii/)

### Donjons liés
- [Job Temple Unique Guide — eXay SRO](https://forum.exaysro.com/showthread.php?tid=3875) — sanctums, cycles 12 h, AP, drops
- [Guide Tomb Qin-Shi Uniques — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/259810-guide-tomb-qin-shi-uniques.html) — B4-B6, BeakYung/Medusa, 183,5 M HP
- [Quests needed for Intermediate Water Temple — ProjectHax](https://forum.projecthax.com/t/quests-needed-for-intermediate-water-temple/19844) — progression HWT
- [Guide Titres — Silkroad Latino Wiki](https://wiki.silkroadlatino.com/en/faq/guia-titulos)
- [xSROMap — carte interactive](https://jellybitz.github.io/xSROMap/)

### Technique (packets FGW)
- [SilkroadDoc (DummkopfOfHachtenduden) — wiki GitHub](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki) — opcodes FGW 0x7519-0x351E, mouvement 0x7021 + flag donjon

### Vidéos
- [Togui Village 51-60 full run (Togui General 16:27, Togui Elder 1:06:15)](https://www.youtube.com/watch?v=Aag1Ggt6YQk)
- [Togui General Unique](https://www.youtube.com/watch?v=aFHzOBZHBO0)
- [Silkroad-R Tutorial #16: Forgotten World](https://www.youtube.com/watch?v=u9erjSYFnj8)
- [Forgotten World Explained (TRSRO)](https://www.youtube.com/watch?v=7CTJWdfrv8A)

---

*Dernière mise à jour : 2026-10-01*
*Révision majeure : noms de donjons/tranches corrigés (Fandom wikitext), grades re-documentés (types + party, pas d'HP scaling), boss par donjon vérifiés (Origin/Seidenkraft/YouTube), collections complétées (8 talismans chacune), section donjons liés ajoutée (Job Temple/Qin-Shi/HWT), packets FGW officiels ajoutés. Chiffres non sourcés de l'ancienne version supprimés — voir « Incertitudes ».*
