# SRObro Assets - Instructions

## Current Status

Assets have been successfully extracted from Silkroad Online PK2 archives:
- **Models**: 264 (.bms files)
- **Textures**: 28,129 (.ddj files)
- **Animations**: 105 (.ban files)
- **Skeletons**: 1 (.bsk file)

## Files

- `manifest.json` - Complete asset manifest
- `files.txt` - Human-readable file listing
- `temp_extraction/` - Original extracted files (5.3 GB)

## Next Steps for WebGL Conversion

To use these assets with Babylon.js:

### Option 1: Blender + RaGEZONE Plugin (Recommended)

1. Install RaGEZONE Blender plugin:
   https://forum.ragezone.com/threads/release-update-bms-bsk-bmt-ddj-import-blender-plugin.1250607/

2. Run conversion script:
   ```bash
   blender -b -P tools/batch_convert_bms.py
   ```

### Option 2: Direct Usage (Advanced)

Some Babylon.js loaders can handle original formats with custom parsers.

## Testing

Once assets are converted:
```bash
cd client
npm install
npm run dev
```

Then open: http://localhost:3000

---

Generated: 2026-01-19 21:25:55

Total Assets: 28,499 files
