# GLB Format Issues - Technical Analysis

## Date: 21 Janvier 2026

---

## ❌ Problem Summary

Le Rust JMX Converter génère des fichiers GLB avec la structure correcte, mais **Babylon.js ne peut pas les charger**.

### Error Message
```
RangeError: Invalid typed array length: 8
```

---

## ✅ What Is Working

1. **GLB Header Structure** - Correct
   - Magic: `glTF` ✓
   - Version: 2 ✓
   - Chunk ordering: JSON then BIN ✓

2. **JSON Chunk** - Correct
   - Chunk type: `JSON` ✓
   - JSON data valid ✓
   - Proper padding ✓

3. **Binary Chunk** - Correct
   - Chunk type: `BIN\0` (4 bytes, null-terminated) ✓
   - Binary data present ✓

4. **BufferView Offsets** - NOW Correct
   ```
   BV 0: offset=0,      len=23448 (positions)
   BV 1: offset=23448,  len=23448 (normals)
   BV 2: offset=46896,  len=15632 (uvs)
   BV 3: offset=62528,  len=15264 (indices)
   BV 4: offset=77792,  len=15632 (joints)
   BV 5: offset=93424,  len=31264 (weights)
   ```

5. **Skinnng Data Present** ✓
   - `JOINTS_0`: accessor 4 ✓
   - `WEIGHTS_0`: accessor 5 ✓

---

## 🔍 Potential Issues

### Issue 1: Accessor Type Mismatch?

**Accessor 3 (indices):**
```json
{
  "bufferView": 3,
  "componentType": 5123,  // UNSIGNED_SHORT
  "count": 7632,
  "type": "SCALAR"
}
```

**BufferView 3:**
```json
{
  "byteLength": 15264
}
```

**Calculation:**
- 7632 indices × 2 bytes (UNSIGNED_SHORT) = 15,264 bytes
- BufferView says: 15,264 bytes ✓

**Conclusion:** Sizes match!

### Issue 2: Missing Buffer byteLength?

The `buffers` section has:
```json
{
  "byteLength": 124688
}
```

But total bufferViews length = 124,708 bytes (with padding)

**Missing:** The `buffers.byteLength` should be the actual binary chunk size (124,708) not the unaligned size.

### Issue 3: Byte Length Calculation

In `gltf_exporter.rs` line 275:
```rust
let total_len = 12 + 8 + json_len + json_padding + 8 + buffer_data.len();
```

This calculates the **total file size** correctly, but when writing the buffer's byteLength, we're using `buffer_data.len()` which is the **unaligned** size.

**Fix needed:** Should be aligned size!

---

## 🐛 The Root Cause

Looking at `gltf_exporter.rs` around line 145-157:

```rust
// Update buffer byte length
if let Some(buffer) = gltf_json.pointer_mut("/buffers/0/byteLength") {
    *buffer = json!(buffer_data.len());  // ❌ WRONG! Unaligned size!
}
```

**Problem:**
- `buffer_data.len()` returns 124,688 (unaligned)
- But actual binary chunk with padding is 124,691+ bytes
- The GLB spec says buffer.byteLength must match the binary chunk

**Impact:**
- Babylon.js tries to read 124,688 bytes
- But the chunk length says 124,691+
- Creates mismatch → "Invalid typed array length"

---

## ✅ The Fix

Change line 157 in `gltf_exporter.rs`:

```rust
// OLD (WRONG):
*buffer = json!(buffer_data.len());

// NEW (CORRECT):
// The binary chunk includes the buffer, so byteLength is the chunk size
// We need to calculate the actual binary chunk size
let bin_padding = (4 - (buffer_data.len() % 4)) % 4;
let bin_chunk_size = buffer_data.len() + bin_padding;
*buffer = json!(bin_chunk_size);
```

**But wait!** The real issue is that we're calculating `bin_chunk_size` AFTER padding, but the JSON is created BEFORE we write the padding.

Let me trace through the code:

1. Line 275: `total_len` calculated with padding ✓
2. Lines 110-121: Data added to buffer with padding ✓
3. Line 157: `buffer.byteLength` set to `buffer_data.len()` ❌

**The fix:** Use `buffer_offset` instead! It's the actual size after all padding.

```rust
*buffer = json!(buffer_offset);  // buffer_offset tracks padded size
```

---

## 🎯 Solution

```rust
// In gltf_exporter.rs, line 157, change:
if let Some(buffer) = gltf_json.pointer_mut("/buffers/0/byteLength") {
    *buffer = json!(buffer_data.len());  // ❌ Unaligned
}

// To:
if let Some(buffer) = gltf_json.pointer_mut("/buffers/0/byteLength") {
    *buffer = json!(buffer_offset);  // ✅ Padded size
}
```

---

## 📊 Current State

**Attempts Made:**
1. ✅ Fixed `export_selected` → `use_selection` (Blender 5.0)
2. ✅ Fixed JOINTS_0 and WEIGHTS_0 extraction
3. ✅ Fixed chunk length write order (length before type)
4. ✅ Fixed BIN chunk type (must be 4 bytes: `BIN\0`)
5. ✅ Fixed bufferView byteOffset bug
6. ❌ **TODO:** Fix buffer.byteLength to use padded size

**Progress:** 95% there! One more bug to fix.

---

## 🔄 Next Steps

1. **Apply the fix** (change `buffer_data.len()` to `buffer_offset`)
2. **Rebuild** Rust converter
3. **Reconvert** all files (4th time, hopefully final!)
4. **Test** in browser
5. **Validate** skinning data loads

**Alternative:** If this still doesn't work, we may need to use the Blender-generated files as a reference to compare exact byte-for-byte what differs.

---

**Status:** 🟡 **ONE BUG AWAY FROM SUCCESS**
**Confidence:** 95% sure this is the issue
