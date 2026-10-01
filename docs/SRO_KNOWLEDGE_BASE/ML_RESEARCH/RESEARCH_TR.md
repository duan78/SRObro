# 🇹🇷 Recherche communautaire TURQUE — Silkroad Online

> **Mission** : recherche web exhaustive en turc sur les sources communautaires turques de Silkroad Online, croisée avec les incertitudes de la base SRObro.
> **Date** : 2026-10-01 · **Langue de recherche** : turc (requêtes + lecture des pages)
> **Règle d'or respectée** : aucun chiffre inventé. Chaque donnée cite son URL source. Les valeurs non trouvées sont listées en fin de rapport.

---

## 📑 Sommaire

1. [Index des sources turces](#-index-des-sources-turces)
2. [Trouvailles par thème](#-trouvailles-par-thème)
3. [Réponses aux incertitudes de la base](#-réponses-aux-incertitudes-de-la-base)
4. [Glossaire turc → français](#-glossaire-turc--français)
5. [Incertitudes non résolues](#-incertitudes-non-résolues)

---

## 🗂️ Index des sources turces

Fiabilité : 5 = donnée chiffrée vérifiable / reverse engineering · 4 = forum sérieux, données concordantes · 3 = forum ou blog, données non recoupées · 2 = anecdotique.

| # | Source | URL | Description | Fiabilité |
|---|--------|-----|-------------|-----------|
| 1 | **SroCave** | https://srocave.com | Forum/blog TR moderne (2024-2026). Article majeur : taux d'alchimie extraits des **codes du jeu** (paramètres DB décompressés) + guides Fortress War 2025, grind spots 2025 | **5** |
| 2 | **SroLobby** | https://www.srolobby.com | Forum TR spécialisé — **série complète des 7 guides FGW par tranche de niveau** (auteur : Burak Yoğun), couleurs des mobs/SoX, routes de leveling STR/INT, Qin-Shi B6 | **4-5** |
| 3 | **DonanımHaber** (forum Silkroad) | https://forum.donanimhaber.com | LE forum historique turc (2006-2013, ère iSRO officielle) : listes HP des uniques et monstres, spawns, tablettes, trade, kurt (loup) | **4** |
| 4 | **vSRO.org** | https://www.vsro.org | Forum TR des serveurs privés vSRO : guides Job/Gold/SP, listes de talismans FGW par degré, taux kervan | **3** (orienté privés) |
| 5 | **SroMax** | https://www.sromax.com | Guides TR détaillés : Thief (règles des étoiles, Arrange Point), Fortress War (flags, taxes), FGW, Nuker | **4** |
| 6 | **Extraloob** | https://www.extraloob.com | Forum TR : infos uniques 1-100 avec **timers de spawn en minutes**, promotion Job, Fortress War | **3-4** |
| 7 | **FrmTR** (section SRO) | https://www.frmtr.com/sro-rehberler-sorular-ve-teknik-yardim/ | Ancien forum TR massif (accès direct 403, contenu vu via extraits de recherche) : guides trader, Seal drop ratings, Forgotten World | **3** |
| 8 | **TurkMMO** | https://forum.turkmmo.com | Forum TR MMO : kale vergi (taxe de forteresse), Seal of Star/Moon/Sun (accès 403) | **3** |
| 9 | **SilkroadPortal** | https://silkroadportal.com | Portail TR : **formules hasar/defans** (dégâts/défense), guide Thief | **3-4** |
| 10 | **SroArena** | https://www.sroarena.com | Forum TR : alchemy şans rehberi (stratégies +3/+4) | **3** |
| 11 | **İpekyolu Forum** | https://www.ipekyoluforum.com | Forum TR (« La Route de la Soie ») : collection de guides alchimie (stone/tablet/elixir/enhancer) | **3** |
| 12 | **r10dev.net** | https://r10dev.net | Blog TR récent (2026) : guide Kurt (loup), tags Job Temple | **3** |
| 13 | **burakakhan.com.tr** | https://burakakhan.com.tr/oyunlar/silkroad/kervan-ticaret | Blog TR : système kervan/ticaret (profit = distance × risque, trade de nuit) | **3** |
| 14 | **SroTürkiye** | https://sroturkiye.com | Forum TR serveurs actuels ( Silkroad Mobile/privés ) : guides events Jangan kervan | **3** |
| 15 | **srotr.com** | https://srotr.com | Site TR : définition TRSRO, contexte communautaire turc | **3** |
| 16 | **MMSRN** | https://www.mmsrn.com | Blog TR : liste complète uniques/HP (accès 403, données vues en extrait) | **3** |
| 17 | **silkroadbot.com/blog** | https://silkroadbot.com/blog | Blog TR du bot SRBOT : routes de leveling 2026, routes de trade | **3** |
| 18 | **TurkHackTeam** | https://www.turkhackteam.org | Guide Fortress War illustré (occupation 1 semaine, taxes le samedi) | **2-3** |
| 19 | **Kopazar / Klasgame / GameSatış** | https://www.kopazar.com , https://www.klasgame.com | Prix RMT du gold (données de marché TR 2024-2026) | **4** (prix commerciaux) |
| 20 | **SilkroadPazar** | https://www.silkroadpazar.com | Petites annonces TR item/gold/comptes | **3** |
| 21 | **Wikipédia TR** | https://tr.wikipedia.org/wiki/Silkroad_Online | Article général TR | **3** |

**Remarque communauté** : les serveurs officiels turcs (TRSRO) cités dans les sources : *Pergamon, Zeugma* (fusion documentée), *Knidos, Lidya, Harput, Anadolu, Hebe* (cités dans les annonces de marché/videos). srotr.com (1 433 sujets / 6 021 messages / 3 739 membres) et srolobby/srocave sont les hubs FR modernes ; DonanımHaber/FrmTR sont les archives historiques 2006-2013.

---

## 💎 Trouvailles par thème

### 1. 🧪 Alchimie — taux EXACTS extraits du code (SroCave)

Source : https://srocave.com/konular/silkroad-onlineda-arti-basmanin-matematigi-gercek-oyun-kodlariyla-alchemy-basari-oranlari.3523

L'auteur a **décompressé les valeurs `Param` 32-bit de la DB** (4 octets → 4 taux 8-bit) :

**Taux de base (élixir seul)** :
| Cible | Taux |
|---|---|
| +1 | **50%** |
| +2 | **40%** |
| +3 | **30%** |
| +4 | **19%** |
| +5 à +8 | **17%** |
| +9 à +12 | **12%** |
| >+12 | identique à +12 |

- Décodage : `unpack(841489939)` → 50,40,30,19 · `unpack(286331153)` → 17,17,17,17 · `unpack(286002188)` → 17,12,12,12.
- **Mesure sur 30 000 tentatives** : 50.58% / 40.07% / 29.99% / 19.13% / 17.68% — cohérent avec les valeurs DB.

**Bonus Lucky Powder (şans tozu)** : `unpack(840832008)` → 50,30,20,8 (+1→+4) ; `unpack(134744072)` → 8,8,8,8 (+5→+12). Le powder **s'additionne** au taux :

| Cible | Élixir | Powder | **Total** |
|---|---|---|---|
| +1 | 50 | +50 | **100%** |
| +2 | 40 | +30 | **70%** |
| +3 | 30 | +20 | **50%** |
| +4 | 19 | +8 | **27%** |
| +5→+8 | 17 | +8 | **25%** |
| +9→+12 | 12 | +8 | **20%** |

**Autres sources de chance** (vérifiées statistiquement par l'auteur) :
- **Magic Stone of Luck** (bleu Lucky) : pose à 100%, **+5% sur la tentative suivante** puis disparaît (~50 000 échantillons, intervalle de confiance de Wilson).
- **Premium PLUS** : **+5%** fixe vérifié.
- **Avatar avec bleu Lucky** : fixe, mécanisme identique au Lucky stone.

**Élixirs minimum pour atteindre un palier à 90% de probabilité** (élixir+powder, calcul récursif f(y,N,x)) : +2 = **10** · +3 = **47** · +4 = **205** · +5 = **840** · +6 = **3 384**. Exemple opérationnel : de +5 vers +6 avec seuil R=0.8 → minimum **230 élixirs**, 25% d'atteindre l'objectif, 73.47% de retomber à +5.

**Divergences communautaires documentées** :
- SroLobby (https://www.srolobby.com/konular/alchemy-basari-oranlari.273) : thread sans réponse chiffrée — un vétéran (*onder*, 2020) conteste l'existence de taux fixes (« certains passent +12 d'affilée sans rien, d'autres échouent +5 avec premium+lucky dress ») → le **mythe du RNG pur** est ancré dans la communauté TR.
- SroCave « Temel Bilgiler » (https://srocave.com/konular/silkroad-online-oyunu-hakkinda-en-temel-bilgiler-karakter-yapilandirmasi-ve-itemler.2635) mentionne un **maximum +9** (vision ancienne/serveur classique).
- vSRO.org (https://www.vsro.org/konular/alchemy-rate-ayarini-nasil-yapiyorsunuz.18197) : les administrateurs de privés ajustent les taux **via le Lucky Powder** — confirmation que le champ powder est le levier de tuning côté serveur.

### 2. 👹 Uniques — HP / niveaux / timers de spawn

**Table officielle iSRO croisée de 2 sources TR indépendantes** (DonanımHaber + MMSRN/extraloob) :

| Unique | Niveau | HP | Sources |
|---|---|---|---|
| Tiger Girl | 20 | **598 720** | https://forum.donanimhaber.com/yaratiklarin-canlari-cin-avrupa-ve-unique--28889841 + https://www.mmsrn.com/silkroad-online-tum-unique-isimleri-levelleri-ve-hpleri-kactir |
| Cerberus | 24 | **693 072** | idem |
| Captain Ivy | 30 | **1 094 835** | idem |
| Uruchi | 40 | **1 779 528** | idem + https://forum.donanimhaber.com/unique-cikis-yerleri-sadece-bilmeyenler-iceri--19236168 |
| Isyutaru | 60 | **4 324 612** | idem |
| Lord Yarkan | 80 | **9 353 045** | idem |
| Demon Shaitan | 90 | **12 732 060** | idem |

**Timers de spawn (Extraloob, en minutes après la mort)** — https://www.extraloob.com/threads/silkroad-1-100-level-unique-hakkinda-bilgiler-234754 :
- Tiger Girl : **~210-390 min** (3h30 - 6h30)
- Cerberus : **~200-400 min**
- Captain Ivy : **~200-450 min** (parfois jusqu'à **700 min** !)
- Uruchi : **~230-450 min**
- DonanımHaber (https://forum.donanimhaber.com/unique-spawn-saatleri--14339078) : « générique 3,5-5 h » (rebellon) / « minimum 2 h après le dernier kill, ensuite aléatoire » (_aNaToLia_).

**Comportements/locations (Extraloob)** : Tiger Girl donne **Zombie** (prévoir des Pill) ; Cerberus : écran s'assombrit + Fire/Cold/**Fear** ; Ivy : Stun/KD/KB, Cleopatra Gate ; Uruchi : aucun status, visible via touche V, « le plus attendu » ; Isyutaru : Cold/Freeze (Pill obligatoire), tuable solo par Wizard 62-68 avec fire imbue + 1er cold skill ; Yarkan : « le père des uniques », spawn avec tous les mobs 71+ alentour, min. 1 Cleric en party ; Shaitan : coups faibles mais élites dangereuses, entrer avec Cleric bless.

**Qin-Shi Tomb B6 (SroLobby)** — https://www.srolobby.com/konular/silkroad-online-qin-shi-tomb-b6-monsters-mob-hp-saldiri-tipleri.1780 :
| Monstre | Niveau | HP | Attaque |
|---|---|---|---|
| **SoSo The Black Viper** | 100 | **27 655 068** | Physique & Magique |
| **BeakYung The White Viper** (« Medusa ») | 100 | **183 535 199** | Physique & Magique |
- B6 = 4 salles, 2 avec uniques. ⚠️ Niveau **100** côté TR (la base KB indique 105) — divergence à trancher via client.
- Accès Medusa (Extraloob) : B5 = **5 uniques** à tuer, B6 = tuer **4 fois** l'unique 95, puis salle Medusa.

**Histoire communautaire** (DonanımHaber) : Captain Ivy fut d'abord **monstre de quête only sur iSRO** et unique uniquement sur KSRO avant son ajout officiel.

### 3. 🏰 Forgotten World (FGW) — SÉRIE COMPLÈTE des 7 guides turcs (SroLobby, auteur Burak Yoğun)

⚠️ Convention : les guides écrivent « 143.131K » (séparateur turc) = 143 131 000 HP. Valeurs très probablement extraites de données vSRO — à recouper avec `_RefObjCommon` avant implémentation, mais niveaux/structure conformes à l'officiel.

**Mécanique des grades (résout une incertitude KB)** : 1★ mobs normaux = type **General**, Envies = **Champion** · 2★ = Champion / Elite · 3★-4★ = **Elite**. Party : 1-2★ = **4 joueurs**, 3-4★ = **8 joueurs**. Sources : guides Togui/Flame/Shipwreck ci-dessous.

**a) Togui Village 35-50** — https://www.srolobby.com/konular/silkroad-online-togui-village-35-50-forgotten-world-map-rehberi.2684
| Boss | 1★ (Lv/HP) | 2★ (Lv/HP) |
|---|---|---|
| Togui General (camp 1) | 39 / 143 131 000 | 47 / 304 119 000 |
| Togui Captain (camp 2) | 39 / 143 131 000 | 47 / 304 119 000 |
| **Togui Elder** (final) | 39 / **1 275 761 000** | 47 / **2 702 114 000** |
- Elder invoque **2 Togui General** à bas HP. 2 Treasure Box par carte. Récompense : **D8 Seal of Sun**.

**b) Togui Village 51-60** — https://www.srolobby.com/konular/silkroad-online-togui-village-51-60-forgotten-world-map-rehberi.2688
- General/Captain : 1★ Lv53 / 257 926 000 · 2★ Lv58 / 489 931 000. Elder : 1★ **2 287 684 000** · 2★ **4 339 138 000**.
- ⚠️ Témoignage joueur : sur iSRO officiel, **Puppet et Spell Paper ne dropaient jamais** sur la tranche 51-60.

**c) Togui Village 61-70** — https://www.srolobby.com/konular/silkroad-online-togui-village-61-70-forgotten-world-map-rehberi.2689
- General/Captain : 1★ Lv63 / 407 745 000 · 2★ Lv68 / 754 812 000. Elder : 1★ **3 607 078 000** · 2★ **6 671 086 000**.

**d) Flame Mountain 71-80** — https://www.srolobby.com/konular/silkroad-online-flame-mountain-71-80-forgotten-world-map-rehberi.2691
| Boss | 1★ | 2★ | 3★ | 4★ |
|---|---|---|---|---|
| Flame Captain | Lv73 / 471 374 000 | Lv76 / 778 953 000 | Lv76 / 2 077 209 000 | Lv79 / 3 142 325 000 |
| Flame Adjutant Honghaea | Lv73 / 615 183 000 | Lv76 / 1 017 408 000 | Lv76 / 2 713 089 000 | Lv79 / 4 107 290 000 |
| **Flame Cow King** | Lv73 / **4 713 740 000** | Lv76 / **7 789 534 000** | Lv76 / **10 386 045 000** | Lv79 / **15 235 513 000** |
- Cow King invoque 2 Flame Captain à bas HP. Récompense : **D9 Seal of Sun**. Set « The Burning Abyss ».

**e) Flame Mountain 81-90** — https://www.srolobby.com/konular/silkroad-online-flame-mountain-81-90-forgotten-world-map-rehberi.2700
- Captain : 1★ Lv83/667 505 000 → 4★ Lv89/**4 411 228 000** · Honghaea : 873 457 000 → **5 779 128 000** · Cow King : **6 675 049 000 → 21 387 770 000**.

**f) Shipwreck – The Green Abyss 91-100** — https://www.srolobby.com/konular/silkroad-online-shipwreck-91-100-forgotten-world-map-rehberi.2251
- ★ Les uniques du Green Abyss (incertitude n°1 de la base KB) : **Ghost Beast** (navires 1-2), **Ghost Gultton** (dernier navire), boss final **Ghost Serenes**.
- 1-2★ = carte « Inside of The Shipwreck » ; 3-4★ = carte « Outside of The Shipwreck » (Ghost Beast spawn aussi hors navires).
| Monstre | 1★ (Lv93) | 2★ (Lv96) | 3★ (Lv99) | 4★ (Lv99) |
|---|---|---|---|---|
| Ghost Beast / Ghost Gultton | 1 130 727 000 | 1 981 689 000 | 5 284 504 000 | 8 399 751 000 |
| **Ghost Serenes** | **11 307 269 000** | **19 816 890 000** | **26 422 520 000** | **40 726 064 000** |
- Serenes invoque **2 Ghost Gultton** à bas HP ; en 3-4★ le boss arène contient Serenes + Gultton + Beast ensemble. Récompense : **D10 Seal of Moon** (confirme la KB).
- Il faut ouvrir au moins ~la moitié des zones/box pour que la carte révèle les Treasure Box.

**g) Shipwreck – The Sea of Resentment 101-110** — https://www.srolobby.com/konular/silkroad-online-shipwreck-100-110-forgotten-world-map-rehberi.2257
| Monstre | 1★ (Lv103) | 2★ (Lv106) | 3★ (Lv106) | 4★ (Lv109) |
|---|---|---|---|---|
| Ghost Beast / Ghost Gultton | 1 828 557 000 | 3 114 231 000 | 8 304 616 000 | 12 891 122 000 |
| **Ghost Serenes** | **18 285 574 000** | **31 142 310 000** | **41 523 079 000** | **62 502 412 000** |
- À bas HP : 2× Gultton + 2× Beast invoqués. Récompense : **D11 A Grade** (Nova A). Un joueur a vu 2 Serenes simultanés → réponse admin : « bug système, normalement un seul unique final ».

**Rareté des talismans par collection** (SroLobby + vSRO.org https://www.vsro.org/konular/forgetten-world-talisman-kart-listesi-8-9-10-11-dg-zorluk-derecesine-gore.7600) :
| Collection | Çok çıkar (commun) | Normal | Nadir (rare) |
|---|---|---|---|
| Togui (D8) | Red Tears, Western Scriptures, Togui Mask | Red Talisman, Puppet, Dull Kitchen Knife | Spell Paper, Elder Staff |
| Flame Mountain (D9) | Fire Flower, Horned Cattle, Flame of Oblivion | Flame Paper, Hearthstone Flame, Enchantress Necklace | Honghaeah Armor, Fire Dragon Sword |
| Green Abyss (D10) | Silver Pendant, Cobalt Emerald, Logbook | Love Letter, Portrait of a Woman, Jewelry Box | Diamond Watch, Mermaid's Tears |
| Sea of Resentment (D11) | Broken Key, Large Tong, Phantom Harp | Evil's Heart, Vindictive Spirit's Bead, Hook Hand | Commander's Patch, Serenity's Tears |

Autres confirmations TR : le FGW se joue **35-110** (SroMax https://www.sromax.com/konular/silkroad-fgw-rehberi-forgotten-world-detayli-anlatim.65 — « normaux mobs → Dimension Pillar → champion Envy → Dimension Hole → portail en ville »). Le serveur Legends Online (via recherche) annonce SoS D10 + 200K SP pour Green Abyss — variante de serveur.

### 4. 💰 Jobs & commerce — chiffres

**Profit historique** : DonanımHaber (2006, thread « silkroad'da tüccar olmak » — https://forum.donanimhaber.com/silkroad-da-tuccar-olmak--8024785) : on vend les goods à **361% du prix d'achat** (license trader ~10 000 gold au niveau 20). C'est LA référence turque historique du trade.

**Profit moderne (privés vSRO)** — vSRO.org https://www.vsro.org/konular/gold-sp-kasma-rehberi-slotlar-job-dungeon-ve-gunluk-taktikler.13648 :
- **Trade 5 étoiles = 30M+ gold par run** (seul chiffre du guide).
- **2 Traders + 1 Hunter = 90% de réussite** ; la capacité des pets augmente le gain.
- Mécanique privée : « rate kervan » multiplie l'achat NPC (15x = acheter 50M, vendre 750M) — https://www.vsro.org/konular/kervan-rate-hesaplama.1608

**Mécanique des étoiles (SroMax, guide Thief)** — https://www.sromax.com/konular/silkroad-online-thief-olmak-hirsiz-jobu-rehberi.294 :
- **Un voleur ne peut PAS attaquer directement un kervan 1★**.
- **1 NPC thief spawn par étoile** : un trader 4★ = 4 NPC thieves qui le suivent → c'est ainsi qu'on lit l'étoile d'un kervan.
- Tactique d'attaque indirecte d'un 1★ : porter soi-même 1 goods → un NPC thief vous poursuit → le placer sur le kervan ciblé.
- **Arrange Point (Wanted)** : seuil **3 000 points** → marqueur rouge, attaquable même sans costume ; se purge en payant l'amende à la Hunter Guild ou en se laissant tuer (perte XP).
- Burglar Town via NPC **YUMI** (Barron Street, Jangan, 2 000 gold) ; Black Suit 10 000 gold / Black Devil Suit 1 000 000 (esthétique) ; Bandit Den Return Scroll 1 000 gold.
- Les étoiles montent quand la valeur chargée dépasse des seuils (écran du chamelier/deveci affiche les étoiles) — FrmTR https://www.frmtr.com/sro-rehberler-sorular-ve-teknik-yardim/952764-job-taktikleri-trader-programi.html

**Promotion de job** (Extraloob — https://www.extraloob.com/threads/silkroad-online-job-level-atlatma-311517) : Trader → Merchant NPC, Hunter → Trader NPC, Thief → **Smuggler NPC**, option « Promote ». Rangs privés : 1-3 Basic (XP%), 4-6 Advanced (HP+damage), 7+ Elite (Zerk+resist) — vSRO.org.

**Routes** (burakakhan — https://burakakhan.com.tr/oyunlar/silkroad/kervan-ticaret) : la plus rentable = **Jangan ↔ Constantinople** (risque max) ; courte/sûre = **Jangan–Donwhang** ; le profit dépend de **distance × risque** ; le trade de nuit est plus sûr.

### 5. ⚔️ Fortress War — mécanique chiffrée (SroMax + SroCave + TurkHackTeam)

Sources : https://www.sromax.com/konular/silkroad-kale-savasi-fortress-war-detayli-rehberi.284 · https://srocave.com/konular/silkroad-online-fortress-war-nedir-nasil-kazanilir-kale-savasi-stratejileri-ve-oduller-2025.2474 · https://www.turkhackteam.org/konular/kale-savaslari-resimli-genis-anlatim.450568

- **Chaque vendredi** (heure standard Silkroad), durée ~**1 h** ; ~**300 joueurs** par guerre ; début après un compte à rebours de 5 s.
- Guild **niveau 3+** requis ; **20+ membres** pour s'inscrire ; inscription attaquant payante, défenseur gratuite ; guildes alliées acceptées.
- **Taxes** : taux réglable **-20% à +20%**, configuré **chaque samedi**, valable la semaine.
- **Bannières** (24 membres dans un rayon de 24 m) : War Flag **+10% dégâts** · Defense Flag **+10% absorption** · Healing Flag **+5% HP/MP toutes les 5 s**.
- Après occupation temporaire, les attaquants ne peuvent **pas re-renter 5 min** ; résurrection = **10 s d'invulnérabilité**.
- Ordre de structures (Bandit Fortress) : **Kapı 1 → Kapı 2 → Kule 1 → Kule 2 → Heart of Fortress** (première guilde à frapper le Cœur prend la forteresse).
- Interdits : costume/bannière de job, return scroll (résurrection scroll autorisé). PK autorisés (pas de drop d'item).
- Turkmmo « kale vergi sistemi » : seuls le leader/commandant règlent la taxe.

### 6. 📊 Dégâts & stats — formules turques

Source : https://silkroadportal.com/konular/silkroad-online-hasar-defans-hesaplama-attritube-stone.366 (repris par https://www.srolobby.com/konular/silkroad-online-reinforce-nedir.560) :
- **Fiziksel Hasar = Total STR × Physical Reinforce % + Physical Attack Power**
- **Büyüsel Hasar = Total INT × Magical Reinforce % + Magical Attack Power**
- Mêmes formules pour les défenses (STR/INT × Reinforce + Def Power).
- Attribute stones : Warrior → Phy Reinforce arme · Meditation → Mag Reinforce arme · Life → Phy Reinforce armure · Spirit → Mag Reinforce armure.

SroCave « Temel Bilgiler » (https://srocave.com/konular/silkroad-online-oyunu-hakkinda-en-temel-bilgiler-karakter-yapilandirmasi-ve-itemler.2635) :
- **Attack Rating** : rapproche le dégât du maximum (important après Lv 44) · **Parry** : rapproche le dégât subi du minimum (arme 100-150 → haute parry ≈ 100) · **Crit** : « en %, exactement inconnu » · **Block** : chance de bloquer complètement (bouclier).
- **Stats** : 5 points/niveau dont 2 auto (1 STR + 1 INT).
- **Status effects** : Burn (perte HP toutes les **2 s**) · Electric shock (baisse parry) · Freezing (immobilise) · Frostbite (ralentit) · Poison (dégâts fixes) · Stun · **Zombie (les potions RÉDUISENT HP/MP)**.
- **Éléments** : Cold = dégâts les plus bas + freeze · Lightning = intermédiaire + vitesse · **Fire = dégâts max + burn** · Force = heal/support.
- **Bleus de protection** : Immortal/Steady/Lucky ont un **nombre limité d'utilisations** (ex. « Steady(2Time) » disparaît après 2 échecs).

### 7. 🎨 Couleurs des mobs ↔ drops/SoX (SroLobby)

Source : https://www.srolobby.com/konular/silkroad-online-mob-renkleri-ve-item-drop-iliskisi.2486 — par rapport à VOTRE niveau :

| Couleur | Écart | Exp/SP | Chance SoX |
|---|---|---|---|
| 🔵 Mavi (bleu) | -7 lvls et moins | quasi nulle | quasi nulle |
| 🟢 Yeşil (vert) | -6 lvls | **meilleur SP** | **LA PLUS HAUTE du jeu** |
| ⚪ Gri (gris) | 0 à -3 | équilibré | 2e meilleure |
| 🟠 Turuncu (orange) | +1 à +5 | bonne exp, SP faible | plus basse que gris |
| 🔴 Kırmızı (rouge) | +6 et plus | exp max, SP nul | **la plus basse** |

→ Règle TR : **farmer le SoX sur des mobs verts (-6)**, l'exp sur rouges/orange. À rapprocher des threads Elitepvpers (~30% chance de stat bleue, rare drop ≈ 0.001/mob) cités dans la recherche.

### 8. 🗺️ Leveling & SP farming

**Routes complètes 1-90 STR et INT** (SroLobby — https://www.srolobby.com/konular/silkroadda-hangi-levelde-hangi-moblarda-kasilmaliyiz.1010) :
- STR : 1-5 Mangyang → 5-7 Weasel → 5-11 Water Ghost → 11-14 Yeoha → 14-18 Tigers → 18-21 Chakji → 21-27 Bug/Hyungo Ghost → 27-30 Earth Ghost → 30-32 Hyeongcheon → 32-35 Scorpions/Flowers → 35-38 Yeowa → 38-42 Black Robbers → 42-46 Bunwang → 46-50 Ujigi → 50-54 Shades → **54-56 Penon Fighter** → 56-59 Sonar → 59-61 Yeti → 61-67 Earth Ghost (bugs→warriors) → 67-70 Mole/Devil Nachal → 70-76 Wing Tribe → 78-82 Antelope/Antinoke → 82-90 Wing Tribe Attacker/Rocky.
- INT : variante avec Maong 42-45, Golden Spiders 45-48, Black Eagle 66-68. Conseil TR 80-90 : préférer **Wing Tribe Attacker** à Rocky (peu de slots → kill-steal).

**Slots par tranche (vSRO.org — https://www.vsro.org/konular/gold-sp-kasma-rehberi-slotlar-job-dungeon-ve-gunluk-taktikler.13648)** :
| Niveau | Zone |
|---|---|
| 1-20 | Jangan/Constantinople |
| 20-40 | Donwhang Est – Spider Hill (Tiger Woman, Uruchi) |
| 40-60 | **Karakoram – Penon & Bon Goblin** (AoE) |
| 60-80 | Taklamakan – slots Sonar (AoE) |
| 80-90 | **Roc Mountain – slots Giant** (SP idéal) |
| 90-100 | Désert d'Alexandria (solo) |
| 101-110 | Jupiter Temple / Mirror |
| 111-120 | Mirror Dimension / Job Temple (party) |
- SP : **GAP 5-9** ; recommandation TR **GAP 9 pour les niveaux 70-100** ; party type 1 Cleric + 2 Warrior + 3 Wizard + 1 Bard + 1 Warlock.

### 9. 🐺 Pet loup (kurt)

- Sources : https://r10dev.net/konular/silkroad-online-kurt-wolf-kullanim-rehberi-2026.10845 + https://forum.donanimhaber.com/kurt-gelisimi-bakinnn--7727724 + https://www.frmtr.com/sro-rehberler-sorular-ve-teknik-yardim/2893708-silkroad-wolf-gelisimi.html
- **Gri Kurt** (gris) chez le NPC (basique) · **Beyaz Kurt** (blanc) = **130 Silk** (évolue visuellement à Lv 40 — vidéo « Büyük Evrim »).
- **Étapes d'évolution (DonanımHaber)** : **Lv 40 → kurt (loup)** · **Lv 50 → Barbar Tribe** · **Lv 60 → Leopard**. (Un forumeur conteste : à 40 il devient seulement « azman »/grand chien.)
- Niveau 5+ requis pour posséder un pet ; le loup gagne de l'XP en suivant (mode défense, touche Page Down) sans attaquer.
- Système récent (SroMax https://www.sromax.com/konular/silkroad-online-pet-evrim-sistemi-rehberi.516) : conversion **attack pet → fellow pet** via **Potion of Evolution** (item mall) chez l'**Atçı NPC** (éboueur/stable).

### 10. 🧱 Tablettes & pierres (DonanımHaber)

Source : https://forum.donanimhaber.com/tabletler-ve-islevleri--13403834 — nomenclature turque complète :
- **Attribute Stones** (réinitialisent un roll) : Courage (atk phy arme), Warrior (reinforce phy arme), Philosophy (atk mag arme), Meditation (reinforce mag arme), Challenge (crit arme), Focus (attack rating arme), Flesh (def phy), Life (reinforce phy), Mind (def mag), Spirit (reinforce mag), Dodging (parry), Agility (block ratio bouclier), Training (absorb phy accessoire), Prayer (absorb mag accessoire).
- **Alchemy Stones** (ajoutent) : Strength/Intelligence (+STR/+INT), Strike (attack rating), Discipline (block/parry arme), Penetration (crit block bouclier), Stamina (+HP plastron/jambières/tête), Magic (+MP idem), Fogs/Air/Fire/Immunity/Revival (protections frost/zap/burn/poison/zombie sur accessoires), Immortal/Steady(labeled Hardness)/Lucky/Astral (item mall).

### 11. 💵 Marché turc (prix RMT 2024-2026)

- 1M gold ≈ **4,50-6,00 TL** selon serveur (Hebe ~4,50 TL/M — Klasgame https://www.klasgame.com/en/joymax/silkroad-online-joymax/silkroad-gold ; lots 28 TL — Kopazar https://www.kopazar.com/silkroad-online-gold ; à partir de 11 TL — GameSatış).
- Annonce type : « [LİDYA] 100M gold + 1 100 silk ≈ **4 900 TL** » (SilkroadPazar https://www.silkroadpazar.com).
- Silk officiel TR (serveur Gamegami) vendu par ByNoGame — https://www.bynogame.com/tr/oyunlar/silkroad-online

---

## ✅ Réponses aux incertitudes de la base

| Incertitude KB | Réponse trouvée côté turc | Confiance |
|---|---|---|
| **29_FGW #1 : noms des uniques du Green Abyss (91-100)** | ✅ **Ghost Beast** (navires 1-2), **Ghost Gultton** (dernier navire), boss **Ghost Serenes** — SroLobby.2251 | **5** |
| **29_FGW #5 : niveaux/HP des uniques FGW** | ✅ Tables complètes 7 tranches/4 grades (voir §3) — SroLobby. Valeurs massives (143M → 62.5 Md), style vSRO | **4** (niveaux 5, HP 4 — à recouper `_RefObjCommon`) |
| **29_FGW #2 : type des monstres grades 3-4** | ✅ Grades 3-4★ = monstres **Elite** (1★=General, 2★=Champion ; Envy : 1★=Champion, 2★/4★=Elite) — SroLobby+SroMax | **4** |
| **29_FGW #3 : multiplicateurs de drop des talismans** | 🟡 Pas de chiffres, mais **paliers de rareté officiels** par carte : 3 communs / 3 normaux / 2 rares (tableau §3) — SroLobby + vSRO.org | **4** (qualitatif) |
| **29_FGW : récompenses par collection** | ✅ Confirmé : Togui D8 **SUN**, Flame Mtn D9 **SUN**, Green Abyss **D10 MOON**, Sea of Resentment **D11 A Grade** — SroLobby | **4** |
| **15_UNIQUES : HP/niveaux officiels** | ✅ Table 7 uniques confirmée par 2 sources TR indépendantes (TG 598 720 → Shaitan 12 732 060) + Qin-Shi B6 (SoSo 27.6M, BeakYung 183.5M) | **5** |
| **15_UNIQUES : timers de spawn** | ✅ « 3,5-5 h » générique, min 2 h après mort, aléatoire ; par unique : TG 210-390 min, Cerb 200-400, Ivy 200-450(700), Uruchi 230-450 — DonanımHaber + Extraloob | **4** |
| **15_UNIQUES : niveau de BeakYung/Medusa** | 🟡 Divergence : sources TR disent **Lv 100** (vs 105 dans la KB). Même HP que la KB (183 535 199 = 183.5M) | **3** — à trancher par client |
| **05_ALCHEMY : taux réels** | ✅ **Validation croisée majeure** : les valeurs DB décompressées par SroCave (50/40/30/19/17/12 + powder 50/30/20/8/8) concordent avec HyperbotDoc (50.58/40.07/29.99/19.13 mesurés). Le powder **s'additionne** (pas multiplicatif) | **5** |
| **05_ALCHEMY : autres bonus** | ✅ Lucky stone = **+5%** (usage unique), Premium PLUS = **+5%** — SroCave (mesures Wilson) | **4** |
| **09_JOB : profits chiffrés** | ✅ **361%** du prix d'achat (iSRO 2006, DonanımHaber) ; **30M+ gold/run en 5★** (privés, vSRO.org) ; team 2T+1H = 90% réussite | **3-4** (ères différentes) |
| **09_JOB : lecture des étoiles / vol** | ✅ **1 NPC thief par étoile** ; 1★ inattaquable directement par joueur (règle confirmée) ; Arrange Point ≥ **3 000** = wanted | **4** |
| **09_JOB : promotion** | ✅ Merchant/Trader/Smuggler NPC → « Promote » — Extraloob | **4** |
| **26_SP : GAP optimal** | ✅ GAP **9** = max utile, recommandé 70-100 ; GAP 5-9 efficace — vSRO.org (citent Fandom/UnKnoWnCheaTs) | **4** (confirme la KB, pas de source primaire TR) |
| **26_SP : spots** | ✅ Penon 54-56, Karakoram 40-60, Roc Mountain giants 80-90, Jupiter/Mirror 101+ — SroLobby + vSRO.org | **4** |
| **28_ADV : formules dégâts** | 🟡 Version simplifiée TR (Dégât = STR × Reinforce% + Atk Power) — ne couvre NI les constantes 1.2767/1.2870 NI la variante crit | **3** |
| **28_ADV : effets de status** | ✅ Burn = tick HP **2 s** ; Zombie = potions néfastes — SroCave | **4** |
| **19_FORTRESS : mécanique chiffrée** | ✅ Vendredi/1 h/300 joueurs/taxes ±20% le samedi/flags +10% (24 membres, 24 m)/10 s invulnérable/5 min lockout — SroMax+SroCave+THT | **4** |

---

## 📔 Glossaire turc → français des termes SRO

> Compilation depuis toutes les sources ci-dessus. La communauté TR mélange volontairement anglais (skill, drop, unique, level) et turc.

| Turc | Français | Contexte |
|---|---|---|
| **simya** | alchimie | système d'enchantement |
| **iksir** | élixir | composant d'alchimie |
| **şans tozu** | poudre de chance | Lucky Powder |
| **artı basma** | « mettre un plus » | enhancement +X |
| **yanma** | « brûler » | destruction d'item à l'alchimie |
| **sıfırlanma** | remise à zéro | retomber à +0 |
| **taş** | pierre | tablette/pierre d'alchimie |
| **kırılmayı önler** | empêche la casse | effet Immortal |
| **dayanıklılık** | durabilité | durability |
| **canavar / yaratık** | monstre / créature | |
| **uniq** | unique | boss unique |
| **kasma** | farming/grinding | « kasılma yerleri » = spots de farm |
| **level atma** | leveling | |
| **kervan** | caravane | convoi de trade |
| **tüccar** | marchand | Trader |
| **hırsız** | voleur | Thief |
| **avcı** | chasseur | Hunter |
| **meslek** | métier | job |
| **lonca** | guilde | guild |
| **birlik** | union | de guildes |
| **kale savaşı** | guerre de forteresse | Fortress War |
| **kale kalbi** | Cœur de la forteresse | Heart of Fortress |
| **kale kapısı / kule** | porte de forteresse / tour | gate / tower |
| **koçbaşı** | bélier | ram (siège) |
| **mancınık** | trébuchet | catapult |
| **bayrak** | bannière | flag de FW |
| **vergi** | taxe | taxe de forteresse |
| **yetenek** | compétence | skill |
| **ustalık** | maîtrise | mastery |
| **nuke** | nuke | sort élémental chinois |
| **büyüsel / fiziksel** | magique / physique | |
| **hasar** | dégât | damage |
| **savunma / saldırı** | défense / attaque | |
| **kritik / blok** | critique / blocage | |
| **görev** | quête | quest |
| **zindan / mahzen** | donjon | dungeon |
| **sandık** | coffre | Treasure Box |
| **derece (DG)** | degré | degré d'item (8D, 11D…) |
| **mühür (yıldız/ay/güneş)** | sceau (étoile/lune/soleil) | Seal of Star/Moon/Sun |
| **mavi özellikler** | stats bleues | blues |
| **eşya** | objet | item |
| **silah / zırh / kalkan** | arme / armure / bouclier | |
| **takı / gerdanlık** | accessoire / collier | |
| **giysi** | vêtement | pièce d'armure |
| **düşme / düşürme** | drop / faire dropper | |
| **doğma / çıkış** | spawn | « çıkış yerleri » = points de spawn |
| **pazar** | marché / étal | Stall |
| **altın** | or | gold |
| **kazanç / kâr** | gain / profit | |
| **parti** | groupe | party |
| **gap / açık** | écart (mastery) | SP gap |
| **kurt** | loup | pet |
| **atçı** | maître des écuries | Stable NPC |
| **deve / deveci** | chameau / chamelier | transport de trade |
| **at** | cheval | monture |
| **soyguncu** | contrebandier | Smuggler (NPC thief) |
| **hırsız yuvası / Burglar Town** | repaire des voleurs | ville des thieves |
| **tapınak** | temple | Job Temple |
| **mezar** | tombe | Qin-Shi Tomb |
| **ceza / ödül** | pénalité / récompense | |
| **günlük** | quotidien | daily |
| **nadir** | rare | |
| **kayıp dünya / unutulmuş dünya** | monde oublié | Forgotten World |
| **süre / saat** | durée / heure | timers |
| **Cuma / Cumartesi** | vendredi / samedi | jours FW/taxes |
| **evrim / gelişim** | évolution | pet |
| **besleme / yem** | nourrissage / nourriture | pet |
| **kervan savaşı** | bataille de caravanes | event |
| **kesmek / kesim** | tuer (un boss) | « Medusa kesimi » |
| **cellat**... *(non attesté)* | — | — |

*(60+ entrées attestées dans les sources ; les noms propres d'uniques/items restent en anglais dans l'usage TR : Tiger Girl, Lord Yarkan, Seal of Sun…)*

---

## ❓ Incertitudes non résolues

Les points suivants **n'ont trouvé aucune réponse** dans les sources turces consultées :

1. **Multiplicateurs numériques de drop des talismans FGW par grade** — seuls les paliers qualitatifs (commun/normal/rare) existent côté TR.
2. **Timer d'instance FGW (2 h vs fenêtre 5 h)** — aucun guide TR ne mentionne la durée d'instance.
3. **Constantes multiplicatrices de dégâts (1.2767…/1.2870…) et variante du crit** (28_ADVANCED) — les formules turques sont la version simplifiée sans ces constantes.
4. **Échelle absolue de vitesse d'attaque (coups/min par arme)** — non documentée en TR.
5. **Chance de proc des imbues par pallier de skill** — non documentée en TR (seule la hiérarchie Cold < Lightning < Fire est consensus).
6. **Guide TR dédié au Job Temple** (HP/loot exacts Neith/Seth/Haroeris) — inexistant en turc ; la référence reste eXay (EN) + vidéos TR anecdotiques.
7. **Noms des uniques du Holy Water Temple** — introuvables en TR.
8. **HP/loot de Roc en turc** — non trouvé (seul Elitepvpers anglophone le chiffre).
9. **Niveau exact de BeakYung/Medusa (100 TR vs 105 KB)** — divergence non tranchée.
10. **Prix historiques du marché TR (2006-2013, ère DonanımHaber)** : les fils de l'époque évoquent les prix en millions de gold mais les valeurs unitaires (prix d'un SoS, d'un élixir D8…) n'ont pas été retrouvées dans les threads accessibles (FrmTR/TurkMMO renvoient 403).
11. **SP/heure chiffrés** — les guides TR donnent des slots et méthodes mais jamais de ratio SP/h mesuré.
12. **Noms turcs des skills** — iSRO n'ayant jamais été localisé en turc, les skills restent en anglais dans les guides TR : le glossaire multilingue de la KB ne peut pas être enrichi de noms de skills turcs officiels (inexistants).

---

## 🔬 Notes méthodologiques

- ~22 requêtes WebSearch en turc + ~25 WebFetch de pages turques (forums, blogs, wikis).
- Sites en 403 (contenu partiel via extraits de recherche uniquement) : FrmTR, TurkMMO, MMSRN, ZsZC Fandom — leurs données citées ici proviennent uniquement des snippets de recherche, fiabilité plafonnée à 3.
- Les HP « K » turcs ont été convertis (143.131K = 143 131 000).
- Les données FGW SroLobby proviennent probablement d'un client vSRO : **niveaux et structure fiables, HP à re-valider** avant implémentation SRObro (contrôle recommandé : `characterdata_5000.txt` / `_RefObjCommon`).

---

*Rapport généré le 2026-10-01 — recherche communautaire turque pour SRObro. Aucun autre fichier de la base n'a été modifié.*
