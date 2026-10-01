# RECHERCHE.md — Synthèse de recherche & plan de route

> Session du 1er octobre 2026. Ce document synthétise la recherche menée sur les
> émulateurs Silkroad open-source, la documentation du protocole, les formats de
> fichiers du client, et l'état d'avancement concret du projet SRObro.

---

## 1. Ce qui a été accompli dans cette session

### Infrastructure
| Élément | État | Détail |
|---|---|---|
| Dépendances npm | ✅ | workspaces client/server/shared installés |
| PostgreSQL + Redis | ✅ | Docker (port hôte **5544** pour PG, un PG local occupait le 5432) |
| Schéma Prisma | ✅ | `db push` OK, seed complet (5 quêtes, 3 forteresses, NPC, spawns) |
| Bugs de seed corrigés | ✅ | enum `MasteryTree` (lowercase→uppercase), champs Quest manquants (`description`, `timeLimitSec`), BigInt non sérialisables |

### Pipeline d'assets (le grand gain de la session)
- **`tools/veykril-pk2`** (MIT, Veykril) cloné et compilé : extraction PK2 fonctionnelle.
- Extractions réalisées depuis `C:\Program Files (x86)\Silkroad` :
  - `Media.pk2` → `assets/pk2_media` (29 292 fichiers)
  - `Data.pk2` → `assets/pk2_data` (64 861 fichiers, dont 18 725 meshes `.bms`)
  - `Map.pk2` → `assets/pk2_map` (19 587 fichiers, organisés par région)
- **Convertisseur BMS→GLB** (`tools/rust-jmx-converter`, code du projet) recompilé et relancé sur les 18 725 meshes pour reconstruire `client/public/assets/glb_blender` (perdu lors du changement de machine — le `.gitignore` exclut `assets/`).

### Pipeline de données du jeu
- **`server/scripts/import-textdata.ts`** : nouveau parseur des tables textdata du client
  (TSV UTF-16LE) → JSON serveur dans `server/data/game/`.
  - Colonnes **vérifiées empiriquement** contre des valeurs connues du jeu
    (MOB_CH_MANGNYANG : niveau 1, HP 24, exp 54, attaque 7-10, défense 27 ✓).
  - Résultat : **21 529 items**, **7 825 monstres**, **612 NPC**, **36 008 skills**,
    **12 596 textes SN_** (noms affichables).
  - Réutilisable : `cd server && npx tsx scripts/import-textdata.ts [--inspect item|char|skill|text]`

---

## 2. Recherche : émulateurs serveur open-source (état octobre 2026)

### Projets actifs
| Projet | Langage | Licence | URLs |
|---|---|---|---|
| **OpenSRO** | Go + client navigateur WebGPU (TS) | AGPL-3.0 | github.com/opensro-dev/opensro |
| **Skrillax** | Rust (ECS, tokio, PostgreSQL) | AGPL-3.0 | github.com/kumpelblase2/skrillax (+ skrillax-network, silkscope) |
| **go-sro-framework** (archivé, base d'OpenSRO) | Go | DBAD | github.com/ferdoran/go-sro-framework |

- **OpenSRO** (publié sept. 2026, très actif) : vise v1.150 Legend III. Rôles Agent
  (comptes/login/shards) + GameWorld (état du monde par shard, WebTransport/WebSocket).
  Systèmes documentés : abnormalités (buffs), loot au sol complet, berserk, pièges,
  party, résurrection. Pipeline d'assets lisant une installation client officielle.
- **Skrillax** : le plus propre architecturalement (crates `skrillax-serde/packet/codec/stream`
  = sérialisation Silkroad + handshake sécurité complets). Navmesh chargé depuis les
  fichiers officiels. Tables de loot versionnées (`.ron`) validées contre Media.pk2 au boot.
- Projets C# historiques inactifs : Phoenix (v1.188), SilkroadProject (tanisman),
  DarkEmu (lignée csremu/srevolution).
- **vSRO 1.188** (binaires officiels fuités) : référence des serveurs privés, mais
  **non open-source et sous copyright Joymax** → à ne pas utiliser ici ; on s'en tient
  aux implémentations open-source et à la documentation publique.

### Documentation du protocole
- **SilkroadDoc** (wiki, 335 pages, archivé janv. 2025) :
  github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki — la référence exhaustive
  (opcodes gateway/agent, packets skills/alchemy/stalls/jobs/guild/forteresse,
  enums, codes d'erreur, formats de fichiers JMXV*).
- **srodevs-docs** (JellyBitz, actif sept. 2026) :
  github.com/JellyBitz/srodevs-docs — version maintenue (84 pages).
- **RSBot** (C#, AGPL, màj 2026) : github.com/myildirimofficial/RSBot — la plus grande
  base de code vivante implémentant le protocole (excellente référence comportementale).
- Guide sécurité historique de Drew "pushedx" Benton (handshake, count/countbyte,
  Blowfish) — référencé depuis les deux wikis ci-dessus.

> ⚠️ Licences : OpenSRO/Skrillax/RSBot sont **AGPL** → utilisables comme référence de
> comportement, mais pas de copie de code dans SRObro (MIT). Veykril/pk2 est **MIT**
> (déjà intégré). Les docs wiki sont du savoir communautaire factuel (formats, opcodes).

---

## 3. Recherche : formats de fichiers du client

### Conteneur PK2 (spéc complète, publique)
- En-tête 256 octets `"JoyMax File Manager!"` + champ Verify pour valider la clé.
- Blocs d'annuaire chiffrés **Blowfish LE** (blocs de 8 octets), données fichiers en clair.
- Clé iSRO publique : `169841` (défaut de pk2_mate). Dérivation documentée dans
  SRO.PK2API (C#) et pk2 (Rust) : XOR avec la base key du client.
- Noms de fichiers en EUC-KR.

### Formats JMXV (spéc détaillées sur le wiki SilkroadDoc)
| Format | Contenu | Spéc | Outils |
|---|---|---|---|
| `.bsr` (JMXVRES) | ressource : réf. meshes/matériaux/anims/collision/slots | ~90 % | blender-sro-plugin (Veykril), JMX-File-Editor (JellyBitz, MIT) |
| `.bms` (JMXVBMS) | mesh (sommets, UV, skinning, cloth) | bonne | idem + notre `rust-jmx-converter` |
| `.bmt` (JMXVBMT) | matériaux → textures `.ddj` | bonne | idem |
| `.bsk` (JMXVBSK) | squelettes | bonne | idem |
| `.ban` (JMXVBAN) | animations squelettales | bonne | `ban-re` (Rust, code du projet) |
| `.ddj` (JMXVDDJ) | texture = wrapper autour d'un DDS standard | complète | JMXVDDJConverter (MIT) |
| `.nvm` (JMXVNVM) | navmesh/collision terrain par région | très bonne | NVMEditor, NVMTerrainExtractor, OpenSilkroadMap (MIT) |
| `.ifo` | placements d'objets par zone (textuel !) | bonne | go-sro-fileutils |
| `.efp/.eff` | effets particules | faible | — |

Corrections : il n'existe pas de `.bsa`/`.bsm`/`.wvm` en SRO (animations = `.ban`,
mesh = `.bms`, navmesh = `.nvm`).

### Tables textdata (ce qu'on importe)
`characterdata.txt` ≈ `_RefObjCommon`+`_RefObjChar`, `itemdata.txt` ≈ `_RefObjCommon`+`_RefObjItem`,
`skilldata.txt` ≈ `_RefSkill`. Les noms affichables sont dans `textdata_object_*.txt`
(clé `SN_` en 3ᵉ colonne). Encodage UTF-16LE. La référence des colonnes = les
convertisseurs DB↔Media (JellyBitz SR_Db2Media, MIT).

---

## 4. État du client/serveur (diagnostic de la session)

- **Serveur** : 122 erreurs TS en cours de correction (agent) — surtout du drift de
  types (Prisma non généré sur cette machine, méthodes manquantes). DB opérationnelle.
- **Client** : Vite OK, mais `Game.initialize()` échoue car `client/public/assets/`
  a été perdu (uniquement `assets.old_no_skinning` avec placeholders). → reconversion
  GLB en cours via `rust-jmx-converter`.
- **Rendu navigateur** : canvas 1280×720 créé, écran de chargement atteint —
  la boucle d'init s'exécute jusqu'au chargement d'assets.

---

## 5. Plan de route proposé (ordre de valeur)

### Phase 1 — Remettre le jeu jouable (en cours)
1. ✅ Extraction PK2 complète + importation des données.
2. ⏳ Reconversion GLB des 18 725 meshes → `client/public/assets/glb_blender`.
3. Terminer les corrections TS serveur, démarrer `dev:server` + `dev:client`,
   valider la connexion Socket.io saine (le client est en mode single-player
   "MVP" — `main.ts` ligne 83 : dé-commenter `network.connect()` pour le mode MMO).
4. `GameDataService` serveur : charger `server/data/game/*.json` au boot et
   s'en servir comme source de vérité (stats monstres/items/skills réels).

### Phase 2 — Contenu fidèle au vrai jeu
5. Spawns réels : parser les fichiers `.ifo`/`objectstring.ifo` de Map.pk2
   (placements d'objets/NPC par région) pour peupler le monde à l'identique.
6. Navmesh : parser les `.nvm` de Data.pk2 (spec très bonne) pour la collision
   et le pathing serveur (Skrillax et OpenSilkroadMap en sont des exemples).
7. Textures : convertir les `.ddj` → PNG/DDS web (JMXVDDJConverter ou patch
   image/dds du convertisseur Rust).
8. Skills : compléter le mapping des 118 colonnes de skilldata (cooldown, MP,
   paramètres d'effet) en s'aidant de la doc `_RefSkill` de SilkroadDoc.

### Phase 3 — Systèmes de jeu manquants
9. Alchemy (enhance/magic/lucky) — doc packets complète dans SilkroadDoc.
10. Jobs triangle (trader/thief/hunter), exchange, stalls, consignment.
11. Guerre de forteresse (Siege), academy, arena.
12. Partage du protocole : si un jour le but est le multi-joueurs compatible
    avec un vrai client, s'appuyer sur SilkroadDoc opcodes ; sinon Socket.io
    reste le transport du clone navigateur (choix actuel, plus simple).

### Outils à connaître
- `pk2_mate` (extraction) : `tools/veykril-pk2/target/release/pk2_mate.exe extract --archive <pk2> --out <dir>`
- Import données : `cd server && npx tsx scripts/import-textdata.ts`
- Convert meshes : `tools/rust-jmx-converter/target/release/jmx_converter.exe --input assets/pk2_data --output client/public/assets/glb_blender`
