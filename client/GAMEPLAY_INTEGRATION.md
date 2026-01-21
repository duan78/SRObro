# SRObro - Gameplay Integration Guide

## 🎮 Gameplay Demo - READY TO PLAY!

### Quick Start

**Step 1: Start the server**
```bash
cd C:\Users\duan7\Desktop\SRObro\client
python start-viewer.py
```

**Step 2: Open the gameplay demo**

Navigate to:
```
http://localhost:8080/gameplay-demo.html
```

Or run:
```bash
python start-gameplay.py
```

### Controls

| Action | Key |
|--------|-----|
| Move Forward | W |
| Move Backward | S |
| Move Left | A |
| Move Right | D |
| Jump | SPACE |
| Sprint | SHIFT |
| Rotate Camera | Right Click + Drag |
| Zoom | Mouse Wheel |

## 📁 What's Included

### 1. Character Controller (`src/gameplay/CharacterController.ts`)
- ✅ WASD movement
- ✅ Jump with physics
- ✅ Sprint mode
- ✅ Collision detection
- ✅ Smooth rotation
- ✅ Camera-relative movement

### 2. Third Person Camera (`src/gameplay/ThirdPersonCamera.ts`)
- ✅ Orbit around character
- ✅ Mouse rotation control
- ✅ Smooth follow
- ✅ Zoom in/out
- ✅ Collision avoidance
- ✅ Adjustable angles

### 3. Gameplay Demo (`gameplay-demo.html` + `gameplay-demo.js`)
- ✅ Complete playable scene
- ✅ Character spawning
- ✅ Environment (ground, platforms)
- ✅ Real-time stats display
- ✅ Character selector

## 🎯 Features Implemented

### Movement System
```javascript
// Character is fully controllable
const character = new CharacterController(scene, mesh);

// Set inputs
character.setForward(true);   // W key
character.setJump(true);      // Space key
character.setSprint(true);    // Shift key

// Get velocity
const velocity = character.getVelocity();
```

### Camera System
```javascript
// Create third person camera
const camera = new ThirdPersonCamera(scene);

// Follow character
camera.setTarget(characterMesh);

// Get camera yaw for character controller
const yaw = camera.getYaw();
characterController.setCameraYaw(yaw);
```

### Asset Loading
```javascript
// Spawn character from converted assets
await spawnCharacter('avatar_m_amalun');

// Automatically loads from ./assets/models/
// Scales and positions correctly
// Enables collisions
```

## 🧪 Testing

### Test Movement
1. Open gameplay demo
2. Character should appear in center
3. Use WASD to move
4. Press SPACE to jump
5. Hold SHIFT to sprint

### Test Camera
1. Hold Right Mouse Button
2. Drag mouse left/right to rotate
3. Scroll mouse wheel to zoom

### Test Assets
1. Use character selector dropdown
2. Click "Spawn Character"
3. Different models should load

## 🔧 Architecture

### Scene Hierarchy
```
Scene
├── Character (TransformNode)
│   ├── Mesh 1 (loaded from GLB)
│   ├── Mesh 2 (loaded from GLB)
│   └── ...
├── Ground
├── Test Objects
└── Camera (Third Person)
```

### Update Loop
```javascript
// Game loop
engine.runRenderLoop(() => {
  const deltaTime = engine.getDeltaTime() / 1000;

  // Update character
  characterController.update();

  // Update camera
  camera.update();

  // Render
  scene.render();
});
```

## 📊 Performance

**Target:** 60 FPS on mid-range hardware

**Optimizations:**
- ✅ Collision detection only when needed
- ✅ Smooth camera interpolation
- ✅ Efficient input handling
- ✅ Asset caching

## 🚀 Next Steps

### Phase 2: Enhanced Gameplay

**Animations**
- [ ] Load animation files from ./assets/animations/
- [ ] Blend between idle/walk/run
- [ ] Jump animation
- [ ] Attack animations

**Combat**
- [ ] Weapon system
- [ ] Attack combo system
- [ ] Hit detection
- [ ] Damage numbers

**UI/HUD**
- [ ] Health bar
- [ ] Skill bar
- [ ] Minimap
- [ ] Chat window

**Multiplayer**
- [ ] Network integration
- [ ] Player position sync
- [ ] Interpolation
- [ ] Lag compensation

## 🐛 Known Issues

1. **Some models don't load**
   - Cause: Missing files or corrupted GLB
   - Fix: Check console for errors, try different model

2. **Character falls through ground**
   - Cause: Collision not enabled on mesh
   - Fix: Enable `checkCollisions = true`

3. **Camera too close/far**
   - Fix: Adjust `distance` in camera config

## 📝 Code Examples

### Create Custom Character
```javascript
// Load your own character
const myCharacter = await BABYLON.SceneLoader.ImportMeshAsync(
  null,
  './assets/models/',
  'my_model.glb',
  scene
);

// Create controller
const controller = new CharacterController(scene, myCharacter[0]);

// Setup camera
const camera = new ThirdPersonCamera(scene);
camera.setTarget(myCharacter[0]);
```

### Add New Controls
```javascript
// In CharacterController.ts
public setCrouch(active: boolean): void {
  this.movement.crouch = active;
}

// Handle in update()
if (this.movement.crouch) {
  this.mesh.scaling.y = 0.5; // Crouch height
}
```

## 🎨 Customization

### Change Camera Settings
```javascript
// In ThirdPersonCamera.ts
const config = {
  distance: 10,      // Further away
  height: 4,         // Higher up
  minDistance: 5,
  maxDistance: 30,
  rotationSpeed: 0.005,  // Faster rotation
  zoomSpeed: 1.0     // Faster zoom
};
```

### Change Movement Speed
```javascript
// In CharacterController.ts
const config = {
  walkSpeed: 7,      // Faster walk
  runSpeed: 14,      // Faster run
  jumpForce: 10,     // Higher jump
  gravity: -25,      // Stronger gravity
  rotationSpeed: 0.15  // Faster rotation
};
```

## 🔗 Related Files

- `CONVERSION_REPORT.md` - Asset conversion details
- `WEB_IMPLEMENTATION.md` - Asset viewer guide
- `src/game/AssetLoader.ts` - Asset loading system
- `src/core/Game.ts` - Main game class

## 💡 Tips

1. **Start Simple** - Test with placeholder character first
2. **Use Console** - Check browser console (F12) for errors
3. **Adjust Camera** - Find comfortable distance/angle
4. **Monitor FPS** - Keep performance in mind
5. **Test Collisions** - Make sure `checkCollisions = true`

## 📞 Support

**Issues?** Check:
1. Browser console (F12) for errors
2. Network tab for failed asset loads
3. Assets folder exists with GLB files

**Working Directory:**
```
C:\Users\duan7\Desktop\SRObro\client\
```

---

**Status:** ✅ Gameplay Integration Complete

**Next:** Add animations and multiplayer support
