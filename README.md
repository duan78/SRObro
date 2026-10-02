# SRObro — Silkroad Online dans le navigateur

![Status](https://img.shields.io/badge/Status-Jouable%20et%20audit%C3%A9-brightgreen)
![Engine](https://img.shields.io/badge/Engine-Babylon.js%208.0-blueviolet)
![Server](https://img.shields.io/badge/Server-Authoritative%20Socket.io-green)
![License](https://img.shields.io/badge/License-MIT-blue)

**SRObro** est un clone navigateur de Silkroad Online construit sur les
**assets officiels du client** (PK2 extraits : modèles, animations BAN, VFX
EFP, icônes DDJ, musiques, textdata) — pas une imitation, les données du jeu réel.

Jeu complet et audité : 8/8 critères de l'[audit final](docs/audit/AUDIT_FINAL_V4.md)
(audit visuel rejouable navigateur + suites scriptées), toutes les suites de
régression au vert, **103 FPS mesurés avec 3 clients simultanés** et churn
mémoire 0,0 % après téléportations.

---

## 🚀 Démarrage rapide

```bash
# 1. Infra (PostgreSQL + Redis)
npm run docker:up          # PG hôte 5544, Redis 6379

# 2. Base de données
npm run db:migrate && npm run db:seed

# 3. Client + serveur
npm run dev
```

- **Client** : http://localhost:3000 (Vite + BabylonJS 8)
- **Serveur** : http://localhost:3001 (Node/TS autoritaire, Socket.io)
- **Compte test** : `arnaud` / `hunter2` (admin)

> Les assets extraits du client officiel (`client/public/assets/`) ne sont pas
> versionnés — voir [README_ASSETS.md](README_ASSETS.md) et
> [docs/PK2_CLI_SOLUTION.md](docs/PK2_CLI_SOLUTION.md) pour le pipeline
> d'extraction (Rust + Blender) depuis `C:\Program Files (x86)\Silkroad`.

## 🎮 Contrôles

| Touche | Action |
|---|---|
| Clic gauche (sol) | Déplacement |
| Clic (monstre/PNJ) | Cibler / attaquer / dialoguer |
| F1-F8, 1-9 (+Ctrl/Alt) | Skills (hotbar 27 slots, layout officiel) |
| Clic (hotbar) | Lancer le skill/objet du slot (cooldown radial) |
| Tab | Cible ennemie suivante |
| **I** ou **A** / **C** | Inventaire / Personnage |
| **L** / **S** | Quêtes (log) / Skills |
| **P** / **J** / **M** | Party / Jobs / Carte du monde |
| **H** / Échap | Aide / Fermer la fenêtre active |

Les fenêtres se déplacent par leur titre, s'excluent par zone d'écran
(comportement officiel) et ne peuvent jamais se chevaucher.

## 🌍 Ce que couvre le jeu

**Monde** — 3 continents, 7 zones jouables (Jangan, Donwhang, Hotan,
Constantinople, Asia Minor, Samarkand, Alexandria) sur le terrain officiel
streamé (819 régions), téléporteurs, ferry avec pirates, 5 uniques.
Cap 120, chin./euro., skills et taux d'alchimie **issus des textdata vSRO**.

**Combat** — combos par skill (animations BAN officielles), VFX .efp
(imbues feu/glace/foudre distincts), zerk, mort/respawn, mobs aggro sur IA
serveur à 20 Hz, guild war scorée sans PK, Fortress War Eastern Europe avec
**taxe réelle appliquée aux achats** de la ville occupée.

**Interface & rendu** — personnage équipé aligné sur tous les angles (un
seul flip de base par pièce, jamais cumulé), arme tenue dans la paume ;
HUD DOM unique avec gestionnaire de fenêtres (zones d'écran, exclusivité,
drag, Échap), hotbar cliquable à cooldown radial ; **icônes officielles
partout** : 6 895/6 899 skills et 21 217/21 529 items (98,6 %) servis depuis
les DDJ extraites (repli fidèle `icon_default` pour les 196 référencées
nulle part, même dans le client officiel) ; noms dorés des 87 PNJ au-dessus
des têtes, « Nom Lv.X » des monstres, marqueurs de quête officiels
« ! » orange / « ? » bleu, brume de distance par continent.

**Skills** — les 8 catégories officielles servies et vérifiées par suite
scriptée (14/14) : dégât mono, multi-coups, AoE nuke ≤ 8 m, stun (IA de la
cible gelée), imbue, heal à scaling maîtrise, buff avec durée + icône +
formule officielle def/parade/toucher, cooldown ; barre d'incantation,
barre de buffs, maîtrises 2L², zerk ×2.

**Progression** — 51 quêtes officielles (récompenses exactes, chaînes,
repeat), titres Blue Zerk (Knight→Count), Energy of Life, alchimie +0→+12
avec destruction ≥ +5, drops 11D, Job Temple gated aux AP d'union
(règle officielle KB 15, paliers Anubis→Seth).

**Social/économie** — canaux party/guild/union + /w, party Auto Share
(bonus officiel), storage guilde L1-L5, consignation, stalls, marché
fluctuant ±15 % (route canonique exemptée), métiers trader/thief/hunter
avec trade runs rentables et PvP self-defense.

**Performance & robustesse** — **103 FPS avec 3 clients** (112 FPS seul),
churn 0,0 % meshes/animGroups/matériaux/textures après 3 téléportations
(heap +1,8 %) — [mesures détaillées](docs/audit/v4/mesures_perf_v4.md).
Reconnexion automatique après coupure serveur (mesurée à 0,1 s après le
retour du serveur), ré-émission de l'équipement, SFX/musiques officiels
par zone (47 pistes).

## 🧪 Tests

Une trentaine de suites vivent dans `server/scripts/` et se lancent sur le
serveur de dev :

```bash
cd server && npx tsx scripts/test-v4-skills.ts         # skills : 8 catégories → 14/14
cd server && npx tsx scripts/test-phaseH-finalaudit.ts # audit final → 24/24
cd server && npx tsx scripts/test-audit-v3.ts          # audit complet → 22/22
```

Audit visuel **rejouable dans le navigateur** : `client/src/test/v4-audit.ts`
(8/8 critères, exécuté en 2 passages).

Couverture : équipement, combat, quêtes, social, monde, fin de jeu,
robustesse, donjons, métiers, pets — 20/20 · 15/15 · 17/17 · 9/9 · 6/6 ·
12/12 · 14/14 · 15/15, régressions toujours au vert. *(Les suites
donjons/forteresses exigent un serveur fraîchement redémarré — états en
mémoire.)*

## 📚 Documentation

### Audits & preuves (`docs/audit/`)

- **[Audit final](docs/audit/AUDIT_FINAL_V4.md)** — 8/8 critères, tableaux
  de preuves ; captures dans [docs/audit/v4/](docs/audit/v4/) (armure 3
  angles, panneau skills iconisé, cast + buffs, marqueurs de quête, 3 clients)
- **[Mesures de performance](docs/audit/v4/mesures_perf_v4.md)** — FPS,
  frame ms, compteurs scène, churn mémoire, réseau au login
- Audits des étapes précédentes : [AUDIT_FINAL_V3.md](docs/audit/AUDIT_FINAL_V3.md) ·
  [AUDIT_FINAL_V2.md](docs/audit/AUDIT_FINAL_V2.md)
  ([transcription filmée](docs/audit/AUDIT_FILME_V2_TRANSCRIPT.log)) ·
  [AUDIT_FINAL.md](docs/audit/AUDIT_FINAL.md) · films `.webm` dans le même dossier

### Cahiers des charges & suivi

- [PROMPT_MAITRE.md](PROMPT_MAITRE.md) · [V2](PROMPT_MAITRE_V2.md) ·
  [V3](PROMPT_MAITRE_V3.md) · [V4](PROMPT_MAITRE_V4.md) — cahiers des
  charges successifs, chacun avec critères mesurables
- [Avancement.md](Avancement.md) — journal complet du projet

### Documentation technique

- **[Index de la documentation](docs/INDEX.md)** — hub multilingue FR/EN
- [Architecture détaillée](docs/ARCHITECTURE_DETAIL.md) ·
  [Rapport d'état actuel](docs/RAPPORT_ÉTAT_ACTUEL.md)
- Docs françaises ([miroir partiel EN](docs/en/README_EN.md)) :
  [structure BDD](docs/fr/DATABASE_STRUCTURE.md) ·
  [protocole réseau](docs/fr/NETWORK_PROTOCOL.md) ·
  [packets](docs/fr/PACKET_STRUCTURE.md) ·
  [architecture client-serveur](docs/fr/SERVER_CLIENT_ARCHITECTURE.md) ·
  [intégration Babylon](docs/fr/BABYLONJS_INTEGRATION.md) ·
  [formats du client](docs/fr/CLIENT_FILE_FORMAT.md)… ([liste complète](docs/fr/))
- **[Base de connaissances SRO](docs/SRO_KNOWLEDGE_BASE/README.md)** — ~80
  fichiers sourcés + 127 captures : mécaniques, formules, bases skills
  [CH](docs/SRO_KNOWLEDGE_BASE/SKILLS_DATABASE_CHINESE.md)/
  [EU](docs/SRO_KNOWLEDGE_BASE/SKILLS_DATABASE_EUROPEAN.md), recherche
  multilingue (6 communautés), 697 PNJ + 161 téléporteurs coordonnés

### Assets & ingénierie inverse

- [README_ASSETS.md](README_ASSETS.md) — conversion Blender/GLB avec skinning
- [Solution PK2 CLI (Rust)](docs/PK2_CLI_SOLUTION.md) ·
  [guide PK2 Editor](docs/GUIDE_PK2_EDITOR.md) ·
  [checklist d'extraction](docs/CHECKLIST_PK2_EXTRACTION.md)
- Formats décryptés : [animations BAN](docs/BAN_FORMAT_DOCUMENTATION.md) ·
  [pièges GLB](docs/GLB_FORMAT_ISSUES.md) ·
  [compression XMX](docs/XMX_SOLUTION_FOUND.md)
- [README_TEST.md](README_TEST.md) — premier rapport de test navigateur
- Rapports historiques de la campagne d'extraction/conversion (janv. 2026) :
  `MVP_*.md` à la racine et `docs/CONVERSION_*`, `docs/SESSION_*`,
  `docs/EXTRACTION_*`

## ⚖️ Legal & Disclaimer

**Educational Purpose Only.**
This project is an emulator designed for interoperability research.
- **Silkroad Online** is a trademark of **Joymax Co, Ltd.**
- No copyrighted assets are distributed in this repository.
- Users must extract assets from their own legitimate game client.
