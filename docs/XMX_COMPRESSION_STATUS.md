# 🔴 XMX COMPRESSION - BLOCQUEUR CRITIQUE

## 📊 État Actuel

### ✅ Accompli
1. **Extraction PK2** - pk2_mate fonctionne parfaitement
   - Data.pk2 extrait: 43,598 fichiers
   - Temps: ~3 minutes
   - Erreurs: 0

2. **Structure découverte**:
   - 17,599 fichiers BMS
   - Localisation: `prim/mesh/avatar/`, `prim/mesh/char/`, `prim/mesh/mob/`

### ❌ Blocqueur Critique: XMX COMPRESSION

**Découverte:**
```
Magic: JMXV → JoyMax XMX Compression Format
```

**Impact:**
- Les fichiers BMS sont **compressés**
- Impossible de lire les meshs/skeletons directement
- Pas de données de skinning accessibles

---

## 🔍 Analyse Technique

### Fichier Test: `avatar_m_nasrun.bms`

```
Size: 113,734 bytes (111 KB)
Magic: b'JMXV' (position 0)
Version: 542330178 (encodé)
```

### Conséquence

```python
# Structure d'un fichier BMS compressé:
[header: JMXV]
[compressed data block]
[footer/checksum]

# Au lieu de:
[mesh data]
[skeleton data]
[animation data]
```

---

## 🎯 Solutions Possibles

### Option 1: Trouver Code de Décompression XMX

**Sources potentielles:**
- Émulateurs Silkroad (DarkEmu, sro-emulator)
- Clients Silkroad open-source
- Tools communautaires (Noesis, x360ce)

**Recherche en cours:**
- GitHub: CarlosX/DarkEmu
- Forums: elitepvpers, ragezone

### Option 2: Reverse Engineering XMX

**Approche:**
1. Analyser le client Silkroad pour trouver la routine de décompression
2. Extraire le code avec IDA Pro/Ghidra
3. Recréer l'algorithme en Python

**Complexité:** Élevée
**Temps estimé:** 1-2 semaines

### Option 3: Utiliser Outil Existant

**Outils potentiels:**
- **Noesis** (richwhitehouse.com) - Supporte beaucoup de formats 3D
- **SROExtractor** - Outil communautaire
- **x360ce** - Convertisseur de formats

### Option 4: Alternative - Extraction Différente

**Stratégie:**
- Trouver une version de Silkroad avec BMS non compressés
- Utiliser Media.pk2 differently (peut-être dans un autre dossier)
- Chercher dans les autres fichiers PK2 (Map.pk2, Particles.pk2)

---

## 📋 Recherche Active

### GitHub - Dépôts Silkroad

1. **DarkEmu** (CarlosX)
   - Émulateur Silkroad
   - Peut contenir code décompression XMX
   - Langage: C#, C, C++

2. **sro-emulator** (divers forks)
   - Plusieurs versions sur GitHub
   - Code source analysable

### Documentation

- **Noesis** (formats supported)
- **x360ce** (conversion tools)
- **elitepvpers.com** (Silkroad section)

---

## 🔬 Plan d'Action

### Immédiat (Priority 1)

1. **Chercher dans DarkEmu**
   ```bash
   git clone https://github.com/CarlosX/DarkEmu
   grep -r "JMXV\|XMX\|decompress" --include="*.cs" --include="*.cpp"
   ```

2. **Chercher dans le client Silkroad**
   - Ouvrir `sro_client.exe` dans IDA/Ghidra
   - Chercher les strings "JMXV", "XMX", "decompress"
   - Localiser la routine de décompression

3. **Tester Noesis**
   - Télécharger Noesis depuis richwhitehouse.com
   - Essayer d'ouvrir `avatar_m_nasrun.bms`
   - Vérifier s'il peut exporter vers un format lisible

### Court Terme (Priority 2)

4. **Analyser format XMX**
   - Lire la documentation existante
   - Comparer avec d'autres formats de compression
   - Identifier l'algorithme (zlib? lz4? custom?)

5. **Créer décompresseur Python**
   - Si l'algorithme est identifié
   - Implémenter en Python
   - Tester sur fichiers BMS

### Long Terme (Priority 3)

6. **Fallback: Utiliser fichiers alternatifs**
   - Chercher PK2 d'autres versions Silkroad
   - Essayer ISRO vs VSRO vs CSRO
   - Trouver version avec BMS non compressés

---

## 📊 Progression

| Étape | Statut | Blocqueur |
|-------|---------|-----------|
| 1. Extraction PK2 | ✅ 100% | None |
| 2. Localisation BMS | ✅ 100% | None |
| 3. Analyse Format | ✅ 100% | None |
| 4. Décompression XMX | ❌ 0% | **Algorithme inconnu** |
| 5. Parsing BMS | ⏸️ | Attend décompression |
| 6. Conversion GLB | ⏸️ | Attend décompression |

---

## 🆘 Besoin d'Aide

**Recherche active de:**
- Code source pour décompression XMX
- Documentation format XMX
- Outils pouvant ouvrir les fichiers BMS JMXV
- Contact avec communauté Silkroad (elitepvpers)

---

## 📝 Notes

### Ce que nous savons:

1. ✅ pk2_mate fonctionne parfaitement (CLI 100% fonctionnel)
2. ✅ Extraction réussie de Data.pk2
3. ✅ Fichiers BMS localisés
4. ❌ BMS compressés avec JMXV

### Ce que nous ne savons pas:

1. ❌ Algorithme de compression XMX
2. ❌ Comment décompresser JMXV
3. ❌ Si des versions non compressées existent
4. ❌ Si Noesis peut lire ces fichiers

---

**Date:** 2026-01-20 23:45
**Statut:** 🔴 BLOQUÉ PAR XMX COMPRESSION
**Priorité:** CRITIQUE
