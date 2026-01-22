# SRObro - Next-Gen Silkroad Online Emulator (WebGPU)

![Status](https://img.shields.io/badge/Status-Technical%20Preview-orange)
![Engine](https://img.shields.io/badge/Engine-Babylon.js%208.0%20(WebGPU)-blueviolet)
![Server](https://img.shields.io/badge/Server-Authoritative%20(20Hz)-green)
![License](https://img.shields.io/badge/License-MIT-blue)

**SRObro** is a high-performance web implementation of Silkroad Online, built on **WebGPU** and a modern authoritative server architecture.

Unlike simple viewers, SRObro implements a full **MMO Game Loop**, a robust **Asset Pipeline** capable of validating skinned meshes, and a proprietary **Rust toolchain** for handling legacy formats (`.ban`, `.bms`, `.pk2`).

---

## 📚 Documentation Hub

The project documentation is extensive (65+ files, 200,000+ words). Use this index to navigate technical and gameplay details.

### 🎮 Silkroad Online Knowledge Base (SRO_KNOWLEDGE_BASE)

**Complete game mechanics, formulas, and 2024-2026 meta strategies**

**📖 Quick Access to Key Documentation:**

- **[Knowledge Base Home](docs/SRO_KNOWLEDGE_BASE/README.md)** - Main index of all game documentation
- **[Combat System](docs/SRO_KNOWLEDGE_BASE/04_COMBAT_SYSTEM.md)** - Damage formulas, attack rating, parry ratio
- **[PvP Builds](docs/SRO_KNOWLEDGE_BASE/33_PVP_BUILDS.md)** - 2024-2026 meta builds, tier lists
- **[Job System](docs/SRO_KNOWLEDGE_BASE/09_JOB_SYSTEM_OVERVIEW.md)** - Trader, Thief, Hunter strategies
- **[Leveling Guide](docs/SRO_KNOWLEDGE_BASE/25_LEVELING_GUIDE.md)** - Optimal leveling routes 2024-2026
- **[SP Farming](docs/SRO_KNOWLEDGE_BASE/26_SP_FARMING.md)** - SP farming strategies and GAP system
- **[Economy & Gold](docs/SRO_KNOWLEDGE_BASE/22_ECONOMY_GOLD.md)** - Gold farming, market trends, stall flipping
- **[Alchemy System](docs/SRO_KNOWLEDGE_BASE/05_ALCHEMY_SYSTEM.md)** - Success rates, strategies, probabilities
- **[Advanced Mechanics](docs/SRO_KNOWLEDGE_BASE/28_ADVANCED_MECHANICS.md)** - Animation canceling, formulas, data mining
- **[Unique Bosses](docs/SRO_KNOWLEDGE_BASE/15_UNIQUE_BOSSES.md)** - Spawn times, strategies, drop tables
- **[Monster Guide](docs/SRO_KNOWLEDGE_BASE/14_MONSTER_GUIDE.md)** - Complete monster database with spawn locations

**🌍 Multilingual Research Sources:**
- 🇰🇷 **Korean** - Original game mechanics & official data
- 🇹🇷 **Turkish** - Current 2024-2026 meta & private server strategies
- 🇺🇸 **English** - International consensus & data mining discoveries

### 🏗️ Technical Documentation

| Category | Document | Description |
|----------|----------|-------------|
| **Architecture** | **[Detailed Architecture](docs/ARCHITECTURE_DETAIL.md)** | Deep dive into `Engine.ts`, `GameLoop.ts` and the Asset Pipeline. |
| **Status** | **[Status Report](docs/RAPPORT_ÉTAT_ACTUEL.md)** | Current blockers (XMX Compression), successes, and roadmap. |
| **Tools** | **[PK2 Extraction Guide](docs/PK2_CLI_SOLUTION.md)** | How to use the Rust CLI to extract 4GB+ of assets. |
| **General** | **[Project Index](docs/INDEX.md)** | The main entry point for all documentation (multilingual). |

---

## 🏗️ Technical Implementation

### 1. The Client (`/client`)
Built for performance using **Babylon.js 8.0**.
- **Rendering Engine**:
  - Primary: **WebGPU** context (`navigator.gpu`) for compute shader capabilities.
  - Fallback: WebGL2.
  - **Adaptive Scaling**: `PerformanceManager` dynamically adjusts resolution based on FPS.
- **Asset System** (`AssetLoader.ts`):
  - Implements strict **Skinning Validation** to prevent visual artifacts.
  - Checks bone weights and indices integrity before rendering.
- **Input System**:
  - `InputManager` handles MMO-specific patterns (Click-to-move, F1-F8 Hotkeys).

### 2. The Server (`/server`)
A strictly authoritative Node.js game server.
- **Core Loop** (`GameLoop.ts`):
  - Runs at a fixed **20Hz** (50ms tick).
  - Processes inputs, updates physics/state, and broadcasts **WorldSnapshots**.
- **Architecture**:
  - **SystemHandlers**: Modular logic for Guilds, Items, and Quests.
  - **Database**: Prisma ORM with PostgreSQL for persistent player data.

### 3. Reverse Engineering Core (`/ban-re`)
Custom **Rust** crate developed specifically for this project.
- **Target**: `JMXVBAN` (JoyMax Animation Binary).
- **Status**:
  - ✅ Header & Bone Hierarchy parsing.
  - ⚠️ Keyframe interpolation (Quaternion math in progress).
  - 🔄 Integrated via CLI for the extraction pipeline.

### 4. Production Pipeline (`/scripts`)
Industrial-grade automation using Python & Blender.
- **`blender-batch-production.py`**: The master script that:
  1. Imports raw `.bms` meshes.
  2. Auto-maps skeletons (`.bsk`) based on naming conventions.
  3. Exports optimized GLB files for the web client.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js v20+**
- **Rust** (Cargo) for the extractor tools.
- **Python 3.10+** (with `bpy` module if running headless).
- **Docker** (for Database/Redis).

### Installation

1.  **Clone & Install**
    ```bash
    git clone https://github.com/yourusername/SRObro.git
    cd SRObro
    npm run install:all
    ```

2.  **Infrastructure Setup**
    ```bash
    npm run docker:up   # Starts Postgres & Redis
    npm run db:migrate  # Initializes Schema
    ```

3.  **Asset Extraction (Crucial)**
    *You must provide your own `Media.pk2` and `Data.pk2` files in the root folder.*
    ```bash
    npm run extract:pk2
    ```
    *This triggers the Rust CLI to extract ~4GB of assets to `assets/`.*

4.  **Run Development Stack**
    ```bash
    npm run dev
    ```
    - Client: `http://localhost:3000`
    - Server: `http://localhost:8080`

---

## 🚧 Current Development Focus

We are strictly following a technical roadmap:

1.  **Cryptography (Priority #1)**: Reverse engineering the `JMXV` compression (XMX) to unlock 3D mesh geometry.
    *   *See [XMX_COMPRESSION_STATUS.md](docs/XMX_COMPRESSION_STATUS.md)*
2.  **Animation**: Finalizing the `.ban` format decoding in Rust.
3.  **Gameplay**: Implementing the "Triangular Conflict" (Job System).

---

## ⚖️ Legal & Disclaimer

**Educational Purpose Only.**
This project is an emulator designed for interoperability research.
- **Silkroad Online** is a trademark of **Joymax Co., Ltd.**
- No copyrighted assets are distributed in this repository.
- Users must extract assets from their own legitimate game client.