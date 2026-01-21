/**
 * MovementSync
 *
 * Handles synchronization of character movement between client and server
 * Implements client-side prediction and server reconciliation
 */

import { Vector3, Scene } from '@babylonjs/core';
import { NetworkManager } from '../network/NetworkManager';

/**
 * Movement data for network transmission
 */
export interface MovementData {
    position: { x: number; y: number; z: number };
    rotation: number;
    velocity: { x: number; y: number; z: number };
    isMoving: boolean;
    isRunning: boolean;
    timestamp: number;
}

/**
 * Movement sync configuration
 */
interface MovementSyncConfig {
    sendRate: number;           // How often to send updates (ms)
    enablePrediction: boolean;  // Client-side prediction
    enableReconciliation: boolean; // Server reconciliation
    interpolationDelay: number; // Delay for interpolating other entities (ms)
}

const DEFAULT_CONFIG: MovementSyncConfig = {
    sendRate: 50,              // 20 updates per second
    enablePrediction: true,
    enableReconciliation: true,
    interpolationDelay: 100     // 100ms delay
};

/**
 * MovementSync class
 */
export class MovementSync {
    private scene: Scene;
    private network: NetworkManager;
    private config: MovementSyncConfig;

    // Local state
    private localPosition: Vector3 = Vector3.Zero();
    private localRotation: number = 0;
    private localVelocity: Vector3 = Vector3.Zero();
    private isMoving: boolean = false;
    private isRunning: boolean = false;

    // Last sent state
    private lastSentPosition: Vector3 = Vector3.Zero();
    private lastSentRotation: number = 0;
    private lastUpdateTime: number = 0;

    // Pending updates for reconciliation
    private pendingUpdates: Map<number, MovementData> = new Map();

    // Update interval
    private updateInterval: number = 0;

    // Callbacks
    private onServerUpdateCallback?: (data: MovementData) => void;

    constructor(scene: Scene, network: NetworkManager, config: Partial<MovementSyncConfig> = {}) {
        this.scene = scene;
        this.network = network;
        this.config = { ...DEFAULT_CONFIG, ...config };

        this.setupNetworkHandlers();
        this.startUpdateLoop();
    }

    /**
     * Set up network event handlers
     */
    private setupNetworkHandlers(): void {
        // Listen for server position updates
        this.network.on('update', (data: any) => {
            if (data.position) {
                this.handleServerUpdate({
                    position: data.position,
                    rotation: data.rotation || 0,
                    velocity: data.velocity || { x: 0, y: 0, z: 0 },
                    isMoving: data.isMoving || false,
                    isRunning: data.isRunning || false,
                    timestamp: data.timestamp || Date.now()
                });
            }
        });
    }

    /**
     * Handle server update
     */
    private handleServerUpdate(serverData: MovementData): void {
        if (!this.config.enableReconciliation) {
            // Direct mode: just apply server position
            this.localPosition.set(serverData.position.x, serverData.position.y, serverData.position.z);
            this.localRotation = serverData.rotation;
            this.onServerUpdateCallback?.(serverData);
            return;
        }

        // Reconciliation mode: compare with pending updates
        const now = Date.now();

        // Remove old pending updates
        for (const [timestamp] of this.pendingUpdates) {
            if (now - timestamp > this.config.interpolationDelay * 2) {
                this.pendingUpdates.delete(timestamp);
            }
        }

        // Notify callback
        this.onServerUpdateCallback?.(serverData);
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
     * Update movement sync (called every frame)
     */
    private update(): void {
        const now = Date.now();

        // Check if it's time to send an update
        if (now - this.lastUpdateTime >= this.config.sendRate) {
            // Check if position changed significantly
            const positionChanged = Vector3.Distance(this.localPosition, this.lastSentPosition) > 0.01;
            const rotationChanged = Math.abs(this.localRotation - this.lastSentRotation) > 0.01;

            if (positionChanged || rotationChanged || this.isMoving) {
                this.sendMovementUpdate();
                this.lastUpdateTime = now;
            }
        }
    }

    /**
     * Send movement update to server
     */
    private sendMovementUpdate(): void {
        const movementData: MovementData = {
            position: {
                x: this.localPosition.x,
                y: this.localPosition.y,
                z: this.localPosition.z
            },
            rotation: this.localRotation,
            velocity: {
                x: this.localVelocity.x,
                y: this.localVelocity.y,
                z: this.localVelocity.z
            },
            isMoving: this.isMoving,
            isRunning: this.isRunning,
            timestamp: Date.now()
        };

        // Send via network manager
        this.network.sendMove(
            movementData.position,
            movementData.rotation,
            movementData.isRunning
        );

        // Store for reconciliation
        if (this.config.enableReconciliation) {
            this.pendingUpdates.set(movementData.timestamp, movementData);
        }

        // Update last sent state
        this.lastSentPosition.set(this.localPosition.x, this.localPosition.y, this.localPosition.z);
        this.lastSentRotation = this.localRotation;
    }

    /**
     * Set local position (called by character controller)
     */
    public setPosition(position: Vector3): void {
        this.localPosition.set(position.x, position.y, position.z);
    }

    /**
     * Set local rotation (called by character controller)
     */
    public setRotation(rotation: number): void {
        this.localRotation = rotation;
    }

    /**
     * Set local velocity (called by character controller)
     */
    public setVelocity(velocity: Vector3): void {
        this.localVelocity.set(velocity.x, velocity.y, velocity.z);
    }

    /**
     * Set moving state
     */
    public setMoving(isMoving: boolean): void {
        this.isMoving = isMoving;
    }

    /**
     * Set running state
     */
    public setRunning(isRunning: boolean): void {
        this.isRunning = isRunning;
    }

    /**
     * Get local position
     */
    public getPosition(): Vector3 {
        return this.localPosition.clone();
    }

    /**
     * Get local rotation
     */
    public getRotation(): number {
        return this.localRotation;
    }

    /**
     * Register callback for server updates
     */
    public onServerUpdate(callback: (data: MovementData) => void): void {
        this.onServerUpdateCallback = callback;
    }

    /**
     * Dispose of movement sync
     */
    public dispose(): void {
        this.pendingUpdates.clear();
    }
}
