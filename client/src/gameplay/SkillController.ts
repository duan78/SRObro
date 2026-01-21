/**
 * SkillController
 *
 * Client-side skill controller
 * Handles skill usage UI, cooldowns, and server communication
 */

import { Scene } from '@babylonjs/core';
import { NetworkManager } from '../network/NetworkManager';

/**
 * Skill data structure
 */
export interface SkillData {
    id: string;
    name: string;
    icon?: string;
    cooldown: number;      // in milliseconds
    castTime: number;      // in milliseconds
    mpCost: number;
    range: number;
    description?: string;
}

/**
 * Skill slot data
 */
export interface SkillSlot {
    skillId: string | null;
    slotIndex: number;
    cooldownEnd: number;
}

/**
 * Skill controller configuration
 */
interface SkillControllerConfig {
    enableQuickCast: boolean;    // Cast without target confirmation
    showCooldownUI: boolean;     // Show cooldown indicators
}

const DEFAULT_CONFIG: SkillControllerConfig = {
    enableQuickCast: false,
    showCooldownUI: true
};

/**
 * SkillController class
 */
export class SkillController {
    private scene: Scene;
    private network: NetworkManager;
    private config: SkillControllerConfig;

    // Known skills
    private skills: Map<string, SkillData> = new Map();

    // Skill bar slots (F1-F8, 1-9)
    private skillSlots: Map<string, SkillSlot> = new Map();

    // Current MP
    private currentMp: number = 100;
    private maxMp: number = 100;

    // Callbacks
    private onSkillUsedCallback?: (skillId: string) => void;
    private onSkillFailedCallback?: (reason: string) => void;
    private onCooldownUpdateCallback?: (slotKey: string, remaining: number) => void;

    constructor(scene: Scene, network: NetworkManager, config: Partial<SkillControllerConfig> = {}) {
        this.scene = scene;
        this.network = network;
        this.config = { ...DEFAULT_CONFIG, ...config };

        this.setupNetworkHandlers();
        this.startUpdateLoop();
    }

    /**
     * Set up network handlers
     */
    private setupNetworkHandlers(): void {
        // Listen for casting events from server
        this.network.on('casting_start', (data: any) => {
            this.handleCastingStart(data);
        });

        this.network.on('casting_complete', (data: any) => {
            this.handleCastingComplete(data);
        });

        this.network.on('casting_interrupt', (data: any) => {
            this.handleCastingInterrupt(data);
        });
    }

    /**
     * Handle casting start from server
     */
    private handleCastingStart(data: any): void {
        const { skillId } = data;
        console.log(`SkillController: Casting started for ${skillId}`);

        // Start cooldown
        const skill = this.skills.get(skillId);
        if (skill) {
            this.startCooldown(skillId, skill.cooldown);
        }
    }

    /**
     * Handle casting complete from server
     */
    private handleCastingComplete(data: any): void {
        const { skillId } = data;
        console.log(`SkillController: Casting completed for ${skillId}`);
        this.onSkillUsedCallback?.(skillId);
    }

    /**
     * Handle casting interrupt from server
     */
    private handleCastingInterrupt(data: any): void {
        const { skillId } = data;
        console.log(`SkillController: Casting interrupted for ${skillId}`);
        this.onSkillFailedCallback?.('Interrupted');
    }

    /**
     * Start update loop for cooldown tracking
     */
    private startUpdateLoop(): void {
        this.scene.onBeforeRenderObservable.add(() => {
            this.update();
        });
    }

    /**
     * Update skill controller (called every frame)
     */
    private update(): void {
        const now = Date.now();

        // Update cooldowns
        for (const [slotKey, slot] of this.skillSlots) {
            if (slot.skillId) {
                const skill = this.skills.get(slot.skillId);
                if (skill && slot.cooldownEnd > now) {
                    const remaining = Math.ceil((slot.cooldownEnd - now) / 1000);
                    this.onCooldownUpdateCallback?.(slotKey, remaining);
                }
            }
        }
    }

    /**
     * Register a skill
     */
    public registerSkill(skill: SkillData): void {
        this.skills.set(skill.id, skill);
        console.log(`SkillController: Registered skill ${skill.name} (${skill.id})`);
    }

    /**
     * Bind a skill to a slot
     */
    public bindSkillToSlot(slotType: string, slotIndex: number, skillId: string): void {
        const slotKey = `${slotType}_${slotIndex}`;
        this.skillSlots.set(slotKey, {
            skillId,
            slotIndex,
            cooldownEnd: 0
        });

        // Send to server for persistence
        this.network.sendHotkeyBind(slotType, slotIndex, undefined, skillId);

        console.log(`SkillController: Bound skill ${skillId} to slot ${slotKey}`);
    }

    /**
     * Use a skill from a slot
     */
    public useSkillFromSlot(slotType: string, slotIndex: number): boolean {
        const slotKey = `${slotType}_${slotIndex}`;
        const slot = this.skillSlots.get(slotKey);

        if (!slot || !slot.skillId) {
            console.warn(`SkillController: No skill bound to slot ${slotKey}`);
            return false;
        }

        return this.useSkill(slot.skillId);
    }

    /**
     * Use a skill by ID
     */
    public useSkill(skillId: string): boolean {
        const skill = this.skills.get(skillId);
        if (!skill) {
            console.warn(`SkillController: Unknown skill ${skillId}`);
            this.onSkillFailedCallback?.('Unknown skill');
            return false;
        }

        // Check cooldown
        const now = Date.now();
        for (const slot of this.skillSlots.values()) {
            if (slot.skillId === skillId && slot.cooldownEnd > now) {
                const remaining = Math.ceil((slot.cooldownEnd - now) / 1000);
                console.warn(`SkillController: Skill on cooldown (${remaining}s remaining)`);
                this.onSkillFailedCallback?.(`Cooldown: ${remaining}s`);
                return false;
            }
        }

        // Check MP
        if (skill.mpCost > this.currentMp) {
            console.warn(`SkillController: Not enough MP (need ${skill.mpCost}, have ${this.currentMp})`);
            this.onSkillFailedCallback?.('Not enough MP');
            return false;
        }

        // Send skill usage to server
        this.network.sendAttack('', skillId);

        console.log(`SkillController: Using skill ${skill.name}`);
        return true;
    }

    /**
     * Start cooldown for a skill
     */
    private startCooldown(skillId: string, cooldown: number): void {
        const now = Date.now();
        const cooldownEnd = now + cooldown;

        // Update all slots with this skill
        for (const [slotKey, slot] of this.skillSlots) {
            if (slot.skillId === skillId) {
                slot.cooldownEnd = cooldownEnd;
            }
        }
    }

    /**
     * Set current MP
     */
    public setMp(mp: number): void {
        this.currentMp = mp;
    }

    /**
     * Set max MP
     */
    public setMaxMp(mp: number): void {
        this.maxMp = mp;
    }

    /**
     * Get skill by ID
     */
    public getSkill(skillId: string): SkillData | undefined {
        return this.skills.get(skillId);
    }

    /**
     * Get all skills
     */
    public getAllSkills(): SkillData[] {
        return Array.from(this.skills.values());
    }

    /**
     * Get slot data
     */
    public getSlot(slotType: string, slotIndex: number): SkillSlot | undefined {
        return this.skillSlots.get(`${slotType}_${slotIndex}`);
    }

    /**
     * Register callbacks
     */
    public onSkillUsed(callback: (skillId: string) => void): void {
        this.onSkillUsedCallback = callback;
    }

    public onSkillFailed(callback: (reason: string) => void): void {
        this.onSkillFailedCallback = callback;
    }

    public onCooldownUpdate(callback: (slotKey: string, remaining: number) => void): void {
        this.onCooldownUpdateCallback = callback;
    }

    /**
     * Dispose
     */
    public dispose(): void {
        this.skills.clear();
        this.skillSlots.clear();
    }
}
