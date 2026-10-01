# Trader Guide

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Devenir Trader](#-devenir-trader)
- [Les Marchandises (Specialty Goods)](#-les-marchandises-specialty-goods)
- [Le Système d'Étoiles](#-le-système-détoiles)
- [Animaux de Transport](#-animaux-de-transport)
- [Centres de Commerce et Routes](#-centres-de-commerce-et-routes)
- [Profits Chiffrés par Route](#-profits-chiffrés-par-route)
- [Déroulement d'un Trade Run](#-déroulement-dun-trade-run)
- [NPC Thieves et Embuscades](#-npc-thieves-et-embuscades)
- [Engager des Hunters](#-engager-des-hunters)
- [Maximiser les Profits](#-maximiser-les-profits)
- [Stratégies Avancées](#-stratégies-avancées)
- [Risques et Comment les Éviter](#-risques-et-comment-les-éviter)
- [Trader sur Origin Mobile](#-trader-sur-origin-mobile)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

Le **Trader** est un job centré sur le **profit économique**. En achetant des *specialty goods* (produits régionaux) dans une ville et en les vendant dans une autre, vous générez des revenus massifs — au risque de vous faire voler par des thieves.

### Points Clés
- ✅ **Profit potentiel énorme** : ~160% à ~313% de la valeur investie selon la route (données vérifiées)
- ✅ **Risk vs Reward gradué** : c'est la **quantité de goods** qui détermine les étoiles (1-5★), pas la route
- ✅ **Social** : travail avec des hunters pour les trades multi-étoiles
- ✅ **Stratégie** : choix des goods, du transport, du timing, de la route

### Le Gameplay du Trader

**Loop Principal:**
1. Équiper le **flag/suit de trader** (alias créé à la première équipée)
2. Acheter un **transport** à l'écurie et l'invoquer
3. Acheter des **specialty goods** (l'inventaire du transport s'ouvre automatiquement)
4. Voyager vers la ville de destination (risque de thieves selon les étoiles)
5. Vendre les goods au marchand local → profit + job XP

**Mathématiques:**
```
Profit = (Prix de Vente − Prix d'Achat) − Coûts (transport, potions, part des hunters)
```

> ⚠️ **Correction importante:** les étoiles d'un trade ne dépendent PAS de la distance de la route. La distance influence le **taux de vente** (le profit), pas le star rating.

---

## 🏪 Devenir Trader

### Requirements (ancien système / vSRO 1.188)
- **Level 20 minimum**
- **Frais d'inscription** au Trader Association NPC, **calculés selon votre niveau**
- Délai de **7 jours** pour re-joindre une guilde de job après l'avoir quittée

### Où s'inscrire

| Ville | NPC (guilde) | Specialty Trader (achat/vente) |
|-------|--------------|-------------------------------|
| Jangan | Trader Association (Hwajung, ère moderne) | Specialty Trader Jodaesan |
| Donwhang | Trader Association (Leegeuk) | Specialty Trader Elder Leegak |
| Hotan | Trader Association (Asaman) | Specialty Trader Sanmok |
| Samarkand | Trader Association (Tana) | Specialty Trader Tina |
| Constantinople | Trader Association (Karen) | Specialty Trader Toson |

### Process (pas à pas)
1. Allez au **Trader Association NPC** dans une ville
2. Inscrivez-vous (frais selon niveau)
3. Achetez/équipez le **flag de trader** → créez votre **pseudonyme/alias** (votre nom réel est caché quand le suit est porté)
4. Achetez un **convoy/transport** à l'écurie (scroll d'invocation)
5. Ouvrez le shop de specialty goods → l'inventaire du transport s'ouvre automatiquement → achetez
6. Sortez de la ville et partez!

### Trader Suit
- Marque votre job et **remplace votre nom par l'alias**
- Cooldown de **10 min** entre equip/dequip (reset par téléport ou déconnexion)
- Ère moderne: pièces (tête/torse/jambes/bottes) avec stats/blue actifs uniquement portés

---

## 📦 Les Marchandises (Specialty Goods)

### Nom et principe
Les marchandises s'appellent **« X de [Ville] »** — ex. **« White Silk of Jangan »**. Chaque ville produit ses spécialités :

- Le shop d'une ville vend **ses propres spécialités** (et affiche les goods des autres régions avec leurs taux)
- On achète bas dans la ville productrice, on vend haut dans une ville éloignée
- **Le taux de vente dépend de la paire de villes** (distance/région) et **fluctue** : survendre la même marchandise au même endroit **fait baisser le prix**, qui se rétablit avec le temps (mécanique de marché vérifiée, guide Origin + forum)

> ⚠️ L'ancien tableau « Medicine/Potions/Dyes/Jewelry » de ce guide était **inventé** — il n'existe pas de telles catégories dans SRO. Les goods réelles sont des specialties régionales nommées d'après leur ville d'origine.

### Bargain Goods (centres de terrain)
Les **field trade centers** (camps de bandits, ruines — voir table plus bas) vendent des **bargain goods** (goods à prix cassé) accessibles via quêtes niveau. C'est un combo avancé : acheter du bargain encore moins cher pour revendre en ville.

### Stock Limit
La capacité dépend du **transport** (voir section suivante), PAS de « slots par type de good ». Les goods ont un poids/une valeur, et le total chargé détermine vos étoiles.

---

## ⭐ Le Système d'Étoiles

**Règle centrale :** le star rating (1-5★) est calculé sur la **quantité/valeur de goods chargées** sur le transport, ajustée par le **niveau** du trader (source: fan-site d'époque Hanf_Hunter + StrategyWiki).

| Étoiles | Player Thieves | NPC Thieves | Usage typique |
|---------|----------------|-------------|---------------|
| **1★** | Ne peuvent PAS attaquer (trader < lv40) | Quasi aucun | Apprentissage, safe trade ; charge max ~16k (cheval) / ~21k (chameau) |
| **2★** | Peuvent attaquer | Petits groupes faibles | Premiers trades « PvP-open » |
| **3★** | Peuvent attaquer | Groupes moyens | Chasse au profit avec hunter |
| **4★** | Peuvent attaquer | Groupes puissants + élites | Très difficile solo |
| **5★** | Peuvent attaquer | Groupes massifs, niveau rouge | Quasi impossible solo — caravane organisée |

**À retenir:**
- Un 1★ sous le niveau 40 est **protégé du PvP de job** (données d'époque)
- Plus d'étoiles = plus de profit (plus de goods) MAIS des vagues de thief monsters plus fortes
- La valeur de charge d'un 1★ dépend du transport : ~**16k de goods max sur un cheval**, ~**21k sur un chameau** (données communautaires iSRO)

---

## 🐪 Animaux de Transport

> ⚠️ **Correction:** l'ancienne version de ce guide indiquait « Horse 1 slot / Camel 2 / Elephant 3 » — c'était faux. Pas de système de « slots par type » ; les transports s'achètent à **l'écurie (Stable)**, en scrolls d'invocation, et leur capacité se mesure en **valeur/poids de goods**.

### Cheval (Trade Horse)
- **Capacité:** la plus faible (~16k de goods en 1★)
- **Vitesse:** la plus rapide → moins de temps d'exposition
- **HP:** faibles
- **Pour:** débutants, runs rapides, routes courtes

### Chameau (Camel)
- **Capacité:** supérieure (~21k en 1★)
- **Vitesse:** plus lent
- **HP:** supérieurs au cheval
- **Pour:** traders intermédiaires — le meilleur compromis capacité/survie (recommandé par les guides d'époque)

### Bœuf (Ox)
- **Capacité:** la plus élevée
- **Vitesse:** lent
- **Particularité:** nécessite des **transport health pills format XL** (vs format Large pour les autres)
- **Pour:** grosses caravanes protégées

> ℹ️ L'« éléphant » cité dans certaines sources n'est **pas confirmé** comme transport de trade classique (c'est une monture standard dans SRO). En Legend VII+, le transport de job est invoqué gratuitement via le skill **Merchant Pipe** (qualité selon le job level).

### Règles des transports (vérifiées, ancien système)
1. Seuls **merchants et thieves** peuvent invoquer un transport (acheté à l'écurie)
2. **Impossible de téléporter** (portes dimensionnelles, return scrolls, reverse) avec un transport invoqué
3. Si le transport **meurt ou disparaît**, toutes les goods **tombent au sol**
4. **Impossible d'invoquer** un transport pendant/juste après un combat (~20 s)
5. Les transports se soignent avec des **transport health pills** (Large/XL) — achetez-en 50-100 avant un run

### Monture vs Transport
- **Mounture personnelle** (cheval, etc.) = pour se déplacer soi-même
- **Transport de trade** = pour porter les goods ; le trader peut monter son transport dans les derniers instants d'une fuite (astuce de guide 2006)

---

## 🗺️ Centres de Commerce et Routes

### Les 10 centres de commerce (données d'époque Hanf_Hunter)

| # | Centre | Type | Accès |
|---|--------|------|-------|
| 1 | **Jangan** | Village | Tous |
| 2 | **Secret Bandits Den** | Terrain (thief) | Level 20+ |
| 3 | **Donwhang** | Village | Tous |
| 4 | **Hukmak Bandits Den** | Terrain (thief) | Level 30+ |
| 5 | **Hotan** | Village | Tous |
| 6 | **Neya Relics** | Terrain | Level 60+ |
| 7 | **Mt. Roke** | Terrain (zone alors indisponible) | Level 70+ |
| 8 | **Samarkand** | Village | Tous |
| 9 | **Evil Order** | Terrain | Level 20+ |
| 10 | **Constantinople** | Village | Tous |

Les **centres de village** vendent specialties locales + générales ; les **centres de terrain** vendent des specialties de terrain + **bargain goods** (prix cassés) derrière des quêtes niveau.

> ⚠️ **vSRO 1.188:** pas d'Alexandria (Legend V, ~2010). Les routes Egypte (Alexandria↔Hotan, Alexandria↔Samarkand — très haut risque) n'existent que dans les versions tardives d'iSRO.

---

## 💰 Profits Chiffrés par Route

Taux de vente vérifiés (le « taux » est le multiplicateur appliqué au prix d'achat des goods) :

| Route | Taux | Source / Époque |
|-------|------|-----------------|
| **Jangan → Donwhang** | **~162%** (10M investis → 16,2M) | Guide officiel Origin (2025) |
| **Hotan → Samarkand** | **~300%** (retour joueur) | Silkroad Forums (iSRO) |
| **Constantinople → Samarkand** | **~313%** | Silkroad Forums (iSRO) |
| Routes « Egypte » (Alexandria) | Très élevées, haut risque | Wiki Fandom (ère tardive) |

**Exemple de run 1★ chiffré (données communautaires iSRO, Jangan↔Donwhang):**
```
Charge cheval 1★:   ~16 000 gold de goods
Charge chameau 1★:  ~21 000 gold de goods
Durée du trajet:    ~15-20 minutes
Revenu à l'arrivée: ~45 000 gold (retour joueur, horse 1★)
```

**Règle économique:** le taux dépend de la **paire (ville d'origine du bien, ville de vente)** — plus les villes sont éloignées/régionalement éloignées, plus le taux est haut — et **baisse temporairement** si la même specialty est survendue (mécanique de fluctuation du marché).

> ⚠️ Les anciens montants « 50k-500k par run » de ce guide étaient des estimations non sourcées. Utilisez les taux (162%-313%) appliqués à votre capital pour estimer vos profits.

---

## 🚚 Déroulement d'un Trade Run

1. **Préparation** (en ville)
   - Équipez le suit/flag de trader
   - Achetez le transport à l'écurie + 50-100 transport pills + potions perso
   - Ouvrez le shop de specialty, remplissez le transport (regardez les taux de chaque ville!)
   - Vérifiez vos étoiles (elles s'affichent au chargement)
2. **Voyage**
   - Sortez par la porte de la ville
   - Suivez la route principale (ou une route alternative discrète)
   - Ne vous téléportez pas: impossible avec transport
3. **Embuscade** (si thieves NPC ou joueurs)
   - Les hunters engagés défendent le transport en priorité
   - Vous pouvez monter sur le transport pour fuir plus vite
4. **Vente** (à destination)
   - Vendez les specialties au marchand local
   - Job XP proportionnelle au montant vendu
   - Déséquipez le suit (attention au cooldown 10 min, resettable via téléport)

---

## 👹 NPC Thieves et Embuscades

- Des **thief monsters** spawn **le long des routes** pour attaquer les caravanes ; leur **nombre et leur niveau évoluent avec vos étoiles ET votre niveau** (mobs verts → dorés → rouges en 5★)
- Ils attaquent « **le plus proche** » — merchants et hunters, jamais les autres thieves
- Les vagues arrivent de façon **semi-aléatoire** pendant le trajet (retours de guides d'époque : spawns « random »)
- En 5★, les thieves NPC peuvent être de niveau **rouge** par rapport au trader → quasi impossible solo
- Les **player thieves** ne peuvent cibler qu'un trade **2★+** (1★ protégé sous lv40)

---

## 🤝 Engager des Hunters

### Pourquoi?
- ✅ Protection contre les player thieves (obligatoire 3★+)
- ✅ Les hunters gagnent leur job XP en défendant votre trade — c'est un contrat **gagnant-gagnant** (le hunter gagne de l'XP quand vous vendez)
- ❌ Coût: généralement **20-40% du profit** (négociation entre joueurs, pas de système intégré)

### Comment engager
1. Annoncez au chat global: « LFG hunters Jangan→Donwhang, 30% cut »
2. Négociez AVANT de partir (pourcentage, paiement fixe, ou mixte)
3. Formez le groupe (en Legend VII+, la cape ne s'équipe PAS en party — organisation différente)
4. Réglez à l'arrivée, après vente des goods

### Prix typiques (pratique communautaire)
| Trade | Cut aux Hunters |
|-------|-----------------|
| 1★-2★ | 20-25% (ou aucun hunter) |
| 3★ | 25-35% |
| 4★-5★ | 35-40%+ (ou fixe + %) |

**Trouver des hunters fiables:** guilde connue, niveau élevé, paiement à l'arrivée (jamais d'avance complète).

---

## 💡 Maximiser les Profits

1. **Lisez les taux** : le shop affiche les prix/taux des specialties dans chaque région — achetez ce qui se vend le plus cher à votre destination
2. **Évitez la survendre** : si tout le serveur vend « White Silk of Jangan » à Donwhang, le taux a chuté — diversifiez les goods ou changez de destination
3. **Timing** : heures creuses = moins de thieves (mais moins de hunters disponibles)
4. **Transport adapté** : cheval pour la vitesse (petites charges répétées), chameau/bœuf pour la capacité
5. **Bargain goods** : les field centers vendent des goods à prix cassé (accès par quêtes niveau) — marges maximales
6. **Caravanes** : plusieurs traders ensemble = mutualisation des hunters, plus de cibles pour disperser les thieves
7. **Gear +speed** : Garment, buffs Lightning pour fuir ou suivre le transport

---

## 🎮 Stratégies Avancées

### Stratégie 1: Solo Horse Low-Risk (1★)
- Cheval, 1★, heures creuses, routes courtes (Jangan↔Donwhang)
- ~16k de charge, protégé du PvP de job (sous lv40)
- Faible profit par run mais répétable et sûr

### Stratégie 2: Camel Medium (2★-3★) + 1-2 hunters
- Meilleur ratio risque/profit pour un trader établi
- Le hunter gagne son XP, vous votre profit — le contrat se négocie facilement

### Stratégie 3: Bœuf/Caravane High-Risk (4★-5★)
- Pleine charge, 3-5+ hunters, route à fort taux (Hotan↔Samarkand, Constantinople↔Samarkand)
- Profit maximal (300%+), risque maximal (thieves NPC rouges + player thieves organisés)
- Nécessite coordination de guilde

### Stratégie 4: Hit-and-Run
- Cheval, charge légère, runs courts en boucle
- Moins de temps d'exposition, cumul de petits profits

### Stratégie 5: Bargain Flip
- Acheter des bargain goods dans un field center (bandit den, ruines) et revendre en ville
- Attention: ces zones sont des repères de thieves

---

## ⚠️ Risques et Comment les Éviter

### Risk 1: NPC Thieves
- **Symptôme:** vagues de mobs dont la force suit vos étoiles
- **Contre:** hunter(s), transport pills, fuir en montant le transport, réduire la charge (moins d'étoiles)

### Risk 2: Player Thieves
- **Symptôme:** embuscade de thieves en suit (2★+)
- **Contre:** heures creuses, hunters, routes alternatives ; si vous mourrez, le transport survit — mais s'ils tuent le TRANSPORT, les goods tombent

### Risk 3: Mort du Transport
- **Symptôme:** le transport meurt → **toutes les goods tombent au sol**, ramassables par tous
- **Contre:** transport pills (Large/XL), hunters, ne pas laisser le transport aggro

### Risk 4: Scammer Hunters
- **Contre:** paiement à l'arrivée, guilde connue, réputation

### Risk 5: Fluctuation du marché
- **Symptôme:** taux de vente effondré à l'arrivée
- **Contre:** vérifier les taux avant d'acheter, diversifier les goods

---

## 📱 Trader sur Origin Mobile

- Choix du job au **level 20** ; les NPC traders affichent le **profit attendu par run**
- Jusqu'à **3 trades 1★ protégés** par session (retours joueurs)
- **Buffs de soutien** si la faction Trader/Hunter est sous-représentée: jusqu'à **+10% profit** et **+7% puissance** (recalcul quotidien, voir 09_JOB_SYSTEM_OVERVIEW.md)
- Le trade ne profite du buff qu'en **free trade** (hors consignation, hors ville d'achat)
- Exemple officiel du guide Origin : 10M de goods Jangan → 16,2M à Donwhang (162%)

---

## ❓ FAQ

### Q: Les étoiles dépendent-elles de la route?
**R:** Non. Elles dépendent de la quantité/valeur de goods chargées (ajustée par votre niveau). La route détermine le taux de vente (profit).

### Q: Puis-je trader sans hunters?
**R:** Oui en 1★ (protégé du PvP sous lv40, quasi pas de NPC thieves) et 2★ prudemment. Au-delà, les hunters sont fortement recommandés.

### Q: Quel transport pour débuter?
**R:** Le cheval (rapide, pas cher, idéal 1★). Passez au chameau quand vous montez en charge.

### Q: Les goods se perdent-elles si je meurs?
**R:** Non — les goods sont sur le transport. Elles ne tombent que si **le transport** meurt (ou est dé-invoqué).

### Q: Comment connaître le taux de vente avant d'acheter?
**R:** Le shop de specialty affiche les goods de toutes les régions avec leurs prix/taux. En Origin Mobile, les NPC traders affichent directement le profit par run.

### Q: Pourquoi mon profit a-t-il baissé depuis hier?
**R:** Fluctuation du marché: survendre la même specialty à la même ville fait chuter son taux, qui remonte avec le temps.

### Q: Puis-je téléporter avec mon transport?
**R:** Non. Aucune téléportation (return scroll, porte, reverse) n'est possible avec un transport invoqué.

### Q: Le trader existe-t-il toujours en Legend VII+?
**R:** Non — en 2011 (Legend VII), le commerce des joueurs devient **consignation NPC** (caravanes de NPCs attaquées par les thieves, escortées par les hunters). Le trader « actif » revient dans les versions tardives et sur Origin Mobile.

---

## 🔗 Resources

### Guides
- [Job - Silkroad Online Wiki (Fandom)](https://silkroadonline.fandom.com/wiki/Job)
- [Trade l Trade Outposts l Profit - Origin Guide (forum officiel Origin)](https://forum.playorigin.com/showthread.php?501-%E2%9C%B3-Trade-l-Trade-Outposts-l-Profit-Origin-Guide) — taux 162% Jangan→Donwhang, mécanique de marché
- [How to Become a Trader in Silkroad (2015)](https://asdfeer1.hatenablog.com/entry/2015/04/01/173112) — pas-à-pas flag/pseudonyme/transport
- [Trade System - Hanf_Hunter (d'époque)](https://hanfhunter-online.de.tl/%3D%3ETrade-System.htm) — 10 centres de commerce, règles des transports

### Outils
- [Trade Route Profit Calculator - silkroadonline.wiki](https://silkroadonline.wiki/tools/trade-routes)
- [xSROMap - carte interactive](https://jellybitz.github.io/xSROMap/)

### Discussions d'époque (via Wayback)
- [1★ Trading with horse vs camel - Silkroad Forums](http://ww.silkroadforums.com/viewtopic.php?f=29&t=16926) — charges ~16k/~21k, profits
- [Selling rates for each trade route - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=7&t=57407) — 313% Constantinople→Samarkand
- [Trade Jangan-Constantinople - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=2&t=63382) — ~300% Hotan→Samarkand

---

*Dernière mise à jour: 2026-10-01*
*Sources: Silkroad Online Wiki (Fandom), forum.playorigin.com (guide officiel Origin), Hanf_Hunter fan site, Silkroad Forums (via Wayback/snippets), StrategyWiki, sromobile.com, asdfeer1.hatenablog.com*
