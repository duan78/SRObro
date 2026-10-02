# SRObro — Silkroad Online dans le navigateur

![Status](https://img.shields.io/badge/Status-Jouable%20(V3%20finalis%C3%A9e)-brightgreen)
![Engine](https://img.shields.io/badge/Engine-Babylon.js%208.0-blueviolet)
![Server](https://img.shields.io/badge/Server-Authoritative%20Socket.io-green)
![License](https://img.shields.io/badge/License-MIT-blue)

**SRObro** est un clone navigateur de Silkroad Online construit sur les
**assets officiels du client** (PK2 extraits : modèles, animations BAN, VFX
EFP, musiques, textdata) — pas une imitation, les données du jeu réel.

État : **V3 finalisée et auditée** — 24/24 au test d'audit final
([AUDIT_FINAL_V3.md](docs/audit/AUDIT_FINAL_V3.md)), régressions V1/V2 au vert,
**83 FPS mesurés avec 3 clients simultanés**.

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
| Tab | Cible ennemie suivante |
| **I** ou **A** / **C** | Inventaire / Personnage |
| **L** / **S** | Quêtes (log) / Skills |
| **P** / **J** / **M** | Party / Jobs / Carte du monde |
| **H** / Échap | Aide / Fermer la fenêtre active |

## 🌍 Ce que couvre le jeu

**Monde** — 3 continents, 7 zones jouables (Jangan, Donwhang, Hotan,
Constantinople, Asia Minor, Samarkand, Alexandria) sur le terrain officiel
streamé (819 régions), téléporteurs, ferry avec pirates, 5 uniques.
Cap 120, chin./euro., skills et taux d'alchimie **issus des textdata vSRO**.

**Combat** — combos par skill (animations BAN officielles), VFX .efp
(imbues feu/glace/foudre distincts), zerk, mort/respawn, mobs aggro sur IA
serveur à 20 Hz, guild war scorée sans PK, Fortress War Eastern Europe avec
**taxe réelle appliquée aux achats** de la ville occupée.

**Progression** — 51 quêtes officielles (récompenses exactes, chaînes,
repeat), titres Blue Zerk (Knight→Count), Energy of Life, alchimie +0→+12
avec destruction ≥ +5, drops 11D, Job Temple gated aux AP d'union
(règle officielle KB 15, paliers Anubis→Seth).

**Social/économie** — canaux party/guild/union + /w, party Auto Share
(bonus officiel), storage guilde L1-L5, consignation, stalls, marché
fluctuant ±15 % (route canonique exemptée), métiers trader/thief/hunter
avec trade runs rentables et PvP self-defense.

**Robustesse** — reconnexion automatique après coupure serveur
(mesurée à 0,1 s après le retour du serveur), re-émission de l'équipement,
SFX/musiques officiels par zone.

## 🧪 Tests

Toutes les suites vivent dans `server/scripts/` et se lancent sur le
serveur de dev :

```bash
cd server && npx tsx scripts/test-phaseH-finalaudit.ts   # audit final 24/24
cd server && npx tsx scripts/test-audit-v3.ts            # audit V3 22/22
```

Phases A→G : 20/20 · 15/15 · 17/17 · 9/9 · 6/6 · 12/12. Régressions V1/V2/I
vertes. *(Les suites donjons/forteresses exigent un serveur fraîchement
redémarré — états en mémoire.)*

## 📚 Documentation

- **[Index de la documentation](docs/INDEX.md)** — hub multilingue
- **[Audit final V3](docs/audit/AUDIT_FINAL_V3.md)** — preuves critère par critère
- **[PROMPT_MAITRE_V3.md](PROMPT_MAITRE_V3.md)** — cahier des charges livré
- **[Base de connaissances SRO](docs/SRO_KNOWLEDGE_BASE/README.md)** — 65+ fichiers,
  mécaniques/formules/méta 2024-2026
- **[Architecture détaillée](docs/ARCHITECTURE_DETAIL.md)** ·
  [Rapport d'état](docs/RAPPORT_ÉTAT_ACTUEL.md)

## ⚖️ Legal & Disclaimer

**Educational Purpose Only.**
This project is an emulator designed for interoperability research.
- **Silkroad Online** is a trademark of **Joymax Co, Ltd.**
- No copyrighted assets are distributed in this repository.
- Users must extract assets from their own legitimate game client.
