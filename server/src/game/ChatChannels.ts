// ============================================
// SRObro - Canaux de chat sociaux (phase D V3)
// party / guild / union + /w whisper par NOM.
// Routage: PartyManager (membres), GuildManager (guilde), UnionMember.
// ============================================
import { prisma } from '../database/prisma';
import { globalPartyManager } from './PartyManager';

export interface SocialTargets {
  characterIds: string[];
  label: string;
}

/** Membres du groupe du joueur (si en groupe). */
export function partyTargets(characterId: string): SocialTargets | null {
  const party = globalPartyManager.getParty(characterId);
  if (!party) return null;
  const ids = [...party.members.keys()];
  return ids.length ? { characterIds: ids, label: 'party' } : null;
}

/** Membres de la guilde du joueur. */
export async function guildTargets(characterId: string): Promise<SocialTargets | null> {
  const gm = await prisma.guildMember.findUnique({
    where: { characterId },
    include: { guild: { include: { members: true } } },
  });
  if (!gm) return null;
  const ids = gm.guild.members.map((m) => m.characterId);
  return ids.length ? { characterIds: ids, label: 'guild' } : null;
}

/** Membres de toutes les guildes de l'union du joueur. */
export async function unionTargets(characterId: string): Promise<SocialTargets | null> {
  const gm = await prisma.guildMember.findUnique({
    where: { characterId },
    include: { guild: true },
  });
  if (!gm) return null;
  const membership = await prisma.unionMember.findUnique({
    where: { guildId: gm.guild.id },
  });
  if (!membership) return null;
  const guildsInUnion = await prisma.unionMember.findMany({
    where: { unionId: membership.unionId },
  });
  const guilds = await prisma.guild.findMany({
    where: { id: { in: guildsInUnion.map((g) => g.guildId) } },
    include: { members: true },
  });
  const ids = guilds.flatMap((g) => g.members.map((m) => m.characterId));
  return ids.length ? { characterIds: ids, label: 'union' } : null;
}

/** Résolution /w <nom> → characterId EN LIGNE (insensible à la casse). */
export async function resolvePlayerByName(name: string): Promise<{ id: string; name: string } | null> {
  const row = await prisma.character.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, isOnline: true },
    select: { id: true, name: true },
  });
  return row ?? null;
}
