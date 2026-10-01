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
- [🇰🇷 Alchimie KSRO 12D+ (2011-2026) : 인핸서, 보호석, montée de degré](#-alchimie-ksro-12d-2011-2026--인핸서-보호석-montée-de-degré)
- [Tablettes, Éléments et Pierres](#-tablettes-éléments-et-pierres)
- [Blues (Magic Options) — Catalogue Complet](#-blues-magic-options--catalogue-complet)
- [Stratégies d'Alchimie](#-stratégies-dalchimie)
- [Mythes & Superstitions (documentés et démentis)](#-mythes--superstitions-documentés-et-démentis)
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
- 🇰🇷 **KSRO 12D+** : au-delà du 11차, le service coréen remplace ce système par les **인핸서 (Enhancers)** — échec = **destruction de l'item ET de l'enhancer**, sauf **보호석 (protection stone, -1)** — voir [🇰🇷 Alchimie KSRO 12D+](#-alchimie-ksro-12d-2011-2026--인핸서-보호석-montée-de-degré)

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

Confirmation TR : les administrateurs de privés vSRO ajustent les taux **via le champ Lucky Powder** — c'est LE levier de tuning côté serveur (vSRO.org : https://www.vsro.org/konular/alchemy-rate-ayarini-nasil-yapiyorsunuz.18197).

Exemples documentés de taux **[CUSTOM]** — recherche PS/AR 2026-10, à ne jamais confondre avec les taux officiels ci-dessus :
- **ErTuGrul SRO** (cap 140/D16) : « **Alchemy Rate: 3x** » — multiplicateur global annoncé par le serveur. Source : https://www.facebook.com/groups/158370414830944 · [ML_RESEARCH/RESEARCH_AR_SERVERS.md](ML_RESEARCH/RESEARCH_AR_SERVERS.md)
- **Chillout Community** (cap 130/DG14) : +1~+5 = **100 %**, +6 = **90 %**, +7 « augmenté », élixirs avancés jusqu'à +5. Source : [elitepvpers 4016229](https://www.elitepvpers.com/forum/sro-pserver-advertising/4016229-chillout-community-silkroad-cap-130-dg-14-coin-system-play2win-silk-h-fgw-old-job.html)
- **SENSATION-iSRO** (cap 140) : max **+15** (sauf ADV). Source : [srocave](https://srocave.com/konular/sensation-isro-140-cap-no-p2w-100-play-to-earn-unique-job-based-join-the-adventure.3252)

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
- Détail d'achat (guide BR ~2011, Fúria Brazil) : à Donwhang, fenêtre d'action **touche A** → onglet parchemin → bouton **Joint** (source : https://furia-brazil.forumeiros.com/t9-guia-basico-do-silkroad).
- Le bonus ajouté dépend du palier de + (voir tableau plus haut) : +50% en +1, +30% en +2, +20% en +3, puis +8%.
- ✅ **Additivité confirmée indépendamment (recherche TR 2026-10)** : SroCave a unpacké les `Param` du powder — `840832008` → 50,30,20,8 et `134744072` → 8,8,8,8 — le bonus **s'additionne** au taux d'élixir (voir [Données Vérifiées](#-données-vérifiées-ground-truth)).

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
- 🇰🇷 **Noms officiels KR** (site officiel KSRO) : **고급 강화 엘릭시르 A급** (+1, « 100 % 장비가 강화된다 ») et **B급** (+2, 100 %), **par degré** (« 차수별로 존재합니다 »), en 4 familles arme/armure/bouclier/accessoire, à utiliser via la 연금상자 (boîte d'alchimie), onglet 조합 — [page officielle alchemy_item](https://krsilkroadcp.joymax.com/gamedata/item/alchemy_item.asp) (détail : section [🇰🇷 ci-dessous](#-alchimie-ksro-12d-2011-2026--인핸서-보호석-montée-de-degré)).

---

## 🇰🇷 Alchimie KSRO 12D+ (2011-2026) : 인핸서, 보호석, montée de degré

> Issu du rapport `ML_RESEARCH/RESEARCH_KO2_ITEMS.md` (2026-10-01, §8-§13). Sources primaires : **site officiel KSRO** `krsilkroadcp.joymax.com`, pages 연금술 (alchimie) en EUC-KR converties manuellement (fiabilité 5) — portail : [alchemy.asp](https://krsilkroadcp.joymax.com/gamesystem/alchemy/alchemy.asp). Cette section décrit le **service coréen vivant** : l'alchimie y **bifurque officiellement** entre items ≤ 11차 et items ≥ 12차.

### La bifurcation officielle : deux systèmes

| | **≤ 11차 (système « classique »)** | **≥ 12차 (nouvel onglet 강화)** |
|---|---|---|
| Matériau | **강화 엘릭시르** (élixir) + **행운의 가루** (lucky powder par degré) | **인핸서 (Enhancer)** |
| Échec | reset à +0 ; dès +5 : perte de durabilité max **ou destruction** | **« 아이템과 사용한 인핸서 모두 소멸된다 » — l'item ET l'enhancer sont détruits** |
| Protections | blues 행운/견고/불멸/아스트랄 (Lucky/Steady/Immortal/Astral) | **보호석 (Protection Stone)** — évite la destruction mais **-1** |
| Options d'aide au mall | 아스트랄/불멸의 연금석 vendus **par 차수 1→11** (5/11/14/19/24/30/38/46/51/62/**70 실크**) | **aucune** (le mall n'en vend plus au-delà du 11차) |

Sources : [equipmentstrength_2.html](https://krsilkroadcp.joymax.com/gamesystem/alchemy/iframe_alchemy/equipmentstrength_2.html) (officiel, « 12차 이상 아이템만 강화가 가능하다 ») · [mall ARCHEMY/ASTRAL & ATHANASIA](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ASTRAL) (prix 2026).

### 인핸서 (Enhancers) — l'enhancement 12차+

- **4 types** (무기/방어구/방패/악세서리 = arme/armure/bouclier/accessoire), **obtenus par la chasse** (« 인핸서는 사냥을 통해 획득할 수 있다 »).
- **Succès :** +1 (강화등급 +1). **Échec : destruction de l'item ET de l'enhancer** — fini le reset à +0 du système classique.
- Texte officiel intégral : [equipmentstrength_2.html](https://krsilkroadcp.joymax.com/gamesystem/alchemy/iframe_alchemy/equipmentstrength_2.html).

### 보호석 (Protection Stones) — l'anti-destruction 12-17차

- « 보호석을 사용할 경우 아이템이 소멸되지 않는 대신 **강화등급이 -1 하락한다** » — avec protection stone, l'échec **ne détruit plus l'item** mais lui fait **perdre 1 niveau** d'enhancement.
- **Spécifiques au degré ET à la rareté** : une pierre par 차수 (12/13/14/15/16/17차) et par grade (**매직/레어/레전드**).
- Prix mall 2026 ([mall ARCHEMY/ETC](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ETC)) : **매직 8 실크 · 레어 16 실크 · 레전드 32 실크** (identique pour chaque degré 12→17차).

### Montée de degré : 각석 / 특수각석 (Awakening Stones)

Onglet « 업그레이드 » de la fenêtre d'alchimie [Y] — [page officielle itemupgrade.asp](https://krsilkroadcp.joymax.com/gamesystem/alchemy/itemupgrade.asp) :

- **Condition :** « **11차 +7 강화 등급 이상 아이템만** 업그레이드가 가능 » — seuls les items 11차 **+7 ou plus** peuvent monter d'un degré (les items avec « 옵 레벨 강화 주문서 » (scroll d'option-level) en sont exclus).
- **각석 (Awakening Stone)** : 4 types (arme/armure/bouclier/accessoire), **droppées en chasse**, taux < 100 %.
- **Succès :** l'item monte d'**un degré** (« 연금한 아이템 차수 +1 아이템으로 성장 »).
- **Échec :** « 장비는 소멸되지 않고, **각석만 소멸된다** » — **l'objet survit, seule la pierre est perdue**.
- **특수 각석 (Special Awakening Stone)** : upgrade **« 100 % 확률 »** — mall 2026 : **11차 45 실크 · 12차 50 실크 · 13차 55 실크** (par type, descriptions officielles « 11차 → 12차 », « 12차 → 13차 », « 13차 → 14차 ») — le cycle upgrade 12→14차 était **toujours actif en 2026**.
- ⚠️ **Héritage — texte officiel précieux :** « 아이템이 가지고 있던 **속성/매직속성은 승계되지 않으며, 소켓석만 승계된다** » — lors d'une montée de degré, **les stats/blues ne sont PAS conservées ; seuls les socket stones sont hérités**.
- *(Recoupement EN, fiabilité 2-3 — [elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/1264143-guide-upgrading-11d-items-12d.html))* : la conversion des grades serait 11D normal → 12D 매직, 11D rare (Nova/혜성) → 12D 레어, 11D « Legend » → 12D 레전드 — non officiel.
- namu.wiki (extrait) : **avant Legend 23 (05/2023), on montait ses pièces 12→13→14→15차 par ce système** ; depuis, les 16-17차 s'obtiennent par drops/box.

### Sockets : 소켓석 (3 emplacements max)

[Page officielle sokect.asp](https://krsilkroadcp.joymax.com/gamesystem/alchemy/sokect.asp) :

- « 하나의 아이템의 최대 **3개의 소켓**까지 만들 수 있다 » — **3 sockets max par item** ; pas 2 fois la même 소켓석 sur un même item.
- **6 types de 소켓석**, chacune porte **un skill propre** : **신속** (회피율 +, durée limitée), **마력** (MP +), **회복** (auto-soin), **정신력** (chance que le prochain skill ne consomme pas de mana), **체력** (HP +), **집중** (명중률 +).
- Le grade de la pierre doit être **≥ au grade de l'item** (« 소켓석 등급이 아이템 등급보다 낮은 경우에는 사용할 수 없다 »).
- Rappel : les 소켓석 sont **les seules choses héritées** lors d'une montée de degré (ci-dessus) — d'où leur importance au haut-niveau.

### 연금약 : les potions d'alchimie (고급 연금술)

[Page officielle medical.asp](https://krsilkroadcp.joymax.com/gamesystem/alchemy/medical.asp) — le « 고급 연금술 » du menu KR correspond aux **연금약** (potions, craft 가공) :

| 연금약 | Effet officiel |
|---|---|
| **미풍의 단약** | +25 % vitesse de déplacement, 30 min |
| **강풍의 단약** | +50 %, 30 min |
| **질풍의 단약** | +75 %, 30 min |
| **태풍의 단약** | +100 %, 30 min |

- Fabriquées à partir de **청옥서판/적옥서판** (tablettes droppées) + **4대 원소** (éléments terre/feu/eau/vent) ; « **속성석을 제작할 때에는 실패확률이 없다** » (fabrication des 속성석 **sans échec possible**).
- ⚠️ Le folklore web « 청마노/정수 » apparu dans un résumé automatique est **erroné** (mojibake du résumeur) — le texte officiel parle bien de 서판 et 원소 (mise en garde du rapport KO2 §13).

### ⚠️ Taux : rien d'officiel côté KR (classique comme 12차+)

- **Aucune table de probabilités officielle** n'est publiée côté coréen — ni pour l'enhancement, ni pour l'upgrade 각석, ni pour les sockets. Les taux documentés plus haut dans ce fichier proviennent de la **DB vSRO dépackée** (HyperbotDoc/SroCave).
- Conflit signalé : les guides communautaires KR citent **+1 : 70 % → +7 : 10 %** (avec 행운의 가루 — [café Daum kkndfs](https://m.cafe.daum.net/kkndfs/3un1/6), fiabilité 3), chiffres **incompatibles** avec les totaux DB vSRO (100/70/50/27/25…) — les deux jeux de valeurs décrivent des époques/services différents ou des mesures divergentes ; à traiter comme communautaire, non officiel.
- Pour le 12차+ (인핸서), **aucun % n'a été trouvé nulle part** — extraction client seule voie (confirme le constat ZH du rapport RESEARCH_ZH Trouvaille 6).

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

> 📝 **Corrections communautaires d'époque** (thread DE 2007, même source que ci-dessus) : Meditation et Warrior s'appliqueraient **aussi aux armures** (pas uniquement aux armes) ; Steady **n'existe pas** pour les accessoires ; « Tablet of Agility » = bien le ratio de **block** (pas la parade) — la nomenclature TR (DonanımHaber) aboutit aux mêmes fonctions.

### Chances des pierres (assimilation)
- La **chance d'application** de la pierre est stockée dans la DB par degré (décroissante avec le degré, bornée 5–100%). Les guides communautaires avancent ~30–55% selon le degré — données exactes dans `_RefObjItem.Param4`.
- Après une réussite, une **assimilation secondaire** peut se déclencher (taux propre à chaque pierre, affiché sur l'item) : elle modifie **au hasard** une AUTRE stat de l'item (blanche ou blue) → c'est le risque des pierres (elles peuvent améliorer… ou dégrader une autre stat).
- 🇩🇪 **Lecture du « % » (guide DE 2007)** : le pourcentage affiché sur les attribute stones (souvent 10–30%) est la **probabilité de re-roll des autres stats** de l'item lors de l'assimilation — et il s'applique **même si la pierre elle-même échoue** (Alchemie-Guide, silkroadonline.de, 29.12.2007 : https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/alchemy/18242-alchemie-guide).
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
Les valeurs sont définies par degré dans `_RefMagicOptByItemOptLevel` (paires min/max par degré et par groupe MATTR). ✅ **Résolu (recherche PS 2026-10) — la table existe publiquement** : son **schéma est public** dans le repo [ducksoup — Database/VSRO188](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188) (schémas C# des ~200 tables de la shard vSRO 1.188, avec `_RefMagicOpt`, `_RefMagicOptAssign`, `_RefMagicOptGroup`, `_RefAbilityByItemOptLevel`), et ses **données sont présentes dans chaque dump public de DB vSRO** (compilations « SRO Game Files v1.188 », « Silkroad Database v1.188 V2 », packs cap 120 — recensement dans [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) §4-§5). L'ancien constat « dump public non disponible » est donc **corrigé** ; l'extraction des paires min/max reste à faire. En attendant, les ordres de grandeur communautaires restent indicatifs : Str/Int de +1 (1D) à +7/+10 (11D+) ; resistances de ~5% à ~20% ; HP/MP de quelques dizaines à plusieurs centaines.

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

## 🧿 Mythes & Superstitions (documentés et démentis)

> 🕵️ Témoignages communautaires datés et sourcés (FR 2007, DE 2006-2008, TR moderne) — **aucun de ces rituels n'a d'effet** d'après les taux de la DB et les mesures massives (voir [Données Vérifiées](#-données-vérifiées-ground-truth)). Ils restent précieux comme lore et sociologie du jeu.

### 🇫🇷 Superstitions françaises de 2007 (GMS Temple)

Source : fil « Existe-t-il une technique pour réussir ses alchimies ? » (juillet-août 2007) — https://forum.gmstemple.com/index.php?showtopic=2605

| Rituel documenté | Description (fil d'époque) | Démenti |
|------------------|----------------------------|---------|
| « Le HL réussit mieux » | Un HL qui alchimise un item low level réussirait mieux (Seigaku) — l'admin Euclide_ répond : « avoir du bol », « plus on est HL, plus on peut se permettre de claquer des élixirs » | Le taux ne dépend ni du niveau du perso ni de l'item (DB) |
| Méthode des 3 élixirs (_MiRe_) | 3 élixirs + 3 poudres de chance, les 2 premiers « le plus vite possible », puis **attendre ~8 secondes** avant le dernier (variante : le 3e « en fermant les yeux ») | Timing sans effet — tentatives indépendantes |
| Sacrifice d'anneau | Bloqué à +X ? Faire échouer un élixir d'accessoire sur un anneau en inventaire, puis retenter la cible — « ça marche près de 90% du temps » (ressenti) | RNG indépendant ; l'auteur du fil a fini par **détruire une glavie SoS (lv 16) +5 en tentant +6** et conclut lui-même que tous ces trucs « c'est des conneries » |
| Changer de coin de ville | Se déplacer dans un autre coin de la ville après +3 avant de tenter +4/+5 (Ptimass) | L'emplacement n'a aucun effet |
| « Lucky planqué » | Croyance en un facteur chance **caché par item** (seren) | La chance = taux DB + bonus additifs documentés (powder, Lucky stone, premium) |
| Premium « nul voire négatif » | « Avec le premium je rate toujours, sans premium ça passe du premier coup » | Premium PLUS = **+5%** mesuré (HyperbotDoc + SroCave) |

- Autres témoignages d'époque : **40 élixirs de bouclier** sans parvenir à +3 ; **100+ élixirs d'arme** pour remonter une glavie +5 après un échec +6 — ordres de grandeur plausibles au vu des resets à +0. Consensus 2007 : « +9 tu oublies, ça marche pas » (à 20%/tentative avec powder).
- L'admin moquait l'ensemble : « On a plus de succès en s'habillant de vieux caleçons. »
- Seuls boosteurs reconnus légitimes par la communauté FR : **poudre de chance, blue « lucky », pierre Immortal**.
- La glavie SoS +5 détruite en tentant +6 **corrobore la règle « destruction possible dès la tentative +5 → +6 », déjà effective en 2007**.

### 🇩🇪 Mythes allemands — débunkés in-thread (2006-2008)

Sources : Alchemie-Guide (silkroadonline.de, 29.12.2007 — URL ci-dessus) + elitepvpers « Alchemy trics » (https://www.elitepvpers.com/forum/silkroad-online/174665-alchemy-trics.html)

- **« L'élixir weapon est plus rare »** (affirmé par ThE_Pa!N) — corrigé dans le fil même par smegin/Trava : **taux de drop identiques pour les 4 types d'élixirs** ; S3xyCrunK_06 : « 25% chacun » (répartition uniforme).
- **« Il existe un trick »** — consensus elitepvpers : « **kein Trick** », la chance est fixée côté serveur (recoupé par le debunk moderne NoNo, 2020 : https://www.elitepvpers.com/forum/sro-private-server/4723508-silk-road-alchemy-debunk-nono.html).
- Jargon DE d'époque : « **pimpen** » = faire des + ; fenêtre d'alchimie = touche **Z** sur clavier QWERTZ (= Y en QWERTY).

### 🇹🇷 Turquie moderne — le mythe du RNG pur

- SroLobby (https://www.srolobby.com/konular/alchemy-basari-oranlari.273) : le vétéran *onder* (2020) conteste l'existence de taux fixes (« certains passent +12 d'affilée sans rien, d'autres échouent +5 avec premium + lucky dress ») — démenti par les mesures massives (30 000+ tentatives) : les taux sont fixes, seule la variance est normale.
- SroCave « Temel Bilgiler » présente un **maximum +9** (vision ancienne / serveur classique) : https://srocave.com/konular/silkroad-online-oyunu-hakkinda-en-temel-bilgiler-karakter-yapilandirmasi-ve-itemler.2635

### 🇨🇳 Espace web chinois — constat négatif

- Ni le wiki officiel TW (DiGeam), ni l'opérateur CN (iccgame), ni 17173 ne publient **aucune table de taux** ; les chiffres qui circulent en chinois (+15 max, « 100% de succès sous +5 ») appartiennent aux **remakes mobiles 2024+ et aux serveurs privés** — pas au PC original. La seule voie fiable reste l'extraction client/DB. (Recherche ZH 2026-10)

### 🗣️ Glossaire alchimie multilingue (attesté dans les sources)

| Terme iSRO | 🇫🇷 FR | 🇩🇪 DE | 🇹🇷 TR | 🇵🇹 PT-BR |
|---|---|---|---|---|
| Alchimie / enhancement | alchimiser, « monter » / « passer +3 » | die Alchemie, « pimpen » | simya, artı basma | alquimia, aprimoramento |
| Élixir | élixir (arme/bouclier/accessoire) | der Waffenelixier / Schutzwall-Elixier | iksir | elixir |
| Lucky Powder | poudre de chance | das Glückspulver | şans tozu | pó da sorte |
| Pierre / tablette | pierre, tablette | der Stein / die Tablette | taş | pedra |
| Échec / destruction | « failed » (verbe francisé) | der Fehlversuch / « Failsafe » | yanma (« brûler »), sıfırlanma (reset +0) | falha |
| Blue de protection | Immortal / Steady / Lucky | der Unsterblichkeitsstein / standhaft / der Glücksstein | kırılmayı önler (Immortal), dayanıklılık (durabilité) | imortal / estável / sortudo |
| Éléments | éléments | Feuer / Erde / Wasser / Luft | — | elementos |

*(Sources : glossaires FR/DE/TR/PT des rapports ML_RESEARCH 2026-10.)*

---

## 🔬 Données Vérifiées (Ground Truth)

### 1. Base de données du serveur (vSRO / iSRO)
Les Param2/3/4 de `ITEM_ETC_ARCHEMY_REINFORCE_RECIPE_WEAPON_B` unpackés en octets donnent **50,40,30,19 / 17,17,17,17 / 17,12,12,12**. La Lucky Powder (10th) : **50,30,20,8 / 8,8,8,8 / 8,8,8,8**. (Source : blog HyperbotDoc, confirmé par le projet opensro.)

### 2. ✅ Validation croisée indépendante — SroCave (recherche TR 2026-10)
Le site turc SroCave a décompressé les mêmes valeurs `Param` 32-bit (4 octets → 4 taux 8-bit), **indépendamment** d'HyperbotDoc :
- `unpack(841489939)` → 50, 40, 30, 19 · `unpack(286331153)` → 17, 17, 17, 17 · `unpack(286002188)` → 17, 12, 12, 12 — **identiques** aux taux DB ci-dessus.
- Lucky Powder : `unpack(840832008)` → 50, 30, 20, 8 (paliers +1→+4) ; `unpack(134744072)` → 8, 8, 8, 8 (+5→+12) — le powder **s'additionne** au taux d'élixir (additivité confirmée explicitement, plafond 100%).
- Mesure sur 30 000 tentatives : 50.58% / 40.07% / 29.99% / 19.13% / 17.68% — mêmes valeurs que les mesures HyperbotDoc.
- Magic Stone of Luck : pose à 100%, **+5% sur la tentative suivante** puis disparaît (~50 000 échantillons, intervalle de confiance de Wilson) ; Premium PLUS : **+5%** fixe ; avatar Lucky : mécanisme identique au Lucky stone.
- Élixirs minimum pour un palier à 90% de probabilité (calcul récursif f(y,N,x)) : +2 = 10 · +3 = 47 · +4 = 205 · +5 = 840 · +6 = 3 384 — mêmes valeurs que le tableau plus haut. Exemple opérationnel : de +5 vers +6 avec seuil 0.8 → minimum 230 élixirs, 25% d'atteindre l'objectif, 73.47% de retomber à +5.
- Source : https://srocave.com/konular/silkroad-onlineda-arti-basmanin-matematigi-gercek-oyun-kodlariyla-alchemy-basari-oranlari.3523 (TR)

> ✅ **Résolu (recherche TR 2026-10)** : taux de base (50/40/30/19/17/12), additivité du powder (+50/30/20/8/8), Lucky stone +5% et Premium PLUS +5% — validés par une seconde chaîne d'extraction DB + des mesures statistiques indépendantes.

### 3. Mesures automatisées (GM /makeitem)
- 30 000 échantillons élixir seul ; ~2 000 élixir+powder ; ~50 000 avec Magic Stone of Luck (11 personnages en parallèle) ; ~70 000 avec Premium/avatar.
- Conclusions : bonus **additifs plats** (Luck stone = +5%, Premium PLUS = +5%, avatar Lucky = +X%), conformes à la DB.

### 4. Logique décompilée du gameserver (projet opensro)
- Tirage `rand % 100 < chance` ; chance = taux élixir + powder (si < 100) + 5% (Lucky) + bonus, bornée [10,100].
- Échec : reset +0 ; à +5+ : 50% destruction (Immortal la nie) / 50% malus durabilité (Steady la nie) ; Astral : plancher +4.
- Maximum 12 blues par item ; valeurs bornées 1–1700.

### ⚠️ Ce qui reste incertain
- Taux exacts de la Lucky **Magic** Powder (série B).
- Chances d'application des pierres par degré (dans la DB, non publiées) — constat négatif : aucun wiki officiel CN/TW (DiGeam, iccgame) ni 17173 ne publie de table (recherche ZH 2026-10).
- Plages de valeurs des blues par degré — ✅ **accès résolu (recherche PS 2026-10)** : la table `_RefMagicOptByItemOptLevel` est publique (schémas [ducksoup](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188) + données dans les dumps de DB vSRO — cf. [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) §4) ; seules les **valeurs chiffrées** restent à extraire.

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

### Q: 🇰🇷 Comment fonctionne l'alchimie sur les items 12차+ du service coréen ?
**R:** Autre système : **인핸서 (Enhancers)** obtenus en chasse ; succès = +1 ; **échec = l'item ET l'enhancer sont détruits** (« 모두 소멸된다 »). La **보호석 (protection stone)**, spécifique au degré (12→17차) et à la rareté (매직/레어/레전드), évite la destruction mais l'item **perd 1 niveau**. Les options Lucky/Immortal/Astral n'existent que ≤ 11차. La **montée de degré (각석)** exige un item 11차 +7 minimum ; à l'échec seule la pierre est perdue, et **seuls les socket stones sont hérités** (les blues se perdent). Voir [🇰🇷 Alchimie KSRO 12D+](#-alchimie-ksro-12d-2011-2026--인핸서-보호석-montée-de-degré).

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

### Recherche multilingue (2026-10)
- [SroCave — La mathématique des + : taux extraits des codes du jeu (TR)](https://srocave.com/konular/silkroad-onlineda-arti-basmanin-matematigi-gercek-oyun-kodlariyla-alchemy-basari-oranlari.3523)
- [SroCave — Temel Bilgiler (TR, Zombie/Burn, vision +9)](https://srocave.com/konular/silkroad-online-oyunu-hakkinda-en-temel-bilgiler-karakter-yapilandirmasi-ve-itemler.2635)
- [GMS Temple — Existe-t-il une technique pour réussir ses alchimies ? (superstitions FR 2007)](https://forum.gmstemple.com/index.php?showtopic=2605)
- [silkroadonline.de — Alchemie-Guide (DE, 29.12.2007)](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/alchemy/18242-alchemie-guide)
- [Elitepvpers — Alchemy trics : « kein Trick » (DE/EN)](https://www.elitepvpers.com/forum/silkroad-online/174665-alchemy-trics.html)
- [Elitepvpers — Silkroad Alchemy Debunk (NoNo, 2020)](https://www.elitepvpers.com/forum/sro-private-server/4723508-silk-road-alchemy-debunk-nono.html)
- [vSRO.org — ajustement des taux via Lucky Powder (TR)](https://www.vsro.org/konular/alchemy-rate-ayarini-nasil-yapiyorsunuz.18197)
- [SroLobby — taux d'alchimie : le mythe du RNG pur (TR)](https://www.srolobby.com/konular/alchemy-basari-oranlari.273)
- [Fúria Brazil — Guia Básico do Silkroad (PT-BR, ~2011)](https://furia-brazil.forumeiros.com/t9-guia-basico-do-silkroad)

### Taux customs des serveurs privés (recherche PS/AR 2026-10 — [CUSTOM])
- [ErTuGrul SRO — « Alchemy Rate: 3x » (annonce FB du serveur)](https://www.facebook.com/groups/158370414830944) · [annonce elitepvpers](https://www.elitepvpers.com/forum/sro-pserver-advertising/5129038-ertugrul-sro-l-cap140-l-dg16-l-new-system-2.html)
- [Chillout Community — +1~+5 100 %, +6 90 % (elitepvpers)](https://www.elitepvpers.com/forum/sro-pserver-advertising/4016229-chillout-community-silkroad-cap-130-dg-14-coin-system-play2win-silk-h-fgw-old-job.html)
- Rapports : [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) (✅ table `_RefMagicOptByItemOptLevel` publique) · [RESEARCH_PS_HIGHCAP.md](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md) · [RESEARCH_AR_SERVERS.md](ML_RESEARCH/RESEARCH_AR_SERVERS.md) · voir [39_PRIVATE_SERVERS.md](39_PRIVATE_SERVERS.md)

### 🇰🇷 Officiel KSRO — alchimie 12차+ (recherche KO2 2026-10)
- [Portail officiel 연금술 (장비강화/마법속성/속성변경/고급연금술/분해/아이템업그레이드/소켓)](https://krsilkroadcp.joymax.com/gamesystem/alchemy/alchemy.asp)
- [장비 강화 part 2 — 인핸서/보호석 12차+ (« 모두 소멸된다 », « 강화등급이 -1 하락한다 »)](https://krsilkroadcp.joymax.com/gamesystem/alchemy/iframe_alchemy/equipmentstrength_2.html)
- [아이템 업그레이드 — 각석/특수각석 (11차+7, héritage des seuls 소켓석)](https://krsilkroadcp.joymax.com/gamesystem/alchemy/itemupgrade.asp)
- [고급 연금술 — 연금약 (미풍/강풍/질풍/태풍의 단약)](https://krsilkroadcp.joymax.com/gamesystem/alchemy/medical.asp) · [소켓 — 소켓석 (3 max, 6 types)](https://krsilkroadcp.joymax.com/gamesystem/alchemy/sokect.asp)
- [고급 강화 엘릭시르 A/B급 par degré](https://krsilkroadcp.joymax.com/gamedata/item/alchemy_item.asp)
- [Item mall ARCHEMY/ETC — 보호석 12→17차 (8/16/32 실크), 특수각석 11→14차](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ETC) · [ARCHEMY/ASTRAL & ATHANASIA — 연금석 1→11차 (5→70 실크)](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ASTRAL)
- [Café Daum kkndfs — taux communautaires KR 70→10 % (fiabilité 3)](https://m.cafe.daum.net/kkndfs/3un1/6)
- Rapport : `ML_RESEARCH/RESEARCH_KO2_ITEMS.md` (§8-§13, §17)

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
*Sources: DB vSRO dépackée (HyperbotDoc/SandSnip3r), opensro (logique décompilée), elitepvpers, silkroadforums, DonanımHaber, Silkroadmania, ItemData vSRO, SroCave + vSRO.org + SroLobby (validation TR), GMS Temple (superstitions FR 2007), silkroadonline.de (DE), Fúria Brazil (PT-BR) — rapports ML_RESEARCH 2026-10 ; site officiel KSRO krsilkroadcp.joymax.com (인핸서/보호석/각석/소켓석/연금약 12차+) — rapport ML_RESEARCH/RESEARCH_KO2 (2026-10) ; recherche PS/AR 2026-10 (✅ `_RefMagicOptByItemOptLevel` publique via schémas ducksoup/dumps vSRO ; taux customs ErTuGrul/Chillout/SENSATION marqués [CUSTOM])*
