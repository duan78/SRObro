# Fortress War

> Le PvP de masse de Silkroad Online. Document enrichi par recherche web : guide officiel Joymax (traduction communautaire), interview IGN 2008, MMORPG.com, guides communautaires 2008-2010, données vSRO/RaGEZONE. Les éléments marqués ⚠️ varient selon serveurs/versions.

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Historique (Legend II → aujourd'hui)](#-historique-legend-ii--aujourdhui)
- [Les Forteresses](#-les-forteresses)
- [🇰🇷 Contenu KSRO (2011-2026)](#-contenu-ksro-2011-2026)
- [Calendrier et Inscription](#-calendrier-et-inscription)
- [Participants et Rôles](#-participants-et-rôles)
- [Structures de la Forteresse](#-structures-de-la-forteresse)
- [Déroulement : Séquence d'Attaque](#-déroulement--séquence-dattaque)
- [Commandement et Rôles Spéciaux](#-commandement-et-rôles-spéciaux)
- [Conditions de Victoire](#-conditions-de-victoire)
- [Récompenses et Taxes](#-récompenses-et-taxes)
- [Préparation](#-préparation)
- [Pendant le War](#-pendant-le-war)
- [Tips pour Succès](#-tips-pour-succès)
- [Données Techniques (vSRO/DB)](#-données-techniques-vsrodb)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🏰 Vue d'Ensemble

**Fortress War** est l'event PvP le plus massif de Silkroad Online : un **siège de guilde** opposant jusqu'à **300 joueurs** pour le contrôle d'une forteresse, avec à la clé les **taxes de toute une zone commerciale** pendant une semaine.

### Points Clés
- ✅ **300 joueurs** max par forteresse (guildes + unions)
- ✅ **Siège structuré** : gates → guard towers → Heart of the Fortress (séquence imposée)
- ✅ **2 heures** de guerre (client PC), téléports ouverts 1h avant
- ✅ **Taxes** : la guilde occupante prélève -20% à +20% sur NPC, stalls et téléports de la zone
- ✅ **Occupation d'une semaine** jusqu'à la guerre suivante

---

## 📜 Historique (Legend II → aujourd'hui)

| Date | Événement |
|------|-----------|
| **Mars 2008** | **Legend II : « Fortress War »** — introduction du système. À sa sortie, une **seule forteresse : Jangan** (interview IGN, 03/03/2008). Guerre de 2h, taxes sur les ventes NPC de la ville. |
| **Fin 2008** | Ajout de la **Bandit Fortress** (petite forteresse, présentée comme extension du dispositif de Jangan — IGN Guidebook #47, déc. 2008) |
| **2010** | **Legend IV Plus : « Hotan Fortress »** — revamp du Fortress War System + ajout de la grande forteresse de Hotan (communiqué Joymax/press) |
| **~2013** | **Constantinople Fortress** (Europe de l'Est) — présente dans les clients récents (téléport ID 250, v1.657) ⚠️ date exacte d'ajout non confirmée |
| **2011 (Legend VII)** | Ajout des **béliers et catapultes** réservés aux **Fortress Engineers** (les catapultes ont une portée plus longue) — traduction FR des notes officielles (fil JeuxOnline, mars 2011 — recherche FR 2026-10) |
| **2010+** | **Legend V : Heroes of Alexandria** = cap 110 + Égypte — ⚠️ **pas de forteresse à Alexandrie** sur PC (la ville n'a pas de gates de FW dans les données du client) |

> ⚠️ **Correction :** l'ancienne version de ce document citait une « Alexandria Fortress » — elle n'existe pas dans le client PC. La forteresse tardive est **Constantinople**.

---

## 🏯 Les Forteresses

Le guide officiel distingue **deux types** :

| Type | Particularité | Forteresses |
|------|---------------|-------------|
| **Grande forteresse** (étendard rouge) | Près d'une **grande ville** ; taxe les activités de la ville dépendante | **Jangan**, **Hotan** (⚠️ Constantinople probablement grande, non confirmé) |
| **Petite forteresse** (étendard bleu) | Sur un **centre commercial / axe de trade** ; taxe les **centres commerciaux ET les ferrys** (bateaux privés, tunnels) | **Bandit Fortress** |

> ✅ Précision des sources FR (recherche FR 2026-10, guide GMS Temple 2009) : « grandes forteresses (étendard rouge) = taxes sur la ville dépendante ; petites forteresses (étendard bleu) = taxes sur les centres commerciaux **et les ferrys** ».

**Détail des gates (données client — silkroadonline.wiki):**
- **Jangan Fortress** : 3 gates externes + Gate I/II/III of Fortress, Gate of Charge, Gate of Glory, Gate of Resurrection (IDs 46-54)
- **Bandit Fortress** : 2 gates externes + gates internes (IDs 142-149)
- **Hotan Fortress** : 3 gates externes + 4 gates internes + Charge/Glory/Resurrection (IDs 150-159)
- **Constantinople Fortress** : 3 gates externes + gates internes + Charge/Glory/Resurrection (IDs 250-258)

> Les gates **Charge / Glory / Resurrection** correspondent aux zones d'insertion et de résurrection des attaquants/défenseurs.

---

---

## 🇰🇷 Contenu KSRO (2011-2026)

> État documenté de la **Fortress War côté service coréen** (jamais fermé ; serveur unique 초원길 depuis le 07/03/2012). Rapports : [ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §11](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md) · [ML_RESEARCH/RESEARCH_KO2_WORLD.md §12](ML_RESEARCH/RESEARCH_KO2_WORLD.md) · chronologie : [ML_RESEARCH/RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md).

### Les 5 forteresses de la page officielle

La page officielle **요새 (forteresse)** liste **5 forteresses** dans son sélecteur : **장안 (Jangan) · 비잔틴 (Byzance) · 로도스 (Rhodes) · 황하 (Fleuve Jaune) · 베니스 (Venise)** — soit exactement les noms des **5 anciens serveurs coréens** (황하·로도스·베니스·장안·비잔틴) fusionnés dans 초원길 en 2012. La page affiche « **현재 세율은 20 %** » (taxe de la guilde propriétaire = **20 %**) et des **cycles de siège bimensuels** (exemple affiché : 07/02 → 21/02, bataille à 20 h). Source : https://krsilkroadcp.joymax.com/gamesystem/rank/fortressState.asp

⚠️ **Les données affichées datent de février 2017** (page non maintenue) — mais la **Fortress War tourne toujours** : notice d'incident officielle « 09/21 요새전 이후 발생한 문제 » (octobre 2024, prouvant une guerre du 21/09/2024) et « 게임 버프 관련 비정상 현상 » (03/2026) — https://krsilkroadcp.joymax.com/news/news_list.asp?sID=1 ; vidéo d'une Fortress War sur le serveur 초원길 en 2024 : https://www.youtube.com/watch?v=yZYW_nJlgUA

### Historique KR des forteresses

| Forteresse | Preuve | Source |
|---|---|---|
| **장안 요새 (Jangan)** | présentée lors de l'introduction du système 요새전 (« 도시 쟁탈전 », guerre de conquête de ville) | [ThisIsGame](https://www.thisisgame.com/articles/4896) |
| **호탄 요새 (Hotan)** | Fortress War retravaillée + forteresse de Hotan, 06-07/2009 (NPC 요새 사무관 au palais de Hotan) | [GameDonga](https://game.donga.com/46984) |
| **비적단 요새 (Bandits)** | annonce officielle « 비적단 요새 업데이트 예정 안내 » (forteresse des bandits) | [board officiel kSRO](https://krsilkroadcp.joymax.com/news/news_list.asp?sID=2&Page=55) |

Aucune nouvelle forteresse ni changement du système n'apparaît dans les notices officielles 2022-2026 (cf. rapport KO2 §11 et §16) ; pas de forteresse à Bagdad documentée ([RESEARCH_KO2_WORLD.md §12](ML_RESEARCH/RESEARCH_KO2_WORLD.md)).

---

## 📅 Calendrier et Inscription

### Calendrier officiel (iSRO classique)

| Étape | Quand |
|-------|-------|
| **Inscription** | **Lundi → Mercredi** de la semaine de guerre, auprès du **fortress clerk** (NPC de la forteresse) |
| **Ouverture des téléports** | **19:00** (Silkroad Standard Time) — 1h avant la guerre |
| **Guerre** | **Vendredi 20:00 SST** — durée **2 heures** (interview IGN : « exactly two hours ») |
| **Résultats** | Annoncés **2h après la guerre** sur le site officiel |
| **Fixation des taxes** | Chaque **samedi** ; taux notifié à **00:01 dimanche** |
| **Fréquence** | Le guide officiel indique un cycle « **every other week** » (toutes les 2 semaines) après la première guerre ⚠️ la plupart des serveurs privés tournent en hebdomadaire |

> 📅 **Historique du jour de guerre (recherche DE/FR 2026-10)** : l'horaire a **varié dans le temps**. À l'origine (2007 → fin 2009), la guerre avait lieu le **JEUDI** : « jeudi 11h-13h » (serveur Red Sea 10h40-12h40, « every second Thursday » — silkroadonline.de, déc. 2007) et le guide FR de 2009 (guilde La_Horde, Aege) confirme « **un jeudi sur deux** », le vainqueur occupant la forteresse une semaine. Le guide officiel Legend II (traduction allemande) puis les sources récentes indiquent le **vendredi** (Silkroad Standard Time). Le guide TR moderne (SroMax 2025) confirme « chaque vendredi ».
>
> ⚠️ **Conflits signalés** :
> - Wikipédia PT affirme « todo sábado » (guerre **le samedi**) — affirmation **non sourcée**, contredite par le guide officiel (vendredi) ET par les sources d'époque (jeudi) → **à rejeter explicitement** (recherche PT 2026-10).
> - **Durée** : 2 h (interview IGN 2008, « exactly two hours ») vs **90 min** (Q&A elitepvpers 2011) vs **~1 h** (guides TR modernes) — possibles évolutions selon les époques/versions ; retenir 2 h pour l'iSRO classique d'origine.

### Serveurs privés / versions récentes
- **Silkroad Origin Mobile** : dimanche, formation des équipes 19:50-20:00, bataille **20:00-21:00** (1h), inscription lundi 05:00 → samedi 22:00, guilde **niveau 5+** requise
- Serveurs privés : le plus souvent **dimanche 20:00**, durée 1-2h — **vérifiez toujours le calendrier de votre serveur**

### Conditions d'inscription (iSRO classique)

| Condition | Détail |
|-----------|--------|
| **Fee** | **5 000 000 gold** par guilde inscrite (Silkroad Forums) |
| **Membres** | **3 membres minimum** dans la guilde au moment de la demande |
| **Restriction** | La guilde ne doit **pas être alliée** (union) de la guilde occupante |
| **Qui inscrit** | Le **Guild Master** uniquement |

> ⚠️ **Conflit signalé (recherche TR 2026-10)** : les guides TR modernes (SroMax) exigent une guilde **niveau 3+** et **20+ membres** pour s'inscrire, avec inscription attaquant payante / défenseur gratuite — conditions plus strictes que le « 3 membres minimum » documenté côté iSRO classique ; possibles différences d'époque ou de version, à vérifier sur le client cible. Côté TR : ~300 joueurs par guerre, guildes alliées acceptées, début après un compte à rebours de 5 s.

---

## 👥 Participants et Rôles

### Participants

- **Jusqu'à 300 joueurs** par forteresse (chiffre officiel)
- Plusieurs guildes attaquantes + la guilde occupante (défenseur) + ses alliés d'union
- **Toutes les guildes inscrites deviennent attaquantes** dès le début de la guerre

### Compositions de combat

**1. Frontline (Tanks)** — Warriors STR : poussent, absorbent, drain l'aggro
**2. DPS** — Wizards (AOE), Rogues, Nukers chinois : damage de masse
**3. Healers** — Clerics : heal de groupe + résurrections en chaîne
**4. Support** — Bards : vitesse, mana, buffs — cruciaux pour la mobilité
**5. Siege/Défense** — porteurs de marteaux (structures), engineers, opérateurs

---

## 🏗️ Structures de la Forteresse

Le guide officiel Joymax décrit la forteresse comme un ensemble de **7 éléments** : le cœur, la gate, les camps de défense, les guard towers, les obstacles, le command post et les war flags.

### ❤️ Heart of the Fortress (Cœur — objectif final)

- **Impossible à attaquer** tant que **toutes les guard towers** ne sont pas détruites (elles génèrent des **seals** qui le protègent)
- Sa destruction donne une **occupation temporaire** — la guerre **continue** (le cœur peut être re-détruit par d'autres guildes)
- Le cœur **attaque lui-même** : réduit les HP et inflige des états anormaux aux assaillants
- Il peut être **réparé** par les défenseurs pendant la guerre (MMORPG.com)

### 🚪 Castle Gate (Porte)

- Bloque l'entrée de la forteresse, forte HP, destructible **uniquement avec des armes de siège** (marteaux etc.)
- Peut être **ouverte/fermée via un treuil (pulley)** par le **commander**, les **deputy commanders** et le **combat administrator** (défenseurs)

### 🗼 Guard Towers (Tours de garde)

- **4 types** de tours, améliorables pendant la période d'occupation
- Génèrent les **seals protégeant le cœur** (états anormaux + dégâts magiques aux attaquants)
- **Attaquent à partir de la phase II** de la guerre
- Doivent être **toutes détruites** pour rendre le cœur attaquable

### ⛺ Defense Camps (Camps de défense)

- **3 camps** formés autour : de la castle gate, de la guard tower, du cœur
- Les membres de la **guilde occupante** à l'intérieur d'un camp reçoivent **dégâts physiques/magiques augmentés + absorption des dégâts accrue**
- Réservés à la guilde occupante (pas aux alliés)

### 🚧 Obstacles

- Entraves posées sur le champ de bataille pour ralentir les attaquants

### 🎪 Command Post (Poste de commande)

- **Tente** installée par chaque guilde attaquante
- **Point de résurrection** des attaquants (sinon : ville la plus proche)
- ✅ **Régénération HP/MP +100%** dans la zone du poste (guide officiel Legend II traduit DE : « battle aura/command post » — régén HP/MP +100% ; corroboré par le guide FR « poste de commandement : respawn des joueurs tués + régénération +100% » — recherche DE/FR 2026-10)
- Réduit le temps de respawn (version mobile) ; si détruite, la guilde perd son point de rez — elle **clignote sur la carte** quand attaquée (MMORPG.com)

### 🚩 War Flags (Étendards de guerre)

> ✅ **Chiffres exacts confirmés (recherche DE + FR 2026-10)** : traduction allemande fidèle du **guide officiel Joymax Legend II** ([Anleitung Fortress War — silkroadonline.de](https://www.silkroadonline.de/allgemein/allgemeines-ber-silkroad/29524-anleitung-fortress-war)) + guide FR ([Fortress War — GMS Temple, _Altair_Fr_, oct.-nov. 2009](https://forum.gmstemple.com/index.php?showtopic=7055)) — les trois étendards partagent les mêmes paramètres (**24 membres max, rayon 24 m, durée 2 min**) :

| Étendard | Effet exact |
|----------|-------------|
| **Flag of Combat** (War flag) | **+10% dégâts physiques ET magiques** |
| **Flag of Defense** | **absorbe 10% des dégâts physiques et magiques** |
| **Flag of Healing** | **régénère 5% HP/MP toutes les 5 secondes** |

- Confirmé côté turc (SroMax, guide Fortress War 2025) : mêmes valeurs, Healing Flag « +5% HP/MP toutes les 5 s ».
- Items plantables pendant la guerre, au sol (drapeaux = seule structure non soumise aux points de pose prédéfinis selon le guide FR).

---

## ⚔️ Déroulement : Séquence d'Attaque

La séquence d'objectifs est **imposée et strictement ordonnée** (GuildOrder + consensus communautaire) :

```
1. Brécher l'enceinte extérieure
2. Détruire la Castle Gate        (armes de siège uniquement)
3. Détruire TOUTES les Guard Towers
4. Attendre 3 minutes             (fenêtre de contre-attaque défenseur)
5. Détruire le Heart of the Fortress
   → occupation TEMPORAIRE
   → la guerre continue jusqu'à la fin des 2h
```

**Points clés :**
- Les structures ne tombent **qu'aux armes de siège** (marteaux etc.) — les dégâts des skills ne font pas avancer la chaîne
- Le **combat joueur vs joueur** se déroule en parallèle de la chaîne d'objectifs
- Au **début de la guerre** : un **compte à rebours de 5 secondes** s'affiche pour tous les non-occupants, puis les joueurs sont déplacés au village le plus proche
- ✅ **Capture de structure (recherche DE 2026-10)** : compte à rebours **5 s**, puis **10 s d'invisibilité** (guide officiel Legend II traduit) ; **ré-entrée interdite 5 min** aux attaquants après la prise d'un objectif ; une structure capturée **perd 1 degré** (dégradation)
- 🇹🇷 **Ordre exact côté Bandit Fortress (recherche TR 2026-10)** : **Gate 1 → Gate 2 → Tower 1 → Tower 2 → Heart of the Fortress** — « la première guilde à frapper le Cœur prend la forteresse » (SroMax, guide kale savaşı)

**Défenseurs :**
- Réparer gates/tours/cœur (marteaux de réparation)
- Opérer les gates (treuil)
- Détruire les **command posts** attaquants pour repousser leurs spawns
- Profiter des buffs de camps de défense

---

## 🎖️ Commandement et Rôles Spéciaux

| Rôle | Nombre | Fonction |
|------|--------|----------|
| **Commander** | 1 (le **Guild Master**) | Commandement global, opération des gates (pulley) |
| **Deputy Commanders** | jusqu'à **4** | Nombrés par le commander, aident au commandement + gates |
| **Military Engineers** | jusqu'à **10** | Réparent les structures avec des marteaux (défenseurs) ; seuls habilités à opérer **béliers/catapultes** |
| **Hammerers / porteurs** | ⚠️ guide communautaire 2009 : limite de **15** par guilde | Portent les marteaux de siège/réparation achetés au NPC |

> ✅ Les plafonds **4 adjoints + 10 ingénieurs** sont confirmés par le guide officiel Legend II traduit (recherche DE 2026-10 : silkroadonline.de 29524 + elitepvpers 1430992 — « le GM nomme jusqu'à 4 commandants adjoints et jusqu'à 10 ingénieurs militaires »).

**Achat du matériel** : marteaux, barrières, marteaux de réparation etc. se vendent au **NPC de la forteresse** (ex: celui de Jangan) **avant la guerre** — les officiers doivent en stocker et distribuer.

---

## 🏆 Conditions de Victoire

| Scénario | Résultat |
|----------|----------|
| Le cœur est détruit par la guilde X | X obtient l'**occupation temporaire** — la guerre continue, X peut être renversé |
| Fin de la guerre, cœur détruit en dernier par X | **X remporte la forteresse** (occupation officielle d'une semaine) ⚠️ variante communautaire : guilde ayant infligé le plus de dégâts au cœur / dernière tenant l'occupation |
| Fin de la guerre, cœur **jamais** détruit | Le **défenseur conserve** la forteresse |

> ⚠️ Variantes serveurs privés : guerres de 90 minutes, victoire aux « plus gros dégâts sur le cœur », etc. Vérifiez les règles de votre serveur.

---

## 💰 Récompenses et Taxes

### Pour la Guilde Gagnante

**1. Taxes (la récompense majeure)**
- Taux réglable de **-20% à +20%** (fixé chaque samedi, notifié 00:01 dimanche)
- Appliqué aux : **achats NPC** de la zone, **stalls** des joueurs, **téléports** et services de transport
- Grande forteresse → taxe la grande ville adjacente ; petite forteresse → taxe **centres commerciaux et ferrys** du centre commercial (bateaux privés, tunnels) — guide FR 2009
- La guilde occupante et ses alliés bénéficient de taux entre **-20% et 0%** dans leur propre zone
- ⚠️ Les montants « 10M-200M/jour » des anciens guides sont des **estimations non sourcées** — très dépendants de l'économie du serveur

**2. NPC de forteresse (production)**
- L'occupant doit **employer un fortress administrator** pour accéder aux dialogues NPC de la forteresse
- Permet de **produire des items de siège** et d'**entraîner des unités de transport**
- Le NPC est **automatiquement licencié** si la guilde perd la forteresse

**3. Autres**
- Point de spawn/retour dans la forteresse
- Prestige serveur-wide
- EXP/SP pour les kills pendant la guerre (participants)

---

## 🎒 Préparation

### Guild Preparation

1. **Recruitment:** avoir l'union complète (jusqu'à 8 guildes) mobilisée
2. **Inscription:** GM inscrit (5M gold) lundi-mercredi
3. **Matériel:** stocker marteaux de siège/réparation au NPC forteresse et distribuer
4. **Organisation:** squads pré-faits (partys 8/8 + Union Party), leaders de squad, Discord
5. **Stratégie:** assigner attack/defence, ingénieurs réparateurs, opérateurs de gate

### Individual Preparation

**Gear:** meilleur équipement possible (+7-9 minimum conseillé, SOX si possible)

**Consumables:**
- HP/MP potions en grande quantité
- Speed scrolls / pills (les **pills** purgent les états anormaux — crucial contre les tours et le cœur, MMORPG.com)
- Return scrolls

**Buffs:** full buffs (bard + cleric) avant l'entrée

---

## ⚔️ Pendant le War

### Phase 0: Ouverture (19:00-20:00)
- Téléports ouverts vers la zone de siège
- Installation des command posts attaquants, distribution du matériel

### Phase 1: Initial Clash (20:00)
- Compte à rebours 5s, déplacement au village des non-occupants
- Combat pour le contrôle des abords et des gates

### Phase 2: Structure Push
- Attaquants : marteaux sur la gate sous couverture des PvP players
- Défenseurs : réparation active + tours qui entrent en jeu (phase II)

### Phase 3: Towers et fenêtre des 3 minutes
- Destruction de TOUTES les tours
- 3 minutes de pause — les défenseurs contre-attaquent

### Phase 4: Bataille du Heart
- Assaut du cœur (qui attaque lui-même) pendant que le PvP fait rage
- Occupation temporaire → renversements possibles jusqu'au bout

### Phase 5: Final Minutes
- Tout donner — la dernière destruction du cœur remporte la forteresse

---

## 💡 Tips pour Succès

### For Guild Leaders

1. **Communication:** Discord obligatoire, ordres clairs
2. **Adapt:** changez de cible si un camp bloque
3. **Morale:** ne ragez pas, gardez le cap
4. **Engineers sauvent des forteresses:** gardez toujours des réparateurs sur le cœur en défense

### For Players

1. **Stay Together:** jamais de solo
2. **Pills:** purgez les états des tours/heart en permanence
3. **Target Priority:** healers ennemis d'abord, puis DPS, puis porteurs de marteaux
4. **Resurrection:** rez rapide, retour immédiat au combat
5. **Ne farmez pas les kills:** la victoire passe par la **chaîne d'objectifs**, pas le score de kills

---

## 🔧 Données Techniques (vSRO/DB)

Pour SRObro (implémentation serveur), les fichiers vSRO 1.188 / SRO_VT contiennent :

| Élément | Détail |
|---------|--------|
| **Tables siege** | `_SiegeFortress` (état des forteresses), `_SiegeFortressStruct` (gates/structures — sujet de bugs connus, correctifs Elitepvpers) |
| **Procédures** | `_SiegeFortressRequestSiege` (inscription des guildes) |
| **Guildes** | `_Guild` / `_GuildMember` / `_AlliedClans` (unions) |
| **Client** | Structures de siege dans les media/teleports (ex: gates Jangan IDs 46-54, Constantinople ID 250) |
| **GameServer** | La logique de siège est compilée dans le binaire vSRO (reverse engineering nécessaire — cf. repo VSRO-EXP-SP-Rates-splitter pour la méthode) |
| **Ressources** | « Clean SRO_VT_SHARD_INIT with default fortress war structure » (RaGEZONE) ; « Constantinople Fortress Files » (RaGEZONE) |

---

## ❓ FAQ

### Q: Puis-je participer sans guilde?
**R:** Non. La FW est réservée aux guildes inscrites (et à leurs unions). Pas de guilde = spectateur.

### Q: Combien de joueurs par guilde?
**R:** Jusqu'à **300 joueurs au total** par forteresse (toutes guildes confondues). La limite effective est le nombre de guildes inscrites × leurs membres.

### Q: Combien de temps dure la guerre?
**R:** **2 heures** sur le client PC officiel (téléports ouverts 1h avant). Mobile : 1h. Serveurs privés : 1-2h.

### Q: Quand a lieu la Fortress War?
**R:** Officiel iSRO : **vendredi 20:00 SST** (cycle à l'origine bi-hebdomadaire par forteresse) — ⚠️ à l'origine (2007-2009) la guerre avait lieu le **jeudi** (« un jeudi sur deux » selon les sources DE et FR d'époque) ; le passage au vendredi est documenté par le guide officiel traduit. Serveurs privés modernes : le plus souvent dimanche soir. Vérifiez votre serveur.

### Q: Comment gagne-t-on?
**R:** En détruisant le **Heart of the Fortress** (après gates + toutes les tours + 3 min d'attente). La guilde qui tient la dernière occupation temporaire à la fin des 2h remporte la forteresse pour une semaine.

### Q: Que rapporte une forteresse?
**R:** Les **taxes** de la zone (NPC, stalls, téléports) pendant une semaine, réglables de -20% à +20%, plus les NPC de production de la forteresse.

### Q: Les guildes alliées de l'occupant peuvent-elles attaquer?
**R:** Non — une guilde alliée (union) de l'occupant ne peut pas s'inscrire comme attaquante. Les alliés défendent aux côtés de l'occupant.

### Q: Puis-je respawn si je meurs?
**R:** Oui. Attaquants : près du command post de leur guilde (s'il existe, sinon ville la plus proche). Défenseurs : dans la forteresse.

### Q: Où acheter marteaux et matériel de siège?
**R:** Au NPC de la forteresse (ex: Jangan) avant et pendant la guerre.

---

## 🔗 Resources

### Guides officiels et presse
- [Silkroad Online: Legend II - Fortress War Interview - IGN (03/03/2008)](https://www.ign.com/articles/2008/03/03/silkroad-online-legend-ii-fortress-war-interview)
- [Silkroad Online Guidebook #47 (Bandit Fortress) - IGN (12/2008)](https://www.ign.com/articles/2008/12/16/silkroad-online-guidebook-47)
- [Legend II - Fortress Wars Update - GamesIndustry.biz](https://www.gamesindustry.biz/legend-ii-fortress-wars-update-invades-silkroad-online)
- [Legend V: Heroes of Alexandria - GamesIndustry.biz](https://www.gamesindustry.biz/silkroad-online-level-cap-hits-110-with-legend-v-heroes-of-alexandria-update)

### Guides communautaires (traduction du guide officiel Joymax)
- [Fortress war guide english - Silkroad Imperial](https://silkroad-imperial.superforo.net/t21-fortress-war-guide-english)
- [Anleitung Fortress War — silkroadonline.de (traduction DE fidèle du guide officiel Legend II)](https://www.silkroadonline.de/allgemein/allgemeines-ber-silkroad/29524-anleitung-fortress-war) — chiffres exacts des flags/tentes/commandement (recherche DE 2026-10)
- [Fortress War — GMS Temple (_Altair_Fr_, 2009, guilde La_Horde/Aege)](https://forum.gmstemple.com/index.php?showtopic=7055) — guide FR complet : jeudi/300 participants/3 portes-3 tours/étendards/taxation des petites forteresses (recherche FR 2026-10)
- [Overview of Fortress War - International SRO Forum](https://international-sro.forumotion.com/t18-overview-of-fortress-war)
- [Fortress Wars Guide - MMORPG.com](https://www.mmorpg.com/guides/fortress-wars-2000116969)
- [Fortress Wars Guide (Rid3r, 2009) - gguides](http://gguides.weebly.com/fortress-wars-guide.html)
- [Fortress War Objectives and Roles - GuildOrder](https://guildorder.com/games/silkroad_online/wiki/fortress-war-objectives-and-roles)
- [Silkroad kale savaşı rehberi — SroMax (TR)](https://www.sromax.com/konular/silkroad-kale-savasi-fortress-war-detayli-rehberi.284) · [Fortress War 2025 — SroCave (TR)](https://srocave.com/konular/silkroad-online-fortress-war-nedir-nasil-kazanilir-kale-savasi-stratejileri-ve-oduller-2025.2474) — vendredis, flags, ordre des structures Bandit Fortress (recherche TR 2026-10)

### Forums
- [Question about Fortress War - Elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/1430992-question-about-fortress-war.html)
- [FW registration fee 5mil - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=2&t=72760)
- [Fortress War Introduction - Silkroad Origin Mobile](https://sromobile.com/en/news/news/fortress-war-introduction)

### Données client / technique
- [Teleports DB (gates des forteresses) - silkroadonline.wiki](https://silkroadonline.wiki/teleports)
- [Clean SRO_VT_SHARD_INIT with default fortress war structure - RaGEZONE](https://forum.ragezone.com/threads/clean-sro_vt_shard_init-with-deafult-fortress-war-structure.789109)
- [Constantinople Fortress Files - RaGEZONE](https://forum.ragezone.com/threads/constantinople-fortress-files.863121/)

### Videos
- YouTube: « Silkroad Fortress War » (nom du serveur + forteresse), ex. [Jangan Fortress War 2011 (20:00)](https://www.youtube.com/watch?v=EL8ZHktSxcA), [Constantinople Fortress War](https://www.youtube.com/watch?v=y42PDhH9Z7w)

---

## 📚 Voir aussi

### Systèmes PvP et Guerre
- [Système PvP/PK](20_PVP_PK_SYSTEM.md) - Mécaniques PvP détaillées
- [Système de Combat](04_COMBAT_SYSTEM.md) - Optimiser combat PvP
- [Job System](09_JOB_SYSTEM_OVERVIEW.md) - Job wars

### Organisation de Guilde
- [Système de Guilde](17_GUILD_SYSTEM.md) - Gestion et membres
- [Parties](18_PARTY_SYSTEM.md) - Coordination en guerre
- [Hub Combat](HUB_COMBAT.md) - Centralise combat et PvP

### Builds et Stratégies PvP
- [Builds PvP](33_PVP_BUILDS.md) - Optimisation pour Fortress War
- [Classes Chinoises](02_CHINESE_CLASSES.md) - Rôles en FW
- [Classes Européennes](03_EUROPEAN_CLASSES.md) - Stratégies EU

### Économie et Rewards
- [Hub Économie](HUB_ECONOMIE.md) - Gestion taxes et income
- [Économie et Or](22_ECONOMY_GOLD.md) - Tax income fortress
- [Stall Network](23_STALL_NETWORK.md) - Stalls taxés par la forteresse

### Guides Connexes
- [Unique Bosses](15_UNIQUE_BOSSES.md) - Competition spawns
- [Événements](27_EVENTS.md) - Autres events serveur
- [Stratégies Jobs](35_JOB_STRATEGIES.md) - Jobs pendant FW

---

*Dernière mise à jour: 2026-10-01 (recherche web exhaustive : guide officiel Joymax traduit, IGN 2008, MMORPG.com, Silkroad Forums, Elitepvpers, RaGEZONE, silkroadonline.wiki — enrichi par la recherche multilingue ML_RESEARCH 2026-10 : guide officiel Legend II traduit DE, guide FR GMS Temple 2009, guides TR SroMax/SroCave, conflit PT signalé ; ajout de la section 🇰🇷 Contenu KSRO 2011-2026 : 5 forteresses de la page officielle, taxe 20 %, siège bimensuel, guerre prouvée active en 2024 — rapports ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md et RESEARCH_KO2_WORLD.md)*
