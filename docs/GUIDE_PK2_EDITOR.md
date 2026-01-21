# Guide PK2 Editor - Extraction Media.pk2

**Objectif :** Extraire correctement les fichiers BSR/BMS depuis Media.pk2 avec PK2 Editor

---

## Étape 1: Télécharger PK2 Editor

### Option A: Depuis GitHub (Recommandé)

1. **Visiter le repo :**
   ```
   https://github.com/eggmundsen/pk2editor/releases
   ```

2. **Télécharger la dernière release**
   - Chercher `pk2_editor.zip` ou similaire
   - Télécharger le fichier ZIP

3. **Extraire l'archive**
   ```
   C:\Users\duan7\Desktop\SRObro\tools\pk2editor\
   ```

### Option B: Depuis Sources (Si besoin)

1. Installer .NET 6+ ou .NET Framework 4.7.2+

2. Cloner le repo :
   ```bash
   git clone https://github.com/eggmundsen/pk2editor.git
   ```

3. Compiler avec Visual Studio (si nécessaire)

---

## Étape 2: Lancer PK2 Editor

### Interface PK2 Editor

```
┌─────────────────────────────────────────────┐
│  PK2 Editor                                 │
├─────────────────────────────────────────────┤
│                                             │
│  File: [C:\Program Files (x86)\Silkroad\  │
│         Media.pk2            ▼]           │
│                                             │
│  [Open]  [Extract To...]  [List Files]     │
│                                             │
│  File Tree:                                 │
│  ├─ Character/                              │
│  │  ├─ CH_Man/                              │
│  │  │  └─ ...                               │
│  ├─ Item/                                   │
│  ├─ Mob/                                    │
│  └─ ...                                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Étape 3: Extraction Media.pk2

### 3.1 Ouvrir Media.pk2

1. Lancer `PK2_Editor.exe`
2. Click **File** → **Open**
3. Naviguer vers :
   ```
   C:\Program Files (x86)\Silkroad\Media.pk2
   ```
4. Click **Ouvrir**

### 3.2 Choisir les fichiers à extraire

Dans l'arborescence, cherchez et cochez :

**Pour les personnages (Character) :**
```
Character/
├─ CH_Man/         ← Chinois homme
├─ CH_Woman/        ← Chinoise femme
├─ EU_Man/         ← Européen homme
└─ EU_Woman/        ← Européenne femme
```

**Pour les monstres (Mob) :**
```
Mob/
├─ CH_Mob/          ← Monstres Chine
└─ EU_Mob/          ← Monstres Europe
```

**Pour les NPCs :**
```
NPC/
├─ CH_NPC/          ← NPCs Chine
└─ EU_NPC/          ← NPCs Europe
```

**Pour les items (Item) :**
```
Item/
├─ Weapon/
└─ Armor/
```

### 3.3 Extraire les fichiers

1. Sélectionner les dossiers voulus
2. Click **Extract To...**
3. Choisir le dossier de destination :
   ```
   C:\Users\duan7\Desktop\SRObro\assets\pk2_extracted\
   ```
4. Click **OK** et attendre l'extraction

**Note :** L'extraction peut prendre 5-15 minutes selon la quantité de fichiers.

---

## Étape 4: Vérifier les fichiers extraits

Une fois l'extraction terminée, vérifions :

### 4.1 Lister les fichiers BSR/BMS

Ouvrir une invite de commande et exécuter :

```bash
cd C:\Users\duan7\Desktop\SRObro\assets\pk2_extracted

# Compter les fichiers par type
dir /s /b *.bsr | find /c ".bsr"
dir /s /b *.bms | find /c ".bms"
dir /s /b *.ddj | find /c ".ddj"
```

### 4.2 Vérifier le format

Le script va analyser quelques fichiers extraits :

```bash
node C:\Users\duan7\Desktop\SRObro\scripts\analyze-bsr.js
```

---

## Étape 5: Intégration avec Notre Pipeline

Une fois les fichiers extraits correctement :

1. **Mettre à jour le chemin d'extraction**
   - Notre pipeline utilisera `assets/pk2_extracted/` au lieu de `temp_extraction/`

2. **Lancer la conversion**
   ```bash
   ts-node scripts/convert-blender.ts \
     --input assets/pk2_extracted \
     --output assets/converted \
     --blender-path "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"
   ```

3. **Valider les résultats**
   ```bash
   ts-node scripts/validate-assets.ts \
     --input assets/converted \
     --detailed
   ```

---

## Structure Attendue des Fichiers Extraits

```
pk2_extracted/
├─ Character/
│  ├─ CH_Man/
│  │  ├─ bsr file.bsr      ← Modèle 3D + Squelette
│  │  └─ xxx file.ddj      ← Texture
│  └─ ...
├─ Mob/
│  ├─ CH_Mob/
│  │  ├─ mob_xxx.bsr
│  │  └─ ...
└─ ...
```

---

## Dépannage

### Problème : "Cannot open PK2 file"

**Solution :**
- Vérifier que Media.pk2 n'est pas utilisé par Silkroad
- Copier Media.pk2 vers le bureau d'abord
- Essayer avec la copie

### Problème : "Extraction failed"

**Solution :**
- Vérifier l'espace disque (il faut ~2-3 GB)
- Lancer PK2 Editor en tant qu'administrateur
- Essayer d'extraire un seul dossier à la fois

### Problème : Fichiers extraits mais format corrompu

**Solution :**
- Vérifier que les noms de fichiers sont lisibles
- Si noms avec caractères bizarres, essayer une autre extraction
- Contacter le support PK2 Editor

---

## Prochaine Étape Après Extraction

Une fois les fichiers extraits et vérifiés :

1. ✅ Les fichiers seront au bon format BSR/BMS
2. ✅ Notre pipeline pourra les convertir
3. ✅ Nous aurons des GLB avec skinning complet
4. ✅ Babylon.js pourra les animer

---

**En cas de problème pendant l'extraction, notez :**
- Le message d'erreur exact
- L'étape où ça bloque
- Les fichiers visibles dans PK2 Editor

**Je serai là pour débloquer la situation !** 🚀
