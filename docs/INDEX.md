# SRObro Documentation - Index Principal

## 🌍 Bienvenue dans la Documentation Multilingue

Ce fichier sert de point d'entrée principal pour la documentation SRObro. Choisissez votre langue préférée pour accéder à la documentation complète.

---

## 📚 Documentation par Langue

### Français 🇫🇷

Accédez à la documentation complète en français :

- [Documentation Technique Française](./fr/README_FR.md)
- [Base de Connaissances SRO](./SRO_KNOWLEDGE_BASE/README.md)

### English 🇬🇧

English documentation will be available soon:

- [English Technical Documentation](./en/README_EN.md) (Coming Soon)
- [SRO Knowledge Base](./SRO_KNOWLEDGE_BASE/README.md) (Partial Translation)

---

## 🔄 Système de Basculage de Langue

### Comment basculer entre les langues

Chaque fichier de documentation contient des liens pour basculer entre les versions française et anglaise :

```markdown
🌐 [English Version](../en/FILENAME.md) | [Version Française](../fr/FILENAME.md)
```

### Structure des Fichiers

```
docs/
├── INDEX.md                    # Ce fichier
├── fr/                         # Documentation française
│   ├── *.md                    # Tous les fichiers français
│   └── README_FR.md           # Point d'entrée français
│
├── en/                         # Documentation anglaise
│   ├── *.md                    # Fichiers anglais (à traduire)
│   └── README_EN.md           # Point d'entrée anglais
│
└── SRO_KNOWLEDGE_BASE/        # Base de connaissances (bilingue)
    ├── fr/                     # Fichiers français
    └── en/                     # Fichiers anglais (à créer)
```

---

## 📋 Table des Matières

### Jeu & audits (V3 finalisée)

- **[Audit final V3](./audit/AUDIT_FINAL_V3.md)** — preuves critère par critère
  (suites 22/22 + 24/24, FW Eastern Europe de bout en bout, Job Temple
  advanced jusqu'à Seth, 3 clients + kill serveur → reconnexion 0,1 s,
  83 FPS). Films : `demo_final_v3.webm`.
- **[Audit V2](./audit/AUDIT_FINAL_V2.md)** ·
  [Audit V1](./audit/AUDIT_FINAL.md) ·
  [Transcription session filmée V2](./audit/AUDIT_FILME_V2_TRANSCRIPT.log)
- [Cahier des charges V3 (racine)](../PROMPT_MAITRE_V3.md) ·
  [V2](../PROMPT_MAITRE_V2.md) · [V1](../PROMPT_MAITRE.md) ·
  [Avancement](../Avancement.md)
- Suites de tests : `server/scripts/test-phase*.ts`, `test-audit-v3.ts`,
  `test-phaseH-finalaudit.ts` (lancées via `npx tsx` sur le serveur de dev)

### Documentation Technique

#### Français
- [Structure de la Base de Données](./fr/DATABASE_STRUCTURE.md)
- [Protocole Réseau](./fr/NETWORK_PROTOCOL.md)
- [Structure des Packets](./fr/PACKET_STRUCTURE.md)
- [Architecture Client-Serveur](./fr/SERVER_CLIENT_ARCHITECTURE.md)

#### English (Coming Soon)
- [Database Structure](./en/DATABASE_STRUCTURE.md)
- [Network Protocol](./en/NETWORK_PROTOCOL.md)
- [Packet Structure](./en/PACKET_STRUCTURE.md)
- [Server-Client Architecture](./en/SERVER_CLIENT_ARCHITECTURE.md)

### Base de Connaissances SRO

La base de connaissances est organisée par sujets :

- **Classes et Compétences** : Guides complets pour toutes les classes
- **Équipement et Items** : Systèmes d'items et d'équipement
- **NPCs et Monstres** : Informations sur les PNJ et créatures
- **Villes et Zones** : Guides détaillés des villes et zones
- **Jobs et Économie** : Systèmes de trading et d'économie

---

## 🎯 Statut de Traduction

### Progression Actuelle

| Section | Français | Anglais | Priorité |
|---------|----------|---------|----------|
| Documentation Technique | ✅ Complète | ❌ 0% | Haute |
| Base de Connaissances | ✅ Complète | ❌ 0% | Moyenne |
| Guides des Villes | ✅ Complète | ❌ 0% | Moyenne |
| Système de Jeu | ✅ Complète | ❌ 0% | Basse |

### Comment Contribuer

Nous recherchons des traducteurs volontaires pour aider à traduire la documentation en anglais. Si vous souhaitez contribuer :

1. **Fork** le projet
2. **Choisissez** un fichier à traduire
3. **Créez** une Pull Request avec votre traduction
4. **Suivez** les directives dans [LANGUAGE_SWITCH.md](./LANGUAGE_SWITCH.md)

---

## 🔗 Liens Rapides

### Documentation Technique Française
- [Tous les fichiers techniques](./fr/)
- [Système de Basculage de Langue](./LANGUAGE_SWITCH.md)

### Ressources Externes
- [Silkroad Online Wiki](https://silkroadonline.fandom.com/)
- [xSROMap - Carte Interactive](https://jellybitz.github.io/xSROMap/)
- [Forums Communautaires](http://www.silkroadforums.com/)

---

**Dernière mise à jour** : 2026-10-02 (V3 finalisée — audit 24/24, 83 FPS/3 clients)
**Version** : 3.0 - Jeu finalisé (3 continents, 7 zones, FW avec taxe, Job Temple AP)
**Prochaine étape** : Traduction des fichiers techniques prioritaires

---

*Ce système de documentation multilingue permettra à la communauté internationale d'accéder facilement aux informations sur SRObro*