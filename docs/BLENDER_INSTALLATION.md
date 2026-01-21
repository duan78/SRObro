# Installation Guide - Blender 5.0 + Silkroad Tools

## Option 1: Installation Automatisée (Recommandée)

### Étape 1: Télécharger Blender
Double-cliquez sur `install_blender.bat` dans le dossier SRObro

Cela va:
- Télécharger Blender 5.0 (~300 MB)
- L'extraire dans Program Files
- Ajouter au PATH (optionnel)

### Étape 2: Vérifier l'Installation
Ouvrez une nouvelle fenêtre et tapez:
```cmd
blender --version
```
Devrait afficher: `Blender 5.0.0`

---

## Option 2: Installation Manuelle

### Étape 1: Télécharger Blender
1. Allez sur: https://www.blender.org/download/
2. Téléchargez **Blender 5.0** (Windows x64)
3. Lancez l'installateur
4. Installez dans: `C:\Program Files\Blender Foundation\Blender 5.0`

### Étape 2: Télécharger Silkroad Tools Plugin
1. Allez sur: https://github.com/szabo176/Silkroad-Online-Tools
2. Cliquez sur "Code" → "releases"
3. Téléchargez la dernière version (v4.5.3)
4. Extrayez le fichier zip

### Étape 3: Installer le Plugin
1. Copiez le dossier extrait vers:
   ```
   C:\Users\duan7\AppData\Roaming\Blender Foundation\Blender 5.0\scripts\addons\
   ```

### Étape 4: Activer le Plugin
1. Ouvrez Blender
2. Edit → Preferences → Add-ons
3. Cochez "Import-Export: Silkroad Online Tools"

---

## Option 3: Utiliser Blender Portable (Plus Rapide)

1. Télécharger: [Blender 5.0 Portable](https://download.blender.org/release/Blender5.0/blender-5.0.0-windows-x64.zip)
2. Extraire dans: `C:\Users\duan7\Desktop\SRObro\blender\`
3. Blender fonctionne directement sans installation

---

## Scripts de Conversion

Une fois Blender installé, utilisez les scripts dans `scripts/`:

### Conversion Batch
```bash
cd C:\Users\duan7\Desktop\SRObro
python scripts/blender-batch-converter.py
```

### Test Unique
```bash
python scripts/test-single-blender.py
```

---

## Validation

Une fois la conversion terminée, testez:
```bash
cd client
npm run dev
# Ouvrir: http://localhost:3000
```

---

**Note:** L'installation prendra environ 5-10 minutes selon votre connexion.

Après installation, prévenez-moi et je créerai les scripts de conversion!
