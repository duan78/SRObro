// ============================================
// SRObro - Console web /admin (phase 6)
// Dashboard temps réel, éditeur de taux live (Redis, sans reboot),
// navigateur items/monstres, téléporteur, sanctions, KillLog.
// Auth: HTTP Basic sur un compte role gm/admin.
// ============================================

import type { Express, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import { rates, type RateConfig } from '../config/rates';
import { applyRateOverrides } from './rateOverrides';
import { globalSpawnManager } from '../ai/SpawnManager';
import { searchOfficialMonsters, ensureMonsterInDb } from './bestiary';
import type { GameServer } from '../core/GameServer';
import { readFileSync } from 'fs';
import { join } from 'path';

const logger = createLogger('Admin');
const REALM = 'SRObro Admin';

/** Wrap async handler: Express 4 n'attrape pas les promesses rejetées
 *  (sinon la requête pend indéfiniment — vécu avec un BigInt dans res.json). */
const aw = (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response): void => {
    fn(req, res).catch((e) => {
      if (!res.headersSent) res.status(500).json({ success: false, error: (e as Error).message });
    });
  };

export function registerAdminRoutes(app: Express, gameServer: GameServer): void {
  // --- Auth Basic: compte gm/admin requis pour tout /admin ---
  const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Basic ')) {
      res.set('WWW-Authenticate', `Basic realm="${REALM}"`).status(401).send('Authentification requise');
      return;
    }
    try {
      const [username, password] = Buffer.from(header.slice(6), 'base64').toString('utf8').split(':');
      const account = await prisma.account.findUnique({ where: { username } });
      if (account && (account.role === 'gm' || account.role === 'admin')
        && await bcrypt.compare(password, account.passwordHash)) {
        (req as Request & { adminAccount?: { id: string; username: string; role: string } }).adminAccount
          = { id: account.id, username: account.username, role: account.role };
        next();
        return;
      }
    } catch { /* tombé dans le 401 ci-dessous */ }
    res.set('WWW-Authenticate', `Basic realm="${REALM}"`).status(401).send('Accès refusé');
  };

  app.get('/admin', auth, (_req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8').send(adminConsoleHtml());
  });

  app.get('/admin/api/overview', auth, aw(async (_req, res) => {
    const wm = gameServer.getWorldManager();
    const players = wm ? wm.getAllPlayers().map((p) => ({
      id: p.id, name: p.name, level: p.level,
      hp: Math.round(p.hp), maxHp: p.maxHp, gold: p.gold, sp: p.sp,
      position: { x: Math.round(p.position.x), z: Math.round(p.position.z) },
      flags: { god: p.godMode, invisible: p.invisible, frozen: p.frozen, speed: p.speedMultiplier },
    })) : [];
    res.json({
      uptimeSec: Math.round(process.uptime()),
      serverTime: new Date().toISOString(),
      players,
      monstersAlive: globalSpawnManager.getMonsterEntities().size,
      rates,
      accounts: await prisma.account.count(),
      characters: await prisma.character.count(),
      items: await prisma.item.count(),
    });
 }));

  app.get('/admin/api/rates', auth, (_req, res) => res.json(rates));

  app.post('/admin/api/rates', auth, aw(async (req, res) => {
    const partial: Partial<RateConfig> = {};
    for (const key of ['exp', 'sp', 'gold', 'drop', 'respawnMultiplier'] as const) {
      if (req.body?.[key] !== undefined) {
        const v = Number(req.body[key]);
        if (!isNaN(v) && v >= 0) (partial as Record<string, number>)[key] = v;
      }
    }
    if (req.body?.aggroEnabled !== undefined) partial.aggroEnabled = !!req.body.aggroEnabled;
    if (typeof req.body?.motd === 'string') partial.motd = req.body.motd.slice(0, 200);
    if (Object.keys(partial).length === 0) {
      res.status(400).json({ success: false, error: 'Aucun taux valide fourni' });
      return;
    }
    const updated = await applyRateOverrides(gameServer.getDbManager().getRedis(), partial);
    res.json({ success: true, rates: updated });
 }));

  app.get('/admin/api/items', auth, aw(async (req, res) => {
    const search = String(req.query.search ?? '').trim();
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = Math.min(50, Math.max(10, parseInt(String(req.query.limit ?? '30'), 10) || 30));
    const where = search
      ? { OR: [
          // Le nom officiel est souvent coréen: chercher aussi le code latin
          // (ITEM_ETC_HP_POTION_01) dans la description
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ] }
      : {};
    const [total, rows] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, name: true, price: true, requiredLevel: true, description: true },
      }),
    ]);
    const codeOf = (d: string | null): string => {
      const m = d?.match(/code=([A-Z0-9_]+)/);
      return m?.[1] ?? '';
    };
    res.json({
      total, page, limit,
      items: rows.map((r) => ({ id: r.id, name: r.name, price: Number(r.price), level: r.requiredLevel, code: codeOf(r.description) })),
    });
  }));

  app.get('/admin/api/monsters', auth, aw(async (req, res) => {
    const search = String(req.query.search ?? '').trim();
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = Math.min(50, Math.max(10, parseInt(String(req.query.limit ?? '30'), 10) || 30));
    // Référentiel officiel characterdata (7 825) — pas la table Monster (13 seedés)
    const { total, monsters } = searchOfficialMonsters(search, page, limit);
    res.json({
      total, page, limit,
      monsters: monsters.map((m) => ({ code: m.code, name: m.name, level: m.level, hp: m.hp, exp: m.expReward, sp: Math.round(m.expReward / 8) })),
    });
 }));

  app.get('/admin/api/killlog', auth, aw(async (req, res) => {
    const limit = Math.min(100, Math.max(10, parseInt(String(req.query.limit ?? '30'), 10) || 30));
    const logs = await prisma.killLog.findMany({
      orderBy: { timestamp: 'desc' }, take: limit,
      include: {
        killer: { select: { name: true } },
      },
    });
    res.json({
      logs: logs.map((l) => ({
        killer: l.killer?.name ?? l.killerId.slice(0, 8),
        victim: l.victimName ?? l.victimId.slice(0, 8),
        victimType: l.victimType,
        damage: l.damage,
        at: l.timestamp,
      })),
    });
 }));

  app.get('/admin/api/accounts', auth, aw(async (_req, res) => {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        username: true, role: true, isBanned: true, banReason: true, createdAt: true,
        characters: { select: { name: true, level: true } },
      },
    });
    res.json({ accounts });
 }));

  // --- Action unique: la console HTML poste ici ---
  app.post('/admin/api/action', auth, aw(async (req, res) => {
    const { type, ...payload } = req.body ?? {};
    const wm = gameServer.getWorldManager();
    const cb = gameServer.getCombatBridge();
    const cm = gameServer.getClientManager();
    try {
      switch (type) {
        case 'announce':
          if (!payload.message) throw new Error('message requis');
          cm?.broadcastToAll('chat', { channel: 'announce', playerName: '[ANNONCE]', message: String(payload.message) });
          break;
        case 'kick': {
          const target = wm?.getAllPlayers().find((p) => p.name === payload.player);
          if (!target) throw new Error(`joueur introuvable: ${payload.player}`);
          cm?.getClientByCharacterId(target.id)?.disconnect();
          break;
        }
        case 'ban': {
          const account = await prisma.account.findUnique({ where: { username: payload.username } });
          if (!account) throw new Error(`compte inconnu: ${payload.username}`);
          if (account.role === 'admin') throw new Error('impossible de bannir un admin');
          await prisma.account.update({
            where: { id: account.id },
            data: { isBanned: true, banReason: String(payload.reason ?? 'console admin') },
          });
          const chars = await prisma.character.findMany({ where: { accountId: account.id }, select: { id: true } });
          for (const c of chars) cm?.getClientByCharacterId(c.id)?.disconnect();
          break;
        }
        case 'unban': {
          await prisma.account.update({
            where: { username: payload.username },
            data: { isBanned: false, banReason: null, banUntil: null },
          });
          break;
        }
        case 'teleport': {
          const target = wm?.getPlayer(String(payload.playerId));
          if (!target) throw new Error('playerId requis (joueur en ligne)');
          const x = Number(payload.x), z = Number(payload.z);
          if (isNaN(x) || isNaN(z)) throw new Error('x/z requis');
          target.position = { ...target.position, x, z };
          cb?.teleportPlayer(target.id, { x, z });
          break;
        }
        case 'spawn': {
          const target = wm?.getPlayer(String(payload.playerId));
          if (!target) throw new Error('playerId requis (joueur en ligne)');
          const count = Math.max(1, Math.min(20, Number(payload.count ?? 1) || 1));
          // code officiel (console) → ligne Monster garantie en base
          const dbMonster = await ensureMonsterInDb(String(payload.monsterId ?? payload.code));
          if (!dbMonster) throw new Error(`monstre inconnu: ${payload.monsterId ?? payload.code}`);
          for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2;
            await globalSpawnManager.spawnMonsterAt(dbMonster.id, {
              x: target.position.x + Math.cos(a) * 6,
              y: target.position.y,
              z: target.position.z + Math.sin(a) * 6,
            });
          }
          break;
        }
        case 'giveItem': {
          const characterId = String(payload.playerId);
          const item = await prisma.item.findFirst({ where: { description: { contains: `code=${payload.code}` } } });
          if (!item) throw new Error(`item inconnu: ${payload.code}`);
          const qty = Math.max(1, Math.min(999, Number(payload.qty ?? 1) || 1));
          const used = await prisma.inventoryItem.findMany({ where: { characterId }, select: { slot: true } });
          const taken = new Set(used.map((r) => r.slot));
          let slot = -1;
          for (let i = 0; i < 45; i++) if (!taken.has(i)) { slot = i; break; }
          if (slot === -1) throw new Error('inventaire plein');
          await prisma.inventoryItem.create({ data: { characterId, itemId: item.id, slot, quantity: qty } });
          break;
        }
        default:
          res.status(400).json({ success: false, error: `type inconnu: ${type}` });
          return;
      }
      logger.info(`Action admin ${type} par ${(req as Request & { adminAccount?: { username: string } }).adminAccount?.username}`);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ success: false, error: (e as Error).message });
    }
  }));

  logger.info('Console /admin enregistrée (auth: compte gm/admin)');
}

function adminConsoleHtml(): string {
  return readFileSync(join(__dirname, 'adminConsole.html'), 'utf8');
}
