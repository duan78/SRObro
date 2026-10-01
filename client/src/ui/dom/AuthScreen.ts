/**
 * SRObro - Écran d'authentification (DOM overlay)
 * Connexion / inscription de compte, sélection et création de personnage.
 * Même style que l'écran de chargement (dégradé bleu nuit + or).
 * Aucun alert() natif: les erreurs s'affichent inline.
 */

import type { NetworkManager } from '../../network/NetworkManager';

export interface AuthAccountInfo {
  id: string;
  username: string;
  role: string;
}

export interface CharacterSummary {
  id: string;
  name: string;
  race: string;
  gender: string;
  level: number;
  exp: number;
  sp: number;
  gold: number;
  zone: string;
}

export interface CharacterFull extends CharacterSummary {
  hp: number;
  mp: number;
  maxHp: number;
  maxMp: number;
  str: number;
  int: number;
  statPoints: number;
  skillPoints: number;
  position: { x: number; y: number; z: number };
  rotation: number;
}

// sessionStorage (pas localStorage): isolé PAR ONGLET — deux persos
// peuvent jouer simultanément dans deux onglets du même navigateur.
const TOKEN_KEY = 'srobro_session_token';

export class AuthScreen {
  private network: NetworkManager;
  private root: HTMLDivElement | null = null;
  private account: AuthAccountInfo | null = null;
  private characters: CharacterSummary[] = [];

  /** Appelé quand un personnage est sélectionné et chargé côté serveur. */
  onComplete: ((character: CharacterFull) => void) | null = null;

  constructor(network: NetworkManager) {
    this.network = network;
  }

  /**
   * Démarre la séquence: connexion Socket.io → (reprise session | login) → persos.
   */
  async start(): Promise<void> {
    this.buildDom();
    this.setState('connecting');

    try {
      await this.network.connect();
    } catch {
      this.setState('connection-error');
      return;
    }

    // Reprise de session automatique si un token valide existe
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const res = await this.network.request<{ success: boolean; account?: AuthAccountInfo }>(
          'auth:resume', { token }, 5000
        );
        if (res.success && res.account) {
          this.account = res.account;
          await this.showCharacterList();
          return;
        }
        sessionStorage.removeItem(TOKEN_KEY);
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
      }
    }

    this.setState('login');
  }

  hide(): void {
    this.root?.remove();
    this.root = null;
  }

  // ============================================
  // DOM
  // ============================================

  private buildDom(): void {
    if (this.root) return;
    const root = document.createElement('div');
    root.id = 'auth-screen';
    root.innerHTML = `
      <style>
        #auth-screen {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at center, #1d2547 0%, #10142b 70%, #0a0d1e 100%);
          color: #f0e6d2; font-family: 'Segoe UI', sans-serif; user-select: none;
        }
        #auth-screen.hidden { display: none; }
        .auth-logo { font-size: 3rem; font-weight: bold; color: #ffd700;
          text-shadow: 0 0 24px rgba(255,215,0,0.45); margin-bottom: 6px; letter-spacing: 2px; }
        .auth-sub { color: #8a94c0; margin-bottom: 28px; font-size: 0.95rem; }
        .auth-card {
          width: 360px; padding: 26px 30px;
          background: linear-gradient(180deg, rgba(20,16,8,0.88), rgba(8,6,3,0.92));
          border: 1px solid #8a6d2f; border-radius: 6px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 12px 40px rgba(0,0,0,0.55), inset 0 0 12px rgba(255,215,0,0.05);
        }
        .auth-title { text-align: center; color: #ffd700; font-size: 1.15rem; margin-bottom: 18px;
          text-shadow: 0 1px 2px #000; }
        .auth-field { margin-bottom: 12px; }
        .auth-field label { display: block; font-size: 0.8rem; color: #c9b98a; margin-bottom: 4px; }
        .auth-field input {
          width: 100%; box-sizing: border-box; padding: 9px 10px;
          background: #141008; border: 1px solid #55461f; border-radius: 3px;
          color: #f0e6d2; font-size: 0.95rem; outline: none;
        }
        .auth-field input:focus { border-color: #ffd700; }
        .auth-error {
          display: none; margin: 10px 0; padding: 8px 10px;
          background: rgba(120,20,20,0.35); border: 1px solid #7f1d1d; border-radius: 3px;
          color: #ffb0a0; font-size: 0.85rem;
        }
        .auth-error.visible { display: block; }
        .auth-btn {
          display: block; width: 100%; box-sizing: border-box; margin-top: 14px;
          padding: 10px 0; cursor: pointer;
          background: linear-gradient(180deg, #d8b54a, #8f751d);
          border: 1px solid #ffd700; border-radius: 3px;
          color: #1c1405; font-weight: 600; font-size: 0.95rem;
          text-shadow: 0 1px 0 rgba(255,255,255,0.25);
        }
        .auth-btn:hover { filter: brightness(1.1); }
        .auth-btn:disabled { opacity: 0.5; cursor: wait; }
        .auth-btn.secondary {
          background: linear-gradient(180deg, #2c3050, #1a1f38);
          border-color: #5560a0; color: #cdd5f5; text-shadow: none;
        }
        .auth-link { display: block; text-align: center; margin-top: 14px;
          color: #8a94c0; font-size: 0.85rem; cursor: pointer; text-decoration: underline; }
        .auth-link:hover { color: #ffd700; }
        .auth-state { text-align: center; color: #8a94c0; }
        .auth-spinner {
          width: 42px; height: 42px; margin: 18px auto 10px;
          border: 4px solid rgba(255,215,0,0.25); border-top-color: #ffd700;
          border-radius: 50%; animation: authspin 1s linear infinite;
        }
        @keyframes authspin { to { transform: rotate(360deg); } }
        .char-list { max-height: 300px; overflow-y: auto; }
        .char-card {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; margin-bottom: 8px;
          background: rgba(30,24,12,0.6); border: 1px solid #55461f; border-radius: 4px;
          cursor: pointer; transition: border-color 0.15s;
        }
        .char-card:hover { border-color: #ffd700; }
        .char-avatar {
          width: 44px; height: 44px; border-radius: 4px; flex-shrink: 0;
          background: linear-gradient(180deg, #3d3a2a, #211d12);
          border: 1px solid #8a6d2f;
          display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
        }
        .char-info { flex: 1; min-width: 0; }
        .char-name { color: #ffd700; font-weight: 600; }
        .char-meta { font-size: 0.78rem; color: #c9b98a; margin-top: 2px; }
        .char-actions { display: flex; flex-direction: column; gap: 4px; }
        .char-mini-btn {
          padding: 4px 10px; font-size: 0.75rem; cursor: pointer;
          background: rgba(60,48,20,0.8); border: 1px solid #8a6d2f; border-radius: 3px; color: #f0e6d2;
        }
        .char-mini-btn.danger { border-color: #7f1d1d; color: #ffb0a0; }
        .auth-toggle-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .auth-toggle {
          flex: 1; padding: 9px 0; text-align: center; cursor: pointer;
          background: rgba(30,24,12,0.7); border: 1px solid #55461f; border-radius: 3px;
          color: #c9b98a; font-size: 0.9rem;
        }
        .auth-toggle.selected { border-color: #ffd700; color: #ffd700; background: rgba(80,64,24,0.5); }
        .auth-footer { margin-top: 16px; text-align: center; font-size: 0.78rem; color: #6a7398; }
      </style>
      <div class="auth-logo">SRObro</div>
      <div class="auth-sub">Clone Silkroad Online — serveur local</div>
      <div class="auth-card" id="auth-card"></div>
      <div class="auth-footer" id="auth-footer"></div>
    `;
    document.body.appendChild(root);
    this.root = root;
  }

  private card(): HTMLElement {
    return this.root!.querySelector('#auth-card') as HTMLElement;
  }

  private footer(): HTMLElement {
    return this.root!.querySelector('#auth-footer') as HTMLElement;
  }

  private setState(state: string): void {
    const card = this.card();
    if (state === 'connecting') {
      card.innerHTML = `<div class="auth-title">Connexion au serveur...</div><div class="auth-spinner"></div>`;
    } else if (state === 'login') {
      this.showLogin();
    } else if (state === 'connection-error') {
      card.innerHTML = `
        <div class="auth-title" style="color:#ff9a76">Serveur injoignable</div>
        <div class="auth-state" style="margin-bottom:8px">Vérifiez que le serveur tourne (port 3001) puis réessayez.</div>
        <button class="auth-btn" id="auth-retry">Réessayer</button>
        <button class="auth-btn secondary" id="auth-offline">Jouer hors-ligne (mode test, sans sauvegarde)</button>`;
      card.querySelector('#auth-retry')?.addEventListener('click', () => void this.start());
      card.querySelector('#auth-offline')?.addEventListener('click', () => {
        // Mode dégradé explicite: aventure locale de test, sans compte ni persistance
        this.hide();
        this.onComplete?.(null as unknown as CharacterFull);
      });
    }
  }

  // ============================================
  // FORMULAIRES
  // ============================================

  private showLogin(): void {
    const card = this.card();
    card.innerHTML = `
      <div class="auth-title">Connexion</div>
      <div class="auth-error" id="auth-error"></div>
      <div class="auth-field"><label>Nom d'utilisateur</label>
        <input id="login-username" autocomplete="username" maxlength="16"></div>
      <div class="auth-field"><label>Mot de passe</label>
        <input id="login-password" type="password" autocomplete="current-password"></div>
      <button class="auth-btn" id="login-submit">Se connecter</button>
      <span class="auth-link" id="goto-register">Créer un compte</span>`;
    this.footer().textContent = '';

    const submit = async (): Promise<void> => {
      const username = (card.querySelector('#login-username') as HTMLInputElement).value.trim();
      const password = (card.querySelector('#login-password') as HTMLInputElement).value;
      this.showError('');
      const btn = card.querySelector('#login-submit') as HTMLButtonElement;
      btn.disabled = true;
      try {
        const res = await this.network.request<{ success: boolean; error?: string; token?: string; account?: AuthAccountInfo }>(
          'auth:login', { username, password }
        );
        if (!res.success || !res.account) {
          this.showError(res.error ?? 'Échec de la connexion');
          btn.disabled = false;
          return;
        }
        if (res.token) sessionStorage.setItem(TOKEN_KEY, res.token);
        this.account = res.account;
        await this.showCharacterList();
      } catch (e: any) {
        this.showError(e.message ?? 'Erreur réseau');
        btn.disabled = false;
      }
    };
    card.querySelector('#login-submit')?.addEventListener('click', () => void submit());
    card.querySelector('#login-password')?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') void submit();
    });
    card.querySelector('#goto-register')?.addEventListener('click', () => this.showRegister());
  }

  private showRegister(): void {
    const card = this.card();
    card.innerHTML = `
      <div class="auth-title">Créer un compte</div>
      <div class="auth-error" id="auth-error"></div>
      <div class="auth-field"><label>Nom d'utilisateur (3-16 caractères)</label>
        <input id="reg-username" maxlength="16" autocomplete="username"></div>
      <div class="auth-field"><label>Mot de passe (4+ caractères)</label>
        <input id="reg-password" type="password" autocomplete="new-password"></div>
      <div class="auth-field"><label>Confirmer le mot de passe</label>
        <input id="reg-password2" type="password" autocomplete="new-password"></div>
      <button class="auth-btn" id="reg-submit">Créer le compte</button>
      <span class="auth-link" id="goto-login">J'ai déjà un compte</span>`;

    const submit = async (): Promise<void> => {
      const username = (card.querySelector('#reg-username') as HTMLInputElement).value.trim();
      const password = (card.querySelector('#reg-password') as HTMLInputElement).value;
      const password2 = (card.querySelector('#reg-password2') as HTMLInputElement).value;
      this.showError('');
      if (password !== password2) {
        this.showError('Les mots de passe ne correspondent pas');
        return;
      }
      const btn = card.querySelector('#reg-submit') as HTMLButtonElement;
      btn.disabled = true;
      try {
        const res = await this.network.request<{ success: boolean; error?: string }>(
          'auth:register', { username, password }
        );
        if (!res.success) {
          this.showError(res.error ?? 'Échec de la création');
          btn.disabled = false;
          return;
        }
        // Auto-login après inscription
        const login = await this.network.request<{ success: boolean; token?: string; account?: AuthAccountInfo }>(
          'auth:login', { username, password }
        );
        if (login.success && login.account) {
          if (login.token) sessionStorage.setItem(TOKEN_KEY, login.token);
          this.account = login.account;
          await this.showCharacterList();
        } else {
          this.showError('Compte créé — connectez-vous');
          this.showLogin();
        }
      } catch (e: any) {
        this.showError(e.message ?? 'Erreur réseau');
        btn.disabled = false;
      }
    };
    card.querySelector('#reg-submit')?.addEventListener('click', () => void submit());
    card.querySelector('#goto-login')?.addEventListener('click', () => this.showLogin());
  }

  // ============================================
  // PERSONNAGES
  // ============================================

  private async showCharacterList(): Promise<void> {
    const card = this.card();
    card.innerHTML = `<div class="auth-title">Mes personnages</div><div class="auth-spinner"></div>`;

    let res: { success: boolean; error?: string; characters?: CharacterSummary[] };
    try {
      res = await this.network.request('character:list');
    } catch (e: any) {
      this.setState('connection-error');
      return;
    }
    if (!res.success) {
      this.setState('connection-error');
      return;
    }
    this.characters = res.characters ?? [];

    const raceLabel = (r: string) => (r === 'european' ? 'Europe' : 'Chine');
    const genderIcon = (g: string) => (g === 'female' ? '♀' : '♂');

    if (this.characters.length === 0) {
      card.innerHTML = `
        <div class="auth-title">Mes personnages</div>
        <div class="auth-state" style="margin-bottom:8px">Aucun personnage pour l'instant.</div>
        <button class="auth-btn" id="char-goto-create">Créer un personnage</button>
        <span class="auth-link" id="char-logout">Se déconnecter</span>`;
    } else {
      const cards = this.characters.map((c) => `
        <div class="char-card" data-id="${c.id}">
          <div class="char-avatar">${genderIcon(c.gender)}</div>
          <div class="char-info">
            <div class="char-name">${c.name}</div>
            <div class="char-meta">Niveau ${c.level} · ${raceLabel(c.race)} · ${c.zone}</div>
          </div>
          <div class="char-actions">
            <button class="char-mini-btn" data-action="play" data-id="${c.id}">Jouer</button>
            <button class="char-mini-btn danger" data-action="delete" data-id="${c.id}">Suppr.</button>
          </div>
        </div>`).join('');
      card.innerHTML = `
        <div class="auth-title">Mes personnages</div>
        <div class="char-list">${cards}</div>
        <button class="auth-btn" id="char-goto-create">Nouveau personnage</button>
        <span class="auth-link" id="char-logout">Se déconnecter</span>`;
    }

    this.footer().textContent = `Compte: ${this.account?.username ?? ''}${this.account?.role && this.account.role !== 'player' ? ` (${this.account.role})` : ''}`;

    card.querySelector('#char-goto-create')?.addEventListener('click', () => this.showCharacterCreate());
    card.querySelector('#char-logout')?.addEventListener('click', () => {
      sessionStorage.removeItem(TOKEN_KEY);
      void this.network.request('auth:logout').catch(() => undefined);
      this.account = null;
      this.showLogin();
    });
    card.querySelectorAll('.char-card').forEach((el) => {
      el.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const action = target.dataset.action ?? 'play';
        const id = (target.closest('.char-card') as HTMLElement).dataset.id!;
        if (action === 'delete') {
          void this.deleteCharacter(id);
        } else {
          void this.selectCharacter(id);
        }
      });
    });
  }

  private showCharacterCreate(): void {
    const card = this.card();
    card.innerHTML = `
      <div class="auth-title">Créer un personnage</div>
      <div class="auth-error" id="auth-error"></div>
      <div class="auth-field"><label>Nom du personnage (3-12 lettres/chiffres)</label>
        <input id="char-name" maxlength="12"></div>
      <div class="auth-toggle-row" id="race-row">
        <div class="auth-toggle selected" data-value="chinese">Chine</div>
        <div class="auth-toggle" data-value="european">Europe</div>
      </div>
      <div class="auth-toggle-row" id="gender-row">
        <div class="auth-toggle selected" data-value="male">Homme</div>
        <div class="auth-toggle" data-value="female">Femme</div>
      </div>
      <div class="auth-field"><label>Apparence</label>
        <input id="char-appearance" value="Aventurier" disabled></div>
      <button class="auth-btn" id="char-submit">Créer et jouer</button>
      <span class="auth-link" id="char-cancel">Annuler</span>`;

    // Toggles exclusifs
    for (const rowId of ['race-row', 'gender-row']) {
      const row = card.querySelector('#' + rowId)!;
      row.querySelectorAll('.auth-toggle').forEach((t) => {
        t.addEventListener('click', () => {
          row.querySelectorAll('.auth-toggle').forEach((x) => x.classList.remove('selected'));
          (t as HTMLElement).classList.add('selected');
        });
      });
    }

    const submit = async (): Promise<void> => {
      const name = (card.querySelector('#char-name') as HTMLInputElement).value.trim();
      const race = (card.querySelector('#race-row .selected') as HTMLElement).dataset.value!;
      const gender = (card.querySelector('#gender-row .selected') as HTMLElement).dataset.value!;
      this.showError('');
      const btn = card.querySelector('#char-submit') as HTMLButtonElement;
      btn.disabled = true;
      try {
        const res = await this.network.request<{ success: boolean; error?: string; character?: CharacterSummary }>(
          'character:create', { name, race, gender }
        );
        if (!res.success || !res.character) {
          this.showError(res.error ?? 'Échec de la création');
          btn.disabled = false;
          return;
        }
        await this.selectCharacter(res.character.id);
      } catch (e: any) {
        this.showError(e.message ?? 'Erreur réseau');
        btn.disabled = false;
      }
    };
    card.querySelector('#char-submit')?.addEventListener('click', () => void submit());
    card.querySelector('#char-name')?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') void submit();
    });
    card.querySelector('#char-cancel')?.addEventListener('click', () => void this.showCharacterList());
  }

  private async selectCharacter(characterId: string): Promise<void> {
    const card = this.card();
    card.innerHTML = `<div class="auth-title">Chargement du monde...</div><div class="auth-spinner"></div>`;
    try {
      const res = await this.network.request<{ success: boolean; error?: string; character?: CharacterFull }>(
        'character:select', { characterId }, 30000
      );
      if (!res.success || !res.character) {
        await this.showCharacterList();
        this.showError(res.error ?? 'Sélection impossible');
        return;
      }
      this.hide();
      this.onComplete?.(res.character);
    } catch (e: any) {
      await this.showCharacterList();
      this.showError(e.message ?? 'Erreur réseau');
    }
  }

  private async deleteCharacter(characterId: string): Promise<void> {
    const c = this.characters.find((x) => x.id === characterId);
    if (!c) return;
    // Confirmation inline (pas de confirm() natif)
    const card = this.card();
    card.innerHTML = `
      <div class="auth-title" style="color:#ff9a76">Supprimer ${c.name} ?</div>
      <div class="auth-state" style="margin-bottom:10px">Cette action est définitive.</div>
      <button class="auth-btn secondary" id="del-yes">Oui, supprimer</button>
      <span class="auth-link" id="del-no">Annuler</span>`;
    card.querySelector('#del-no')?.addEventListener('click', () => void this.showCharacterList());
    card.querySelector('#del-yes')?.addEventListener('click', async () => {
      await this.network.request('character:delete', { characterId }).catch(() => undefined);
      await this.showCharacterList();
    });
  }

  private showError(message: string): void {
    const el = this.root?.querySelector('#auth-error') as HTMLElement | null;
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('visible', message !== '');
  }
}
