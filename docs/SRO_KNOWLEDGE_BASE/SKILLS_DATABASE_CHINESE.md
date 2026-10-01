# Skills Database - Chinese Masteries

> ⚠️ **Révision majeure (2026-10)** : base reconstruite à partir de données extraites du client (`skills.txt`, dépôt GitHub *tarekwiz/SilkroadBot*, données vSRO/iSRO cap 120) croisée avec les noms de séries officiels (Silkroad Origin Mobile) et les guides communautaires. Les listes précédentes contenaient des skills inventés ; tout est remplacé ci-dessous par les **vraies séries iSRO**.

## 📋 Table des Matières
- [Conventions et Sources](#-conventions-et-sources)
- [Bicheon Mastery](#%EF%B8%8F-bicheon-mastery-swordblade)
- [Heuksal Mastery](#-heuksal-mastery-spearglaive)
- [Pacheon Mastery](#-pacheon-mastery-bow)
- [Cold Mastery](#%EF%B8%8F-cold-mastery-ice)
- [Lightning Mastery](#-lightning-mastery)
- [Fire Mastery](#-fire-mastery)
- [Force Mastery](#-force-mastery-water)
- [Puissances de Skills (Origin Mobile)](#-puissances-de-skills-origin-mobile)
- [Statuts et Imbues](#-statuts-et-imbues)
- [Coûts SP et Progression](#-coûts-sp-et-progression)
- [Données Manquantes / Incertitudes](#-données-manquantes-incertitudes)
- [Resources](#-resources)

---

## 🔧 Conventions et Sources

| Colonne | Signification |
|---|---|
| **Série** | Nom officiel affiché (iSRO / Origin) — *italique* = nom communautaire quand le nom officiel exact n'est pas confirmé |
| **Codename** | Préfixe interne du client (`SKILL_CH_…`) — **identifiant universel** (identique KSRO/iSRO/vSRO), à utiliser par SRObro |
| **Maîtrise** | Niveau de maîtrise requis pour le **1ᵉʳ niveau du livre** (les niveaux suivants : +2 maîtrise par palier) |
| **Cast** | Temps d'incantation du lv1, en secondes (données client ; pour les chaînes multi-hits = valeur du 1ᵉʳ hit) |
| **CD** | Cooldown en secondes (données client) |
| **Niv.** | Nombre de niveaux d'upgrade du livre dans le fichier (9 standard ; >9 = livre « étendu » des versions cap 110/120) |

- 📄 Source principale : `skills.txt` (client) — `https://github.com/tarekwiz/SilkroadBot/blob/master/Silkroad Fusion/bin/Debug/Data/skills.txt`
- Chaque skill du client suit le pattern `<SERIE>_<LETTRE>_<N°hit>S?_<NIVEAU>` (ex. `SKILL_CH_SWORD_CHAIN_C_2S_04` = Billow Chain, hit 2, niveau 4).
- Skills « base » (attaque de base, pas de SP) : `SKILL_CH_SWORD_BASE_01` (ID 2), `SKILL_CH_SPEAR_BASE_01` (ID 40), `SKILL_CH_BOW_BASE_01` (ID 70).
- Plage d'IDs classiques des premiers livres : Bicheon 3-39, Heuksal 41-69, Pacheon 71-89, Cold 90-106, Lightning 107-123, Fire 124-142, Force 143-159. Les livres tardifs (cap 110/120) ont des IDs à 5 chiffres (18685+).

---

## ⚔️ Bicheon Mastery (Sword/Blade)

**Groupe :** 257 · **Base :** ID 2 `SKILL_CH_SWORD_BASE_01` · **Passif :** Shield Protection (block ratio, maîtrise 10)

### 1. Smashing Sword Series — `SKILL_CH_SWORD_SMASH_*`
Coups simples lourds mono-cible. CD 3 s.

| Livre | Skill | Maîtrise | Cast | Niv. |
|---|---|---|---|---|
| A | Strike Smash | 5 | 1,0 s | 9 |
| B | Stab Smash | 27 | 1,1 s | 9 |
| C | Crosswise Smash | 49 | 0,5 s | 9 |
| D | Flying Stone Smash | 71 | 0,8 s | 12 |
| E | Twin Energy Smash | 96 | 0,2 s | 13 |
| F | Destruction Smash | 120 | 0,2 s | 1 |

### 2. Chain Sword Attack Series — `SKILL_CH_SWORD_CHAIN_*`
Chaînes multi-hits (3 à 5 hits). CD 8 s. Deux livres débloquent ensemble aux paliers 29/51/…

| Livre | Skill | Hits | Maîtrise |
|---|---|---|---|
| A | Illusion Chain | 3 | 7 |
| B | Blood Chain | 4 | 29 |
| C | Billow Chain | 5 | 29 |
| D | Ascension Chain | 4 | 51 |
| E | Heaven Chain | 5 | 51 |
| F | Lightning Chain | 5 | 73 |
| G | Thousand Army Chain | 5 | 100 |
| H | Heavenly Chain | 5 | 120 |

### 3. Shield Technique Series — `SKILL_CH_SWORD_SHIELD_*` (bouclier requis)
Posture défensive : immobilise le lanceur, absorbe les dégâts. CD 60 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Castle Shield | 10 | 12 |
| B | Mountain Shield | 32 | 12 |
| C | Ironwall Shield | 54 | 12 |
| D | Giant Shield | 76 | 8 |
| E | Iron Castle Shield | 98 | 8 |
| F | Sun Guard Shield | 105 | 6 |

### 4. Blade Force Series — `SKILL_CH_SWORD_GEOMGI_*` (attaque à distance)
Vrais projectiles d'épée : sert à **lurer** (Soul Cut Blade faible, Evil Cut Blade bonne portée/dégâts). CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Soul Cut Blade | 14 | 9 |
| B | Evil Cut Blade | 36 | 9 |
| C | Devil Cut Blade | 58 | 9 |
| D | Demon Cut Blade | 80 | 9 |
| E | Ghost Cut Blade | 102 | 7 |
| F | Emperor Blade | 120 | 1 |

### 5. Hidden Blade Series — `SKILL_CH_SWORD_KNOCKDOWN_*` (knockdown)
Les skills de **KD** de l'épée. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Blood Blade Force | 19 | 18 |
| B | Soul Blade Force | 41 | 18 |
| C | Demon Blade Force | 63 | 18 |
| D | Ocean Blade Force | 85 | 18 |
| E | Sky Blade Force | 112 | 5 |

### 6. Killing Heaven Blade Series — `SKILL_CH_SWORD_DOWNATTACK_*` (stabs au sol)
Ne s'utilise que sur une cible **à terre** : le finisher du cycle KD. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Flower Bloom Blade | 19 | 10 |
| B | Flower Bud Blade | 45 | 9 |
| C | Dragon Sore Blade | 68 | 9 |
| D | Asura Cut Blade | 90 | 9 |
| E | Heavenly Blade | 110 | 5 |
| F | Mad Dragon Blade | 120 | 1 |

### 7. Sword Dance Series — `SKILL_CH_SWORD_SPECIAL_*` (AoE)
AoE de mêlée (l'un des 2 seuls AoE Bicheon). CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Snake Sword Dance | 31 | 18 |
| B | Petal Sword Dance | 54 | 18 |
| C | Typhoon Sword Dance | 76 | 18 |
| D | Chaotic Sword Dance | 98 | 12 |
| E | Heaven Sword Dance | 120 | 1 |

### 8. Bicheon Force Series — `SKILL_CH_SWORD_SHIELDPD_*` (ajout tardif)
Buffs lourds (CD 180 s) ajoutés avec les mises à jour de haut niveau. Cast 0,7 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Glacial Flame Bicheon Force | 20 | 6 |
| B | Storm Bicheon Force | 40 | 6 |
| C | Banshee Bicheon Force | 60 | 6 |
| D | Summit & Depth Bicheon Force | 80 | 6 |
| E | Celestial Ground Bicheon Force | 100 | 6 |
| F | Light Bearers Bicheon Force | 120 | 1 |

### 9. Passif — Shield Protection Series — `SKILL_CH_SWORD_PASSIVE_A` (maîtrise 10, 12 niveaux)
Augmente le **block ratio** (avec bouclier).

---

## 🗡️ Heuksal Mastery (Spear/Glaive)

**Groupe :** 258 · **Base :** ID 40 `SKILL_CH_SPEAR_BASE_01` · **Passif :** Cheolsam Force (HP max, maîtrise 10)

### 1. Série Pierce — `SKILL_CH_SPEAR_PIERCE_*`
Coups perforants simples. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Wolf Bite Spear | 5 | 9 |
| B | Waning Moon Spear | 27 | 9 |
| C | Yuhon Spear | 49 | 9 |
| D | Lightning Bird Spear | 71 | 9 |
| E | Celestial Cloud Spear | 93 | 9 |
| F | Asura Spear | 116 | 3 |

### 2. Storm Series (spin) — `SKILL_CH_SPEAR_SPIN_*`
Transforme l'attaque de base en **tourbillon AoE** permanent — cœur du farm glaive (« Bloody Fan Storm : à maxer »). CD 60 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Bloody Fan Storm | 7 | 12 |
| B | Bloody Wolf Storm | 29 | 12 |
| C | Bloody Snake Storm | 51 | 12 |
| D | Bloody Demon Storm | 73 | 8 |
| E | Bloody Ghost Storm | 98 | 8 |
| F | Bloody Emperor Storm | 105 | 6 |

### 3. Heuksal Spear Series — `SKILL_CH_SPEAR_FRONTAREA_*`
Enchaînements frontaux (multi-cibles devant). CD 3 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Dancing Demon Spear | 10 | 9 |
| B | Jade Breaking Spear | 32 | 9 |
| C | Spirit Crash Spear | 54 | 9 |
| D | Windless Spear | 76 | 9 |
| E | Death Bringer Spear | 98 | 7 |
| F | Pitch Black Spear | 116 | 3 |

### 4. Soul Departs Spear Series — `SKILL_CH_SPEAR_STUN_*` (stun !)
**Chance de stun** (« Soul Spear - Move : le meilleur stun du jeu, les bows le détestent »). CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Soul Spear - Move | 14 | 9 |
| B | Soul Spear - Truth | 36 | 9 |
| C | Soul Spear - Soul | 58 | 9 |
| D | Soul Spear - Emperor | 80 | 9 |
| E | Soul Spear - Destruction | 102 | 7 |
| F | Soul Spear - Emptiness | 120 | 1 |

### 5. Ghost Spear Attack Series — `SKILL_CH_SPEAR_ROUNDAREA_*` (AoE 360°)
Le grand AoE tournoyant de la lance. CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Ghost Spear - Petal | 19 | 9 |
| B | Ghost Spear - Prince | 41 | 9 |
| C | Ghost Spear - Mars | 63 | 9 |
| D | Ghost Spear - Storm Cloud | 85 | 9 |
| E | Ghost Spear - Emperor | 106 | 5 |
| F | Ghost Spear - Sea God | 120 | 1 |

### 6. Chain Spear Attack Series — `SKILL_CH_SPEAR_CHAIN_*`
Chaînes multi-hits (3-5 hits). CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Chain Spear - Tiger | 24 | 9 |
| B | Chain Spear - Nachal | 47 | 9 |
| C | Chain Spear - Shura | 47 | 9 |
| D | Chain Spear - Pluto | 69 | 9 |
| E | Chain Spear - Dragon | 69 | 22 |
| F | Chain Spear - Phoenix | 91 | 15 |
| G | Chain Spear - Heaven | 116 | 3 |

### 7. Flying Dragon Spear Series — `SKILL_CH_SPEAR_SHOOT_*` (distance)
Lancers de lance à distance. CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Flying Dragon - Flow | 31 | 9 |
| B | Flying Dragon - Fly | 54 | 9 |
| C | Flying Dragon - Bless | 76 | 9 |
| D | Flying Dragon - Flash | 98 | 10 |
| E | Flying Dragon - Sky | 120 | 1 |

### 8. Passif — Cheolsam Force Series — `SKILL_CH_SPEAR_PASSIVE_A` (maîtrise 10, 12 niveaux)
Augmente les **HP max** — considéré comme l'un des meilleurs passifs CH.

---

## 🏹 Pacheon Mastery (Bow)

**Groupe :** 259 · **Base :** ID 70 `SKILL_CH_BOW_BASE_01` · **Passif :** Mind Concentration (attack rating, maîtrise 10)

### 1. Anti Devil Bow Series — `SKILL_CH_BOW_CRITICAL_*` (critique)
Tirs mono-cible à forte chance de **critical**. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Anti Devil Bow - Missile | 5 | 9 |
| B | Anti Devil Bow - Wave | 27 | 9 |
| C | Anti Devil Bow - Steel | 49 | 9 |
| D | Anti Devil Bow - Strike | 71 | 9 |
| E | Anti Devil Bow - Annihilate | 90 | 9 |
| F | Anti Devil Bow - Demolition | 109 | 5 |
| G | Anti Devil Bow - Moon light | 120 | 1 |

### 2. Arrow Combo Attack Series — `SKILL_CH_BOW_CHAIN_*`
Volées simultanées de N flèches. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | 2 Arrow Combo | 7 | 9 |
| B | 3 Arrow Combo | 29 | 9 |
| C | 4 Arrow Combo | 51 | 9 |
| D | 5 Arrow Combo | 73 | 9 |
| E | 6 Arrow Combo | 94 | 9 |
| F | 7 Arrow Combo | 116 | 3 |

### 3. Hawk Summon Series — `SKILL_CH_BOW_CALL_*`
Invocations de faucons. CD 1 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | White Hawk Summon | 10 | 12 |
| B | Black Hawk Summon | 32 | 12 |
| C | Blue Hawk Summon | 54 | 12 |
| D | Lightning Hawk Summon | 76 | 12 |
| E | Ice Hawk | 104 | 7 |
| F | Fire Hawk | 120 | 1 |

### 4. Autumn Wind Arrow Series — `SKILL_CH_BOW_PIERCE_*` (perforantes)
Flèches qui **traversent les cibles en ligne**. CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Autumn Wind - Flame | 14 | 9 |
| B | Autumn Wind - Snake | 36 | 9 |
| C | Autumn Wind - Blood | 58 | 9 |
| D | Autumn Wind - Red | 80 | 9 |
| E | Autumn Wind - Devil | 102 | 7 |
| F | Autumn Wind - Dragon | 120 | 1 |

### 5. Soul Arrow Series — `SKILL_CH_BOW_NORMAL_*` (portée)
Buff qui **augmente la portée** de l'arc (« must have » du bow ; au moins 1 niveau de Dragon Soul Arrow conseillé). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Demon Soul Arrow | 19 | 5 |
| B | Bloody Soul Arrow | 41 | 5 |
| C | Dragon Soul Arrow | 63 | 5 |
| D | Phoenix Soul Arrow | 85 | 5 |
| E | Ice Hawk Soul Arrow | 112 | 3 |

### 6. Explosion Arrow Series — `SKILL_CH_BOW_AREA_*` (AoE)
Flèches explosives AoE. CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Berserker Arrow | 25 | 9 |
| B | Demon Arrow | 47 | 9 |
| C | Devil Arrow | 69 | 9 |
| D | Celestial Beast Arrow | 91 | 9 |
| E | Pitch Black Arrow | 116 | 3 |

### 7. Strong Bow Series — `SKILL_CH_BOW_POWER_*`
Tirs chargés à gros dégâts. CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Strong Bow - Spirit | 31 | 9 |
| B | Strong Bow - Vision | 54 | 9 |
| C | Strong Bow - Craft | 76 | 9 |
| D | Strong Bow - Will | 98 | 9 |
| E | Strong Bow - Destruction | 120 | 1 |

### 8. Mind Bow Series — `SKILL_CH_BOW_SPECIAL_*` (360°)
Attaque **omnidirectionnelle** touchant 3-6 cibles autour de soi — le plan B anti-mêlée. CD 8 s (6 s ajusté sur Origin).

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Mind Bow - Flower | 25 | 6 |
| B | Mind Bow - Butterfly | 50 | 6 |
| C | Mind Bow - Swift | 75 | 6 |
| D | Mind Bow - Lighting | 100 | 6 |

### 9. Passif — Mind Concentration — `SKILL_CH_BOW_PASSIVE_A` (maîtrise 10, 12 niveaux)
Augmente l'**attack rating** (précision) — utile surtout aux builds INT/hybrides.

---

## ❄️ Cold Mastery (Ice)

**Groupe :** 277 (`SKILL_CH_COLD_*`) · **Passif :** Cold Armor (DEF PHY, maîtrise 10)

### 1. Cold Force Series (imbue) — `SKILL_CH_COLD_GIGONGTA_*`
Imbue glace : dégâts magiques ajoutés aux attaques + **Frostbite** (~40%) / **Freeze** (~20%).

| Livre | Skill | Maîtrise | CD | Niv. |
|---|---|---|---|---|
| A | Ice River Force | 5 | 6 s | 9 |
| B | Ice Jade Force | 25 | 9 s | 9 |
| C | Ice Ocean Force | 45 | 12 s | 9 |
| D | Ice Cloud Force | 65 | 15 s | 15 |
| E | Ice Air Force | 98 | 18 s | 9 |
| F | Ice final Force | 120 | 21 s | 1 |

### 2. Frost Guard Series — `SKILL_CH_COLD_GANGGI_*`
Buff **défense physique** (quasi permanent). CD 2 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Weak Guard of Ice | 8 | 9 |
| B | Soft Guard of Ice | 28 | 9 |
| C | Power Guard of Ice | 48 | 9 |
| D | Might Guard of Ice | 68 | 15 |
| E | Final Guard of Ice | 102 | 10 |

### 3. Cold Wave Series — `SKILL_CH_COLD_GIGONGJANG_*` (gel à distance)
Attaque magique qui **gèle à distance** (freeze). CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Cold wave - Arrest | 12 | 6 |
| B | Cold wave - Binding | 32 | 6 |
| C | Cold wave - Shackle | 52 | 6 |
| D | Cold Wave - Freeze | 72 | 10 |
| E | Cold Wave - Soul | 106 | 5 |

### 4. Frost Wall Series — `SKILL_CH_COLD_BINGBYEOK_*`
Invoque un **mur** : absorbe les dégâts ET bloque le passage. CD 10 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Crystal Wall | 17 | 6 |
| B | Snow Wall | 37 | 6 |
| C | Extreme Wall | 57 | 6 |
| D | Iceberg Wall | 77 | 10 |
| E | Spikey Wall | 111 | 4 |

### 5. Frost Nova Series — `SKILL_CH_COLD_BINGPAN_*` (AoE gel)
AoE de gel autour du lanceur (« Blizzard », attaque principale des Ice avec l'imbue). CD 6 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Frost Nova - Wind | 23 | 12 |
| B | Frost Nova - Woods | 43 | 12 |
| C | Frost Nova - Storm | 63 | 12 |
| D | Frost Nova - Ice Field | 83 | 12 |
| E | Frost Nova - destruction | 114 | 3 |

### 6. Snow Storm Series — `SKILL_CH_COLD_GIGONGSUL_*` (nuke)
Le nuke Cold : dégâts les plus faibles des 3 éléments, mais **grosse AoE** + gel.

| Livre | Skill | Maîtrise | CD | Niv. |
|---|---|---|---|---|
| A | Snow Storm - Ice shot | 30 | 4 s | 18 |
| B | Snow Storm - Ice rain | 50 | 10 s | 18 |
| C | Snow Storm - Double Shot | 70 | 10 s | 22 |
| D | Snow Storm - Multi Shot | 90 | 10 s | 16 |
| E | Snow Storm - destruction | 118 | 10 s | 2 |

### 7. Snow Shield Series — `SKILL_CH_COLD_SHIELD_*`
Bouclier de mana : **les dégâts sont absorbés par le MP** (cd 180 s) — vital pour les nukers INT.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Snow Shield - Novice | 20 | 6 |
| B | Snow Shield - Adept | 40 | 6 |
| C | Snow Shield - Freeze | 60 | 6 |
| D | Snow Shield - Intensify | 80 | 6 |
| E | Snow Shield - Swift | 100 | 6 |
| F | Snow Shield _ Death | 120 | 1 |

### 8. Passif — Cold Armor Series — `SKILL_CH_COLD_PASSIVE_A` (maîtrise 10, 12 niveaux)
+ DEF physique permanente (~+27 DEF au max — modeste).

---

## ⚡ Lightning Mastery

**Groupe :** 277 (`SKILL_CH_LIGHTNING_*`) · **Passif :** Heaven's Force (parry ratio, maîtrise 10)

### 1. Thunder Force Series (imbue) — `SKILL_CH_LIGHTNING_GIGONGTA_*`
Imbue foudre : dégâts intermédiaires + **shock** (réduit le parry ratio de la cible) + splash.

| Livre | Skill | Maîtrise | CD | Niv. |
|---|---|---|---|---|
| A | Thunder Tiger Force | 5 | 6 s | 9 |
| B | Thunder Sky Force | 25 | 9 s | 9 |
| C | Thunder King Force | 45 | 12 s | 9 |
| D | Thunder Dragon Force | 65 | 15 s | 15 |
| E | Thunder Phoenix Force | 98 | 18 s | 9 |
| F | Thunder God Force | 120 | 21 s | 1 |

### 2. Piercing Force Series — `SKILL_CH_LIGHTNING_GWANTONG_*`
Buff **% attaque magique** (+5% au début, >10% aux hauts niveaux) — le buff nuker par excellence. CD 3 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Must - Piercing Force | 8 | 3 |
| B | Flow - Piercing Force | 28 | 3 |
| C | Speed - Piercing Force | 48 | 3 |
| D | Force - Piercing Force | 68 | 3 |
| E | God - Piercing Force | 102 | 3 |

### 3. Wind Walk Series — `SKILL_CH_LIGHTNING_GYEONGGONG_*`
Buffs de déplacement : Grass Walk = +vitesse (≈ +50%), **Ghost Walk = téléportation** courte. CD 2-5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Grass Walk - Flow | 12 | 12 |
| B | Ghost Walk - phantom | 32 | 12 |
| C | Grass Walk - Speed | 52 | 12 |
| D | Ghost Walk - Shadow | 72 | 8 |
| E | Ghost Walk - God | 92 | 8 |

### 4. Lion Shout Series — `SKILL_CH_LIGHTNING_CHUNDUNG_*` (mini-nuke)
Nukes rapides à petit cooldown — ⚠️ **linkages de CD** : Shock/Earth/Execution partagent un groupe, Heaven/Power un autre (officiel Origin). CD 4 s (3 s sur les derniers livres).

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Shock Lion Shout | 17 | 9 |
| B | Heaven Lion Shout | 37 | 9 |
| C | Earth Lion Shout | 57 | 9 |
| D | Power Lion Shout | 77 | 9 |
| E | Execution Lion Shout | 98 | 9 |
| F | God Lion Shout | 120 | 1 |

### 5. Concentration Series — `SKILL_CH_LIGHTNING_JIPJUNG_*`
Buff **parry ratio** (longue durée). CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Concentration - 1st | 23 | 6 |
| B | Concentration - 2nd | 43 | 6 |
| C | Concentration - 3rd | 63 | 6 |
| D | Concentration - 4th | 83 | 9 |
| E | Concentration - 5th | 114 | 3 |

### 6. Thunderbolt Force Series — `SKILL_CH_LIGHTNING_STORM_*` (nuke)
Le nuke Lightning : dégâts intermédiaires, cast rapide. CD 6 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Wolf's Thunderbolt | 30 | 9 |
| B | Tiger's Thunderbolt | 50 | 9 |
| C | Horse's Thunderbolt | 70 | 9 |
| D | Crane's Thunderbolt | 90 | 9 |
| E | God's Thunderbolt | 116 | 3 |

### 7. Passif — Heaven's Force Series — `SKILL_CH_LIGHTNING_PASSIVE_A` (maîtrise 10, 12 niveaux)
+ **parry ratio** permanent.

---

## 🔥 Fire Mastery

**Groupe :** 277 (`SKILL_CH_FIRE_*`) · **Passif :** Flame Devil Force (ATK PHY, maîtrise 10)

### 1. Fire Force Series (imbue) — `SKILL_CH_FIRE_GIGONGTA_*`
L'imbue la plus forte : + gros dégâts magiques + **Burn** (DoT ~6 s ; probabilité 25% au lv1 du livre A, croît avec le niveau).

| Livre | Skill | Maîtrise | CD | Niv. |
|---|---|---|---|---|
| A | River Fire force | 5 | 6 s | 9 |
| B | Extreme Fire force | 25 | 9 s | 9 |
| C | Poison Fire force | 45 | 12 s | 9 |
| D | Soul Fire force | 65 | 15 s | 15 |
| E | Cloud Fire force | 98 | 18 s | 9 |
| F | God Fire Force | 120 | 21 s | 1 |

### 2. Fire Shield Series — `SKILL_CH_FIRE_SHIELD_*`
Buff **anti-statuts** : réduit durée/ampleur de Burn, Shock, Frostbite, Freeze… (~50% au max = −76 unités d'effet). Cast 2 s, CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Fire Shield - Phoenix | 8 | 6 |
| B | Fire Shield - Flower | 28 | 6 |
| C | Fire Shield - King | 48 | 6 |
| D | Fire Shield - Emperor | 68 | 6 |

### 3. Flame Body Series — `SKILL_CH_FIRE_GONGUP_*`
Buff **% attaque physique** (3 niveaux par livre). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Flame body - Wisdom | 12 | 3 |
| B | Flame body - Power | 32 | 3 |
| C | Flame body - Extreme | 52 | 3 |
| D | Flame Body - Trial | 72 | 3 |
| E | Flame Body - God | 106 | 3 |

### 4. Fire Protection Series — `SKILL_CH_FIRE_GANGGI_*`
Buff **défense magique** — la réponse aux nukers. CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Basic Fire protection | 17 | 9 |
| B | Divine Fire protection | 37 | 9 |
| C | Hard Fire protection | 57 | 9 |
| D | Earth Fire Protection | 77 | 15 |
| E | God Fire Protection | 110 | 6 |

### 5. Fire Wall Series — `SKILL_CH_FIRE_HWABYEOK_*`
Mur de feu : absorbe + bloque le passage (comme Frost Wall). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Fire Wall - Tower | 23 | 6 |
| B | Fire Wall - Mountain | 43 | 6 |
| C | Fire Wall - Castle | 63 | 6 |
| D | Fire Wall - Fortress | 83 | 6 |
| E | Fire Wall - God | 103 | 6 |

### 6. Flame Wave Series — `SKILL_CH_FIRE_GIGONGSUL_*` (nuke)
**Le nuke le plus puissant du jeu CH** (« dégâts élevés, AoE réduite »).

| Livre | Skill | Maîtrise | CD | Niv. |
|---|---|---|---|---|
| A | Flame Wave - Arrow | 30 | 4 s | 18 |
| B | Flame Wave - Burning | 43 | 6 s | 18 |
| C | Flame Wave - Wide | 56 | 10 s | 18 |
| D | Flame Wave - Bomb | 70 | 4 s | 22 |
| E | Flame Wave - HellFire | 83 | 6 s | 19 |
| F | Flame Wave - Disintegrate | 96 | 10 s | 13 |
| G | Flame Wave - God | 118 | 4 s | 2 |

### 7. Fire Combustion Series — `SKILL_CH_FIRE_DESCRY_*` / `SKILL_CH_FIRE_DETECT_*`
Buffs de récupération de MP (CD 180 s), en deux lignes.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| DESCRY A | Fire Combustion - Firefly | 30 | 5 |
| DESCRY B | Fire Combustion - Light | 80 | 5 |
| DETECT A | Vision Fire Combustion | 30 | 7 |
| DETECT B | Sunrise combustion | 100 | 3 |

### 8. Passif — Flame Devil Force Series — `SKILL_CH_FIRE_PASSIVE_A` (maîtrise 10, 12 niveaux)
+ **attaque physique** permanente.

---

## 💪 Force Mastery (« Water »)

**Groupe :** 276 (`SKILL_CH_WATER_*`) · **Passif :** Force Increasing (MP max, maîtrise 10) · Aucun dégât direct — soutien pur.

### 1. Self Heal Series — `SKILL_CH_WATER_SELFHEAL_*`
Auto-heal. CD 2,1 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Self Breathe Heal | 5 | 9 |
| B | Self Force Heal | 25 | 9 |
| C | Self Wounds Heal | 45 | 9 |
| D | Self Vital Heal | 65 | 15 |
| E | Self Breathing Heal | 98 | 9 |
| F | God Heal | 120 | 1 |

### 2. Force Cure Series — `SKILL_CH_WATER_CURE_*`
Dissipe les statuts (poison, burn, freeze, etc. — ce que les pilules universelles ne nettoient pas). CD 2,1 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Force Cure - Poison | 8 | 6 |
| B | Force Cure - Body | 28 | 6 |
| C | Force Cure - Condiion [sic] | 48 | 6 |
| D | Force Cure - Vital | 68 | 6 |
| E | Force Cure - Meditation | 88 | 6 |
| F | Force Cure - overall | 108 | 5 |

### 3. Heal Series — `SKILL_CH_WATER_HEAL_*`
Heal d'une cible (les « mains »). CD 3 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Heal - Medical Hand | 12 | 9 |
| B | Heal - Ghost Hand | 32 | 9 |
| C | Heal - Taoist Hand | 52 | 9 |
| D | Heal - Mysterious Hand | 72 | 9 |
| E | Heal - Full Hand | 94 | 9 |
| F | Heal - overall | 116 | 3 |

### 4. Rebirth Art Series (résurrection) — `SKILL_CH_WATER_RESURRECTION_*`
Ressuscite un joueur (% d'XP restitué croissant). CD 4-4,5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Soul Rebirth Art | 17 | 6 |
| B | Ghost Rebirth Art | 37 | 6 |
| C | Spirit Rebirth Art | 57 | 6 |
| D | Return Rebirth Art | 77 | 6 |
| E | Godly Rebirth Art | 102 | 4 |

### 5. Harmony Therapy Series — `SKILL_CH_WATER_HARMONY_*`
Soins/régénération prolongés (HoT) — CD 300 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Harmony Therapy | 23 | 6 |
| B | Adaptation Therapy | 43 | 6 |
| C | Whole Therapy | 63 | 6 |
| D | Source Therapy | 83 | 6 |
| E | Main Therapy | 116 | 3 |

### 6. Vital Spot Attack Series (debuffs) — `SKILL_CH_WATER_CANCEL_*`
Debuffs mono-cible : Muscle (−ATK PHY), Spirit (−ATK MAG), Body/**Decay**, Mind/**Weaken**, Zero/**Impotent**, Brain/**Division** (probabilité 100% sur les premiers livres, 80% sur Origin ajusté). CD 2 s (livres avancés 20 s).

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Vital Spot - Muscle | 30 | 12 |
| B | Vital Spot - Spirit | 50 | 10 |
| C | Vital Spot - Body | 60 | 7 |
| D | Vital Spot - Mind | 70 | 6 |
| E | Vital Spot - Zero | 80 | 5 |
| F | Vital Spot - Brain | 90 | 4 |
| G | Vital Spot - Faint | 110 | 2 |

### 7. Cure Therapy Series — `SKILL_CH_WATER_CUREAREA_*` (+ `ABNORMAL`)
Cure de zone. CD 30 s (Heaven : 60 s).

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Cure Therapy - Pure | 30 | 3 |
| B | Cure Therapy - Protection | 60 | 3 |
| C | Cure Therapy - Clarity | 90 | 4 |
| ABNORMAL A | Cure Therapy - Heaven | 76 | 5 |

### 8. Vital Flow Series — `SKILL_CH_WATER_PHYSICAL_*` / `SKILL_CH_WATER_MAGICAL_*`
Récupération HP (Move/Strength) et MP (Intellect/Circulate). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| PHYSICAL A | Vital Flow - Move | 30 | 8 |
| PHYSICAL B | Vital Flow - Strength | 80 | 7 |
| MAGICAL A | Vital Flow - Intellect | 40 | 8 |
| MAGICAL B | Vital Flow - Circulate | 90 | 6 |

### 9. Passif — Force Increasing Series — `SKILL_CH_WATER_PASSIVE_A` (maîtrise 10, 12 niveaux)
+ **MP maximum**.

---

## 📊 Puissances de Skills (Origin Mobile)

Valeurs « Skill Power » officielles (Silkroad Origin Mobile, base iSRO — **valeurs relatives de dégâts**, retouchées par Joymax pour mobile ; à utiliser comme ordre de grandeur, pas comme données client) :

| Skill | Puissance | Skill | Puissance |
|---|---|---|---|
| Stab Smash | 160 | Ghost Spear - Mars | 414 |
| Crosswise Smash | 200 | Ghost Spear - Storm Cloud | 437 |
| Flying Stone Smash | 184 | Ghost Spear - Emperor | 427 |
| Twin Energy Smash | 216 | Ghost Spear - Sea God | 440 |
| Billow Chain | 340 | Chain Spear - Dragon | **516** |
| Ascension Chain | 304 | Chain Spear - Phoenix | 387 |
| Heaven Chain | **460** | Flying Dragon - Flash | 310 |
| Lightning Chain | 384 | Flying Dragon - Sky | 320 |
| Thousand Army Chain | **480** | Spirit Crash Spear | 281 |
| Demon Blade Force | 250 | Windless Spear | 289 |
| Ocean Blade Force | 250 | Death Bringer Spear | 295 |
| Asura Cut Blade | 200 | Soul Spear - Soul | 234 |
| Snake Sword Dance | 300 | Soul Spear - Emperor | 240 |
| Petal Sword Dance | 260 | Soul Spear - Emptiness | 245 |
| Typhoon Sword Dance | 278 | Anti Devil Bow - Strike | 100 |
| Chaotic Sword Dance | 284 | Anti Devil Bow - Annihilate | 110 |
| Mind Bow - Flower | 87 → 187 (buff ×2,1) | 4 Arrow Combo | 146 |
| Snow Storm - Double Shot | 250 | 6 Arrow Combo | 210-275 |
| Snow Storm - Multi Shot | 300 | Autumn Wind - Red | 158 |
| Shock Lion Shout | 92 | Autumn Wind - Devil | 164 |
| Heaven Lion Shout | 87 | Autumn Wind - Dragon | 170 |
| Wolf's Thunderbolt | 300 | Devil Arrow | 152-168 |
| Flame Wave - Wide | 300 | Celestial Beast Arrow | 165-174 |
| Flame Wave - Bomb | 263 | Strong Bow - Vision | 100 |
| Flame Wave - HellFire | 315 | Strong Bow - Craft | 110 |
| Flame Wave - Disintegrate | **330** | Strong Bow - Will | 120 |

> Lectures : les chaînes d'arme sont les skills les plus « puissants » en valeur brute (mais lentes, 8 s de CD) ; Flame Wave reste le meilleur nuke élémentaire ; Anti Devil/Strong Bow sont faibles en base mais jouent sur **critique/charge**.

---

## 🧪 Statuts et Imbues

| Statut | Source | Effet | Données |
|---|---|---|---|
| **Burn** | Imbue Fire, Flame Wave | DoT feu (ticks aléatoires, montent avec le niveau du skill) | 25% de prob. au lv1 livre A, ~6 s (70 unités) |
| **Frostbite** | Imbue Cold | Réduit vitesse d'attaque ET de déplacement | ~40% de prob. |
| **Freezing** | Imbue Cold, Cold Wave, Frost Nova | Immobilise totalement | ~20% de prob. |
| **Shock** | Imbue Lightning | Réduit le **parry ratio** de la cible | % variable par niveau |
| **Stun** | Soul Departs Spear (chance) | État (pas un « effet ») : **aucune pilule** ne le retire | % par niveau du skill |
| Decay / Weaken / Impotent / Division | Vital Spot (Force) | Debuffs nommés (−ATK PHY/MAG etc.) | 100% (80% ajusté Origin) |
| Poison / Zombie | Monstres | DoT / soins inversés | nettoyés par pilules ou Force Cure |

- **Pilules** : small/medium/large soignent ~33/50/76 unités d'effet. **Freeze et Burn résistent aux pilules universelles** → Force Cure.
- **Une seule imbue active** (toggle, CD = durée de réactivation 6→21 s selon le livre).

---

## 💰 Coûts SP et Progression

- **400 skill exp = 1 SP** (constante).
- Coût SP d'un niveau de skill = valeur de la table au **(maîtrise requise + 1)**. Exemples : Wind Walk lv1 (maîtrise 12) ≈ 15 SP ; maîtrise 11→12 ≈ 12 SP ; les hauts livres coûtent des centaines à milliers de SP par niveau.
- Palier de déverrouillage d'un niveau de skill : **+2 niveaux de maîtrise** (ex. Strike Smash : lv1@5, lv2@7, lv3@9… lv9@21 ; un guide GameFAQs 2008 mentionne « Illusion Chain lvl 9 vers le niveau 61 », cohérent avec les paliers +2 des livres successifs de la série Chain).
- SP cumulé (guide UnKnoWnCheaTs) : lvl 30 → 3 911 SP (GAP 0) à 75 074 SP (GAP 9) ; lvl 60 → 9 884 à 189 675 SP.
- Estimations « fully farmed » cap 80 : glaive ~80k, bow ~90-100k, blader ~200k SP.
- Reskill : quête Skill Resuscitation (lvl 20+, 10 cœurs maudits → potion, **80% du SP remboursé**).

---

## ⚠️ Données Manquantes / Incertitudes

1. **Dégâts min/max exacts et coûts MP par niveau** : non présents dans `skills.txt` (le fichier ne porte que cast/CD/niveaux). À extraire de `skilldata_5000.txt` ou de la table `_RefSkill` (colonnes `InitialMinDamage/InitialMaxDamage`, `ConsumeMP`, `DownBySP`…). Les « Skill Power » Origin Mobile ci-dessus sont des **proxy relatifs**, pas les valeurs client.
2. **% exacts d'imbue par palier** : seuls Burn 25%/lv1, Frostbite ~40%, Freeze ~20% sont documentés ; la courbe par niveau reste à extraire.
3. **SP exact par skill** : formule confirmée (table à maîtrise+1) mais la table complète n'est pas reproduite ici.
4. **Effets des séries tardives** (Bicheon Force `SHIELDPD`, Fire Combustion `DESCRY/DETECT`, Vital Flow, Cure Therapy - Heaven) : rôles déduits des cooldowns/noms et de guides partiels — à confirmer en jeu ou via skilldata.
5. **Noms de séries non confirmés officiellement** : série Pierce Heuksal et série Storm (spin) ; noms officiels affichés manquent pour ces deux colonnes.
6. **Noms KSRO** : non trouvés lors de cette recherche ; utiliser les codenames (identiques partout) comme clé de référence — recommandation forte pour SRObro.
7. La colonne « Cast » des chaînes multi-hits correspond à la valeur client du premier hit (interprétation probable : fenêtre de temps/animation) — à re-vérifier avec skilldata_5000 (colonnes `ActionPeriod`/`CastTime`).

---

## 🔗 Resources

- [tarekwiz/SilkroadBot — skills.txt (données client, GitHub)](https://github.com/tarekwiz/SilkroadBot/blob/master/Silkroad%20Fusion/bin/Debug/Data/skills.txt) — source des séries/livres/maîtrises/CD
- [Silkroad Origin Mobile — Class Balance Adjustments](https://sromobile.com/en/news/updates/class-balance-adjustments) — noms de séries officiels + Skill Power + linkages CD
- [UnKnoWnCheaTs — Complete Guide to Skill Points](https://unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points) — mécanique SP/GAP/caps
- [UnKnoWnCheaTs — SRO General Tips and Stats](https://www.unknowncheats.me/forum/silkroad/38774-sro-tips-stats.html) — imbues/statuts/pilules
- [UnKnoWnCheaTs — Building Blade Guide](https://www.unknowncheats.me/wiki/Silkroad:Building_Blade_Guide) — rôles des séries Bicheon/Cold/Lightning
- [SilkroadForums — PURE STR BUILD](http://www.silkroadforums.com/viewtopic.php?f=5&t=82222) — priorités de skills, SP, combos
- [Silkroad Online Wiki (Fandom) — Skills](https://silkroadonline.fandom.com/wiki/Skills) — cap 360, gap
- [DaxterSoul (DummkopfOfHachtenduden) — SilkroadDoc](https://github.com/DummkopfOfHachtenduden/SilkroadDoc) — formats (skilldata/_RefSkill) pour extraire les chiffres manquants
- [Ex-o — Silkroad-Database-Documentation](https://github.com/Ex-o/Silkroad-Database-Documentation) / [JellyBitz — SR_Db2Media](https://github.com/JellyBitz/SR_Db2Media) — pipelines BDD→client

---

*Dernière mise à jour : 2026-10-01*
*Sources : skills.txt client (GitHub SilkroadBot), Silkroad Origin Mobile (officiel), UnKnoWnCheaTs, SilkroadForums, Fandom, StrategyWiki, elitepvpers, Reddit r/silkroadonline. Voir section « Données Manquantes » avant d'utiliser les chiffres comme références absolues.*
