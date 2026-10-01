# SP Farming

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Qu'est-ce que le SP Farming](#quest-ce-que-le-sp-farming)
- [Système de GAP](#-système-de-gap)
- [Ratios XP/SP par GAP (données vérifiées)](#-ratios-xpsp-par-gap-données-vérifiées)
- [Optimal GAP](#-optimal-gap)
- [Spots de SP Farming par Palier](#-spots-de-sp-farming-par-palier)
- [Méthode PLvL (8/8 + Ongs)](#-méthode-plvl-88--ongs)
- [Combien de SP ? (Coûts par Build)](#-combien-de-sp--coûts-par-build)
- [Sources Alternatives de SP](#-sources-alternatives-de-sp)
- [SP Gear et Strategy](#-sp-gear-et-strategy)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

**SP Farming** = farmer des **Skill Points** en maintenant volontairement un écart (le **GAP**) entre le niveau du personnage et ses niveaux de maîtrise. Plus le GAP est grand, plus chaque monstre rapporte de SP-exp par rapport à l'XP.

### Points Clés
- ✅ **400 SP-exp = 1 SP** (constante, tous niveaux)
- ✅ **GAP efficace maximum : 9** (au-delà, le ratio ne change plus)
- ✅ **Farm tôt = plus efficient** : le ratio se dégrade avec le niveau
- ✅ À GAP 9, on gagne **~19-20× plus de SP par point d'XP** qu'à GAP 0
- ✅ Indispensable côté **chinois** ; quasi inutile côté **européen** (2 maîtrises)

---

## 🔄 Qu'est-ce que le SP Farming?

### Concept
1. Monter votre **character level** en tuant des monstres
2. Mais **ne pas** monter votre maîtrise la plus haute au même rythme
3. Cet écart = le **GAP** ; il déplace le ratio XP/SP-exp de chaque kill en faveur du SP

### Pourquoi SP Farming?

**Sans SP farming (chinois) :**
- Vous arrivez au cap avec juste assez de SP pour 1,5-2 maîtrises
- « Skill-starved » : il faut choisir entre dégâts, buffs et utilitaires

**Avec SP farming :**
- 2-3 maîtrises complètes + livres importants partout
- Les builds complets coûtent **80k-200k+ SP** selon la classe (cap 80) — voir plus bas

---

## 📊 Système de GAP

### Formule
```
GAP = Character Level − Highest Mastery Level
```
**Exemple :** char lvl 50 — Bicheon 30, Lightning 10, Force 25 → maîtrise la plus haute = 30 → **GAP 20** (mais seul le premier GAP 9 compte, le surplus ne rapporte rien).

### Règles (vérifiées, guide UnKnoWnCheaTs)
- **Seule la maîtrise la PLUS HAUTE compte** (pas la somme)
- **GAP 9 = maximum utile** : « Going beyond a 9 level gap no longer changes the ratio »
- **400 SP-exp = 1 SP**, constant à tous les niveaux
- Le SP-exp gagné **ne dépend pas des dégâts infligés** : tuer vite et beaucoup est tout ce qui compte → le farming en party/in plvl fonctionne

### Caps de maîtrise
- Chaque maîtrise ≤ niveau du personnage
- **Total de toutes les maîtrises ≤ 300 points** (ex. cap 80 : 3×80 = 240 ; cap 120 : 120+120+60)

---

## 📈 Ratios XP/SP par GAP (données vérifiées)

### Exemple concret — personnage lvl 16 tuant un monstre lvl 16 (source UnKnoWnCheaTs « cougher »)

| GAP | SP-exp par kill | XP par kill | Total |
|:---:|---------------:|------------:|------:|
| 0 | 100 | 400 | 500 |
| 6 | 185 | 230 | 415 |
| 9 | **220** | 30 | 250 |

→ À GAP 9, le monstre ne « vaut » plus que 250 points totaux mais **presque tout se transforme en SP-exp**. Le SP est « plus cher » que l'XP : vous gagnez moins de total, beaucoup plus de SP.

> ✅ **Validé (recherche AR 2026-10)** — troisième source indépendante, mêmes chiffres : un guide SP farming arabe des débuts du jeu (~2008, silkroad4arab — [« Sp Farming اسراره و خفاياه »](https://www.silkroad4arab.com/vb/showthread.php?p=381592)) publie **exactement** 400 skill exp = 1 SP, le plafond total des maîtrises = 300, et la répartition du monstre lvl 16 : gap 0 → 400 EXP + 100 SP = **500 total** ; gap 6 → 230 + 185 = **415** ; gap 9 → 30 + 220 = **250** (« chaque point de gap convertit de l'EXP en SP »). **Aucun chiffre divergent** avec la table UnKnoWnCheaTs ci-dessus ni avec le guide DE 2006 ci-dessous.
> - Coûts de maîtrise (guide AR) : monter **une maîtrise à 16 = 128 SP** ; règle donnée : « une maîtrise au niveau *n* coûte ***n*²/2** SP » (16²/2 = 128) ; passer lvl 16→17 demande **30 902 XP** (≈ 127 840 XP cumulée).
> - **Méthode « coréenne » (guide AR)** : arc + garment sur le spot « Stronghold » (Bandit Stronghold ; le guide AR le situe *à l'est* de Jangan, la KB à l'*ouest* — écart signalé, non tranché), **de-level par morts répétées**, objectif **~40 000 SP** ; variante « européenne » : farmer jusqu'au **niveau 29 → ~34 000 SP**. → valide la stratégie « délevel » documentée plus bas.
> - Recommandations du guide : **10-30k SP** pour une maîtrise, **30-50k** pour deux ; astuce **Cold niveau 5** pour les INT (contrôle des mobs).
> - Source complète : `ML_RESEARCH/RESEARCH_AR_DEV.md` §4.1.

### Tableau de mesures réelles d'époque (guide allemand Radon, 2006) — ✅ Résolu (recherche DE 2026-10)

Le guide « SP-Farming Was? Wie? Wann? » (silkroadonline.de, 2006) documente la mécanique comme **±10% d'XP↔SP par niveau de gap** :

| GAP | XP | SP |
|:---:|:---:|:---:|
| 0 | 100% | 100% |
| 1 | 90% | 110% |
| 5 | 50% | 150% |
| **9 (max utile)** | **10%** | **190%** |

- Source : [SP-Farming Was? Wie? Wann? — silkroadonline.de (Radon, 2006)](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/1454-guide-sp-farming-was-wie-wann) — voir `ML_RESEARCH/RESEARCH_DE.md`.
- **Cohérence croisée** : 10% XP / 190% SP à GAP 9 correspond exactement au facteur ~**19-20× plus de SP par point d'XP** documenté par UnKnoWnCheaTs (ligne « 220/30 » de l'exemple concret) — deux sources indépendantes, deux époques, même règle.
- **Mesures ground-truth monstre par monstre (débunkage du mythe « délevel »)** — monstre lv 23 tué par un personnage à mastery 23 vs mastery 16 (XP/SP par kill, keywarrior in-thread) :

| Monstre | Mastery 23 | Mastery 16 |
|---------|-----------:|-----------:|
| Mangyang | 2 / 1 | 4 / 1 |
| Tiger | 32 / 5 | 576 / 27 |
| Black Tiger | 359 / 64 | 761 / 35 |
| White Tiger | 380 / 67 | 826 / 38 |
| Chakji Worker | 402 / 71 | 896 / 42 |

  → « la formule marche aussi en sens inverse » : mastery **supérieure** au niveau du monstre = plus d'XP aussi. Le mythe du pur dé-level (re-farmer les paliers bas délibérément) est contre-productif côté XP total — seul le ratio SP change en faveur du SP.
- **Suicide farming documenté (2006)** : mourir ne fait perdre **que de l'XP, jamais de SP** → base technique du dé-leveling volontaire ; mort en état de meurtrier : **−6% XP** (témoignage d'époque).

### SP cumulé relatif par GAP (cohérent avec [02_CHINESE_CLASSES.md](02_CHINESE_CLASSES.md))

| GAP | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|-----|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| SP relatif | 1,0 | 1,2 | 1,5 | 1,9 | 2,3 | 3,0 | 4,0 | 5,6 | 8,9 | **19,4** |

**Règle empirique :** chaque +1 GAP ≈ ×1,25 SP ; **chaque +3 GAP ≈ ×2 SP**. À GAP 9 : **~19-20× plus de SP par point d'XP** qu'à GAP 0.

### L'effet du niveau (pourquoi farmer tôt)
- Le ratio SP/XP se **dégrade naturellement avec le niveau** : un GAP 5 au lvl 10 ≈ un GAP 9 au lvl 50 en termes de rendement relatif
- Les monstres haut niveau donnent proportionnellement plus d'XP que de SP-exp
- **Conséquence : le SP farming au lvl 13-32 (bandits/Ongs) est de loin le plus efficient**

---

## 🎯 Optimal GAP

### Recommandations par palier

| Palier | GAP recommandé | Notes |
|--------|---------------|-------|
| 1-13 | 0-5 | Profitez des quêtes ; GAP léger sur les bandits si vous voulez prendre de l'avance |
| **13-32** | **9** | **LA fenêtre classique** : bandits (13-17) puis Ongs/Sonars (31-34) — le meilleur rendement du jeu |
| 32-45 | 5-9 | Sonars/Ongs pour finir le stock, puis Bunwangs/Mujigis |
| 45-60 | 5-9 | Hotan (Bunwangs, Mujigis) — rendement correct mais inférieur |
| 60-80 | 9 (avec plvl) | Niyas du Taklamakan en party 8/8 — le volume de kills compense le ratio |
| 80+ | libre | FGW, quêtes illimitées d'Alexandrie et autres sources alternatives |

> ℹ️ **Variantes d'époque** : le guide DE de 2006 recommandait « gap 5 en général, gap 6 dès Lv59 (passives), sans gap dès Lv72-75 » ([silkroadonline.de, thread « Welcher Gap? »](https://www.silkroadonline.de/index.php?page=Thread&postID=279703)) — la fenêtre GAP 9 (13-32) ci-dessus est le consensus ultérieur (guides PLvL Elitepvpers). Les guides TR modernes confirment GAP 9 comme maximum utile et le recommandent pour les niveaux 70-100 (vSRO.org).

### Stratégie « délevel » (coréenne, historique)
Les joueurs kSRO farmaient les Ongs pendant des semaines jusqu'à ~30k SP, puis **redescendaient de niveau volontairement** (morts répétées) pour re-farmer les paliers bas au ratio maximal. Extrême mais optimal — sur serveurs privés, on la remplace par des rates SP. ✅ **Validée (recherche AR 2026-10)** : la « méthode coréenne » du guide arabe ~2008 (arc + garment à Bandit Stronghold, de-level par morts répétées) visait **~40 000 SP** ([silkroad4arab, p=381592](https://www.silkroad4arab.com/vb/showthread.php?p=381592)).

### Objectifs de stock (cap 80-90)
- Build simple (glaive/spear) : viser **~80-100k SP**
- Build coûteux (blader) : viser **~200k SP**
- Voir le tableau détaillé plus bas

---

## 🗺️ Spots de SP Farming par Palier

Spots vérifiés par les guides communautaires (Elitepvpers, Silkroad Forums) :

| Palier perso | Spot | Mobs (niveau) | Zone | Notes |
|:---:|-------|---------------|------|-------|
| 5-10 | Abords de Jangan | Mangyangs (2-5) | Jangan | Farm tutoriel, GAP léger possible |
| 8-16 | Bijeokdan (Bandit Stronghold) | Bandits/Archers/Bowmen (10-17) | Jangan ouest | Premier vrai spot GAP 9 ; drop de quêtes |
| 24-28 | Penon Castle | Penon Fighters/Soldiers (26-28) | Route Donwhang→Hotan | Dense, party-friendly |
| **16-32** | **Habitat des Ongs** | **Ongs / Blood Ongs (33-34)** | **Karakoram (près de Samarkand)** | **LE spot classique** — passifs, densité énorme, ~1k SP/h, 3k+/h avec tickets ; avec plvl lvl 80+ |
| 22-32 | Plaines de Samarkand | Sonars (31-32) | Karakoram | Suite logique des Ongs |
| 40-51 | Oasis Kingdom | Bunwangs (45-48), Mujigis (49-51, nuit) | Autour de Hotan | Bon volume, rendement moindre |
| 55-65 | Sud de Hotan | Big White Spiders, Yetis (59) | Hotan profond | Complément |
| 65-80 | Ruines Niya | Niya Soldiers→Royals (62-80) | Taklamakan | SP farming en party 8/8 + plvl |
| 35-70 | **Togui Village (FGW)** | Instances FGW | Forgotten World | SP balls 200-4 000 SP + 500k à la collection complète |
| 100+ | Alexandrie | Unegs + quêtes illimitées | Alexandrie | 750 SP par tour de 300 kills (×3) — infini |

> ⚠️ Correction par rapport aux anciennes versions de ce fichier : les Ongs sont niveau **33-34** (pas 45-55) et se trouvent au **Karakoram près de Samarkand**, sur la route Donwhang→Hotan. Le « Bandit Stronghold » héberge des bandits niveaux **10-17**.

---

## 🚀 Méthode PLvL (8/8 + Ongs)

La méthode classique documentée (guide Elitepvpers « How to farm SP ») :

1. **Composition :** 1 plvler lvl 80+ (Wizard ou glaive full spin) + des farmers lvl 16-32 en **GAP 9**, en party **EXP auto-share 8/8**
2. **Spot :** Ongs / Blood Ongs (33-34) — passifs, respawn dense
3. **Astuce de la moyenne :** si la **moyenne des niveaux de la party ≤ niveau du monstre**, les monstres « party » donnent **le double d'EXP/SP** → ajoutez un lvl 1 inactif pour abaisser la moyenne
4. **Rendement :** ~**1 000 SP/h** en classique ; **3 000+ SP/h** avec tickets ST/PT (serveurs qui en proposent) ; ~**10k SP/jour** en session longue
5. Les farmers restent **dans le rayon de partage** (~200 m) — pas besoin de taper

**Variante sans plvl :** glaive STR full spin (Bloody Fan Storm) qui agro tous les Ongs et les découpe en AoE — plus lent mais autonome.

---

## 🧮 Combien de SP ? (Coûts par Build)

### Estimations communautaires « fully farmed » au cap 80 (cohérent avec [02_CHINESE_CLASSES.md](02_CHINESE_CLASSES.md))

| Build | Maîtrises | SP nécessaires (cap 80) |
|-------|-----------|------------------------:|
| Glaive STR (Heuksal+Fire+Lightning) | 3 maîtrises | **~80 000** |
| Spear hybride/nuker | Heuksal+Fire+Lightning | ~90-100 000 |
| Nuker pur (Bicheon/Heuksal+Fire+Lightning) | 3 maîtrises | ~100-150 000 |
| **Blader (Bicheon+Cold+Lightning+Force)** | 4 maîtrises | **~200 000** (le plus cher) |

### Au cap 110-120
- Le coût des livres de maîtrise croît fortement (les paliers 70+ coûtent des centaines/milliers de SP par niveau)
- Un build « full farmed » au cap 120 se compte en **centaines de milliers de SP** (~200-320k selon les skills choisis — repères joueurs Elitepvpers/Origin)
- Les maîtrises : 300 points au total (ex. 120+120+60)

### Repères de progression du stock SP
| Stock SP | Ce que ça permet (à titre d'ordre de grandeur) |
|---------:|-------------------------------------------------|
| ~20-30k | Débloquer l'essentiel d'un build 2 maîtrises au lvl 50-60 |
| ~80-100k | Build glaive/spear complet au cap 80-90 |
| ~200k+ | Build 4 maîtrises / blader complet |
| 500k+ | Couvre la plupart des builds cap 120 (via FGW et quêtes Alexandrie) |

---

## 💎 Sources Alternatives de SP

Le farming GAP n'est pas la seule source — sur les versions tardives et beaucoup de serveurs, ces sources ont changé la donne :

| Source | SP | Conditions | Répétabilité | Confiance |
|--------|---:|------------|--------------|-----------|
| **FGW — collection Talismans complète** | **500 000** par collection | Collecter les 8 cartes (Togui Village etc.) | 1 par collection (répétable) | 5/5 (confirmé admin Origin **+ 2 tutoriels vidéo BR** — recherche PT 2026-10) |
| **FGW — SP balls** | 200 - 4 000 par ball | Runs d'instance (35-70) | Oui | 4/5 |
| **Quête Premium+ (Hotan)** | 10 000 × 3 = 30 000 | Boutique de potions de Hotan, premium actif | 3× par période premium | 5/5 (confirmé admin Origin) |
| **Becoming a Deity (1)** (Alexandrie, lvl 100) | 250 SP de base / **750 avec ×3** | Tuer 300 Unegs (soldat Turian, porte Sud) | **Illimité** | 5/5 |
| **Quêtes illimitées d'Alexandrie (104+)** | SP + EXP en continu | Collectes 100-300 items | Illimité | 4/5 |
| **Job cave / auto-delivery quests** | 20k+/jour (repère joueur) | Job temple haut niveau | Quotidien | 4/5 |
| **So-Ok Trophies** | 200 - 10 000 | Trophées d'événements (Jewel Box...) | Loterie | 4/5 |
| **Academy buff (grantee)** | bonus SP/EXP par kill | Être filleul d'une académie | Pendant le buff | 4/5 |
| **Fellow pet avec selle** | ~10k/jour (1 SP / 2 kills) | Pet de compagnon sellé | Passif | 4/5 |

### Stratégie recommandée (synthèse 2026)

1. **Phase 1 (1-32) :** GAP 9 sur bandits puis **Ongs** — visez 20-30k SP minimum (le meilleur ratio du jeu)
2. **Phase 2 (32-60) :** maintenez GAP 5-9 sur Sonars/Penons/Bunwangs selon vos besoins cibles
3. **Phase 3 (60-100) :** PLvL party 8/8 sur les Niyas si le stock est insuffisant ; sinon GAP 0 et level
4. **Phase 4 (100+) :** **quest farming illimité à Alexandrie** (750 SP/tour ×3) + FGW (500k par collection) + Premium+ (30k) — le GAP devient secondaire
5. **Rescue :** la quête Resuscitation Potion (Lv 20, cœurs maudits) rembourse **80% du SP** si le build est raté

---

## 👕 SP Gear et Strategy

### Équipement
- **Garment (CH INT) :** −20% consommation MP — le lining standard du farming
- **Accessoires +MP / régén MP :** moins de potions, plus de uptime
- Arme avec **spin AoE** (glaive) ou **nukes** (spear/sword) pour le volume de kills
- Potions MP en grande quantité (1 000+) — l'efficacité = kills/heure

### Pendant le farm
- **Tuez vite, tuez beaucoup** : le SP-exp ne dépend pas de qui inflige les dégâts → party OK
- Pull massif + AoE, ou nuke-kite, ou plvl (voir méthode 8/8)
- Sessions de 1-2h : le farming GAP est une épreuve d'endurance mentale

### Erreurs à éviter
- ❌ GAP > 9 (aucun bénéfice, juste moins d'XP)
- ❌ Farmer des mobs **gris** (−10 niveaux) : XP/SP quasi nuls
- ❌ Monter la mauvaise maîtrise « au cas où » avant d'avoir le stock (reskill = −20% de SP)
- ❌ Oublier les quêtes d'inventaire (+14 slots) qui facilitent tout le reste

---

## ❓ FAQ

### Q: SP farming est-il obligatoire?
**R:** Côté chinois : fortement recommandé (80-200k SP par build). Côté européen : non, 2 maîtrises suffisent et le leveling naturel couvre les coûts.

### Q: GAP 9 ou GAP 10+ ?
**R:** **GAP 9 est le maximum utile** — au-delà, le ratio ne change plus (vérifié : guide UnKnoWnCheaTs). L'ancienne mention « GAP 9-10 » de ce fichier était imprécise.

### Q: Pourquoi farmer au lvl 16-32 plutôt qu'au lvl 60 ?
**R:** Le ratio SP/XP se dégrade avec le niveau : GAP 5 au lvl 10 ≈ GAP 9 au lvl 50. Les Ongs (33-34) farmés à bas niveau offrent le meilleur rendement du jeu.

### Q: Combien de SP par heure ?
**R:** Classique sans ticket : ~1 000 SP/h aux Ongs (avec plvl). Avec tickets ST/PT : 3 000+/h. Avec FGW/quêtes Alexandrie : le calcul change complètement (750 SP par tour de 300 kills).

### Q: Les Européens doivent-ils farmer du SP ?
**R:** Le système de maîtrise/GAP s'applique aussi à eux, mais les builds EU ne montent que 2 maîtrises : le SP gagné en levelant suffit normalement. (Correction de l'ancienne réponse qui prétendait que les EU « n'ont pas de maîtrises » — faux : ils en ont, simplement moins.)

### Q: Les champions/giants donnent-ils plus de SP ?
**R:** Ils donnent plus d'XP et de SP-exp au total, mais le **ratio** reste régi par le GAP — pour le farming pur, le volume de mobs normaux gagne.

### Q: Puis-je récupérer mes SP après une erreur ?
**R:** Oui : quête **Resuscitation Potion** (Lv 20+, 10 cœurs maudits = 1 potion, rembourse 80% du SP) ou Scroll of Skill Restore de l'item mall.

### Q: Le FGW 500k SP, c'est fiable ?
**R:** C'est confirmé sur Origin (admin) et par de nombreux joueurs (« after collecting all talismans you get 500k SP which will balance your skills gap »). **Confirmation supplémentaire côté brésilien (recherche PT 2026-10)** : deux tutoriels vidéo BR intitulés « 500K SKILL POINTS FGW TOGUI PASSO A PASSO » ([vidéo 1 Cristiano Alves](https://www.youtube.com/watch?v=MK7WGejMoFo), [vidéo 2](https://www.youtube.com/watch?v=iCgAU8icRoU)) présentent la collecte des talismans Togui comme LA méthode standard de farm de SP. Sur iSRO classique, la récompense de collection était différente (sets/objets) — vérifiez les règles de votre serveur.

---

## 🔗 Resources

### Guides de référence
- [Masteries and SP Farming — UnKnoWnCheaTs (cougher)](https://www.unknowncheats.me/wiki/Silkroad:Masteries_and_SP_Farming) — données GAP vérifiées
- [Complete Guide to Skill Points — UnKnoWnCheaTs](https://www.unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points) — 400 SXP = 1 SP, coûts de maîtrise
- [SP-Farming Was? Wie? Wann? — silkroadonline.de (Radon, 2006)](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/1454-guide-sp-farming-was-wie-wann) — tableau de mesures ±10%/gap (10%/190% à GAP 9), mesures anti-delvl, suicide farming
- [Sp Farming اسراره و خفاياه — silkroad4arab (~2008)](https://www.silkroad4arab.com/vb/showthread.php?p=381592) — validation croisée arabe des tables GAP (400 = 1 SP ; 500/415/250 au lvl 16 ; 128 SP/mastery à 16 ; méthode coréenne ~40k SP) — ✅ recherche AR 2026-10
- [How to farm SP (SkillPoints) — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/2461754-guide-how-farm-sp-skillpoints.html) — méthode PLvL 8/8 + Ongs, FGW, rendements
- [How to make a full-farmed char — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/365938-guide-how-make-full-farmed-char.html)
- [How To Farm SP? — Origin Online Forums](https://forum.playorigin.com/showthread.php?7167-How-To-Farm-SP) — sources FGW/Premium+/Alexandrie
- [SP Farming — Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?t=1243)

### Communauté
- [r/silkroadonline — Reddit](https://www.reddit.com/r/silkroadonline/) — threads SP farming réguliers
- [Silkroad Forums](http://www.silkroadforums.com/)

---

## 📚 Voir aussi

### Systèmes de Progression
- [Guide Leveling](25_LEVELING_GUIDE.md) - Intégrer SP farming au leveling
- [Système de Mastery CH](02_CHINESE_CLASSES.md) - Coûts SP détaillés par maîtrise
- [Classes Européennes](03_EUROPEAN_CLASSES.md) - Pourquoi les EU farm peu
- [Système de Quêtes](16_QUEST_SYSTEM.md) - Quêtes illimitées d'Alexandrie

### Guides de Zones
- [Zones Overview](13_ZONES_OVERVIEW.md) - Meilleurs spots par level
- [Guide Monstres](14_MONSTER_GUIDE.md) - Mobs pour SP farming
- [Locations de Spawn](MONSTERS_SPAWN_LOCATIONS.md) - Spots précis

### Équipement et Économie
- [Armor Types](08_ARMOR_TYPES.md) - Garment pour -20% MP
- [Item Degrees](07_ITEM_DEGREES.md) - Gear adapté au level
- [Économie et Or](22_ECONOMY_GOLD.md) - Budget potions
- [Consommables](21_CONSUMABLES.md) - MP potions efficaces

### Classes et Builds
- [Hub Classes](HUB_CLASSES.md) - Centralise informations classes
- [Builds PvE](34_PVE_BUILDS.md) - SP farming par classe
- [Parties](18_PARTY_SYSTEM.md) - Bonus SP en groupe

---

*Dernière mise à jour: 2026-10-01 (enrichi par la recherche multilingue ML_RESEARCH — tableau GAP/mesures DE 2006, confirmation BR FGW 500k, validation croisée AR ~2008)*
*Sources: UnKnoWnCheaTs (mécanique GAP), Elitepvpers (méthodes PLvL, rendements), Origin Forums (FGW 500k, Premium+, Becoming a Deity), 02_CHINESE_CLASSES.md (coûts par build), silkroadonline.de (mesures GAP 2006), YouTube BR (confirmation 500k SP), silkroad4arab p=381592 (guide SP arabe ~2008 — recherche AR 2026-10)*
