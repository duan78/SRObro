# 🚀 Checklist - Extraction PK2 Editor

Suivez ces étapes dans l'ordre :

## ✅ Étape 1: Télécharger PK2 Editor

**Recherchez sur Internet :**
- Google: "pk2editor github download"
- Ou allez directement: `https://github.com/eggmundsen/pk2editor/releases`

**Téléchargez :**
- `pk2_editor.zip` (ou similaire)
- Enregistrez dans: `C:\Users\duan7\Desktop\SRObro\tools\pk2editor\`

**Extraire :**
- Clic droit sur le ZIP → "Extraire ici..."
- Crée le dossier avec les fichiers EXE

---

## ✅ Étape 2: Lancer PK2 Editor

1. Double-cliquez sur `PK2_Editor.exe`
2. Clic **File** → **Open**
3. Naviguez vers:
   ```
   C:\Program Files (x86)\Silkroad\
   ```
4. Sélectionnez `Media.pk2`
5. Clic **Ouvrir**

---

## ✅ Étape 3: Extraire les Assets

### Dans PK2 Editor :

1. **Déplier l'arborescence** et cherchez:
   - `Character/` → Cochez `CH_Man` ou `CH_Woman` (pour tester)
   - `Mob/` → Cochez `CH_Mob` (pour tester)

2. **Clic "Extract To..."**

3. **Choisissez le dossier:**
   ```
   C:\Users\duan7\Desktop\SRObro\assets\pk2_extracted\
   ```

4. **Clic OK** et attendez (patience ! ⏱️)

---

## ✅ Étape 4: Vérifier l'Extraction

Une fois terminé, lancez :

```bash
cd C:\Users\duan7\Desktop\SRObro
node scripts/verify-pk2-extraction.ts
```

Ce script vérifiera :
- ✅ Dossier créé
- ✅ Nombre de fichiers extraits
- ✅ Format des fichiers (doit être BSR, pas XMX)

---

## ✅ Étape 5: Me Prévenir !

Une fois l'extraction terminée et vérifiée, **revenez me voir** !

Je vais :
1. ✅ Analyser les vrais fichiers BSR/BMS
2. ✅ Tester la conversion avec Blender
3. ✅ Valider que le skinning fonctionne
4. ✅ Convertir un échantillon de personnages/mobs

---

## 🎯 Objectif Final

Obtenir des fichiers comme :
```
✅ curse_fire_01.BMS  (format BMS standard)
✅ char_ch_man_001.BSR (format BSR standard)
```

Au lieu de :
```
❌ curse_fire_01.BMS (format XMX compressé)
❌ JMXVBMS...
```

---

## ⏱️ Temps Estimé

- Téléchargement PK2 Editor: ~5 minutes
- Extraction (dossier test): ~10 minutes
- Vérification: ~1 minute

**Total: ~15-20 minutes** ⏰

---

## 🔧 En Cas de Problème

Si PK2 Editor ne s'ouvre pas:
```
1. Installez .NET Framework 4.7.2+
2. Lancez en mode "Compatibilité" (clic droit → Propriétés)
```

Si extraction échoue:
```
1. Vérifiez 2-3 GB d'espace libre
2. Copiez Media.pk2 sur le bureau d'abord
3. Essayez d'extraire juste UN dossier à la fois
```

---

**Commencez par l'Étape 1 et revenez me voir quand c'est fait !** 🚀

Je serai prêt à continuer avec l'analyse et la conversion !
