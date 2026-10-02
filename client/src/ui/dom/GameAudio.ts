// ============================================
// SRObro - Audio (phase 7 + V2 phase H: playlist par zone)
// Musique de zone OFFICIELLE (Music.pk2 → /assets/audio/Music/): la piste
// suit la position du joueur (villes et zones sauvages des 3 continents),
// boucle + crossfade léger. SFX combat (wav du client officiel).
// ============================================

const MUSIC_BASE = '/assets/audio/Music';
const SND_BASE = '/assets/audio/Data/prim/snd';

/** Zone musicale par position monde (KB 13: plages des régions).
 *  Chaque ville a town+field; les zones sauvages prennent le field de la
 *  région la plus proche. */
interface ZoneMusic { minX: number; maxX: number; minZ: number; maxZ: number; town: string; field: string }

const ZONE_MUSIC: ZoneMusic[] = [
  // Jangan (engine 0,510) et plaines de Chine
  { minX: -1300, maxX: 1300, minZ: -800, maxZ: 2000, town: 'jangan_town.ogg', field: 'jangan_field.ogg' },
  // Donwhang (−2908, 1523) et Chine de l'ouest
  { minX: -4600, maxX: -1300, minZ: 300, maxZ: 3200, town: 'donwhang_town.ogg', field: 'donwhang_field.ogg' },
  // Hotan (−6347, −541) et Oasis Kingdom
  { minX: -9500, maxX: -4600, minZ: -2600, maxZ: 300, town: 'centralasia_town.ogg', field: 'hotan_field.ogg' },
  // Karakoram / Taklamakan (au-delà d'Hotan, vers l'ouest)
  { minX: -14000, maxX: -9500, minZ: -4000, maxZ: 4000, town: 'centralasia_town.ogg', field: 'karakoram_field.ogg' },
];

/** Piste pour une position: town si <450 m d'un centre-ville, sinon field. */
export function trackForPosition(x: number, z: number): string {
  const TOWNS: Array<{ x: number; z: number; town: string }> = [
    { x: 0, z: 510, town: 'jangan_town.ogg' },
    { x: -2908, z: 1523, town: 'donwhang_town.ogg' },
    { x: -6347, z: -541, town: 'centralasia_town.ogg' },
  ];
  for (const t of TOWNS) {
    if (Math.hypot(t.x - x, t.z - z) < 450) return t.town;
  }
  const zone = ZONE_MUSIC.find((z2) => x >= z2.minX && x <= z2.maxX && z >= z2.minZ && z <= z2.maxZ);
  return zone?.field ?? 'jangan_field.ogg';
}

export class GameAudio {
  private music: HTMLAudioElement | null = null;
  private currentTrack = '';
  private musicOn = false;
  private sfxOn = true;
  private pool = new Map<string, HTMLAudioElement[]>();
  private lastPlayed = new Map<string, number>();
  private lastZoneCheck = 0;

  /** Démarre la musique (piste de la position courante). */
  startZoneMusic(x = 0, z = 510): void {
    this.playTrack(trackForPosition(x, z));
    // Certains navigateurs coupent après une pause ONGLET: reprise au retour
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.musicOn && this.music) void this.music.play().catch(() => {});
    });
  }

  /** Tick: change de piste quand le joueur change de zone (throttle 3 s). */
  updateZoneMusic(x: number, z: number): void {
    const now = performance.now();
    if (now - this.lastZoneCheck < 3000) return;
    this.lastZoneCheck = now;
    const track = trackForPosition(x, z);
    if (track !== this.currentTrack) this.playTrack(track);
  }

  private playTrack(track: string): void {
    if (this.music) {
      this.music.pause();
      this.music.src = '';
    }
    const a = new Audio(`${MUSIC_BASE}/${track}`);
    a.loop = true;
    a.volume = 0.35;
    a.play().then(() => { this.musicOn = true; }).catch(() => {
      this.musicOn = false; // autoplay bloqué: un geste débloquera au SFX
    });
    this.music = a;
    this.currentTrack = track;
  }

  toggleMusic(): boolean {
    if (!this.music) return false;
    this.musicOn = !this.musicOn;
    if (this.musicOn) void this.music.play().catch(() => { this.musicOn = false; });
    else this.music.pause();
    return this.musicOn;
  }

  isMusicOn(): boolean { return this.musicOn; }
  getCurrentTrack(): string { return this.currentTrack; }
  isSfxOn(): boolean { return this.sfxOn; }

  toggleSfx(): boolean {
    this.sfxOn = !this.sfxOn;
    return this.sfxOn;
  }

  /** SFX court avec anti-spam (60 ms) et pool de clones (chevauchement). */
  sfx(path: string, volume = 0.5): void {
    if (!this.sfxOn) return;
    const now = performance.now();
    if (now - (this.lastPlayed.get(path) ?? 0) < 60) return;
    this.lastPlayed.set(path, now);
    const pool = this.pool.get(path) ?? [];
    const free = pool.find((a) => a.paused) ?? (() => {
      const a = new Audio(`${SND_BASE}/${path}`);
      a.volume = volume;
      pool.push(a);
      return a;
    })();
    this.pool.set(path, pool);
    free.currentTime = 0;
    free.volume = volume;
    void free.play().catch(() => { /* autoplay: ignoré */ });
  }

  // Raccourcis combat
  swordHit(): void { this.sfx('player/batswordhit1a.wav', 0.45); }
  swordSwing(): void { this.sfx('player/bateuswordswing1.wav', 0.3); }
  monsterDie(): void { this.sfx('ca_mob/cara_bunwang_die.wav', 0.5); }
  monsterHurt(): void { this.sfx('ca_mob/cara_bunwang_moan1.wav', 0.35); }
  // Phase G V3 — SFX étendus (officiels Data/prim/snd)
  levelUp(): void { this.sfx('ui/itlevelup.wav', 0.6); }
  uiClick(): void { this.sfx('common/iron_click.wav', 0.25); }
  bowShot(): void { this.sfx('common/batbowswing3.wav', 0.4); }
  crit(): void { this.sfx('player/batswordhit1n.wav', 0.55); }

  /** Volume général persisté (options). */
  setVolume(v: number): void {
    for (const pool of this.pool.values()) {
      for (const a of pool) a.volume = Math.max(0, Math.min(1, v));
    }
    try { localStorage.setItem('srobro:volume', String(v)); } catch { /* privé */ }
  }
  getVolume(): number {
    try { return Number(localStorage.getItem('srobro:volume') ?? '0.5'); } catch { return 0.5; }
  }
}

export const gameAudio = new GameAudio();
