/**
 * Gestionnaire WebSocket pour KBV Lyon
 * Communication temps réel avec reconnexion automatique
 */

import { create } from 'zustand';

// ============================================================================
// TYPES
// ============================================================================

export type WebSocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  id: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  debug?: boolean;
}

export interface WebSocketState {
  status: WebSocketStatus;
  lastMessage: WebSocketMessage | null;
  error: string | null;
  reconnectCount: number;
  isConnected: boolean;
}

type MessageHandler = (message: WebSocketMessage) => void;
type StatusHandler = (status: WebSocketStatus) => void;

// ============================================================================
// WEBSOCKET MANAGER
// ============================================================================

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private statusHandlers: Set<StatusHandler> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectCount = 0;
  private status: WebSocketStatus = 'disconnected';
  private messageQueue: WebSocketMessage[] = [];

  private constructor(config: WebSocketConfig) {
    this.config = {
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      heartbeatInterval: 30000,
      debug: false,
      ...config,
    };
  }

  static getInstance(config?: WebSocketConfig): WebSocketManager {
    if (!WebSocketManager.instance) {
      if (!config) {
        throw new Error('WebSocketManager requires config on first initialization');
      }
      WebSocketManager.instance = new WebSocketManager(config);
    }
    return WebSocketManager.instance;
  }

  // ============================================================================
  // CONNEXION
  // ============================================================================

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('Already connected');
      return;
    }

    this.updateStatus('connecting');

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        this.log('Connected');
        this.updateStatus('connected');
        this.reconnectCount = 0;
        this.startHeartbeat();
        this.flushMessageQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.log('Received:', message);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        this.log(`Disconnected: ${event.code} - ${event.reason}`);
        this.stopHeartbeat();

        if (event.code !== 1000) {
          // Reconnexion automatique sauf si fermeture normale
          this.handleReconnect();
        } else {
          this.updateStatus('disconnected');
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateStatus('error');
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      this.updateStatus('error');
      this.handleReconnect();
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
    }

    this.updateStatus('disconnected');
    this.log('Disconnected by client');
  }

  // ============================================================================
  // RECONNEXION
  // ============================================================================

  private handleReconnect(): void {
    if (this.reconnectCount >= (this.config.reconnectAttempts || 5)) {
      this.log('Max reconnect attempts reached');
      this.updateStatus('error');
      return;
    }

    this.reconnectCount++;
    this.updateStatus('reconnecting');
    this.log(`Reconnecting... attempt ${this.reconnectCount}`);

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // ============================================================================
  // HEARTBEAT
  // ============================================================================

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping', payload: null, timestamp: Date.now(), id: `ping-${Date.now()}` });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // ============================================================================
  // ENVOI DE MESSAGES
  // ============================================================================

  send(message: WebSocketMessage): boolean {
    if (!this.isConnected()) {
      this.log('Not connected, queueing message');
      this.messageQueue.push(message);
      return false;
    }

    try {
      this.ws!.send(JSON.stringify(message));
      this.log('Sent:', message);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      this.messageQueue.push(message);
      return false;
    }
  }

  sendEvent(type: string, payload: any): boolean {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now(),
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    return this.send(message);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  // ============================================================================
  // GESTION DES MESSAGES
  // ============================================================================

  private handleMessage(message: WebSocketMessage): void {
    // Handler spécifique pour le type
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }

    // Handler global pour tous les messages
    const globalHandlers = this.messageHandlers.get('*');
    if (globalHandlers) {
      globalHandlers.forEach((handler) => handler(message));
    }
  }

  subscribe(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler);

    // Retourner une fonction pour se désabonner
    return () => {
      this.messageHandlers.get(type)?.delete(handler);
    };
  }

  subscribeToStatus(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  // ============================================================================
  // UTILITAIRES
  // ============================================================================

  private updateStatus(status: WebSocketStatus): void {
    this.status = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getStatus(): WebSocketStatus {
    return this.status;
  }

  getReconnectCount(): number {
    return this.reconnectCount;
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocket]', ...args);
    }
  }
}

// ============================================================================
// STORE ZUSTAND
// ============================================================================

interface WebSocketStore extends WebSocketState {
  connect: (url: string) => void;
  disconnect: () => void;
  send: (type: string, payload: any) => boolean;
  subscribe: (type: string, handler: MessageHandler) => () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  status: 'disconnected',
  lastMessage: null,
  error: null,
  reconnectCount: 0,
  isConnected: false,

  connect: (url: string) => {
    const manager = WebSocketManager.getInstance({ url, debug: true });

    // S'abonner aux changements de statut
    manager.subscribeToStatus((status) => {
      set({
        status,
        isConnected: status === 'connected',
        reconnectCount: manager.getReconnectCount(),
      });
    });

    // S'abonner à tous les messages
    manager.subscribe('*', (message) => {
      set({ lastMessage: message });
    });

    manager.connect();
  },

  disconnect: () => {
    try {
      const manager = WebSocketManager.getInstance({ url: '' });
      manager.disconnect();
    } catch {
      // Manager pas encore initialisé
    }
  },

  send: (type: string, payload: any) => {
    try {
      const manager = WebSocketManager.getInstance({ url: '' });
      return manager.sendEvent(type, payload);
    } catch {
      return false;
    }
  },

  subscribe: (type: string, handler: MessageHandler) => {
    try {
      const manager = WebSocketManager.getInstance({ url: '' });
      return manager.subscribe(type, handler);
    } catch {
      return () => {};
    }
  },
}));

// ============================================================================
// HOOK PERSONNALISÉ
// ============================================================================

export const useWebSocket = () => {
  const store = useWebSocketStore();

  return {
    ...store,

    // Raccourci pour vérifier la connexion
    isOnline: store.isConnected,

    // Envoyer un message de chat
    sendChatMessage: (recipientId: string, content: string) =>
      store.send('chat:message', { recipientId, content }),

    // Notifier une mise à jour
    notifyUpdate: (entityType: string, entityId: string, action: 'create' | 'update' | 'delete') =>
      store.send('entity:update', { entityType, entityId, action }),

    // Demander une synchronisation
    requestSync: () => store.send('sync:request', { timestamp: Date.now() }),
  };
};

// ============================================================================
// TYPES D'ÉVÉNEMENTS
// ============================================================================

export const WS_EVENTS = {
  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  CHAT_READ: 'chat:read',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  // Entités
  ENTITY_UPDATE: 'entity:update',
  ENTITY_DELETE: 'entity:delete',

  // Synchronisation
  SYNC_REQUEST: 'sync:request',
  SYNC_RESPONSE: 'sync:response',

  // Présence
  PRESENCE_ONLINE: 'presence:online',
  PRESENCE_OFFLINE: 'presence:offline',

  // Système
  PING: 'ping',
  PONG: 'pong',
  ERROR: 'error',
} as const;

export default {
  WebSocketManager,
  useWebSocketStore,
  useWebSocket,
  WS_EVENTS,
};
