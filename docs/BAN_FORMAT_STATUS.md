# BAN Format - Status et Prochaines Étapes

**Date :** 21 janvier 2026
**Statut :** Format partiellement compris, nécessite recherche supplémentaire

---

## 📊 Résumé

### Ce que nous savons ✅

1. **Header BAN** (32+ bytes)
   - Signature: "JMXVBAN" (8 bytes)
   - Version: 1 byte (souvent 48 = 0x30 en ASCII, '0')
   - Frame count: 4 bytes
   - Animation name: string null-terminated

2. **Noms d'os**
   - Trouvés avec succès dans les fichiers
   - Format: String null-terminated
   - Exemples: "Bone10_LRoom", "Bone07", "Bone08"

3. **Table des offsets**
   - Commence à 0x28
   - Contient des offsets vers les données d'os
   - Terminée par 0x0000

### Ce qui ne fonctionne pas encore ❌

1. **Extraction des keyframes**
   - Le format des keyframes n'est pas un simple tableau de floats
   - Les valeurs lues semblent corrompues ou encodées
   - Possibles raisons:
     - Compression des données
     - Encodage binaire différent (int16 vs float32)
     - Delta encoding par rapport à une pose de base
     - Format propriétaire JoyMax

---

## 🔬 Tests Effectués

### Test 1: 32-byte keyframes (Hypothèse initiale)
**Résultat:** ❌ Échec
- Lecture de position (3 floats) + rotation quaternion (4 floats)
- Valeurs invalides: NaN, Infinity, nombres extrêmement grands

### Test 2: 16-byte keyframes
**Résultat:** ❌ Échec
- Seulement 4 patterns valides sur 100 testés
- Format incorrect

### Test 3: Analyse hex brute
**Résultat:** 🔍 Pattern répétitif trouvé
- Les données après les noms d'os montrent un pattern
- Le pattern se répète mais avec des valeurs qui ne sont pas des floats valides
- Possibilité de données compressées ou encodées

---

## 💡 Prochaines Étapes Suggérées

### Option 1: Reverse Engineering depuis le Client (Recommandé)

**Approche:**
- Analyser le client Silkroad Online (SRO_CLIENT.EXE)
- Chercher les fonctions de chargement BAN
- Désassembler les fonctions pour comprendre le format
- Utiliser des outils comme IDA Pro, Ghidra, ou x64dbg

**Avantages:**
- Solution définitive et complète
- Compréhension exacte du format
- Peut révéler des détails non documentés

**Inconvénients:**
- Nécessite des compétences en reverse engineering
- Assez complexe et chronophage

### Option 2: Analyse de Code Source d'Émulateur

**Approche:**
- Étudier le code source d'émulateurs Silkroad (ex: skrillax, Phoenix)
- Chercher les fonctions de parsing BAN
- Adapter le code pour notre projet

**Avantages:**
- Code déjà disponible et testé
- Plus simple que le reverse engineering

**Inconvénients:**
- Peut ne pas être 100% compatible avec notre format
- Nécessite de comprendre l'architecture de l'émulateur

### Option 3: Utiliser Animations Procédurales (Actuel)

**Approche:**
- Créer des animations procédurales en TypeScript
- Utiliser les os des squelettes GLB
- Générer des animations simples (idle, walk, attack)

**Avantages:**
- Fonctionne immédiatement
- Permet de tester le skinning
- Code propre et maintenable

**Inconvénients:**
- Animations moins riches que les originales
- Ne préserve pas les animations authentiques du jeu

### Option 4: Format d'Animation Alternatif

**Approche:**
- Utiliser un format d'animation standard (FBX, glTF animations)
- Créer les animations dans Blender
- Exporter vers Babylon.js

**Avantages:**
- Format documenté et standard
- Outils professionnels disponibles
- Meilleure qualité visuelle

**Inconvénients:**
- Ne préserve pas les animations originales
- Nécessite de recréer toutes les animations

---

## 🎯 Recommandation Actuelle

**Implémenter Option 3 + Option 2 en parallèle:**

### Court Terme (Cette Semaine)
1. ✅ Utiliser les animations procédurales pour tester le skinning
2. ✅ Valider que les GLB fonctionnent correctement
3. 🔬 Commencer l'analyse du code d'émulateurs

### Moyen Terme (Ce Mois)
1. 📖 Étudier le code source de skrillax/Phoenix
2. 🔧 Implémenter un parseur BAN basé sur les findings
3. 🧪 Tester avec les fichiers BAN réels

### Long Terme (Si nécessaire)
1. 🔍 Reverse engineering du client si Option 2 échoue
2. 🎨 Créer des animations custom en Blender (Option 4)

---

## 📁 Fichiers Créés

### Analyse BAN
- `scripts/analyze-ban-simple.ts` - Premier analyseur
- `scripts/analyze-ban-final.ts` - Analyseur fonctionnel pour les noms
- `scripts/analyze-ban-complete.ts` - Tentative de classe (échec)
- `scripts/analyze-ban-robust.ts` - Analyseur robuste
- `scripts/convert-ban-to-babylon.ts` - Convertisseur (incomplet)

### Documentation
- `docs/BAN_FORMAT_DOCUMENTATION.md` - Documentation technique du format
- `docs/BAN_FORMAT_STATUS.md` - Ce fichier

### Client
- `client/src/systems/ProceduralAnimationManager.ts` - Animations procédurales

---

## 🔬 Données Techniques

### Fichiers BAN Analysés

1. **flame_lroom_mid.ban**
   - Taille: 10,216 bytes
   - Os trouvés: 16 (Bone10_LRoom, Bone10_00, etc.)
   - Emplacement: `assets/data_extracted/prim/skel/dun/property/flame/lroom/`

2. **ruin_takla_edimmu1.ban**
   - Taille: 36,348 bytes
   - Os trouvés: 5 (Bone07, Bone08, Bone01-03)
   - Emplacement: `assets/data_extracted/prim/skel/nature/ruins/`

### Pattern Observé

```
[Bone Name][0x00][Données keyframes?][Prochain os]
```

**Exemple concret (Bone10_LRoom):**
```
0x005F: "Bone10_LRoom"
0x006C: 0x00 (null terminator)
0x006D-0x012C: Données (pattern répétitif mais non décodé)
0x0153: "Bone10_00" (os suivant)
```

---

## 💻 Code de Référence

### Émulateurs Silkroad à Consulter

1. **skrillax** (Rust)
   - GitHub: https://github.com/release0/skrillax
   - Chercher: "BAN", "animation", "keyframe"

2. **Phoenix** (C#)
   - Rechercher le code source
   - Fonctions de parsing d'assets

3. **Silkroad Online Forums**
   - JoyMax format documentation
   - Community reverse engineering threads

---

## 📞 Contact et Ressources

**Pour continuer la recherche:**
1. Consulter les forums Silkroad Online
2. Lire la documentation de glTF 2.0
3. Étudier le code de Babylon.js Animation

**Ressources utiles:**
- [glTF 2.0 Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
- [Babylon.js Animation Documentation](https://doc.babylonjs.com/features/featuresDeepDive/animation)
- [Silkroad Online Research](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/)

---

**Document créé le:** 21 janvier 2026
**Version:** 1.0
**Projet:** SRObro
