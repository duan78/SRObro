# SRObro - Analyse Technique Détaillée (Janvier 2026)

Ce document reflète l'état du code analysé le 21 Janvier 2026.

## 1. Client (`client/src`)

### Core Engine (`core/Engine.ts`)
- **Backend Graphique** : WebGPU prioritaire (`navigator.gpu`), fallback sur WebGL2.
- **Optimisation** : Classe `PerformanceManager` qui ajuste le `hardwareScalingLevel` dynamiquement.
- **Rendu** : Scène unique pour l'instant, préparée pour le streaming de zones.

### Asset Pipeline (`core/AssetLoader.ts`)
- **Format** : GLB (glTF Binary).
- **Validation** : Vérification critique des données de skinning (`weights`, `joints`) au chargement pour éviter les artefacts visuels courants (le "spaghetti monster" effect).
- **Chargement** : Asynchrone, prévu pour charger les assets à la volée.

### Interface (`ui/`)
- **Techno** : Babylon GUI (AdvancedDynamicTexture).
- **Architecture** : `UIManager` agit comme un hub. Les fenêtres (Inventaire, Character) sont des composants injectés.
- **Inputs** : `InputManager` intercepte clavier/souris et mappe vers des actions de jeu (pas juste des événements bruts).

## 2. Serveur (`server/src`)

### Boucle de Jeu (`core/GameLoop.ts`)
- **Fréquence** : 20 ticks par seconde (50ms).
- **Logique** :
  1. Process Incoming Packets
  2. Update Game State (Physique, Stats)
  3. Snapshot World State
  4. Broadcast Snapshot (Delta compression prévue ?)

### Réseau
- **Protocole** : WebSocket (Socket.IO).
- **Structure** : Handlers séparés par "Système" (Guild, Party, Item). Facilite la maintenance et le travail en équipe.

## 3. Reverse Engineering (`ban-re/`)

### Outil Rust
- **Cible** : Fichiers `.ban` (Binary Animation).
- **État** :
  - Parsing Header : OK (Magic number, Version).
  - Parsing Bones : OK (Hiérarchie détectée).
  - Parsing Keyframes : Partiel. Les quaternions sont extraits, mais l'interpolation reste à caler sur le framerate SRO (30 FPS ?).

## 4. Scripts & Pipeline (`scripts/`)

### Blender Automation
- **`blender-batch-production.py`** est le script critique.
- Il fait le pont entre les formats bruts extraits et le GLB moderne.
- Gère : Import BMS -> Assignation Skeleton -> Validation Weights -> Export GLB.

---

**Conclusion** : Le projet dispose de fondations solides pour un MMO. Les briques les plus complexes (Rendu WebGPU, Serveur Autoritaire, Pipeline Assets) sont en place. Le principal verrou reste la décompression des données brutes (XMX).
