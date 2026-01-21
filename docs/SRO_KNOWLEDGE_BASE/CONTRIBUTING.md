# Guide de Contribution - SRO_KNOWLEDGE_BASE

**Date de création :** 2025-01-20
**Version :** 1.0

---

## 📋 Comment Contribuer

Ce guide explique comment contribuer à la documentation SRO_KNOWLEDGE_BASE pour le projet SRObro.

---

## 🎯 Types de Contributions

### 1. Corrections
- ✏️ Corriger des erreurs factuelles
- ✏️ Corriger la grammaire et l'orthographe
- ✏️ Corriger les liens brisés
- ✏️ Mettre à jour des informations obsolètes

### 2. Ajouts de Contenu
- ➕ Ajouter des sections manquantes
- ➕ Ajouter des FAQs
- ➕ Ajouter des exemples de code
- ➕ Ajouter des coordonnées
- ➕ Ajouter des images/screenshots

### 3. Améliorations
- 🔄 Améliorer la structure
- 🔄 Améliorer le maillage inter-docs
- 🔄 Standardiser le formatage
- 🔄 Améliorer la clarté

### 4. Traductions
- 🌐 Traduire en anglais
- 🌐 Traduire en d'autres langues

---

## 📐 Standards de Formatage

### Structure de Fichier

#### En-tête Standard
```markdown
# Titre du Fichier

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Catégorie](LINK.md) → [Fichier Actuel](CURRENT.md)

---

## 📋 Table des Matières
- [Introduction](#introduction)
- [Section 1](#section-1)
- [Section 2](#section-2)
- ...

---

## 🎯 Introduction

[Bref description du contenu]

---

[Contenu principal]

---

## 📚 Voir aussi

### Connexes
- [Lien 1](FILE.md) - Description
- [Lien 2](FILE.md) - Description

---

**Dernière mise à jour :** YYYY-MM-DD
**Nom du Fichier** - Description courte
```

---

### Sections Obligatoires

#### 1. Table des Matières
- ✅ Avec ancres Markdown
- ✅ Maximum 3 niveaux de profondeur

#### 2. Introduction
- ✅ Description du contenu
- ✅ Points clés (listes)

#### 3. Contenu Principal
- ✅ H2 pour sections principales
- ✅ H3 pour sous-sections
- ✅ H4 pour détails (rare)

#### 4. "Voir aussi"
- ✅ Minimum 3 liens
- ✅ Liens bidirectionnels
- ✅ Descriptions courtes

---

### Règles de Formatage

#### Titres
```markdown
# H1 - Une seule fois (titre fichier)
## H2 - Sections principales
### H3 - Sous-sections
#### H4 - Détails (rare)
```

#### Listes
```markdown
- **Élément** - Description
- **Élément** - Description
```

#### Tableaux
```markdown
| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
| Donnée 1 | Donnée 2 | Donnée 3 |
```

#### Blocs de Code
```markdown
```typescript
// Code ici
```
```

#### Emojis
- ✅ Utiliser les emojis de la liste standard
- ✅ Être cohérent dans tout le fichier

---

## 📝 Liste d'Emojis Standard

### Navigation
- 📍 Position
- 📚 Ressources
- 🔍 Recherche
- ➡️ Suite

### Importance
- ⭐ Important
- ⚠️ Attention
- ❌ Problème
- ✅ Correct
- 🔥 Urgent

### Types
- 🎮 Gameplay
- ⚔️ Combat
- 💰 Économie
- 🛒 Commerce
- 💻 Technique

### États
- 📝 Planifié
- ✅ Complété
- ⏸️ En pause
- 🚧 En cours

---

## 🔗 Maillage Inter-Documents

### Règles de Liens

#### Liens Sortants
- ✅ **Minimum 3 liens** dans section "Voir aussi"
- ✅ **Liens pertinents** avec le contenu
- ✅ **Descriptions courtes** pour chaque lien

#### Liens Entrants
- ✅ **Liens bidirectionnels** (si A lie vers B, B doit lier vers A)
- ✅ **Vérifier** que les liens fonctionnent

#### Liens Internes
```markdown
- Relatif: [Fichier](FILE.md)
- Avec ancre: [Fichier](FILE.md#section)
- Externe: [Site](https://example.com)
```

---

### Exemple de Section "Voir aussi"

```markdown
---

## 📚 Voir aussi

### Guides Connexes
- [Système de Combat](04_COMBAT_SYSTEM.md) - Mécaniques de base
- [Mécaniques Avancées](28_ADVANCED_MECHANICS.md) - Formules détaillées

### Builds Recommandés
- [Builds PvP](33_PVP_BUILDS.md#builds-chinois) - Tier list PvP
- [Builds PvE](34_PVE_BUILDS.md#farming) - Farming optimisé

### Ressources Techniques
- [Hub Classes](HUB_CLASSES.md) - Centralise classes
- [Skills Database](SKILLS_DATABASE_CHINESE.md) - Skills complets

---
```

---

## ✅ Checklist de Qualité

### Avant de Soumettre

#### Contenu
- [ ] Le contenu est factuellement correct
- [ ] Le contenu est à jour (2024-2026 si applicable)
- [ ] Les informations sont complètes
- [ ] Pas de duplications inutiles

#### Formatage
- [ ] Structure respectée (H1, H2, H3)
- [ ] Table des matières présente
- [ ] Introduction présente
- [ ] Section "Voir aussi" avec 3+ liens
- [ ] Emojis cohérents
- [ ] Code correctement formaté

#### Maillage
- [ ] Liens vers 3+ fichiers connexes
- [ ] Liens bidirectionnels vérifiés
- [ ] Ancres fonctionnelles

#### Technique
- [ ] Code TypeScript valide (si applicable)
- [ ] SQL correct (si applicable)
- [ ] Indentation cohérente

---

## 🚀 Processus de Contribution

### Méthode 1 : Édition Directe

1. **Lire le fichier** existant
2. **Faire les modifications** avec l'outil Edit
3. **Vérifier** les changements
4. **Sauvegarder** le fichier

### Méthode 2 : Suggestion

1. **Ouvrir une issue** avec :
   - Titre clair
   - Fichier concerné
   - Description des changements
   - Raison de la modification

2. **Attendre review** par l'équipe

3. **Discuter** si nécessaire

---

## 📂 Organisation des Fichiers

### Structure des Dossiers

```
SRObro/
└── docs/
    └── SRO_KNOWLEDGE_BASE/
        ├── README.md                    # Point d'entrée
        ├── CONSOLIDATION_AUDIT.md       # Audit
        ├── CHANGELOG.md                 # Modifications
        ├── CONTRIBUTING.md              # Ce fichier
        ├── SEARCH_INDEX.md              # Index
        │
        ├── HUB_*.md                     # Hubs thématiques
        ├── INDEX_*.md                   # Index thématiques
        │
        ├── 01-*.md                      # Fondamentaux
        ├── 02-*.md
        ├── ...
        ├── 38-*.md
        │
        ├── CITIES_*.md                  # Villes
        ├── MONSTERS_*.md                # Monstres
        ├── NPCS_*.md                    # NPCs
        ├── MAP_*.md                     # Cartes
        │
        └── DEVELOPMENT_*.md             # Technique
```

---

## 🌐 Mises à Jour de Contenu

### Recherche Web

Si vous ajoutez des informations issues de recherche web :

1. **Documenter la source**
   - Ajouter section "Sources" à la fin
   - Inclure URL et date d'accès

2. **Vérifier la crédibilité**
   - Privilégier les sources officielles
   - Croiser les informations
   - Mentionner si non confirmé

3. **Marquer le contenu**
   ```markdown
   > ✅ **Vérifié** - Données confirmées par plusieurs sources (2025)
   > ⚠️ **À vérifier** - La communauté suggère des changements possibles
   > ❌ **Obsolète** - Cette information n'est peut-être plus exacte
   ```

---

## 💻 Code et Implémentation

### TypeScript

#### Formatage
```typescript
// Toujours typer
interface Example {
  name: string;
  value: number;
}

// Commenter le complexe
function complexFunction(input: string): Output {
  // Step 1: Process input
  const processed = input.trim();

  // Step 2: Transform
  const result = transform(processed);

  return result;
}
```

### SQL

#### Formatage
```sql
-- Toujours commenter
CREATE TABLE example (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 Images et Médias

### Screenshots
- ✅ **Format:** PNG ou JPEG
- ✅ **Taille:** < 2MB
- ✅ **Nom:** descriptif (ex: `hotan-npc-locations.png`)
- ✅ **Placement:** Dans section appropriée

### Schémas
- ✅ Utiliser ASCII art pour les schémas simples
- ✅ Utiliser Mermaid pour les flowcharts

---

## 📧 Contact

### Questions
- 📧 Email : [à définir]
- 💬 Discord : [à définir]
- 🐙 Issues : [GitHub Issues](https://github.com/anthropics/srobro/issues)

---

## 🤝 Reconnaissance

Toutes les contributions sont reconnues dans le fichier **CONTRIBUTORS.md** (à créer).

### Format
```markdown
## Contributeurs

- **Pseudo** - Contributions (2025-01)
- **Pseudo** - Traduction anglaise (2025-02)
```

---

## 📜 Licence

En contribuant à cette documentation, vous acceptez que :

1. Vos contributions soient publiées sous la même licence que le projet
2. Vos contributions puissent être modifiées par d'autres
3. Vous conservez la paternité de vos contributions

---

**Merci de contribuer à SRObro ! 🎮**

---

**Dernière mise à jour :** 2025-01-20
**Version :** 1.0

---

*Guide de contribution - SRObro Documentation Project*
