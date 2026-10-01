// ============================================
// SRObro - Client-Side Prediction
// Predicts local player state for smooth movement
// Based on 2025 best practices for networked games
// ============================================

import { Vector3 } from '@babylonjs/core';
import { Socket } from 'socket.io-client';

/**
 * Local player state
 */
export interface LocalPlayerState {
  position: Vector3;
  rotation: number;
  velocity: Vector3;
  action: string;
  timestamp: number;
}

/**
 * Input data
 */
export interface PlayerInput {
  type: 'move' | 'attack' | 'skill' | 'interact';
  data: Record<string, unknown>;
}

/**
 * Pending input (sent to server, waiting for acknowledgment)
 */
export interface PendingInput {
  sequence: number;
  input: PlayerInput;
  timestamp: number;
  predictedState: LocalPlayerState;
}

/**
 * Server update
 */
export interface ServerUpdate {
  tick: number;
  entities: ServerEntityState[];
}

/**
 * Server entity state
 */
export interface ServerEntityState {
  entityId: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  velocity: { x: number; y: number; z: number };
  action: string;
  timestamp: number;
}

/**
 * Correction for smooth interpolation
 */
export interface StateCorrection {
  fromPosition: Vector3;
  toPosition: Vector3;
  progress: number;
  duration: number;
}

/**
 * Client-Side Prediction
 *
 * Predicts local player state immediately when input is received,
 * then reconciles with server state when update arrives.
 *
 * Benefits:
 * - Instant response to player input
 * - No perceived lag
 * - Smooth movement even with 100ms+ latency
 *
 * Sources:
 * - [Understanding Client Prediction](https://www.reddit.com/r/gamedev/comments/13hv8mx/am_i_understanding_client_prediction_and_server/)
 * - [Unity Netcode - Lag Compensation](https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.5/manual/learn/dealing-with-latency.html)
 */
export class ClientPrediction {
  // Local state
  private localState: LocalPlayerState;

  // Input management
  private sequence: number = 0;
  private pendingInputs: PendingInput[] = [];

  // Server state reconciliation
  private lastServerState: ServerEntityState | null = null;
  private correctionQueue: StateCorrection[] = [];

  // Configuration
  private readonly MAX_PENDING_INPUTS = 100;
  private readonly CORRECTION_DURATION = 500; // ms
  private readonly POSITION_TOLERANCE = 2.0; // meters

  // Callbacks
  private onStateUpdate?: (state: LocalPlayerState) => void;
  private onCorrection?: (correction: StateCorrection) => void;

  constructor(initialState: LocalPlayerState) {
    this.localState = { ...initialState };
  }

  /**
   * Set state update callback
   */
  public setStateUpdateCallback(callback: (state: LocalPlayerState) => void): void {
    this.onStateUpdate = callback;
  }

  /**
   * Set correction callback
   */
  public setCorrectionCallback(callback: (correction: StateCorrection) => void): void {
    this.onCorrection = callback;
  }

  /**
   * Process local input (prediction).
   * Retourne l'input séquencé à envoyer au serveur (le type de retour n'était
   * pas déclaré alors que la fonction retourne pendingInput).
   */
  public onInput(input: PlayerInput): PendingInput {
    // 1. Predict local state immediately
    const predictedState = this.predictState(this.localState, input);

    // 2. Store input as pending
    const pendingInput: PendingInput = {
      sequence: this.sequence++,
      input,
      timestamp: Date.now(),
      predictedState: { ...predictedState },
    };

    this.pendingInputs.push(pendingInput);

    // Limit pending inputs
    if (this.pendingInputs.length > this.MAX_PENDING_INPUTS) {
      this.pendingInputs.shift();
    }

    // 3. Update local state
    this.localState = predictedState;

    // 4. Notify state update
    if (this.onStateUpdate) {
      this.onStateUpdate(this.localState);
    }

    // 5. Return input to send to server
    // This will be sent via Socket.IO
    return pendingInput;
  }

  /**
   * Predict next state based on input
   */
  private predictState(currentState: LocalPlayerState, input: PlayerInput): LocalPlayerState {
    const newState: LocalPlayerState = {
      ...currentState,
      timestamp: Date.now(),
    };

    switch (input.type) {
      case 'move':
        return this.predictMove(newState, input.data);
      case 'attack':
        return this.predictAttack(newState, input.data);
      case 'skill':
        return this.predictSkill(newState, input.data);
      case 'interact':
        return this.predictInteract(newState, input.data);
      default:
        return newState;
    }
  }

  /**
   * Predict movement
   */
  private predictMove(state: LocalPlayerState, data: Record<string, unknown>): LocalPlayerState {
    const direction = data.direction as Vector3;
    const speed = (data.speed as number) || 5.0;
    const deltaTime = 0.05; // 50ms = one tick at 20Hz

    // Update velocity
    state.velocity.x = direction.x * speed;
    state.velocity.y = direction.y * speed;
    state.velocity.z = direction.z * speed;

    // Update position
    state.position.x += state.velocity.x * deltaTime;
    state.position.y += state.velocity.y * deltaTime;
    state.position.z += state.velocity.z * deltaTime;

    // Update action
    if (direction.x !== 0 || direction.z !== 0) {
      state.action = 'walk';
    } else {
      state.action = 'idle';
    }

    return state;
  }

  /**
   * Predict attack
   */
  private predictAttack(state: LocalPlayerState, data: Record<string, unknown>): LocalPlayerState {
    state.action = 'attack';
    state.velocity = new Vector3(0, 0, 0);
    return state;
  }

  /**
   * Predict skill
   */
  private predictSkill(state: LocalPlayerState, data: Record<string, unknown>): LocalPlayerState {
    state.action = 'skill';
    state.velocity = new Vector3(0, 0, 0);
    return state;
  }

  /**
   * Predict interact
   */
  private predictInteract(state: LocalPlayerState, data: Record<string, unknown>): LocalPlayerState {
    state.action = 'interact';
    state.velocity = new Vector3(0, 0, 0);
    return state;
  }

  /**
   * Handle server update
   */
  public onServerUpdate(update: ServerUpdate, playerId: string): void {
    // Find player entity in update
    const playerUpdate = update.entities.find(e => e.entityId === playerId);
    if (!playerUpdate) return;

    // Store server state
    this.lastServerState = playerUpdate;

    // Check for discrepancy
    const discrepancy = this.calculateDiscrepancy(this.localState, playerUpdate);

    if (discrepancy > this.POSITION_TOLERANCE) {
      console.log(`[ClientPrediction] Discrepancy detected: ${discrepancy.toFixed(2)}m`);

      // Reconcile with server
      this.reconcileWithServer(playerUpdate);
    } else {
      // Small discrepancy, ignore (within tolerance)
      // Remove acknowledged inputs
      this.removeAcknowledgedInputs(playerUpdate.timestamp);
    }
  }

  /**
   * Calculate discrepancy between local and server state
   */
  private calculateDiscrepancy(local: LocalPlayerState, server: ServerEntityState): number {
    const dx = local.position.x - server.position.x;
    const dy = local.position.y - server.position.y;
    const dz = local.position.z - server.position.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Reconcile local state with server state
   */
  private reconcileWithServer(serverState: ServerEntityState): void {
    // Create smooth correction
    const correction: StateCorrection = {
      fromPosition: this.localState.position.clone(),
      toPosition: new Vector3(
        serverState.position.x,
        serverState.position.y,
        serverState.position.z
      ),
      progress: 0,
      duration: this.CORRECTION_DURATION,
    };

    this.correctionQueue.push(correction);

    // Notify correction
    if (this.onCorrection) {
      this.onCorrection(correction);
    }

    // Replay inputs that haven't been acknowledged
    this.replayInputs(serverState);

    // Update local state to server state
    this.localState.position = new Vector3(
      serverState.position.x,
      serverState.position.y,
      serverState.position.z
    );
    this.localState.rotation = serverState.rotation;
    this.localState.velocity = new Vector3(
      serverState.velocity.x,
      serverState.velocity.y,
      serverState.velocity.z
    );
    this.localState.action = serverState.action;
  }

  /**
   * Replay unacknowledged inputs
   */
  private replayInputs(serverState: ServerEntityState): void {
    // Remove inputs older than server state
    this.pendingInputs = this.pendingInputs.filter(
      input => input.timestamp > serverState.timestamp
    );

    // Replay remaining inputs
    let replayState: LocalPlayerState = {
      position: new Vector3(
        serverState.position.x,
        serverState.position.y,
        serverState.position.z
      ),
      rotation: serverState.rotation,
      velocity: new Vector3(
        serverState.velocity.x,
        serverState.velocity.y,
        serverState.velocity.z
      ),
      action: serverState.action,
      timestamp: serverState.timestamp,
    };

    for (const input of this.pendingInputs) {
      replayState = this.predictState(replayState, input.input);
    }

    // Update local state with replay result
    this.localState = replayState;
  }

  /**
   * Remove acknowledged inputs
   */
  private removeAcknowledgedInputs(serverTimestamp: number): void {
    this.pendingInputs = this.pendingInputs.filter(
      input => input.timestamp > serverTimestamp
    );
  }

  /**
   * Update corrections (called every frame)
   */
  public updateCorrections(deltaTime: number): void {
    for (const correction of this.correctionQueue) {
      correction.progress += deltaTime;

      if (correction.progress >= correction.duration) {
        // Correction complete
        correction.progress = correction.duration;
      }

      // Calculate interpolated position
      const t = correction.progress / correction.duration;
      const position = Vector3.Lerp(
        correction.fromPosition,
        correction.toPosition,
        t
      );

      // Update local position
      this.localState.position = position;

      // Notify state update
      if (this.onStateUpdate) {
        this.onStateUpdate(this.localState);
      }
    }

    // Remove completed corrections
    this.correctionQueue = this.correctionQueue.filter(
      c => c.progress < c.duration
    );
  }

  /**
   * Get current local state
   */
  public getLocalState(): LocalPlayerState {
    return { ...this.localState };
  }

  /**
   * Get pending inputs count
   */
  public getPendingInputsCount(): number {
    return this.pendingInputs.length;
  }

  /**
   * Reset prediction
   */
  public reset(state: LocalPlayerState): void {
    this.localState = { ...state };
    this.sequence = 0;
    this.pendingInputs = [];
    this.lastServerState = null;
    this.correctionQueue = [];
  }
}
