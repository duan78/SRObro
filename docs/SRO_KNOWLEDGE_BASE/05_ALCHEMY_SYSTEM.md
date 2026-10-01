# Alchemy System

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [L'Interface d'Alchimie](#-linterface-dalchimie)
- [Enhancement (+1 à +12)](#-enhancement-1--12)
- [Taux de Succès — Données Réelles](#-taux-de-succès--données-réelles)
- [Échec : Reset, Destruction, Malus](#-échec--reset-destruction-malus)
- [Protections : Lucky, Immortal, Astral, Steady](#-protections--lucky-immortal-astral-steady)
- [Élixirs](#-élixirs)
- [Lucky Powders](#-lucky-powders)
- [Advanced Elixirs (+1/+2 garantis)](#-advanced-elixirs-12-garantis)
- [Tablettes, Éléments et Pierres](#-tablettes-éléments-et-pierres)
- [Blues (Magic Options) — Catalogue Complet](#-blues-magic-options--catalogue-complet)
- [Stratégies d'Alchimie](#-stratégies-dalchimie)
- [Données Vérifiées (Ground Truth)](#-données-vérifiées-ground-truth)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

Le système d'**alchimie** de Silkroad Online permet d'améliorer votre équipement. C'est un système **risqué mais essentiel** pour progresser dans le jeu. Toutes les fenêtres d'alchimie sont accessibles via la touche **Y** (fenêtre Alchemy).

### Points Clés
- ✅ **Enhancement :** +1 à +12 sur officiel (au-delà possible sur certains serveurs, le taux +12 s'applique alors)
- ✅ **4 familles d'élixirs :** Weapon, Shield, Protector (armure), Accessory
- ✅ **3 volets :** Enhancement (+), Assimilation de pierres (blues), Dissolution (rondos/éléments)
- ✅ **Taux de succès officiels :** de 100% (+1 avec powder) à 20% (+10 à +12)
- ✅ **Risque réel :** à partir de +5, un échec peut **détruire** l'item (50% des échecs)
- ✅ **Blues de protection :** Lucky, Immortal, Astral, Steady (consommés à l'usage)
- ✅ **Luck-based :** RNG important, chaque tentative est indépendante

### Les 3 volets de l'alchimie

| Onglet | Action | Matériaux |
|--------|--------|-----------|
| **Att. Enhance** | Monter le + d'un item | 1 élixir (+ lucky powder optionnelle) |
| **Att. Assimilate** | Ajouter/re-rouler des stats | 1 pierre (attribute stone ou magic stone) |
| **Dissolve** | Détruire items/matériaux en éléments | Void Rondo / Destroyer Rondo |

---

## 🪟 L'Interface d'Alchimie

- Touche **Y** → fenêtre avec 2 slots (item + matériau) et un 3e slot optionnel (lucky powder).
- **Att. Enhance :** placer l'équipement + l'élixir (+ lucky powder du même degré) → cliquer **Fuse**.
- **Att. Assimilate :** placer l'équipement + la pierre → Fuse.
- **Dissolve :** placer l'item + le rondo approprié.
- Le résultat s'affiche dans le chat et via un effet visuel (les items + ont un *glow* qui s'intensifie avec le +).

---

## ⬆️ Enhancement (+1 à +12)

### Mécanique
- 1 **élixir** du bon type (weapon/shield/protector/accessory) = 1 tentative pour +1.
- L'élixir (et la powder) est **toujours consommé**, succès ou échec.
- En cas de **succès** : +1 (uniquement +1 — pas de « crit success » double niveau, non confirmé par les données du serveur).
- En cas d'**échec** : l'item retombe à **+0** (sauf protection Astral → plancher +4, voir plus bas).

### Ce que le + améliore
- **Armes :** attaque physique ET magique (les seules stats affectées).
- **Armures/boucliers/accessoires :** défense physique et/ou magique.

### Effets visuels
- **+5 à +7 :** glow subtil
- **+8 à +9 :** glow visible
- **+10+ :** glow intense

---

## 📊 Taux de Succès — Données Réelles

> ⚠️ **Source de premier plan :** les taux sont stockés **dans la base de données du serveur** (champs `Param2/Param3/Param4` des items élixir/lucky powder, 12 octets = 12 taux). Unpackés et vérifiés par la communauté (voir [Données Vérifiées](#-données-vérifiées-ground-truth)). Mesures empiriques sur ~30 000–150 000 tentatives concordent à ±2%.

### Taux de base (élixir seul, sans powder)

| Tentative | Taux de succès |
|-----------|----------------|
| +0 → +1 | **50%** |
| +1 → +2 | **40%** |
| +2 → +3 | **30%** |
| +3 → +4 | **19%** |
| +4 → +5 | **17%** |
| +5 → +6 | **17%** |
| +6 → +7 | **17%** |
| +7 → +8 | **17%** |
| +8 → +9 | **17%** |
| +9 → +10 | **12%** |
| +10 → +11 | **12%** |
| +11 → +12 | **12%** |
| Au-delà de +12 | réutilise le taux de +12 |

### Bonus de la Lucky Powder (degré adapté à l'item)

| Tentative | Bonus ajouté |
|-----------|--------------|
| +0 → +1 | **+50%** |
| +1 → +2 | **+30%** |
| +2 → +3 | **+20%** |
| +3 → +4 | **+8%** |
| +4 → +12 | **+8%** |

*(Exemple vérifié pour `ITEM_ETC_ARCHEMY_REINFORCE_PROB_UP_A_10`, Lucky Powder 10th. Le bonus est additif, plafonné à 100%.)*

### Total typique : élixir + lucky powder

| Tentative | Taux total |
|-----------|-----------|
| +0 → +1 | **100%** |
| +1 → +2 | **70%** |
| +2 → +3 | **50%** |
| +3 → +4 | **27%** |
| +4 → +9 | **25%** |
| +9 → +12 | **20%** |

### Autres sources de bonus (tous additifs)
- **Magic Stone of Luck** (blue « Lucky ») : **+5%** flat, consommée à la tentative suivante.
- **Premium PLUS** (abonnement item mall) : **+5%** flat.
- **Avatars avec option Lucky** : +X% flat (ex. avatar testé à +40%).
- Le total est **borné entre 10% et 100%**.

### Mesures empiriques (échantillons massifs)
30 000 tentatives élixir seul : +1 **50.58%**, +2 **40.07%**, +3 **29.99%**, +4 **19.13%**, +5 **17.68%** — conforme aux taux de la DB.

### Nombre d'élixirs nécessaires (élixir + powder, pour 90% de chances d'atteindre l'objectif)
| Objectif | Élixirs nécessaires |
|----------|---------------------|
| +2 depuis +0 | ~10 |
| +3 depuis +0 | ~47 |
| +4 depuis +0 | ~205 |
| +5 depuis +0 | ~840 |
| +6 depuis +0 | ~3 384 |

### Facteurs n'ayant AUCUN effet
- ❌ Le degré de l'item (les taux sont identiques pour du 1D et du 11D — seul le prix des élixirs change).
- ❌ Le type d'item (arme, armure, etc. — mêmes taux).
- ❌ L'emplacement, le moment, le « totem », les techniques detiming : mythes débunkés.

### Serveurs privés
Les rates alchimie sont configurables côté serveur (multiplicateurs courants x2–x5 sur les PS « fun »). **Vérifiez toujours les rates de votre serveur.**

---

## ⚠️ Échec : Reset, Destruction, Malus

Le déroulé d'un échec (logique décompilée du gameserver officiel) :

1. **Tous niveaux confondus** : l'item retombe à **+0** (sauf Astral, voir plus bas).
2. **À partir de +5** (tentative vers +6 ou plus) : un second tirage 50/50 décide :
   - **50% : Destruction.** L'item est **perdu à jamais** — sauf si une charge **Immortal** est présente (elle est alors consommée).
   - **50% : Malus de durabilité.** L'item reçoit « Max durability −X% » (blue négative `MATTR_DEC_MAXDUR`, valeur 1–99%, cumulable) — sauf si une charge **Steady** est présente (consommée).

### Tableau récapitulatif du risque

| Situation à l'échec | Conséquence |
|---------------------|-------------|
| +0 → +4 (toute tentative) | Reset à +0, rien d'autre |
| +5 et +, sans protection | 50% destruction / 50% −durabilité max |
| +5 et +, avec **Immortal** | Pas de destruction (1 charge consommée) |
| +5 et +, avec **Steady** | Pas de malus durabilité (1 charge consommée) |
| +4 et +, avec **Astral** | L'item retombe à **+4** au lieu de +0 (charge consommée) |

**⚠️ IMPORTANT :** la destruction est PERMANENTE. Le malus de durabilité est une blue négative qui ne part pas (l'item « abîmé » perd de la valeur et se répare plus cher).

---

## 🛡️ Protections : Lucky, Immortal, Astral, Steady

Ces 4 blues « spéciales » s'ajoutent via les **magic stones** correspondantes (Jade tablet of luck / immortal / steady / astral + éléments). Elles ont des **charges** (« x Times ») qui se consomment.

| Blue | Effet | Règles d'application |
|------|-------|----------------------|
| **Lucky (n fois)** | +5% de succès à la prochaine tentative | Max 6 stacks, consommé à l'usage |
| **Immortal (n fois)** | Annule la destruction à l'échec (dès +5) | Max 6 stacks, consommé à chaque destruction évitée |
| **Steady (n fois)** | Annule le malus de durabilité à l'échec | Max 6 stacks, consommé à chaque malus évité |
| **Astral (n fois)** | Pancher de reset à **+4** au lieu de +0 (dès +4) | Max 6 stacks ; **nécessite plus de charges Immortal que d'Astral** sur l'item |

### Où les obtenir
- **Magic stones of Immortal / Astral** : très rares — Magic Pop (cartes), item mall, drops haut niveau. Coûteuses (« cost real money »).
- **Magic stones of Steady** : bon marché → **à utiliser systématiquement** pour tout +5 et plus.
- **Magic stone of Luck** : rare ; s'applique avec 100% de succès.

---

## 🧪 Élixirs

### Les 4 types

| Élixir (nom client) | Cible |
|----------------------|-------|
| **Elixir (weapon) / Intensifying Elixir (weapon)** | Armes CH et EU |
| **Elixir (protector) / Intensifying Elixir (protector)** | Armures (armor/protector/garment CH ; heavy/light/cloth EU) |
| **Elixir (shield) / Intensifying Elixir (shield)** | Boucliers |
| **Elixir (accessory) / Intensifying Elixir (accessory)** | Anneaux, colliers, boucles |

### Deux séries dans les données
- Série `_A` (« Elixir ») : ancienne série, **items chinois uniquement**.
- Série `_B` (« Intensifying Elixir ») : série courante, **CH + EU** (codenames `ITEM_ETC_ARCHEMY_REINFORCE_RECIPE_WEAPON_B`, etc.).

### Degrés
- Les élixirs **ne sont PAS spécifiques d'un degré** : un élixir weapon fonctionne pour toute arme. C'est la **lucky powder** qui doit correspondre au degré de l'item.
- Sources : drops (monstres, uniques — les uniques droppent régulièrement des élixirs _B), quêtes, Battle Arena, Stall Network.

---

## 🍀 Lucky Powders

### Fonctionnement
- Une seule famille d'items (pas de « weapon powder » / « armor powder ») : **Lucky Powder (1st) à (12th)** — une par degré.
- **La powder doit être du même degré que l'item** (sinon refus).
- Vendue par le **Grocery Store / Grocery Owner** de chaque ville (très bon marché).
- Le bonus ajouté dépend du palier de + (voir tableau plus haut) : +50% en +1, +30% en +2, +20% en +3, puis +8%.

### Variante : Lucky Magic Powder
- Série `_B` (`ITEM_ETC_ARCHEMY_REINFORCE_PROB_UP_B_01..12`, « Lucky Magic Powder (1st–12th) ») : version « magique » au bonus supérieur, obtenue via Magic Pop / events / item mall selon les versions. Peu documentée officiellement.

---

## ✨ Advanced Elixirs (+1/+2 garantis)

Ajoutés avec les mises à jour tardives (items mall « +1/+2 enhancement scrolls » ; noms client : *Advanced Elixir*) :

- **2 types :** Regular (nom blanc) et Sealed (nom jaune).
- **4 familles :** weapon, protector (armor), shield, accessory.
- **Classe A :** +1 **garanti à 100%**. **Classe B :** +2 garantis à 100%.
- **Un seul par item** (pas de stack), permanent, **non retirable**.
- Si l'enhancement échoue ensuite, l'item retombe au minimum au niveau du bonus (ex. +2 avec un Adv. B) — le bonus protège donc partiellement.
- **Obtention :** destruction d'équipement de haut niveau/full blue (le « destroying +5 FB equipment » donne des B-grade), Magic Pop, item mall.

---

## 🪨 Tablettes, Éléments et Pierres

### La chaîne de production

```
Monstres → tablets + matériaux (herbes, fragments…)
Tablet + Elément → Pierre (stone)          [onglet alchimie]
Pierre + Équipement → blue/stat ajoutée     [Att. Assimilate]
```

### Éléments (Earth / Water / Fire / Wind)
- **Void Rondo** (bijoutier) : dissout les **matériaux** droppés (herbes, etc.) → éléments.
- **Destroyer Rondo** : **détruit un équipement** → éléments (quantité liée au prix de l'item). Détruire un item avec une blue peut donner une **pierre** du même degré et du même type de stat.
- Éléments de niveau 1 à 12 (ex. « Earth element (11th Lvl.) »).

### Les 3 familles de tablettes (par gemme)

| Famille | Couleur | Produit | Effet sur l'item |
|---------|---------|---------|------------------|
| **Jade tablet of X** | Verte | Magic stones | **Ajoute une blue** (Str, Int, HP, resistances, Lucky…) |
| **Ruby tablet of X** | Rouge/Rose | Attribute stones | **Reset/re-roll** d'une stat blanche de l'item |
| **Sapphire tablet of X** | Bleue | Drugs (speed) | Potions de vitesse (Drug of breeze/wind/gales/typhoon) |

### Tablettes Jade (magic stones — ajout de blues), niveaux 1–12
Str, Int, Master (durabilité %), Strikes (attack rating %), Discipline (blocking rate, arme), Penetration (critical, bouclier), Dodging (parry rate %, armure), Stamina (HP, plastron/jambes/tête), Magic (MP, plastron/jambes/tête), Fogs (resist frostbite), Air (resist electric shock), Fire (resist burn), Immunity (resist poison), Revival (resist zombie), **Immortal**, **Steady**, **Luck**, **Astral**.

### Tablettes Ruby (attribute stones — reset des stats blanches), niveaux 1–12
Courage (attaque physique arme), Warriors (reinforce phy arme), Philosophy (attaque magique arme), Meditation (reinforce mag arme), Challenge (critical arme), Focus (attack rating arme), Flesh (def phy armure/bouclier), Life (reinforce phy armure/bouclier), Mind (def mag armure/bouclier), Spirit (reinforce mag armure/bouclier), Dodging (parry ratio armure), Agility (block ratio bouclier), Training (absorption phy accessoire), Prayer (absorption mag accessoire).

### Chances des pierres (assimilation)
- La **chance d'application** de la pierre est stockée dans la DB par degré (décroissante avec le degré, bornée 5–100%). Les guides communautaires avancent ~30–55% selon le degré — données exactes dans `_RefObjItem.Param4`.
- Après une réussite, une **assimilation secondaire** peut se déclencher (taux propre à chaque pierre, affiché sur l'item) : elle modifie **au hasard** une AUTRE stat de l'item (blanche ou blue) → c'est le risque des pierres (elles peuvent améliorer… ou dégrader une autre stat).
- Un item possède un **nombre maximal de blues** (champ MaxMagic de la DB, jusqu'à 12).
- Les valeurs des blues sont tirées d'un **ensemble de valeurs par degré** (paires min/max dans `_RefMagicOpt`), bornées 1–1700.

---

## 💎 Blues (Magic Options) — Catalogue Complet

Textes exacts affichés en jeu (extrait de `_RefMagicOpt` / client) :

| Blue (groupe MATTR) | Libellé en jeu | Cible habituelle |
|--------------------|----------------|------------------|
| `MATTR_STR` | Str +X Increase | Armes, accessoires (via stones) |
| `MATTR_INT` | Int +X Increase | Armes, accessoires |
| `MATTR_HP` | HP +X Increase | Plastron/jambes/tête |
| `MATTR_MP` | MP +X Increase | Plastron/jambes/tête |
| `MATTR_DUR` | Durability +X% Increase | Toutes pièces |
| `MATTR_HR` | Attack rate +X% Increase | Armes |
| `MATTR_EVADE_BLOCK` | Blocking rate +X | Armes |
| `MATTR_EVADE_CRITICAL` / `MATTR_CRITICAL` | Critical +X | Boucliers / armes |
| `MATTR_ER` | Parry rate +X% Increase | Armures |
| `MATTR_RESIST_FROSTBITE` | Frostbite -X% | Accessoires |
| `MATTR_RESIST_ESHOCK` | Electric shock -X% | Accessoires |
| `MATTR_RESIST_BURN` | Burn -X% | Accessoires |
| `MATTR_RESIST_POISON` | Poisoning -X% | Accessoires |
| `MATTR_RESIST_ZOMBIE` | Zombie -X% | Accessoires |
| `MATTR_RESIST_CSMP` | Combustion probability -X% | (sets tardifs) |
| `MATTR_RESIST_SLEEP/STUN/FEAR/DISEASE` | Sleep/Stun/Fear/Disease -X% | (sets tardifs) |
| `MATTR_REGENHPMP` | HP/MP recovery +X% | (rare) |
| `MATTR_LUCK` | Lucky (X Times) | Protection |
| `MATTR_SOLID` | Steady (X Times) | Protection |
| `MATTR_ASTRAL` | Astral (X Times) | Protection |
| `MATTR_ATHANASIA` | Immortal (X Times) | Protection |
| `MATTR_DEC_MAXDUR` | Max durability -X% | **Malus** d'échec d'alchimie |
| `MATTR_NOT_REPARABLE` | Not repairable | Items d'event |

**Blues d'avatar** (spécifiques) : Str/Int/HP/MP, Parry/Attack rate, Damage Absorption (DARA), Ignore Monster Defense (MDIA 1–4), etc.

### Plages de valeurs par degré
Les valeurs sont définies par degré dans `_RefMagicOptByItemOptLevel` (dump public non disponible). Ordres de grandeur communautaires : Str/Int de +1 (1D) à +7/+10 (11D+) ; resistances de ~5% à ~20% ; HP/MP de quelques dizaines à plusieurs centaines. **Non vérifiable faute de dump public — à traiter comme indicatif.**

> 📝 **Note :** des blues comme « Providence », « Deadly/Keen » ou « Olympic » n'apparaissent pas dans les données officielles PC (vSRO 1.188 / client v1_657). « Olympic » renvoie aux items de l'event JO 2008, les autres proviennent de jeux privés ou d'autres jeux.

---

## 🎲 Stratégies d'Alchimie

### Stratégie 1 : La « Safe Route » (recommandée)
- Monter +0 → +4 (coûte peu, 27–100% par tentative).
- S'arrêter à +5/+6 sur le matériel courant.
- Ne tenter +7+ que sur du stuff de valeur avec Steady (+ Immortal sur SOX).

### Stratégie 2 : Le calcul d'espérance (modèle Hyperbot)
Avec les vrais taux (élixir+powder : 100/70/50/27/25…), la probabilité d'atteindre +5 d'affilée depuis +0 est de **~0.2%** (0.5058 × 0.4007 × 0.2999 × 0.1913 × 0.1768). Ne jamais « all-in » un item unique : stockpiler des élixirs avant de tenter un palier (ex. ~230 élixirs pour avoir 80% de chances de finir +5 ou +6).

### Stratégie 3 : Acheter déjà « + »
Un item +5/+6 en Stall est souvent moins cher que le coût espéré en élixirs/powders pour y arriver soi-même. Comparer systématiquement.

### Stratégie 4 : Les protections d'abord
- **Toujours Steady** dès +5 (pas cher).
- **Immortal** obligatoire sur SOX/Egypt (+6 et au-delà).
- **Astral** pour sécuriser un +4 acquis (évite le retour à +0).
- **Magic stone of Luck** juste avant une tentative importante (+5%).

### Erreurs classiques
1. Tenter +5+ sans Steady/Immortal sur du stuff cher.
2. Croire aux « streaks » ou aux emplacements porte-bonheur (RNG pur, tentatives indépendantes).
3. Oublier que la lucky powder doit être **du même degré** que l'item.
4. Faire de l'alchimie « tilted » après un break (décisions irréfléchies).

---

## 🔬 Données Vérifiées (Ground Truth)

### 1. Base de données du serveur (vSRO / iSRO)
Les Param2/3/4 de `ITEM_ETC_ARCHEMY_REINFORCE_RECIPE_WEAPON_B` unpackés en octets donnent **50,40,30,19 / 17,17,17,17 / 17,12,12,12**. La Lucky Powder (10th) : **50,30,20,8 / 8,8,8,8 / 8,8,8,8**. (Source : blog HyperbotDoc, confirmé par le projet opensro.)

### 2. Mesures automatisées (GM /makeitem)
- 30 000 échantillons élixir seul ; ~2 000 élixir+powder ; ~50 000 avec Magic Stone of Luck (11 personnages en parallèle) ; ~70 000 avec Premium/avatar.
- Conclusions : bonus **additifs plats** (Luck stone = +5%, Premium PLUS = +5%, avatar Lucky = +X%), conformes à la DB.

### 3. Logique décompilée du gameserver (projet opensro)
- Tirage `rand % 100 < chance` ; chance = taux élixir + powder (si < 100) + 5% (Lucky) + bonus, bornée [10,100].
- Échec : reset +0 ; à +5+ : 50% destruction (Immortal la nie) / 50% malus durabilité (Steady la nie) ; Astral : plancher +4.
- Maximum 12 blues par item ; valeurs bornées 1–1700.

### ⚠️ Ce qui reste incertain
- Taux exacts de la Lucky **Magic** Powder (série B).
- Chances d'application des pierres par degré (dans la DB, non publiées).
- Plages de valeurs des blues par degré.

---

## ❓ FAQ

### Q: L'alchimie est-elle obligatoire ?
**R:** Pour jouer en PvE casual, non. Pour être compétitif late game/PvP, un set +3/+5 minimum est attendu, +7+ pour l'endgame.

### Q: Quel est le meilleur + pour le prix ?
**R:** +4 est quasi gratuit (27–50% par tentative). +5/+6 est le sweet spot rapport/risque. Au-delà, le coût explose (840 élixirs en moyenne pour +5 « garanti » à 90%… depuis +0).

### Q: À partir de quel + l'item peut-il casser ?
**R:** À partir de **+5** (tentative vers +6+) : à chaque échec, 50% de destruction, 50% de malus de durabilité.

### Q: Que fait exactement l'Astral ?
**R:** En cas d'échec (au-delà de +4), l'item retombe à **+4** au lieu de +0. Il ne protège NI de la destruction, NI du malus de durabilité (rôles d'Immortal et Steady).

### Q: Les rates dépendent-ils du degré de l'item ?
**R:** Non (données DB). Le degré influence uniquement le prix des matériaux. Les serveurs privés peuvent modifier tout ça.

### Q: Existe-t-il un « crit success » qui donne +2 d'un coup ?
**R:** Aucune trace dans les données du serveur ni dans les mesures massives. Considérer comme mythe.

### Q: Puis-je faire l'alchimie sur des items SOX ?
**R:** Oui, mais protégez-les : Immortal (destruction) + Steady (durabilité) + Astral (plancher +4). Un SOX détruit est perdu.

### Q: Lucky Powder obligatoire ?
**R:** Quasi — elle est bon marché et double quasiment les taux bas (+50% en +1). Ne jamais alchimier sans powder au-delà de +2.

---

## 🔗 Resources

### Données vérifiées / reverse engineering
- [HyperbotDoc — Alchemy: Elixirs (taux réels, mesures GM)](https://sandsnip3r.github.io/HyperbotDoc/_posts/2024-03-17-alchemy-elixirs/) (repo GitHub `SandSnip3r/HyperbotDoc`)
- [HyperbotDoc — Alchemy: Luck](https://sandsnip3r.github.io/HyperbotDoc/_posts/2024-04-20-alchemy-luck/)
- [opensro — implémentation décompilée de l'alchimie](https://github.com/opensro-dev/opensro) (`apps/server/internal/game/item/alchemy/`)
- [Simulateur d'alchimie (client v1_657)](https://silkroadonline.wiki/tools/alchemy)

### Guides communautaires
- [Elitepvpers — Alchemy Principals (tablets, elements, blues)](https://www.elitepvpers.com/forum/sro-guides-templates/212591-guide-alchemy-principals.html)
- [Elitepvpers — Advanced Elixir Facts](https://www.elitepvpers.com/forum/sro-guides-templates/1362467-guide-advanced-elixir-facts.html)
- [Elitepvpers — Complete Guide for Silkroad Starters](https://www.elitepvpers.com/forum/sro-guides-templates/2407342-complete-guide-silkroad-starters.html)
- [Silkroad Forums — Tips & Hints to become a successful alchemist](http://www.silkroadforums.com/viewtopic.php?f=7&t=110014)
- [Tablets et fonctions (TR, DonanımHaber)](https://forum.donanimhaber.com/tabletler-ve-islevleri--13403834)
- [Piedras — tipos y función (ES, Silkroadmania)](https://silkroadmania.wordpress.com/2007/05/25/piedras-tipos-y-funcion/)
- [Silkroad Forums — Alchemy myths: does your totem work](https://fgwgame.com/guides/silkroad-online-alchemy-myths-does-your-totem-actually-work)

### Données d'items (codenames)
- [ItemData vSRO — ClientLibGUII ItemDataGenerated.h](https://github.com/aloneanqel1453/ClientLibGUII/blob/master/source/libs/ClientLib/src/ItemDataGenerated.h)
- [RSBot — RefMagicOptExtension (libellés des blues)](https://github.com/myildirimofficial/RSBot/blob/master/Botbases/RSBot.Alchemy/Extension/RefMagicOptExtension.cs)
- [ducksoup — schémas DB vSRO188 (_RefMagicOpt*)](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188/SRO_VT_SHARD)

---

## 📚 Voir aussi

### Équipement
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - SOS, SOM, SOSun, Nova, Egypt
- [Item Degrees](07_ITEM_DEGREES.md) - Système 1D-13D
- [Armor Types](08_ARMOR_TYPES.md) - Armor, Protector, Garment

### Économie
- [Hub Économie](HUB_ECONOMIE.md) - Centralise économie et équipement
- [Economie et Or](22_ECONOMY_GOLD.md) - Coût de l'alchimie et farming
- [Stall Network](23_STALL_NETWORK.md) - Acheter/vendre elixirs et lucky powders

### Guides Connexes
- [Index des Items](31_ITEMS_DATABASE.md) - Base de données items
- [Consommables](21_CONSUMABLES.md) - Drugs de vitesse (alchemy), potions

### Ressources Techniques
- [Mécaniques Avancées](28_ADVANCED_MECHANICS.md) - Détails techniques

---

*Dernière mise à jour: 2026-10-01*
*Sources: DB vSRO dépackée (HyperbotDoc/SandSnip3r), opensro (logique décompilée), elitepvpers, silkroadforums, DonanımHaber, Silkroadmania, ItemData vSRO*
