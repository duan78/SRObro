/**
 * SRObro - Authentication Manager
 * Handles login, logout, session management, and account creation
 */

import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import { EventEmitter } from 'events';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const logger = createLogger('AuthManager');

/**
 * Session data
 */
export interface Session {
  token: string;
  accountId: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;
  lastAccess: Date;
}

/**
 * Login result
 */
export interface LoginResult {
  success: boolean;
  reason?: string;
  session?: Session;
  account?: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Registration result
 */
export interface RegistrationResult {
  success: boolean;
  reason?: string;
  account?: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Auth Manager options
 */
export interface AuthManagerOptions {
  sessionDuration: number; // Session duration in milliseconds (default: 7 days)
  maxSessionsPerAccount: number;
  bcryptRounds: number;
  minUsernameLength: number;
  maxUsernameLength: number;
  minPasswordLength: number;
  maxPasswordLength: number;
}

/**
 * Auth Manager class
 */
export class AuthManager extends EventEmitter {
  private options: Required<AuthManagerOptions>;
  private sessions: Map<string, Session> = new Map(); // In-memory sessions
  private accountSessions: Map<string, Set<string>> = new Map(); // Account ID -> session tokens

  constructor(options?: Partial<AuthManagerOptions>) {
    super();
    this.options = {
      sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
      maxSessionsPerAccount: 5,
      bcryptRounds: 10,
      minUsernameLength: 3,
      maxUsernameLength: 20,
      minPasswordLength: 6,
      maxPasswordLength: 128,
      ...options,
    };
  }

  /**
   * Register a new account
   */
  async register(username: string, email: string, password: string): Promise<RegistrationResult> {
    // Validate input
    const validation = this.validateRegistration(username, email, password);
    if (!validation.valid) {
      return {
        success: false,
        reason: validation.errors.join(', '),
      };
    }

    try {
      // Check if username already exists
      const existingUsername = await prisma.account.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return {
          success: false,
          reason: 'Username already taken',
        };
      }

      // Check if email already exists
      const existingEmail = await prisma.account.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return {
          success: false,
          reason: 'Email already registered',
        };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, this.options.bcryptRounds);

      // Create account
      const account = await prisma.account.create({
        data: {
          username,
          email,
          passwordHash,
        },
      });

      logger.info(`Account registered: ${username}`, {
        accountId: account.id,
        email,
      });

      this.emit('accountRegistered', {
        accountId: account.id,
        username,
        email,
      });

      return {
        success: true,
        account: {
          id: account.id,
          username: account.username,
          email: account.email,
        },
      };
    } catch (error) {
      logger.error('Registration failed:', error);
      return {
        success: false,
        reason: 'Registration failed. Please try again.',
      };
    }
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      // Find account
      const account = await prisma.account.findUnique({
        where: { username },
      });

      if (!account) {
        return {
          success: false,
          reason: 'Invalid username or password',
        };
      }

      // Check if account is banned
      if (account.isBanned) {
        const banReason = account.banReason || 'Account suspended';
        const banUntil = account.banUntil;

        if (banUntil && banUntil > new Date()) {
          return {
            success: false,
            reason: `Account banned: ${banReason} (expires: ${banUntil.toISOString()})`,
          };
        } else if (banUntil && banUntil <= new Date()) {
          // Ban expired, unban
          await prisma.account.update({
            where: { id: account.id },
            data: {
              isBanned: false,
              banReason: null,
              banUntil: null,
            },
          });
        } else {
          return {
            success: false,
            reason: `Account banned: ${banReason}`,
          };
        }
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, account.passwordHash);

      if (!passwordValid) {
        return {
          success: false,
          reason: 'Invalid username or password',
        };
      }

      // Check session limit
      const accountSessions = this.accountSessions.get(account.id);
      if (accountSessions && accountSessions.size >= this.options.maxSessionsPerAccount) {
        // Remove oldest session
        const oldestToken = Array.from(accountSessions)[0];
        await this.logoutSession(oldestToken);
      }

      // Create session
      const session = await this.createSession(account.id, account.username);

      // Update last login
      await prisma.account.update({
        where: { id: account.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info(`Account logged in: ${username}`, {
        accountId: account.id,
        sessionToken: session.token,
      });

      this.emit('accountLoggedIn', {
        accountId: account.id,
        username,
        sessionToken: session.token,
      });

      return {
        success: true,
        session,
        account: {
          id: account.id,
          username: account.username,
          email: account.email,
        },
      };
    } catch (error) {
      logger.error('Login failed:', error);
      return {
        success: false,
        reason: 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Logout by session token
   */
  async logoutSession(token: string): Promise<boolean> {
    const session = this.sessions.get(token);

    if (!session) {
      return false;
    }

    // Remove from sessions
    this.sessions.delete(token);

    // Remove from account sessions
    const accountSessions = this.accountSessions.get(session.accountId);
    if (accountSessions) {
      accountSessions.delete(token);
      if (accountSessions.size === 0) {
        this.accountSessions.delete(session.accountId);
      }
    }

    // Delete from database
    try {
      await prisma.session.delete({
        where: { token },
      });
    } catch (error) {
      // Session might not exist in database
      logger.warn('Failed to delete session from database:', error);
    }

    logger.info(`Session logged out: ${token}`, {
      accountId: session.accountId,
      username: session.username,
    });

    this.emit('sessionLoggedOut', {
      sessionToken: token,
      accountId: session.accountId,
      username: session.username,
    });

    return true;
  }

  /**
   * Logout all sessions for an account
   */
  async logoutAccount(accountId: string): Promise<number> {
    const accountSessions = this.accountSessions.get(accountId);

    if (!accountSessions) {
      return 0;
    }

    let count = 0;
    for (const token of accountSessions) {
      if (await this.logoutSession(token)) {
        count++;
      }
    }

    logger.info(`All sessions logged out for account: ${accountId}`, { count });

    return count;
  }

  /**
   * Validate a session token
   */
  async validateSession(token: string): Promise<Session | null> {
    const session = this.sessions.get(token);

    if (!session) {
      // Check database for session
      try {
        const dbSession = await prisma.session.findUnique({
          where: { token },
        });

        if (!dbSession) {
          return null;
        }

        // Check if expired
        if (dbSession.expiresAt < new Date()) {
          await this.logoutSession(token);
          return null;
        }

        // Load into memory
        const loadedSession: Session = {
          token: dbSession.token,
          accountId: dbSession.accountId,
          username: '', // Not stored in session table
          createdAt: dbSession.createdAt,
          expiresAt: dbSession.expiresAt,
          lastAccess: new Date(),
        };

        this.sessions.set(token, loadedSession);

        // Add to account sessions
        let accountSessions = this.accountSessions.get(dbSession.accountId);
        if (!accountSessions) {
          accountSessions = new Set();
          this.accountSessions.set(dbSession.accountId, accountSessions);
        }
        accountSessions.add(token);

        return loadedSession;
      } catch (error) {
        logger.error('Failed to validate session from database:', error);
        return null;
      }
    }

    // Check if expired
    if (session.expiresAt < new Date()) {
      await this.logoutSession(token);
      return null;
    }

    // Update last access
    session.lastAccess = new Date();

    return session;
  }

  /**
   * Create a new session
   */
  private async createSession(accountId: string, username: string): Promise<Session> {
    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.options.sessionDuration);

    const session: Session = {
      token,
      accountId,
      username,
      createdAt: now,
      expiresAt,
      lastAccess: now,
    };

    // Save to database
    try {
      await prisma.session.create({
        data: {
          token,
          accountId,
          expiresAt,
        },
      });
    } catch (error) {
      logger.error('Failed to save session to database:', error);
    }

    // Add to memory
    this.sessions.set(token, session);

    // Add to account sessions
    let accountSessions = this.accountSessions.get(accountId);
    if (!accountSessions) {
      accountSessions = new Set();
      this.accountSessions.set(accountId, accountSessions);
    }
    accountSessions.add(token);

    return session;
  }

  /**
   * Validate registration input
   */
  private validateRegistration(
    username: string,
    email: string,
    password: string
  ): ValidationResult {
    const errors: string[] = [];

    // Validate username
    if (username.length < this.options.minUsernameLength) {
      errors.push(`Username must be at least ${this.options.minUsernameLength} characters`);
    }
    if (username.length > this.options.maxUsernameLength) {
      errors.push(`Username must be at most ${this.options.maxUsernameLength} characters`);
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email address');
    }

    // Validate password
    if (password.length < this.options.minPasswordLength) {
      errors.push(`Password must be at least ${this.options.minPasswordLength} characters`);
    }
    if (password.length > this.options.maxPasswordLength) {
      errors.push(`Password must be at most ${this.options.maxPasswordLength} characters`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get session by token
   */
  getSession(token: string): Session | undefined {
    return this.sessions.get(token);
  }

  /**
   * Get all sessions for an account
   */
  getAccountSessions(accountId: string): Session[] {
    const accountSessions = this.accountSessions.get(accountId);
    if (!accountSessions) {
      return [];
    }

    const sessions: Session[] = [];
    for (const token of accountSessions) {
      const session = this.sessions.get(token);
      if (session) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    let count = 0;

    const now = new Date();
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        await this.logoutSession(token);
        count++;
      }
    }

    // Clean up database
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      count += result.count;
    } catch (error) {
      logger.error('Failed to cleanup expired sessions from database:', error);
    }

    logger.info(`Cleaned up ${count} expired sessions`);

    return count;
  }

  /**
   * Get active session count
   */
  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Get account count with active sessions
   */
  getActiveAccountCount(): number {
    return this.accountSessions.size;
  }
}

/**
 * Global auth manager instance
 */
export const globalAuthManager = new AuthManager();
