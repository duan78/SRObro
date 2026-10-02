/**
 * SRObro - Panneau d'inventaire + boutique (DOM, phase 3)
 * 45 slots avec icônes officielles, usage potions, équipement, achat/vente.
 */

import type { NetworkManager } from '../../network/NetworkManager';

export interface ItemInfo {
  id: string;
  name: string;
  type: string;
  subType: string | null;
  requiredLevel: number;
  attackPowerMin: number;
  attackPowerMax: number;
  price: number;
  stackable: boolean;
  maxStack: number;
  iconPath: string | null;
  modelId: string | null;
  restore: number;
}

interface SlotData { slot: number; quantity: number; plus: number; item: ItemInfo }

function iconUrl(iconPath: string | null): string | null {
  if (!iconPath) return null;
  // "item\etc\hp_potion_01.ddj" → /assets/icons/item/etc/hp_potion_01.png
  return '/assets/icons/' + iconPath.replace(/\\/g, '/').replace(/\.ddj$/i, '.png');
}

export class InventoryPanel {
  private network: NetworkManager;
  private root: HTMLElement | null = null;
  private shopRoot: HTMLElement | null = null;
  private visible = false;
  private slots: SlotData[] = [];
  private equipment: Record<string, string | null> = {};
  private onCloseShop: (() => void) | null = null;

  constructor(network: NetworkManager) {
    this.network = network;
    window.addEventListener('keydown', (e) => {
      // Raccourcis officiels SRO (phase G V3): I ET A = inventaire
      if (e.key === 'i' || e.key === 'I' || e.key === 'a' || e.key === 'A') this.toggle();
      if (e.key === 'Escape') { this.closeShop(); this.hide(); }
    });
  }

  toggle(): void {
    this.visible ? this.hide() : this.show();
  }

  async show(): Promise<void> {
    this.visible = true;
    if (!this.root) this.build();
    this.root!.classList.remove('hud-hidden');
    await this.refresh();
  }

  hide(): void {
    this.visible = false;
    this.root?.classList.add('hud-hidden');
  }

  private build(): void {
    const root = document.createElement('div');
    root.id = 'inventory-panel';
    root.className = 'hud-panel hud-hidden';
    root.innerHTML = `
      <style>
        #inventory-panel { top: 70px; left: 50%; transform: translateX(-50%); width: 640px; z-index: 600; pointer-events: auto; }
        #inv-title { color: #ffd700; font-weight: 600; margin-bottom: 6px; display: flex; justify-content: space-between; }
        #inv-body { display: flex; gap: 12px; }
        #inv-equip { width: 120px; flex-shrink: 0; }
        #inv-equip .eq-slot { height: 44px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;
          background: rgba(30,24,12,0.9); border: 1px solid #55461f; border-radius: 3px; padding: 2px 6px; font-size: 11px; }
        #inv-equip .eq-slot img { width: 32px; height: 32px; }
        #inv-grid { display: grid; grid-template-columns: repeat(9, 1fr); gap: 4px; flex: 1; }
        .inv-slot { position: relative; aspect-ratio: 1; background: rgba(30,24,12,0.9);
          border: 1px solid #55461f; border-radius: 3px; cursor: pointer; }
        .inv-slot:hover { border-color: #ffd700; }
        .inv-slot img { width: 100%; height: 100%; image-rendering: pixelated; }
        .inv-qty { position: absolute; right: 2px; bottom: 1px; font-size: 10px; color: #fff; text-shadow: 0 1px 2px #000; }
        #inv-hint { margin-top: 6px; font-size: 10px; color: #8a7d5c; }
        #inv-tooltip { position: fixed; z-index: 900; display: none; pointer-events: none; max-width: 260px;
          background: rgba(8,6,3,0.95); border: 1px solid #8a6d2f; border-radius: 4px; padding: 8px 10px; font-size: 12px; }
        #inv-tooltip .t-name { color: #ffd700; font-weight: 600; }
        #inv-tooltip .t-line { color: #c9b98a; }
        #inv-tooltip .t-stats { color: #9fd39f; }
      </style>
      <div id="inv-title"><span>Inventaire</span><span id="inv-gold" style="color:#ffd700"></span></div>
      <div id="inv-body">
        <div id="inv-equip"></div>
        <div id="inv-grid"></div>
      </div>
      <div id="inv-hint">Clic: utiliser/équiper · Maj+clic: vendre · I ou Échap: fermer</div>
      <div id="inv-tooltip"></div>
    `;
    document.body.appendChild(root);
    this.root = root;
  }

  async refresh(): Promise<void> {
    if (!this.root || !this.visible) return;
    try {
      const res = await this.network.request<{ success: boolean; slots: SlotData[]; equipment: Record<string, string | null>; error?: string }>('inventory:list');
      if (!res.success) return;
      this.slots = res.slots;
      this.equipment = res.equipment || {};

      const gold = (document.querySelector('#hud-gold')?.textContent ?? '');
      (this.root.querySelector('#inv-gold') as HTMLElement).textContent = gold;

      // Grille 45 slots
      const grid = this.root.querySelector('#inv-grid') as HTMLElement;
      grid.innerHTML = '';
      for (let i = 0; i < 45; i++) {
        const cell = document.createElement('div');
        cell.className = 'inv-slot';
        const data = this.slots[i];
        if (data?.item) {
          const url = iconUrl(data.item.iconPath);
          if (url) {
            const img = document.createElement('img');
            img.src = url;
            cell.appendChild(img);
          }
          if (data.quantity > 1) {
            const q = document.createElement('span');
            q.className = 'inv-qty';
            q.textContent = String(data.quantity);
            cell.appendChild(q);
          }
          cell.addEventListener('mousemove', (e) => this.showTooltip(e, data));
          cell.addEventListener('mouseleave', () => this.hideTooltip());
          cell.addEventListener('click', (e) => {
            if (e.altKey && ['weapon','shield','helmet','chest','shoulder','legs','boots','ring','necklace','earring'].includes(data.item.type)) {
              void this.enhanceItem(data.slot, true); // Alt+clic: alchimie (+pierre de chance)
              return;
            }
            this.onSlotClick(data, e.shiftKey);
          });
        }
        grid.appendChild(cell);
      }

      // Équipement
      const eq = this.root.querySelector('#inv-equip') as HTMLElement;
      eq.innerHTML = '';
      const itemsById = new Map(this.slots.filter((s) => s?.item).map((s) => [s.item.id, s.item]));
      for (const [slot, itemId] of Object.entries(this.equipment)) {
        const row = document.createElement('div');
        row.className = 'eq-slot';
        const item = itemId ? itemsById.get(itemId) : null;
        if (!item) {
          row.innerHTML = `<span style="color:#6a5c3a">${slotLabel(slot)}</span>`;
        } else {
          const url = iconUrl(item.iconPath);
          row.innerHTML = `${url ? `<img src="${url}">` : ''}<span title="${item.name} — clic pour déséquiper">${slotLabel(slot)}</span>`;
          row.style.cursor = 'pointer';
          row.addEventListener('click', () => this.unequip(slot));
        }
        eq.appendChild(row);
      }
      // L'item équipé peut ne pas être en inventaire: requête légère ignorée (icône manquante acceptable)
    } catch { /* silencieux */ }
  }

  private showTooltip(e: MouseEvent, data: SlotData): void {
    const tt = document.getElementById('inv-tooltip');
    if (!tt) return;
    const it = data.item;
    const lines = [
      `<div class="t-name">${it.name}${data.plus ? ' +' + data.plus : ''}</div>`,
      `<div class="t-line">${slotLabel(it.type)} · niveau ${it.requiredLevel}</div>`,
    ];
    if (it.type === 'weapon') {
      lines.push(`<div class="t-stats">Attaque ${it.attackPowerMin} ~ ${it.attackPowerMax}</div>`);
    }
    if (it.type === 'potion') {
      lines.push(`<div class="t-stats">Restaure ${it.restore} ${it.subType === 'mp' ? 'MP' : 'HP'}</div>`);
    }
    lines.push(`<div class="t-line">Valeur: ${it.price} or</div>`);
    tt.innerHTML = lines.join('');
    tt.style.display = 'block';
    tt.style.left = Math.min(e.clientX + 14, window.innerWidth - 280) + 'px';
    tt.style.top = Math.min(e.clientY + 14, window.innerHeight - 160) + 'px';
  }

  private hideTooltip(): void {
    const tt = document.getElementById('inv-tooltip');
    if (tt) tt.style.display = 'none';
  }

  private async onSlotClick(data: SlotData, shift: boolean): Promise<void> {
    if (shift) {
      // Vente directe (boutique ouverte ou non — marchand ambulant pratique)
      const res = await this.network.request<{ success: boolean; gained?: number; error?: string }>('shop:sell', { slot: data.slot, qty: 1 });
      if (res.success) {
        this.refresh();
      } else {
        this.toast(res.error ?? 'Vente impossible');
      }
      return;
    }
    if (data.item.type === 'potion') {
      const res = await this.network.request<{ success: boolean; effect?: { amount: number }; error?: string }>('inventory:use', { slot: data.slot });
      if (!res.success) this.toast(res.error ?? 'Utilisation impossible');
      this.refresh();
    } else if (['weapon', 'shield', 'helmet', 'chest', 'shoulder', 'legs', 'boots', 'ring', 'necklace', 'earring'].includes(data.item.type)) {
      const res = await this.network.request<{ success: boolean; slot?: string; error?: string }>('inventory:equip', { slot: data.slot });
      if (!res.success) this.toast(res.error ?? 'Équipement impossible');
      this.refresh();
    }
  }

  /**
   * Alchimie officielle (Phase D): renforce un item d'inventaire.
   * Alt+clic sur un équipement → tente +1 (taux DB vSRO officiels).
   */
  async enhanceItem(slot: number, usePowder = true): Promise<void> {
    const res = await this.network.request<{
      success: boolean; error?: string;
      newPlus?: number; oldPlus?: number; destroyed?: boolean;
      probability?: { finalSuccessRate: number };
    }>('alchemy:enhance', { slot, usePowder });
    if (!res.success) {
      this.toast(res.error ?? 'Alchimie impossible');
      return;
    }
    if (res.destroyed) {
      this.toast(`💥 +${res.oldPlus} → ITEM DÉTRUIT (échec critique officiel)`);
    } else if ((res.newPlus ?? 0) > (res.oldPlus ?? 0)) {
      this.toast(`✨ +${res.oldPlus} → +${res.newPlus} ! (${Math.round((res.probability?.finalSuccessRate ?? 0) * 100)}%)`);
    } else {
      this.toast(`Échec: +${res.oldPlus} → +${res.newPlus}`);
    }
    this.refresh();
  }

  private async unequip(slot: string): Promise<void> {
    await this.network.request('inventory:unequip', { slot });
    this.refresh();
  }

  private toast(message: string): void {
    const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
    hud?.addChatMessage(message, 'system');
  }

  // ============================================
  // BOUTIQUE
  // ============================================

  async openShop(): Promise<void> {
    if (this.shopRoot) return;
    const res = await this.network.request<{ success: boolean; npcName?: string; goods?: ItemInfo[] }>('shop:list');
    if (!res.success) { this.toast('Boutique indisponible'); return; }

    const el = document.createElement('div');
    el.id = 'shop-panel';
    el.className = 'hud-panel';
    el.innerHTML = `
      <style>
        #shop-panel { top: 70px; right: 40px; width: 300px; z-index: 600; pointer-events: auto; }
        #shop-title { color: #ffd700; font-weight: 600; margin-bottom: 6px; display: flex; justify-content: space-between; }
        .shop-row { display: flex; align-items: center; gap: 8px; padding: 4px; border-bottom: 1px solid rgba(85,70,31,0.5); }
        .shop-row img { width: 34px; height: 34px; image-rendering: pixelated; }
        .shop-info { flex: 1; font-size: 11px; }
        .shop-info .s-name { color: #f0e6d2; }
        .shop-info .s-price { color: #ffd700; font-size: 10px; }
        .shop-buy { padding: 4px 10px; cursor: pointer; font-size: 11px;
          background: linear-gradient(180deg, #d8b54a, #8f751d); border: 1px solid #ffd700; border-radius: 3px; color: #1c1405; }
        .shop-buy:hover { filter: brightness(1.15); }
        #shop-close { color: #8a94c0; cursor: pointer; }
      </style>
      <div id="shop-title"><span>${res.npcName ?? 'Marchand'}</span><span id="shop-close">✕</span></div>
      <div id="shop-goods"></div>
    `;
    const goods = el.querySelector('#shop-goods') as HTMLElement;
    for (const item of res.goods ?? []) {
      const row = document.createElement('div');
      row.className = 'shop-row';
      const url = iconUrl(item.iconPath);
      row.innerHTML = `
        ${url ? `<img src="${url}">` : '<div style="width:34px;height:34px"></div>'}
        <div class="shop-info">
          <div class="s-name">${item.name}</div>
          <div class="s-price">${item.price} or${item.attackPowerMax ? ` · atk ${item.attackPowerMin}-${item.attackPowerMax}` : ''}${item.restore ? ` · ${item.restore} HP/MP` : ''}</div>
        </div>
        <button class="shop-buy" data-id="${item.id}">×1</button>
        <button class="shop-buy" data-id="${item.id}" data-qty="10">×10</button>
      `;
      goods.appendChild(row);
    }
    goods.querySelectorAll('.shop-buy').forEach((b) => {
      b.addEventListener('click', async () => {
        const itemId = (b as HTMLElement).dataset.id;
        const qty = Number((b as HTMLElement).dataset.qty ?? 1);
        const buy = await this.network.request<{ success: boolean; spent?: number; error?: string }>('shop:buy', { itemId, qty });
        if (buy.success) {
          this.toast(`Acheté pour ${buy.spent} or`);
          this.refresh();
        } else {
          this.toast(buy.error ?? 'Achat impossible');
        }
      });
    });
    el.querySelector('#shop-close')?.addEventListener('click', () => this.closeShop());
    document.body.appendChild(el);
    this.shopRoot = el;
  }

  closeShop(): void {
    this.shopRoot?.remove();
    this.shopRoot = null;
    this.onCloseShop?.();
  }
}

function slotLabel(type: string): string {
  const labels: Record<string, string> = {
    weapon: 'Arme', shield: 'Bouclier', helmet: 'Casque', chest: 'Torse',
    shoulder: 'Épaules', legs: 'Jambes', boots: 'Bottes', ring: 'Anneau',
    necklace: 'Collier', earring: 'Boucle', potion: 'Potion', general: 'Objet',
  };
  return labels[type] ?? type;
}
