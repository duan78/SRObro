# Game Loop Implementation

## Overview

SRObro implements a **fixed tick-rate game loop** based on 2025 MMORPG best practices.

## Architecture

### Game Loop (20Hz)

```
┌─────────────────────────────────────────┐
│         Main Loop (60 FPS)              │
│  ┌───────────────────────────────────┐ │
│  │  Input Queue Processing           │ │
│  │  - Sort by timestamp              │ │
│  │  - Validate inputs                │ │
│  │  - Apply to world state           │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  Tick Accumulator                 │ │
│  │  - Accumulate delta time          │ │
│  │  - Process ticks at 20Hz          │ │
│  │  - Prevent spiral of death        │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  Single Tick (50ms)               │ │
│  │  1. Process Inputs                │ │
│  │  2. Update World (movement/AI)    │ │
│  │  3. Create Snapshot (every 10)    │ │
│  │  4. Broadcast Updates             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### World Manager

```
┌─────────────────────────────────────────┐
│           World Manager                  │
│  ┌───────────────────────────────────┐ │
│  │  Entity Management                │ │
│  │  - Spawn/Despawn                  │ │
│  │  - Update positions               │ │
│  │  - Apply inputs                   │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  Spatial Manager (100x100m grid)  │ │
│  │  - AOI queries                    │ │
│  │  - Nearest neighbor               │ │
│  │  - Zone queries                   │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  Network Broadcasting             │ │
│  │  - AOI-based updates              │ │
│  │  - Delta compression              │ │
│  │  - Rate limiting                  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Key Features

### 1. Fixed Tick Rate (20Hz)

- **50ms per tick** - Consistent gameplay regardless of framerate
- **Delta time** - Frame-independent updates
- **Tick accumulator** - Handles variable framerate
- **Spiral of death prevention** - Resets if too far behind

### 2. Input Processing

- **Input queue** - Buffers client inputs
- **Timestamp validation** - Anti-cheat checks
- **Sequence numbers** - Detect packet loss
- **Server authoritative** - Never trust client

### 3. State Snapshots

- **Every 10 ticks** (500ms) - Store world state
- **1000 snapshots** - ~50 seconds of history
- **Lag compensation** - Rewind time for hit detection
- **Anti-cheat** - Validate player actions

### 4. Spatial Optimization

- **100x100m grid** - Efficient spatial queries
- **O(1) insertion** - Constant time add/remove
- **AOI queries** - Only send relevant entities
- **Zone filtering** - Fast zone-based queries

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Tick Rate | 20Hz | 50ms per tick |
| Tick Time | < 25ms | 50% headroom |
| Players per Server | 100 | Horizontal scaling |
| Network Updates | 20Hz | Synchronized with ticks |
| AOI Radius | 100m | Balance between visibility and performance |

## Usage

### Starting the Game Loop

```typescript
import { GameLoop } from './core/GameLoop';
import { WorldManager } from './game/WorldManager';
import { createSocketIOServer } from './network/SocketIOConfig';

// Create Socket.IO server
const io = createSocketIOServer(httpServer);

// Create world manager
const worldManager = new WorldManager(io, 100); // 100m AOI

// Create game loop
const gameLoop = new GameLoop(worldManager, {
  tickRate: 20,           // 20Hz
  maxTickTime: 100,       // 100ms max
  enableSnapshots: true,  // For lag compensation
  snapshotInterval: 10,   // Every 10 ticks
});

// Start game loop
gameLoop.start();

// Register global instance
setGameLoop(gameLoop);
```

### Spawning Players

```typescript
import { getGameLoop } from './core/GameLoop';

const gameLoop = getGameLoop();
const worldManager = gameLoop!.world;

// Spawn player
worldManager.spawnPlayer({
  id: 'entity_123',
  type: EntityType.PLAYER,
  characterId: 'char_abc',
  accountId: 'account_xyz',
  characterName: 'PlayerName',
  level: 20,
  hp: 1000,
  maxHp: 1000,
  mp: 500,
  maxMp: 500,
  position: { x: 0, y: 0, z: 0 },
  rotation: 0,
  velocity: { x: 0, y: 0, z: 0 },
  zoneId: 'zone_jangan',
  action: 'idle',
  isVisible: true,
  lastUpdate: 0,
});
```

### Processing Client Inputs

```typescript
// Socket.IO message handler
socket.on('playerInput', (data) => {
  const gameLoop = getGameLoop();
  if (!gameLoop) return;

  // Add input to queue
  gameLoop.addInput({
    playerId: socket.data.characterId,
    sequence: data.sequence,
    timestamp: data.timestamp,
    input: data.input,
  });
});
```

### Broadcasting Updates

The game loop automatically broadcasts updates to clients based on AOI:

```typescript
// Client receives update packet
socket.on('worldUpdate', (data) => {
  const { tick, updates } = data;

  // Update entity states
  for (const update of updates) {
    const entity = entities.get(update.entityId);
    if (entity) {
      // Interpolate to new position
      entity.targetPosition = update.position;
      entity.targetRotation = update.rotation;
    }
  }
});
```

## Optimization Techniques

### 1. AOI (Area of Interest)

Only send entities within 100m of player:

```typescript
const nearbyEntities = spatialManager.queryRadius(
  player.position,
  100 // meters
);
```

### 2. Delta Updates

Only send changed entities:

```typescript
// Track updated entities
private updatedEntities: Set<string> = new Set();

// Only include in broadcast if changed
for (const entityId of this.updatedEntities) {
  updates.push(this.entityToState(entityId));
}
```

### 3. Spatial Grid

O(1) insertion, O(k) queries where k is number of cells in range:

```typescript
// Add entity - O(1)
spatialManager.addEntity(entityId, position, zoneId);

// Query radius - O(k) where k is cells in range
const nearby = spatialManager.queryRadius(center, radius);
```

## Monitoring

### Performance Statistics

```typescript
const stats = gameLoop.getPerformanceStats();
console.log('Game Loop Stats:', stats);
// {
//   currentTick: 12345,
//   tickRate: 20,
//   avgTickTime: 15.2, // ms
//   maxTickTime: 25,    // ms
//   minTickTime: 10,    // ms
//   tickLoad: 30.4      // % (target: < 80%)
// }
```

### World Statistics

```typescript
const stats = worldManager.getStats();
console.log('World Stats:', stats);
// {
//   totalEntities: 450,
//   playerCount: 50,
//   monsterCount: 350,
//   npcCount: 50
// }
```

### Spatial Statistics

```typescript
const stats = spatialManager.getStats();
console.log('Spatial Stats:', stats);
// {
//   totalEntities: 450,
//   totalCells: 25,
//   entitiesPerCell: 18,
//   cellSize: 100
// }
```

## Troubleshooting

### High Tick Load (> 80%)

**Symptoms**: Tick time exceeds TICK_INTERVAL

**Solutions**:
1. Reduce entity count per zone
2. Optimize AI updates
3. Reduce AOI radius
4. Implement entity LOD

### Memory Leak

**Symptoms**: Memory usage grows over time

**Solutions**:
1. Clean up old snapshots
2. Despawn unused entities
3. Clear input queue
4. Check for circular references

### Network Saturation

**Symptoms**: High bandwidth usage, packet loss

**Solutions**:
1. Reduce update rate (10Hz instead of 20Hz)
2. Implement delta compression
3. Reduce AOI radius
4. Use priority updates

## Next Steps

1. ✅ Game Loop (20Hz)
2. ✅ World Manager
3. ✅ Spatial Manager
4. ⏳ Client Prediction (Phase 1)
5. ⏳ Lag Compensation (Phase 1)
6. ⏳ Entity Interpolation (Phase 1)

## Resources

- [Unity Netcode - Game Loop](https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.5/manual/learn/dealing-with-latency.html)
- [Fix Your Timestep](https://gafferongames.com/post/fix_your_timestep/)
- [Spatial Partitioning](https://www.gameaipro.com/GameAIPro2/GameAIPro2_Chapter_Spatial_Partitioning_For_Large_Scale_Worlds.html)

---

**Last Updated**: 2025-01-19
**Status**: ✅ Complete
**Files**: 3 (GameLoop.ts, WorldManager.ts, SpatialManager.ts)
**Lines of Code**: ~1500
