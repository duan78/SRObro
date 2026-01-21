# Système de Basculage de Langue - SRObro Documentation

## 🌐 Language Switch System

Ce fichier explique comment basculer entre les versions française et anglaise de la documentation.

---

## 📋 Table des Matières
- [Système de Basculage](#système-de-basculage)
- [Structure des Fichiers](#structure-des-fichiers)
- [Comment Contribuer](#comment-contribuer)
- [Statut de Traduction](#statut-de-traduction)

---

## 🔄 Système de Basculage

### Navigation entre les langues

Chaque fichier de documentation contient maintenant des liens pour basculer entre les versions française et anglaise :

```markdown
🌐 [English Version](../en/DATABASE_STRUCTURE.md) | [Version Française](../fr/DATABASE_STRUCTURE.md)
```

### Exemple d'intégration

Dans chaque fichier, ajoutez en haut :

```markdown
# Base de Données - Structure

🌐 [English Version](../en/DATABASE_STRUCTURE.md) | [Version Française](../fr/DATABASE_STRUCTURE.md)

---

## Database Structure - English

🌐 [English Version](../en/DATABASE_STRUCTURE.md) | [Version Française](../fr/DATABASE_STRUCTURE.md)
```

---

## 🏗️ Structure des Fichiers

### Organisation actuelle

```
docs/
├── fr/                    # Documentation française
│   ├── DATABASE_STRUCTURE.md
│   ├── NETWORK_PROTOCOL.md
│   └── ... (tous les fichiers)
│
└── en/                    # Documentation anglaise (à créer)
    ├── DATABASE_STRUCTURE.md
    ├── NETWORK_PROTOCOL.md
    └── ... (fichiers traduits)
```

### Fichiers Prioritaires pour la Traduction

1. **Fichiers Techniques Principaux**
   - DATABASE_STRUCTURE.md
   - NETWORK_PROTOCOL.md
   - PACKET_STRUCTURE.md

2. **Fichiers de Base de Connaissances**
   - 30_SKILLS_DATABASE.md
   - 31_ITEMS_DATABASE.md
   - 32_NPCS_DATABASE.md

3. **Guides des Villes**
   - CITIES_01_JANGAN.md
   - CITIES_02_DONWHANG.md
   - CITIES_03_HOTAN.md

---

## 🤝 Comment Contribuer

### Processus de Traduction

1. **Fork** le projet
2. **Créez une branche** `translation/en-[filename]`
3. **Traduisez** le fichier en utilisant la structure existante
4. **Ajoutez** les liens de basculage de langue
5. **Soumettez** une Pull Request

### Règles de Traduction

- **Conservez** la structure Markdown originale
- **Maintenez** les mêmes titres et sections
- **Traduisez** uniquement le contenu, pas le code
- **Ajoutez** les liens de basculage en haut
- **Testez** les liens avant de soumettre

### Outils Recommandés

- **DeepL** pour la traduction initiale
- **Grammarly** pour la révision
- **Markdownlint** pour la validation
- **VS Code** avec extensions Markdown

---

## 📊 Statut de Traduction

### Progression Actuelle

| Fichier | Statut | Traducteur | Date Cible |
|---------|--------|------------|------------|
| DATABASE_STRUCTURE.md | ❌ Non commencé | - | - |
| NETWORK_PROTOCOL.md | ❌ Non commencé | - | - |
| PACKET_STRUCTURE.md | ❌ Non commencé | - | - |
| 30_SKILLS_DATABASE.md | ❌ Non commencé | - | - |
| 31_ITEMS_DATABASE.md | ❌ Non commencé | - | - |
| 32_NPCS_DATABASE.md | ❌ Non commencé | - | - |

### Priorités

1. **Fichiers techniques** (pour les développeurs)
2. **Fichiers de base de connaissances** (pour les joueurs)
3. **Guides des villes** (pour la navigation)
4. **Documentation avancée** (pour les experts)

---

## 🎯 Prochaines Étapes

### Phase 1: Préparation (1-2 semaines)
- [ ] Créer la structure `docs/en/`
- [ ] Définir les règles de traduction
- [ ] Configurer les outils de traduction
- [ ] Recruter des traducteurs volontaires

### Phase 2: Traduction (4-6 semaines)
- [ ] Traduire les fichiers techniques
- [ ] Traduire les fichiers de base de connaissances
- [ ] Traduire les guides des villes
- [ ] Revoir et corriger les traductions

### Phase 3: Intégration (1-2 semaines)
- [ ] Ajouter les liens de basculage
- [ ] Tester la navigation
- [ ] Corriger les erreurs
- [ ] Documenter le système

### Phase 4: Maintenance (Continue)
- [ ] Mettre à jour les traductions
- [ ] Ajouter de nouveaux fichiers
- [ ] Améliorer les traductions existantes
- [ ] Recruter de nouveaux traducteurs

---

## 🔗 Liens Utiles

### Outils de Traduction
- **DeepL Translator** : [deepl.com/translator](https://www.deepl.com/translator)
- **Google Translate** : [translate.google.com](https://translate.google.com)
- **Linguee** : [linguee.com](https://www.linguee.com)

### Ressources Markdown
- **Markdown Guide** : [markdownguide.org](https://www.markdownguide.org)
- **Markdown Cheatsheet** : [github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Communautés de Traduction
- **Translators Cafe** : [translatorscafe.com](https://www.translatorscafe.com)
- **ProZ** : [proz.com](https://www.proz.com)

---

**Dernière mise à jour** : 2025-01-20
**Statut** : Planification initiale
**Prochaine étape** : Création de la structure `docs/en/`

---

*Ce système permettra une documentation multilingue complète pour le projet SRObro*