// ============================================
// SRObro - Commandes chat GM (phase 6)
// Rôle Account.role gm/admin requis. Dispatch appelé par
// WorldManager.handleChatPacket AVANT les commandes joueur (/who /loc).
// ============================================

import type { Client } from '../network/Client';
import type { ClientManager } from '../network/ClientManager';
import type { DatabaseManager } from '../database/DatabaseManager';
import type { WorldManager } from '../game/WorldManager';
import type { CombatBridge } from '../game/CombatBridge';
import { PlayerEntity } from '../world/PlayerEntity';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import { globalSpawnManager } from '../ai/SpawnManager';
import { rates, type RateConfig } from '../config/rates';
import { applyRateOverrides } from './rateOverrides';
import { ensureMonsterInDb } from './bestiary';

const logger = createLogger('GM');

const INVENTORY_SIZE = 45;

export class GmCommands {
  private worldManager: WorldManager;
  private clientManager: ClientManager;
  private dbManager: DatabaseManager;
  private combatBridge: CombatBridge | null = null;
  /** Cache court du rôle par compte (les commandes sont rares) */
  private roleCache = new Map<string, { role: string; expires: number }>();

  constructor(worldManager: WorldManager, clientManager: ClientManager, dbManager: DatabaseManager) {
    this.worldManager = worldManager;
    this.clientManager = clientManager;
    this.dbManager = dbManager;
  }

  setCombatBridge(cb: CombatBridge): void {
    this.combatBridge = cb;
  }

  // ============================================
  // DISPATCH
  // ============================================

  /** Retourne true si la commande a été consommée (y compris refus de rôle). */
  async dispatch(client: Client, packet: { data: unknown; timestamp: number }): Promise<boolean> {
    const message = ((packet.data as { message?: string }) ?? {}).message ?? '';
    if (!message.startsWith('/')) return false;

    const parts = message.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const characterId = client.getCharacterId();
    if (!characterId) return false;
    const player = this.worldManager.getPlayer(characterId);
    if (!player) return false;

    // /help est servi à tout le monde (contenu dépendant du rôle)
    if (cmd === '/help') {
      await this.cmdHelp(characterId);
      return true;
    }

    if (!GM_COMMANDS.has(cmd)) return false; // → WorldManager (/who, /loc, inconnues)

    const role = await this.getRole(client.getAccountId());
    if (role !== 'gm' && role !== 'admin') {
      this.reply(characterId, `Commande ${cmd} réservée aux GM.`);
      return true;
    }

    logger.info(`GM ${player.name} (${role}): ${message}`);
    try {
      switch (cmd) {
        case '/gm': return await this.cmdGm(characterId, role, args);
        case '/teleport':
        case '/tp': return await this.cmdTeleport(characterId, args);
        case '/spawn': return await this.cmdSpawn(characterId, player, args);
        case '/item': return await this.cmdItem(characterId, args);
        case '/iteminfo': return await this.cmdItemInfo(characterId, args);
        case '/level': return this.cmdLevel(characterId, player, args);
        case '/gold': return this.cmdGold(characterId, player, args);
        case '/sp': return this.cmdSp(characterId, player, args);
        case '/kill': return this.cmdKill(characterId, player);
        case '/revive': return await this.cmdRevive(client, characterId, player);
        case '/speed': return this.cmdSpeed(characterId, player, args);
        case '/invisible': return this.cmdInvisible(characterId, player);
        case '/god': return this.cmdGod(characterId, player);
        case '/freeze': return await this.cmdFreeze(characterId, args);
        case '/kick': return await this.cmdKick(characterId, args);
        case '/ban': return await this.cmdBan(characterId, args);
        case '/unban': return await this.cmdUnban(characterId, args);
        case '/announce': return this.cmdAnnounce(characterId, player, args);
        case '/mobinfo': return this.cmdMobInfo(characterId, player);
        case '/whereis': return this.cmdWhereis(characterId, args);
        case '/rates': return await this.cmdRates(characterId, args);
      }
    } catch (e) {
      logger.error(`Erreur commande ${cmd}:`, e);
      this.reply(characterId, `Erreur: ${(e as Error).message}`);
    }
    return true;
  }

  // ============================================
  // COMMANDES
  // ============================================

  private async cmdHelp(characterId: string): Promise<void> {
    const player = this.worldManager.getPlayer(characterId);
    const role = player ? await this.getRole(player.accountId) : 'player';
    this.reply(characterId, 'Commandes joueur: /who, /loc, /help');
    if (role === 'gm' || role === 'admin') {
      this.reply(characterId,
        'GM: /tp /spawn /item /iteminfo /level /gold /sp /kill /revive /speed /invisible /god ' +
        '/freeze /kick /ban /unban /announce /mobinfo /whereis /rates /gm promote|demote');
    }
  }

  /** /gm promote|demote <compte> [role] — gestion des rôles (admin requis). */
  private async cmdGm(characterId: string, role: string, args: string[]): Promise<boolean> {
    const [action, username, newRoleArg] = args;
    if (role !== 'admin') {
      this.reply(characterId, '/gm requiert le rôle admin.');
      return true;
    }
    if ((action !== 'promote' && action !== 'demote') || !username) {
      this.reply(characterId, 'Usage: /gm promote|demote <compte> [gm|admin|player]');
      return true;
    }
    const account = await prisma.account.findUnique({ where: { username } });
    if (!account) {
      this.reply(characterId, `Compte inconnu: ${username}`);
      return true;
    }
    let newRole = 'player';
    if (action === 'promote') {
      newRole = newRoleArg === 'admin' ? 'admin' : 'gm';
    }
    await prisma.account.update({
      where: { id: account.id },
      data: { role: newRole as never }, // AccountRole enum (player|gm|admin)
    });
    this.roleCache.delete(account.id);
    this.reply(characterId, `${username} est maintenant ${newRole}.`);
    return true;
  }

  /** /tp x z | /tp <joueur> */
  private async cmdTeleport(characterId: string, args: string[]): Promise<boolean> {
    if (!this.combatBridge) return true;
    if (args.length >= 2 && !isNaN(Number(args[0])) && !isNaN(Number(args[1]))) {
      const x = Number(args[0]), z = Number(args[1]);
      this.combatBridge.teleportPlayer(characterId, { x, z });
      this.reply(characterId, `Téléporté en ${x.toFixed(0)}, ${z.toFixed(0)}.`);
      return true;
    }
    if (args.length >= 1) {
      const target = this.findPlayerByName(args[0]);
      if (!target) {
        this.reply(characterId, `Joueur introuvable: ${args[0]}`);
        return true;
      }
      const player = this.worldManager.getPlayer(characterId)!;
      player.position = { ...player.position, x: target.position.x + 2, z: target.position.z + 2 };
      this.combatBridge.teleportPlayer(characterId, player.position);
      this.reply(characterId, `Téléporté vers ${target.name}.`);
      return true;
    }
    this.reply(characterId, 'Usage: /tp <x> <z> | /tp <joueur>');
    return true;
  }

  /** /spawn <nom|code monstre> [nombre] — 7 825 monstres officiels invocables */
  private async cmdSpawn(characterId: string, player: PlayerEntity, args: string[]): Promise<boolean> {
    if (!args[0]) {
      this.reply(characterId, 'Usage: /spawn <nom|code monstre> [nombre]');
      return true;
    }
    const monster = await ensureMonsterInDb(args[0]);
    if (!monster) {
      this.reply(characterId, `Monstre introuvable: ${args[0]}`);
      return true;
    }
    const count = Math.max(1, Math.min(20, parseInt(args[1] ?? '1', 10) || 1));
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      await globalSpawnManager.spawnMonsterAt(monster.id, {
        x: player.position.x + Math.cos(angle) * 6,
        y: player.position.y,
        z: player.position.z + Math.sin(angle) * 6,
      });
    }
    this.reply(characterId, `${count} × ${monster.name} (niv. ${monster.level}) apparu(s) autour de vous.`);
    return true;
  }

  /** /item <CODE> [quantité] */
  private async cmdItem(characterId: string, args: string[]): Promise<boolean> {
    if (!args[0]) {
      this.reply(characterId, 'Usage: /item <CODE_ITEM> [quantité] (ex: /item ITEM_ETC_HP_POTION_01 10)');
      return true;
    }
    const item = await prisma.item.findFirst({
      where: { description: { contains: `code=${args[0]}` } },
    });
    if (!item) {
      this.reply(characterId, `Item introuvable: ${args[0]}`);
      return true;
    }
    const qty = Math.max(1, Math.min(999, parseInt(args[1] ?? '1', 10) || 1));
    const used = await prisma.inventoryItem.findMany({
      where: { characterId }, select: { slot: true },
    });
    const taken = new Set(used.map((r) => r.slot));
    let slot = -1;
    for (let i = 0; i < INVENTORY_SIZE; i++) {
      if (!taken.has(i)) { slot = i; break; }
    }
    if (slot === -1) {
      this.reply(characterId, 'Inventaire plein (45 slots).');
      return true;
    }
    await prisma.inventoryItem.create({
      data: { characterId, itemId: item.id, slot, quantity: qty },
    });
    this.reply(characterId, `${qty} × ${(item as { name?: string }).name ?? args[0]} ajouté(s) (slot ${slot}).`);
    return true;
  }

  /** /iteminfo <CODE> */
  private async cmdItemInfo(characterId: string, args: string[]): Promise<boolean> {
    if (!args[0]) {
      this.reply(characterId, 'Usage: /iteminfo <CODE_ITEM>');
      return true;
    }
    const item = await prisma.item.findFirst({
      where: { description: { contains: `code=${args[0]}` } },
    });
    if (!item) {
      this.reply(characterId, `Item introuvable: ${args[0]}`);
      return true;
    }
    const i = item as Record<string, unknown>;
    this.reply(characterId,
      `${i.name}: prix ${i.price} gold, niveau ${i.levelLimit ?? '?'}, ` +
      `attaque ${i.attackMin ?? '-'}~${i.attackMax ?? '-'}, id ${item.id.slice(0, 8)}`);
    return true;
  }

  /** /level <n> */
  private cmdLevel(characterId: string, player: PlayerEntity, args: string[]): boolean {
    const n = parseInt(args[0] ?? '', 10);
    if (!n || n < 1 || n > 120) {
      this.reply(characterId, 'Usage: /level <1-120>');
      return true;
    }
    const old = player.level;
    player.setLevel(n);
    void player.saveToDatabase();
    this.combatBridge?.sendPlayerState(characterId);
    this.reply(characterId, `Niveau ${old} → ${player.level} (3 points de stats par niveau franchi).`);
    return true;
  }

  /** /gold <montant> (négatif autorisé) */
  private cmdGold(characterId: string, player: PlayerEntity, args: string[]): boolean {
    const n = parseInt(args[0] ?? '', 10);
    if (isNaN(n)) {
      this.reply(characterId, 'Usage: /gold <montant>');
      return true;
    }
    if (n >= 0) player.addGold(n);
    else player.removeGold(Math.min(-n, player.gold));
    void player.saveToDatabase();
    this.combatBridge?.sendPlayerState(characterId);
    this.reply(characterId, `Or: ${player.gold}.`);
    return true;
  }

  /** /sp <montant> */
  private cmdSp(characterId: string, player: PlayerEntity, args: string[]): boolean {
    const n = parseInt(args[0] ?? '', 10);
    if (isNaN(n)) {
      this.reply(characterId, 'Usage: /sp <montant>');
      return true;
    }
    player.sp = Math.max(0, player.sp + n);
    void player.saveToDatabase();
    this.combatBridge?.sendPlayerState(characterId);
    this.reply(characterId, `SP: ${player.sp}.`);
    return true;
  }

  /** /kill: monstre le plus proche → pipeline complet (loot, XP, KillLog) */
  private cmdKill(characterId: string, player: PlayerEntity): boolean {
    // 150 m: les anneaux officiels commencent à ~60 m des villes, l'ancienne
    // portée 60 m ne trouvait plus rien depuis le spawn
    const monster = globalSpawnManager.getNearestMonster(player.position, 150);
    if (!monster) {
      this.reply(characterId, 'Aucun monstre à moins de 150 m.');
      return true;
    }
    this.combatBridge?.gmKillMonster(monster.id, characterId);
    this.reply(characterId, `${monster.name} éliminé.`);
    return true;
  }

  /** /revive: résurrection en ville via le pipeline existant */
  private async cmdRevive(client: Client, characterId: string, player: PlayerEntity): Promise<boolean> {
    if (player.isAlive()) {
      this.reply(characterId, 'Vous êtes vivant.');
      return true;
    }
    await this.combatBridge?.handleRespawnRequest(client, characterId, 'town');
    this.reply(characterId, 'Résurrecté en ville.');
    return true;
  }

  /** /speed <multiplicateur 0.5-10> */
  private cmdSpeed(characterId: string, player: PlayerEntity, args: string[]): boolean {
    const m = parseFloat(args[0] ?? '');
    if (isNaN(m) || m < 0.5 || m > 10) {
      this.reply(characterId, 'Usage: /speed <0.5-10> (1 = normal)');
      return true;
    }
    player.speedMultiplier = m;
    this.worldManager.emit('sendToClient', {
      playerId: characterId, event: 'gm:speed', data: { multiplier: m },
    });
    this.reply(characterId, `Vitesse ×${m}.`);
    return true;
  }

  /** /invisible: masque le joueur aux autres clients */
  private cmdInvisible(characterId: string, player: PlayerEntity): boolean {
    this.combatBridge?.setPlayerInvisible(characterId, !player.invisible);
    this.reply(characterId, player.invisible ? 'Vous êtes invisible.' : 'Vous êtes visible.');
    return true;
  }

  /** /god: aucun dégât reçu */
  private cmdGod(characterId: string, player: PlayerEntity): boolean {
    player.godMode = !player.godMode;
    this.reply(characterId, player.godMode ? 'Mode dieu ACTIVÉ.' : 'Mode dieu désactivé.');
    return true;
  }

  /** /freeze [joueur]: fige le déplacement */
  private async cmdFreeze(characterId: string, args: string[]): Promise<boolean> {
    const target = args[0] ? this.findPlayerByName(args[0]) : this.worldManager.getPlayer(characterId);
    if (!target) {
      this.reply(characterId, `Joueur introuvable: ${args[0]}`);
      return true;
    }
    target.frozen = !target.frozen;
    this.reply(characterId, `${target.name} est ${target.frozen ? 'FIGÉ' : 'libre'}.`);
    if (target.id !== characterId) {
      this.reply(target.id, `Vous avez été ${target.frozen ? 'figé' : 'libéré'} par un GM.`);
    }
    return true;
  }

  /** /kick <joueur> */
  private async cmdKick(characterId: string, args: string[]): Promise<boolean> {
    if (!args[0]) {
      this.reply(characterId, 'Usage: /kick <joueur>');
      return true;
    }
    const target = this.findPlayerByName(args[0]);
    if (!target) {
      this.reply(characterId, `Joueur introuvable: ${args[0]}`);
      return true;
    }
    const client = this.clientManager.getClientByCharacterId(target.id);
    client?.disconnect();
    this.reply(characterId, `${target.name} a été déconnecté.`);
    return true;
  }

  /** /ban <compte|joueur> [raison] */
  private async cmdBan(characterId: string, args: string[]): Promise<boolean> {
    if (!args[0]) {
      this.reply(characterId, 'Usage: /ban <compte|joueur> [raison]');
      return true;
    }
    const account = await this.resolveAccount(args[0]);
    if (!account) {
      this.reply(characterId, `Compte/joueur introuvable: ${args[0]}`);
      return true;
    }
    if (account.role === 'admin') {
      this.reply(characterId, 'Impossible de bannir un admin.');
      return true;
    }
    const reason = args.slice(1).join(' ') || 'Aucune raison fournie';
    await prisma.account.update({
      where: { id: account.id },
      data: { isBanned: true, banReason: reason },
    });
    // Déconnecte les personnages en ligne de ce compte
    const chars = await prisma.character.findMany({ where: { accountId: account.id }, select: { id: true } });
    for (const c of chars) {
      this.clientManager.getClientByCharacterId(c.id)?.disconnect();
    }
    this.reply(characterId, `Compte ${account.username} BANNI (${reason}).`);
    return true;
  }

  /** /unban <compte> */
  private async cmdUnban(characterId: string, args: string[]): Promise<boolean> {
    if (!args[0]) {
      this.reply(characterId, 'Usage: /unban <compte>');
      return true;
    }
    const account = await prisma.account.findUnique({ where: { username: args[0] } });
    if (!account) {
      this.reply(characterId, `Compte inconnu: ${args[0]}`);
      return true;
    }
    await prisma.account.update({
      where: { id: account.id },
      data: { isBanned: false, banReason: null, banUntil: null },
    });
    this.reply(characterId, `Compte ${account.username} débanni.`);
    return true;
  }

  /** /announce <message>: diffusion serveur entier */
  private cmdAnnounce(characterId: string, player: PlayerEntity, args: string[]): boolean {
    const msg = args.join(' ').trim();
    if (!msg) {
      this.reply(characterId, 'Usage: /announce <message>');
      return true;
    }
    this.clientManager.broadcastToAll('chat', {
      channel: 'announce',
      playerName: '[ANNONCE]',
      message: msg,
    });
    logger.info(`Annonce de ${player.name}: ${msg}`);
    return true;
  }

  /** /mobinfo: monstre le plus proche */
  private cmdMobInfo(characterId: string, player: PlayerEntity): boolean {
    const m = globalSpawnManager.getNearestMonster(player.position, 100);
    if (!m) {
      this.reply(characterId, 'Aucun monstre à moins de 100 m.');
      return true;
    }
    this.reply(characterId,
      `${m.name} (niv. ${m.level}) HP ${m.hp}/${m.maxHp} def ${m.defense} ` +
      `XP ${m.exp} pos ${m.position.x.toFixed(0)},${m.position.z.toFixed(0)} id ${m.id.slice(0, 18)}…`);
    return true;
  }

  /** /whereis <joueur> */
  private cmdWhereis(characterId: string, args: string[]): boolean {
    if (!args[0]) {
      this.reply(characterId, 'Usage: /whereis <joueur>');
      return true;
    }
    const target = this.findPlayerByName(args[0]);
    if (!target) {
      this.reply(characterId, `Joueur introuvable: ${args[0]}`);
      return true;
    }
    this.reply(characterId,
      `${target.name}: X=${target.position.x.toFixed(0)} Z=${target.position.z.toFixed(0)} (niv. ${target.level})`);
    return true;
  }

  /** /rates [clé valeur] — édition live sans reboot */
  private async cmdRates(characterId: string, args: string[]): Promise<boolean> {
    if (args.length === 0) {
      this.reply(characterId, `Taux: exp=${rates.exp} sp=${rates.sp} gold=${rates.gold} drop=${rates.drop} ` +
        `aggro=${rates.aggroEnabled ? 'on' : 'off'} respawn=${rates.respawnMultiplier}`);
      return true;
    }
    if (args.length < 2) {
      this.reply(characterId, 'Usage: /rates [exp|sp|gold|drop|respawnMultiplier <n>|aggroEnabled <0|1>]');
      return true;
    }
    const key = args[0] as keyof RateConfig;
    if (!(key in rates)) {
      this.reply(characterId, `Clé inconnue: ${key}`);
      return true;
    }
    const partial: Partial<RateConfig> = {};
    if (key === 'aggroEnabled') partial.aggroEnabled = args[1] !== '0';
    else if (key === 'motd') partial.motd = args.slice(1).join(' ');
    else {
      const v = parseFloat(args[1]);
      if (isNaN(v) || v < 0) {
        this.reply(characterId, 'Valeur invalide.');
        return true;
      }
      (partial as Record<string, number>)[key] = v;
    }
    await applyRateOverrides(this.dbManager.getRedis(), partial);
    this.reply(characterId, `Taux ${key} = ${JSON.stringify(partial[key])} (live, persisté Redis).`);
    return true;
  }

  // ============================================
  // HELPERS
  // ============================================

  /** Réponse système privée au joueur. */
  reply(characterId: string, message: string): void {
    this.worldManager.emit('sendToClient', {
      playerId: characterId,
      event: 'chat',
      data: { channel: 'system', message },
    });
  }

  async getRole(accountId: string | null): Promise<string> {
    if (!accountId) return 'player';
    const cached = this.roleCache.get(accountId);
    if (cached && cached.expires > Date.now()) return cached.role;
    const account = await prisma.account.findUnique({ where: { id: accountId }, select: { role: true } });
    const role = account?.role ?? 'player';
    this.roleCache.set(accountId, { role, expires: Date.now() + 60000 });
    return role;
  }

  /** Surcharge: getRole depuis un characterId (console admin). */
  async getRoleByCharacter(characterId: string): Promise<string> {
    const player = this.worldManager.getPlayer(characterId);
    if (player) return this.getRole(player.accountId);
    const ch = await prisma.character.findUnique({ where: { id: characterId }, select: { accountId: true } });
    return ch ? this.getRole(ch.accountId) : 'player';
  }

  findPlayerByName(name: string): PlayerEntity | undefined {
    const lower = name.toLowerCase();
    return this.worldManager.getAllPlayers().find((p) => p.name.toLowerCase() === lower)
      ?? this.worldManager.getAllPlayers().find((p) => p.name.toLowerCase().includes(lower));
  }

  /** Compte par nom de compte OU nom de personnage. */
  private async resolveAccount(nameOrPlayer: string): Promise<{ id: string; username: string; role: string } | null> {
    const byName = await prisma.account.findUnique({ where: { username: nameOrPlayer } });
    if (byName) return { id: byName.id, username: byName.username, role: byName.role };
    const ch = await prisma.character.findFirst({
      where: { name: { equals: nameOrPlayer, mode: 'insensitive' } },
      select: { account: { select: { id: true, username: true, role: true } } },
    });
    return ch?.account ?? null;
  }
}

const GM_COMMANDS = new Set([
  '/gm', '/teleport', '/tp', '/spawn', '/item', '/iteminfo', '/level', '/gold', '/sp',
  '/kill', '/revive', '/speed', '/invisible', '/god', '/freeze', '/kick', '/ban',
  '/unban', '/announce', '/mobinfo', '/whereis', '/rates',
]);
