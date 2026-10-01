# Guild System

> Système de guilde de Silkroad Online (client PC classique / iSRO). Document enrichi par recherche web (wikis, forums communautaires 2007-2010, données vSRO). Les chiffres marqués ⚠️ sont sujets à variation selon les versions et serveurs privés.

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Créer une Guilde](#-créer-une-guilde)
- [Niveaux de Guilde (1-5) et Guild Points](#-niveaux-de-guilde-1-5-et-guild-points)
- [Rangs, Droits et Gestion](#-rangs-droits-et-gestion)
- [Guild Storage](#-guild-storage)
- [Emblème de Guilde et d'Union](#-emblème-de-guilde-et-dunion)
- [Union System (Alliances)](#-union-system-alliances)
- [Guild Penalty (Délai de Ré-engagement)](#-guild-penalty-délai-de-ré-engagement)
- [Guild Wars](#-guild-wars)
- [Fortress Ownership](#-fortress-ownership)
- [Données Techniques (vSRO)](#-données-techniques-vsro)
- [Tips pour Guild Masters](#-tips-pour-guild-masters)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🏛️ Vue d'Ensemble

Le système de **guilde** de Silkroad Online permet aux joueurs de se regrouper, de partager des ressources (storage), de former des **unions** (alliances de guildes) et de participer aux **Fortress Wars**, le PvP de masse du jeu.

### Points Clés
- ✅ **Création:** Niveau 20+, 500 000 gold (iSRO classique) auprès du Guild Manager NPC
- ✅ **5 niveaux de guilde** (pas plus!) — de 15 à 50 membres
- ✅ **Guild Points (GP):** 1 SP gagné par un membre = 1 GP
- ✅ **Guild Storage:** débloqué au niveau 2 de guilde
- ✅ **Union:** alliance de jusqu'à 8 guildes (≈400 joueurs)
- ✅ **Fortress War:** contrôle d'une forteresse + taxes de la zone

---

## 📜 Créer une Guilde

### Requirements

| Condition | Valeur (iSRO classique) |
|-----------|------------------------|
| **Niveau du personnage** | 20+ |
| **Coût** | 500 000 gold (certaines sources/wikis citent 1 000 000 ⚠️ divergence selon versions) |
| **Où** | Guild Manager NPC dans les villes principales |
| **Nom** | Unique sur tout le serveur |

### Process

1. Allez au **Guild Manager NPC**
2. Choisissez "Create Guild"
3. Entrez le nom de la guilde
4. Payez le fee
5. Le créateur devient automatiquement **Guild Master**

### Naming Rules

- Nom **unique** à l'échelle du serveur
- Règles usuelles : lettres/chiffres, pas de caractère spéciaux (⚠️ longueur exacte non documentée officiellement)

### First Steps

Après création (guilde **niveau 1**, 15 membres max):
- Invitez des membres (l'invité doit être niveau 20+ ⚠️ couramment rapporté)
- Définissez la notice / l'intro de guilde
- Configurez les permissions (inviter, storage, etc.)
- Accumulez des GP (grind des membres) pour monter la guilde en niveau

---

## 📈 Niveaux de Guilde (1-5) et Guild Points

### ⚠️ Correction importante
Le niveau maximum d'une guilde sur Silkroad Online classique est **5** (pas 20+ comme parfois affirmé). Les guildes « level 20+ » n'existent pas sur iSRO ; certains serveurs privés ont étendu la table.

### Guild Points (GP)

**Comment gagner des GP:**
- Chaque membre qui tue des monstres : **1 Skill Point (SP) gagné = 1 GP** pour la guilde (source: StrategyWiki)
- Participation aux Fortress Wars
- Activités des membres (jobs, etc.)

**Utilisation des GP:**
- Payer les **montées de niveau** de la guilde (avec le gold)
- Acheter des **guild skills / abilities** (bonus passifs pour les membres, ex: bonus d'EXP) ⚠️ mentionné par le wiki Fandom, peu documenté ailleurs

### Table des Niveaux (iSRO classique, source Elitepvpers/Silkroad Forums)

| Niveau guilde | GP requis (cumulés) | Gold requis | Membres max | Débloque |
|---------------|--------------------|-------------|-------------|----------|
| **Level 1** | — | 500 000 (création) | **15** | Base |
| **Level 2** | 5 400 | ~3 000 000 | **20** | **Guild Storage**, création d'Union |
| **Level 3** | 50 400 | ~9 000 000 | **25** | — |
| **Level 4** | 135 000 | ~15 000 000 | **35** | — |
| **Level 5** | ~370 000–380 000 | ~25 000 000 | **50** | **Emblème d'Union**, Union Message |

**Coût total approximatif L1→L5:** ~52,5M gold + ~380k GP (un post Silkroad Forums cite ~48,5M gold au total ⚠️ léger écart selon périodes/serveurs).

> ⚠️ **Divergence signalée (recherche DE 2026-10)** : le guide allemand SeToY (silkroadonline.de, 2009) donne **15/25/30/35/50** membres aux niveaux 1-5 (et 21M gold au L5), tandis qu'elitepvpers (222528) donne **15/20/25/35/50** (tableau ci-dessus). Deux threads d'époque fiables — probablement une évolution du jeu entre 2007 et 2009 ; à trancher avec le dump client. Le seuil **L5 = 50 membres** est identique dans les deux.

### Guild Powers

Plus votre guilde est haut niveau:
- Plus de membres (15 → 50)
- Guild Storage accessible
- Union (alliance) + emblème d'union au L5
- Meilleure crédibilité pour recruter et pour les Fortress Wars

---

## 👑 Rangs, Droits et Gestion

### Hiérarchie

Le guild window (touche **G**) gère tout. La structure de base :

| Rang | Description |
|------|-------------|
| **Guild Master** | Chef unique. Tous les droits : inviter/exclure, rangs, storage, taxes (si forteresse), déclaration de guerre, transfert du leadership |
| **Officers** | Nommés par le GM. Droits configurables (inviter, gérer le storage selon permissions) |
| **Members** | Accès de base + storage si autorisé |

⚠️ La communauté rapporte aussi des grades internes attribuables par le GM : *initiate, member, veteran, elite, officer* (utilisés comme titres hiérarchiques) — et le GM peut donner des **titres personnalisés** aux membres.

### Guild Chat

- Préfixe **@** devant le message (ex: `@Rendez-vous à Hotan pour la FW!`)
- Canal **Union chat** séparé (préfixe **@@** ⚠️ non confirmé) pour toutes les guildes de l'union

### Guild Notice / Intro

- Le GM définit un **message de guilde** (notice) et une **intro** de guilde
- Visible par les membres (à la connexion / dans le window guilde)

### Autres Droits du GM

- Transférer le leadership à un autre membre
- Dissoudre la guilde
- Gérer les taxes de forteresse (si la guilde possède une forteresse)

### GM inactif — vote de remplacement

> ✅ Nouvelle donnée (recherche DE 2026-10) : après **40 jours d'inactivité** du Guild Master (ou en cas de ban), les membres peuvent élire un nouveau GM via le **Guild Agent** (option « Vote for a Master ») — source : [Gilden, Guildwar und Union — silkroadonline.de (SeToY, 07/01/2009)](https://www.silkroadonline.de/archiv/archiv/mitarbeiterbereich/30206-gilden-guildwar-und-union).

---

## 📦 Guild Storage

### Qu'est-ce que c'est?

**Guild Storage** = entrepôt partagé entre les membres de la guilde.

**⚠️ Correction:** le Guild Storage se débloque au **niveau 2** de la guilde (pas niveau 1).

### Accès
- Via le **Guild (Storage) NPC** en ville
- Le Guild Master attribue les permissions par membre/rang (lecture seule, dépôt, retrait)

### Usage
- Partager items et équipement entre membres
- Trésorerie de guilde (items de valeur)
- Stocker les **scrolls d'Union Party** (obtenables via ce NPC)

⚠️ Le nombre exact de slots par niveau de guilde n'est pas documenté de façon fiable (les anciens tableaux « 1-20 slots » circulant sur le web ne sont pas sourcés).

### Security
- Ne donnez pas le retrait à tout le monde — le vol de storage est un classique
- Les logs de storage sont inexistants côté client : la confiance est la seule protection

---

## 🎨 Emblème de Guilde et d'Union

- **Guild mark/emblème:** image **16x16 pixels** (bitmap) uploadée par le Guild Master, affichée à côté du nom des membres
- **Emblème d'Union:** nécessite guilde **niveau 5**, coûte ~**30 000 GP + 2 000 000 gold** (source: guide Silkroad Forums « Union & Guild Emblem »); enregistrable/supprimable seulement au L5 (avec l'**Union Message**)

---

## 🤝 Union System (Alliances)

### Qu'est-ce qu'une Union?

**Union** = alliance entre plusieurs guildes (jusqu'à **8 guildes**).

⚠️ **Correction:** une union, c'est 8 guildes max — soit 8 × 50 = **400 joueurs** potentiels au maximum (guildes L5). Les guildes membres partagent le canal union et combattent ensemble en Fortress War.

### Benefits

**Union Chat:**
- Canal de chat commun à toutes les guildes de l'union
- Coordination Fortress War / trades / job wars

**Fortress War partagée:**
- Les guildes de l'union se battent ensemble (attaque ou défense)
- La guilde occupante peut inclure ses alliés (les guildes alliées de l'occupant **ne peuvent pas s'inscrire comme attaquantes**)

### Créer une Union

| Étape | Détail |
|-------|--------|
| 1 | La guilde doit être **niveau 2 minimum** — ✅ **Résolu (recherche DE 2026-10)** : deux sources allemandes d'époque concordantes (« kann ab Level 2 eine Union gründen / beitreten » — silkroadonline.de SeToY 2009 + elitepvpers 222528) ; l'ancienne divergence « L2 vs L5 » est tranchée : **L5 n'est requis que pour l'emblème/message d'union** |
| 2 | Le Guild Master invite d'autres guildes (rencontre entre GM → touche **U → Guild Relation → Alliances → APPLY**, l'autre GM doit accepter) |
| 3 | Le chef de guilde invitée accepte (vote du leader, pas des membres) |
| 4 | Le fondateur devient **Union Leader** |

**Gestion:**
- Seul l'Union Leader peut **expulser** une guilde de l'union
- Une guilde ne peut appartenir qu'à une seule union
- L'union est dissoute si la guilde leader se dissout — ✅ **confirmé** (« Wird die Leader-Gilde aufgelöst, wird auch die Union aufgelöst », guide DE SeToY 2009)

---

## ⏳ Guild Penalty (Délai de Ré-engagement)

⚠️ Mécanique souvent oubliée mais bien documentée par la communauté :

| Situation | Pénalité |
|-----------|----------|
| **Quitter volontairement** (via Guild Manager NPC) | **3 jours** avant de pouvoir rejoindre/créer une guilde |
| **Être kické en ligne** (online) | **3 jours** |
| **Être kické hors-ligne** (offline) | **Aucune pénalité** |

> Astuce communautaire : pour éviter la pénalité, se faire exclure pendant qu'on est déconnecté.

---

## ⚔️ Guild Wars

### Déclaration

La guilde peut entrer en **hostilité déclarée** avec une autre guilde (via l'interface de guilde, à l'initiative du Guild Master).

> ✅ **Procédure complète documentée (recherche DE 2026-10)** — source : [Gilden, Guildwar und Union — silkroadonline.de (SeToY, 07/01/2009)](https://www.silkroadonline.de/archiv/archiv/mitarbeiterbereich/30206-gilden-guildwar-und-union) :
>
> 1. Le GM rencontre le GM de la guilde adverse
> 2. Touche **U → Guild Relation → Hostility → Apply Combat**
> 3. L'attaquant saisit lui-même : le **nom de guilde**, les **points** (optionnels — on peut laisser 0) et la **DURÉE** du conflit
> 4. **C'est l'attaquant qui choisit la durée** — il n'y a PAS de durée fixe 24/48/72 h
> 5. **Aucune fee de déclaration mentionnée** dans le guide (l'absence de mention n'est pas une preuve d'absence)
>
> ⚠️ **Historique** : avant Legend I, les guild wars pouvaient rapporter des **Guild Points** — ce système de gains GP a été **supprimé** avant Legend I (la fonction n'existe plus en 2009).

### Pendant la Guerre (comportement attendu)

- Les membres des guildes en guerre peuvent s'attaquer **sans pénalité de meurtrier (murderer status)**
- Le conflit continue en dehors de toute fenêtre programmée — affecte trades et activités des membres
- Implique souvent les unions entières (« union war »)
- ⚠️ **Drops d'items en guild war (conflit documenté)** : sur le thread DE SeToY (2009), deux joueurs témoignent avoir **perdu des items équipés** en guild war (cleric rod +8, shield +7) — « les items d'inventaire, armures et boucliers peuvent drop en GW » — tandis que le rédacteur du guide conteste ; consensus du thread : drop possible en guild war, **pas en job ni en Fortress War**. À traiter comme « rapporté, contesté ».

### Fin de la guerre

- Fin de durée / abandon (« se rendre ») — conditions exactes non documentées ⚠️

---

## 🏰 Fortress Ownership

### Lien direct

Voir le fichier dédié : [19_FORTRESS_WAR.md](19_FORTRESS_WAR.md)

### Résumé des bénéfices pour la guilde propriétaire

| Bénéfice | Détail |
|----------|--------|
| **Taxes** | Taux réglable de **-20% à +20%** appliqué aux achats NPC, stalls et téléports de la zone ; taux fixé chaque **samedi**, notifié à 00:01 le dimanche |
| **Taux réduits alliés** | Guilde occupante + union bénéficient de taux entre -20% et 0% dans leur propre zone |
| **NPC de forteresse** | Embauche d'un fortress administrator (production d'items de siège, entraînement de transports) |
| **Spawn** | Point de retour/résurrection pratique dans la forteresse |
| **Prestige** | Réputation serveur-wide |

⚠️ Les estimations de revenus « 10M-100M+/jour » circulant dans les anciens guides ne sont pas sourcées : cela dépend totalement de l'économie du serveur et de la zone taxée.

---

## 🔧 Données Techniques (vSRO)

Pour les émulateurs / serveurs privés (utile au projet SRObro) :

- **Capacité par niveau** : sur les fichiers vSRO 1.188, la limite de membres n'est **pas dans une table éditable** — elle est imposée dans les stored procedures du shard (ex: `_GuildMember_Add`), avec un miroir côté client (patch OllyDbg nécessaire pour l'affichage)
- **Union** : désactivable via T-SQL dans les mêmes procédures
- **Tables principales** : `_Guild`, `_GuildMember`, `_AlliedClans` (union)
- Références : threads RaGEZONE « Easiest Way to Limit Guild Member and Disable Guild Union (T-SQL vSRO 1.188) », Elitepvpers « vSro Guild user Limit [Query] », « Ollydbg Guild Limit »

---

## 🎯 Tips pour Guild Masters

### Recruitment

**Où recruter:**
- Global chat : « LFG [Guild Name], level 40+ active guild »
- Party Matching (visibilité pendant le grind)
- Forums / Discord du serveur

**Requirements typiques:**
- Niveau minimum (ex: 40+)
- Activité (heures/semaine)
- Langue commune

### Management

- **GP d'abord:** faites grind vos membres — le L5 (370k+ GP) est long
- **Planifiez le gold:** ~52M gold cumulés pour L1→L5, souvent financés par les membres / le storage
- **Ne donnez pas le retrait storage** aux nouveaux membres
- **Pensez union:** 8 guildes coordonnées = victoire en Fortress War

---

## ❓ FAQ

### Q: Combien de membres une guilde peut-elle avoir?
**R:** 15 au niveau 1, jusqu'à **50 au niveau 5** (maximum sur iSRO classique).

### Q: Quel est le niveau max d'une guilde?
**R:** **5.** Il n'y a pas de niveau de guilde au-delà (les guildes « level 10/20 » n'existent que sur certains serveurs privés modifiés).

### Q: Comment gagne-t-on des Guild Points?
**R:** Principalement par le grind des membres : chaque SP gagné en tuant des monstres donne 1 GP à la guilde.

### Q: Quand le Guild Storage se débloque-t-il?
**R:** Au **niveau 2** de la guilde, via le Guild NPC, avec permissions gérées par le GM.

### Q: Puis-je être dans plusieurs guildes?
**R:** Non, une seule guilde (et une seule union) à la fois.

### Q: Que se passe-t-il si je quitte ma guilde?
**R:** 3 jours de pénalité avant de pouvoir rejoindre ou créer une guilde — sauf si vous êtes exclu pendant que vous êtes hors-ligne (aucune pénalité).

### Q: Le Guild Master peut-il être changé?
**R:** Oui, le GM peut transférer le leadership à un autre membre.

### Q: Combien de guildes dans une union?
**R:** Jusqu'à **8 guildes**. L'emblème et le message d'union nécessitent une guilde leader de niveau 5.

### Q: Les guildes reçoivent-elles des revenus automatiques?
**R:** Seulement via la possession d'une forteresse (taxes). Sinon, les revenus viennent des contributions des membres.

---

## 🔗 Resources

### Wikis
- [Guild - Silkroad Online Wiki (Fandom)](https://silkroadonline.fandom.com/wiki/Guild)
- [Silkroad Online/Gameplay - StrategyWiki](https://strategywiki.org/wiki/Silkroad_Online/Gameplay)

### Forums (données chiffrées 2007-2010)
- [[Guild]Infomation? - Elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/222528-guild-infomation.html) — coûts GP/gold par niveau
- [Gilden, Guildwar und Union — silkroadonline.de (SeToY, 07/01/2009)](https://www.silkroadonline.de/archiv/archiv/mitarbeiterbereich/30206-gilden-guildwar-und-union) — guide DE fondateur : procédure guild war U→Hostility, union dès L2, dissolution d'union, vote GM après 40 jours
- [What is Guild Storage? - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=7&t=25719)
- [Guild lvl 5 - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=29&t=112263) — union/emblème
- [Union & Guild Emblem Guide - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?t=38590)
- [GUIDE: Union - Elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/2115916-guide-union.html)
- [Leaving guild penalty - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=29&t=131403)

### Technique (vSRO)
- [Limit Guild Member / Disable Union (T-SQL vSRO 1.188) - RaGEZONE](https://forum.ragezone.com/threads/easiest-way-to-limit-guild-member-and-disable-guild-union-t-sql-vsro-1-188.1067135)
- [vSro Guild user Limit [Query] - Elitepvpers](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/3301528-vsro-guild-user-limit-query.html)

---

## 📚 Voir aussi
- [Fortress War](19_FORTRESS_WAR.md) — Le PvP de guilde massif
- [Party System](18_PARTY_SYSTEM.md) — Coordination, Union Party
- [Système PvP/PK](20_PVP_PK_SYSTEM.md) — Pénalités en monde ouvert

---

*Dernière mise à jour: 2026-10-01 (recherche web exhaustive : guides officiels Joymax traduits, Elitepvpers, Silkroad Forums, RaGEZONE, StrategyWiki, IGN — enrichi par la recherche DE 2026-10 : silkroadonline.de SeToY 2009 / elitepvpers 222528)*
