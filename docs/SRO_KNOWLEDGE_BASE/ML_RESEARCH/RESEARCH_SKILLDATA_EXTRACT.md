# RESEARCH — Extraction et décodage de skilldata (client Silkroad vSRO 1.188)

> **Date** : 2026-10-01 · **Objectif** : obtenir les **valeurs chiffrées par niveau** de toutes les compétences CH/EU (dégâts, MP, cooldowns, durées, probabilités d'effets) à partir du vrai fichier client `skilldata_*.txt`, pour combler la lacune principale des `SKILLS_DATABASE_*.md` (structure sans chiffres).
>
> **Livrables** : `ML_RESEARCH/data/skills_masteries.csv`, `skills_series.csv`, `skills_detail_CH.csv`, `skills_detail_EU.csv` (+ ce rapport).

---

## 1. Méthodologie et source exacte

### 1.1 Fichiers source utilisés

| Fichier | URL (raw, branche `main`/`master`) | Rôle |
|---|---|---|
| `skilldata_5000.txt` … `skilldata_40000.txt` (8 shards) | `github.com/joaodematejr/server_files_sro` → `SMC/SR_GameRefData/skilldata_*.txt` | **Données principales** (~32 700 lignes, UTF-16LE, TSV, 118 colonnes) |
| `skillmasterydata.txt` | même repo | IDs/noms officiels des maîtrises (257-259, 273-276, 513-518) |
| `skills.txt` | `github.com/tarekwiz/SilkroadBot` → `Silkroad Fusion/bin/Debug/Data/skills.txt` | **Noms anglais** par codename + maîtrise requise (croisement, 100 % de match) |
| `RawRefSkill.cs` | `github.com/hnguyenaa/MySilkroad` → `Source/AutoSilkroad/ParseMediaData/Models/RawRefSkill.cs` | **Nommage officiel des 66 premières colonnes** (parseur C# _RefSkill) |
| `docs/formats/textdata-skilldata.md` + `client/src/assets/textdata/skilldata.rs` | `github.com/ferdoran/openroad` | Table des **tags fourcc du flux de paramètres**, « corpus-verified v1.188 » |
| `skilldata_5000.txt` (copie DarkEmu + MySilkroad) | `github.com/CarlosX/DarkEmu`, `github.com/hnguyenaa/MySilkroad` | Recoupement (version ~2006 plus ancienne, noms coréens, sans EU joueurs) |

### 1.2 Pourquoi ces sources

- La recherche GitHub (`filename:skilldata_5000`) ne retourne presque rien : **GitHub n'indexe pas les fichiers > 384 Ko** et les dumps font 3,7 Mo. Il a fallu chercher des **repos contenant les fichiers serveur vSRO complets** (1,1-2,7 Go) puis viser directement `SMC/SR_GameRefData/`.
- Le repo `SRO-Server-Browser/SRO-SB_Client_Data` (2,7 Go) contient les `.pk2` bruts — inexploitables sans extraction PK2 ; le repo `joaodematejr/server_files_sro` livre les **textdata déjà en clair**, c'est la voie facile.

### 1.3 Version du jeu estimée

- Base = **fichiers serveur vSRO 1.188** (le SMC/SR_GameRefData est la structure exacte de la fuite vSRO 1.188, documentée par SilkroadDoc « analyzed from vSRO 1.188 »).
- **Extension cap 120 déjà appliquée** dans ces fichiers : maîtrises requises jusqu'à **120** (ex. `God Lion Shout` à maîtrise Foudre 120, `Dare Devil` lv11 à Warrior 120), skills CH tardifs jusqu'à l'ID 33382, EU jusqu'à 31117. Les noms côté serveur sont des placeholders `????` (normal côté serveur : les noms vivent dans `skillstrdata.txt` côté client) — d'où le croisement avec `skills.txt`.
- Recoupement qualité : **100 % des 6 909 skills joueurs** du dump retrouvent un nom anglais dans `skills.txt` ; inversement **7 860/8 763** codenames de `skills.txt` sont couverts par le dump (les 903 absents sont des `P2SKILL_*`, `SKILL_EVENT_*` d'un client hybride plus récent utilisé par le bot).

### 1.4 Découpages constatés (shards)

| Shard | Lignes | IDs | Contenu joueur |
|---|---|---|---|
| 5000 | 4 845 | 1-4 999 | CH skills historiques (1 889) |
| 10000 | 4 935 | 5 000-9 999 | CH (1 250) + **EU début** (1 558) |
| 15000 | 4 937 | 10 000-14 999 | EU suite (1 973) |
| 20000 | 5 000 | 15 000-19 999 | monstres/npc |
| 25000 | 4 851 | 20 000-24 999 | CH/EU tardifs (cap 120) |
| 30000 | 4 998 | 25 000-29 999 | monstres |
| 35000 | 3 038 | 30 000-34 602 | EU tardifs |
| 40000 | 80 | 36 719-36 977 | divers |

**Total : 32 684 lignes**, dont **6 909 skills joueurs** (3 272 CH / 3 637 EU), 15 578 skills de monstres (`MSKILL_*`/`HSKILL_*`/`TSKILL_*`), le reste événementiels/mall/quests.

---

## 2. Format documenté (décodage propre, sourcé)

### 2.1 Conteneur

UTF-16LE + BOM, tabulations, CRLF, **118 colonnes par ligne** : 69 colonnes fixes + **flux de paramètres de 49 colonnes** (cols 69-117). Une ligne = **un niveau** d'un skill.

### 2.2 Colonnes fixes (0-68) — noms officiels `RawRefSkill.cs`, validés empiriquement

| # | Colonne | Découverte clé |
|---|---|---|
| 0 | `Service` | toujours 1 |
| 1 | `ID` | clé unique du niveau |
| 2 | `GroupID` | partagé par tous les niveaux d'une série (c'est lui que référencent les prérequis `ReqLearn_Skill`) |
| 3 | `Basic_Code` | codename par niveau (`SKILL_CH_SWORD_SMASH_A_01`) |
| 4 | `Basic_Name` | `????` côté serveur — noms réels via skills.txt |
| 5 | `Basic_Group` | codename de série (clé de jointure universelle) |
| 7 | `Basic_Level` | niveau dans l'échelle (1-based) |
| 8 | `Basic_Activity` | **0 = passif, 1 = instant/auto (imbues, potions), 2 = castable** |
| 9 | `Basic_ChainCode` | ID du segment **suivant** d'un combo (0 = fin). Les continuations ont MP=0 |
| 10 | `Basic_RecycleCost` | 99 999 999 sur les attaques castables |
| 11 | `Action_PreparingTime` (ms) | **1 000 ms sur les nukes CH** — c'est la fameuse « longue incantation » |
| 12 | `Action_CastingTime` (ms) | ex. 411 (Strike Smash), 1 334 (Meteor) |
| 13 | `Action_ActionDuration` (ms) | = la valeur « cast » de skills.txt (vérifié sur 4 skills témoins) |
| 14 | `Action_ReuseDelay` (ms) | **cooldown** — = la valeur « cd » de skills.txt ✓ |
| 15 | `Action_CoolTime` (ms) | deuxième timer (0 sur la plupart) |
| 16 | `Action_FlyingSpeed` | 400 sur les projectiles arc/arbalète, 0 = instantané |
| 21 | `Action_Range` | portée : 150 = nukes distance, 100 = mi-portée EU, 50 = AoE mêlée, 0 = portée de l'arme |
| 26-33 | `TargetGroup_*` | self/ally/enemy/party/select-dead-body |
| 34/36 | `ReqCommon_Mastery1 / MasteryLevel1` | **maîtrise requise** (ex. 275 = Feu, niveau 5 pour l'imbue lv1) |
| 40-45 | `ReqLearn_Skill1-3 / SkillLevel1-3` | prérequis d'autres séries (via GroupID) |
| 46 | `ReqLearn_SP` | **coût SP d'apprentissage** |
| 50/51 | `ReqCast_Weapon1/2` | codes armes (255 = libre) — carte empirique : 2=sword, 3=blade, 4=spear, 5=glaive, 6=bow, 12=crossbow, 13=dagger, 14=harp, 15=shield, 8=2h EU, 11=staff wizard, 10=staff warlock |
| 52/53 | `Consume_HP / Consume_MP` | **coûts par cast** (0 sur passifs et continuations de combo) |
| 54/55 | `Consume_HPRatio / MPRatio` | coût en % (0 quasi partout) |
| 57-60 | `UI_SkillTab/Page/Column/Row` | position dans la fenêtre de maîtrise (255 = masqué) |
| 61 | `UI_IconFile` | chemin icône `.ddj` |

### 2.3 Flux de paramètres (cols 69+) : tags fourcc

Les paramètres sont une **liste linéaire** de tags encodés en **entier big-endian ASCII** (ex. `6386804` = `0x617474` = `'att'`), chacun suivi d'un nombre fixe d'arguments. Le client lit jusqu'au premier tag inconnu.

**Table de base (openroad, confirmée)** puis **corrections mesurées sur le corpus** (distance au tag suivant, 32 684 lignes) :

| Tag (int) | argc | Signification décodée |
|---|---|---|
| `att` (6386804) | 5 | **Dégâts** : `<kind> <pct> <min> <max> <pct2>` — ex. Strike Smash lv1 `5,143,15,18,143` = **143 % + 15~18**. kinds observés : **5 = physique %** (armes CH/EU), **8 = magique imbue**, **10 = magique %** (nukes, Fire Bolt), 6/9 = variantes EU |
| `mc` (…`'mc'`) | 2 | nombre de **hits** d'un combo (Meteor = 2) |
| `dura` (1685418593) | 1 | **durée d'effet en ms** (imbues 6 000 ; Pain Quota 300 000) |
| `cr` (…) | **2** (corrigé, openroad disait 1) | **critique** : Anti Devil Bow = +20 constant |
| `ru` | 1 | portée bonus |
| `heal` (…) | **4** (corrigé) | **soin** (Healing Orbit 1 819→4 722) |
| `defp` (…) | **3** (corrigé) | **défense/blocage** : Iron Skin 238→2 972 absorbés ; Basic Fire protection (0, 6→14, 0) = +6→14 % |
| `hr`/`er` | 2 | hit rate / parry rate (flat, pct) |
| `st` | 3 | stun : durée ms, prob %, niveau |
| `cnsm` | 3 | consommation liée |
| `efr` | 6 | géométrie d'effet de zone (AoE) |
| `getv`/`MAAT` | **0** (corrigé pour getv) | plomberie getter |
| `reqi` | 2 | condition d'item |
| `summ` | 5 | invocation (faucons Pacheon : puissance en arg4) |

### 2.4 Tags d'effets de statut découverts (contribution originale de cette recherche)

Non documentés par openroad, identifiés par décodage fourcc des « restes » + récurrence sur des séries dont l'effet est connu :

| Tag | Code int | argc | Signification (preuves) |
|---|---|---|---|
| `kb` | 27490 | 2 | **knockback** — `SPEAR_ROUNDAREA_B` [35,50], Dare Devil [30,50] |
| `ko` | 27503 | 2 | **knockdown** — `SWORD_KNOCKDOWN_A` [19,50] |
| `bu` | 25205 | 3 | **brûlure** (imbue feu) [prob%, 25, niveau] |
| `fb` | 26210 | 2 | **frostbite** (imbue glace + Cold Wave) [prob%, 100] |
| `fz` | 26234 | 2 | **freeze/gel** — Frost Nova [66→132, 50] |
| `es` | 25971 | 3 | **électrocution** (imbue foudre) [32→65, 20, 50] |
| `bl` | 25196 | 5 | **saignement** — `SMASH_D` [30 000 ms, …] |
| `da` | 25697 | 1 | **down attack** (suivi du tag `reqc`) |
| `sl` | 29548 | 3 | **sommeil** — `SWORD_CHAIN_G` [20 000, 20, 10] |
| `ds` | 25715 | 4 | drain de vie (Warlock) |
| `tnt2` | 1953395762 | 2 | **taunt/provocation** (Dare Devil) |
| `setv`/`tant`/`cssr`/`rt`/`ps`/`cshp`/`lks2`/`puls`… | — | — | imbriqués/partiellement décodés, gardés en brut dans `params_raw` |

Validation : **0 tag inconnu** sur les 31 409 lignes portant des paramètres après ajout de la table corrigée.

---

## 3. Volumes et livrables CSV

Tous dans `ML_RESEARCH/data/` (UTF-8, séparateur `,`) :

| Fichier | Lignes | Contenu |
|---|---|---|
| `skills_masteries.csv` | 14 | une maîtrise = une ligne : ID, nom EN/KR, race, nb séries, nb niveaux, plage d'IDs |
| `skills_series.csv` | 566 | une **série** = une ligne : nom, maîtrise, nb niveaux, maîtrise req premier/dernier livre, SP/MP/cast/cd/att lv1 et dernier, tags, statuts |
| `skills_detail_CH.csv` | 3 272 | **un niveau de skill = une ligne**, 47 colonnes décodées + `params_raw` |
| `skills_detail_EU.csv` | 3 637 | idem côté EU |

Colonnes des CSV détail : `id, group_id, codename, series, name, race, mastery_id, mastery, mastery_kr, level, activity, chain_next_id, prepare_ms, cast_ms, action_ms, cooldown_ms, cooltime_ms, flying_speed, range, req_mastery_lv, req_sp, weapon1, weapon2, hp_cost, mp_cost, hp_ratio, mp_ratio, ui_tab/page/col/row, icon, tags, att_kind, att_pct, att_min, att_max, dura_ms, mc_hits, cr, cr2, heal, heal234, defp, defp23, hr_*, er_*, st_*, status, leftover, params_raw`.

---

## 4. Découvertes chiffrées notables

### 4.1 Loi de progression : le % est FIXE, la composante fixe monte

Sur toutes les séries d'attaque testées, `att_pct` ne change **jamais** avec le niveau — seule la fourchette `min~max` progresse (+≈ factor 3 à 4 du lv1 au lv max), ainsi que le coût MP :

- **Strike Smash** (Bicheon, maîtrise 5→21, 9 lv) : 143 % + 15~18 → **143 % + 47~57** ; MP 19→60 ; SP 2→62 ; cast 411/1 022 ms ; CD 3 s constants.
- **Flame Wave - Arrow** (nuke feu, maîtrise 30→64, 18 lv) : 250 % + 123~205 → **250 % + 464~773** ; MP 348→1 310 ; SP 144→1 079 ; prep 1 000 + cast 500 ms ; CD 4 s.
- **Fire Bolt** (Wizard, maîtrise 4→120, 30 lv) : 366 % + 32~39 → **366 % + 3 438~4 202** ; MP 37→**5 799** ; SP 2→**27 050** ; burn 28→260.
- **Meteor** (Wizard, maîtrise 60→116, 15 lv) : 439 % + 582~711 → **439 % + 3 076~3 760** ; MP 2 189→12 444 ; **CD 10,5 s** ; **2 hits** (`mc`=2) ; burn [140→252, 30, 60→116].
- **Dare Devil** (Warrior 2H, maîtrise 80→120, 11 lv) : 305 % + 702~858 → 305 % + 2 262~2 765 ; MP 1 311→4 063 ; CD 5 s ; 2 hits ; **knockback [30,50] + taunt**.

### 4.2 Imbues CH : le modèle économique complet

`durée 6 s, CD 6 s` (recast permanent), dégâts magiques `kind 8` à 100 %, probabilité d'effet qui monte avec le niveau, niveau d'effet = 2×niveau-1 :

| Série | Effet | lv1 | lv9 |
|---|---|---|---|
| River Fireforce (feu A) | att 100 %+17~29 / burn | 32 %, 25, niv 1 | 100 %+55~92 / **65 %, 25, niv 17** |
| Thunder Tiger Force (foudre A) | att 100 %+14~25 / shock | 32 %, 20, 50 | 100 %+44~81 / **65 %** |
| Cold imbue A | att 100 %+14~21 / freeze+frostbite | 32 %/32 % | 65 %/65 % |

### 4.3 La question « les nukes CH n'ont pas de crit » — réponse dans les données

Le tag `cr` (critique) n'existe que sur **14 séries** du jeu entier : `BOW_CRITICAL_*` (Anti Devil Bow, +20 constant), `BOW_POWER_C/D/E` (Strong Bow), `SWORD_DOWNATTACK_D/E`, `EU_WARRIOR_TWOHANDP_CRITICALUP_A` (passif warrior). **Aucune série de nuke** (Flame Wave/Fire Wall, Frost Nova/Snow Storm, Lion Shout) **ni aucune imbue ne porte `cr`** → conforme au savoir communautaire : le critique des nukes CH ne vient pas du skill lui-même.

### 4.4 Buffs/support chiffrés

- **Pain Quota** (Warrior) : durée **300 000 ms = 5 min**, CD 2 s, MP 17→256 (mécanique de partage de dégâts dans les tags imbriqués).
- **Healing Orbit** (Cleric, maîtrise 80→116, 7 lv) : soin **1 819→4 722** par cycle, durée 16 s, CD 10 s, MP 5 822→15 111.
- **Iron Skin** (Warrior) : absorption **238→2 972**.
- **Basic Fire protection** (GANGGI_A) : +**6 %→14 %** défense, durée ≈ 6,3→7,7 min.
- **Frost Nova - Wind** : freeze **66 %→132 %**, frostbite 66→132, CD 6 s (l'effet `tant` scaling 232→936 suit la courbe MP).

### 4.5 Économie générale (cap 120, fichiers complets)

- **SP cumulés pour tout apprendre** : Bicheon **2 751 184** SP · Heuksal 2 049 327 · Pacheon 1 783 462 · Cold 1 883 926 · Lightning 1 215 885 · Fire 1 811 697 · Force 1 482 143 · Warrior **4 204 688** · Warlock 3 672 099 · Rogue 2 930 473 · Wizard 2 771 857 · Cleric 2 813 755 · Bard 2 575 210.
- Cooldowns les plus fréquents (castables) : **4 s** (955 skills), 10 s, 5 s, 8 s, 3 s ; 60 s pour les gros CDs.
- Portées : **150** (1 645 skills — nukes distance), 100 (268), 50 (61 — AoE mêlée), 200 (arcs).
- Skills les plus chers en MP lv1 : Mana Orbit **15 896**, God's Thunderbolt 13 388, Flame Wave - Disintegrate 9 541.
- Répartition d'activité : 5 877 castables / 821 passifs / 211 « instants » (imbues, scrolls).
- Attention : certaines séries EU (Fire Blow) ont **plusieurs lignes par niveau** (segments de combo A2…A7 avec MP=0, chaînées par `Basic_ChainCode`) — filtrer sur `mp_cost>0` ou `chain_next_id` selon l'usage.

---

## 5. Limites et reste indécodable

1. **Tags imbriqués** : certaines séries (Pain Quota, Warlock DoTs, summons, `lks2`/`setv`/`tnt2` avec args eux-mêmes des fourcc) ont des arguments structurés non décodés — conservés en brut dans `params_raw` et `leftover`. ~4 800/6 909 lignes joueurs ont au moins une valeur brute non affectée (souvent des ID d'effets visuels type `atstructeffect`).
2. **Semantique exacte att kinds 6/9** : 6 = probablement dégâts physiques à plat EU (756+129 lignes), 9 = variante EU (78 lignes) — à confirmer en jeu.
3. **Colonnes 15 (CoolTime), 6 (Basic_Original), 67-68** : présentes, non interprétées.
4. **skilldata_10000enc.txt** etc. : versions chiffrées (« enc ») non nécessaires (les versions clair étaient fournies).
5. **Pas les skills du client iSRO post-2010** : le format de ces clients passe à des colonnes `Param1..Param12 ×3` avec codes numériques (ex. `1895136465` cité dans la mission) ; non couvert ici. Le dump couvre vSRO 1.188 + cap 120 (les skills officiels iSRO cap ≤120 utilisent les mêmes codenames).
6. **characterdata/itemdata** : disponibles aux mêmes chemins dans le repo source (`SMC/SR_GameRefData/characterdata_*.txt` 8 shards ≈ 13 Mo, `itemdata_*.txt` 12 shards ≈ 25 Mo) — non extraits cette fois (hors périmètre temps), la même chaîne d'outils s'applique.

## 6. Reproductibilité

Parseur : dossier temporaire (nettoyé après usage) ; pipeline = télécharger les 8 shards + `skills.txt` → décoder UTF-16LE → découpage 118 colonnes → marche fourcc (table §2.3-2.4) → croisement noms → CSV. La source fait foi : `joaodematejr/server_files_sro@main` (`SMC/SR_GameRefData/`).
