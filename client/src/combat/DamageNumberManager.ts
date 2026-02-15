/**
 * DamageNumberManager
 *
 * Manages floating damage numbers and combat visual effects
 * Creates floating text for damage, heals, and other combat events
 */

// @ts-nocheck
import {
    Scene,
    DynamicTexture,
    StandardMaterial,
    Mesh,
    Vector3,
    Color3,
    Matrix
} from '@babylonjs/core';

import {
    AdvancedDynamicTexture,
    Rectangle,
    TextBlock,
    Control
} from '@babylonjs/gui';

/**
 * Damage type
 */
export enum DamageType {
    PHYSICAL = 'physical',
    MAGICAL = 'magical',
    CRITICAL = 'critical',
    HEAL = 'heal',
    MISS = 'miss',
    BLOCK = 'block'
}

/**
 * Damage number configuration
 */
interface DamageNumberConfig {
    fontSize: number;
    duration: number;        // in seconds
    floatSpeed: number;      // units per second
    fadeOut: boolean;        // fade out at the end
}

const DEFAULT_CONFIG: DamageNumberConfig = {
    fontSize: 24,
    duration: 1.5,
    floatSpeed: 2,
    fadeOut: true
};

/**
 * Damage number data
 */
interface DamageNumber {
    text: string;
    position: Vector3;
    color: Color3;
    type: DamageType;
    createdAt: number;
    duration: number;
}

/**
 * DamageNumberManager class
 */
export class DamageNumberManager {
    private scene: Scene;
    private config: DamageNumberConfig;

    // Active damage numbers
    private activeNumbers: DamageNumber[] = [];

    // GUI texture for text
    private guiTexture: AdvancedDynamicTexture | null = null;

    // Pool of text blocks for reuse
    private textBlockPool: Map<string, TextBlock[]> = new Map();

    constructor(scene: Scene, config: Partial<DamageNumberConfig> = {}) {
        this.scene = scene;
        this.config = { ...DEFAULT_CONFIG, ...config };

        this.setupGUI();
        this.startUpdateLoop();
    }

    /**
     * Set up GUI for damage numbers
     */
    private setupGUI(): void {
        // Create full-screen GUI
        this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('DamageNumberUI');
    }

    /**
     * Start update loop
     */
    private startUpdateLoop(): void {
        this.scene.onBeforeRenderObservable.add(() => {
            this.update();
        });
    }

    /**
     * Update damage numbers (called every frame)
     */
    private update(): void {
        const now = Date.now();
        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

        // Remove expired numbers
        this.activeNumbers = this.activeNumbers.filter(num => {
            const elapsed = (now - num.createdAt) / 1000;
            return elapsed < num.duration;
        });
    }

    /**
     * Show damage number
     */
    public showDamage(
        amount: number,
        position: Vector3,
        type: DamageType = DamageType.PHYSICAL
    ): void {
        let text: string;
        let color: Color3;

        switch (type) {
            case DamageType.CRITICAL:
                text = `CRIT ${amount}`;
                color = new Color3(1, 0.2, 0); // Orange-red
                break;
            case DamageType.MAGICAL:
                text = `${amount}`;
                color = new Color3(0.2, 0.5, 1); // Blue
                break;
            case DamageType.HEAL:
                text = `+${amount}`;
                color = new Color3(0.2, 1, 0.2); // Green
                break;
            case DamageType.MISS:
                text = 'MISS';
                color = new Color3(0.7, 0.7, 0.7); // Gray
                break;
            case DamageType.BLOCK:
                text = 'BLOCK';
                color = new Color3(0.5, 0.5, 0.8); // Light blue
                break;
            default:
                text = `${amount}`;
                color = new Color3(1, 0.8, 0); // Yellow
                break;
        }

        this.createFloatingText(text, position, color, this.config.duration);
    }

    /**
     * Show healing number
     */
    public showHeal(amount: number, position: Vector3): void {
        this.showDamage(amount, position, DamageType.HEAL);
    }

    /**
     * Show miss indicator
     */
    public showMiss(position: Vector3): void {
        this.showDamage(0, position, DamageType.MISS);
    }

    /**
     * Create floating text
     */
    private createFloatingText(
        text: string,
        position: Vector3,
        color: Color3,
        duration: number
    ): void {
        if (!this.guiTexture) return;

        // Create rectangle container
        const rect = new Rectangle(`damage_${Date.now()}_${Math.random()}`);
        rect.width = '100px';
        rect.height = '40px';
        rect.cornerRadius = 5;
        rect.color = color.toHexString();
        rect.thickness = 0;
        rect.background = 'rgba(0, 0, 0, 0.3)';

        // Create text block
        const textBlock = new TextBlock();
        textBlock.text = text;
        textBlock.color = color.toHexString();
        textBlock.fontSize = this.config.fontSize.toString();
        textBlock.fontWeight = 'bold';
        textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        rect.addControl(textBlock);
        this.guiTexture.addControl(rect);

        // Convert 3D position to 2D screen position
        this.updateRectPosition(rect, position);

        // Animate floating up
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed >= duration) {
                this.guiTexture?.removeControl(rect);
                rect.dispose();
                return;
            }

            // Float up
            const floatOffset = elapsed * this.config.floatSpeed;
            const floatPos = position.add(new Vector3(0, floatOffset, 0));
            this.updateRectPosition(rect, floatPos);

            // Fade out near end
            if (this.config.fadeOut && elapsed > duration * 0.7) {
                const alpha = 1 - ((elapsed - duration * 0.7) / (duration * 0.3));
                rect.alpha = alpha;
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        // Track for cleanup
        this.activeNumbers.push({
            text,
            position: position.clone(),
            color,
            type: DamageType.PHYSICAL,
            createdAt: Date.now(),
            duration
        });
    }

    /**
     * Update rectangle position based on 3D position
     */
    private updateRectPosition(rect: Rectangle, position: Vector3): void {
        // Project 3D position to screen space
        const screenPos = Vector3.Project(
            position,
            Vector3.Zero(),
            this.scene.getTransformMatrix(),
            this.scene.activeCamera!.getProjectionMatrix()
        );

        // Convert to GUI coordinates
        const canvas = this.scene.getEngine().getRenderingCanvas();
        if (canvas) {
            const x = (screenPos.x + 1) * canvas.width / 2;
            const y = (1 - screenPos.y) * canvas.height / 2;

            rect.left = `${x - 50}px`; // Offset by half width
            rect.top = `${y - 20}px`;  // Offset by half height
        }
    }

    /**
     * Clear all active damage numbers
     */
    public clear(): void {
        this.activeNumbers = [];
    }

    /**
     * Dispose of manager
     */
    public dispose(): void {
        this.clear();
        if (this.guiTexture) {
            this.guiTexture.dispose();
            this.guiTexture = null;
        }
    }
}
