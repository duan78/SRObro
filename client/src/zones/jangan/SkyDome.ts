/**
 * SRObro — SkyDome (phase B V3: ciel)
 *
 * Le client officiel n'a pas de skybox 6-faces: ciel = dégradé + couche de
 * nuages (textures Media cloud1/cloud99). Ici: grande sphère à dégradé
 * vertical (dynamic texture), infiniteDistance, + plan de nuages OFFICIEL
 * (cloud1.png) en dérive lente au-dessus du joueur. Teinte par continent
 * (Chine bleu, Europe azur, Égypte chaud) changée au téléport.
 */
import { MeshBuilder, StandardMaterial, Color3, Texture, DynamicTexture } from '@babylonjs/core';
import type { Scene, Mesh, TransformNode } from '@babylonjs/core';

export interface SkyTint { top: Color3; horizon: Color3; }

const TINTS: Record<string, SkyTint> = {
  china: { top: new Color3(0.36, 0.62, 0.92), horizon: new Color3(0.78, 0.88, 0.96) },
  europe: { top: new Color3(0.42, 0.58, 0.88), horizon: new Color3(0.82, 0.86, 0.92) },
  egypt: { top: new Color3(0.55, 0.68, 0.88), horizon: new Color3(0.96, 0.86, 0.68) },
};

export class SkyDome {
  private scene: Scene;
  private dome: Mesh | null = null;
  private clouds: Mesh | null = null;
  private gradientTex: DynamicTexture | null = null;
  private currentTint = 'china';

  constructor(scene: Scene) {
    this.scene = scene;
    this.build();
  }

  private build(): void {
    // Dôme dégradé (sphère BACKSIDE, suit le joueur en infiniteDistance)
    this.dome = MeshBuilder.CreateSphere('sky_dome', { diameter: 20000, segments: 12 }, this.scene);
    this.dome.infiniteDistance = true;
    this.dome.isPickable = false;
    const mat = new StandardMaterial('sky_mat', this.scene);
    mat.backFaceCulling = false;
    mat.disableLighting = true;
    mat.emissiveColor = new Color3(1, 1, 1);
    this.gradientTex = new DynamicTexture('sky_gradient', { width: 16, height: 256 }, this.scene, false);
    mat.diffuseTexture = this.gradientTex;
    mat.specularColor = new Color3(0, 0, 0);
    this.dome.material = mat;
    this.paint(TINTS.china);

    // Nuages officiels (Media cloud1.png): grand plan en dérive au-dessus
    this.clouds = MeshBuilder.CreateGround('sky_clouds', { width: 30000, height: 30000 }, this.scene);
    this.clouds.position.y = 1400;
    this.clouds.isPickable = false;
    const cmat = new StandardMaterial('sky_clouds_mat', this.scene);
    const ctex = new Texture('/assets/textures/skybox/cloud1.png', this.scene, false, false);
    ctex.uScale = 24;
    ctex.vScale = 24;
    cmat.diffuseTexture = ctex;
    cmat.opacityTexture = ctex;
    cmat.emissiveColor = new Color3(1, 1, 1);
    cmat.disableLighting = true;
    cmat.alpha = 0.55;
    this.clouds.material = cmat;
  }

  /** Peint le dégradé vertical du dôme (haut → horizon). */
  private paint(tint: SkyTint): void {
    if (!this.gradientTex) return;
    const ctx = this.gradientTex.getContext();
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, this.css(tint.top, 1));
    g.addColorStop(0.62, this.css(tint.top, 1));
    g.addColorStop(0.86, this.css(tint.horizon, 1));
    g.addColorStop(1, this.css(tint.horizon, 1));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 256);
    this.gradientTex.update(false);
  }

  private css(c: Color3, _a: number): string {
    return `rgb(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)})`;
  }

  /** À appeler quand le joueur change de continent (téléport). */
  setContinent(x: number, z: number): void {
    // Grille monde: Égypte = grand sud-ouest (Alexandria ~40k,-42k),
    // Europe = grand est (Constantinople ~69k,16k), Chine = le reste.
    const key = z < -30000 ? 'egypt' : x > 50000 ? 'europe' : 'china';
    if (key !== this.currentTint) {
      this.currentTint = key;
      this.paint(TINTS[key]);
    }
  }

  /** Dérive des nuages + suivi du joueur (appeler par tick, ~1 Hz suffit). */
  update(playerX: number, playerZ: number, dt: number): void {
    if (this.clouds) {
      this.clouds.position.x = playerX;
      this.clouds.position.z = playerZ;
      const tex = (this.clouds.material as StandardMaterial).diffuseTexture as Texture;
      tex.uOffset += dt * 0.004;
      tex.vOffset += dt * 0.0015;
    }
    this.setContinent(playerX, playerZ);
  }

  dispose(): void {
    this.dome?.dispose();
    this.clouds?.dispose();
  }
}

/** Fabrique et branche le ciel dans la scène (idempotent). */
export function ensureSky(scene: Scene, existing: SkyDome | null): SkyDome {
  if (existing) return existing;
  return new SkyDome(scene);
}

export type { TransformNode };
