# Mounts et Pets - Guide Complet

> ⚠️ **Révision majeure (2026-10)** : fichier reconstruit à partir de StrategyWiki, des guides elitepvpers (Fellow-Pet System, Devil Spirit), des guides officiels silkroadforever.com (Awesome Mount), de silkroadforums et de la base silkroadonline.wiki. La version précédente contenait de **nombreux pets inventés** (« Rabbit » et « Crow » en attack pets avec skill trees et évolutions en Phoenix/Moon Rabbit, « Fairy Cat »/« Fox »/« Pig » en grab pets, « Camel Lv20 » et « Elephant Lv40 » en transports du Stable) — tout est corrigé ci-dessous avec la taxonomy réelle d'iSRO.

## 📋 Table des Matières
- [Introduction — Taxonomie réelle des pets](#-introduction--taxonomie-réelle-des-pets)
- [Transports de Marchandises (Job)](#-transports-de-marchandises-job)
- [Montures de Déplacement](#-montures-de-déplacement)
- [Growth Pets (Pets d'Attaque)](#-growth-pets-pets-dattaque)
- [Le Système Fellow](#-le-système-fellow)
- [Ability Pets / Pickup Pets (COS)](#-ability-pets--pickup-pets-cos)
- [Devil Spirit et Angel Spirit](#-devil-spirit-et-angel-spirit)
- [🇰🇷 Contenu KSRO (2011-2026)](#-contenu-ksro-2011-2026)
- [Gestion et Soins (Stable-Keeper)](#-gestion-et-soins-stable-keeper)
- [Acquisition et Coûts](#-acquisition-et-coûts)
- [FAQ](#-faq)
- [Notes de Développement (SRObro)](#-notes-de-développement-srobro)
- [Incertitudes / Données Manquantes](#-incertitudes--données-manquantes)
- [Sources](#-sources)

---

## 📚 Introduction — Taxonomie réelle des pets

Contrairement à ce que disait l'ancienne version, Silkroad Online (iSRO) n'a **pas** de « Rabbit/Crow/Fairy Cat ». Les familles réelles sont :

| Famille | Exemples | Rôle | Acquisition |
|---|---|---|---|
| **Transports** | Horse, Ox | Porter les marchandises du Job Trader | Stable (gold) |
| **Montures (mounts)** | Basic Horse, Awesome Mounts (White Tiger, Phoenix...) | Déplacement (certaines permettent d'attaquer) | Stable (gold) / Item Mall (Silk) |
| **Growth Pets** (attack) | White Wolf, Grey Wolf, Penguin, Three-Footed Crow, Bear | Combattent aux côtés du joueur, gagnent de l'XP et grandissent | Stable (Grey Wolf : 1M gold) / Item Mall |
| **Fellow Pets** | évolution d'un growth pet | Attaquent **et** servent de monture | Potion of Evolution (Silk) |
| **Ability/Pickup Pets (COS)** | Myowon (singe), Seowon (écureuil), Toto (lapin) | Ramassent le loot automatiquement | Item Mall (Silk uniquement) |
| **Spirits (transformation)** | Devil Spirit (A/S), Angel Spirit | Transforment le joueur, buffs puissants | Item Mall / donjons |

> ❌ **Corrigé :** l'ancienne version listait « Camel (Lv20) », « Elephant (Lv40) », « Ostrich 4-star », « Royal Carriage », « Falcon Mount » comme mounts/transport du Stable. **Aucun de ces items n'existe dans iSRO classique** (pas de palanquin non plus). Les transports réels du Stable sont le **cheval** et le **bœuf (ox)**.

---

## 🐴 Transports de Marchandises (Job)

Les transports sont les animaux de bât utilisés par les **Traders** (et volés par les Thieves). Ils s'achètent au **Stable-Keeper** quand le costume de job Trader est équipé, et s'invoquent comme un pet.

| Transport | Vitesse | Capacité | Notes |
|---|---|---|---|
| **Horse (cheval de bât)** | Rapide | Capacité standard | Meilleur rapport vitesse/capacité, choix par défaut |
| **Ox (bœuf)** | Lent | Capacité supérieure | Plus de marchandises par trajet, mais caravan plus lente = plus vulnérable aux thieves |

Points clés (vérifiés) :
- ✅ On achète le bien de trade au **Merchant Guild**, on l'équipe dans le **slot d'event item**, puis on achète le transport au Stable (UnKnoWnCheaTs trading guide).
- ✅ La **vitesse du transport diminue avec la charge** : plus le transport est chargé de marchandises, plus il est lent.
- ✅ Le **trade rating (1-5 étoiles)** dépend de la valeur totale des marchandises transportées (Silkroad Mans).
- ✅ Un transport qui meurt (HP à 0) fait perdre les marchandises ; les Thieves droppent les biens volés sur leur propre transport.
- ❌ Pas de « durabilité » chiffrée publique : le transport a des **HP**, pas de barre de durabilité séparée.

---

## 🏇 Montures de Déplacement

### Basic Horse (cheval de selle)
- ✅ Acheté au **Stable-Keeper** pour quelques milliers de gold (très accessible) — une **quête de niveau 5 (Jangan)** offre même un **horse scroll Lv10** en récompense.
- ✅ Vitesse : le cheval de base rend le déplacement **~2× plus rapide** qu'à pied (GameFAQs : « the horse is 100% faster than walking »).
- ✅ Possède **9 slots d'inventaire propres** : le cheval de selle sert aussi de « mule » pour transporter des items (Neoseeker/GameFAQs).
- ⚠️ Impossible d'utiliser la plupart des skills en montant un cheval classique (les montures de combat de l'Item Mall lèvent cette limitation).

### Awesome Mounts (Item Mall)
Le guide officiel « Awesome Mount » (silkroadforever.com) recense **10 montures**, dont : **Yellow Horse, Donkey, White Tiger, Sugar Loaf, Kamaitachi, Flame Tiger, Elk, Phoenix** (+2 non identifiées, voir Incertitudes).

- ✅ Montures achetées avec du **Silk** (Item Mall) ; les montures « de combat » (White Tiger, Kamaitachi, Flame Tiger...) permettent **d'attaquer tout en étant monté**.
- ✅ La plupart sont permanentes et n'ont **pas de faim** contrairement aux growth pets.
- ℹ️ Des montures d'event temporaires (Noël, anniversaires...) ont aussi été distribuées ponctuellement par Joymax.

---

## 🐺 Growth Pets (Pets d'Attaque)

Les **growth pets** sont les véritables « attack pets » d'iSRO. Ils commencent **niveau 1** (bébé), gagnent de l'**expérience en combattant avec le joueur** et **grandissent physiquement** avec les niveaux.

### Liste vérifiée (iSRO)

| Pet | Type | Acquisition | Croissance visuelle |
|---|---|---|---|
| **White Wolf** | Loup blanc | Item Mall — **130 Silk (~11 € en 2006)**, non échangeable | Bébé louveteau → **loup adulte au niveau 40** |
| **Grey Wolf** | Loup gris | **Stable-Keeper : 1,000,000 gold** (échangeable) | Idem White Wolf |
| **Penguin** | Pingouin | Item Mall | Bébé → adulte (revivable avec Grass of Life) |
| **Three-Footed Crow** | Corbeau à trois pattes | Item Mall | Bébé → adulte |
| **Bear (Oso)** | Ours | Item Mall | Bébé → adulte |

> 📌 StrategyWiki : « Wolves and Grey Wolves are combat-oriented pets with the ability to grow, starting as a puppy and maturing into a full-grown wolf that can attack alongside you. » La « growth phase » culmine au **level 40** où le louveteau devient un loup adulte.
> ✅ **Prix d'époque confirmés (guide DE juin 2006 — recherche DE 2026-10)** : White Wolf **130 Silk** / Grey Wolf **1M gold** / Grass of Life **50k gold** / HGP potion **2k gold**. Confirmations croisées FR/PT (recherche 2026-10) : loup gris **1M gold** (« o lobo, que custa 1 milhão de gold » — Wikipédia PT ; fil JeuxOnline 2010) et croissance arrêtée au **lvl 40** (« ces pets grandissent jusqu'au lvl 40 » — JOL 2010) ; un guide économie FR de 2009 cite ~3M budget total pour s'offrir un loup et son entretien.
> ℹ️ Croissance **graduelle visible dès ~Lv30** selon des témoignages directs in-thread (« plus grand, cou plus long ») — le changement de modèle adulte est au Lv40.
> ❌ **Corrigé :** il n'existe **pas** de chaîne « Baby Wolf → Giant Wolf → Dire Wolf », ni d'« Evolution Stones », ni de skill trees « Bite/Growl/Alpha Howl ». Les growth pets d'iSRO ont une **attaque automatique de mêlée sans compétences actives** (les skills de pet n'existent que via le système Fellow ou sur des serveurs privés). Le guide DE 2006 confirme : le loup **n'a aucun skill, ne ramasse rien, ne se monte pas** (époque 2006-2008).

### Mécaniques principales

**1. XP et leveling**
- Le pet gagne de l'XP en tuant des monstres **avec** son maître (il doit être invoqué).
- Le pet a son **propre inventaire** (il peut porter des items — utile en farm).
- La **Potion of Growth** augmente la taille de l'inventaire du growth pet (silkroadforums).

**2. HGP (Hunger Gauge Point)**
- Jauge de faim qui **baisse avec le temps** pendant que le pet est invoqué.
- Restaurée avec des **HGP Potions** (vendues au Stable — **2 000 gold** pièce en 2006 — / Item Mall).
- ✅ **Seuil critique : < 30% HGP** (recherche DE 2026-10, guide « Alles über die Pets », juin 2006) : message « le loup a faim » et **TOUTES les stats d'attaque/défense du pet sont DIVISÉES PAR 2** (« halbiert ») tant qu'il a faim.
- À **0 HGP prolongé**, le pet **meurt de faim** — résurrection via **Grass of Life** (50 000 gold au Stable-Keeper). Toujours garder des HGP potions (silkroadforums « Wolf help »).
- 🐛 Bug d'époque documenté : si le loup monte de niveau **en état de faim**, il affiche HGP 100% mais garde les stats réduites → le dés-invoquer/ré-invoquer corrige.
- ℹ️ Le user note parfois « HGP = Horse Grass Powder » : **non confirmé**. HGP désigne la jauge (*Hunger Gauge Point*) ; la « Grass of Life » est l'herbe de **résurrection**, pas de nourriture.

**3. Mort et résurrection**
- Un growth pet **peut mourir** en combat (wolf : « wolves can be killed during combat »).
- Résurrection : item **Grass of Life** vendu par le **Stable-Keeper** de chaque ville pour **50 000 gold** — ✅ **confirmé** par le guide allemand de juin 2006 (« Gras des Lebens : 50 000 Gold im Stall », recherche DE 2026-10), qui recoupe le « ~50k rapporté » des forums MMORPG.com.
- Le pet ne disparaît jamais définitivement : c'est un item permanent (une fois nommé).

**4. Nom**
- On nomme le pet à la première invocation ; le nom est **définitif**.
- Un **Naming Scroll** (Item Mall) permet de le réinitialiser (guide Fellow-Pet elitepvpers).

**5. Aggro / party / comportement PvP**
- Le pet **génère de la menace** sur les monstres qu'il attaque (il peut servir de semi-tank en early game).
- Le pet **ne rejoint pas la party** en tant que membre : il suit son maître.
- ✅ **Limite simultanée (guide DE juin 2006 — recherche DE 2026-10)** : **maximum 2 pets actifs au total** par personnage — typiquement **1 growth pet + 1 pickup pet** (ex. wolf + singe) ; **2 pickup pets ensemble interdits**. ⚠️ Corrige la formulation précédente « une seule invocation à la fois » — trop stricte pour l'iSRO d'époque (les versions mobiles/récentes peuvent différer).
- Comportement d'époque : le loup est **auto-désinvoqué en PvP à cape** ; en tenue de job il attaque les hunters/thieves ; si le maître devient **meurtrier, le loup le devient aussi**.

---

## 🧬 Le Système Fellow

Introduit pour les pets plus évolués, le **Fellow System** (guide elitepvpers complet) transforme un growth pet en **Fellow** :

- ✅ Le growth pet (ex. wolf) utilise une **Potion of Evolution** (Item Mall) → devient un **Fellow** adulte.
- ✅ Le Fellow **attaque les cibles désignées** par son maître **et peut être monté** (attack pet + monture en un).
- ✅ Items dédiés : **Potion of Mana** (MP du Fellow), potions de soin Fellow, Naming Scroll.
- ✅ Il continue de gagner des niveaux et des stats avec l'XP.
- ℹ️ Sur les serveurs privés et Silkroad Origin Mobile, ce système a été étendu (pets « Silk Pet » montables et attaquants, taille croissant jusqu'au Lv130).

---

## 🐒 Ability Pets / Pickup Pets (COS)

Les **ability pets** (appelés **COS** dans les fichiers du jeu — pets invoqués) ramassent **automatiquement le loot** (gold et items) autour du joueur. Ils ne combattent pas.

### Liste vérifiée (iSRO)

| Pet | Animal | Acquisition | Durée |
|---|---|---|---|
| **Pet Myowon** | Singe | Item Mall — **88 Silk (~7 € en 2006)** (≈ ~10 $ rapporté plus tard) | **28 jours** |
| **Pet Seowon** | Écureuil | Item Mall (Silk) | **28 jours** |
| **Pet Toto** | Lapin | Item Mall (Silk) | **28 jours** |

> ✅ **Détails du guide DE juin 2006 (recherche DE 2026-10)** : le Myowon à **88 Silk** dure **28 jours**, ne meurt pas, ne level pas, ramasse tout dans son rayon et possède **28 slots** d'inventaire ; l'**Extension Clock** (horloge d'extension) à **48 Silk ≈ 4 €** ajoute +28 jours, est stackable et **réactive un pet expiré** (grisé) ; Seowon (écureuil), Toto (lapin) et le cochon doré/rose suivent la même mécanique de ramassage.

D'autres modèles (cat, penguin, tiger, rhinoceros...) ont été annoncés/distribués au fil des mises à jour de l'Item Mall (annonce 2007 : « Cat, Penguin, Tiger, Rhinoceros »).

### Mécaniques (vérifiées)

- ✅ **Silk uniquement** : les pickup pets ne s'achètent pas avec du gold (contrairement au Grey Wolf). Prix rapporté : **~10 $** pour 28 jours (silkroadforums).
- ✅ **Location de 28 jours** : le pet expire après 28 jours. Un **Renewal/Revival Clock** (~5 $ rapporté) **prolonge de 28 jours supplémentaires** (StrategyWiki).
- ✅ Possèdent leur **propre inventaire** dans lequel le loot est ramassé (le joueur transfère ensuite dans son inventaire). Des expansions d'inventaire séparées existent pour les pickup pets (silkroadforums).
- ✅ Si le pet meurt/expire, il se réactive avec les items adéquats (**Grass of Life** cité par StrategyWiki pour les faire revivre ; le mécanisme exact dépend de l'état mort vs expiré).
- ❌ **Corrigé :** pas de « Pig 5 slots / Fox 7 slots / Fairy Cat 10 slots avec auto-sell » — ce sont des inventions. Les différences entre pickup pets sont surtout **cosmétiques** (vitesse/animation identiques par défaut).
- ℹ️ Le ramassage filtre par défaut certains items ; le pet ne ramasse **pas** en état de mort et s'arrête quand son inventaire est plein.

---

## 😈 Devil Spirit et Angel Spirit

Le **Devil Spirit** n'est pas un pet mais un item de **transformation** (Item Mall / drops de donjons) :

| Grade | Effets rapportés | Sources |
|---|---|---|
| **Devil Spirit (normal)** | Transformation diable + skill dédié, bonus modérés | Item Mall iSRO |
| **Devil Spirit A grade** | **+20 % dégâts, +10 % vitesse** en transformation, **+15 % HP/MP** constants (rapporté) | elitepvpers, silkroadforums |
| **Devil Spirit S grade** | Grade supérieur, obtenu via donjons (talisman drops sur certains serveurs) | ExaySRO wiki (privé) |

- ✅ L'upgrade suit des **paliers (+0 → +10)** : le skill du diable **change à +3/+5** (rapporté : +25 % dégâts, +15 % vitesse), et monte encore au-delà de +6 (Seidenkraft tutorial, basé sur le système officiel).
- ✅ La transformation donne un modèle de personnage unique avec **skills de transformation** propres.
- ℹ️ **Angel Spirit** (Amalrun) : équivalent « angélique » ajouté plus tard ; obtenu/activé par **4 fragments du même type** sur Silkroad Origin Mobile (idem **NASRUN**). Sur iSRO PC, « Nasrun » n'existe pas en tant que tel — c'est le nom mobile des transformations de type diable.

---

---

## 🇰🇷 Contenu KSRO (2011-2026)

> Données du **service coréen courant** (item mall officiel + recoupements communautaires) — rapport : [ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §9](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md). Les fellows sont apparus côté KR en décembre 2011 (notice officielle « 펠로우즈 탑승 » du 21/12/2011, cf. [RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md) K27).

### Les 12 fellows officiels (item mall PET/GROWTH)

**12 펠로우즈 en vente à 55 silk (필) chacun**, utilisables dès le **niveau 1**, **non-invocables simultanément** (source officielle : https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?Shoptype1=PET&Shoptype2=GROWTH) :

> 블러드 아머 다이노 (Blood Armor Dino) · 에이션트 트라브 베어 (Ancient Trab Bear) · 옐로우 스파클 오트리슈 (Yellow Sparkle Ostrich) · 루비노 피닉스 (Rubino Phoenix) · 라바 로어 하운드 (Lava Roar Hound) · 하프문 재규어 (Halfmoon Jaguar) · 실버 백 (Silverback) · 다크 그리핀 (Dark Griffin) · 크록스 (Crocs) · 나이트 팽 (Night Fang) · 골드 혼 (Gold Horn) · 소울 테일 (Soul Tail)

Mécaniques (communauté EN, fiabilité 2-3) : le fellow **combat la cible désignée** et peut servir de **monture** ; les growth pets classiques **évoluent en fellows** auprès du **PNJ de l'écurie (Stable NPC)** avec une **Potion of Evolution (진화의 물약)** ; le fellow gagne des niveaux et des **buffs propres** (transfert de niveau entre fellows documenté en vidéo). Sources : [elitepvpers — Fellow-Pet System](https://www.elitepvpers.com/forum/sro-guides-templates/1802274-guide-fellow-pet-system.html) · [MMORPG.com — Updated Fellow System](https://forums.mmorpg.com/discussion/335076/).

### Devil spirits côté KR — grades et paliers chiffrés

| Grade | Obtention | Effets (base) |
|---|---|---|
| **B** | en jeu (Forgotten World / talismans) | identique au grade A |
| **A** | item mall (silk) | skill actif : **+20 % dégâts phys./mag., +10 % vitesse** (usage périodique ~20-30 min, durée ~10 min) |
| **S** | donjon (Dimension Hole) / **Magic Pop coupon rouge** | **+5 % HP/MP mini, +1 block ratio** ; renforcable **jusqu'à +15** (attesté sur miroir privé) ; blues type « dégâts vs uniques +10 % » |

**Upgrade (alchimie — Elixir of Devil Spirit + poudres), paliers chiffrés** : chaque palier **+1 : +1 % HP/MP** ; **+3 à +5 ⇒ skill à 25 % dégâts / 15 % vitesse** ; **+6 et au-delà ⇒ 30 % dégâts**. Sources : [Seidenkraft — Devil Spirit Upgrade Tutorial (2012)](https://seidenkraftblog.wordpress.com/2012/09/17/devil-spirit-upgrade-tutorial/) · [Silkroad Forums — Devil Spirit S-Grade](http://www.silkroadforums.com/viewtopic.php?f=2&t=118765) · [GamesIndustry.biz — Magic Pop (coupon rouge → Devil S)](https://www.gamesindustry.biz/silkroad-online-magic-pop-card-game-launched).

Le **Magic Pop coréen** s'appelle **요술팡** : la **팡카드** (« carte Fang », 10 silk, item mall CONSUME/SPECIAL) s'y insère — même gacha que la Magic Pop iSRO ; grille de récompenses complète non publiée.

> ⚠️ Le système fellow tardif (évolution/transfert de niveau) n'a **pas de page guide officielle KR** (vidéos/forums EN uniquement) ; le **+15 du grade S** provient d'un wiki de serveur privé (miroir du système officiel, fiabilité 2).

---

## 🏥 Gestion et Soins (Stable-Keeper)

Le **Stable-Keeper** (étable) de chaque ville centralise tous les services pets :

| Service | Détail |
|---|---|
| **Vente de montures/transports** | Basic horse, cheval de bât, ox, Grey Wolf (1M gold) |
| **Résurrection de pet** | Growth pets morts (≈50k gold rapporté) ou via **Grass of Life** |
| **Grass of Life** | Herbe de résurrection vendue au Stable (pets morts) |
| **HGP Potions** | Nourriture des growth pets (jauge de faim) |
| **Pet HP potions** | Soins du pet en combat |
| **Prolongation pickup pet** | Renewal/Revival Clock pour +28 jours |

Conseils pratiques :
1. Toujours transporter **HGP potions + pet HP potions + un Grass of Life** quand on farm avec un wolf.
2. Ne pas laisser le pet mourir en zone dangereuse : les items du pet inventaire restent sur le pet, mais un pet mort ne combat plus.
3. Ne nommer son pet qu'une fois sûr du nom (Naming Scroll payant sinon).

---

## 💰 Acquisition et Coûts

| Item | Méthode | Coût (rapporté iSRO) | Durée |
|---|---|---|---|
| Basic Horse | Stable (gold) | ~10,000 gold + scroll Lv10 via quête | Permanent |
| Transport Horse / Ox | Stable (gold, job Trader actif) | Quelques dizaines de milliers de gold | Par trajet |
| Grey Wolf | Stable (gold) | **1,000,000 gold** | Permanent |
| White Wolf / Penguin / Crow / Bear | Item Mall (Silk) | **White Wolf : 130 Silk (~11 €, 2006)** ; autres en Silk | Permanent |
| Grass of Life (revive growth pet) | Stable-Keeper | **50,000 gold** ✅ confirmé (guide DE 2006) | Consommable |
| HGP Potion | Stable-Keeper | **2,000 gold** (2006) | Consommable |
| Potion of Evolution (Fellow) | Item Mall (Silk) | Silk | Consommable |
| Pickup pet (Myowon/Seowon/Toto) | Item Mall (Silk) | **Myowon : 88 Silk (~7 €, 2006)** ; ~10 $ rapporté ensuite | **28 jours** (+Extension Clock **48 Silk**/28 j) |
| Devil Spirit A | Item Mall / events | Silk | Permanent (+upgrades) |
| Awesome Mounts (White Tiger...) | Item Mall (Silk) | Silk | Permanent |

---

## ❓ FAQ

**Q : Le wolf évolue-t-il en serpent/phoenix ?**
R : Non. Le growth pet loup passe de louveteau à **loup adulte au niveau 40** — c'est une croissance visuelle, pas une métamorphose en une autre créature.

**Q : Peut-on attaquer monté ?**
R : Sur le basic horse, non (déplacement seulement). Les **Awesome Mounts** de combat (White Tiger, Flame Tiger, Kamaitachi...) et les **Fellows** montables le permettent.

**Q : Le pickup pet ramasse-t-il directement dans mon inventaire ?**
R : Non — il ramasse dans **son propre inventaire**, qu'il faut transférer manuellement (des expansions d'inventaire existent).

**Q : Que se passe-t-il quand mon pickup pet de 28 jours expire ?**
R : Il reste dans l'inventaire sous forme de scroll inutilisable ; un **Renewal/Revival Clock** le réactive 28 jours de plus. Le pet lui-même n'est pas perdu.

**Q : HGP, c'est quoi exactement ?**
R : *Hunger Gauge Point* — la jauge de faim du growth pet. Elle baisse avec le temps invoqué et se recharge avec des **HGP Potions**. À 0, le pet perd des HP.

**Q : Les pets peuvent-ils porter des équipements ?**
R : Non, pas d'armes/armures de pet dans iSRO classique (inventions de l'ancienne version). Le pet a juste **son propre inventaire de transport**.

**Q : Un pet peut-il m'aider en party ?**
R : Il combat à vos côtés et génère son propre aggro, mais il n'occupe **pas de slot de party**.

---

## 🛠️ Notes de Développement (SRObro)

### Modèle de données suggéré (basé sur les données vérifiées)

```javascript
// data/pets.json — structure réaliste iSRO
{
  "transports": [
    { "id": "TRANSPORT_HORSE", "name": "Horse", "speed": "fast", "capacity": "medium", "buyer": "stable" },
    { "id": "TRANSPORT_OX", "name": "Ox", "speed": "slow", "capacity": "high", "buyer": "stable" }
  ],
  "mounts": [
    { "id": "MOUNT_BASIC_HORSE", "name": "Horse", "cost": 10000, "speedBonusPct": 100, "inventorySlots": 9 },
    { "id": "MOUNT_WHITE_TIGER", "name": "White Tiger", "currency": "SILK", "canAttackMounted": true },
    { "id": "MOUNT_PHOENIX", "name": "Phoenix", "currency": "SILK", "canAttackMounted": true }
  ],
  "growth_pets": [
    {
      "id": "PET_GREY_WOLF", "name": "Grey Wolf",
      "cost": 1000000, "currency": "GOLD", "seller": "STABLE_KEEPER",
      "adultModelAtLevel": 40,
      "hunger": { "gauge": "HGP", "decaysOverTime": true, "refill": "HGP_POTION" },
      "revival": { "item": "GRASS_OF_LIFE", "serviceCost": 50000 },
      "inventoryExpansion": "POTION_OF_GROWTH"
    }
  ],
  "ability_pets": [
    { "id": "PET_MYOWON", "name": "Pet Myowon", "currency": "SILK", "rentalDays": 28,
      "renewalItem": "REVIVAL_CLOCK", "autoPickup": true }
  ],
  "fellow": {
    "requires": "POTION_OF_EVOLUTION",
    "features": ["ATTACK_TARGET", "RIDEABLE", "LEVELS_UP"]
  },
  "spirits": [
    { "id": "DEVIL_SPIRIT_A", "transform": true, "reportedBuffs": { "damagePct": 20, "speedPct": 10, "hpMpPct": 15 } }
  ]
}
```

### Points d'implémentation clés
- **Max 2 pets actifs simultanés** (typiquement 1 growth + 1 pickup), jamais 2 pickup pets ensemble (guide DE 2006) ; 1 monture/transport en plus selon le contexte.
- La jauge HGP doit décroître **avec le temps réel passé invoqué** (tick), pas avec la distance ; appliquer le malus **stats ÷ 2 sous 30% HGP**.
- Le pickup pet ramasse dans **son** inventaire → prévoir une UI de transfert pet→joueur.
- Le loup change de modèle au **level 40** (2 modèles par growth pet : bébé/adulte ; croissance graduelle visible dès ~Lv30).

---

## ⚠️ Incertitudes / Données Manquantes

- **Les 2 montures manquantes** de la liste officielle « 10 kinds of Mount » : le snippet officiel n'expose que 8 noms (Yellow Horse, Donkey, White Tiger, Sugar Loaf, Kamaitachi, Flame Tiger, Elk, Phoenix). La page officielle est dynamique et ne se laisse pas archiver facilement.
- **HGP max exact** (360 ?) : non confirmé par les sources ; seuls le mécanisme, les HGP Potions et le seuil **30% (stats ÷ 2)** sont attestés.
- **Slots exacts des transports** (horse vs ox) : le « 9 slots » attesté concerne le cheval de selle ; la capacité de bât des transports n'a pas de chiffre officiel publié.
- ~~**Coût exact du revival** (50k gold)~~ : ✅ **Résolu (recherche DE 2026-10)** — **Grass of Life = 50 000 gold** au Stable-Keeper (guide allemand « Alles über die Pets », juin 2006).
- **Prix Silk exacts** : varient selon les époques de l'Item Mall — relevés d'époque (juin 2006, guide DE) : White Wolf **130 Silk** (~11 €), Myowon/Seowon **88 Silk** (~7 €), Extension Clock **48 Silk** (~4 €) ; les ~10 $/28 j des forums datent d'une époque ultérieure.
- **Devil Spirit : valeurs de buffs** (+20 %/10 %/15 %) rapportées par des threads communautaires et un serveur privé fidèle au système officiel — à traiter comme « valeurs rapportées ».
- **Niveau minimum pour invoquer un growth pet** : non confirmé (le wiki Fandom suggère un prérequis bas, possiblement Lv5 personnage ; un forum TR 2026 évoque « niveau 5+ requis » pour posséder un pet — non recoupé).

---

## 🔗 Sources

- StrategyWiki — Silkroad Online/Pets : https://strategywiki.org/wiki/Silkroad_Online/Pets (growth/pickup pets, 28 jours, Revival Clock, Grass of Life)
- silkroadonline.de — Alles über die Pets (wolf, affe, eichhörnchen) (juin 2006, maj 2008) : https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/5628-alles-ber-die-pets-wolf-affe-eichh-rnchen — prix d'époque (130/88/48 Silk, 1M/50k/2k gold), HGP < 30% = stats ÷ 2, max 2 pets (recherche DE 2026-10)
- Elitepvpers — [Guide] The Fellow-Pet System : https://www.elitepvpers.com/forum/sro-guides-templates/1802274-guide-fellow-pet-system.html (Potion of Evolution, naming, attack/mount)
- Elitepvpers — Devil's Spirit A grade transformation : https://www.elitepvpers.com/forum/silkroad-online/193879-devils-spirit-grade-transformation.html (+20 % dmg / +10 % speed)
- Silkroad Forums — Devil spirit grade A : http://www.silkroadforums.com/viewtopic.php?f=29&t=114721 (+15 % HP/MP)
- Seidenkraft — Devil Spirit Upgrade Tutorial : https://seidenkraftblog.wordpress.com/2012/09/17/devil-spirit-upgrade-tutorial/ (paliers +3/+5/+6)
- Site officiel — Awesome Mount : http://www.silkroadforever.com/en-us/m/guideShow.html?f=Awesome_Mount&t=0 (10 montures)
- Silkroad Forums — Wolf help : http://www.silkroadforums.com/viewtopic.php?f=2&t=55131 (HGP potions, Grass of Life)
- Silkroad Forums — How do you increase pet's inventory : http://www.silkroadforums.com/viewtopic.php?f=4&t=71671 (Potion of Growth)
- MMORPG.com — Pet Wolf is it worth it : https://forums.mmorpg.com/discussion/99898/pet-wolf-is-it-worth-it (1M gold, 50k revive)
- Silkroad Forums — pickup pets silk : http://www.silkroadforums.com/viewtopic.php?f=4&t=26835 (~10 $/28 j, renewal ~5 $)
- GameFAQs — Guide & Walkthrough (Sintaku, 2008) : https://gamefaqs.gamespot.com/pc/930711-silkroad-online/faqs/44908 (cheval 2× vitesse, 9 slots)
- Neoseeker — Silkroad Online tips : https://www.neoseeker.com/silkroad-online/cheats/pc (horse transport 9 slots, ox)
- UnKnoWnCheaTs — Quick Guide to Trading : https://www.unknowncheats.me/wiki/Silkroad:Quick_Guide_to_Trading (horse/ox au stable, trade goods)
- Silkroad Mans — Trade System : https://silkroadmans.tr.gg/Game-System.htm (trade rating 1-5)
- IGN — Silkroad Online Peek #2 (2008) : https://www.ign.com/articles/2008/08/26/silkroad-online-peek-2 (bears/wolves adultes, ability pets)
- kmkm forum (annonce 2007) : https://kmkm.forumotion.com/t3147-silkroad-online-pets-to-arrive-soon-in-an-item-mall-near-you (Cat, Penguin, Tiger, Rhinoceros)
- Silkroad Origin Mobile — Pet System : https://sromobile.com/en/guide/features-guide/new-feature-update-pet-system (système Fellow mobile, Nasrun/Amalrun)
- JeuxOnline — fil d'actualité Silkroad (2010) : https://forums.jeuxonline.info/sujet/1104741/l-actualite-sur-silkroad-online-et-la-presentation (loup 1M gold, croissance jusqu'au lvl 40, pets 130 silks — recherche FR 2026-10)
- Wikipédia PT — Silkroad Online : https://pt.wikipedia.org/wiki/Silkroad_Online (« o lobo, que custa 1 milhão de gold », seul mascote achetable en or — recherche PT 2026-10)

---

*Dernière mise à jour : 1er octobre 2026 (enrichi par la recherche multilingue ML_RESEARCH — guide pets DE juin 2006, confirmations FR/PT ; ajout de la section 🇰🇷 Contenu KSRO 2011-2026 : 12 fellows officiels à 55 silk + devil spirits A/B/S chiffrés — rapport ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §9)*

*Sources : StrategyWiki, elitepvpers, silkroadforums, site officiel silkroadforever.com, MMORPG.com, GameFAQs, silkroadonline.de (DE), JeuxOnline (FR), Wikipédia PT — voir section Sources.*
