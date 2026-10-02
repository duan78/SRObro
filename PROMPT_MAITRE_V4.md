# PROMPT MAÎTRE V4 — Finalisation visuelle, UI et fidélité SRO

> **Objectif :** porter SRObro au niveau d'un clone **parfait et optimisé** de
> Silkroad Online (fidélité ksro/vsro/isro). La V3 a livré la profondeur
> gameplay (monde 7 zones, FW avec taxe, Job Temple/AP, guildes, alchimie,
> 51 quêtes, audit 24/24). La V4 attaque ce qui saute aux yeux en 10 secondes
> de jeu : **armure tordue/à l'envers, UI empilée illisible, icônes de skills
> absentes** — puis la fidélité fine et l'optimisation.
>
> **Sources de vérité :** (1) le client officiel
> `C:\Program Files (x86)\Silkroad` (PK2 : modèles, animations BAN, icônes,
> textdata), (2) les données déjà injectées (`server/data/game/*.json`,
> skilldata vSRO), (3) les captures du client officiel comme référence
> visuelle. En cas de doute sur un comportement : mesurer sur l'officiel,
> ne pas inventer.

---

## §0 — Règles d'exécution (identiques V3, non négociables)

1. **Une phase = un commit** français décrivant ce qui est démontré.
2. **Chaque affirmation visuelle est prouvée par capture** (`tab.screenshot()`
   → analyse) : « l'armure est alignée » doit être vérifié sur image, pas
   déduit du code.
3. **Chaque affirmation logique est prouvée par test scripté**
   (`server/scripts/test-v4-*.ts`, lancés sur serveur de dev, sortie
   recoupée dans un fichier — les sorties shell sont parfois fantômes).
4. **Zéro régression** : les suites V1/V2/V3 (`test-audit-v3.ts` 22/22,
   `test-phaseH-finalaudit.ts` 24/24, phases A→G) doivent rester vertes.
   Tests donjons/forteresses : serveur **fraîchement redémarré**.
5. `tsc --noEmit` à 0 erreur client et serveur avant chaque commit.
6. Ne jamais versionner les assets extraits ni les `.tmp_*`.

---

## §1 — Diagnostic de départ (constaté en jeu le 2026-10-02, causes tracées)

Capture analysée (Au2iix0j, lv40, camp Mangnyang) + lecture de code :

### 1. Armure mal alignée / à l'envers (pieds inversés, buste dans le dos)
- **Cause première quasi certaine — double flip π :**
  `AssetLoader.loadMultiPartGlb` (`client/src/core/AssetLoader.ts:413`)
  crée pour CHAQUE ressource un nœud `<id>_flip` avec `rotation.y = π`
  (les modèles SRO regardent vers −Z). Le corps du joueur vit sous son
  `_flip`, MAIS `applyEquipmentVisual`
  (`client/src/game/NetworkCombat.ts:650-668`) parente la **racine** de
  chaque pièce d'armure (qui contient **son propre** `_flip` π) sous le
  `_flip` du corps → **2×π = 180° relatif** : le buste regarde le dos,
  les bottes gauche/droite sont échangées.
- **Segments dupliqués derrière le perso** : fantômes de bind pose des
  meshes skinnés (Babylon rend certains skinned meshes en pose de bind en
  plus de la pose animée — déjà contourné pour le picking via proxy ;
  vérifier `skeleton.overrideMesh`/matrices init et purger les racines
  résiduelles `equip_armor_*` orphelines).
- **Bras en T-pose** : l'idle n'est pas joué sur TOUS les squelettes
  (corps + chaque pièce) — l'événement `srobro:player-appearance`
  (`Game.ts:655`) re-sélectionne l'anim, mais les nouveaux squelettes des
  pièces doivent être inclus dans le groupe joué au moment du
  `switchPlayerAnim`, sinon seuls certains os bougent.
- **Épée flottante horizontale** : `attachWeaponVisual`
  (`NetworkCombat.ts:541-580`) fait `attachToBone(handBone)` avec
  `rotation.set(0,0,0)` — l'orientation locale officielle de l'arme dans
  la main est perdue. Reprendre l'offset/rotation mesurés sur le client
  officiel (l'arme tient dans la paume, lame vers l'avant-bas).

### 2. UI empilée / illisible
- **Deux HUD coexistent** : `UIManager.ts:100-111` instancie SkillBar +
  HotkeyBar en **Babylon GUI** (texture plein écran) PENDANT que
  `DomHud.ts` rend **sa propre hotbar en DOM** → deux barres empilées,
  textes tronqués qui se chevauffent.
- **Fenêtres toutes à `top:70px; z-index:600`** en position fixe
  (`CharacterPanel.ts:42`, `InventoryPanel.ts:72`, `SkillPanel`,
  `QuestPanel`…) : ouvertes simultanément elles se recouvrent, sans
  drag ni fermeture exclusive.
- **Chat en double rendu** (texte fantôme superposé) : messages ajoutés
  deux fois ou re-rendu sans purge du conteneur.
- **Cadre de cible « Lv.1 » géant** flottant au centre : la cible
  sélectionnée garde un template non dimensionné (le vrai cadre officiel
  est compact, collé sous le cadre joueur).
- **Boussole coupée** au bord droit : ancrage hors viewport.

### 3. Icônes et logique de skills absentes
- **Tout existe, rien n'est câblé** : `server/data/game/skills_official.json`
  (6 909 skills vSRO) contient le champ `icon`
  (`skill\china\sword_smash_a.ddj`), et **552/56 icones uniques sont déjà
  extraites en PNG** sous `client/public/assets/icons/skill/{china,europe,…}/`.
  Seules 4 manquent (`europe/staff_base`, `europe/wand_warlock_base`,
  `europe/harp_base`, `europe/wand_cleric_base`) — à extraire du PK2.
- `client/src/ui/dom/SkillPanel.ts` : **0 occurrence de « icon »** — le
  panneau n'affiche aucune icône. La hotbar non plus (slots vides F1-F8).
- Les logos items existent aussi (`icons/item/…`, 7 893 fichiers) : à
  brancher dans inventaire/équipement/boutique/alchemy/stalls.

---

## §2 — Phases de travail (ordre strict, chaque phase a ses critères)

### Phase A — Rendu du personnage fidèle (P0, bloquant tout le reste)
1. **Fix armure 180°** : ne pas empiler les flips. Soit parenter le
   **contenu** de la pièce sous le `_flip` du corps en neutralisant le
   flip interne (`innerFlip.rotation.y = 0` ou re-parent des meshes), soit
   exporter les GLB d'armure sans flip et les parenter directement.
   Vérifier AUSSI PNJ et joueurs distants (même chemin de chargement).
2. **Fix T-pose** : après `equipment:full`, le groupe d'animation idle doit
   englober corps + pièces (regénérer les `player_anim_*` avec tous les
   squelettes courants, cf. `srobro:player-appearance`).
3. **Fix épée** : offset local officiel dans la main (mesurer sur le client
   officiel : position + rotation de l'os `Bip01 R HandMid`).
4. **Purger les fantômes** : aucun mesh d'armure en pose de bind visible
   derrière le perso (vérifier `scene.meshes` count avant/après équipement).
5. **Vérification multi-races/genres** : ch_man, ch_woman, eu_man, eu_woman
   sur au moins 2 sets d'armure chacun.

**Critère d'acceptation :** captures frontale + profil + dos du perso équipé,
analysées : « aucune pièce tordue, aucun doublon, arme en main correcte,
idle joué sur tout le corps ». Un script DOM vérifie
`scene.getNodes().filter(n => n.name.startsWith('equip_armor_')).length ===
nombre de pièces équipées` et l'absence de rotation π cumulée
(somme des rotations.y des ancêtres de chaque pièce ≡ orientation du corps).

### Phase B — UI unique, lisible, fidèle (P0)
1. **Un seul système de HUD : le DOM** (déjà le choix affiché). Retirer la
   couche GUI en doublon (SkillBar/HotkeyBar/XPSPBars de
   `UIManager`/`components/`) ou ne garder du GUI Babylon que ce qui est
   3D (dégâts flottants, noms au-dessus des têtes). **Une seule hotbar.**
2. **Gestionnaire de fenêtres** : une fenêtre DOM par zone d'écran
   (haut-gauche perso, haut-droite minimap/party, centre inventaire,
   etc.), ouverture exclusive par raccourci, Échap ferme la fenêtre active,
   drag & drop des fenêtres, z-index géré (fenêtre cliquée passant devant).
   Aucun recouvrement possible entre panneaux ouverts.
3. **Chat propre** : un seul rendu par message, auto-scroll, canaux
   coloriés (général/party/guild/union/système comme l'officiel),
   saisie Entrée.
4. **Cadre de cible officiel** : compact, sous le cadre joueur, avec
   barre HP cible ; disparaît quand la cible meurt/désélection.
5. **Hotbar officielle** : 3 rangées commutables (1-0, F1-F8…), slots
   drag&drop depuis le panneau skills, clic droit = consommable,
   cooldown radial sur le slot, compteur de stacks.
6. **Minimap + carte monde (M)** avec position joueur, PNJ, mobs,
   téléporteurs — coordonnées X/Z SRO réelles affichées.
7. **Écrans d'authentification/sélection de perso** soignés (fond officiel
   de login, slots de persos avec modèle 3D ou portrait).

**Critère d'acceptation :** capture avec TOUS les panneaux ouverts :
`0 paire de bounding boxes DOM qui se chevauche` (script JS dans la page
qui calcule les `getBoundingClientRect()` de chaque `.hud-panel`/fenêtre et
affirme la disjonction) ; capture de la hotbar avec icônes (après phase C).

### Phase C — Icônes officielles partout (P0)
1. **Router le champ `icon`** : côté serveur, exposer `icon` (converti :
   `skill\china\x.ddj` → `assets/icons/skill/china/x.png`) dans les
   payloads `skills:list`, hotbar, tooltips ; côté client, l'utiliser
   dans SkillPanel, hotbar, tooltips.
2. **Extraire les 4 icônes manquantes** du PK2 officiel
   (`europe/staff_base`, `europe/wand_warlock_base`, `europe/harp_base`,
   `europe/wand_cleric_base`) → 556/556.
3. **Icônes items** (`icons/item/**`, 7 893 PNG) dans inventaire,
   équipement, boutique, alchimie, consignation, stalls, loot au sol,
   tooltips avec rareté (couleur du nom : blanc/bleu/jaune/orange comme
   l'officiel).
4. **Icônes buffs/débuffs** avec timer, icônes d'états (zerk, imbue,
   poison/gel/brûlure).
5. Fallback propre : icône inconnue → `icons/icon_default.png` (existe).

**Critère d'acceptation :** script navigateur qui, pour chaque skill appris
du perso test, vérifie que l'URL d'icône renvoie 200 et que le slot du
panneau a un `background-image` non vide ; capture analysée des panneaux.

### Phase D — Skills : logos ET logique (P1)
1. **Panneau skills officiel** : par mastery (icône d'onglet), grille des
   skills appris avec icône/niveau/flèche de chaîne (chainNext), panneau
   de détail (dégâts réels calculés OfficialFormulas, coûts, portée,
   arme requise, cooldown) — texte issu de textdata.
2. **Cast feedback complet** : barre d'incantation, cooldown radial,
   animation par skill (déjà : clips par skill), VFX ciblés
   (déjà : .efp), dégâts flottants colorés (physique/magique/crit/
   block/absorb comme l'officiel).
3. **Effets par catégorie** (données déjà dans skills_official.json :
   attKind, attPct, mcHits, crit, heal, defp, hr/er, stDurMs) : multicoups,
   heals, buffs/débuffs temporisés avec icône, dot/hot, knockback,
   imbues élémentaires avec dégâts élémentaires séparés.
4. **EU combo system** (clerc en sourire, bardes…) au moins pour les
   mécaniques déjà données ; masteries jusqu'à 120 des deux races.
5. **Zerk** : jauge officielle, transformation, bonus, skills zerk.

**Critère d'acceptation :** test scripté qui caste ≥ 8 skills couvrant les
catégories (dégât mono, multi-coups, AoE, heal, buff, debuff, imbue,
zerk) et vérifie effets/états en base + événements client ; capture du
panneau skills avec icônes.

### Phase E — Fidélité visuelle du monde (P1)
1. **PNJ** : mêmes correctifs d'alignement (armes/props tenus corrects),
   nom + titre au-dessus de la tête, marqueur de quête (!/?), fenêtres de
   dialogue officielles (portrait, texte, choix).
2. **Monstres** : bons modèles/anims (aggro/patrouille/mort), barre HP
   cible, nom + niveau, comportement unique (AoE esquivable, Petrify/Fear
   déjà données pour Medusa — généraliser via mobdata).
3. **Éclairage/atmosphère** : cycle jour/nuit par continent, fog de
   distance par zone, eau animée, ciel officiel par continent (déjà
   partiellement), ombres portées joueur/PNJ (low-cost : blob shadows
   acceptable si perf tenue).
4. **Détails officiels** : panneaux de ville, portails de téléport avec
   liste officielle + coûts, panneaux de zone avec nom localisé au
   changement de région.

**Critère d'acceptation :** capture comparée au client officiel pour
Jangan place centrale, Constantinople dock, Alexandria : analyse montre
« éclairage/fog cohérents, PNJ nommés alignés, quêtes marquées ».

### Phase F — Optimisation (« clone optimisé ») (P1)
1. Conserver le gain V3 (83 FPS/3 clients) : budget **≥ 60 FPS** avec 3
   clients ET l'UI complète + icônes (mesure `engine.getFps()` pompée
   5 s, onglet composé).
2. **Streaming sans à-coups** : aucun palier > 100 ms quand on court en
   ligne droite à travers 4 régions (instrumenter `loadRegion`).
3. **Mémoire stable** : groupes d'animation, meshes, textures suivis
   pendant 10 min de jeu (run + retour ville + TP) — pas de croissance
   nette (compte `scene.animationGroups/meshes/materials/textures` avant/
   après, Δ < 5 %).
4. **Chargement** : premier écran de jeu < 6 s (déjà), écran de progression
   par étapes (PK2 assets restants à charger affichés).
5. Assets : PNG icônes en spritesheets ou `fetch` groupé si le nombre de
   requêtes icônes dépasse ~200 au login (mesurer réseau).

**Critère d'acceptation :** rapport de mesure avant/après dans
`docs/audit/AUDIT_FINAL_V4.md` (tableau : FPS, frame ms, meshes, groupes,
mémoire JS heap).

### Phase G — Robustesse & tests V4
1. Suite `test-v4-visual.ts` : pilotage navigateur (onglet composé,
   pompage du render loop), connexion, équipement complet, ouverture de
   chaque panneau, assertions DOM (icônes chargées, 0 chevauchement,
   hotbar remplie).
2. Suite `test-v4-skills.ts` : achat/masteries/cast par catégorie (cf.
   phase D).
3. Régressions complètes V1/V2/V3 vertes (serveur frais).
4. Reconnexion auto toujours < 10 s après kill serveur (re-tester avec la
   nouvelle UI).

### Phase H — Audit final V4 + livraison
1. `docs/audit/AUDIT_FINAL_V4.md` : tableau critère par critère avec
   preuves (captures analysées + tests scriptés + mesures perf).
2. Films webm : login → perso équipé → combat skills/icônes → ville →
   panneaux (onglet composé ; si le backend IAB limite, captures
   horodatées en complément).
3. README + docs/INDEX mis à jour (V4).
4. Purge persos de test (garder Au2iix0j, Audiiwws, CstBrws01), `.tmp_*`
   supprimés, commit final.

---

## §3 — Définition de « finalisé V4 » (critères mesurables, tous requis)

| # | Critère | Preuve exigée |
|---|---|---|
| 1 | Perso équipé : 0 pièce tordue/inversée/doublée, arme en main, idle complet | captures 3 angles analysées + assertion scène (nb nœuds armure = pièces) |
| 2 | UI : 0 chevauchement avec tous panneaux ouverts, une seule hotbar | script DOM bounding boxes + capture |
| 3 | Icônes : 556/556 skills + items/buffs câblées, 0 slot vide non justifié | script (URLs 200 + bg non vide) + capture |
| 4 | Skills : 8+ catégories castées avec effets/états vérifiés | test scripté vert |
| 5 | Monde : PNJ/monstres alignés et nommés, quêtes marquées, fog/ciel par continent | captures comparées officiel |
| 6 | Perf : ≥ 60 FPS avec 3 clients + UI complète, Δ mémoire < 5 % sur 10 min | mesures horodatées |
| 7 | Régressions V1/V2/V3 vertes + tsc 0/0 | sorties de suites |
| 8 | Reconnexion < 10 s après kill serveur (avec UI V4) | test scripté |

## §4 — Ressources et pièges (acquis des V1-V3)

- **Ancres moteur (grille client, PAS xSROMap)** : Jangan 69×71=(0,510) ;
  Constantinople (69370,15846) ; Samarkand (35520,29760) ; Alexandria
  (40300,−42300) ; Asia Minor (33600,27840) ; camp Mangnyang (83,521).
- **Comptes de test** : arnaud/hunter2 (admin). Persos conservés :
  Au2iix0j, Audiiwws, CstBrws01 (plafond 12/compte — purger les tests).
- **Pipeline assets** : PK2 CLI (Rust) + ban2json + Blender batch → GLB ;
  DDJ = JPEG à offset 20 ; BAN durée en ms ; rigs partagés chinaman_skel ;
  bugs GLB connus (joints fragmentés → contournement dans AssetLoader).
- **Pièges Babylon** : meshes skinnés pickables en pose de bind (proxy) ;
  `attachToBone` écrase position locale ; groupes d'animation à disposer
  (fuite V3) ; `linkTransformNode` à délier avant replay BAN ; `rgba()`
  non supporté (utiliser Color4) ; rAF gelé en onglet arrière-plan
  (pomper `engine._activeRenderLoops[0]()` dans les évals).
- **Pièges serveur** : sauvegardes GM concurrentes interdites ; handlers
  guilde avec ack ; tests FW/donjons sur serveur frais ; PG hôte 5544,
  Redis 6379 mdp `srobro123`.
- **Sorties shell parfois fantômes** : toujours recouper par fichier et
  `git log`.
- **Icônes manquantes à extraire** : `europe/staff_base`,
  `europe/wand_warlock_base`, `europe/harp_base`, `europe/wand_cleric_base`
  (Icon.pk2 → `client/public/assets/icons/skill/europe/`).
- **Références communauté** : SilkroadDoc (formats), émulateurs AGPL
  (lecture seule), KB officielle SRO dans `docs/SRO_KNOWLEDGE_BASE/`.

---

*L'exécution de ce prompt suit la méthode V3 : phases dans l'ordre,
commit par phase, preuves systématiques, jamais de régression.*
