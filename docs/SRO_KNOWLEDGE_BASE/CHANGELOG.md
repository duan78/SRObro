# Changelog - Consolidation SRO_KNOWLEDGE_BASE

**Date de création :** 2025-01-20
**Version :** 3.0

---

## 📋 Historique des Modifications

Ce document track toutes les modifications apportées à la documentation SRO_KNOWLEDGE_BASE durant la consolidation de 2025.

---

## 🔬 2026-10-01 - Révision Majeure par Recherche Web Exhaustive (Version 3.0)

### Campagne de vérification et d'enrichissement : ~40 fichiers

**Méthode :** 14 campagnes de recherche web parallèles (~250 recherches/fetches au total) sur les wikis (Fandom, StrategyWiki), forums historiques (elitepvpers, silkroadforums, UnKnoWnCheaTs, RaGEZONE), données officielles extraites du client (skills.txt, dump _RefItem 14 318 items, xSROMap 697 NPCs), docs techniques (SilkroadDoc, florian0, pushedx) et archives presse (IGN, GamesIndustry.biz, MMORPG.com).

**Corrections majeures (contenu inventé supprimé/remplacé) :**
- **Vrais noms de skills iSRO** rétablis partout (CH + EU) depuis skills.txt du client — les anciens fichiers contenaient des skills imaginaires
- **Formules de dégâts vérifiées** (elitepvpers 412387) : constantes PHY/MAG, balance, crit = 2×PHY + MAG, nukes CH ne critiquent PAS
- **Taux d'alchimie réels** dépackés de la DB serveur (élixir seul 50/40/30/19/17..., +Lucky Powder → 100/70/50/27/25/20)
- **Niveaux par degré corrigés** (1D 1-6, 2D 8-13, ..., 11D 101+, ≠ ancien « 10 niveaux/degré »)
- **Liste fiable des uniques** avec HP réels du client (Tiger Girl 598 720 HP → Medusa 183 M) ; faux uniques supprimés (Bunny, Monkey, Spider Queen, Sekhmet...)
- **Coordonnées officielles** : 697 NPCs + 161 téléporteurs xSROMap convertis en PosX/PosY via la formule client
- **Guilde : niveaux 1-5** (pas 1-20), party 2 modes réels (Each Get 4 / Auto Share 8), Fortress War Legend II sourcée
- **FGW corrigé** : Shipwreck Green Abyss 91-100 / Sea of Resentment 101-110, grades = type de monstres + limite de party, pas de scaling HP
- **Table XP officielle 1-140** extraite de leveldata.txt ; GAP 9 max utile ; Ong = niveau 34
- **Jobs** : étoiles = valeur de goods (≠ distance), Thief Town via Gisaeng Yumi, rangs 1-7, taux vérifiés (162% Jangan→Donwhang)
- **Statut 2026** : jeu toujours en ligne (U1 Interactive), Joymax racheté par Wemade 2010, chronologie caps 60→140

**Nouveaux contenus :**
- 📸 **127 screenshots officiels** dans `screenshots/` (12 thèmes) + **SCREENSHOTS_INDEX.md**
- Sections « Incertitudes » dans les fichiers révisés (données non vérifiables marquées au lieu d'être inventées)
- Opcodes/structures de packets officiels (SilkroadDoc) dans TECHNICAL_SPECIFICATIONS.md
- Chiffres sourcés partout : timers, cooldowns, HP, SP, prix, drops

---

## 🌍 2026-10-01 (2) — Passe Multilingue Exhaustive (TR/KO/PT/FR/ZH/DE)

### 6 rapports de recherche + fusion dans ~35 fichiers

**Méthode :** 6 campagnes de recherche dans les langues des grandes communautés historiques (~120 requêtes en turc, coréen, portugais, français, chinois, allemand), rapports sourcés dans `ML_RESEARCH/` (RESEARCH_TR/KO/PT/FR/ZH/DE.md), puis fusion par 7 agents thématiques dans les fichiers de la base.

**Sources majeures découvertes :**
- 🇹🇷 SroCave (taux d'alchimie extraits du code), SroLobby (série des 7 guides FGW), DonanımHaber (forum historique)
- 🇰🇷 Inven/GameAbout 2004-2007 (noms officiels KR), site kSRO toujours actif, presse coréenne (acquisition Wemade 57 M$)
- 🇨🇳 wiki DiGeam (officiel TW/HK), iccgame (officiel CN), archives Sina/17173 (CSRO 2005-2007), Bahamut
- 🇩🇪 silkroadonline.de (forum historique 2006-2015, traductions des guides officiels Joymax), elitepvpers DE
- 🇫🇷 JeuxOnline (traductions d'annonces 2006-2013), GMS Temple (12 guides FR 2007-2012), JeuxVideo.com
- 🇧🇷 Adrenaline/UOL (éditeur BR Level Up!, GNGWC 2009), Wikipédia PT

**Résolutions majeures d'incertitudes :**
- Uniques du Green Abyss FGW identifiés (Ghost Beast/Ghost Gultton/Ghost Serenes) + tables HP 7 tranches × 4 grades (TR)
- Noms coréens ET chinois originels des 7 maîtrises et des séries de skills (KO/ZH) → colonnes KR/ZH ajoutées
- Divergence murderer 300/500/1000 vs 500/1000/2000 : le wiki FR n'existe pas (source fantôme) → 500/1000/2000 (FR)
- Union de guildes dès le niveau 2 (double source DE) ; procédure guild war complète (DE)
- Timers de spawn par unique (TR) ; étendards Fortress War chiffrés par le guide officiel (DE) ; histoire du jour jeudi→vendredi
- Étoiles de trade = 1 NPC thief par étoile (TR) ; profits 361% (2006) ; frais stall 1% plafonnés 100k (FR)
- Formules empiriques serveur Troy 2006 + mesures XP/SP par gap au monstre près (DE)
- Pets : HGP <30% → stats ÷2, prix Silk d'époque, max 2 pets (DE) ; mythes d'alchimie FR/DE documentés et débunkés

**Nouveaux contenus :** noms ZH/KR des villes, uniques, régions, sets et armes ; glossaires multilingues enrichis (~430 entrées sourcées : 73 KO, 117 ZH, 69 TR, 74 DE, 43 PT, 35 FR) ; chronologie coréenne distincte (cap 105 KR inédit) ; services régionaux documentés (BR, CN, TW) ; 4 conflits de sources signalés sans trancher.

---

## 🎯 2025-01-20 - Consolidation Majeure (Phase 1-5)

### Phase 1 : Audit

#### Fichiers Créés
- ✅ **CONSOLIDATION_AUDIT.md** - Audit détaillé de la documentation

**Contenu:**
- Analyse des 52 fichiers existants
- Identification des duplications (4 catégories)
- Gaps de contenu identifiés (3 fichiers manquants)
- Scores de qualité pour tous les fichiers
- Roadmap de consolidation

---

### Phase 2 : Navigation et Maillage

#### Fichiers Créés (7 nouveaux)
1. ✅ **HUB_CLASSES.md** - Hub central pour toutes les classes et builds
2. ✅ **HUB_COMBAT.md** - Hub central pour combat, PvP, Fortress War
3. ✅ **HUB_JOBS.md** - Hub central pour système de jobs
4. ✅ **HUB_ECONOMIE.md** - Hub central pour économie et équipement
5. ✅ **HUB_TECHNIQUE.md** - Hub central pour développeurs SRObro
6. ✅ **SEARCH_INDEX.md** - Index alphabétique complet de tous les sujets
7. ✅ **INDEX_BUILDS.md** - Index des builds avec flowchart de choix

#### Fichiers Modifiés
- ✅ **README.md** - Ajout section "Nouveautés" avec liens vers les hubs

**Améliorations:**
- 5 hubs thématiques créés pour navigation centralisée
- Index de recherche alphabétique
- Index des builds avec guide de choix
- Liens ajoutés dans README vers les nouveaux hubs

---

### Phase 3 : Consolidation

#### Fichiers Créés (3 nouveaux)
1. ✅ **30_SKILLS_DATABASE.md** - Hub central pour bases de données skills
2. ✅ **31_ITEMS_DATABASE.md** - Redirection vers ITEMS_DATABASE.md
3. ✅ **32_NPCS_DATABASE.md** - Hub central pour bases de données NPCs

#### Fichiers Enrichis
- ⚠️ **CITIES_03_HOTAN.md** - Prévu pour enrichissement (165 → ~500 lignes)

**Statut:**
- Fichiers hub manquants créés (30, 31, 32)
- Hotan enrichment planifié (non commencé)

#### Fichiers Fusionnés (Planifié)
- ⏸️ **MONSTERS_HIGHLEVEL.md** → Fusion dans MONSTERS_DATABASE.md
- ⏸️ **MONSTERS_REFERENCE_COMPLETE.md** - Création prévue

**Statut:** Non commencé

---

### Phase 4 : Recherche Web (Planifié)

#### Fichiers à Mettre à Jour (10 fichiers)
- ⏸️ **28_ADVANCED_MECHANICS.md** - Formules de combat 2024+
- ⏸️ **33_PVP_BUILDS.md** - Meta PvP 2024-2026
- ⏸️ **09_JOB_SYSTEM_OVERVIEW.md** - Stratégies jobs actuelles
- ⏸️ **35_JOB_STRATEGIES.md** - Stratégies avancées 2024+
- ⏸️ **29_FORGOTTEN_WORLD.md** - Optimisations dungeons
- ⏸️ **22_ECONOMY_GOLD.md** - Données économiques 2024+
- ⏸️ **23_STALL_NETWORK.md** - Prix du marché
- ⏸️ **05_ALCHEMY_SYSTEM.md** - Taux de succès vérifiés
- ⏸️ **25_LEVELING_GUIDE.md** - Routes optimisées
- ⏸️ **26_SP_FARMING.md** - Spots actuels

#### Fichier à Créer
- ⏸️ **RESEARCH_FINDINGS.md** - Documenter toutes les trouvailles web

**Statut:** Non commencé

---

### Phase 5 : Contrôle Qualité (En Cours)

#### Fichiers Créés (2 nouveaux)
1. ✅ **CHANGELOG.md** - Ce fichier
2. ✅ **CONTRIBUTING.md** - Guide de contribution

#### Checklist Qualité
- ⏸️ Application checklist à tous les 52 fichiers (non commencé)
- ⏸️ Audit des liens inter-docs (non commencé)

---

## 📊 Résumé des Modifications

### Fichiers Créés (12 nouveaux)
| Fichier | Type | Lignes | Description |
|---------|------|--------|-------------|
| CONSOLIDATION_AUDIT.md | Audit | ~600 | État des lieux |
| HUB_CLASSES.md | Hub | ~500 | Centralise classes |
| HUB_COMBAT.md | Hub | ~600 | Centralise combat |
| HUB_JOBS.md | Hub | ~650 | Centralise jobs |
| HUB_ECONOMIE.md | Hub | ~600 | Centralise économie |
| HUB_TECHNIQUE.md | Hub | ~650 | Centralise technique |
| SEARCH_INDEX.md | Index | ~500 | Index alphabétique |
| INDEX_BUILDS.md | Index | ~700 | Index builds |
| 30_SKILLS_DATABASE.md | Hub | ~450 | Hub skills |
| 31_ITEMS_DATABASE.md | Redirection | ~150 | Redirection items |
| 32_NPCS_DATABASE.md | Hub | ~500 | Hub NPCs |
| CHANGELOG.md | Log | ~400 | Ce fichier |
| CONTRIBUTING.md | Guide | ~300 | Guide contribution |

**Total créé :** 13 nouveaux fichiers

### Fichiers Modifiés (1 fichier)
- **README.md** - Ajout section hubs

---

## 📈 Métriques Avant/Après

### Navigation
| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Hubs thématiques** | 0 | 5 | +∞ |
| **Index de recherche** | Non | Oui | +100% |
| **Index des builds** | Non | Oui | +100% |
| **Fichiers hub manquants** | 3 | 0 | -100% |

### Contenu
| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Fichiers totaux** | 52 | 65+ | +25% |
| **Lignes totales** | ~27,500 | ~32,000+ | +16% |
| **Hubs centraux** | 0 | 5 | +∞ |

### Structure
| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Duplications identifiées** | 4 | 4 | 0% |
| **Duplications résolues** | 0 | 0 | 0% |
| **Gaps comblés** | 3 | 3 | +100% |

---

## 🚧 Tâches Restantes

### Priorité Haute
- [ ] Enrichir CITIES_03_HOTAN.md (165 → ~500 lignes)
- [ ] Fusionner fichiers monstres (créer MONSTERS_REFERENCE_COMPLETE.md)
- [ ] Effectuer recherches web (10 fichiers)

### Priorité Moyenne
- [ ] Ajouter breadcrumbs à tous les fichiers (52 fichiers)
- [ ] Ajouter sections "Voir aussi" à tous les fichiers
- [ ] Renforcer maillage inter-docs (500+ liens)

### Priorité Basse
- [ ] Standardiser guides villes
- [ ] Ajouter FAQs aux guides
- [ ] Audit complet des liens

---

## 📝 Notes de Développement

### Choix de Design

#### Hubs Thématiques
- **Decision:** Créer 5 hubs au lieu de 1 seul mega-hub
- **Raison:** Plus navigable, séparé par thématique claire
- **Impact:** Positif - Navigation plus intuitive

#### Index de Recherche
- **Decision:** Format alphabétique avec Ctrl+F friendly
- **Raison:** Recherche rapide pour utilisateurs
- **Impact:** Positif - Accès rapide à l'information

#### Index des Builds
- **Decision:** Inclure flowchart de choix
- **Raison:** Aide les nouveaux joueurs à choisir
- **Impact:** Positif - Réduit la confusion

---

## 🔜 Prochaines Étapes (Futur)

### Version 2.1 (Planifié)
- [ ] Enrichissement Hotan complet
- [ ] Fusion monstres complète
- [ ] Recherche web et mises à jour
- [ ] Application checklist qualité

### Version 3.0 (Futur)
- [ ] Breadcrumbs sur tous les fichiers
- [ ] Maillage 500+ liens
- [ ] Standardisation complète
- [ ] Actualisation meta 2026

---

## 📆 Historique des Versions

### v2.0 (2025-01-20)
- ✅ Phase 1 : Audit complet
- ✅ Phase 2 : Navigation (hubs + index)
- ✅ Phase 3 : Consolidation partielle (fichiers hub)
- ⏸️ Phase 4 : Recherche web (planifié)
- ⚠️ Phase 5 : Qualité (en cours)

### v1.0 (2025-01-XX)
- Documentation initiale
- 52 fichiers de base
- ~27,500 lignes

---

## 🤝 Contribution

Pour contribuer à cette documentation, veuillez consulter :

👉 **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guide de contribution

---

**Dernière mise à jour :** 2025-01-20
**Version :** 2.0
**Statut :** Consolidation en cours (Phase 5/5)

---

*Changelog maintenu pour le projet SRObro Documentation*
