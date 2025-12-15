/**
 * Système d'authentification JWT pour KBV Lyon
 * Authentification sécurisée avec refresh tokens et chiffrement AES-GCM
 * 
 * Fonctionnalités :
 * - JWT avec access/refresh tokens
 * - Chiffrement AES-GCM des tokens stockés
 * - Expiration de session intelligente (idle timeout)
 * - Monitoring d'activité utilisateur
 * - Protection contre les attaques XSS/CSRF
 */

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encrypt, decrypt, hashPassword } from './crypto';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'moderator';
  permissions: string[];
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
  };
  lastLoginAt: Date;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // en secondes
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'moderator';
}

export interface SessionInfo {
  lastActivity: number;
  loginTime: number;
  deviceInfo: string;
  ipAddress?: string;
  isLocked: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  session: SessionInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  updateActivity: () => void;
  lockSession: () => void;
  unlockSession: (password: string) => Promise<boolean>;
}

// ============================================================================
// CONFIGURATION DE SÉCURITÉ
// ============================================================================

export const SECURITY_CONFIG = {
  // Durée de vie des tokens (en millisecondes)
  ACCESS_TOKEN_DURATION: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 jours
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 jours
  
  // Timeout d'inactivité (en millisecondes)
  IDLE_TIMEOUT: 15 * 60 * 1000, // 15 minutes
  IDLE_WARNING: 12 * 60 * 1000, // Avertissement à 12 minutes
  
  // Session lock timeout
  LOCK_TIMEOUT: 5 * 60 * 1000, // 5 minutes sans activité = verrouillage
  
  // Nom des clés de stockage
  STORAGE_KEYS: {
    ENCRYPTED_TOKENS: 'kbv_enc_tokens',
    SESSION: 'kbv_session',
    USER: 'kbv_user',
    REMEMBER_ME: 'kbv_remember'
  },
  
  // Clé de dérivation (en production, utiliser une clé unique par utilisateur)
  ENCRYPTION_PASSWORD: 'kbv-lyon-secure-2025',
  
  // URLs des endpoints
  API_ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    VERIFY_2FA: '/api/auth/verify-2fa'
  },
  
  // Tentatives de connexion max
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
};

// ============================================================================
// GESTIONNAIRE DE SESSION INTELLIGENTE
// ============================================================================

class SessionManager {
  private static instance: SessionManager;
  private activityListeners: (() => void)[] = [];
  private idleTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private lockTimer: NodeJS.Timeout | null = null;
  private isTracking = false;
  
  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }
  
  // Démarrer le tracking d'activité
  startTracking(onIdle: () => void, onWarning?: () => void, onLock?: () => void): void {
    if (this.isTracking) return;
    this.isTracking = true;
    
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const resetTimers = () => {
      this.updateActivity();
      
      // Reset idle timer
      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(onIdle, SECURITY_CONFIG.IDLE_TIMEOUT);
      
      // Reset warning timer
      if (onWarning) {
        if (this.warningTimer) clearTimeout(this.warningTimer);
        this.warningTimer = setTimeout(onWarning, SECURITY_CONFIG.IDLE_WARNING);
      }
      
      // Reset lock timer
      if (onLock) {
        if (this.lockTimer) clearTimeout(this.lockTimer);
        this.lockTimer = setTimeout(onLock, SECURITY_CONFIG.LOCK_TIMEOUT);
      }
    };
    
    // Attacher les listeners
    events.forEach(event => {
      const listener = () => resetTimers();
      this.activityListeners.push(listener);
      document.addEventListener(event, listener, { passive: true });
    });
    
    // Démarrer les timers initiaux
    resetTimers();
    
    console.log('🔒 Session tracking started');
  }
  
  // Arrêter le tracking
  stopTracking(): void {
    if (!this.isTracking) return;
    this.isTracking = false;
    
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach((event, index) => {
      if (this.activityListeners[index]) {
        document.removeEventListener(event, this.activityListeners[index]);
      }
    });
    
    this.activityListeners = [];
    
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.lockTimer) clearTimeout(this.lockTimer);
    
    console.log('🔓 Session tracking stopped');
  }
  
  // Mettre à jour la dernière activité
  updateActivity(): void {
    try {
      const session = this.getSession();
      if (session) {
        session.lastActivity = Date.now();
        localStorage.setItem(
          SECURITY_CONFIG.STORAGE_KEYS.SESSION,
          JSON.stringify(session)
        );
      }
    } catch (error) {
      console.warn('Failed to update activity:', error);
    }
  }
  
  // Créer une nouvelle session
  createSession(): SessionInfo {
    const session: SessionInfo = {
      lastActivity: Date.now(),
      loginTime: Date.now(),
      deviceInfo: this.getDeviceInfo(),
      isLocked: false
    };
    
    localStorage.setItem(
      SECURITY_CONFIG.STORAGE_KEYS.SESSION,
      JSON.stringify(session)
    );
    
    return session;
  }
  
  // Récupérer la session
  getSession(): SessionInfo | null {
    try {
      const sessionStr = localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.SESSION);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  }
  
  // Verrouiller la session
  lockSession(): void {
    const session = this.getSession();
    if (session) {
      session.isLocked = true;
      localStorage.setItem(
        SECURITY_CONFIG.STORAGE_KEYS.SESSION,
        JSON.stringify(session)
      );
    }
    console.log('🔐 Session locked');
  }
  
  // Déverrouiller la session
  unlockSession(): void {
    const session = this.getSession();
    if (session) {
      session.isLocked = false;
      session.lastActivity = Date.now();
      localStorage.setItem(
        SECURITY_CONFIG.STORAGE_KEYS.SESSION,
        JSON.stringify(session)
      );
    }
    console.log('🔓 Session unlocked');
  }
  
  // Détruire la session
  clearSession(): void {
    localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.SESSION);
    this.stopTracking();
  }
  
  // Vérifier si la session est expirée
  isSessionExpired(): boolean {
    const session = this.getSession();
    if (!session) return true;
    
    const timeSinceActivity = Date.now() - session.lastActivity;
    return timeSinceActivity > SECURITY_CONFIG.IDLE_TIMEOUT;
  }
  
  // Obtenir les infos de l'appareil
  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    const {platform} = navigator;
    return `${platform} - ${ua.substring(0, 100)}`;
  }
}

// ============================================================================
// GESTIONNAIRE DE TOKENS SÉCURISÉ
// ============================================================================

class SecureTokenManager {
  private static instance: SecureTokenManager;
  private encryptionPassword: string;
  
  constructor() {
    this.encryptionPassword = SECURITY_CONFIG.ENCRYPTION_PASSWORD;
  }
  
  static getInstance(): SecureTokenManager {
    if (!SecureTokenManager.instance) {
      SecureTokenManager.instance = new SecureTokenManager();
    }
    return SecureTokenManager.instance;
  }
  
  // Stocker les tokens de manière sécurisée
  async setTokens(tokens: AuthTokens, rememberMe: boolean = false): Promise<void> {
    try {
      // Chiffrer les tokens
      const encryptedData = await encrypt(tokens, this.encryptionPassword);
      
      // Stocker les données chiffrées
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(
        SECURITY_CONFIG.STORAGE_KEYS.ENCRYPTED_TOKENS,
        JSON.stringify(encryptedData)
      );
      
      // Marquer si "Remember me" est actif
      if (rememberMe) {
        localStorage.setItem(SECURITY_CONFIG.STORAGE_KEYS.REMEMBER_ME, 'true');
      }
      
      console.log('🔐 Tokens stored securely');
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Échec du stockage sécurisé des tokens');
    }
  }
  
  // Récupérer les tokens
  async getTokens(): Promise<AuthTokens | null> {
    try {
      // Vérifier d'abord localStorage (remember me) puis sessionStorage
      let encryptedStr = localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.ENCRYPTED_TOKENS);
      if (!encryptedStr) {
        encryptedStr = sessionStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.ENCRYPTED_TOKENS);
      }
      
      if (!encryptedStr) return null;
      
      const encryptedData = JSON.parse(encryptedStr);
      const tokens = await decrypt(encryptedData, this.encryptionPassword);
      
      return tokens as AuthTokens;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  }
  
  // Récupérer le access token directement
  async getAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.accessToken || null;
  }
  
  // Récupérer le refresh token
  async getRefreshToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.refreshToken || null;
  }
  
  // Nettoyer les tokens
  clearTokens(): void {
    localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.ENCRYPTED_TOKENS);
    sessionStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.ENCRYPTED_TOKENS);
    localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.REMEMBER_ME);
    console.log('🧹 Tokens cleared');
  }
  
  // Vérifier si les tokens existent
  hasTokens(): boolean {
    return Boolean(localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.ENCRYPTED_TOKENS) ||
      sessionStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.ENCRYPTED_TOKENS));
  }
}

// ============================================================================
// CLIENT API SÉCURISÉ
// ============================================================================

class SecureAuthApiClient {
  private baseURL: string;
  private tokenManager: SecureTokenManager;
  
  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.tokenManager = SecureTokenManager.getInstance();
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = await this.tokenManager.getAccessToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    };
    
    if (accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Pour les cookies CSRF
    };
    
    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Essayer de rafraîchir le token
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          return this.request(endpoint, options);
        }
        throw new Error('Session expirée');
      }
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  private async tryRefreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.tokenManager.getRefreshToken();
      if (!refreshToken) return false;
      
      const response = await fetch(`${this.baseURL}${SECURITY_CONFIG.API_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });
      
      if (!response.ok) return false;
      
      const tokens = await response.json();
      const rememberMe = Boolean(localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.REMEMBER_ME));
      await this.tokenManager.setTokens(tokens, rememberMe);
      
      return true;
    } catch {
      return false;
    }
  }
  
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Hasher le mot de passe avant envoi
    const hashedPassword = await hashPassword(credentials.password);
    
    return this.request(SECURITY_CONFIG.API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: hashedPassword,
        rememberMe: credentials.rememberMe
      }),
    });
  }
  
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const hashedPassword = await hashPassword(data.password);
    
    return this.request(SECURITY_CONFIG.API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        password: hashedPassword
      }),
    });
  }
  
  async logout(): Promise<void> {
    const refreshToken = await this.tokenManager.getRefreshToken();
    
    try {
      await this.request(SECURITY_CONFIG.API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      this.tokenManager.clearTokens();
    }
  }
  
  async getProfile(): Promise<User> {
    return this.request(SECURITY_CONFIG.API_ENDPOINTS.PROFILE);
  }
  
  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request(SECURITY_CONFIG.API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

// ============================================================================
// STORE ZUSTAND SÉCURISÉ
// ============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const apiClient = new SecureAuthApiClient();
          const { user, tokens } = await apiClient.login(credentials);
          
          // Stocker les tokens de manière sécurisée
          const tokenManager = SecureTokenManager.getInstance();
          await tokenManager.setTokens(tokens, credentials.rememberMe);
          
          // Créer une session
          const sessionManager = SessionManager.getInstance();
          const session = sessionManager.createSession();
          
          // Démarrer le tracking d'activité
          sessionManager.startTracking(
            () => {
              console.log('⚠️ Session idle timeout');
              get().logout();
            },
            () => {
              console.log('⚠️ Session idle warning');
              // Afficher un avertissement
            },
            () => {
              console.log('🔐 Session auto-lock');
              get().lockSession();
            }
          );
          
          set({
            user,
            tokens,
            session,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          console.log('✅ Login successful for:', user.email);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Échec de connexion';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },
      
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const apiClient = new SecureAuthApiClient();
          const { user, tokens } = await apiClient.register(data);
          
          const tokenManager = SecureTokenManager.getInstance();
          await tokenManager.setTokens(tokens, false);
          
          const sessionManager = SessionManager.getInstance();
          const session = sessionManager.createSession();
          
          sessionManager.startTracking(
            () => get().logout(),
            undefined,
            () => get().lockSession()
          );
          
          set({
            user,
            tokens,
            session,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          console.log('✅ Registration successful for:', user.email);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Échec d\'inscription';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },
      
      logout: () => {
        const tokenManager = SecureTokenManager.getInstance();
        const sessionManager = SessionManager.getInstance();
        
        tokenManager.clearTokens();
        sessionManager.clearSession();
        
        set({
          user: null,
          tokens: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        
        console.log('✅ Logout successful');
      },
      
      refreshToken: async () => {
        try {
          const tokenManager = SecureTokenManager.getInstance();
          const refreshToken = await tokenManager.getRefreshToken();
          
          if (!refreshToken) {
            throw new Error('No refresh token');
          }
          
          const response = await fetch(SECURITY_CONFIG.API_ENDPOINTS.REFRESH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
            credentials: 'include',
          });
          
          if (!response.ok) throw new Error('Refresh failed');
          
          const tokens = await response.json();
          const rememberMe = Boolean(localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.REMEMBER_ME));
          await tokenManager.setTokens(tokens, rememberMe);
          
          set({ tokens });
          console.log('✅ Token refreshed');
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          get().logout();
        }
      },
      
      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          const apiClient = new SecureAuthApiClient();
          const updatedUser = await apiClient.updateProfile(data);
          
          set({
            user: updatedUser,
            isLoading: false,
          });
          
          console.log('✅ Profile updated');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Échec de mise à jour';
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },
      
      checkAuthStatus: async () => {
        const tokenManager = SecureTokenManager.getInstance();
        const sessionManager = SessionManager.getInstance();
        
        if (!tokenManager.hasTokens()) {
          get().logout();
          return;
        }
        
        if (sessionManager.isSessionExpired()) {
          console.log('Session expired');
          get().logout();
          return;
        }
        
        try {
          const apiClient = new SecureAuthApiClient();
          const user = await apiClient.getProfile();
          
          const session = sessionManager.getSession();
          
          sessionManager.startTracking(
            () => get().logout(),
            undefined,
            () => get().lockSession()
          );
          
          set({
            user,
            session,
            isAuthenticated: true,
          });
          
          console.log('✅ Auth status verified');
        } catch (error) {
          console.error('Auth check failed:', error);
          get().logout();
        }
      },
      
      clearError: () => set({ error: null }),
      
      updateActivity: () => {
        const sessionManager = SessionManager.getInstance();
        sessionManager.updateActivity();
        
        const session = sessionManager.getSession();
        if (session) {
          set({ session });
        }
      },
      
      lockSession: () => {
        const sessionManager = SessionManager.getInstance();
        sessionManager.lockSession();
        
        const session = sessionManager.getSession();
        if (session) {
          set({ session });
        }
      },
      
      unlockSession: async (): Promise<boolean> => {
        const {user} = get();
        if (!user) return false;
        
        try {
          // En production, vérifier le mot de passe côté serveur
          
          const sessionManager = SessionManager.getInstance();
          sessionManager.unlockSession();
          
          const session = sessionManager.getSession();
          if (session) {
            set({ session });
          }
          
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'kbv-auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================================================
// HOOKS UTILITAIRES
// ============================================================================

export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    
    hasPermission: (permission: string): boolean => store.user?.permissions.includes(permission) || false,
    
    hasRole: (role: string): boolean => store.user?.role === role,
    
    isAdmin: (): boolean => store.user?.role === 'admin',
    
    isModerator: (): boolean => store.user?.role === 'admin' || store.user?.role === 'moderator',
    
    isSessionLocked: (): boolean => store.session?.isLocked || false,
    
    getSessionDuration: (): number => {
      if (!store.session) return 0;
      return Date.now() - store.session.loginTime;
    },
    
    getIdleTime: (): number => {
      if (!store.session) return 0;
      return Date.now() - store.session.lastActivity;
    },
  };
};

// ============================================================================
// FONCTION HELPER POUR PROTECTION DES ROUTES
// ============================================================================

export interface RequireAuthOptions {
  requiredRole?: string;
  requiredPermission?: string;
  redirectTo?: string;
}

/**
 * Helper pour vérifier l'authentification dans les composants
 * Usage: const { isAllowed, redirect } = checkAuth({ requiredRole: 'admin' });
 */
export const checkAuth = (options: RequireAuthOptions = {}): {
  isAllowed: boolean;
  isLoading: boolean;
  redirect: string | null;
  user: User | null;
} => {
  const state = useAuthStore.getState();
  const { isAuthenticated, user, isLoading } = state;
  
  if (isLoading) {
    return { isAllowed: false, isLoading: true, redirect: null, user: null };
  }
  
  if (!isAuthenticated) {
    return { 
      isAllowed: false, 
      isLoading: false, 
      redirect: options.redirectTo || '/login',
      user: null 
    };
  }
  
  if (options.requiredRole && user?.role !== options.requiredRole) {
    return { isAllowed: false, isLoading: false, redirect: '/unauthorized', user };
  }
  
  if (options.requiredPermission && !user?.permissions.includes(options.requiredPermission)) {
    return { isAllowed: false, isLoading: false, redirect: '/unauthorized', user };
  }
  
  return { isAllowed: true, isLoading: false, redirect: null, user };
};

/**
 * Hook pour utiliser dans les composants React
 */
export const useRequireAuth = (options: RequireAuthOptions = {}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  const isAllowed = React.useMemo(() => {
    if (!isAuthenticated) return false;
    if (options.requiredRole && user?.role !== options.requiredRole) return false;
    if (options.requiredPermission && !user?.permissions.includes(options.requiredPermission)) return false;
    return true;
  }, [isAuthenticated, user, options.requiredRole, options.requiredPermission]);
  
  const redirectTo = React.useMemo(() => {
    if (!isAuthenticated) return options.redirectTo || '/login';
    if (!isAllowed) return '/unauthorized';
    return null;
  }, [isAuthenticated, isAllowed, options.redirectTo]);
  
  return { isAllowed, isLoading, redirectTo, user };
};

// ============================================================================
// CONFIGURATION AUTO-REFRESH
// ============================================================================

let refreshInterval: NodeJS.Timeout | null = null;

export const setupTokenRefresh = (): void => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  // Vérifier le token toutes les 5 minutes
  refreshInterval = setInterval(async () => {
    const store = useAuthStore.getState();
    if (store.isAuthenticated) {
      const tokenManager = SecureTokenManager.getInstance();
      const tokens = await tokenManager.getTokens();
      
      if (tokens) {
        // Vérifier si le token expire bientôt (dans les 5 prochaines minutes)
        // En production, décoder le JWT pour vérifier l'expiration
        store.refreshToken();
      }
    }
  }, 5 * 60 * 1000);
  
  console.log('🔄 Token refresh interval configured');
};

export const cleanupTokenRefresh = (): void => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  
  SessionManager.getInstance().stopTracking();
  console.log('🧹 Auth cleanup complete');
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  SecureTokenManager,
  SessionManager,
  SecureAuthApiClient
};

export default {
  useAuthStore,
  useAuth,
  useRequireAuth,
  checkAuth,
  SecureTokenManager,
  SessionManager,
  SecureAuthApiClient,
  setupTokenRefresh,
  cleanupTokenRefresh,
  SECURITY_CONFIG
};
