/**
 * SRObro - Mini-map Component
 * Displays player position, NPCs, monsters, party members, and waypoints
 */

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Control,
  Ellipse
} from '@babylonjs/gui';

import type { MinimapMarker, MinimapUpdate, Position } from '../../../../shared/src/types';

export class MinimapPanel {
  private container: Rectangle | null = null;
  private mapCanvas: Rectangle | null = null;
  private zoneNameText: TextBlock | null = null;
  private coordinatesText: TextBlock | null = null;

  // Markers
  private playerMarker: Ellipse | null = null;
  private markers: Map<string, Rectangle> = new Map();

  // State
  private playerPosition: Position = { x: 0, y: 0, z: 0 };
  private mapRange: number = 200; // Display 200m radius
  private mapSize: number = 200; // Pixel size

  // Marker colors
  private readonly colors = {
    npc: '#00FF00',      // Green
    monster: '#FF0000',  // Red
    party: '#00FFFF',    // Cyan
    player: '#FFFFFF',   // White
    waypoint: '#FFFF00', // Yellow
    transport: '#FF8000' // Orange
  };

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createContainer();
  }

  private createContainer(): void {
    // Main container (top-right corner like SRO)
    this.container = new Rectangle('minimap_container');
    this.container.width = `${this.mapSize + 20}px`;
    this.container.height = `${this.mapSize + 60}px`;
    this.container.cornerRadius = 10;
    this.container.color = '#4a3728';
    this.container.thickness = 2;
    this.container.background = 'rgba(0, 0, 0, 0.85)';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.container.right = '10px';
    this.container.top = '10px';
    this.container.paddingLeft = '10px';
    this.container.paddingRight = '10px';
    this.container.paddingTop = '10px';
    this.container.paddingBottom = '10px';

    this.guiTexture.addControl(this.container);

    // Zone name
    this.zoneNameText = new TextBlock('zone_name', 'Jangan');
    this.zoneNameText.color = '#FFD700';
    this.zoneNameText.fontSize = 14;
    this.zoneNameText.fontWeight = 'bold';
    this.zoneNameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.addControl(this.zoneNameText);

    // Map canvas (circle like SRO)
    this.mapCanvas = new Rectangle('minimap_canvas');
    this.mapCanvas.width = `${this.mapSize}px`;
    this.mapCanvas.height = `${this.mapSize}px`;
    this.mapCanvas.top = '25px';
    this.mapCanvas.cornerRadius = this.mapSize / 2; // Make it circular
    this.mapCanvas.color = '#6B5344';
    this.mapCanvas.thickness = 2;
    this.mapCanvas.background = 'rgba(30, 40, 30, 0.9)';
    this.mapCanvas.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.addControl(this.mapCanvas);

    // Create directional indicators
    this.createDirectionalIndicators();

    // Create player marker (center arrow)
    this.createPlayerMarker();

    // Coordinates text
    this.coordinatesText = new TextBlock('coordinates', 'X: 0 Z: 0');
    this.coordinatesText.color = '#AAAAAA';
    this.coordinatesText.fontSize = 10;
    this.coordinatesText.top = `${this.mapSize + 30}px`;
    this.coordinatesText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.addControl(this.coordinatesText);
  }

  private createDirectionalIndicators(): void {
    const directions = [
      { label: 'N', x: 0, y: -this.mapSize / 2 + 15 },
      { label: 'S', x: 0, y: this.mapSize / 2 - 15 },
      { label: 'E', x: this.mapSize / 2 - 15, y: 0 },
      { label: 'W', x: -this.mapSize / 2 + 15, y: 0 }
    ];

    directions.forEach(dir => {
      const text = new TextBlock(`dir_${dir.label}`, dir.label);
      text.color = '#888888';
      text.fontSize = 12;
      text.fontWeight = 'bold';
      text.left = `${dir.x}px`;
      text.top = `${dir.y}px`;
      this.mapCanvas!.addControl(text);
    });
  }

  private createPlayerMarker(): void {
    // Player marker (triangle pointing in rotation direction)
    this.playerMarker = new Ellipse('player_marker');
    this.playerMarker.width = '12px';
    this.playerMarker.height = '12px';
    this.playerMarker.color = '#FFFFFF';
    this.playerMarker.thickness = 2;
    this.playerMarker.background = '#00FF00';
    this.playerMarker.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.playerMarker.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.mapCanvas!.addControl(this.playerMarker);
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Update minimap with new data
   */
  update(update: MinimapUpdate): void {
    // Update player position
    this.playerPosition = { x: update.playerPosition.x, y: 0, z: update.playerPosition.z };

    // Update zone name
    if (this.zoneNameText) {
      this.zoneNameText.text = update.zoneName;
    }

    // Update coordinates
    if (this.coordinatesText) {
      this.coordinatesText.text = `X: ${Math.floor(this.playerPosition.x)} Z: ${Math.floor(this.playerPosition.z)}`;
    }

    // Clear old markers
    this.clearMarkers();

    // Add new markers
    update.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  /**
   * Add a single marker to the map
   */
  addMarker(marker: MinimapMarker): void {
    if (!this.mapCanvas) return;

    // Calculate relative position
    const dx = marker.position.x - this.playerPosition.x;
    const dz = marker.position.z - this.playerPosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Skip if out of range
    if (distance > this.mapRange) return;

    // Map to canvas coordinates
    const scale = this.mapSize / (this.mapRange * 2);
    const canvasX = dx * scale;
    const canvasY = dz * scale; // Z is Y on minimap

    // Create marker
    const markerEl = new Rectangle(`marker_${marker.entityId}`);
    markerEl.width = marker.type === 'party' ? '10px' : '6px';
    markerEl.height = marker.type === 'party' ? '10px' : '6px';
    markerEl.cornerRadius = marker.type === 'party' ? 5 : 3;
    markerEl.color = '#00000000';
    markerEl.thickness = 0;
    markerEl.background = marker.color || this.colors[marker.type];
    markerEl.left = `${canvasX}px`;
    markerEl.top = `${canvasY}px`;
    markerEl.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    markerEl.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    // Add name label for party members
    if (marker.type === 'party' && marker.name) {
      const nameText = new TextBlock(`marker_name_${marker.entityId}`, marker.name);
      nameText.color = '#00FFFF';
      nameText.fontSize = 8;
      nameText.left = `${canvasX}px`;
      nameText.top = `${canvasY + 8}px`;
      nameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      this.mapCanvas.addControl(nameText);
    }

    this.mapCanvas.addControl(markerEl);
    this.markers.set(marker.entityId, markerEl);
  }

  /**
   * Set map zoom level
   */
  setZoom(level: number): void {
    // Level 1-10, maps to 50m-500m range
    this.mapRange = 50 + (level * 45);
  }

  /**
   * Toggle minimap visibility
   */
  toggle(): void {
    if (this.container) {
      this.container.isVisible = !this.container.isVisible;
    }
  }

  /**
   * Show minimap
   */
  show(): void {
    if (this.container) {
      this.container.isVisible = true;
    }
  }

  /**
   * Hide minimap
   */
  hide(): void {
    if (this.container) {
      this.container.isVisible = false;
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private clearMarkers(): void {
    this.markers.forEach((marker, id) => {
      marker.dispose();

      // Also remove name label if exists
      const nameLabel = this.mapCanvas?.getControlByName(`marker_name_${id}`);
      if (nameLabel) {
        nameLabel.dispose();
      }
    });
    this.markers.clear();
  }

  /**
   * Convert world rotation to minimap rotation
   */
  private updatePlayerRotation(rotation: number): void {
    if (!this.playerMarker) return;

    // Rotation in radians to degrees
    const degrees = (rotation * 180) / Math.PI;

    // Apply rotation to marker (simplified - just scale for now)
    // Full rotation would need custom texture or polygon
    // For now, the marker position is always center
  }

  dispose(): void {
    this.clearMarkers();
    this.container?.dispose();
    this.mapCanvas = null;
    this.playerMarker = null;
    this.zoneNameText = null;
    this.coordinatesText = null;
  }
}

export default MinimapPanel;
