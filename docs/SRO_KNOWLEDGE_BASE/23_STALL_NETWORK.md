# Stall Network - Guide Complet du Système de Commerce

## 📋 Table des Matières
- [Introduction](#introduction)
- [🗓️ Historique : Deux Ères du Commerce](#️-historique--deux-ères-du-commerce)
- [🏪 Créer un Stall (Ère Classique)](#-créer-un-stall-ère-classique)
- [🌐 Stall Network (Recherche Globale)](#-stall-network-recherche-globale)
- [🤝 Le Système de Consignation (NPC Juel)](#-le-système-de-consignation-npc-juel)
- [🚚 Consignment Trading (Marchandises)](#-consignment-trading-marchandises)
- [💰 Stratégies de Vente](#-stratégies-de-vente)
- [📊 Prix et Économie](#-prix-et-économie)
- [📍 Locations de Stall](#-locations-de-stall)
- [💡 Conseils pour Réussir](#-conseils-pour-réussir)
- [🚫 Erreurs à Éviter](#-erreurs-à-éviter)
- [📈 Astuces Avancées](#-astuces-avancées)
- [🛠️ Notes Techniques (vSRO / Émulateurs)](#️-notes-techniques-vsro--émulateurs)
- [❓ FAQ](#-faq)
- [🔗 Resources](#-resources)

---

## 📚 Introduction

Le **Stall Network** est le système de marché joueur-à-joueur de Silkroad Online. Il permet aux joueurs de créer des boutiques personnelles (stalls) pour vendre leurs items à d'autres joueurs, et de **rechercher les items en vente dans toutes les villes du serveur** depuis une interface unique.

### Points Clés
- **Recherche globale** : les items en vente dans toutes les villes sont consultables "en un clic" (confirmé par l'interview IGN d'octobre 2007)
- **Max ~10 items** par stall (comme par consignation)
- **Vendre en semi-AFK** : le perso reste assis en ville, boutique ouverte
- **Ère consignation (post-2010)** : vente possible même déconnecté, contre commissions
- **Économie joueur-driven** : le stall network est la bourse du serveur

---

## 🗓️ Historique : Deux Ères du Commerce

Comprendre l'historique est essentiel pour SRObro, car le client vSRO 1.188 (base de la plupart des clones) correspond à la **première ère**.

### Ère 1 — Stalls joueurs + Stall Network global (2006 → ~2010)

- Les joueurs **ouvrent un stall perso n'importe où en ville** : le personnage s'assoit avec sa boutique
- Le **Stall Network** (fenêtre de recherche, accessible via l'interface) liste les items en vente dans **toutes les villes** : *"players can browse items sold in every town at the press of a button, paging through listings"* (IGN, oct. 2007)
- **Achat = déplacement physique** : la recherche indique où est l'item (ville/stall), il faut ensuite se rendre au stall pour acheter — pas d'achat à distance dans cette ère
- Les routes menant aux villes sont bordées de stalls ; "la ville principale et les routes étaient remplies de boutiques où l'on se promenait" (rétrospectives r/MMORPG)

### Ère 2 — Consignation via NPC (~2010-2011, update "Forgotten World")

- Joymax **retire le réseau de stalls player-run** et le remplace par un **système de consignation** géré par un NPC : **Consignment Merchant Juel** (Hotan Palace, Specialty Shop)
- Vente **24h/24 même déconnecté**, items enregistrés pour une durée limitée (~3 jours)
- **Commissions** à l'enregistrement et sur les ventes (gold sinks)
- Fonctionne dans toutes les villes **sauf Alexandria**
- Les stalls physiques perso subsistent en parallèle sur certaines versions/serveurs

---

## 🏪 Créer un Stall (Ère Classique)

### Comment Ouvrir un Stall

```
1. Être dans une ville (les stalls ne s'ouvrent pas hors des villes)
2. Ouvrir l'action Stall (icône dédiée / interface d'actions)
3. Donner un titre au stall (visible par tous)
4. Glisser les items à vendre depuis l'inventaire (page 1)
5. Définir un prix par item
6. Confirmer : le personnage s'assoit, la boutique est ouverte
7. Attendre les acheteurs (semi-AFK possible)
```

> ⚠️ **Correction par rapport aux anciennes doc** : il n'y a **pas d'emplacements fixes "EMPTY"** réservés aux stalls dans le client classique — le stall s'ouvre là où se trouve le personnage en ville. Certains serveurs privés ajoutent des restrictions de zones.

### Interface du Stall

```
┌─────────────────────────────────────┐
│ Stall Title: [Your Title Here]      │
│                                      │
│ Item List (max ~10 slots):           │
│ ┌─────────────────────────────────┐ │
│ │ [Icon] Sword 9D +5              │ │
│ │ Price: 5,000,000                │ │
│ │ [Edit] [Remove]                 │ │
│ └─────────────────────────────────┘ │
│                                      │
│ [Add Item] [Set Title] [Close]       │
└─────────────────────────────────────┘
```

### Restrictions (vérifiées)

- **Level requis:** Aucun (même level 1 peut ouvrir un stall)
- **Coût:** Gratuit (pas de fee de stall à l'ère classique)
- **Durée:** Permanent jusqu'à fermeture / déconnexion
- **Items limite:** **~10 items** (Silkroad Online Wiki - Fandom)
- **Prix minimum:** 1 gold
- **Position:** En ville uniquement, perso immobile tant que le stall est ouvert
- ⚠️ Ne jamais ouvrir un stall **hors de la ville** sur l'incitation d'un autre joueur (arnaque classique, risque de PK/vol via exploits)

---

## 🌐 Stall Network (Recherche Globale)

### Accéder au Stall Network

```
Interface Communauté (liste des stalls) ou bouton dédié du client

Fenêtre du Stall Network:
┌─────────────────────────────────────┐
│  Recherche d'items (toutes villes)  │
│                                      │
│  Résultats paginés :                 │
│  [Icon] Item ... Ville ... Vendeur   │
│  [Icon] Item ... Ville ... Vendeur   │
│  ... (pages suivantes/précédentes)   │
│                                      │
│  [Rechercher par nom/type]           │
└─────────────────────────────────────┘
```

- Le wiki Fandom situe la liste des stalls sous **l'interface Communauté**
- IGN (2007) confirme le **parcours paginé des listings de toutes les villes**

### Fonctionnalités

#### Recherche et Filtrage

```
Options de recherche:
  - Par nom d'item
  - Par type d'item (Weapon, Armor, Accessory, etc.)
  - Par degree (1D-13D)
  - Par prix
  - Par rareté (Seal of Star/Moon/Sun)

Filtres pratiques:
  - Weapons seulement
  - Armor seulement
  - Accessories seulement
  - SOX seulement
```

> ℹ️ L'affichage d'un "prix moyen" dans la fenêtre de recherche est **rapporté par les joueurs du client vSRO** mais n'est pas documenté formellement en ligne — à vérifier directement en jeu pour SRObro.

#### Achat

```
Ère classique (vSRO 1.188):
  1. Repérer l'item via le Stall Network (ville + stall)
  2. Se téléporter / marcher jusqu'à la ville
  3. Trouver le stall (le titre aide)
  4. Cliquer sur le stall, vérifier l'item ET le prix
  5. Acheter — l'item va dans l'inventaire, le gold au vendeur

Ère consignation:
  Achat direct depuis la fenêtre de recherche (voir section Juel)
```

#### Aperçu des Items

```
Pour chaque item dans un stall:
  - Icone de l'item
  - Nom + stats visibles
  - Prix demandé
  - Nom du vendeur / titre du stall
```

---

## 🤝 Le Système de Consignation (NPC Juel)

### Accès

- NPC **Consignment Merchant Juel**, situé dans le **Specialty Shop du Hotan Palace**
- Option de dialogue : **"Access consignment/purchases/settlements"**
- Disponible dans **toutes les villes sauf Alexandria** (selon retours joueurs)
- La fenêtre propose **3 cercles/options** (guide princessjane25, 2011) :

### Les 3 Opérations

| Option | Fonction |
|--------|----------|
| **1. Search Item** 🔍 | Rechercher **tout item enregistré** dans le Stall Network (achat à distance) |
| **2. Register Items** 📦 | Enregistrer ses items en vente + voir ses items en cours |
| **3. Calculate Item Settlements** 💰 | Voir les items vendus et **encaisser le gold** ("Settle") |

### Mécanique Détaillée (vérifiée)

```
Enregistrement:
  1. Glisser un item dans un slot libre de la fenêtre Register
  2. Définir le prix souhaité
  3. Confirmer → le NPC prélève une COMMISSION par item enregistré
  4. L'item reste en vente pendant une durée limitée (~3 jours)
  5. Non vendu à l'expiration → item perdu/supprimé sauf renouvellement

Vente:
  - Les acheteurs voient l'item via Search Item et achètent à distance
  - Le gold est mis en attente de règlement

Règlement:
  - "Settle" pour encaisser le gold des ventes
  - Commission déduite sur chaque vente
  - ⚠️ Impossible d'enregistrer de NOUVEAUX items avant d'avoir soldé
    les ventes précédentes

Annulation:
  - Sélectionner l'item → "Cancel Registration" → confirmer
```

### Points Clés

- **Max 10 items** simultanément en consignation
- **Durée ~3 jours** par enregistrement (retours joueurs)
- **2 commissions** : à l'enregistrement + sur la vente (taux exacts non documentés en ligne)
- **Avantage** vs stall classique : vente 24h/24, même déconnecté
- **Inconvénient** : frais + risque de perte à l'expiration

### Pour SRObro / Émulateurs

Le bot phBot expose la consignation via la commande `DoConsignment` (dans un script de ville/walk), capable de :
- **Settle** (encaisser les ventes)
- **Retrieve** (récupérer les items expirés)
- **Add** (ajouter des items)

C'est une bonne spécification fonctionnelle pour implémenter la logique serveur de consignation.

---

## 🚚 Consignment Trading (Marchandises)

Ne pas confondre avec la consignation d'items : le **consignment trading** concerne les **specialty goods** (marchandises de commerce du système de job).

```
Mécanique:
  1. Acheter des specialty goods au trader shop d'une ville
  2. Au lieu de transporter et vendre directement...
  3. ...les ENREGISTRER auprès du NPC de consignation
  4. Les marchandises se vendent progressivement
     (~5 heures pour atteindre le sell limit, retours forum)
  5. Récupérer le gold plus tard

Usage:
  - Lisser les prix de vente entre plusieurs runs
  - Éviter de porter des marchandises sur les routes risquées
```

---

## 💰 Stratégies de Vente

### Quoi Vendre?

#### High-Value Items (Profit Élevé)

```
SOX Items (Seal Equipment):
  - Seal of Star (SOS): équivaut à un item +5
  - Seal of Moon (SOM): équivaut à un item +10
  - Seal of Sun (SOSun): équivaut à un item +15
  - Chaque Seal a son glow distinctif (valeur cosmétique réelle)

Exemple (ère vintage, bas level):
  - SOS weapon lv 1-5: 500k-1M
  - SOS weapon lv 6-20: 1.5M-2M
  - SOS weapon lv 21+: 3M+
```

#### Équipement 10D-13D (End-Game)

```
Weapons 10D+:
  - Forte demande, prix: 1M-10M selon stats (beaucoup plus si SOX)
  - +5 ou +10 items vendent plus cher (glow dès +3)

Armor 10D+:
  - Sets complets vendent mieux
  - Critères: Phy DEF vs Mag DEF, Blues (STR/INT), durabilité

Accessories:
  - Rings avec +5 stats
  - Necklaces avec phy/mag atk %
  - Earrings avec crit %
```

#### Matériaux et Consommables

```
Alchemy Materials (demande PERMANENTE des alchimistes):
  - Elixirs (Weapon/Armor/Accessory)
  - Lucky Powders (par degree)
  - Stones et Tablets
  - Les inputs d'alchemy sont souvent plus liquides que l'item final

Potions:
  - Peu rentables en petit volume
  - Vendeurs en gros: pricer à ~2x le prix NPC (guide TaultUnleashed)

Quest Items / monster drops rares
```

### Stratégies de Prix

#### Recherche de Prix

```
1. Vérifier le Stall Network (toutes les villes) pour les items similaires
2. Noter les prix moyens
3. Ajuster:
   - -10% pour vendre vite
   - Prix du marché pour vente normale
   - +10-20% si item rare/fort
```

#### Prix Psychologiques

```
Prix se terminant par:
  - 999,999 (semble moins cher que 1,000,000)
  - 499,999 (semble moins cher que 500,000)
  - 9,999 (semble moins cher que 10,000)
```

#### Règles de Pricing Vérifiées (guide TaultUnleashed, iSRO)

| Cas | Règle |
|-----|-------|
| Item vendu aussi par le NPC | **50-75% du prix de vente NPC** |
| Potions HP/MP au stall | **Prix de vente NPC × 2** |
| Pills | **Prix de vente NPC × 1.5** |
| Item +1 | BIP × 1.25-1.5 |
| Item +2 | BIP × 2 |
| Item +X | ≈ BIP × X ; un +X vaut ~un item X/2 levels au-dessus |
| Blues STR/INT (low level) | +1k par +1 STR/INT (ex. +3 STR = +4k) jusqu'au lv ~20 |
| Blues utiles (high level) | Prix libre selon l'acheteur ciblé |

#### Bundling (Lots)

```
Grouper des items:
  - Set armor complet (discount sur le lot)
  - Weapon + Shield assortis
  - Materials en gros (100x à prix réduit)

Avantages: écoule plus vite, meilleur profit global
```

### Timing de Vente

```
Meilleurs moments pour vendre:
  1. Après events (Fortress War, uniques tués) → gold en circulation
  2. Week-ends → plus d'acheteurs (premium 20-40% rapporté)
  3. Nouveau content / cap increase → demande des nouveaux degrees
  4. Après les double drop events pour ACHETER (surplus = prix cassés)

Meilleurs moments pour acheter:
  - Lundi-mardi (moins de joueurs, -20-30% rapporté)
  - Après double drop events (surplus)
```

---

## 📊 Prix et Économie

### Prix Guides (Approximatifs, économie mature)

> ⚠️ Ces fourchettes sont des ordres de grandeur communautaires — à recalibrer par serveur. Voir [22_ECONOMY_GOLD.md](22_ECONOMY_GOLD.md) pour les prix vérifiés historiques.

#### 10D Equipment

```
Weapons (Normal):
  - Sword 10D +0-3: 500K-1M
  - Sword 10D +5-7: 2M-5M

Sword 10D SOS:
  - +0-3: 10M-20M
  - +5-7: 50M-100M

Armor (Normal):
  - Set 10D +0-3: 1M-2M
  - Set 10D +5 STR: 5M-10M
```

#### 11D Equipment

```
Weapons (Normal):
  - 11D +0-3: 2M-5M
  - 11D +5-7: 10M-20M

Sword 11D SOS:
  - +0-3: 20M-50M
  - +5-7: 100M-200M
```

#### 12D-13D (End-Game)

```
Normal 12D:
  - +0-3: 5M-15M
  - +5-7: 25M-50M

SOS 12D:
  - +0-3: 100M-300M
  - +5-7: 500M-1B

SOM 12D:
  - +0-3: 200M-500M
  - +5-7: 1B-3B

SUN 12D:
  - +0-3: 1B-5B
  - +5-7: 5B-10B+
```

### Monnaies Négociables au Stall

| Item | Prix constaté (iSRO, serveur Ares ~2010-11) |
|------|-----------------------------------------------|
| Gold Coin (Job Temple) | 150M-180M |
| Silver Coin (Job Temple) | 25M-40M |
| Silk scrolls (serveurs privés) | Taux implicite gold↔silk du serveur |

### Matériaux

```
Elixirs:
  - Weapon/Armor Elixir 10D: 50K-100K
  - Weapon/Armor Elixir 11D: 200K-500K
  - Weapon/Armor Elixir 12D: 1M-2M

Stones:
  - Weapon/Armor Stone 10D: 100K-200K
  - Weapon/Armor Stone 11D: 500K-1M
  - Weapon/Armor Stone 12D: 2M-5M
```

---

## 📍 Locations de Stall

### Spécialisation par Ville (consensus community)

> ℹ️ Les "nombreurs de stalls" par ville des anciennes versions de ce document (~50, ~60, ~80...) n'étaient pas vérifiables et ont été retirés. Ce qui suit est la spécialisation économique communément admise.

| Ville | Public / Spécialité | Ce qui s'y vend bien |
|-------|----------------------|----------------------|
| **Jangan** (CH, lv 1-20) | Nouveaux persos CH | Stuff 1D-3D, potions, matériaux bas niveau |
| **Donwhang** (CH, lv 20-30) | Leveling CH | Stuff 3D-5D, gear SP farming, matériaux |
| **Hotan** (CH, lv 30-50) | **Hub marchand central** (et siège du NPC Juel) | Tout, volume max, SOX mid-degree, consignation |
| **Samarkand** (CH, lv 50-70) | Mid-late CH | Stuff 7D-9D, SOM |
| **Constantinople** (EU, lv 1-30) | Persos EU | Stuff EU 1D-7D, items EU |
| **Alexandria** (lv 90-110+) | End-game | 10D-13D, NOVA, Egy, tomb drops — ⚠️ **pas de consignation** |

### Meilleurs Endroits pour Staller

```
Hotan (Ville Principale):
  - Accès central, gros trafic
  - Le NPC de consignation Juel s'y trouve (Specialty Shop, Hotan Palace)
  - Meilleur endroit pour le mid-game SOX

Alexandria (End-Game):
  - Meilleurs acheteurs pour 10D-13D
  - Consignation indisponible → stalls physiques uniquement
```

---

## 💡 Conseils pour Réussir

### Optimiser votre Titre de Stall

```
Mauvais exemples:
  ❌ "My stall" (pas informatif)
  ❌ "Selling stuff" (trop vague)

Bons exemples:
  ✅ "SOS 9D WEAPONS - CHEAP!"
  ✅ "10D Armor Sets +5 STR"
  ✅ "SOM 7D Sword - 5M"
  ✅ "Elixirs & Stones - Best Prices"
```

### Description des Items

```
Toujours inclure les stats importantes:

Weapons: attack range, crit rate, attack speed, blues
Armor: Phy/Mag DEF, block/parry rate, blues
Accessories: +stats, crit %, atk %
```

> ⚠️ Rappel économie : les NPCs ignorent les blues et le +. Au stall, au contraire, ces stats font TOUT le prix — documentez-les.

### Gestion de l'Inventaire

```
1. Utiliser les storage tabs (vente / perso)
2. Organiser par catégorie
3. Garder des stocks d'items populaires
4. Rotation des items rares
```

### Service Client

```
Répondre rapidement:
  ✅ "Negotiable?" → "Yes, make offer!"
  ✅ "Is this +5?" → lister les stats
  ✅ "Can you lower price?" → considérer

Ignorer: trolls, "too expensive" sans offre, spam
```

### Scams à Éviter (Acheteurs ET Vendeurs)

```
Signes de scam:
  ⚠️ Prix trop beau pour être vrai
  ⚠️ "Trust trade" (donner d'abord)
  ⚠️ Item switch au dernier moment (échange direct)
  ⚠️ "Ouvre ton stall hors de la ville" → arnaque classique
  ⚠️ Item-copy scam : items copiés invendables (échange/vente bloquée)

Toujours:
  ✅ Vérifier l'item avant d'acheter (clic droit = stats)
  ✅ Passer par le stall/consignation (transactions sûres)
  ✅ Screenshots comme preuve
```

---

## 🎯 Exemples de Stalls Réussis

### Exemple 1: SOS 9D Weapons

```
Title: "★SOS 9D WEAPONS★ +5 CHEAP!"

Items:
  - Sword 9D SOS +5 [CRIT+7] → 8,500,000
  - Blade 9D SOS +5 [ATK+70%] → 7,000,000
  - Spear 9D SOS +5 [PHY+10] → 6,000,000
  - Bow 9D SOS +5 [CRIT+9] → 9,000,000

Stratégie: prix légèrement sous le marché, items forts, titre accrocheur
Résultat: tout vendu en 48h, ~30M de profit
```

### Exemple 2: 10D Armor Sets

```
Title: "10D SET +5 STR - FULL SET"

Items: 6 pièces +5 STR, prix de lot avec 10% de discount
Stratégie: encourager l'achat du set complet
Résultat: 3 sets vendus, ~50M de profit
```

### Exemple 3: Materials Bulk

```
Title: "BULK ELIXIRS 10D - CHEAPEST!"

Items:
  - Weapon Elixir 10D ×50 → prix de gros
  - Armor Elixir 10D ×50 → prix de gros
  - Lucky Powder 10D ×100 → prix de gros

Stratégie: gros volumes, cible les alchimistes
Résultat: vente en masse, inventaire vidé, ~10M de profit
```

---

## 🚫 Erreurs à Éviter

### Erreurs de Prix

```
❌ Priser trop bas: perdre de la valeur, crasher le marché
❌ Priser trop haut: ne jamais vendre

✅ Rechercher les prix du marché (Stall Network, toutes villes)
✅ Pricer compétitivement, ajuster régulièrement
```

### Erreurs de Présentation

```
❌ Titre non-descriptif ("My stall", "Stall 1")
❌ Stats importants manquants (crit, blues, degree)

✅ Titre informatif avec les items clés
✅ TOUJOURS lister les stats importantes
✅ Être prêt à négocier
```

### Erreurs de Timing

```
❌ Compter uniquement sur la consignation et laisser expirer (~3 jours)
❌ Laisser un stall sans mise à jour (prix dépassés)

✅ Vendre après events (gold en circulation)
✅ Renouveler les registrations avant expiration
✅ Adapter au marché
```

---

## 📝 Templates de Stall

### Template pour Armor Sets

```
Title: "[Degree] [Tier] SET +[Main Stat] - [Key Feature]"
Exemple: "10D SOS SET +5 STR - FULL SET"
```

### Template pour Weapons

```
Title: "[Degree] [Weapon Type] [Tier] +[Enhancement] - [Special]"
Exemple: "9D SOS SWORD +5 CRIT+9 - PERFECT BLADE"
```

### Template pour Materials

```
Title: "[Material Name] [Degree] - [Quantity]× CHEAP!"
Exemple: "Elixir 10D - 50× CHEAPEST ON SERVER!"
```

---

## 📈 Astuces Avancées

### Market Manipulation (Avertissement)

```
⚠️ CERTAINS SERVEURS INTERDISENT CECI:

1. Cornering the Market:
   Acheter TOUS les items d'un type → revendre plus cher
   Ex: monopoliser les elixirs 9D (acheter tout <300k, revendre 400k = +33%)
   Risque: perte massive si ça échoue

2. False Scarcity: prétendre qu'un item est rare
3. Bid Shilling: racheter aux joueurs ignorants

✅ Pratique légitime:
   - Acheter quand prix bas, stocker, vendre quand prix monte
   - Arbitrage entre villes (le Stall Network rend ça facile)
```

### Sniping (Achat rapide)

```
Technique:
  1. Refresh le Stall Network régulièrement
  2. Repérer les items sous-évalués
  3. Acheter immédiatement (se téléporter si nécessaire)
  4. Revendre à prix juste

Items à sniper:
  - SOX mal évalués (vendus comme normaux)
  - Items à blues forts non identifiés par le vendeur
  - Sets complets bradés par morceaux
```

### Stall Hopping

```
Stratégie:
  1. Parcourir tous les stalls d'une ville
  2. Noter les sous-évaluations
  3. Acheter et revendre

Villes les plus rentables: Hotan (volume), Alexandria (items chers)
Fréquence: 1-2 fois par jour, juste après events
```

---

## 🛠️ Notes Techniques (vSRO / Émulateurs)

Pour l'implémentation dans SRObro (clone navigateur basé sur le client officiel / vSRO 1.188) :

### Stall Classique (vSRO 1.188 natif)

| Élément | Valeur |
|---------|--------|
| Slots par stall | ~10 items |
| Localisation | En ville uniquement (position du perso) |
| Achat à distance | **Non supporté nativement** — la recherche indique le stall, déplacement requis |
| Fees | Aucun (ère classique) |
| Vendeur | Doit rester connecté et immobile |

### Consignation

| Élément | Valeur |
|---------|--------|
| Max items | 10 simultanés |
| Durée | ~3 jours (paramètre serveur) |
| Commissions | Registration + vente (taux à définir, non documentés officiellement) |
| Pré-requis | Settle obligatoire avant nouveau Register |
| Coverage | Toutes villes sauf Alexandria (iSRO) |

### Custom Privés (références d'implémentation)

- **Silk Stall** : stalls payables en silk au lieu de gold — système custom via filters (MaxiGuard etc.), non natif vSRO
- **GM Tools vSRO** (ex. MGProjects) : gestion de stalls par un admin (create, add items, open/close)
- **Dev notes** : le payment device "Gold Coin" correspond à l'ID device **512** dans les bases vSRO (référence elitepvpers pour pricer des items en coins via `_RefShopGoods` / packages NPC)
- **Stall expansions** : certains serveurs autorisent l'extension de slots (le "Stall Bug" des OVERLIMIT-like servers)

---

## ❓ FAQ

### Q: Quelle est la différence entre stall et Stall Network?
**R:** Le **stall** est la boutique personnelle (perso assis en ville, max ~10 items). Le **Stall Network** est l'interface de recherche qui agrège les items de tous les stalls de toutes les villes.

### Q: Peut-on acheter à distance via le Stall Network?
**R:** **Ère classique (vSRO 1.188) : non** — la recherche localise l'item, mais il faut se rendre au stall. **Ère consignation (post-2010) : oui** — via le NPC Juel (Hotan Palace), l'achat à distance est possible avec commissions.

### Q: Combien d'items puis-je vendre?
**R:** ~10 items par stall, et ~10 items en consignation simultanément (les deux systèmes peuvent coexister).

### Q: Où se trouve le NPC de consignation?
**R:** **Consignment Merchant Juel**, dans le Specialty Shop du Hotan Palace. Option "Access consignment/purchases/settlements". Fonctionne dans toutes les villes sauf Alexandria.

### Q: Combien coûte la consignation?
**R:** Une commission à l'enregistrement + une commission sur chaque vente encaissée. Les taux exacts ne sont pas documentés en ligne — à mesurer en jeu (variables selon version/serveur).

### Q: Que deviennent les items non vendus en consignation?
**R:** Après ~3 jours, l'enregistrement expire et l'item est supprimé s'il n'est pas renouvelé ou récupéré ("Cancel Registration" / retrieve).

### Q: Le stall a-t-il un coût?
**R:** Non, ouvrir un stall physique est gratuit (ère classique). Les frais n'apparaissent qu'avec la consignation (commissions).

### Q: Pourquoi mon item ne se vend-il pas?
**R:** Prix trop haut, mauvaise ville (mauvais public), stats non documentées, mauvais timing (vente en semaine, achat le week-end). Vérifiez le Stall Network pour comparer.

### Q: Peut-on vendre du stuff contre du silk?
**R:** Pas dans le jeu officiel classique. Certains serveurs privés l'ont implémenté ("Silk Stall", custom). Sur iSRO, le silk ne circule pas entre joueurs.

---

## 🔗 Resources

### Guides et Mécaniques
- [princessjane25 — How to use the new Stall Network (2011)](https://princessjane25.wordpress.com/2011/01/16/how-to-use-the-new-stall-network) — le guide de référence sur la consignation Juel
- [IGN — Interview Silkroad Online (oct. 2007)](https://www.ign.com/articles/2007/10/20/silkroad-online-interview) — description du Stall Network global à l'ère classique
- [GameFAQs — Silkroad Online Guide and Walkthrough (Sintaku, 2007)](https://gamefaqs.gamespot.com/pc/930711-silkroad-online/faqs/44908) — mise en place d'un stall, silk, bases
- [TaultUnleashed — SRO Pricing and Selling Guide](https://www.taultunleashed.com/silkroad-submissions/sro-pricing-and-selling-guide-t36134.html) — ratios NPC, formule BIP, règles de pricing stall
- [phBot Guide — Stall](https://guide.phbot.org/phbot/stall) — automatisation stall/consignation (spécification utile)

### Wikis
- [Silkroad Online Wiki (Fandom) — Stall](https://silkroadonline.fandom.com/wiki/Stall)
- [Silkroad Online Wiki (Fandom) — Consignment](https://silkroadonline.fandom.com/wiki/Consignment)
- [Silkroad Online Wiki (Fandom) — Job](https://silkroadonline.fandom.com/wiki/Job)

### Discussions Communauté
- [Elitepvpers — Silkroad Online Forum](https://www.elitepvpers.com/forum/silkroad-online/)
- [Elitepvpers — Stall system](https://www.elitepvpers.com/forum/silkroad-online/903377-stall-system.html)
- [Elitepvpers — Silkroad Consignment Trading Explain](https://www.elitepvpers.com/forum/silkroad-online/4483331-silkroad-consignment-trading-explain.html)
- [Elitepvpers — What can you buy from the stall network?](https://www.elitepvpers.com/forum/silkroad-online/1375635-what-can-you-buy-stall-network.html)
- [Elitepvpers — Q&A: Silk Stall (buy with Silk)](https://www.elitepvpers.com/forum/silkroad-online/5367382-q-silk-stall-buy-silk-instead-gold-maxiguard-server-how-done.html)
- [Reddit — MMOs with player shops/kiosks (rétrospective stalls SRO)](https://www.reddit.com/r/MMORPG/comments/100p7qg/is_there_any_mmo_left_with_self_kioskshops_you)

---

## 📚 Voir aussi

### Systèmes Économiques
- [Hub Économie](HUB_ECONOMIE.md) - Centralise économie et équipement
- [Économie et Or](22_ECONOMY_GOLD.md) - Guide complet économie, monnaies, sinks
- [Job System](09_JOB_SYSTEM_OVERVIEW.md) - Consignment trading, specialty goods

### Équipement et Pricing
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - Valeur SOX (SOS/SOM/SOSun)
- [Item Degrees](07_ITEM_DEGREES.md) - Pricing 1D-13D
- [Armor Types](08_ARMOR_TYPES.md) - Valeur sets
- [Items Database](31_ITEMS_DATABASE.md) - Référence items

### Bases de Données
- [Index des Items](31_ITEMS_DATABASE.md) - Tous les items vendables
- [NPCs Database](32_NPCS_DATABASE.md) - Vendeurs et acheteurs
- [Skills Database](30_SKILLS_DATABASE.md) - Valeur skill drops

### Guides Associés
- [Fortress War](19_FORTRESS_WAR.md) - Taxes et revenus de guilde
- [Unique Bosses](15_UNIQUE_BOSSES.md) - Drops rares
- [Mounts](24_MOUNTS_PETS.md) - Vendre mounts
- [Alchemy System](05_ALCHEMY_SYSTEM.md) - Marché matériaux

### Ressources Techniques
- [Villes](CITIES_01_JANGAN.md) - Stalls par ville
- [Cartes](MAP_COORDINATES_REFERENCE.md) - Locations stalls

---

*Dernière mise à jour: 2026-10-01*

*Sources: IGN (2007), princessjane25 (2011), Fandom Wiki, TaultUnleashed, elitepvpers, phBot Guide, GameFAQs, communautés r/silkroadonline et r/MMORPG, recherche web exhaustive 2026 — SRObro Project*
