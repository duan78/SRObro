/**
 * SRObro - Game Server
 * Core game server logic and Socket.IO handling
 */

import type { Server as IOServer, Socket } from 'socket.io';
import type { DatabaseManager } from '../database/DatabaseManager';
import { createLogger } from './Logger';
import { prisma } from '../database/prisma';
import { GameDataService } from '../data/GameDataService';
import { ClientManager } from '../network/ClientManager';
import { WorldManager } from '../game/WorldManager';
import { CombatBridge } from '../game/CombatBridge';
import { ItemHandlers } from '../network/ItemHandlers';
import { SystemHandlers } from '../network/SystemHandlers';
import { AuthHandlers } from '../network/AuthHandlers';
import { GameLoop } from './GameLoop';
import type { C2SPacket, S2CPacket } from '@srobro/shared';

// Import system managers
import { GuildManager } from '../guild/GuildManager';
import { QuestManager } from '../quest/QuestManager';
import { FortressManager } from '../fortress/FortressManager';
import { MountManager } from '../mount/MountManager';
import { HotkeyManager } from '../hotkey/HotkeyManager';
import { CastingManager } from '../casting/CastingManager';
import { MinimapManager } from '../minimap/MinimapManager';
import { DropManager } from '../drop/DropManager';
import { globalSpawnManager } from '../ai/SpawnManager';
import { GmCommands } from '../admin/GmCommands';
import { loadRateOverrides } from '../admin/rateOverrides';

const logger = createLogger('GameServer');

export class GameServer {
  private io: IOServer;
  private dbManager: DatabaseManager;
  private clientManager: ClientManager | null = null;
  private worldManager: WorldManager | null = null;
  private systemHandlers: SystemHandlers | null = null;
  private authHandlers: AuthHandlers | null = null;
  private itemHandlers: ItemHandlers | null = null;
  private gmCommands: GmCommands | null = null;
  private combatBridge: CombatBridge | null = null;
  private gameLoop: GameLoop;
  private isRunning = false;

  // System managers (singletons)
  private guildManager: GuildManager;
  private questManager: QuestManager;
  private fortressManager: FortressManager;
  private mountManager: MountManager;

  // Priority 1 managers (singletons)
  private hotkeyManager: HotkeyManager;
  private castingManager: CastingManager;
  private minimapManager: MinimapManager;
  private dropManager: DropManager;

  // Tick rate
  private tickRate = 20; // Hz

  // Accès console admin (phase 6)
  getWorldManager(): WorldManager | null { return this.worldManager; }
  getClientManager(): ClientManager | null { return this.clientManager; }
  getCombatBridge(): CombatBridge | null { return this.combatBridge; }
  getGmCommands(): GmCommands | null { return this.gmCommands; }
  getDbManager(): DatabaseManager { return this.dbManager; }

  constructor(io: IOServer, dbManager: DatabaseManager) {
    this.io = io;
    this.dbManager = dbManager;

    // Initialize singleton managers
    this.guildManager = GuildManager.getInstance();
    // Guildes (Phase F V2): livrer les invitations au client cible —
    // l'event GuildManager n'avait AUCUN listener (audit modules)
    this.guildManager.on('guildInvitation', (ev: unknown) => {
      const e = ev as { targetCharacterId: string; guildId: string; guildName?: string; inviterId: string };
      this.worldManager?.emit('sendToClient', {
        playerId: e.targetCharacterId,
        event: 'guild:invited',
        data: { guildId: e.guildId, guildName: e.guildName, inviterId: e.inviterId },
      });
      logger.info(`Invitation de guilde livrée: ${e.guildName} → ${e.targetCharacterId}`);
    });

    this.questManager = QuestManager.getInstance();
    this.fortressManager = FortressManager.getInstance();
    this.mountManager = MountManager.getInstance();

    // Initialize Priority 1 managers
    this.hotkeyManager = HotkeyManager.getInstance();
    this.castingManager = CastingManager.getInstance();
    this.minimapManager = MinimapManager.getInstance();
    this.dropManager = DropManager.getInstance();

    // Initialize game loop
    this.gameLoop = new GameLoop(this.tickRate);
    this.gameLoop.on('tick', ({ delta }) => this.tick(delta));

    // Start cleanup interval for dropped items
    this.dropManager.startCleanupInterval(60000); // Every minute
  }

  /**
   * Initialize the game server
   */
  async initialize(): Promise<void> {
    logger.info('Initializing game server...');

    // Load imported official game data (items/monsters/skills from Media.pk2)
    GameDataService.getInstance().load();

    // Initialize client manager
    this.clientManager = new ClientManager(this.io, this.dbManager);
    await this.clientManager.initialize();

    // System handlers (besoin du ClientManager pour résoudre l'identité
    // authentifiée de chaque socket)
    this.systemHandlers = new SystemHandlers(this.clientManager);

    // Auth handlers (register/login/création+sélection de personnage) —
    // reçoit le WorldManager quand il est prêt (spawn du joueur)
    this.authHandlers = new AuthHandlers(this.clientManager);

    // Item handlers (inventaire, équipement, boutiques — phase 3)
    this.itemHandlers = new ItemHandlers(this.clientManager);

    // Initialize world manager
    this.worldManager = new WorldManager(this.dbManager);
    await this.worldManager.initialize();
    this.authHandlers?.setWorldManager(this.worldManager);
    this.itemHandlers?.setWorldManager(this.worldManager);

    // Spawn manager: source de vérité unique des monstres (WorldManager
    // partage sa map d'entités)
    await globalSpawnManager.initialize();
    globalSpawnManager.start();

    // Pont combat: dégâts IA, récompenses, loot, résurrection (phase 2)
    this.combatBridge = new CombatBridge(this.worldManager);
    this.combatBridge.initialize();
    this.worldManager.combatBridge = this.combatBridge;

    // Commandes GM (phase 6): dispatché par handleChatPacket avant /who /loc
    this.gmCommands = new GmCommands(this.worldManager, this.clientManager, this.dbManager);
    this.gmCommands.setCombatBridge(this.combatBridge);
    this.worldManager.gmCommands = this.gmCommands;

    // Taux live: recharge les overrides persistés dans Redis (phase 6)
    await loadRateOverrides(this.dbManager.getRedis());

    // Route les envois du WorldManager vers les sockets réels
    this.worldManager.on('sendToClient', (msg: unknown) => {
      const { playerId, packet, event, data } = msg as {
        playerId: string; packet?: S2CPacket; event?: string; data?: unknown;
      };
      const client = this.clientManager?.getClientByCharacterId(playerId);
      if (!client) return;
      if (event) {
        client.send(event, data ?? {});
      } else if (packet) {
        client.send(packet.type, packet);
      }
    });

    // Set up Socket.IO handlers
    void this.setupSocketHandlers();

    // Boucle de jeu unique (GameLoop émet 'tick' à tickRate Hz).
    // Historique: un double mécanisme GameLoop + setInterval existait — les
    // deux appelaient tick() → le monde tickait deux fois par intervalle.
    this.gameLoop.start();

    this.isRunning = true;
    logger.info(`Game server initialized (tick ${this.tickRate} Hz)`);
  }

  /**
   * Set up Socket.IO connection handlers
   */
  private async setupSocketHandlers(): Promise<void> {
    this.io.on('connection', async (socket: Socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle client connection
      this.clientManager?.handleClientConnection(socket);

      // Auth handlers (register/login/personnages) — AVANT tout le reste
      if (this.authHandlers) {
        this.authHandlers.registerHandlers(socket);
      }

      // Item handlers (inventaire/boutiques, phase 3)
      this.itemHandlers?.registerHandlers(socket);

      // Register system handlers (guild, quest, fortress, mount)
      if (this.systemHandlers) {
        this.systemHandlers.registerHandlers(socket);
      }

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);

        // Nettoyage complet AVANT la suppression du ClientManager:
        // sauvegarde + retrait du monde, cache hotkeys, casts actifs
        const client = this.clientManager?.getClient(socket.id);
        if (client) {
          const characterId = client.getCharacterId();
          if (characterId) {
            this.hotkeyManager.unloadCharacterBindings(characterId);
            this.castingManager.removeEntity(characterId);
            this.worldManager
              ?.handlePlayerLogout(client, characterId)
              .catch((err) => logger.error(`Logout cleanup failed for ${characterId}:`, err));
          }
        }

        this.clientManager?.handleClientDisconnection(socket.id);
      });

      // Handle error
      socket.on('error', (error) => {
        logger.error(`Socket error for ${socket.id}:`, error);
      });

      // Handle packets from client
      socket.on('move', (data) => this.handlePacket(socket, 'move', data));
      socket.on('attack', (data) => this.handlePacket(socket, 'attack', data));
      socket.on('cast_skill', (data) => this.handlePacket(socket, 'cast_skill', data));
      socket.on('chat', (data) => this.handlePacket(socket, 'chat', data));
      socket.on('interact', (data) => this.handlePacket(socket, 'interact', data));

      // Heartbeat client: le chargement du monde 3D peut durer > 30 s sans
      // aucun packet — sans cela le timeout d'inactivité déconnecte le client
      // en pleine session.
      socket.on('heartbeat', () => {
        this.clientManager?.getClient(socket.id)?.touch();
      });

      // Priority 1 feature packets
      socket.on('hotkey_use', (data) => this.handlePacket(socket, 'hotkey_use', data));
      socket.on('hotkey_bind', (data) => this.handlePacket(socket, 'hotkey_bind', data));
      socket.on('pickup_item', (data) => this.handlePacket(socket, 'pickup_item', data));
      socket.on('pickup_all', (data) => this.handlePacket(socket, 'pickup_all', data));

      // Résurrection (phase 2): écran client → serveur autoritaire
      socket.on('player:respawn', (data) => this.handleRespawnRequest(socket, data));

      // Interaction PNJ: quêtes (donner/rendre) avec vérification de proximité
      // Jobs (Phase E V2 — triangle Trader/Thief/Hunter)
      const { JobHandlers } = await import('./JobHandlers.js');
      new JobHandlers(
        this.clientManager, this.worldManager ?? null, this.combatBridge ?? null,
      ).register(socket);

      // Party (Phase F V2 — KB 18: Each Get 4 / Auto Share 8, bonus +3%/membre)
      // Matching window (phase D V3, KB 18 Four Square): recherche par niveau
      socket.on('party:seek', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { globalMatchingManager, MATCH_LEVEL_RANGE } = await import('../game/MatchingManager.js');
            const all = globalMatchingManager.seek(characterId, player.name, player.level);
            const compatible = all.filter((c) => Math.abs(c.level - player.level) <= MATCH_LEVEL_RANGE);
            ack?.({ success: true, seekers: compatible });
          } catch (e) { ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' }); }
        })();
      });

      socket.on('party:cancel_seek', (_d: unknown, ack?: (r: unknown) => void) => {
        const client = this.clientManager?.getClient(socket.id);
        if (client?.getCharacterId()) {
          void import('../game/MatchingManager.js').then(({ globalMatchingManager }) =>
            globalMatchingManager.cancel(client.getCharacterId()!));
        }
        ack?.({ success: true });
      });

      socket.on('party:create', (data: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { globalPartyManager } = await import('../game/PartyManager.js');
            const mode = ((data as { mode?: string })?.mode === 'each_get' ? 'each_get' : 'auto_share') as 'each_get' | 'auto_share';
            const party = globalPartyManager.create(characterId, player.name, player.level, socket.id, mode);
            ack?.({ success: true, party: globalPartyManager.serialize(party) });
          } catch (e) { ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' }); }
        })();
      });

      socket.on('party:invite', (data: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            const targetName = String((data as { name?: string })?.name ?? '');
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const target = this.worldManager?.getAllPlayers().find((p) => p.name === targetName);
            if (!target) { ack?.({ success: false, error: 'Joueur introuvable' }); return; }
            const { globalPartyManager } = await import('../game/PartyManager.js');
            globalPartyManager.invite(characterId, target.id);
            this.combatBridge?.sendToPlayerRaw(target.id, 'party:invited', {
              from: player.name, partyId: globalPartyManager.getParty(characterId)?.id,
            });
            ack?.({ success: true });
          } catch (e) { ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' }); }
        })();
      });

      socket.on('party:accept', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { globalPartyManager } = await import('../game/PartyManager.js');
            const party = globalPartyManager.accept(characterId, player.name, player.level, socket.id);
            // Notifier tous les membres
            for (const m of party.members.values()) {
              this.combatBridge?.sendToPlayerRaw(m.characterId, 'party:state', globalPartyManager.serialize(party));
            }
            ack?.({ success: true, party: globalPartyManager.serialize(party) });
          } catch (e) { ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' }); }
        })();
      });

      socket.on('party:leave', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId();
            if (!characterId) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { globalPartyManager } = await import('../game/PartyManager.js');
            globalPartyManager.leave(characterId);
            ack?.({ success: true });
          } catch (e) { ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' }); }
        })();
      });

      socket.on('party:state', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId();
            if (!characterId) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { globalPartyManager } = await import('../game/PartyManager.js');
            const party = globalPartyManager.getParty(characterId);
            ack?.({ success: true, party: party ? globalPartyManager.serialize(party) : null });
          } catch (e) { ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' }); }
        })();
      });

      // Consignation NPC Juel (Phase D V2 — KB 23: Hotan, 10 items, 3 jours)
      socket.on('consign:list', (data: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { ConsignmentManager } = await import('../game/ConsignmentManager.js');
            const cm = new ConsignmentManager(prisma);
            const slot = Number((data as { slot?: number })?.slot ?? -1);
            const price = Number((data as { price?: number })?.price ?? 0);
            await prisma.character.update({ where: { id: characterId }, data: { gold: BigInt(player.gold) } });
            const r = await cm.list(characterId, player.name, slot, price);
            ack?.({ success: true, ...r });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      socket.on('consign:search', (data: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const { ConsignmentManager } = await import('../game/ConsignmentManager.js');
            const cm = new ConsignmentManager(prisma);
            const q = (data ?? {}) as { itemName?: string; maxPrice?: number };
            ack?.({ success: true, listings: await cm.search(q) });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      socket.on('consign:buy', (data: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { ConsignmentManager } = await import('../game/ConsignmentManager.js');
            const cm = new ConsignmentManager(prisma);
            await prisma.character.update({ where: { id: characterId }, data: { gold: BigInt(player.gold) } });
            const r = await cm.buy(characterId, String((data as { listingId?: string })?.listingId ?? ''));
            player.addGold(-r.price);
            this.combatBridge?.sendPlayerState(characterId);
            ack?.({ success: true, ...r });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      socket.on('consign:cancel', (data: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            if (!characterId) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { ConsignmentManager } = await import('../game/ConsignmentManager.js');
            const cm = new ConsignmentManager(prisma);
            await cm.cancel(characterId, String((data as { listingId?: string })?.listingId ?? ''));
            ack?.({ success: true });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      // Loup de compagnie (Phase H V2 — KB 24: 1M or à l'écurie, lv 40 adulte)
      socket.on('pet:buy_wolf', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            // Écurie de Jangan (NPC stable @ (0, 510))
            const { PetService, WOLF_COST } = await import('../game/PetService.js');
            const r = PetService.getInstance().buyWolf(characterId, player.gold, { x: 0, y: 0, z: 510 }, player.position);
            player.addGold(-r.spent);
            this.combatBridge?.sendPlayerState(characterId);
            ack?.({ success: true, spent: r.spent, cost: WOLF_COST });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      socket.on('pet:summon', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player || !this.combatBridge) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { PetService } = await import('../game/PetService.js');
            const pet = PetService.getInstance().summonWolf(characterId, player.name, player.position, this.combatBridge);
            ack?.({ success: true, pet: { name: pet.name, level: pet.level, hp: pet.hp, maxHp: pet.maxHp } });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      socket.on('pet:dismiss', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            if (!characterId || !this.combatBridge) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { PetService } = await import('../game/PetService.js');
            PetService.getInstance().dismissWolf(characterId, this.combatBridge);
            ack?.({ success: true });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      // Donjons (Phase G V2 — FGW Togui + Qin-Shi B6; Phase I — Job Temple)
      socket.on('dungeon:enter', (data: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            const kind = String((data as { kind?: string })?.kind ?? 'fgw_togui') as 'fgw_togui' | 'qinshi_b6' | 'job_temple';
            const tier = String((data as { tier?: string })?.tier ?? 'a1');
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            // Job Temple: niveau + costume de métier (JobState) vérifiés
            let jobType: string | null = null;
            if (kind === 'job_temple') {
              const { JobManager } = await import('../job/JobManager.js');
              jobType = (await new JobManager(prisma).getJobState(characterId))?.jobType ?? null;
            }
            const { DungeonManager } = await import('../game/DungeonManager.js');
            const dg = await DungeonManager.getInstance().enter(characterId, kind, tier, player.position, {
              level: player.level, jobType,
            });
            this.combatBridge?.sendToPlayerRaw(characterId, 'chat', {
              message: `🌀 ${dg.note}`, channel: 'system',
            });
            ack?.({ success: true, ...dg });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      socket.on('dungeon:state', (data: unknown, ack?: (r: unknown) => void) => {
        const id = String((data as { id?: string })?.id ?? '');
        void import('../game/DungeonManager.js').then(({ DungeonManager }) => {
          ack?.({ success: true, state: DungeonManager.getInstance().getState(id) });
        });
      });

      // Energy of Life (phase C V3, titres «Blue Zerk»): remplit la jauge
      // zerk, 1×/20 min, dès le titre Knight (KB 16 §titres).
      socket.on('zerk:energy', (_d: unknown, ack?: (r: unknown) => void) => {
        void (async () => {
          try {
            const client = this.clientManager?.getClient(socket.id);
            const characterId = client?.getCharacterId() ?? null;
            const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
            if (!characterId || !player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
            const { globalTitleManager } = await import('../game/TitleManager.js');
            const r = await globalTitleManager.useEnergyOfLife(characterId);
            if (!r.ok) {
              ack?.({ success: false, error: r.remainingMs ? `Energy of Life: ${Math.ceil(r.remainingMs / 60000)} min restantes` : 'Titre Knight requis' });
              return;
            }
            player.zerkOrbs = r.orbs;
            this.combatBridge?.sendPlayerState(characterId);
            this.combatBridge?.sendToPlayerRaw(characterId, 'chat', {
              message: '⚡ Energy of Life: jauge de berserk remplie', channel: 'system',
            });
            ack?.({ success: true });
          } catch (e) {
            ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
          }
        })();
      });

      // Stalls (Phase D V2 — économie joueur: stall network officiel)
      const { StallHandlers } = await import('./StallHandlers.js');
      new StallHandlers(
        this.clientManager, this.worldManager ?? null, this.combatBridge ?? null,
      ).register(socket);

      socket.on('quest:interact', (data: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId();
          const npcId = String((data as { npcId?: string })?.npcId ?? '');
          if (!client || !characterId || !npcId) {
            if (typeof ack === 'function') ack({ success: false, error: 'Requête invalide' });
            return;
          }
          void this.combatBridge?.handleNpcInteract(client, npcId).then((r) => {
            if (typeof ack === 'function') ack(r);
          });
        } catch (error) {
          logger.error('quest:interact error:', error);
          if (typeof ack === 'function') ack({ success: false, error: 'Erreur serveur' });
        }
      });

      // Liste des PNJ (toutes zones — Phase B: monde multi-villes)
      socket.on('npc:list', (_d: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          if (!client?.getCharacterId()) {
            if (typeof ack === 'function') ack({ success: false, error: 'Non authentifié' });
            return;
          }
          void prisma.nPC.findMany().then((npcs) => {
            if (typeof ack === 'function') {
              ack({
                success: true,
                npcs: npcs.map((n) => ({
                  id: n.id, name: n.name, npcType: n.npcType,
                  position: { x: n.positionX, y: n.positionY, z: n.positionZ },
                  rotation: n.rotation,
                  dialogue: n.dialogue,
                })),
              });
            }
          });
        } catch (error) {
          logger.error('npc:list error:', error);
          if (typeof ack === 'function') ack({ success: false, error: 'Erreur serveur' });
        }
      });

      // ===== PHASE D: alchimie officielle (taux DB vSRO) =====
      socket.on('alchemy:enhance', (data: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId() ?? null;
          const slot = Number((data as { slot?: number })?.slot ?? -1);
          const usePowder = !!(data as { usePowder?: boolean })?.usePowder;
          if (!characterId || slot < 0) {
            ack?.({ success: false, error: 'Requête invalide' });
            return;
          }
          void (async () => {
            try {
              // Slot → InventoryItem (l'inventaire est adressé par slot)
              const inv = await prisma.inventoryItem.findFirst({
                where: { characterId, slot },
              });
              if (!inv) { ack?.({ success: false, error: 'Slot vide' }); return; }
              const { AlchemyManager } = await import('../alchemy/AlchemyManager.js');
              const mgr = new AlchemyManager(prisma);
              const result = await mgr.enhanceItem(inv.id, characterId, {
                luckyPowder: usePowder ? ('A' as never) : undefined,
              });
              ack?.({ success: true, ...result });
            } catch (e) {
              ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur alchimie' });
            }
          })();
        } catch (error) {
          logger.error('alchemy:enhance error:', error);
          ack?.({ success: false, error: 'Erreur serveur' });
        }
      });

      // ===== PHASE C: skills officiels (apprentissage + arbre) =====
      // Arbre des skills disponibles pour le perso (données officielles)
      socket.on('skills:available', (_d: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId() ?? null;
          const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
          if (!client?.getCharacterId() || !player) {
            if (typeof ack === 'function') ack({ success: false, error: 'Non authentifié' });
            return;
          }
          const gameData = GameDataService.getInstance();
          const race = player.race === 'european' ? 'EU' : 'CH';
          // Séries jouables (activity > 0 = castable), séries de la race
          const series = new Map<string, {
            code: string; name: string; masteryKey: string; masteryLabel: string;
            levels: Array<Record<string, unknown>>;
          }>();
          for (const s of gameData.officialSkillsByCode.values()) {
            if (s.race !== race || s.activity === 0) continue;
            if (s.masteryKey === 'character') continue; // passifs génériques hors arbre
            let entry = series.get(s.series);
            if (!entry) {
              entry = { code: s.series, name: s.name.replace(/ \d+$/, ''), masteryKey: s.masteryKey, masteryLabel: s.masteryLabel, levels: [] };
              series.set(s.series, entry);
            }
            entry.levels.push({
              code: s.code, name: s.name, level: s.level,
              reqMasteryLv: s.reqMasteryLv, reqSp: s.reqSp,
              mpCost: s.mpCost, cooldownMs: s.cooldownMs, castMs: Math.max(s.prepareMs, s.castMs),
              attKind: s.attKind, attPct: s.attPct, attMin: s.attMin, attMax: s.attMax,
              hits: s.mcHits, range: s.range, icon: s.icon,
              learned: player.learnedSkills.has(s.code),
              masteryLevel: player.getMasteryLevel(s.masteryKey),
            });
          }
          if (typeof ack === 'function') {
            ack({
              success: true, sp: player.sp, race,
              masteries: [...player.masteries.entries()],
              series: [...series.values()].map((e) => ({
                ...e,
                levels: e.levels.sort((a, b) => (a.level as number) - (b.level as number)),
              })),
            });
          }
        } catch (error) {
          logger.error('skills:available error:', error);
          if (typeof ack === 'function') ack({ success: false, error: 'Erreur serveur' });
        }
      });

      // Apprentissage d'un skill officiel (SP + maîtrise requis)
      socket.on('skill:learn', (data: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId() ?? null;
          const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
          const code = String((data as { code?: string })?.code ?? '').toUpperCase();
          const skill = GameDataService.getInstance().getOfficialSkill(code);
          if (!client?.getCharacterId() || !player) {
            if (typeof ack === 'function') ack({ success: false, error: 'Non authentifié' });
            return;
          }
          if (!skill) { ack?.({ success: false, error: 'Skill inconnu' }); return; }
          if (player.learnedSkills.has(code)) { ack?.({ success: false, error: 'Déjà appris' }); return; }
          if (skill.activity === 0) { ack?.({ success: false, error: 'Passif (non apprennable ici)' }); return; }
          const masteryLevel = player.getMasteryLevel(skill.masteryKey);
          if (masteryLevel < skill.reqMasteryLv) {
            ack?.({ success: false, error: `Maîtrise ${skill.masteryLabel} ${skill.reqMasteryLv} requise (${masteryLevel})` });
            return;
          }
          if (player.sp < skill.reqSp) { ack?.({ success: false, error: `SP insuffisants (${skill.reqSp} requis)` }); return; }
          player.sp -= skill.reqSp;
          player.learnedSkills.add(code);
          // Persistance: Skill row (id = code) + CharacterSkill
          void (async () => {
            try {
              // Mastery.id = UUID: résoudre par l'arbre (FK)
              const masteryTree = skill.masteryKey.toUpperCase();
              const masteryRow = (await prisma.mastery.findFirst({ where: { tree: masteryTree as never } }))
                ?? (await prisma.mastery.findFirst({ where: { name: { contains: skill.masteryLabel.split(' ')[0], mode: 'insensitive' } } }));
              if (!masteryRow) throw new Error('mastery introuvable pour ' + skill.masteryKey);
              await prisma.skill.upsert({
                where: { id: code },
                update: { name: skill.name, mpCost: skill.mpCost, cooldown: skill.cooldownMs, castTime: Math.max(skill.prepareMs, skill.castMs) },
                create: {
                  id: code, masteryId: masteryRow.id, name: skill.name,
                  type: skill.attKind === 8 ? 'buff' : skill.activity === 0 ? 'passive' : 'active',
                  level: skill.level, mpCost: skill.mpCost,
                  castTime: Math.max(skill.prepareMs, skill.castMs), cooldown: skill.cooldownMs,
                  baseDamage: skill.attPct, range: skill.range,
                },
              });
              await prisma.characterSkill.upsert({
                where: { characterId_skillId: { characterId: characterId as string, skillId: code } },
                update: {},
                create: { characterId: characterId as string, skillId: code, level: skill.level },
              });
            } catch (e) {
              logger.warn('Persistance skill:learn:', e);
            }
          })();
          this.combatBridge?.sendPlayerState(characterId);
          if (typeof ack === 'function') ack({ success: true, code, spLeft: player.sp });
        } catch (error) {
          logger.error('skill:learn error:', error);
          if (typeof ack === 'function') ack({ success: false, error: 'Erreur serveur' });
        }
      });

      // Activation berserker (5 orbes → ×2 dégâts 15 s — comportement officiel)
      socket.on('zerk:activate', (_d: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId() ?? null;
          const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
          if (!player) { ack?.({ success: false, error: 'Non authentifié' }); return; }
          if (player.zerkOrbs < 5) { ack?.({ success: false, error: `Orbes insuffisantes (${player.zerkOrbs}/5)` }); return; }
          player.zerkOrbs = 0;
          player.zerkActiveUntil = Date.now() + 15000;
          this.combatBridge?.sendToPlayerRaw(characterId, 'zerk:activated', { durationMs: 15000 });
          ack?.({ success: true });
        } catch (error) {
          logger.error('zerk:activate error:', error);
          if (typeof ack === 'function') ack({ success: false, error: 'Erreur serveur' });
        }
      });
      socket.on('teleport:list', (_d: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId() ?? null;
          const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
          if (!client?.getCharacterId() || !player) {
            if (typeof ack === 'function') ack({ success: false, error: 'Non authentifié' });
            return;
          }
          void prisma.teleportPoint.findMany({ where: { zoneId: player.zoneId } }).then((tps) => {
            if (typeof ack === 'function') {
              ack({
                success: true,
                gold: player.gold,
                destinations: tps.map((t) => ({
                  id: t.id, name: t.name, cost: Number(t.cost), requiredLevel: t.requiredLevel,
                })),
              });
            }
          });
        } catch (error) {
          logger.error('teleport:list error:', error);
          if (typeof ack === 'function') ack({ success: false, error: 'Erreur serveur' });
        }
      });

      // Utilisation d'un téléporteur: niveau + or + proximité vérifiés
      socket.on('teleport:use', (data: unknown, ack?: (r: unknown) => void) => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId() ?? null;
          const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
          const tpId = String((data as { teleportPointId?: string })?.teleportPointId ?? '');
          if (!client?.getCharacterId() || !player || !tpId) {
            if (typeof ack === 'function') ack({ success: false, error: 'Requête invalide' });
            return;
          }
          void (async () => {
            const tp = await prisma.teleportPoint.findUnique({ where: { id: tpId } });
            if (!tp) { ack?.({ success: false, error: 'Destination inconnue' }); return; }
            const d = Math.hypot(tp.positionX - player.position.x, tp.positionZ - player.position.z);
            if (d > 40) { ack?.({ success: false, error: `Trop loin du Gatekeeper (${Math.round(d)} m)` }); return; }
            if (player.level < tp.requiredLevel) { ack?.({ success: false, error: `Niveau ${tp.requiredLevel} requis` }); return; }
            if (player.gold < Number(tp.cost)) { ack?.({ success: false, error: `${Number(tp.cost).toLocaleString('fr')} or requis` }); return; }
            player.addGold(-Number(tp.cost));
            player.zoneId = tp.destinationZoneId;
            // Positionner l'ENTITÉ avant l'annonce réseau (teleportPlayer
            // suppose le déplacement déjà effectué — cf. cmdTeleport GM)
            player.setPosition({ x: tp.destinationPositionX, y: tp.destinationPositionY, z: tp.destinationPositionZ });
            this.combatBridge?.teleportPlayer(characterId, {
              x: tp.destinationPositionX, y: tp.destinationPositionY, z: tp.destinationPositionZ,
            });
            ack?.({ success: true, destination: tp.name, cost: Number(tp.cost) });
          })();
        } catch (error) {
          logger.error('teleport:use error:', error);
          if (typeof ack === 'function') ack({ success: false, error: 'Erreur serveur' });
        }
      });

      // Snapshot du monde à la demande (le client charge le monde 3D en
      // plusieurs minutes: les spawn packets initiaux sont perdus avant que
      // son module de rendu réseau existe)
      socket.on('world:snapshot', () => {
        try {
          const client = this.clientManager?.getClient(socket.id);
          const characterId = client?.getCharacterId();
          if (characterId) {
            this.combatBridge?.sendWorldSnapshot(characterId);
            this.combatBridge?.sendPlayerState(characterId);
          }
        } catch (error) {
          logger.error('World snapshot error:', error);
        }
      });
    });
  }

  /**
   * Résurrection demandée par le client (ville / sur place avec pénalité).
   */
  private handleRespawnRequest(socket: Socket, data: unknown): void {
    try {
      const client = this.clientManager?.getClient(socket.id);
      const characterId = client?.getCharacterId();
      if (!client || !characterId || !this.combatBridge) return;
      const mode = (data as { mode?: string })?.mode === 'here' ? 'here' : 'town';
      void this.combatBridge.handleRespawnRequest(client, characterId, mode);
    } catch (error) {
      logger.error('Respawn request error:', error);
    }
  }

  /**
   * Handle packet from client
   */
  private handlePacket(socket: Socket, type: string, data: unknown): void {
    const client = this.clientManager?.getClient(socket.id);
    if (!client) {
      logger.warn(`Received packet from unregistered client: ${socket.id}`);
      return;
    }

    // Toute activité réseau repousse le timeout d'inactivité du client
    client.touch();

    // Le client envoie le packet complet {type, timestamp, data}: déballer
    // pour ne pas emballer deux fois (packet.data.data.position → undefined).
    const raw = data as { type?: string; data?: unknown } | null;
    const payload =
      raw && typeof raw === 'object' && 'type' in raw && 'data' in raw
        ? raw.data
        : data;

    const packet: C2SPacket = {
      type: type as any,
      timestamp: Date.now(),
      playerId: client.getPlayerId(),
      data: payload,
    };

    // Route packet to appropriate handler
    switch (type) {
      case 'move':
        this.worldManager?.handleMovePacket(client, packet);
        break;
      case 'attack':
      case 'cast_skill':
        this.worldManager?.handleAttackPacket(client, packet);
        break;
      case 'chat':
        this.worldManager?.handleChatPacket(client, packet);
        break;
      case 'interact':
        this.worldManager?.handleInteractPacket(client, packet);
        break;
      case 'hotkey_use':
        this.handleHotkeyUse(client, packet);
        break;
      case 'hotkey_bind':
        this.handleHotkeyBind(client, packet);
        break;
      case 'pickup_item':
        this.handlePickupItem(client, packet);
        break;
      case 'pickup_all':
        this.handlePickupAll(client, packet);
        break;
      default:
        logger.warn(`Unknown packet type: ${type}`);
    }
  }

  /**
   * Broadcast packet to all clients
   */
  broadcast(packet: S2CPacket): void {
    this.io.emit(packet.type, packet);
  }

  /**
   * Broadcast packet to all clients in a room
   */
  broadcastToRoom(room: string, packet: S2CPacket): void {
    this.io.to(room).emit(packet.type, packet);
  }

  /**
   * Send packet to specific client
   */
  sendToClient(socketId: string, packet: S2CPacket): void {
    this.io.to(socketId).emit(packet.type, packet);
  }

  /**
   * Game tick — protégé: une exception dans un sous-système ne doit jamais
   * tuer la boucle (setInterval + exception non catchée = crash du process).
   */
  private tick(delta: number): void {
    try {
      // Update world
      this.worldManager?.update(delta);

      // Update clients
      this.clientManager?.update(delta);

      // Update all active casts
      this.castingManager.updateAllActiveCasts();
    } catch (error) {
      logger.error('Game tick error:', error);
    }
  }

  // ============================================
  // PRIORITY 1 FEATURE HANDLERS
  // ============================================

  /**
   * Handle hotkey use
   */
  private async handleHotkeyUse(client: any, packet: C2SPacket): Promise<void> {
    const data = packet.data as { slotType: string; slotIndex: number };
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    const result = await this.hotkeyManager.useHotkey(
      characterId,
      data.slotType as any,
      data.slotIndex
    );

    if (result.success) {
      // Execute the skill or item use
      if (result.type === 'skill' && result.id) {
        // Trigger skill cast
        const skillPacket = {
          type: 'cast_skill' as const,
          timestamp: Date.now(),
          data: { skillId: result.id }
        };
        this.worldManager?.handleAttackPacket(client, skillPacket);
      } else if (result.type === 'item' && result.id) {
        // Use item
        // TODO: Implement item use
        logger.info(`Character ${characterId} used item ${result.id} via hotkey`);
      }
    } else {
      logger.warn(`Hotkey use failed: ${result.error}`);
    }
  }

  /**
   * Handle hotkey binding
   */
  private async handleHotkeyBind(client: any, packet: C2SPacket): Promise<void> {
    const data = packet.data as { slotType: string; slotIndex: number; itemId?: string; skillId?: string };
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    const success = await this.hotkeyManager.saveBinding(
      characterId,
      data.slotType as any,
      data.slotIndex,
      data.itemId,
      data.skillId
    );

    if (success) {
      // Confirm binding save
      this.sendToClient(client.getSocketId(), {
        type: 'hotkey_bind_response',
        timestamp: Date.now(),
        data: { success: true, slotType: data.slotType, slotIndex: data.slotIndex }
      });
    } else {
      this.sendToClient(client.getSocketId(), {
        type: 'hotkey_bind_response',
        timestamp: Date.now(),
        data: { success: false, error: 'Failed to save binding' }
      });
    }
  }

  /**
   * Handle item pickup
   */
  private async handlePickupItem(client: any, packet: C2SPacket): Promise<void> {
    const data = packet.data as { droppedItemId: string };
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    const result = await this.dropManager.pickupItem(data.droppedItemId, characterId);

    if (result.success) {
      // Send success response with item data
      this.sendToClient(client.getSocketId(), {
        type: 'pickup_success',
        timestamp: Date.now(),
        data: {
          itemId: result.itemId,
          itemData: result.itemData
        }
      });

      // Broadcast item pickup to nearby players
      // TODO: Implement AOI broadcast
    } else {
      // Send error response
      this.sendToClient(client.getSocketId(), {
        type: 'pickup_failed',
        timestamp: Date.now(),
        data: { message: result.message }
      });
    }
  }

  /**
   * Handle pickup all nearby items
   */
  private async handlePickupAll(client: any, _packet: C2SPacket): Promise<void> {
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    // Get player position
    const player = await this.worldManager?.getCharacter(characterId);

    if (!player) {
      return;
    }

    // Get nearby dropped items from zone
    const zoneItems = await this.dropManager.getDroppedItemsInZone(player.zoneId);

    let pickedUp = 0;
    for (const item of zoneItems) {
      const result = await this.dropManager.pickupItem(item.id, characterId);
      if (result.success) {
        pickedUp++;
      }
    }

    // Send response
    this.sendToClient(client.getSocketId(), {
      type: 'pickup_all_response',
      timestamp: Date.now(),
      data: { pickedUp }
    });
  }

  /**
   * Shutdown the game server
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down game server...');

    this.isRunning = false;

    // Stop game loop
    this.gameLoop.stop();

    // Stop spawn manager
    await globalSpawnManager.shutdown();

    // Disconnect all clients
    await this.clientManager?.shutdown();

    // Shutdown world manager
    await this.worldManager?.shutdown();

    logger.info('Game server shutdown complete');
  }

  /**
   * Get server status
   */
  getStatus(): { isRunning: boolean; clients: number; tickRate: number } {
    return {
      isRunning: this.isRunning,
      clients: this.clientManager?.getClientCount() || 0,
      tickRate: this.tickRate,
    };
  }

  // ============================================
  // MANAGER GETTERS
  // ============================================

  /**
   * Get guild manager instance
   */
  getGuildManager(): GuildManager {
    return this.guildManager;
  }

  /**
   * Get quest manager instance
   */
  getQuestManager(): QuestManager {
    return this.questManager;
  }

  /**
   * Get fortress manager instance
   */
  getFortressManager(): FortressManager {
    return this.fortressManager;
  }

  /**
   * Get mount manager instance
   */
  getMountManager(): MountManager {
    return this.mountManager;
  }

  /**
   * Get hotkey manager instance
   */
  getHotkeyManager(): HotkeyManager {
    return this.hotkeyManager;
  }

  /**
   * Get casting manager instance
   */
  getCastingManager(): CastingManager {
    return this.castingManager;
  }

  /**
   * Get minimap manager instance
   */
  getMinimapManager(): MinimapManager {
    return this.minimapManager;
  }

  /**
   * Get drop manager instance
   */
  getDropManager(): DropManager {
    return this.dropManager;
  }
}
