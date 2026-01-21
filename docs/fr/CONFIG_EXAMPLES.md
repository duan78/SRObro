# Exemples de Configuration - Silkroad Online / SRObro

## Vue d'ensemble

Ce document fournit des exemples complets de configuration pour les serveurs Silkroad Online (VSRO) et pour SRObro.

---

## 1. Configuration Client SRO (div.txt)

### Fichier: div.txt

**Emplacement:** Racine du dossier client Silkroad

```text
// ===================================================================
// Silkroad Online Configuration
// Version: 1.188
// ===================================================================

// ----- Server Configuration -----
// IP address of the gateway server
server_ip "192.168.1.100"

// Port number (default: 15779)
server_port 15779

// ----- Update Server -----
// Patch server URL
patch_server "updates.silkroad.com"

// Patch server port
patch_port 80

// ----- Client Info -----
// Client version
version "1.188"

// Locale (LOCALE, LOCALE_USA, etc.)
locale "LOCALE"

// ----- Display Options -----
// Fullscreen mode (0 = windowed, 1 = fullscreen)
fullscreen 0

// Screen resolution
resolution 1024 768

// Sound enabled (0 = disabled, 1 = enabled)
sound 1

// Music enabled (0 = disabled, 1 = enabled)
music 1

// ----- Advanced Options -----
// Shadow quality (0-2)
shadow_quality 1

// Texture quality (0-2)
texture_quality 2

// Water effect (0 = disabled, 1 = enabled)
water_effect 1

// ----- Debug Options -----
// Debug mode (0 = disabled, 1 = enabled)
debug_mode 0

// Show FPS (0 = disabled, 1 = enabled)
show_fps 0
```

---

## 2. Configuration Serveur VSRO

### Fichier: Server.cfg (Gateway)

```ini
; ===================================================================
; Gateway Server Configuration
; ===================================================================

[Global]
Count=1

[Entry0]
Operation=1
Name=GatewayServer
Load=0
GlobalCount=1
Certification=1
MaxNormalUser=1500
MaxFreeUser=100
MaxPrivilegedUser=50

[Server001]
; Login Server Configuration
IP="192.168.1.100"
Port=15779
GatewayPort=15879

[Database]
; Database Connection
Server="(local)"
Database="SRO_VT_ACCOUNT"
User="sa"
Password="your_password"
TrustedConnection="Yes"

[Localization]
Locale="LOCALE"
Language="English"

[Logging]
LogLevel=3
LogPath="C:\Server\Logs\"
ConsoleLog="Yes"
FileLog="Yes"
```

---

### Fichier: Server.cfg (Shard)

```ini
; ===================================================================
; Shard Server Configuration
; ===================================================================

[Global]
Count=1

[Entry0]
Operation=1
Name=ShardServer
Load=0
GlobalCount=1

[Server001]
; Game Server Configuration
IP="192.168.1.101"
Port=15879

[Database]
; Database Connection
Server="(local)"
Database="SRO_VT_SHARD"
User="sa"
Password="your_password"
TrustedConnection="Yes"

[Gameplay]
; Gameplay Settings
ExpRate=1.0
SPRate=1.0
DropRate=1.0
GoldRate=1.0

PartyExpBonus=1.2
AutoSaveInterval=300

[Castle]
; Fortress War
CastleEnable=1
CastleWarDay=Saturday
CastleWarTime=20:00

[Job]
; Job System
JobEnable=1
TraderExpRate=1.0
ThiefExpRate=1.0
HunterExpRate=1.0
```

---

### Fichier: Server.cfg (Machine Manager)

```ini
; ===================================================================
; Machine Manager Configuration
; ===================================================================

[Global]
Count=1

[Entry0]
Operation=1
Name=MachineManager
Load=0
GlobalCount=1

[Machine001]
; Machine Manager
IP="192.168.1.100"
Port=15880

[Shards]
; Available Shards
ShardCount=1

[Shard001]
Name="Alex"
IP="192.168.1.101"
Port=15879
MaxPlayers=1500
Status="Online"
Load="Low"

[LoadBalancing]
; Load Balancing Settings
AutoBalance=1
MaxLoadPercentage=80
RedirectOnFull=1
```

---

## 3. Configuration SRObro

### Fichier: .env (Backend Node.js)

```bash
# ===================================================================
# SRObro Backend Configuration
# ===================================================================

# ----- Server -----
NODE_ENV=development
PORT=15879
HOST=0.0.0.0

# ----- Database -----
DATABASE_URL=postgresql://srobro:password@localhost:5432/srobro
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ----- Redis -----
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ----- JWT -----
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# ----- Game Settings -----
MAX_PLAYERS_PER_SHARD=1000
POSITION_SYNC_RATE=60  # Hz
SAVE_INTERVAL=60000  # ms

# ----- Security -----
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=60000  # ms
RATE_LIMIT_MAX_REQUESTS=100

# ----- Logging -----
LOG_LEVEL=debug
LOG_FILE_PATH=./logs

# ----- CORS -----
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
```

---

### Fichier: config/default.json

```json
{
  "server": {
    "port": 15879,
    "host": "0.0.0.0",
    "maxConnections": 1000
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "srobro",
    "username": "srobro",
    "password": "password",
    "sync": true,
    "logging": true
  },
  "redis": {
    "host": "localhost",
    "port": 6379,
    "db": 0
  },
  "game": {
    "tickRate": 60,
    "saveInterval": 60000,
    "maxPlayers": 1000,
    "viewDistance": 100,
    "antiSpeedhack": true,
    "maxMovementSpeed": 0.1
  },
  "logging": {
    "level": "debug",
    "format": "json",
    "datePattern": "YYYY-MM-DD-HH",
    "maxFiles": "14d"
  }
}
```

---

### Fichier: prisma/schema.prisma

```prisma
// ===================================================================
// SRObro Database Schema
// ===================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  email     String?   @unique
  password  String
  status    Int       @default(1)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  characters Character[]

  @@map("TB_User")
}

model Character {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  accountId   Int
  level       Int      @default(1)
  exp         BigInt   @default(0)
  hp          Int      @default(200)
  mp          Int      @default(200)
  strength    Int      @default(20)
  intellect   Int      @default(20)
  positionX   Float    @default(0)
  positionY   Float    @default(0)
  positionZ   Float    @default(0)
  region      Int      @default(0)
  modelId     Int
  guildId     Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  account Account  @relation(fields: [accountId], references: [id])
  guild   Guild?   @relation(fields: [guildId], references: [id])
  skills  CharacterSkill[]
  inventory InventoryItem[]

  @@map("_Char")
}

model CharacterSkill {
  id         Int      @id @default(autoincrement())
  characterId Int
  skillId    Int
  level      Int      @default(1)

  character Character @relation(fields: [characterId], references: [id])

  @@unique([characterId, skillId])
  @@map("_CharSkill")
}

model Item {
  id         Int     @id @default(autoincrement())
  codeName   String  @unique
  name       String
  type       Int
  level      Int
  price      BigInt
  stackSize  Int     @default(1)

  inventory InventoryItem[]

  @@map("_RefObjCommon")
}

model InventoryItem {
  id         Int      @id @default(autoincrement())
  characterId Int
  itemId     Int
  quantity   Int      @default(1)
  slot       Int
  plus       Int      @default(0)

  character Character @relation(fields: [characterId], references: [id])
  item      Item      @relation(fields: [itemId], references: [id])

  @@map("_Inventory")
}

model Guild {
  id         Int      @id @default(autoincrement())
  name       String   @unique
  level      Int      @default(1)
  masterId   Int
  notice     String?
  createdAt  DateTime @default(now())

  members Character[]

  @@map("_Guild")
}
```

---

## 4. Configuration PostgreSQL

### Fichier: postgresql.conf (Extrait)

```conf
# ----- Connection Settings -----
listen_addresses = '*'
port = 5432
max_connections = 200

# ----- Memory Settings -----
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# ----- Query Planning -----
random_page_cost = 1.1
effective_io_concurrency = 200

# ----- Logging -----
log_destination = 'stderr'
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_timezone = 'UTC'
log_min_duration_statement = 1000  # Log slow queries

# ----- Checkpoint -----
checkpoint_completion_target = 0.9
checkpoint_timeout = 15min
```

---

### Script SQL: Initialisation

```sql
-- ===================================================================
-- SRObro Database Initialization
-- ===================================================================

-- Créer la base de données
CREATE DATABASE srobro
    WITH OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

-- Se connecter à la base de données
\c srobro

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Pour la recherche de texte

-- Tables créées automatiquement par Prisma
-- Utiliser: npx prisma migrate dev

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_character_position ON _Char(LatestRegion, PosX, PosY);
CREATE INDEX IF NOT EXISTS idx_character_name ON _Char(CharName16);
CREATE INDEX IF NOT EXISTS idx_character_account ON _Char(AccountID);
CREATE INDEX IF NOT EXISTS idx_guild_members ON _GuildMember(GuildID);

-- Function: Mise à jour position avec vérification
CREATE OR REPLACE FUNCTION update_character_position(
    p_char_id INTEGER,
    p_region INTEGER,
    p_pos_x REAL,
    p_pos_y REAL,
    p_pos_z REAL
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE _Char
    SET LatestRegion = p_region,
        PosX = p_pos_x,
        PosY = p_pos_y,
        PosZ = p_pos_z
    WHERE CharID = p_char_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Log des changements de position
CREATE OR REPLACE FUNCTION log_position_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.LatestRegion != NEW.LatestRegion OR
       ABS(OLD.PosX - NEW.PosX) > 100 OR
       ABS(OLD.PosY - NEW.PosY) > 100 OR
       ABS(OLD.PosZ - NEW.PosZ) > 100 THEN
        INSERT INTO _LogEvent (CharID, EventType, EventTime, EventDesc)
        VALUES (NEW.CharID, 10, NOW(), 'Position changed significantly');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_position_change
    AFTER UPDATE ON _Char
    FOR EACH ROW
    EXECUTE FUNCTION log_position_change();
```

---

## 5. Configuration Socket.io (Client)

### Fichier: client/src/config/socket.ts

```typescript
// ===================================================================
// SRObro Socket.io Configuration
// ===================================================================

export const SOCKET_CONFIG = {
  // URL du serveur (développement)
  url: process.env.REACT_APP_SOCKET_URL || 'http://localhost:15879',

  // Options de connexion
  options: {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 10000,
  },

  // Événements
  events: {
    // Connexion
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',

    // Authentification
    LOGIN: 'login',
    LOGIN_RESPONSE: 'login_response',
    LOGOUT: 'logout',

    // Personnages
    CHARACTER_LIST: 'character_list',
    CHARACTER_CREATE: 'character_create',
    CHARACTER_DELETE: 'character_delete',
    WORLD_JOIN: 'world_join',

    // Jeu
    MOVEMENT: 'movement',
    ATTACK: 'attack',
    CHAT: 'chat',
    USE_SKILL: 'use_skill',

    // Serveur → Client
    CHARACTER_SPAWN: 'character_spawn',
    CHARACTER_DESPAWN: 'character_despawn',
    CHARACTER_MOVE: 'character_move',
    CHAT_MESSAGE: 'chat_message',
    STATS_UPDATE: 'stats_update',
  },
};

export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
};
```

---

## 6. Configuration Docker Compose

### Fichier: docker-compose.yml

```yaml
# ===================================================================
# SRObro Docker Compose
# ===================================================================

version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: srobro-postgres
    environment:
      POSTGRES_DB: srobro
      POSTGRES_USER: srobro
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U srobro"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: srobro-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: srobro-backend
    environment:
      NODE_ENV: production
      PORT: 15879
      DATABASE_URL: postgresql://srobro:${POSTGRES_PASSWORD:-changeme}@postgres:5432/srobro
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "15879:15879"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  # Frontend (Production)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: srobro-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 7. Configuration Nginx (Production)

### Fichier: nginx.conf

```nginx
# ===================================================================
# SRObro Nginx Configuration
# ===================================================================

server {
    listen 80;
    server_name srobro.example.com www.srobro.example.com;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name srobro.example.com www.srobro.example.com;

    # SSL
    ssl_certificate /etc/letsencrypt/live/srobro.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/srobro.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend (React)
    location / {
        root /var/www/srobro/frontend;
        try_files $uri $uri/ /index.html;

        # Cache
        add_header Cache-Control "public, max-age=3600";
    }

    # Backend API (WebSocket)
    location /socket.io/ {
        proxy_pass http://localhost:15879;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # WebSocket timeout
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    # Assets statiques
    location /assets/ {
        root /var/www/srobro/frontend;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss;
}
```

---

## 8. Configuration TypeScript

### Fichier: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["node", "@types/jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## Références

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Statut:** ✅ Documenté
