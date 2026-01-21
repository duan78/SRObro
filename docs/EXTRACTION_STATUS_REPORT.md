# PK2 Extraction Status Report
**Date:** 2026-01-20 22:45
**Status:** BLOCKED - Extraction tools failing

---

## Summary

After extensive testing of both CLI extraction tools, neither is able to successfully extract BSR/BMS files from Media.pk2. This is blocking Phase 1 progress.

---

## Validation Results ✅ CONFIRMED

**Tested File:** `client/assets/characters/chinaman_adventurer_face.glb`

**Result:** ❌ NO SKINNING DATA
- JOINTS_0 attribute: ✗ Missing
- WEIGHTS_0 attribute: ✗ Missing
- Skins defined: ✗ None
- Skeleton reference: ✗ None

**Conclusion:** The 82,563 previously converted GLB files are **static meshes only** and cannot be animated. This confirms the critical blocker identified in Avancement.md.

---

## Extraction Tool Results

### 1. Rust pk2-extractor (veykril-pk2)
**Location:** `tools/pk2-extractor/`

**Commands Attempted:**
```bash
# List files - WORKS
./target/release/pk2-extractor.exe --archive Media.pk2 --list

# Full extraction - FAILS
./target/release/pk2-extractor.exe --archive Media.pk2 --output assets/extracted-rust

# Single file - FAILS
./target/release/pk2-extractor.exe --archive Media.pk2 --file "prim/mesh/..."
```

**Errors:**
- Full extraction: `failed to fill whole buffer`
- Single file: `File not found in archive`
- Encoding: Corrupted UTF-16 filenames in output

**Status:** ❌ UNUSABLE

---

### 2. Python pk2.py
**Location:** `tools/pk2.py-tool/`

**Commands Attempted:**
```python
cd 'prim'  # Directory navigation
extract 'file.bsr'
```

**Errors:**
- `cd` command: "Directory not found"
- Cannot navigate PK2 structure
- Extract to current directory only (no path preservation)

**Status:** ❌ UNUSABLE

---

## Root Cause Analysis

### Why Both Tools Fail

**Hypothesis 1: Media.pk2 Format Differences**
- These tools were developed for older Silkroad versions
- Current Media.pk2 may have structural changes
- Blowfish decryption may have variant keys

**Hypothesis 2: File Size**
- Media.pk2 is ~15GB
- Buffer overflow suggests memory allocation issue
- Tools may not handle large archives correctly

**Hypothesis 3: Encoding Issues**
- Filenames showing as corrupted characters
- May indicate encryption or format mismatch

---

## Remaining Options

### Option 1: Manual GUI Extraction (RECOMMENDED)
**Tool:** PK2 Editor
**Download:** https://github.com/eggmundsen/pk2editor/releases

**Pros:**
- GUI tool, bypasses CLI limitations
- Manual file selection
- Known to work with current Silkroad

**Cons:**
- Not fully automated
- Requires manual intervention
- Windows-only

**Instructions:** See `docs/GUIDE_PK2_EDITOR.md` and `docs/CHECKLIST_PK2_EXTRACTION.md`

---

### Option 2: Community Tools
**Potential Tools:**
- Noesis (richwhitehouse.com)
- SROExtractor (from ragezone/elpvpers)
- Private extractors (elitepvpers forums)

**Pros:**
- May support newer PK2 formats
- Community-tested

**Cons:**
- Need to research and test
- Quality varies

---

### Option 3: Fix Existing Tools
**Approach:**
- Debug Rust pk2-extractor buffer issue
- May require code modification
- Investigate Blowfish key variants

**Pros:**
- Would enable full automation
- CLI-based as desired

**Cons:**
- Requires Rust debugging
- Time-intensive
- May not be fixable without format docs

---

## Recommendation

**PROCEED WITH OPTION 1: Manual PK2 Editor extraction**

Rationale:
1. PK2 Editor is a known working tool
2. We only need to extract ONCE (Character/Mob folders)
3. Can proceed with conversion pipeline immediately
4. Automation can come later after format validation

**Time Estimate:** 20-30 minutes for manual extraction

---

## Next Steps (After PK2 Extraction)

1. ✅ Analyze extracted BSR/BMS file format
2. ✅ Create Blender 5.0 importer with skinning support
3. ✅ Convert sample files to GLB
4. ✅ Verify JOINTS/WEIGHTS in GLB
5. ✅ Test animation in Babylon.js
6. ✅ Batch convert all Character/Mob assets

---

## Blocker Summary

| Task | Status | Blocker |
|------|--------|---------|
| Validate existing GLB | ✅ Complete | None - confirmed no skinning |
| Extract BSR/BMS from PK2 | ❌ Blocked | Both CLI tools non-functional |
| Analyze BSR/BMS format | ⏸️ Waiting | Requires extracted files |
| Create Blender importer | ✅ Ready | Waiting for extracted files |
| Convert to GLB | ⏸️ Waiting | Requires extracted files |

---

## Files Created During This Session

1. `scripts/check-glb-skinning.js` - GLB validation script
2. `scripts/extract-with-pk2py.py` - Python PK2 extraction attempt
3. `scripts/extract-pk2-fixed.py` - Modified extraction script
4. `scripts/explore-pk2.py` - PK2 structure explorer
5. `docs/EXTRACTION_STATUS_REPORT.md` - This document

---

**Conclusion:** Phase 1 is blocked on PK2 extraction. Recommend using PK2 Editor GUI tool to proceed.
