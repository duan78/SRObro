// ============================================
// SRObro - Audio (phase 7)
// Musique de zone (Music/jangan_town.ogg, boucle) + SFX combat (wav du
// client officiel: coups d'épée, mort de monstre). Léger: <audio> pour la
// musique, pool de clones pour les SFX courts. Autoplay toléré: le joueur
// a interagi avec l'écran d'auth avant l'entrée en jeu.
// ============================================

const MUSIC_URL = '/assets/audio/Music/jangan_town.ogg';
const SND_BASE = '/assets/audio/Data/prim/snd';

export class GameAudio {
  private music: HTMLAudioElement | null = null;
  private musicOn = false;
  private sfxOn = true;
  private pool = new Map<string, HTMLAudioElement[]>();
  private lastPlayed = new Map<string, number>();

  /** Démarre la musique de ville (appelé à l'entrée en jeu). */
  startZoneMusic(): void {
    if (this.music) return;
    const a = new Audio(MUSIC_URL);
    a.loop = true;
    a.volume = 0.35;
    a.play().then(() => { this.musicOn = true; }).catch(() => {
      // Autoplay bloqué: un geste utilisateur débloquera au prochain SFX
      this.musicOn = false;
    });
    // Certains navigateurs coupent après une pause ONGLET: reprise au retour
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.musicOn && this.music) void this.music.play().catch(() => {});
    });
    this.music = a;
  }

  toggleMusic(): boolean {
    if (!this.music) return false;
    this.musicOn = !this.musicOn;
    if (this.musicOn) void this.music.play().catch(() => { this.musicOn = false; });
    else this.music.pause();
    return this.musicOn;
  }

  isMusicOn(): boolean { return this.musicOn; }
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
}

export const gameAudio = new GameAudio();
