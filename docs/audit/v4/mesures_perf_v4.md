# Mesures de performance V4 (§F) — 2026-10-02/03

Machine de dev (Windows, IAB). Méthode: pompage du render loop
(`engine._activeRenderLoops[0]()` × N frames) depuis l'onglet composé.

| Mesure | Valeur | Critère | Verdict |
|---|---|---|---|
| FPS 1 client, UI complète (armure 7/7, 87 PNJ étiquetés, fog) | **112 FPS** (8,91 ms/frame) | — | ✅ |
| FPS 3 clients simultanés (Au2iix0j + CstBrws01 + Audiiwws, tous en jeu) | **103 FPS** (9,69 ms/frame) | ≥ 60 | ✅ |
| FPS après ~15 min de session + 2 audits visuels complets | 69 FPS | ≥ 60 | ✅ |
| Churn mémoire: 3 téléportations (300,700 → 900,300 → retour spawn) + 450 frames pompées | meshes **0,0 %**, animGroups **0,0 %**, matériaux **0,0 %**, textures **0,0 %**, heap **+1,8 %** | Δ < 5 % | ✅ |
| Compteurs scène au churn | 2 608 meshes · 835 groupes · 402 matériaux · 1 083 textures · ~388 Mo heap | — | stable |
| Requêtes réseau au login | 250 ressources totales, 0 requête icône dédiée avant ouverture des panneaux (icônes à la demande) | < 200 si groupement requis | ✅ |

Notes:
- La croissance heap observée sur la fenêtre 15 min (+12 %) correspond au
  chargement légitime du contenu des panneaux ouverts pendant les audits
  (icônes séries, DOM) — le churn dédié ci-dessus isole la scène 3D.
- Référence V3: 83 FPS avec 3 clients (avant HUD complet + étiquettes).
  V4 ajoute étiquettes 87 PNJ + fog + icônes en restant > 100 FPS.
