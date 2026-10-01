# 🐉 Extraction des monstres de la DB vSRO (SHARD 1.188 rétrofitée D12)

> **Rapport d'extraction de données** — 2026-10-01 · SRObro Knowledge Base
> **Périmètre** : extraction et structuration des tables monstres (`_RefObjCommon` + `_RefObjChar`) d'une vraie base `SRO_VT_SHARD` de files vSRO fuitées, incluant le contenu Jupiter (cap 120) du rétrofit. **7 157 monstres** extraits avec stats complètes (niveau, HP, MP, EXP, dégâts, rareté, vitesse), dont les boss Jupiter 111-120 qui fermaient notre dernière grande lacune.
> **Livraison** : `ML_RESEARCH/data/monsters_vsro188.csv` (+ `uniques_vsro188.csv`, `monsters_cap120.csv`, `zones_vsro188.csv`).
> ⚖️ **Note légale** : les files vSRO sont la propriété de Joymax/Wemade. Ce rapport documente la méthode et recense les sources (URLs) ; les CSV produits sont des données de référence pour la reconstruction navigateur SRObro, sans hébergement des files elles-mêmes.

---

## 📋 Table des matières
- [1. Méthodologie — source exacte et rejets documentés](#-1-méthodologie--source-exacte-et-rejets-documentés)
- [2. Technique : lecture binaire du backup MSSQL](#-2-technique--lecture-binaire-du-backup-mssql)
- [3. Statistiques globales](#-3-statistiques-globales)
- [4. Uniques classiques — validation croisée avec notre KB](#-4-uniques-classiques--validation-croisée-avec-notre-kb)
- [5. Boss Jupiter 111-120 — LA lacune comblée](#-5-boss-jupiter-111-120--la-lacune-comblée)
- [6. Temple du Job (Alexandrie) 101-110](#-6-temple-du-job-alexandrie-101-110)
- [7. Tombe de Qin-Shi / FGW](#-7-tombe-de-qin-shi--fgw)
- [8. Monstres par zone (préfixes)](#-8-monstres-par-zone-préfixes)
- [9. Découvertes notables vs notre base existante](#-9-découvertes-notables-vs-notre-base-existante)
- [10. Limites et incertitudes](#-10-limites-et-incertitudes)
- [11. Recommandations](#-11-recommandations)

---

## 🔬 1. Méthodologie — source exacte et rejets documentés

### ✅ Source retenue

| Élément | Valeur |
|---|---|
| **Repo GitHub** | [`joaodematejr/private_server`](https://github.com/joaodematejr/private_server) (31 Mo, branche `main`) |
| **Fichier exploité** | `Tools/DB/SRO_VT_SHARD.bak` — **74 291 712 octets** |
| **URL directe** | https://raw.githubusercontent.com/joaodematejr/private_server/main/Tools/DB/SRO_VT_SHARD.bak |
| **Fichiers frères (non exploités)** | `SRO_VT_ACCOUNT.bak` (14 Mo), `SRO_VT_LOG.bak` (4 Mo), `SRO_CERTIFICATION.bak` (0,5 Mo) |
| **Nature** | Backup **MSSQL non compressé** (format MTF « TAPE », en-tête « Microsoft SQL Server ») de la shard **vSRO 1.188 rétrofitée D12/cap 120** : les items D12 (`ITEM_EU_SWORD_12_*`, `ITEM_CH_SWORD_12_*`) et le contenu Jupiter (`MOB_JUPITER_*`, 103 rows) y sont présents, les rows Jupiter étant `Service=0` (désactivées) comme dans tout rétrofit « Jupiter Fixed » standard |
| **Validation de l'authenticité** | Les 8 uniques classiques ont des HP **strictement identiques** aux valeurs officielles recoupées par notre KB (multi-sources TR/FR/DE/ZH/KO, cf. §4) → la partie « vanilla cap 110 » est conforme aux données Joymax ; les valeurs Jupiter sont celles du retrofit KSRO→1.188 standard utilisé par toute la scène |

Le même utilisateur héberge aussi [`joaodematejr/server_files_sro`](https://github.com/joaodematejr/server_files_sro) (1,1 Go — binaires serveur complets, **sans** DB SQL : inventaire complet du tree vérifié, 55 336 entrées, aucun `.sql`/`.bak`).

### ❌ Pistes explorées et rejetées (documentées)

| Repo / piste | Taille | Verdict |
|---|---|---|
| `ducksoup-sro/ducksoup` (S17 de RESEARCH_PS_FILES.md) | 1,4 Mo | **Schémas C# seulement** (aucun INSERT) — utilisé pour connaître l'ordre des colonnes (`Database/VSRO188/SRO_VT_SHARD/_RefObjChar.cs`, `_RefObjCommon.cs`) |
| `joaodematejr/server_files_sro` | 1,1 Go | Binaires serveur + client, **aucune DB SQL** dans le tree |
| `SRO-Server-Browser/SRO-SB_Client_Data` | 2,7 Go | Client complet en `.pk2` découpés (Media.pk2 ×17) — non exploitable sans extraction PK2, version serveur inconnue |
| `IE103-Nhom5/Silkroad_database` | 7,3 Mo | Projet e-commerce (Supabase) sans rapport avec le jeu |
| `kalifans/VSRO` | 66 Mo | Bots (SBot, mBot, ButterflyBot) |
| `sonzenbi2/vsro`, `trungpravite/vsro` | 16-30 Mo | Clients/binaires, pas de DB |
| `DestanSRO/ServerEdit-Vsro`, `vsro200`, `MazenNull/VsroArab`, `Raltyro/vsrodamrix`, `iuliaudrea/vsro-200` | — | Hors sujet (tools, ML, sites, robots) |
| Recherche de code GitHub (`INSERT INTO _RefObjChar`, `MOB_CH_TIGERWOMAN`, `characterdata.txt`, `_RefObjChar`) | — | **Aucun dump SQL public avec INSERT de la shard** n'existe sur GitHub (confirmé : la DB circule uniquement en `.bak` MSSQL sur forums/Mega, jamais en `.sql` versionné) |

**Conclusion méthodologique** : les dumps « INSERT INTO » espérés n'existent pas publiquement sur GitHub ; la voie réaliste était le **parse binaire direct d'un `.bak` non compressé** — c'est ce qui a été fait.

---

## 🛠 2. Technique : lecture binaire du backup MSSQL

Le `.bak` non compressé contient les **pages de 8 Ko du fichier MDF quasi à l'état brut** (entrelacées de blocs MTF). Les enregistrements SQL Server (format « row » 2005) sont auto-descriptifs : `TagA(1) TagB(1) FLEN(2) données-fixes … colcount(2) bitmap-null … section-variable`. Le format a été **décodé empiriquement** puis validé sur des valeurs connues.

### _RefObjCommon (58 colonnes, FLEN=112)

```
+0   TagA/TagB/FLEN        +4   Service (int)      +8   ID (int)
+12  CashItem, Bionic, TypeID1-4 (octets)
+18  DecayTime (int)       +22  Country (octet)    +23  Rarity (octet)
+92  Speed1 (int16, marche)  +94 Speed2 (int16, course)
+108 Link → _RefObjChar.ID (int)
+112 colcount (=58) +114 bitmap-null +122 varcount (=10) +124 offsets +144 données variables
     (col. 1 = CodeName128 en ASCII, ex. MOB_CH_TIGERWOMAN)
```

Ancre de scan : préfixe `30 00 70 00` + validations croisées (Service≤1, ID 1-60000, TypeID plausibles, DecayTime, colcount=58, offsets croissants, codename `[A-Z0-9_]`). **34 722 rows** extraites (34 358 IDs uniques, 1→41 797).

### _RefObjChar (81 colonnes, FLEN=290, lignes de 303 octets)

```
+4 ID (int, = Link de _RefObjCommon)   +8 Lvl (octet)   +9 Gender
+10 MaxHP (int)   +14 MaxMP (int)      +18.. résistances (33 × int)
+150 InventorySize, CanStore×4, CanBeVehicle, CanControl, DamagePortion, MaxPassenger
+160 PD = dégâts physiques min   +164 MD = dégâts physiques max   ← validés : TG « 42-51 »
+168 PAR   +172 MAR   +176 ER (parade) ← validé : TG « parry 65 »
+180 BR    +184 HR    +188 CHR
+192 ExpToGive (int)                    ← validé : courbe + valeurs uniques
+196 CreepType   +200 Knockdown (octet) +201 KO_RecoverTime   +205 DefaultSkill_1-10
+249 TextureType  +250 Except_1-10      +290 colcount (=81) +292 bitmap-null (11 o)
```

Ancre : `FLEN=290` (`22 01`) + validations (Lvl 1-140, colcount 80-82, MaxHP plausible ≤ 2,4 Md après 1er passage). **14 193 rows brutes → 13 931 IDs uniques**. Join `_RefObjCommon.Link = _RefObjChar.ID` → **7 157 monstres avec stats complètes** (sur 7 169 rows monstres, 99,8 %).

### Triple validation du décodage
1. **Notre KB** (`15_UNIQUE_BOSSES.md`) : Tiger Girl 598 720 HP, Cerberus 693 072, Uruchi 1 779 528, Isyutaru 4 324 612, Yarkan 9 353 045, Shaitan 12 732 060, Medusa 183 535 199, Roc 1 451 891 045 — **8/8 identiques** (cf. §4).
2. **silkroadonline.wiki** (client v1_657) : Tiger Girl ID 1954, lvl 20, HP 598 720, Attack 42-51 (=`PD/MD`), Parry 65 (=`ER`), vitesse 20/90 (=`Speed1/2`) — **identiques**.
3. **Cohérence interne** : MD/PAR = niveau exact pour les mobs normaux, courbe d'EXP monotone, DefaultSkill = IDs de skills plausibles (50 176…, 780 544…, 160/161 pour les mobs de base).

Scripts de parsing : Python 3 (`struct` + scans d'octets), exécutés en zone temporaire, **aucune dépendance** (pas de MSSQL requis).

---

## 📊 3. Statistiques globales

| Mesure | Valeur |
|---|---|
| Rows `_RefObjCommon` parsées | **34 722** (34 358 IDs uniques) |
| — monstres (TypeID 1,2,1) | 7 169 dont **7 157 avec stats** |
| — NPCs (TypeID 1,2,2) | 376 |
| — items (TypeID 3,*) | 20 757 |
| Rows `_RefObjChar` uniques | 13 931 |
| Monstres actifs (`Service=1`) | 6 956 (niveaux 1 → 140) |
| Répartition par rareté (actifs) | normal 6 015 · unique+notice (3) 595 · élite/quete (6) 99 · **event strong (7) 90** · unique silencieux (8) 81 · champion (1) 75 |
| Rows Jupiter (`MOB_JUPITER_*`) | 103 (toutes avec stats, `Service=0` = désactivées dans ce rétrofit) |
| Mobs niveaux 111-120 | ~530 rows (47-60 par niveau) |

---

## 🐯 4. Uniques classiques — validation croisée avec notre KB

| Unique | Codename exact (DB) | ID | Lvl | HP (extraction) | HP (KB `15_UNIQUE_BOSSES.md`) | Verdict |
|---|---|---|---|---|---|---|
| Tiger Girl | `MOB_CH_TIGERWOMAN` | 1954 | 20 | **598 720** | 598 720 | ✅ identique |
| Cerberus | `MOB_EU_KERBEROS` | 5871 | 24 | **693 072** | 693 072 | ✅ |
| Captain Ivy | `MOB_QT_01_IVY` (variante AM : `MOB_AM_IVY_L2`) | — | 30 | **1 094 835** (L2 : 10 948 346) | 1 094 835 | ✅ |
| Uruchi | `MOB_OA_URUCHI` | 1982 | 40 | **1 779 528** | 1 779 528 | ✅ |
| Isyutaru | `MOB_KK_ISYUTARU` | 2002 | 60 | **4 324 612** | 4 324 612 | ✅ |
| Lord Yarkan | **`MOB_TK_BONELORD`** | 3810 | 80 | **9 353 045** | 9 353 045 | ✅ + codename révélé |
| Demon Shaitan | `MOB_RM_TAHOMET` | 3875 | 90 | **12 732 060** | 12 732 060 | ✅ |
| Medusa / BeakYung | **`MOB_TQ_WHITESNAKE`** | 14997 | 100 | **183 535 199** | 183 535 199 | ✅ + codename révélé |
| Roc | `MOB_RM_ROC` | 3877 | 100 | **1 451 891 045** | 1 451 891 045 (« à recouper ») | ✅ **confirmé** |

**EXP officielles 1x (colonne `ExpToGive`, jusqu'ici absentes de toute source publique)** : Tiger Girl **451 200** · Cerberus 569 630 · Uruchi 1 316 197 · Isyutaru 2 748 260 · Yarkan 4 963 664 · Shaitan 6 670 749 · Medusa 62 356 860 · Roc 1 157 701 880. Mobs normaux : 24 (lvl 1) → ~470 (lvl 20) → ~2 029 (lvl 50) → ~9 338 (lvl 100) → ~12 550 (lvl 110).

**Timers de respawn** : non extraits de façon fiable (cf. §10) — on conserve les valeurs documentées dans `RESEARCH_PS_FILES.md` (§3) : 6 h (TG, Cerberus, Ivy, Isyutaru, Yarkan, Shaitan), 3 h (Uruchi), 4 h (Medusa, Jupiter-side), via `Tab_RefNest.dwDelayTimeMin/Max`.

---

## 🌩 5. Boss Jupiter 111-120 — LA lacune comblée

> C'est la **première source chiffrée** de notre KB pour les boss 111+. Les valeurs viennent des rows `MOB_JUPITER_*` du rétrofit D12 (« Jupiter Fixed ») ; elles sont désactivées (`Service=0`) dans cette DB mais correspondent aux données officielles importées de KSRO. Codenames réels : préfixe **`MOB_JUPITER_`** (et non `MOB_RM_` comme supposé dans la mission — `MOB_RM_` = Rock Mountain, zone 81-100 d'Alexandrie nord).

| Boss | Codename | Lvl | HP | Atk | EXP |
|---|---|---|---|---|---|
| **Jupiter** (boss final) | `MOB_JUPITER_JUPITER` | 120 | **40 116 151** | 2882-4875 | 13 155 722 |
| **Baal** | `MOB_JUPITER_BAAL` | 120 | **55 404 408** | 2882-4875 | 20 239 573 |
| Baal (arme) | `MOB_JUPITER_BAAL_WEAPON` | 120 | 83 106 612 | 2882-4875 | 28 335 402 |
| Babylion | `MOB_JUPITER_BABILION` | 120 | 40 116 151 | 2882-4875 | 13 493 048 |
| Dark Dog II | `MOB_JUPITER_DARK_DOG2` | 120 | 31 395 831 | 2882-4875 | 12 143 744 |
| Dark Dog | `MOB_JUPITER_DARK_DOG` | 118 | 26 234 941 | 2725-4611 | 9 920 425 |
| **Yuno** | `MOB_JUPITER_YUNO` | 115 | **24 168 318** | 2505-4240 | 9 078 594 |
| The Earth II | `MOB_JUPITER_THE_EARTH2` | 115 | 18 028 193 | 2650-4007 | 5 936 004 |
| The Earth I | `MOB_JUPITER_THE_EARTH1` | 115 | 15 907 229 | 2650-4007 | 5 237 650 |

Mobs « élite » du Temple (rareté 6, HP de mob normal) : Griffin 113 (47 657 HP), Minotaure 113, Anatu Lion 114 (64 478), etc. — ensemble complet dans `monsters_cap120.csv` (1 442 rows : tout le contenu ≥ 111 + `MOB_JUPITER_*`). On y trouve aussi les **boss de Fortress War 111-140** (`MOB_FW_TAESE_111`→`_140`, 43 M → 166 M HP ; `MOB_FW_BATTLEGOLEM/MUJIGI/HYEONGCHEON` déclinés par niveau) — dénotant un contenu FW étendu/moddé dans cette DB.

---

## 🔥 6. Temple du Job (Alexandrie) 101-110

Boss égyptiens (désert d'Alexandrie, « Job Temple ») — extraits complets dans `uniques_vsro188.csv` :

| Boss | Codename | Lvl | HP | EXP |
|---|---|---|---|---|
| **Seth** (boss final) | `MOB_SD_SETH` | 110 | **236 392 140** | 77 719 959 |
| **Haroeris** | `MOB_SD_HAROERIS` | 109 | **244 859 450** | 76 310 958 |
| Anubis | `MOB_SD_ANUBIS` | 107 | 94 054 249 | 40 680 779 |
| Neith | `MOB_SD_NEITH` | 106 | 59 340 839 | 25 563 690 |
| Selkis | `MOB_SD_SELKIS` | 105 | 57 722 800 | 24 819 116 |
| Eris | `MOB_SD_ERIS` | 109 | 87 783 966 | 27 120 519 |
| Osiris III / Horus III | `MOB_SD_OSIRIS_3` / `MOB_SD_HORUS_3` | 110 | 48 336 636 / 35 270 343 | 16 760 481 / 12 204 234 |
| Apis | `MOB_SD_APIS` | 103 | 21 068 995 | 9 796 221 |
| (tous les dieux 101-110) | `MOB_SD_{SPHINX,SEKHMET,NEPHTHYS,HORUS,OSIRIS}{,_2,_3}` | 101-110 | 8,2 M → 48,3 M | cf. CSV |

---

## ⚰️ 7. Tombe de Qin-Shi / FGW

**Tombe (MOB_TQ_*, Forgotten World « Qin-Shi Tomb »)** :

| Boss | Codename | Lvl | HP | EXP |
|---|---|---|---|---|
| **Medusa / BeakYung** (Serpent blanc) | `MOB_TQ_WHITESNAKE` | 100 | **183 535 199** | 62 356 860 |
| Serpent noir | `MOB_TQ_BLACKSNAKE` (L2 : 276 550 675) | 100 | 27 655 068 | 13 447 394 |
| Gardiens N/S/E/O | `MOB_TQ_{NORTH,SOUTH,EAST,WEST}GUARDIAN` | 98-99 | 16,8 M → 22,1 M | 8,45 M |
| Général serpent | `MOB_TQ_SNAKEGENERAL` | 95 | 7 242 389 | 3 866 613 |
| Général tombe | `MOB_TQ_TOMBGENERAL` | 85 | 6 196 043 | 2 877 123 |

**FGW pillars (MOB_GOD_*)** : capitaines/généraux/ainés par tranche (A1 39 → …) — ex. `MOB_GOD_TOGUI_TOGUIELDER_A1` lvl 39 (1,27 M HP) ; piliers d'envie/flamme/épave par paliers (35-110). Complet dans `uniques_vsro188.csv`.

---

## 🗺 8. Monstres par zone (préfixes)

Agrégats sur les mobs normaux actifs (détail : `zones_vsro188.csv` ; la ventilation complète par codename est dans `monsters_vsro188.csv`, colonne `zone`) :

| Zone (préfixe) | Mobs normaux actifs | Lvl | HP max (lvl max) |
|---|---|---|---|
| Chine `MOB_CH_` | 27 | 2-90 (moy. 14) | 676 983 (TG hors norme incluse) |
| Chine de l'Ouest `MOB_WC_` | 18 | 21-30 | 57 255 |
| Oasis `MOB_OA_` (Uruchi) | 18 | 31-42 | 3 038 |
| Karakoram `MOB_KK_` (Isyutaru) | 15 | 51-60 | 229 030 |
| Taklamakan `MOB_TK_` (Yarkan) | 19 | 61-80 | 438 424 |
| Rock Mountain `MOB_RM_` (Shaitan/Roc) | 26 | 70-100 | 6 054 980 |
| Europe `MOB_EU_` | 2 675 * | 1-140 | 98 369 |
| Désert d'Alexandrie / Temple du Job `MOB_SD_` | 67 | 96-110 | 175 454 |
| Tombe Qin-Shi `MOB_TQ_`/`MOB_QT_` | 97 | 11-100 | 183 535 199 |
| Forgotten World `MOB_GOD_` | 84 | 35-107 | 102 398 |
| Temple de Jupiter `MOB_JUPITER_` | 103 | 112-120 | (rows désactivées — voir §5) |
| Événements `MOB_EV_`/`MOB_EVE_`/`MOB_THIEF_`/`MOB_FW_` | ~1 600 | 1-140 | boss FW 166 M |

\* Les comptes Europe/événements sont gonflés par des **rows clones numérotées** (caravanes THIEF/HUNTER `*_00010001`, clones d'instance `_CLON`) : filtrer sur `rarity=0` + codename sans suffixe pour la zoologie « réelle ». HP médians des mobs normaux : lvl 20 ≈ 1 031 · lvl 50 ≈ 3 969 · lvl 81 ≈ 13 068 · lvl 100 ≈ 28 807 · lvl 110 ≈ 43 864.

---

## 💎 9. Découvertes notables vs notre base existante

1. **Tiger Girl 598 720 HP confirmé côté SERVEUR** — la mission demandait de vérifier `15_UNIQUE_BOSSES.md` : la valeur est **exacte** (source = donnée serveur, pas seulement client). Idem pour les 7 autres classiques, y compris **Roc 1 451 891 045 HP** que la KB marquait « à recouper » → **confirmé**, ce n'est pas une valeur de raid/événement mais bien la row serveur.
2. **Codenames réels révélés** : Lord Yarkan = `MOB_TK_BONELORD` (aucune row `MOB_TK_YARKAN` n'existe) ; Medusa/BeakYung = `MOB_TQ_WHITESNAKE` ; Captain Ivy = `MOB_QT_01_IVY` (base) / `MOB_AM_IVY_L2/L3` (variantes ×10 et ×3 HP — utiles pour des events).
3. **EXP par monstre = données serveur exclusives** : aucune source publique (wiki, guides) ne les publiait — « exp per kill — server-side » (silkroadonline.wiki). Courbe complète extraite (colonne `exp_to_give`).
4. **Boss Jupiter 111-120 chiffrés** (§5) : Jupiter 40,1 M · Baal 55,4 M · Yuno 24,2 M HP — comble la lacune « HP boss 111+ » de `15_UNIQUE_BOSSES.md`.
5. **Boss du Temple du Job chiffrés** (§6) : Seth 236 M · Haroeris 245 M HP — plus fort du cap 110 vanilla avec Roc.
6. **Raretés étendues** : la DB révèle `Rarity=7` (90 rows `MOB_EVE_STRONG_*` = champions d'événement itinérants) et `Rarity=6` (élites de quête/instance, HP de mob normal) en plus des 0/1/2/3/8 déjà documentés.
7. **HP des gardes d'élite Jupiter** (Griffin 47 657 au lvl 113) ≈ HP d'un mob normal — les « versions boss » sont les rows rareté 3/8.
8. **La DB confirme l'architecture** : `_RefObjCommon.Link → _RefObjChar.ID`, rareté et vitesses dans Common, stats dans Char — exploitable tel quel pour le modèle de données SRObro.

---

## ⚠️ 10. Limites et incertitudes

1. **DB de serveur privé** : c'est une 1.188 **rétrofitée** (D12/Jupiter). Tout ce qui est ≤ 110 est validé conforme aux valeurs officielles (8/8 uniques identiques), mais les valeurs Jupiter/FW 111-140 proviennent du rétrofit communautaire standard « Jupiter Fixed » (données officielles KSRO importées) — confiance élevée mais pas « fuite 1.274 originale ». Les rows Jupiter sont `Service=0`.
2. **Timers `Tab_RefNest` non extraits** : la table n'a pas d'ASCII et le scan heuristique binaire n'a pas permis de join fiable nest↔tactics↔mob (tentative documentée : rows de nid au format plausible trouvées avec `dwDelayTime=10800 s`, mais attribution impossible). **On conserve les timers forum** (S22/S46 de `RESEARCH_PS_FILES.md`) ; noter que cette DB privée semble avoir standardisé certains délais à 3 h — signe de timers **édités**, non vanilla.
3. **Colonne `ExpToGive` (offset +192)** : calibrage par triple recoupement (courbe monotone sur 119 niveaux, ordres de grandeur uniques, cohérence avec le grind 1x) mais **sans source externe directe** (aucune publication de ces valeurs n'existe). Confiance élevée (~90 %), à recouper un jour contre une DB 1.274/iSRO-R.
4. **Colonnes PAR/MAR/HR/CHR (+168/+172/+184/+188)** : positions sûres (décalage 4 octets vérifié), mais la **sémantique exacte** des quatre dernières est partielle (HR constant = 2 sur tous les mobs — possiblement un ratio, pas un « hit rating »). Exportées brutes dans le CSV.
5. **Rows parasites** : clones d'instances (`_CLON`), caravanes numérotées, rows de test (`MOB_AUTOMOB` 9 999 999 HP lvl 1), `_DROP` (HP=1, pour loots) et `_L2/_L3` (variantes amplifiées d'events) polluent les moyennes — filtres recommandés documentés en §8.
6. **Noms affichables absents** : la DB ne contient que les codenames + `NameStrID128` ; les noms FR/EN restent côté client (textdata). Le CSV exporte donc les codenames (mappables via notre KB existante).
7. **~260 rows char dupliquées** dans le .bak (le fichier semble contenir deux copies partielles de la shard) : dédoublonnées par ID, premiers états conservés ; aucun conflit de valeur détecté sur les uniques testées.
8. Tables non extraites (hors périmètre/temps) : `_RefDropClassSel_*`, `_RefMonster_AssignedItemDrop` (drops), `_RefLevel` (XP/niveau — scan séquentiel infructueux), `_RefObjItem` (items — pour un futur rapport alchimie).

---

## 🎯 11. Recommandations

1. **Intégrer `monsters_vsro188.csv`** comme référence « stats serveur » du navigateur SRObro : c'est la source la plus complète jamais obtenue (7 157 monstres, HP/EXP/atk).
2. **Mettre à jour `15_UNIQUE_BOSSES.md`** : section Jupiter 111-120 (valeurs §5), Temple du Job (§6), codenames Yarkan/Medusa/Ivy (§9), confirmation Roc.
3. Récupérer un jour un `.bak` **vSRO 1.274 ou iSRO-R original** pour recouper les valeurs Jupiter « officielles » ainsi que Kidemonas/Bagdad (121+) absents de ce dump (le rétrofit s'arrête à 120).
4. Exploiter le même `.bak` pour un futur rapport **alchimie** (`_RefMagicOptByItemOptLevel` — les rows sont dans ce fichier, même technique de parse binaire applicable via le schéma ducksoup) et **drops**.
5. Garder les timers forum (6 h/3 h/4 h) — ne pas utiliser ceux de cette DB (édités par le privé).

---

## 📦 Fichiers livrés (ML_RESEARCH/data/)

| Fichier | Contenu | Rows |
|---|---|---|
| `monsters_vsro188.csv` | **Tous les monstres** : id, codename, zone, level, max_hp, max_mp, exp_to_give, atk_min/max, par, mar, er_parry, hr, chr, rarity(+desc), service, country, speed_walk/run, link | **7 157** |
| `uniques_vsro188.csv` | Rows rareté 3/6/8 (uniques, élites, boss FW) | 830 |
| `monsters_cap120.csv` | Tout le contenu ≥ 111 + `MOB_JUPITER_*` (boss Jupiter, FW 111-140) | 1 442 |
| `zones_vsro188.csv` | Agrégats par zone (niveaux, HP max, atk max, exp max) | 17 |

Colonnes du CSV principal : `id, codename, zone, level, max_hp, max_mp, exp_to_give, atk_min, atk_max, par, mar, er_parry, hr, chr, rarity, rarity_desc, service, country, speed_walk, speed_run, link` (atk_min/atk_max = `PD`/`MD` ; er_parry = `ER`).

---

*Sources : [joaodematejr/private_server](https://github.com/joaodematejr/private_server) (`Tools/DB/SRO_VT_SHARD.bak`) · schémas : [ducksoup-sro/ducksoup](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188) · validation : silkroadonline.wiki + KB SRObro (`15_UNIQUE_BOSSES.md`, `RESEARCH_PS_FILES.md`) · Rapport : `ML_RESEARCH/RESEARCH_VSRO_DB_MONSTERS.md` · 2026-10-01*
