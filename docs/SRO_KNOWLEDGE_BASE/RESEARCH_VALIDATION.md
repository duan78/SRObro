# Research Validation Protocol

## 📋 Overview
This document outlines the fact-checking and validation protocol for all multilingual research conducted for the SRObro documentation. All information must be validated before integration into the main documentation.

---

## 🏆 Reliability Tiers

### Tier 1: Official Sources (Confidence 5/5)
**Definition**: Information from official game developers, publishers, or verified sources.

**Examples**:
- Official patch notes
- Developer statements/interviews
- Official game guides
- Publisher announcements

**Validation Process**:
- ✅ Automatically trusted as accurate
- ✅ Record source URL and date
- ✅ Cross-reference with other official sources when possible
- ✅ Note any discrepancies between regions

**Acceptance Criteria**: Information can be directly integrated with "Official" tag.

---

### Tier 2: Reputable Community Sources (Confidence 4/5)
**Definition**: Information from established, well-maintained community resources with editorial oversight.

**Examples**:
- Major wikis (Fandom, dedicated SRO wikis)
- Established fan sites with active moderation
- Officially recognized community guides
- Data mining projects with source code

**Validation Process**:
- ✅ Check source reputation and activity
- ✅ Verify information has community consensus
- ✅ Cross-reference with other Tier 2 sources
- ✅ Check for recent updates/edits

**Acceptance Criteria**: Can be integrated when corroborated by 2+ Tier 2 sources or 1 Tier 1 source.

---

### Tier 3: Community-Validated Content (Confidence 3-4/5)
**Definition**: Information from community posts with significant engagement and positive feedback.

**Examples**:
- Forum posts with 50+ upvotes/helpful marks
- Guides with 100+ positive replies
- Discord discussions with community agreement
- YouTube videos with 1000+ views and positive engagement

**Validation Process**:
- ⚠️ Check engagement metrics (upvotes, replies, views)
- ⚠️ Verify poster reputation/history
- ⚠️ Look for counter-arguments or debunking
- ⚠️ Cross-reference with Tier 2 sources
- ⚠️ Test in-game when possible

**Acceptance Criteria**: Requires validation from 2+ Tier 3 sources OR 1 Tier 2 source.

---

### Tier 4: Individual Guides/Posts (Confidence 2-3/5)
**Definition**: Information from individual creators without significant community validation.

**Examples**:
- Personal blog posts
- Low-engagement forum posts
- New YouTube channels
- Individual Discord messages

**Validation Process**:
- ❌ **Never accept alone**
- ❌ Must be corroborated by 2+ sources (any tier)
- ❌ Test in-game when possible
- ❌ Verify against known game mechanics
- ❌ Label as "Unverified" if used

**Acceptance Criteria**: Only for inspiration/research leads; must be validated by higher-tier sources before integration.

---

## 🔄 Cross-Validation Protocol

### Three-Language Agreement (Confidence 5/5)
**When information is consistent across Korean, Turkish, and English sources:**

1. Mark as **"✅ Verified (Multilingual)"**
2. Assign confidence **5/5**
3. Integrate into documentation with all source attributions
4. Note any regional differences

**Example**:
```
Critical hit formula confirmed by:
- 🇰🇷 Korean official patch notes (Tier 1)
- 🇹🇷 Turkish community guide (Tier 2)
- 🇺🇸 English data mining (Tier 2)

Status: ✅ Verified
Confidence: 5/5
```

---

### Two-Language Agreement (Confidence 4/5)
**When information is consistent across two languages:**

1. Mark as **"✅ Likely (Bilingual)"**
2. Assign confidence **4/5**
3. Integrate with note: "Confirmed by X and Y sources"
4. Flag for third-language verification

**Example**:
```
Alchemy success rate reported by:
- 🇰🇷 Korean wiki (Tier 2)
- 🇹🇷 Turkish forum (Tier 3)

Status: ✅ Likely
Confidence: 4/5
Note: Awaiting English source confirmation
```

---

### Single Language Source (Confidence 2-3/5)
**When information exists in only one language:**

1. Mark as **"⚠️ Requires Verification"**
2. Assign confidence **3/5** (if Tier 2-3) or **2/5** (if Tier 4)
3. Do NOT integrate into main documentation
4. Add to research queue for other languages
5. Note in working files only

**Example**:
```
PvP tier list found in:
- 🇹🇷 Turkish forum post (Tier 3)

Status: ⚠️ Requires Verification
Confidence: 3/5
Action: Search Korean and English sources
```

---

### Conflicting Information (Confidence Variable)
**When sources disagree:**

1. Mark as **"❌ Disputed"**
2. Document all conflicting claims
3. Investigate reasons for conflict:
   - Regional differences (iSRO vs kSRO vs private servers)
   - Version changes (old patches vs current)
   - Context differences (PvP vs PvE)
   - Translation errors
4. Seek Tier 1 sources for resolution
5. If unresolvable, document all versions with context

**Example**:
```
Attack speed breakpoints:
- 🇰🇷 Korean source: 64, 86, 110
- 🇺🇸 English source: 65, 87, 111
- 🇹🇷 Turkish source: 64, 86, 110

Status: ❌ Disputed
Resolution: Korean and Turkish agree (2/3), likely correct.
English source may have rounding error.
Confidence: 4/5
```

---

## ✅ Validation Checklist

### Before Integrating Information

**Source Verification**:
- [ ] Source URL is accessible and valid
- [ ] Source is still active (or archived if inactive)
- [ ] Source tier is determined (1-4)
- [ ] Source date is recent (or contextualized if old)

**Information Quality**:
- [ ] Information is specific and quantifiable
- [ ] Information is complete (not partial/ambiguous)
- [ ] Information is relevant to current game version
- [ ] Information is applicable to target context (PvP/PvE, server type)

**Cross-Validation**:
- [ ] Verified against 2+ sources if Tier 3-4
- [ ] Checked for conflicts with known information
- [ ] Tested in-game when possible
- [ ] Translated accurately (if non-English)

**Attribution**:
- [ ] Source language indicated (🇰🇷/🇹🇷/🇺🇸)
- [ ] Source URL included
- [ ] Confidence level assigned (1-5)
- [ ] Last verified date recorded

---

## 📊 Confidence Scoring System

### Score Criteria

| Score | Description | Integration Status |
|-------|-------------|-------------------|
| **5/5** | Official or multilingual verified (3+ languages agree) | ✅ Integrate immediately |
| **4/5** | High confidence (2 languages agree or Tier 1 + Tier 2) | ✅ Integrate with notes |
| **3/5** | Moderate confidence (1 Tier 2-3 source) | ⚠️ Use with caution, mark as "Unverified" |
| **2/5** | Low confidence (unverified Tier 4 source) | ❌ Do not integrate, research only |
| **1/5** | Rumor/speculation only | ❌ Use as research leads only |

### Adjusting Scores

**Increase Confidence**:
- +1 if corroborated by another source
- +1 if verified by in-game testing
- +1 if confirmed by Tier 1 source

**Decrease Confidence**:
- -1 if information is outdated (old patch)
- -1 if source has poor reputation
- -1 if contradicted by higher-tier source

---

## 🧪 Testing Protocol

### In-Game Verification

**When to Test**:
- Critical formulas (damage, alchemy, etc.)
- Conflicting information
- New or unusual claims
- Tier 3-4 sources

**Testing Requirements**:
- [ ] Document test methodology
- [ ] Use controlled conditions
- [ ] Repeat tests (minimum 10 trials)
- [ ] Record all results
- [ ] Calculate statistical significance
- [ ] Note server-specific factors (rates, mods)

**Test Documentation Template**:
```
Test: [What was tested]
Date: YYYY-MM-DD
Server: [Server name, rates]
Methodology: [Test procedure]
Trials: X
Results: [Data collected]
Conclusion: [Findings]
Confidence: X/5
```

---

## 🌐 Translation Quality Standards

### Translation Accuracy

**Tier 1 Sources**:
- Accept official translations
- If multiple official translations exist, note all versions

**Tier 2-4 Sources**:
- Verify translations with native speakers when possible
- Cross-check technical terms against MULTILINGUAL_GLOSSARY.md
- Note translation uncertainties
- Provide original text alongside translation when possible

### Machine Translation
- Use only for initial research (finding sources)
- Never rely on machine translation for final content
- All critical information must be verified by:
  - Native speaker review, OR
  - Multiple independent translations, OR
  - Cross-referencing with other sources

---

## 🚫 Red Flags: When to Reject Information

**Immediate Rejection Criteria**:

1. **Impossible Game Mechanics**
   - Violates known game laws
   - Contradicts fundamental systems
   - Example: "Hit level cap in 1 hour" on official rates

2. **Outdated Information**
   - From patches >2 years old without context
   - References removed content without noting removal

3. **Server-Specific Without Context**
   - Private server features presented as universal
   - Custom rates not clearly labeled

4. **Obvious Errors**
   - Mathematical impossibilities
   - Logical contradictions
   - Factually wrong information

5. **Promotional Content**
   - Server advertisements disguised as guides
   - Pay-to-win promotions
   - Biased comparisons

**Red Flag Handling**:
- Document why information was rejected
- Note the red flag in RESEARCH_LOG.md
- Keep source URL in case information becomes relevant later

---

## 🔄 Dispute Resolution

### When Sources Conflict

**Step 1: Contextualize**
- Check for regional differences (iSRO, kSRO, private servers)
- Check for version differences (old vs new patches)
- Check for context differences (PvP vs PvE)

**Step 2: Prioritize**
- Tier 1 > Tier 2 > Tier 3 > Tier 4
- More recent > Older
- More specific > General

**Step 3: Investigate**
- Search for additional sources
- Test in-game when possible
- Consult with community experts

**Step 4: Document**
- Record all conflicting versions
- Explain which version was accepted and why
- Note ongoing disputes if unresolvable

---

## 📝 Validation Log Template

```markdown
### VALIDATION-YYYY-MM-DD-XX
**Entry**: RES-YYYY-MM-DD-XX
**Information**: [Brief description]
**Sources Checked**: [List sources with tiers]

**Cross-Validation**:
- [ ] Korean sources
- [ ] Turkish sources
- [ ] English sources

**Confidence Score**: X/5
**Resolution**: ✅ Verified / ✅ Likely / ⚠️ Unverified / ❌ Disputed

**Notes**:
[Validation process, decisions made, any concerns]
```

---

## 🔗 Related Files
- [RESEARCH_LOG.md](./RESEARCH_LOG.md) - Central research tracking
- [RESEARCH_SOURCES.md](./RESEARCH_SOURCES.md) - Source database
- [MULTILINGUAL_GLOSSARY.md](./MULTILINGUAL_GLOSSARY.md) - Terminology

---

**Last Updated**: 2025-01-22
**Maintained by**: SRObro Documentation Team
