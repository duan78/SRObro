// ============================================
// SRObro - PartyManager (Phase F V2)
// Party officielle (KB 18): 2 modes — Each Get EXP (max 4, sans contrainte
// de distance) et Auto Share EXP (max 8, distance requise, bonus ~+3%/membre
// au partage). Distribution du loot à tour de rôle.
// ============================================

import { createLogger } from '../core/Logger';
import type { WorldManager } from './WorldManager';

const logger = createLogger('PartyManager');

/** Bonus Auto Share officiel (KB 18): ~+3% par membre. */
export const AUTO_SHARE_BONUS_PER_MEMBER = 0.03;
/** Distance max Auto Share (KB 18): les membres doivent rester groupés. */
const AUTO_SHARE_MAX_DISTANCE = 150;

export type PartyMode = 'each_get' | 'auto_share';

interface PartyMember {
  characterId: string;
  name: string;
  level: number;
  socketId: string;
}

interface Party {
  id: string;
  leaderId: string;
  mode: PartyMode;
  members: Map<string, PartyMember>;
  lootTurn: number; // index du prochain ramasseur (rôle-rond)
}

export class PartyManager {
  private static instance: PartyManager | null = null;
  private parties = new Map<string, Party>(); // partyId
  private memberParty = new Map<string, string>(); // characterId → partyId
  private invites = new Map<string, { fromId: string; partyId: string; at: number }>();

  static getInstance(): PartyManager {
    if (!PartyManager.instance) PartyManager.instance = new PartyManager();
    return PartyManager.instance;
  }

  create(leaderId: string, name: string, level: number, socketId: string, mode: PartyMode = 'auto_share'): Party {
    if (this.memberParty.has(leaderId)) throw new Error('Déjà en party');
    const id = `pty_${Date.now().toString(36)}`;
    const party: Party = {
      id, leaderId, mode,
      members: new Map([[leaderId, { characterId: leaderId, name, level, socketId }]]),
      lootTurn: 0,
    };
    this.parties.set(id, party);
    this.memberParty.set(leaderId, id);
    logger.info(`Party ${id} créée par ${name} (${mode})`);
    return party;
  }

  invite(fromId: string, targetId: string): void {
    const partyId = this.memberParty.get(fromId);
    if (!partyId) throw new Error('Pas en party');
    this.invites.set(targetId, { fromId, partyId, at: Date.now() });
  }

  /** Accepte l'invitation en attente. */
  accept(characterId: string, name: string, level: number, socketId: string): Party {
    const inv = this.invites.get(characterId);
    if (!inv || Date.now() - inv.at > 60000) throw new Error('Aucune invitation en attente');
    const party = this.parties.get(inv.partyId);
    if (!party) throw new Error('Party dissoute');
    const max = party.mode === 'auto_share' ? 8 : 4;
    if (party.members.size >= max) throw new Error(`Party pleine (${max} max — KB 18)`);
    if (this.memberParty.has(characterId)) throw new Error('Déjà en party');
    party.members.set(characterId, { characterId, name, level, socketId });
    this.memberParty.set(characterId, party.id);
    this.invites.delete(characterId);
    return party;
  }

  leave(characterId: string): void {
    const partyId = this.memberParty.get(characterId);
    if (!partyId) return;
    const party = this.parties.get(partyId);
    this.memberParty.delete(characterId);
    if (!party) return;
    party.members.delete(characterId);
    if (party.members.size === 0) {
      this.parties.delete(partyId);
    } else if (party.leaderId === characterId) {
      party.leaderId = [...party.members.keys()][0]; // promotion auto
    }
  }

  getParty(characterId: string): Party | null {
    const id = this.memberParty.get(characterId);
    return id ? this.parties.get(id) ?? null : null;
  }

  /** Membres AUTORISÉS à partager l'XP du tueur (KB 18):
   *  - Each Get: personne d'autre (chacun ses mobs)
   *  - Auto Share: tous les membres à distance, bonus +3%/membre vivant */
  shareTargets(killerId: string, killerPos: { x: number; z: number }, worldManager: WorldManager): Array<{ characterId: string; ratio: number }> {
    const party = this.getParty(killerId);
    if (!party || party.mode !== 'auto_share') {
      return [{ characterId: killerId, ratio: 1 }];
    }
    const near: Array<{ characterId: string; ratio: number }> = [];
    for (const m of party.members.values()) {
      const p = worldManager.getPlayer(m.characterId);
      if (!p || !p.isAlive()) continue;
      const d = Math.hypot(p.position.x - killerPos.x, p.position.z - killerPos.z);
      if (d > AUTO_SHARE_MAX_DISTANCE) continue;
      near.push({ characterId: m.characterId, ratio: 1 });
    }
    if (near.length === 0) return [{ characterId: killerId, ratio: 1 }];
    // Bonus officiel: total = base × (1 + 3%×(n−1)), réparti à parts égales
    const bonus = 1 + AUTO_SHARE_BONUS_PER_MEMBER * (near.length - 1);
    const each = bonus / near.length;
    return near.map((n) => ({ characterId: n.characterId, ratio: each }));
  }

  /** Ramasseur au tour de rôle (loot round-robin KB 18). */
  nextLooter(partyId: string): string | null {
    const party = this.parties.get(partyId);
    if (!party) return null;
    const ids = [...party.members.keys()];
    const looter = ids[party.lootTurn % ids.length];
    party.lootTurn++;
    return looter;
  }

  serialize(party: Party): Record<string, unknown> {
    return {
      id: party.id,
      leaderId: party.leaderId,
      mode: party.mode,
      members: [...party.members.values()].map((m) => ({
        characterId: m.characterId, name: m.name, level: m.level,
      })),
    };
  }
}

export const globalPartyManager = PartyManager.getInstance();
