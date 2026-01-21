# 🚀 Convertisseur Rust vs Blender - Comparaison

## Performance Attendue

### Blender (actuel - très lent)
- **Vitesse:** ~3 fichiers/minute
- **Temps par fichier:** ~20-90 secondes
- **Overhead:** Lancer Blender pour chaque fichier
- **Temps total pour 17,599 fichiers:** ~100 heures (4-5 jours)

### Rust (nouveau - ultra-rapide)
- **Vitesse estimée:** ~100-300 fichiers/minute
- **Temps par fichier:** ~0.2-0.6 secondes
- **Overhead:** Aucun (binaire natif)
- **Temps total estimé:** **1-3 heures!** ⚡

## Amélioration: **50-100x plus rapide!** 🎉

## Pourquoi le Rust est tellement plus rapide?

1. **Pas de Blender à lancer**
   - Blender: Process lourd à démarrer pour chaque fichier
   - Rust: Un seul processus léger

2. **Parsing binaire natif**
   - Blender: Python → API Blender → Parsing interne
   - Rust: Lecture directe binaire ultra-optimisée

3. **Parallélisation efficace**
   - Blender: Limité par le nombre de processus Blender
   - Rust: Rayon utilise tous les CPU cores efficacement

4. **Allocation mémoire optimisée**
   - Blender: Overheads Python/C++
   - Rust: Zéro allocation inutile

5. **Compilation native**
   - Blender: Interprété Python + appel API
   - Rust: Code machine optimisé par LLVM

## Résultats Attendus

### Avec Blender (4-5 jours):
```
831 fichiers en ~6 heures
→ 17,599 fichiers en ~100 heures
```

### Avec Rust (1-3 heures):
```
831 fichiers en ~2-3 minutes ⚡
→ 17,599 fichiers en ~1-2 heures 🔥
```

## Utilisation

Une fois compilé:

```bash
# Arrêter la conversion Blender (tuez les processus)
# Puis utiliser le convertisseur Rust:

cd C:/Users/duan7/Desktop/SRObro/tools/rust-jmx-converter

# Convertir tous les fichiers
./target/release/jmx_converter \
  --input "../../assets/data_extracted" \
  --output "../../assets/glb_rust"

# Convertir avec 16 threads
./target/release/jmx_converter \
  --input "../../assets/data_extracted" \
  --output "../../assets/glb_rust" \
  --threads 16

# Convertir seulement les personnages (plus rapide pour tester)
./target/release/jmx_converter \
  --input "../../assets/data_extracted" \
  --output "../../assets/glb_rust" \
  --filter "**/avatar_*.bms"
```

## Recommandation

1. **Laisser Blender finir** les 831 fichiers en cours (presque 5%)
2. **Compiler le Rust** (en cours)
3. **Utiliser Rust** pour les 16,768 fichiers restants
4. **Résultat:** Tout converti en ~2-3 heures au lieu de 100 heures!

---

**Date:** 21 janvier 2026
**Statut Blender:** 831/17,599 (4.72%) - EN COURS
**Statut Rust:** Compilation en cours - PRESQUE PRÊT ⚡
