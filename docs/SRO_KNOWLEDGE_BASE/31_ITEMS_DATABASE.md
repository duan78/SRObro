# Base de données Items

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Hub Économie](HUB_ECONOMIE.md) → [Items Database](31_ITEMS_DATABASE.md)

---

## 📦 Base de Données Items

👉 **[ITEMS_DATABASE.md](ITEMS_DATABASE.md)** - Base de données complète des items (655 lignes)

**Ce fichier contient:**
- ✅ Structure `_RefItem` (TypeID1-4, Country, Sex, ItemClass/SetID, colonnes de stats)
- ✅ Armes chinoises 1D-13D (sword, blade, spear, glaive, bow) — noms des 3 tiers + niveaux + IDs
- ✅ Armes européennes 1D-13D (épée 1M/2M, double hache, dagues, arbalète, bâton, dark staff, clerical rod, harpe)
- ✅ Boucliers CH + EU par degré (block rate base 10, max ~20)
- ✅ Accessoires (anneaux, colliers, boucles) CH + EU — noms, niveaux, absorption de dégâts
- ✅ Blues / magic options (`MATTR_*`) par emplacement + glossaire
- ✅ Matériaux d'alchimie (elixirs, lucky powders 1-12, tablets 17 familles, magic stones)
- ✅ Consommables (potions, scrolls, munitions) avec IDs vérifiés
- ✅ Avatars (587 items) et Devil Spirits (NASRUN, grades A/S)

**Sources principales:** dump `_RefItem` de client v1.188+ (14 318 items CH + EU, 1D-13D), stats brutes sro-world.de.tl / silkroadkopat.tr.gg, docs openroad/SilkroadDoc (formats vérifiés v1.188), wiki Fandom.

---

## 📚 Documentation Liée

### Item Degrees
👉 **[07_ITEM_DEGREES.md](07_ITEM_DEGREES.md)** - Système 1D-13D complet

**Contenu:**
- Niveaux réels par degré (pièces A/B/C et armes A/B/C — les degrés se chevauchent)
- Progression des stats
- 11D (Drako, lv 101), 12D (Reo lv 113 + upgrades Draco), 13D (Seal uniquement, lv 121)

### Seal Equipment
👉 **[06_SEAL_EQUIPMENT.md](06_SEAL_EQUIPMENT.md)** - Seal equipment (SOS, SOM, SOSun)

**Contenu:**
- Versions `_RARE` des codenames (5 232 items Seal dans le dump)
- Seal of Star (SOS) / Seal of Moon (SOM) / Seal of Sun (SOSun)
- Sources et drops

### Alchimie
👉 **[05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md)** - Système d'alchimie (+1 à +12)

**Contenu:**
- Enhancement +1 à +12 (elixirs weapon/shield/protector/accessory, Advanced Elixirs par degré)
- Lucky Powder (1st-12th), tablets, magic stones
- Blues : Lucky, Steady, Immortal, Astral…

### Armor Types
👉 **[08_ARMOR_TYPES.md](08_ARMOR_TYPES.md)** - Types d'armor (détaillé)

**Contenu:**
- Chinois : Armor (heavy) / Protector (light) / Garment (clothes)
- Européens : Heavy Armor / Light Armor / Robe — restrictions par arme
- Bonus de set : écarts relatifs vitesse/MP (-20%/-10%/0% entre Garment et Armor ; mix = aucun bonus)
- Noms de tous les sets par degré (1D-13D, CH + EU, 3 tiers)

---

## 🎯 Guide d'Optimisation

### Stratégies d'Équipement par Niveau

#### Niveau 1-24 (Débutant)
- **Armes** : 1D-2D (tiers A/B/C : lv 1-5, 8-13)
- **Armure** : Set bas degré (Copper/Bronze, Cotton…)
- **Bijoux** : Copper/Silver (absorption 0.2-2.7)
- **Priorité** : Survie et apprentissage

#### Niveau 24-52 (Intermédiaire)
- **Armes** : 3D-5D (lv 16-38)
- **Armure** : Scale/Pure White/Hard Scale (ou équivalents EU)
- **Bijoux** : Gold/Jadeite/Quartz

#### Niveau 52-101 (Avancé)
- **Armes** : 6D-10D (lv 42-98)
- **Armure** : Jewel → Black Beast (9D-10D = lv 81-100)
- **Bijoux** : Pearl → Tiger's Eye
- **Priorité** : Spécialisation (PvP ou PvE)

#### Niveau 101+ (Expert)
- **Armes** : 11D (Reaper Ghost Sword…), 12D (Imperial Divine Sword…), 13D Seal (Blue Dragon Sword…)
- **Armure** : Drako (11D), Reo/Draco (12D), Tempest/Procela/Breeze (13D Seal)
- **Bijoux** : Paradise Jewel, Blue Cintamani, Storm Stone (13D Seal)

---

## ❓ FAQ

### Questions Fréquentes sur les Items

**Q: Quel est le meilleur équipement pour débuter ?**
R: Un set 1D-2D complet du même type (pour le bonus de set) avec une arme 1D+3 : le rapport coût/efficacité est imbattable. Chez les chinois, le full Garment est recommandé pour leveler (économie de MP).

**Q: Comment obtenir des items 13D ?**
R: Les items 13D (Tempest/Procela/Breeze, armes « Dragon ») n'existent qu'en versions **Seal** (lv 121) : drops de contenus haut niveau / donjons / événements selon le serveur. Les 11D/12D s'obtiennent en jeu normal, et les tiers B/C du 12D par upgrade (Tessera).

**Q: Vaut-il la peine d'enhancer des items +10+ ?**
R: Oui, mais le risque (destruction/downgrade) croît fortement — d'où les blues Immortal (anti-destruction), Astral (anti-reset) et Steady (anti-usure), et les Lucky Powders adaptés au degré. Voir [05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md).

**Q: Où trouver les meilleurs items pour mon niveau ?**
R: Plusieurs options :
- **Stall Network** : [23_STALL_NETWORK.md](23_STALL_NETWORK.md) pour les items players
- **NPCs Vendeurs** : items normaux (tiers A/B/C) dans les villes
- **Farming** : Monstres de votre niveau (drops Seal `RARE`)
- **Quêtes** : Récompenses spécifiques

**Q: Quelle est la différence entre les items chinois et européens ?**
R: Ce sont des catalogues **séparés et non interchangeables** (champ `Country` : 0 = CH, 1 = EU) :
- **Armes CH** : toutes ont attaque physique ET magique (sword/blade/spear/glaive/bow) ; les armes EU n'ont qu'un seul type de dégâts
- **Armures EU** : limitées par l'arme équipée (Heavy = armes warrior uniquement)
- **Noms** : sets CH thématiques (Copper, Python, Pegasus…) ; sets EU par constellations (Sagittarius, Libra…)

**Q: Les accessoires donnent-ils des stats STR/INT de base ?**
R: **Non** — leurs stats blanches sont une **absorption de dégâts** (melee/magical) qui croît avec le degré. Les STR/INT/Lucky/HP viennent uniquement des **blues** (alchimie d'attribut).

**Q: Comment choisir entre armure lourde et légère ?**
R: Voir [08_ARMOR_TYPES.md](08_ARMOR_TYPES.md) :
- **Lourde (Armor/Heavy)** : max DEF PHY, pas de bonus de set, cible des builds STR
- **Intermédiaire (Protector/Light)** : équilibrée, -10% MP
- **Légère (Garment/Robe)** : max DEF MAG, -20% MP, la plus rapide

---

## 🔗 Voir aussi

### Guides Connexes
- [Système d'Alchimie](05_ALCHEMY_SYSTEM.md) - Enhancement et crafting
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - Équipement spécial
- [Item Degrees](07_ITEM_DEGREES.md) - Système de degrees
- [Armor Types](08_ARMOR_TYPES.md) - Types d'armures

### Bases de Données Complètes
- [Base de Données Items](ITEMS_DATABASE.md) - Liste exhaustive
- [Équipement par Classe](HUB_CLASSES.md) - Recommandations
- [Builds PvE](34_PVE_BUILDS.md) - Équipement farming
- [Builds PvP](33_PVP_BUILDS.md) - Équipement PvP

### Hubs Thématiques
- [Hub Économie](HUB_ECONOMIE.md) - Système économique
- [Hub Classes](HUB_CLASSES.md) - Équipement par classe
- [Hub Technique](HUB_TECHNIQUE.md) - Implémentation

### Outils de Développement
- [Development Technical Guide](DEVELOPMENT_TECHNICAL_GUIDE.md)
- [Technical Specifications](TECHNICAL_SPECIFICATIONS.md)

---

## 📊 Statistiques des Items

### Comptages réels (dump client v1.188+, 14 318 items)

```
Équipement total : ~8 460 items
  Armes CH : 5 types × ~88 entrées (tiers A/B/C × 13 degrés + versions Seal/_DEF/_BASIC)
  Armes EU : 9 types + crossbow (CROSSBOW) + shields, même structure
  Boucliers CH+EU : ~150 entrées par race
  Armures CH : ~1 580 pièces (M/F × 3 lignes × 6 pièces × 13 degrés × 3 tiers, 11D/13D partiels)
  Armures EU : idem structure
  Accessoires : 318 CH + 318 EU
  Avatars : 587
  Devil Spirits : 26
Versions Seal [RARE] : 5 232 items
Consommables/mats : ~5 800 items
```

### Répartition par degré (armures CH, pièces M+F)

```
1D-10D : 126-135 pièces par degré (2 genres × 3 lignes × 6 pièces × 3 tiers, -variantes)
11D    : 108 pièces (1 seul tier)
12D    : 126 pièces (3 tiers)
13D    : 54 pièces (Seal uniquement)
```

### Répartition par rareté (structure du jeu)

```
Normal (tiers A/B/C) : items de base, vendus par les NPCs
Seal of Star/Moon/Sun : versions _RARE (5 232), paramètre de rareté serveur
BASIC/DEF             : versions simplifiées (équipement de départ)
```

---

## 🎓 Conseils Avancés

### Optimisation par Classe

**Chinois:**
- **Épée/Sword** : nuker INT polyvalent (crit 3, magie) — Reaper Ghost Sword (11D) puis Imperial Divine Sword (12D)
- **Lance/Spear** : nuker 2M (crit 4, le plus haut) — Reaper Soul Spear (11D)
- **Glaive** : STR 2M (crit 2) — Horyeokbongin Polearm (11D)
- **Arc** : ranged polyvalent (crit 2, portée max) — Mirage Illusion Bow (11D)
- **Blade + Shield** : tank STR (crit 1) — Strom Adamantine Blade (11D)

**Européens:**
- **Warrior** : épée 1M + bouclier (tank) ou 2M/double hache (DPS) — Capricorn Grand Cross (11D)
- **Rogue** : dagues (melee rapide) ou arbalète (portée max) — Capricorn Justice (11D)
- **Wizard** : bâton 2M (plus gros dégâts du jeu) — Capricorn Sacred Wing (11D)
- **Cleric** : cleric rod + bouclier (support) — Capricorn Gia Brain (11D)

### Top Items par Catégorie (vrais noms, 13D Seal)

| Catégorie | Item (13D Seal) | Notes |
|-----------|-----------------|-------|
| Épée CH | Blue Dragon Sword | lv 121 |
| Lame CH | Cutting Dragon Blade | lv 121 |
| Lance CH | Dragon Horn Halberd | lv 121 |
| Glaive CH | Cutting Falls Glaive | lv 121 |
| Arc CH | Dragon Bow | lv 121 |
| Épée 1M EU | Dragon Penna | lv 121 |
| Épée 2M EU | Destroyer | lv 121 |
| Dagues EU | Dragon Fear | lv 121 |
| Bâton EU | Dragon Celebrate | lv 121 |
| Armure CH lourde | Tempest Armor | lv 121 |
| Protector CH | Procela Lamellar | lv 121 |
| Garment CH | Breeze Suit | lv 121 |
| Armure EU | Tempest Plate Armor | lv 121 |
| Robe EU | Breeze Robe | lv 121 |

---

## 💻 Implémentation Technique

### Database Schema (SRObro)

> Aligné sur la structure réelle de `_RefItem` / `itemdata.txt` (colonnes 0-160, voir openroad textdata-itemdata.md).

```typescript
// Prisma schema pour les items
model Item {
  id          String   @id      // ref_id (ex. 71 = Copper Sword)
  codename    String            // "ITEM_CH_SWORD_01_A"
  name        String            // "Copper Sword" (textdataname SN_*)
  service     Boolean  @default(true) // col 0
  country     Int               // 0 = chinois, 1 = européen
  sex         Int               // 0 = femme, 1 = homme, 2 = universel
  typeID1     Int               // 3 = équipement
  typeID2     Int
  typeID3     Int               // 1/2/3 armures CH, 4 bouclier, 5 accessoire, 6 arme CH, 9-12 EU, 13 avatar, 14 devil spirit
  typeID4     Int               // pièce ou sous-type d'arme
  itemClass   Int               // col 61 ; degré = ceil(class/3)
  setId       Int               // col 62 : 0 = aucun ; 1-42 = refsetitemgroup
  reqLevel    Int               // col 33
  price       Int               // col 26 : achat NPC
  sellPrice   Int               // col 31 : vente NPC
  maxStack    Int               // col 57
  range       Int?              // col 94 : portée (unités monde, ÷10 = m)
  stats       ItemStats?
  isRare      Boolean  @default(false) // suffixe _RARE (Seal)
  rarity      ItemRarity @default(NORMAL) // degré de Seal (paramètre serveur)
  icon        String?  // chemin .ddj
  mesh        String?  // chemin .bsr
}

enum ItemRarity {
  NORMAL
  BASIC    // suffixe _BASIC
  DEF      // suffixe _DEF (équipement de départ)
  SOS      // Seal of Star  \
  SOM      // Seal of Moon   > versions _RARE
  SOSUN    // Seal of Sun   /
}

model ItemStats {
  id              String   @id
  itemId          String   @unique
  item            Item     @relation(fields: [itemId], references: [id])
  // couples (min, max) — valeur roulée = min + (max-min) × bits/31
  phyAtkMin       Int?     // cols 95/97 (armes)
  phyAtkMax       Int?     // cols 96/98
  magAtkMin       Int?     // cols 100/102
  magAtkMax       Int?     // cols 101/103
  phyDefMin       Int?     // cols 65/66 (armures)
  phyDefMax       Int?
  blockRateMin    Int?     // cols 74/75 (boucliers) — 10~20 en 1D
  blockRateMax    Int?
  attackRateMin   Int?     // cols 113/114 (armes)
  attackRateMax   Int?
  criticalMin     Int?     // cols 116/117 (armes)
  criticalMax     Int?
  phyReinforceMin Int?     // cols 105-108 (armes) / 82-83 (armures)
  phyReinforceMax Int?
  magReinforceMin Int?     // cols 109-112 (armes) / 84-85 (armures)
  magReinforceMax Int?
  phyAbsorb       Int?     // cols 71-72 (accessoires)
  magAbsorb       Int?     // cols 79-80 (accessoires)
  durabilityMin   Int?     // cols 63/64
  durabilityMax   Int?
}

model MagicOption {
  id        Int    @id     // id magicoption.txt (encodé par niveau)
  codename  String        // "MATTR_STR", "MATTR_ATHANASIA"…
  operator  String        // "+", "-", "-@"
  level     Int           // palier (ex. MATTR_INT +1..+6 = ids 5-10)
  // applicability : weapon/armor/shield/accessory flags (cols 29+)
}
```

---

## 🔍 Recherche Rapide

### Par Type (ancres dans ITEMS_DATABASE.md)
- **Armes chinoises** → [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-armes-chinoises)
- **Armes européennes** → [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-armes-européennes)
- **Boucliers** → [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-boucliers)
- **Accessoires** → [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-accessoires)
- **Blues / magic options** → [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-blues--magic-options)
- **Consommables** → [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-consommables)
- **Avatars / Devil Spirits** → [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-avatars-et-devil-spirits)

### Par Degree
- **1D-2D** (lv 1-18) : Copper/Bronze, Sagittarius/Pisces — voir tables par type
- **3D-5D** (lv 16-43) : Scale/Hard Scale, Gemini/Aquarius
- **6D-8D** (lv 42-77) : Python/Pegasus, Cancer/Virgo
- **9D-10D** (lv 76-100) : Twin Horn/Black Beast, Scorpio/Taurus
- **11D-13D** (lv 101-121) : Drako/Reo/Tempest, Capricorn/Leo/13D Seal

### Par Rareté
- **Normal** → tables des tiers A/B/C dans [ITEMS_DATABASE.md](ITEMS_DATABASE.md)
- **Seal of Star / Moon / Sun** → [06_SEAL_EQUIPMENT.md](06_SEAL_EQUIPMENT.md)

---

## 📚 Voir aussi

### Hub Économie
- [Hub Économie](HUB_ECONOMIE.md) - Centralise économie

### Équipement
- [Item Degrees](07_ITEM_DEGREES.md) - Système 1D-13D
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - SOS, SOM, SOSun
- [Armor Types](08_ARMOR_TYPES.md) - Armor/Protector/Garment + EU
- [Alchimie](05_ALCHEMY_SYSTEM.md) - Enhancement +1 à +12

### Consommables
- [Consumables](21_CONSUMABLES.md) - Potions, scrolls, buffs

### Économie
- [Stall Network](23_STALL_NETWORK.md) - Marché player
- [Economy Gold](22_ECONOMY_GOLD.md) - Système économique

---

**Note:** Ce fichier (31_ITEMS_DATABASE.md) est un hub/redirection vers [ITEMS_DATABASE.md](ITEMS_DATABASE.md)

**Dernière mise à jour :** 2026-10-01
**Base de données Items** - Tous les items de Silkroad Online
**Fichier #31** - Hub mis en cohérence avec ITEMS_DATABASE.md (données vérifiées _RefItem)
