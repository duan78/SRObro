// ============================================
// SRObro - Minimap réelle (phase 7)
// Fond = tuiles minimap officielles du client (Media/minimap/{rx}x{rz}.webp,
// 256 px pour 1920 unités monde, ancre RealTerrain 69×71). Mosaïque 3×3
// autour de la région courante, flèche joueur orientée, Nord fixe.
// ============================================

const TILE_URL = '/assets/textures/Media/minimap';
const TILE_PX = 256;
const REGION_UNITS = 1920;
/** Ancre du monde local (cf. RealTerrain.ANCHOR): région 69×71 = (0,0) local */
const ANCHOR = { x: 69, z: 71 };
const VIEW_PX = 188; // taille affichée (canvas)

export class Minimap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  /** Tuiles chargées (null = absente du client, fond sombre) */
  private tiles = new Map<string, HTMLImageElement | null>();
  /** Région pour laquelle la mosaïque courante a été dessinée */
  private mosaicRegion = { x: -999, z: -999 };
  private mosaic: HTMLCanvasElement;
  private lastDraw = { x: -1e9, z: -1e9, rot: -99 };

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = VIEW_PX;
    this.canvas.height = VIEW_PX;
    this.canvas.style.cssText = 'display:block;border:1px solid #55461f;border-radius:6px;background:#0b0f14;';
    container.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.mosaic = document.createElement('canvas');
    this.mosaic.width = TILE_PX * 3;
    this.mosaic.height = TILE_PX * 3;
  }

  /** À appeler avec la position locale du joueur et son cap (radians, 0 = +Z). */
  update(x: number, z: number, rotation: number): void {
    const rx = ANCHOR.x + Math.floor(x / REGION_UNITS);
    const rz = ANCHOR.z + Math.floor(z / REGION_UNITS);

    // Redessin seulement si le pixel minimap a bougé de ≥2 px ou rotation ≥0.06 rad
    const px = ((x / REGION_UNITS) % 1 + 1) % 1;
    const pz = ((z / REGION_UNITS) % 1 + 1) % 1;
    if (this.mosaicRegion.x === rx && this.mosaicRegion.z === rz
      && Math.abs(px - this.lastDraw.x) * TILE_PX < 2
      && Math.abs(pz - this.lastDraw.z) * TILE_PX < 2
      && Math.abs(rotation - this.lastDraw.rot) < 0.06) {
      return;
    }
    this.lastDraw = { x: px, z: pz, rot: rotation };

    if (this.mosaicRegion.x !== rx || this.mosaicRegion.z !== rz) {
      this.drawMosaic(rx, rz);
    }

    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIEW_PX, VIEW_PX);
    ctx.imageSmoothingEnabled = true;
    // Fenêtre centrée sur le joueur dans la mosaïque 3×3 (tuile centrale = index 1,1)
    const cx = (1 + px) * TILE_PX;
    const cz = (1 + pz) * TILE_PX;
    ctx.drawImage(this.mosaic, cx - VIEW_PX / 2, cz - VIEW_PX / 2, VIEW_PX, VIEW_PX, 0, 0, VIEW_PX, VIEW_PX);

    // Grille discrète des frontières de régions
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (let i = -1; i <= 1; i++) {
      const gx = Math.round(cx + i * TILE_PX - (cx - VIEW_PX / 2));
      if (gx >= 0 && gx <= VIEW_PX) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, VIEW_PX); ctx.stroke(); }
      const gz = Math.round(cz + i * TILE_PX - (cz - VIEW_PX / 2));
      if (gz >= 0 && gz <= VIEW_PX) { ctx.beginPath(); ctx.moveTo(0, gz); ctx.lineTo(VIEW_PX, gz); ctx.stroke(); }
    }

    // Flèche joueur orientée (0 rad = +Z local; canvas y croissant = +Z)
    const c = VIEW_PX / 2;
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(-rotation);
    ctx.fillStyle = '#ffd24a';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5.5, 7);
    ctx.lineTo(0, 3.5);
    ctx.lineTo(-5.5, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Nord
    ctx.fillStyle = 'rgba(240,230,210,0.9)';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', c, 12);
  }

  /** Mosaïque 3×3 autour de la région (rx,rz) — tuiles manquantes en sombre. */
  private drawMosaic(rx: number, rz: number): void {
    const mctx = this.mosaic.getContext('2d')!;
    mctx.fillStyle = '#0b0f14';
    mctx.fillRect(0, 0, this.mosaic.width, this.mosaic.height);
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const img = this.tile(rx + dx, rz + dz);
        if (img) {
          mctx.drawImage(img, (dx + 1) * TILE_PX, (dz + 1) * TILE_PX, TILE_PX, TILE_PX);
        }
      }
    }
    this.mosaicRegion = { x: rx, z: rz };
  }

  /** Charge (une fois) une tuile minimap; null si absente. */
  private tile(rx: number, rz: number): HTMLImageElement | null {
    const key = `${rx}x${rz}`;
    if (this.tiles.has(key)) return this.tiles.get(key)!;
    this.tiles.set(key, null); // pessimiste: si le 404 arrive après, reste sombre
    const img = new Image();
    img.onload = () => {
      this.tiles.set(key, img);
      this.drawMosaic(this.mosaicRegion.x, this.mosaicRegion.z); // rafraîchit la mosaïque affichée
    };
    img.src = `${TILE_URL}/${key}.webp`;
    return null;
  }
}
