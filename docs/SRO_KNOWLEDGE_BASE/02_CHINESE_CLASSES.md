# Chinese Classes and Masteries

> ⚠️ **Révision majeure (2026-10)** : ce document a été réécrit à partir de données vérifiées (fichier `skills.txt` extrait du client via le dépôt GitHub *SilkroadBot*, notes officielles *Silkroad Origin Mobile*, guides historiques UnKnoWnCheaTs / SilkroadForums). Les anciens noms de skills inventés (« Fire Burst », « Mana Shield », « Thunder Walk », « Body Double »…) ont été remplacés par les **vrais noms iSRO**. Les chiffres non vérifiables sont signalés comme incertains.
>
> 🌏 **Enrichissement (recherche multilingue 2026-10)** : ajout des **noms originels coréens** (liste officielle open beta, Inven 20/12/2004) et **chinois** (wiki officiel TW DiGeam, archives CSRO 2005-2007) dans les tableaux — l'incertitude « noms KSRO introuvables » est levée : ✅ **Résolu (recherche KO/ZH 2026-10)**. Rapports : [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) / [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Système de Maîtrises](#-système-de-maîtrises)
- [Maîtrises d'Armes](#-maîtrises-darmes)
- [Maîtrises de Force (Éléments)](#-maîtrises-de-force-éléments)
- [Imbues Élémentaires](#-imbues-élémentaires)
- [Système de Mastery Points](#-système-de-mastery-points)
- [SP Farming et GAP](#-sp-farming-et-gap)
- [Builds Classiques](#-builds-classiques)
- [Cooldowns, Combos et Zerk](#-cooldowns-combos-et-zerk)
- [Résumé des Arbres de Skills](#-résumé-des-arbres-de-skills)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

La race chinoise (CH) **n'a pas de classes prédéfinies** : elle repose sur 7 maîtrises que l'on combine librement. Le personnage CH est pensé pour le **solo** (self-buffs, heal, résurrection accessibles via Force), par opposition aux Européens orientés groupe.

### Points Clés
- ✅ **7 maîtrises** : 3 d'armes + 4 de force (Cold, Lightning, Fire, Force)
- ✅ Chaque maîtrise est plafonnée au **niveau du personnage** (max 120)
- ✅ **Plafond total de maîtrises** : 300 (classique) → 330 (cap 110) → **360** (cap 120, update Legend 8 de 2011) — soit 3 maîtrises complètes
- ✅ **SP farming (GAP)** quasi indispensable pour « full farm » un build
- ✅ Hybrides STR/INT possibles (rapports 1:8, 2:1, etc.)
- ✅ Système d'**imbue** (enchantement élémentaire de l'arme) unique à la race CH

### Armes chinoises et stats
| Arme | Main | Stat dominante | Notes | Nom KR · ZH |
|---|---|---|---|---|
| Sword (épée) | 1M + bouclier | Magique/INT | Attaques rapides, permet bouclier | 한손검 · 剑 |
| Blade (sabre) | 1M + bouclier | Physique/STR | Coups lents et forts, permet bouclier | 한손도 · 小刀 |
| Spear (lance) | 2M | Magique/INT | Arme 2M « mentale », critique élevé | 창 · 枪 |
| Glaive (hallebarde) | 2M | Physique/STR | Plus haute attaque physique du jeu CH | 대도 · 大刀 |
| Bow (arc) | 2M | Mixte | Consomme des flèches, portée | 활 · 弓 |

> 🌏 Noms d'origine des armes : côté KR (Inven 2004) et ZH (wiki Bahamut/DiGeam). Ordre « physique → magique » des 5 armes côté CN : 大刀 → 小刀 → 弓 → 剑 → 枪. Via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) / [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

> Les deux armes d'une même maîtrise partagent le même arbre (Bicheon = sword + blade, Heuksal = spear + glaive).

---

## ⚙️ Système de Maîtrises

### Les 7 Maîtrises Chinoises

| # | Maîtrise | Nom KR (officiel 2004) | Nom ZH | ID client | Type | Focus |
|---|---|---|---|---|---|---|
| 1 | **Bicheon** | 비천검법 | 飞天剑法 | 257 | Arme | Sword/Blade — chaînes rapides, knockdown, bouclier |
| 2 | **Heuksal** | 흑살창법 | 黑杀枪法 | 258 | Arme | Spear/Glaive — dégâts physiques bruts, stun, spin AoE |
| 3 | **Pacheon** | 파천신궁 | 破天神弓 | 259 | Arme | Bow — distance, critiques, volées de flèches |
| 4 | **Cold** (Ice) | 한빙면공 | 冰系 | SKILL_CH_COLD_* | Force | Défense physique, ralentissements, gel |
| 5 | **Lightning** | 풍뢰비공 | 雷系 | SKILL_CH_LIGHTNING_* | Force | Vitesse, % attaque magique, parry, nukes rapides |
| 6 | **Fire** | 화령신공 | 火系 | SKILL_CH_FIRE_* | Force | Nukes les plus durs, burn, ATK PHY / DEF MAG |
| 7 | **Force** | 기혈대법 | 内功心法 | SKILL_CH_WATER_* (276) | Force | Heal, cure, résurrection, debuffs, MP |

> 🌏 ✅ **Résolu (recherche KO/ZH 2026-10)** — « noms KSRO introuvables » : la liste coréenne officielle de l'open beta donne les noms des 7 maîtrises (비천검법 = « méthode de l'épée volante », 흑살창법 = « lance noire meurtrière », 파천신궁 = « arc divin qui fend le ciel », 한빙면공 = « art du froid glacial », 풍뢰비공 = « art du vent et de la foudre », 화령신공 = « art sacré de l'esprit du feu », 기혈대법 = « grande loi du sang et du qi ») ; les noms ZH sont la couche sémantique chinoise d'origine (飞天剑法 = « loi de l'épée volante », 黑杀枪法 = « loi de la lance noire-tueuse », 破天神弓 = « arc divin fend-ciel »). En coréen, les 3 maîtrises d'armes = **무공** (mugong) et les 4 forces = **기공술** (gigongsul). Sources : [Inven, 20/12/2004](https://www.inven.co.kr/webzine/news/?news=2285) · [wiki officiel TW DiGeam](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F) · [archives CSRO Sina](http://games.sina.com.cn/o/z/slcs/) — détail complet dans [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md) (section « Noms originels »).

> 📝 Dans le fichier `skills.txt` analysé, les 3 éléments partagent le tag de groupe « 277 » et Force utilise « 276 » (Water) — quirk de l'extraction ; les véritables IDs de mastery côté serveur sont 257–259 (armes) et 273–276 (Cold/Lightning/Fire/Force). Les préfixes de codename (`SKILL_CH_COLD_`, etc.) sont le moyen le plus fiable d'identifier les éléments, identique sur tous les clients (KSRO/iSRO/vSRO).

### Règles de Base
- **+1 point de maîtrise par niveau** de personnage (investi dans la maîtrise de votre choix).
- **Une maîtrise ne peut pas dépasser votre niveau de personnage.**
- **Cap total** (somme toutes maîtrises confondues) : 300 à l'origine, 330 au cap 110, **360 au cap 120** (3 masteries à 120).
- En pratique on monte **2 à 3 maîtrises** (le SP est le facteur limitant, pas le cap).
- Les **livres de skills** d'une série se débloquent tous les ~20-22 niveaux de maîtrise (ex. Bicheon Smash : 5 → 27 → 49 → 71 → 93/96 → 120), et chaque livre se re-up de **+2 niveaux de maîtrise par palier** (9-10 niveaux standard, jusqu'à 22 sur les livres « étendus » des versions tardives).

---

## 🗡️ Maîtrises d'Armes

### 1. BICHEON (Sword / Blade)

**Armes :** Sword (rapide, magique) ou Blade (lent, physique) — bouclier possible (1M).

**Caractéristiques :**
- ✅ Attaques fluides, bon DPS soutenu
- ✅ **Meilleur ratio de parry/block** (passif Shield Protection + bouclier)
- ✅ Chaîne complète de **knockdown → stab** (Hidden Blade → Killing Heaven Blade)
- ✅ Deux attaques à distance pour lurer (Blade Force, Sword Dance)
- ❌ Dégâts unitaires plus faibles que la glaive
- ❌ Build le **plus coûteux en SP** (~200k SP au cap 80)

**Séries clés :**
| Série (nom officiel) | Rôle | Nom KR |
|---|---|---|
| Smashing Sword Series | Coups simples lourds (Strike/Stab/Crosswise Smash) | 필살검 계열 |
| Chain Sword Attack Series | Chaînes multi-hits (Illusion → Blood → Billow → Ascension → Heaven → Lightning → Thousand Army → Heavenly Chain) | 연환검 계열 |
| Hidden Blade Series | **Knockdown** (Blood/Soul/Demon/Ocean/Sky Blade Force) | 비검 계열 |
| Killing Heaven Blade Series | **Stab sur cible au sol** (Flower Bloom/Bud Blade, Asura Cut Blade…) — le finisher du KD | 천살 계열 |
| Shield Technique Series | Posture défensive avec bouclier (Castle/Mountain/Ironwall Shield) | 방패술 계열 |
| Blade Force Series | Attaques à **distance** pour lurer (Soul/Evil/Devil Cut Blade) | — |
| Sword Dance Series | AoE de zone (Snake/Petal/Typhoon Sword Dance) | — |
| Shield Protection Series (passif) | Block ratio | — |

> 🌏 Noms d'origine (Bicheon) : KR = snippets namu.wiki + café Daum ; ZH (CSRO 2005) : 必杀剑系列 (attaque mono-cible phare ≈ Smashing), 连环剑系列 (combos multi-hits ≈ Chain Sword), 剑气系列 (AoE), 盾术强化系列 (≈ Shield Technique), séries tardives 飞剑/天杀决/人剑合一/飞天剑 ; le combo documenté est 击倒 + 追击 (« knockdown + stab »). Via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) / [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

**Playstyle :** melee 1v1 redoutable (cycle « 5 stabs » : KD → stabs Killing Heaven), tanky avec bouclier + Ice. Très fort en PvP avec imbue Lightning (shock = parry down).

### 2. HEUKSAL (Spear / Glaive)

**Armes :** Spear (2M, magique — arme des nukers hybrides) ou Glaive (2M, physique — plus forte arme PHY CH).

**Caractéristiques :**
- ✅ **Dégâts physiques les plus élevés** (glaive full STR)
- ✅ Le seul arbre CH avec un vrai **stun** (Soul Departs Spear Series)
- ✅ Spin AoE permanent (Bloody Fan Storm etc.) = excellent farm
- ✅ Passif HP (Cheolsam Force)
- ❌ Pas de bouclier (2M), attaquants lents
- ❌ Builds full PHY n'utilisent **pas d'imbue** (stats physiques pures)

**Séries clés :**
| Série | Rôle | Nom KR · ZH |
|---|---|---|
| Heuksal Spear Series (front) | Enchaînements frontaux (Dancing Demon → Spirit Crash → Death Bringer Spear) | 흑살창 계열 |
| Soul Departs Spear Series | **Stun** (Soul Spear - Move/Truth/Soul/Emperor…) — « le meilleur stun du jeu CH » | 이혼창 계열 · ZH 离魂系列 |
| Ghost Spear Attack Series | AoE tournoyante autour de soi (Ghost Spear - Petal → Sea God) | 창귀술 계열 · ZH 鬼枪术系列 |
| Chain Spear Attack Series | Chaînes multi-hits (Tiger → Nachal → Shura → Pluto → Dragon → Phoenix → Heaven) | 파륨창 계열 · ZH 破轮枪系列 * |
| Flying Dragon Spear Series | Lancer de lance à distance (Flying Dragon - Flow → Sky) | 비룡창 계열 · ZH 飞龙一枪 |
| Storm Series (SPIN) | Transforme l'attaque de base en **tourbillon AoE** (Bloody Fan/Wolf/Snake Storm…) — à maxer absolument | 선풍창 계열 · ZH 血轮舞系列 |
| Série Pierce | Coups perforants simples (Wolf Bite, Waning Moon, Yuhon Spear…) | 멸절결 계열 |
| Cheolsam Force (passif) | **+ HP maximum** | 철삼공 · ZH 黑杀强身术 |

> 🌏 ✅ **Résolu (recherche KO 2026-10)** — les noms KR des séries Pierce (멸절결) et Storm (선풍창), autrefois introuvables, sont désormais attestés, avec les livres : 멸절결 낭아창/잔월창/유혼창 (Pierce A/B/C : Wolf Bite/Waning Moon/Yuhon) · 이혼창 동/진/혼 (Soul Spear Move/Truth/Soul) · 창귀술 낙화/태자/신군 (Ghost Spear Petal/Prince/Mars) · 파륨창 비호/나찰/수라/명왕/교룡 (Chain Spear Tiger/Nachal/Shura/Pluto/Dragon) · 비룡창 류/비 (Flying Dragon Flow/Fly) · 선풍창 혈선풍/혈랑풍/혈사풍 (Bloody Fan/Wolf/Snake Storm). \* ZH : 破轮枪 est décrite comme série « chain » ; la correspondance exacte Pierce↔破轮枪 / Storm↔鬼枪术 reste inférentielle (confiance 4). Sources : [Tistory vivia2020](https://vivia2020.tistory.com/20) · [Naver 올지검방](https://blog.naver.com/offspring_i/80043340729) · [café Daum](https://cafe.daum.net/silkhs/19RJ/6) · [Sina 黑杀枪法 (2007)](http://games.sina.com.cn/o/z/slcs/2007-08-09/1550265655.shtml) — via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) / [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

**Playstyle :** boucher/tueur PvE (spin + Ghost Spear), burst PvP (stun Soul Spear → Ghost Spear). Le glaive full STR est le farmeur par excellence.

### 3. PACHEON (Bow)

**Armes :** Bow (flèches). Builds STR (crit) ou INT (nuker distance) tous deux viables.

**Caractéristiques :**
- ✅ **Portée** (la plus grande du jeu CH, encore étendue par les Soul Arrow)
- ✅ Fortes chances de **critique** (Anti Devil Bow Series)
- ✅ Kiting (Wind Walk de Lightning)
- ❌ Faible en mêlée — dépend des cooldowns
- ❌ Consomme des flèches

**Séries clés :**
| Série | Rôle | Nom ZH |
|---|---|---|
| Anti Devil Bow Series | Tirs **critiques** mono-cible (Missile → … → Moon light) | 退魔弓术系列 * |
| Arrow Combo Attack Series | Volées multi-flèches (2 → 7 Arrow Combo) | 霹雳箭系列 |
| Autumn Wind Arrow Series | Flèches **perforantes** (traversent plusieurs cibles en ligne) | — |
| Explosion Arrow Series | Flèches **explosives AoE** (Berserker/Demon/Devil/Celestial Beast/Pitch Black Arrow) | 爆烈箭系列 |
| Strong Bow Series | Tirs chargés lourds (Spirit → Destruction) | — |
| Mind Bow Series | Attaque **omnidirectionnelle 360°** (3-6 cibles) — salvatrice en mêlée | — |
| Soul Arrow Series | **Buff de portée** (Demon/Bloody/Dragon/Phoenix Soul Arrow) — quasi obligatoire | 破天箭系列 |
| Hawk Summon Series | Invocations de faucons (White/Black/Blue/Lightning/Ice/Fire Hawk) | 白鹰 / 黑鹰 |
| Mind Concentration (passif) | **Attack rating (précision)** | — |

> 🌏 \* 退魔弓术系列 = « attaque de base » de l'arc en CSRO (ATQ PHY 16-22 à 50 %, 2 hits au lv1 — forum TW) ; l'appariement exact avec la série Anti Devil Bow reste à confirmer. Autres séries ZH : 绝杀弓系列 (« arc de l'extermination », coup fatal + chance d'étourdissement) et 破天追魂 (série tardive TW) sans équivalent iSRO certain. Lore officiel : l'arc suprême 绝杀弓 n'est accordé qu'aux disciples choisis par le maître. Sources : [Sina 破天神弓 (2005)](http://games.sina.com.cn/o/z/slcs/2005-04-29/1115224411.shtml) · [Bahamut](https://forum.gamer.com.tw/C.php?bsn=8441&snA=57683) — via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md). Aucun nom KR de série Pacheon n'a été trouvé côté coréen (recherche KO 2026-10).

**Playstyle :** DPS à distance, chasse d'uniques (Isyutaru etc.), très bon avec imbue Fire (burn) pour finir les cibles en kiting.

---

## 🔮 Maîtrises de Force (Éléments)

### 4. COLD (Ice) — 🧊

**Focus :** défense physique et crowd control. L'imbue la plus faible en dégâts mais le contrôle le plus fort.

> 🌏 **Noms d'origine (Cold)** — KR : imbue 빙기공타 (livre 1 빙하결 = Ice River), Frost Guard 빙 호신강기, Cold Wave 빙공파, Frost Wall 빙벽신공, Frost Nova 한빙광야결 (전풍 3 cibles / 광림·광우 5 cibles), Snow Storm 설풍지결 (probable). ZH (TW officiel) : 冰气 (imbue), 冰气护体, 霜气弹, 冰壁术/冰墙, 烈冰诀, 暴雪 (blizzard AoE), 玄冰护体 (passif), 冰缚 (= Freeze). Sources : [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) · [DiGeam 屬性氣功](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F).

**Effets clés :**
- **Frostbite** (~40% de chance via l'imbue) : réduit vitesse d'attaque ET de déplacement
- **Freezing** (~20% de chance) : **immobilise complètement** la cible — le CC le plus puissant en PvP CH
- Buffs : **Frost Guard Series** (+ DEF physique, permanente), murs (Frost Wall) qui absorbent ET bloquent le passage, **Snow Shield** (boucle les dégâts sur le MP), AoE de gel (Frost Nova)
- Passif : **Cold Armor** (+27 DEF PHY au max — modeste)

**Nukes :** Snow Storm Series — dégâts les plus faibles des 3 éléments mais forte AoE + gel (Ice shot 4 s, Ice rain/Double/Multi Shot 10 s de cooldown).

### 5. LIGHTNING — ⚡

**Focus :** vitesse, amplification magique, parry. L'élément « qualité de vie » : quasi tous les builds CH y prennent au moins quelques points.

> 🌏 **Noms d'origine (Lightning)** — KR : imbue 뇌기공타 (livre 1 뇌전 백호결 = Thunder Tiger), Piercing Force 관통섬공, Wind Walk 풍뢰경공 (livres 초상비류/귀영신보/초상비쾌 = Grass Walk-Flow/Ghost Walk-Phantom/Grass Walk-Speed), Lion Shout 사자후 (livres 진명 3 cibles / 낭천 5 cibles / 광야), Concentration 정신집중술, Thunderbolt 뇌력공. ZH (TW) : 电刃 (imbue), 雷息贯通 (buff perce), 奔雷步 (série 流影 ≈ Wind Walk), 鬼影步 (téléportation ≈ Ghost Walk), 狮子吼 (Lion Shout), 鸣禅 (esquive), 狂雷系列 (gros AoE), 雷天闪 (passif esquive). Sources : [GameAbout (2005)](http://www.gameabout.com/news/articleView.html?idxno=615) · [DiGeam](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F).

**Effets clés :**
- **Piercing Force Series** : buff **% attaque magique** (+5% au début, >10% aux derniers livres) — indispensable aux nukers
- **Wind Walk Series** : buffs de vitesse ; **Ghost Walk = téléportation** courte, Grass Walk = +vitesse (≈ +50% au max)
- **Concentration Series** : buff de **parry ratio** (durée 300 s)
- Imbue Lightning : dégâts intermédiaires, status **shock** qui **réduit le parry ratio** de la cible + dégâts de splash
- Passif : **Heaven's Force** (+ parry ratio)

**Nukes :** Lion Shout Series (petits nukes rapides, cd 3-4 s, avec des **groupes de cooldown liés**) et Thunderbolt Force Series (Wolf's → God's Thunderbolt, cd 6 s).

### 6. FIRE — 🔥

**Focus :** dégâts. L'imbue la plus forte et les nukes les plus durs (Flame Wave Series).

> 🌏 **Noms d'origine (Fire)** — KR : imbue 화기공타 (livres 화류결/화극결/화독결/화혼결 = River/Extreme/Poison/Soul Fire), Fire Shield 화염 방패술, Flame Body 화염체, Fire Protection 화 호신강기, Fire Wall 염화벽공, Flame Wave 폭염파 계열 (화시폭염파/열화폭염파/광폭폭염파 = Arrow/HellFire/Wide-Bomb ; les guides KR utilisent aussi 화마지공). ZH (TW) : 炎刃 (imbue, 4 niveaux), 炎灵咒盾 (Fire Shield), 火附体 (Flame Body), 火灵护体 (Fire Protection), 炎壁术 (Fire Wall), 暴焰波 (Flame Wave), 发火术 (détection des invisibles — ligne DETECT), 暴焰魂 (passif ATK). Sources : [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) · [DiGeam](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F).

**Effets clés :**
- Imbue Fire : status **Burn** (DoT) — 25% de probabilité au niveau 1 du premier livre (durée ~6 s), probabilité/durée/effet croissent avec le niveau du skill
- **Flame Body Series** : buff **% attaque physique** — le buff offensif des builds STR (à ne pas confondre avec Piercing Force de Lightning, qui augmente l'attaque magique)
- **Fire Protection Series** : buff **défense magique** — réponse CH aux nukers
- **Fire Shield Series** : buff qui **réduit les mauvais statuts** (burn/shock/freeze…) — ~50% de réduction au max (76 unités d'effet)
- Fire Wall Series : mur de feu (absorbe + bloque, comme le Frost Wall)
- Fire Combustion (Firefly/Light, Vision/Sunrise) : récupération de MP (cd 180 s)
- Passif : **Flame Devil Force** (+ attaque physique)

**Nukes :** Flame Wave Series — Arrow (cd 4 s), Burning (6 s), **Wide** (10 s, la référence), Bomb (4 s), HellFire, Disintegrate, God. « Dégâts élevés, petite AoE » vs Snow Storm « dégâts moindres, grosse AoE ».

### 7. FORCE — 💪 (Série « Water » dans le client : `SKILL_CH_WATER_*`)

**Focus :** soutien — heal, cure, résurrection, debuffs. Le « prêtre » chinois, jouable en hybrid.

> 🌏 **Noms d'origine (Force)** — KR : 기혈대법. ZH (TW officiel) : 内功心法 — 内疗术 (Self Heal), 净化术 (« purification » = Force Cure : soigne brûlure/gel/poison), 医疗术 (Heal, 5e couche 万手), 复活心诀 (Rebirth Art), 内疗术气吸 (ajout 10D). Lore officiel TW : l'école est située à **气血谷** dans les monts **秦岭** (Qinling) et se dit héritière du médecin légendaire **华佗** (Hua Tuo). Source : [DiGeam — 內功心法](https://srowiki.digeam.com/%E5%85%A7%E5%8A%9F%E5%BF%83%E6%B3%95), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

**Effets clés :**
- **Self Heal Series** : heal de soi (Self Breathe/Force/Wounds/Vital Heal)
- **Heal Series** : heal d'une cible (Medical Hand → Ghost/Taoist/Mysterious/Full Hand)
- **Force Cure Series** : dissipe les statuts (Poison/Body/Condition/Vital/Meditation/overall) — **seul moyen de cleaner Freeze/Burn** (les pilules universelles ne les retirent pas)
- **Rebirth Art Series** : **résurrection** (Soul/Ghost/Spirit/Return/Godly Rebirth Art) avec % d'XP rendu croissant
- **Harmony Therapy Series** : HoT/Régén de groupe (cd 300 s)
- **Vital Spot Attack Series** : debuffs — Muscle (ATK PHY −), Spirit (ATK MAG −), puis Body=Mind=Zero=Brain appliquent **Decay/Weaken/Impotent/Division** (probabilité 100% → 80% sur Origin Mobile)
- **Vital Flow Series** (Move/Strength/Intellect/Circulate) : récupération HP/MP
- **Cure Therapy Series** : cure de zone (Pure/Protection/Clarity)
- Passif : **Force Increasing** (+ MP maximum)

**Playstyle :** support en party (job party, FW), ou second masterie d'un hybride. Aucun dégât direct — à coupler avec une arme.

---

## 🔮 Imbues Élémentaires

Les trois éléments offensifs offrent une **imbue** (série `*_GIGONGTA`) : un buff d'arme qui ajoute des dégâts magiques à vos attaques normales et peut appliquer un statut.

| Imbue (série) | Dégâts ajoutés | Statut | Notes |
|---|---|---|---|
| Fire Force (River → God Fire Force) | **Les plus élevés** | **Burn** (DoT ~6 s, 25% au lv1 du livre 1) | Meilleur DPS PvE (le burn finit les mobs) |
| Thunder Force (Thunder Tiger → God Force) | Intermédiaires | **Shock** (réduit le **parry ratio** de la cible) + splash | Aimé des bladers (parry déjà élevé) |
| Cold Force (Ice River → Ice Final Force) | Les plus faibles | **Frostbite** (~40%, ralentit) + **Freeze** (~20%, immobilise) | Contrôle maximal PvP |

**Règles :**
- ⚠️ **Une seule imbue active à la fois** — elles ne se cumulent pas.
- La probabilité, la durée et la puissance du statut **augmentent avec le niveau du skill**.
- Les imbues se réactivent sur cooldown (6 s → 21 s selon le livre) : c'est un toggle.
- Les statuts (burn/freeze) **ne sont pas dissipés par les pilules universelles** — il faut Force Cure ; les pilules small/medium/large soignent ~33/50/76 unités d'effet.
- Le **STUN** n'est pas un « effet » mais un état : aucune pilule ne le retire.
- **Fire Shield Series** (buff Fire) réduit la durée/l'ampleur des statuts subis (~50% au max).

**Noms des livres d'imbue (KR, attestés)** : Fire = 화류결/화극결/화독결/화혼결 (River/Extreme/Poison/Soul) · Cold = 빙하결 (Ice River) · Lightning = 뇌전 백호결, abrégé 뇌호결 (Thunder Tiger) — via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md).

**Mécanique ×% du skill (forum DE, 2006)** : le bonus d'imbue est **multiplié par le % de dégâts du skill** utilisé (un skill à 200 % le double ; un combo à 68 %/coup le réduit proportionnellement) et le calcul est figé côté serveur **à la confirmation d'activation du skill** — un skill lancé juste avant l'activation de l'imbue n'en bénéficie pas. Tests d'époque : Hidden Blade 200 → 400 avec Fire ; 25-30 dégâts sans imbue vs 250-300 avec. Source : [silkroadonline.de — Schadensberechnung (mai 2006)](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/4266-schadensberechnung), via [ML_RESEARCH/RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md).

**Chiffres lv1 (officiels KR, 2005)** : River Fire = **21** dégâts moyens, Thunder Tiger = **17,5**, splash Lightning = **12,25** (≈ +20 % de vitesse de farm grâce au splash). Scaling 2005 : les skills d'attaque 기공 scalent sur l'attaque magique. Source : [GameAbout (27/01/2005)](http://www.gameabout.com/news/articleView.html?idxno=615), via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md).

---

## 📊 Système de Mastery Points

### Conversion et coûts
- Tuer un monstre donne de l'XP **et** du SP-exp (skill exp) : **400 skill exp = 1 SP** (constante, toutes versions).
- Le coût SP d'un niveau de skill ≈ valeur de la table au **(niveau de maîtrise requis + 1)**. Exemple : Wind Walk lv1 (maîtrise 12) coûte ~15 SP ; monter une maîtrise de 11 → 12 coûte ~12 SP.
- Les montées deviennent très vite exponentielles : les gros livres (maîtrise 70+) coûtent des centaines/milliers de SP par niveau.

### Caps de maîtrise
| Époque / cap de niveau | Cap total masteries | Équivalent |
|---|---|---|
| Classique (≤ cap 70/80/90) | **300** | 3 maîtrises à ~90-100 |
| Cap 100 | 300 | 3 × 100 |
| Cap 110 | **330** | 3 × 110 |
| Cap 120 (Legend 8, 2011 → actuel) | **360** | 3 × 120 |

Chaque maîtrise individuellement est toujours plafonnée **au niveau du personnage**.

> ℹ️ Vérification croisée KR (recherche KO 2026-10) : le cap total **330** est confirmé par namu.wiki via extrait (« 마스터리 레벨 총합은 330으로 제한 » — confiance 3, namu inaccessible en direct) ; le cap **360** n'est confirmé par aucune source coréenne consultée (non contredit — sources EN uniquement). Via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md). Repère d'époque TW (cap 60) : « 总技能系300点，武功占110 » — cap total 300 dont ~110 en maîtrises d'armes ([Bahamut](https://forum.gamer.com.tw/G2.php?bsn=8441), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md)).

### Progression typique
- **Niveau 1-30 :** 1 maîtrise d'arme + 1 élément léger (Lightning pour la vitesse), GAP 0-5.
- **Niveau 30-60 :** 2-3 maîtrises actives, GAP de farm choisi (voir ci-dessous).
- **Niveau 60+ :** spécialisation ; le 3ᵉ élément complet seulement si le SP suit.
- **Reskill :** quête « Skill Resuscitation » (dès le lvl 20, cœurs maudits de Grocies/etc. : 10 cœurs → 1 potion, rembourse **80% du SP dépensé**).

---

## 🔄 SP Farming et GAP

### Le GAP
**GAP = niveau du personnage − niveau de maîtrise le plus élevé** (0 à 9). Plus le GAP est grand, plus la part de skill exp augmente au détriment de l'XP.

**Ratio XP/SP cumulé par monstre selon le GAP (guide UnKnoWnCheaTs) :**

| GAP | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| XP relatif | 19,4 | 15,9 | 13,0 | 10,4 | 8,3 | 6,5 | 4,9 | 3,5 | 2,2 | 1,0 |
| SP relatif | 1,0 | 1,2 | 1,5 | 1,9 | 2,3 | 3,0 | 4,0 | 5,6 | 8,9 | **19,4** |

→ À GAP 9 on gagne **~20× plus de SP par point d'XP** qu'à GAP 0.

**SP cumulé selon le GAP (niveau du perso) :**

| Niveau | GAP 0 | GAP 5 | GAP 9 |
|---|---|---|---|
| 30 | 3 911 | 11 660 | 75 074 |
| 45 | 6 672 | 19 855 | 128 041 |
| 60 | 9 884 | 29 436 | 189 675 |

### Zones et méthodes classiques (iSRO)
- **1-20 :** Jangan environs, GAP 0-2, montée normale.
- **20-40 :** Bandit Stronghold / Yeohwa, GAP 4-5.
- **40-60 :** Penon/Niya (Taklamakan plus tard), GAP 7-9, full garment (économie de MP), potions MP.
- **60+ :** farm ciblé au GAP max supportable (Roc Mountain, Jangan Cave…).
- Le SP-exp ne dépend pas des dégâts : tuer vite ET beaucoup > tout. Party de farm OK.

### Combien de SP ? (estimations communautaires au cap 80)
| Build | SP « fully farmed » |
|---|---|
| Pure STR **Glaive** (Heuksal+Fire+Lightning) | ~**80 000** |
| Pure STR **Bow** (Pacheon+Fire+Lightning) | ~**90-100 000** |
| Pure STR **Blader** (Bicheon+Lightning+Fire) | ~**200 000** (séries nombreuses) |
| Build 3 maîtrises complet vers lvl 60 | ~92 000 (exemple guide UC) |

> Au cap 120 actuel, un build « full farmed » se compte en **centaines de milliers de SP** (les valeurs exactes dépendent des skills choisis).

---

## 🎮 Builds Classiques

### 1. Pure STR Glaive — « Glaiver » 🔥
**Masteries :** Heuksal + Fire + Lightning (variante : Force au lieu de Lightning)
- Full STR, armure **armor** (max DEF physique) — les HP du passif Cheolsam compensent un peu le côté « glass cannon ».
- **Pas d'imbue** : dégâts 100% physiques, on compte sur KD/stab et le spin.
- Burst : Soul Spear (stun) → Ghost Spear → chaînes ; farm : Bloody Fan Storm (spin) → tout agro → Ghost Spear AoE.
- Buffs : Flame Body (ATK PHY), Fire Protection (DEF MAG), Grass Walk, Cheolsam (HP).
- ~80k SP au cap 80. Le meilleur farmeur solo CH.

### 2. Pure STR Bow 🔥
**Masteries :** Pacheon + Fire + Lightning
- Critiques Anti Devil + imbue **Fire** (burn pendant le kiting) + Soul Arrow (portée).
- Excellent sur les uniques et le jobbing ; faible si coincé en mêlée (Mind Bow 360° = plan B).
- ~90-100k SP au cap 80.

### 3. Pure STR Blader ⚔️
**Masteries :** Bicheon + Lightning (+ Fire ou Cold)
- Imbue **Lightning** (shock = parry down → profite au 1v1).
- Cycle signature : **Hidden Blade (KD) → Killing Heaven Blade (stabs)** ×5 (« 5 stabs »).
- Bouclier + Shield Technique + Cold (Frost Guard/Freeze) = tank PvP.
- ~200k SP au cap 80 : le build le plus cher.

### 4. Pure INT Nuker — Sword/Spear/Bow 📈
**Masteries :** arme (souvent Heuksal spear ou Bicheon sword+shield) + **Fire + Lightning** (+ Cold défensif)
- DPS magique pur : **Flame Wave** (Fire, le plus fort) et/ou **Wolf's Thunderbolt** (Lightning), **Snow Storm** (Cold, AoE).
- Buffs : Piercing Force (+% ATK MAG), Concentration (parry), Grass Walk, Fire Protection.
- Défense : Snow Shield (Cold, absorbe avec le MP), murs Fire/Frost, bouclier si sword.
- « Les plus gros dégâts du jeu, la plus faible défense ». Variante bow nuker = kitabilit é maximale.

### 5. Hybrides (1:8, 2:1, 7:1…) ⚖️
- **Hybrid spear nuker 1:8** (8 INT : 1 STR) : nukes + quelques HP/parry ; Fire > Lightning en dégâts même buffé, Lightning gardé pour Ghost Walk/Piercing Force.
- **Hybrid STR glaive/blader 7:1** : dégâts physiques + nukes de finish + MP confortable.
- Les hybrides utilisent les DEUX familles de dégâts : imbue + nuke + coups PHY.

### 6. Force Hybrid / Support 💚
**Masteries :** arme + Force + (Cold ou Fire)
- Heal, rez (Rebirth Art), cures (Force Cure), debuffs Vital Spot (Decay/Weaken/Impotent/Division).
- Puissant en Fortress War / job party et pour farmer en économisant les potions.

### 🌏 Nomenclature des builds côté chinois (communauté CN)

- **全智** (quánzhì, « full INT ») : les 3 builds INT classiques = 电枪 (lance foudre), 电剑 (épée foudre), 冰弓 (arc glace).
- **全力** (quánlì, « full STR ») : 冰小刀 (lame glace), 冰弓 (arc glace), 火大刀 (glaive feu — le fameux build STR de 17173).
- « 冰上冰 » (« glace sur glace ») = nuker INT double glace (dénomination des remakes mobiles).
- Anecdote BR d'époque : build archer hybride « **2 STR / 1 INT par niveau** » (forum TibiaBR, 2005-2006, via [ML_RESEARCH/RESEARCH_PT.md](ML_RESEARCH/RESEARCH_PT.md)).
- Sources : [Zhihu — 五大职业气功武功加点](https://zhuanlan.zhihu.com/p/26595258808) · [17173 — 火大刀 (2005)](https://sro.17173.com/content/2005-10-13/n549_465553.html), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## ⏱️ Cooldowns, Combos et Zerk

### Groupes / linkages de cooldown (données officielles Origin Mobile)
- **Lion Shout Series (Lightning)** : Shock/Earth/Execution partagent un même groupe de CD ; Heaven/Power un autre (empêche de spammer tous les livres) — CD 3-4 s par livre.
- **Sword Dance Series** : CD 8 s (réduit à 6 s sur Origin Mobile).
- **Mind Bow Series** : CD 8 s (6 s ajusté), attaque 360° sur 3-6 cibles.
- Les livres d'une même série d'attaque partagent souvent le cooldown du plus long : on « cycle » les séries plutôt qu'on ne les spamme.
- Cooldowns de base (client) : smash 3 s, chaînes 8 s, nukes 4-10 s, murs 10 s (Cold) / 5 s (Fire), Shield Technique 60 s, Storm (spin) 60 s, gros buffs 180 s (Snow Shield, Fire Combustion, Bicheon Force), Harmony Therapy 300 s.

### Combos célèbres
- **« 5 stabs » blader** : Hidden Blade (KD) → 4× Killing Heaven Blade (stabs sur cible au sol) — répéter en achetant du temps (Snow Shield, murs).
- **Stun-lock glaive** : Soul Spear - Move (stun) → Ghost Spear → Chain Spear.
- **Kiting nuker/bow** : nuke → Ghost Walk (téléport) → nuke ; walls pour couper la poursuite (les murs **bloquent physiquement le passage**).

### Zerk (Berserk / Fury)
- La jauge de fureur se remplit en **attaquant/tuant** (orbes) ; pleine (4 orbes) → **mode Berserk** : dégâts et vitesse accrus, durée limitée.
- **Blue Zerk** (mode ultime) : quêtes CH niveau **95** (« Captain », Jangan : Sonhyeon, Miaoryeong, cloche des Stone Ghosts, capture de Niya General aux pièges, tuer le Lost Spirit **en zerk actif**) puis niveau **100** (« General »). Titre jaune affiché devant le nom + potion de récupération de zerk.
- 🇰🇷 Noms d'origine du Berserk (officiel KR 2004) : **환모드** (« mode Hwan »), jauge **환게이지**, déclenchement par la touche **Tab** — « 공격력·이동속도 급증 » (attaque et vitesse de déplacement en forte hausse). Source : [Inven (20/12/2004)](https://www.inven.co.kr/webzine/news/?news=2285), via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md).

---

## 📜 Résumé des Arbres de Skills

> Liste exhaustive (livres, niveaux de maîtrise, temps) → voir **[SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md)**.

| Maîtrise | Séries principales | Passif |
|---|---|---|
| **Bicheon** | Smashing Sword, Chain Sword Attack, Hidden Blade (KD), Killing Heaven Blade (stab), Shield Technique, Blade Force, Sword Dance, Bicheon Force (tardive) | Shield Protection (block) |
| **Heuksal** | Heuksal Spear (front), Soul Departs Spear (stun), Ghost Spear Attack (AoE), Chain Spear Attack, Flying Dragon Spear, Storm/spin, Pierce | Cheolsam Force (HP) |
| **Pacheon** | Anti Devil Bow (crit), Arrow Combo, Autumn Wind (perfo), Explosion Arrow (AoE), Strong Bow, Mind Bow (360°), Soul Arrow (portée), Hawk Summon | Mind Concentration (précision) |
| **Cold** | Cold Force (imbue), Frost Guard (DEF), Cold Wave (gel à distance), Frost Wall, Frost Nova (AoE gel), Snow Storm (nuke), Snow Shield (MP absorb) | Cold Armor (DEF) |
| **Lightning** | Thunder Force (imbue), Piercing Force (% ATK MAG), Wind Walk (vitesse/téléport), Lion Shout (mini-nuke), Concentration (parry), Thunderbolt Force (nuke) | Heaven's Force (parry) |
| **Fire** | Fire Force (imbue burn), Fire Shield (anti-statut), Flame Body (% ATK PHY), Fire Protection (DEF MAG), Fire Wall, Flame Wave (nuke), Fire Combustion (MP) | Flame Devil Force (ATK PHY) |
| **Force** | Self Heal, Heal, Force Cure, Rebirth Art (rez), Harmony Therapy, Vital Spot (debuffs), Vital Flow, Cure Therapy | Force Increasing (MP) |

---

## ❓ FAQ

**Q : Combien de maîtrises puis-je monter ?**
R : Toutes peuvent recevoir des points, mais le cap total (300/330/360 selon l'époque) et le SP limitent en pratique à **2-3 maîtrises complètes** (3 × 120 = 360 au cap actuel).

**Q : Quel est le meilleur élément ?**
R : Fire = dégâts, Cold = défense/contrôle, Lightning = vitesse et % magique. La plupart des builds prennent Fire ou Cold en principal + Lightning en utilitaire.

**Q : Les imbues se cumulent-elles ?**
R : Non, **une seule active** (toggle). Fire = DPS, Ice = contrôle, Lightning = anti-parry.

**Q : SP farming obligatoire ?**
R : Pour un build complet, oui : à GAP 0 vous gagnerez ~20× moins de SP qu'à GAP 9. Un glaive full farm demande ~80k SP dès le cap 80.

**Q : Un pure STR peut-il nuker ?**
R : Mal — les nukes scalent sur l'attaque magique (INT). Les hybrides (7:1, 2:1) mélangent les deux avec succès.

**Q : Comment retirer un Burn/Freeze ?**
R : Pilules élémentaires/pilules universelles NE suffisent PAS pour freeze/burn : il faut le **Force Cure** chinois (ou attendre). Pilules small/medium/large = ~33/50/76 unités d'effet.

**Q : Comment refaire mon build ?**
R : Quête Skill Resuscitation (lvl 20+, cœurs maudits → potion) : rembourse 80% du SP.

**Q : Différences de noms KSRO/iSRO ?**
R : ✅ **Résolu (recherche KO/ZH 2026-10)** : les noms coréens officiels (비천검법, 흑살창법, 파천신궁, 한빙면공, 풍뢰비공, 화령신공, 기혈대법) et chinois originels (飞天剑法, 黑杀枪法, 破天神弓…) sont désormais documentés — voir les tableaux ci-dessus et la section « Noms originels » de [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md). Les noms iSRO sont des translittérations du coréen ; l'identifiant fiable et universel reste le **codename** (`SKILL_CH_FIRE_GIGONGSUL_A_01`…) identique sur tous les clients — c'est ce que SRObro doit utiliser en interne.

---

## 🔗 Resources

### Données de référence (client / officiel)
- [tarekwiz/SilkroadBot — skills.txt (GitHub)](https://github.com/tarekwiz/SilkroadBot/blob/master/Silkroad%20Fusion/bin/Debug/Data/skills.txt) — extraction client : codenames, noms iSRO, cast/cd, niveaux requis (source principale des tableaux)
- [Silkroad Origin Mobile — Class Balance Adjustments](https://sromobile.com/en/news/updates/class-balance-adjustments) — noms de séries officiels, puissances de skills, linkages de cooldown
- [DummkopfOfHachtenduden (DaxterSoul)/SilkroadDoc (GitHub)](https://github.com/DummkopfOfHachtenduden/SilkroadDoc) — documentation formats de fichiers/packets (skilldata)
- [Ex-o/Silkroad-Database-Documentation (GitHub)](https://github.com/Ex-o/Silkroad-Database-Documentation) — structure de la BDD (_RefSkill & co)
- [JellyBitz/SR_Db2Media (GitHub)](https://github.com/JellyBitz/SR_Db2Media) — extraction BDD → client (skilldata)

### Guides mécaniques
- [UnKnoWnCheaTs — Complete Guide to Skill Points](https://unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points) — SP, GAP, caps mastery, quête reskill
- [UnKnoWnCheaTs — SRO General Tips and Stats](https://www.unknowncheats.me/forum/silkroad/38774-sro-tips-stats.html) — stats, imbues, statuts, pilules
- [UnKnoWnCheaTs — Building Blade Guide](https://www.unknowncheats.me/wiki/Silkroad:Building_Blade_Guide) — détail des séries Bicheon/Cold/Lightning
- [SilkroadForums — PURE STR BUILD](http://www.silkroadforums.com/viewtopic.php?f=5&t=82222) — builds STR glaive/bow/blader, SP, combos KD-stab
- [SilkroadForums — Blade or Glaive?](http://www.silkroadforums.com/viewtopic.php?f=4&t=24506) — SP blader vs glaiver

### Wiki / vue d'ensemble
- [Silkroad Online Wiki (Fandom) — Skills](https://silkroadonline.fandom.com/wiki/Skills) — gap, 400 skill exp = 1 SP, cap 360
- [StrategyWiki — Silkroad Online/Gameplay](https://strategywiki.org/wiki/Silkroad_Online/Gameplay) — système de masteries/séries
- [IGN — Chinese classes](https://ign.com/wikis/silkroad-online/Chinese_classes) — rôles des forces, nukers
- [NomadicGamer — Legend 8 (mastery 330→360)](https://nomadicgamer.wordpress.com/2011/08/02/silkroad-online-introduces-legend-8-mysterious-temple-of-jupiter)

### Communauté
- [elitepvpers — SRO Guides & Templates](https://www.elitepvpers.com/forum/sro-guides-templates/) (BlackStar Pure INT, STR bow guides…)
- [r/silkroadonline](https://www.reddit.com/r/silkroadonline/)
- [Silkroad Forums](http://www.silkroadforums.com/)
- [FGWGame — Quête Blue Zerk CH lvl 95](https://fgwgame.com/guides/silkroad-online-ch-level-95-captain-quest-for-blue-zerk)

### Noms originels KR/ZH + mécaniques (recherche multilingue 2026-10)
- [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) — noms KR officiels 2004 des 7 maîtrises + ~30 séries/livres + chiffres 2005 (glossaire 60+ termes)
- [Inven — présentation open beta (20/12/2004)](https://www.inven.co.kr/webzine/news/?news=2285) · [GameAbout — 기공술 A to Z (2005)](http://www.gameabout.com/news/articleView.html?idxno=613) · [Tistory vivia2020](https://vivia2020.tistory.com/20) · [Naver — 올지검방](https://blog.naver.com/offspring_i/80043340729)
- [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) — noms ZH officiels (wiki TW DiGeam, archives CSRO Sina/17173, Bahamut) + lore Force (气血谷/华佗)
- [DiGeam — 屬性氣功](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F) · [DiGeam — 內功心法](https://srowiki.digeam.com/%E5%85%A7%E5%8A%9F%E5%BF%83%E6%B3%95) · [Sina — 黑杀枪法 (2007)](http://games.sina.com.cn/o/z/slcs/2007-08-09/1550265655.shtml) · [Sina — 破天神弓 (2005)](http://games.sina.com.cn/o/z/slcs/2005-04-29/1115224411.shtml)
- [ML_RESEARCH/RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md) — mécanique des imbues ×% du skill ([silkroadonline.de, 2006](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/4266-schadensberechnung))

---

*Dernière mise à jour : 2026-10-01 (enrichie des noms originels KR/ZH — recherche multilingue ML_RESEARCH)*
*Sources : skills.txt client (GitHub SilkroadBot), notes officielles Silkroad Origin Mobile, UnKnoWnCheaTs wiki/forums, SilkroadForums, Fandom Wiki, StrategyWiki, IGN, elitepvpers, Reddit ; noms KR/ZH : Inven 2004, GameAbout 2005, guides KR, wiki TW DiGeam, archives CSRO Sina/17173, Bahamut, Zhihu ; mécanique imbues : silkroadonline.de 2006. Chiffres marqués « ~ » = estimations communautaires ; les valeurs par niveau (dégâts min/max, MP, SP exact par palier) restent à extraire de `skilldata_5000`/`_RefSkill`.*
