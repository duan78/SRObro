/**
 * SRObro - Étiquettes flottantes monde (V4 §E)
 *
 * Noms au-dessus des têtes (PNJ, monstres, joueurs distants) et marqueurs
 * de quête « ! » / « ? » comme le client officiel: plan billboard + texte
 * DynamicTexture, attaché à la racine de l'entité (suit l'entité).
 */

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Scene, TransformNode } from '@babylonjs/core';

export interface LabelStyle {
  color?: string;
  font?: string;
  background?: string;
  width?: number;
  height?: number;
}

/** Crée (ou met à jour) une étiquette billboard au-dessus d'une entité. */
export function setEntityLabel(
  scene: Scene,
  parent: TransformNode,
  key: string,
  text: string,
  y: number,
  style: LabelStyle = {},
): Mesh | null {
  const name = `label_${key}`;
  let plane = scene.getMeshByName(name) as Mesh | null;
  if (!plane) {
    plane = MeshBuilder.CreatePlane(name, { width: style.width ?? 14, height: style.height ?? 3.4 }, scene);
    plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
    plane.isPickable = false;
    plane.parent = parent;
    plane.position.y = y;
    const mat = new StandardMaterial(`${name}_mat`, scene);
    mat.diffuseTexture = new DynamicTexture(`${name}_tex`, { width: 512, height: 128 }, scene, true);
    mat.emissiveColor = new Color3(1, 1, 1);
    mat.disableLighting = true;
    mat.backFaceCulling = false;
    mat.freeze?.();
    plane.material = mat;
  }
  const mat = plane.material as StandardMaterial | null;
  const tex = mat?.diffuseTexture as DynamicTexture | null;
  if (tex) {
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 512, 128);
    if (style.background) {
      ctx.fillStyle = style.background;
      ctx.fillRect(0, 0, 512, 128);
    }
    ctx.font = style.font ?? 'bold 44px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = style.color ?? '#ffd76e';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 6;
    ctx.fillText(text, 256, 66, 480);
    tex.update();
    tex.hasAlpha = true;
  }
  return plane;
}

/** Marqueur de quête officiel: « ! » disponible (orange), « ? » en cours (bleu). */
export function setQuestMarker(
  scene: Scene,
  parent: TransformNode,
  npcId: string,
  state: 'start' | 'progress' | null,
  y: number,
): void {
  // setEntityLabel préfixe les noms par « label_ »
  const existing = scene.getMeshByName(`label_qmark_${npcId}`);
  if (!state) {
    existing?.dispose();
    return;
  }
  const color = state === 'start' ? '#ffb638' : '#7fb8ff';
  const glyph = state === 'start' ? '!' : '?';
  setEntityLabel(scene, parent, `qmark_${npcId}`, glyph, y + 4.4, {
    color,
    font: 'bold 92px "Segoe UI", sans-serif',
    width: 6,
    height: 6,
  });
}

/** Nettoie étiquette + marqueur d'une entité (despawn). ⚠️ les marqueurs de
 *  quête passent par setEntityLabel → leur mesh est préfixé « label_ » aussi. */
export function disposeEntityLabels(scene: Scene, key: string): void {
  scene.getMeshByName(`label_${key}`)?.dispose();
  scene.getMeshByName(`label_qmark_${key}`)?.dispose();
  scene.getMeshByName(`qmark_${key}`)?.dispose();
}
