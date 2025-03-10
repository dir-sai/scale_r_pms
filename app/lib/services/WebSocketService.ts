import { Platform } from 'react-native';

interface WebSocketEvent {
  type: string;
  payload: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: Map<string, Set<(event: WebSocketEvent) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private lastPongTime: number = Date.now();

  constructor() {
    this.connect();
  }

  private connect() {
    const wsProtocol = Platform.OS === 'web' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = __DEV__ ? 'localhost:3000' : window.location.host;
    
    try {
      this.socket = new WebSocket(`${wsProtocol}//${wsHost}/ws`);
      
      this.socket.onopen = this.handleOpen;
      this.socket.onclose = this.handleClose;
      this.socket.onmessage = this.handleMessage;
      this.socket.onerror = this.handleError;
      
      this.startPingInterval();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private handleOpen = () => {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
  };

  private handleClose = () => {
    console.log('WebSocket closed');
    this.cleanup();
    this.handleReconnect();
  };

  private handleMessage = (event: MessageEvent) => {
    try {
      const wsEvent: WebSocketEvent = JSON.parse(event.data);
      
      if (wsEvent.type === 'pong') {
        this.lastPongTime = Date.now();
        return;
      }
      
      const subscribers = this.subscribers.get(wsEvent.type);
      if (subscribers) {
        subscribers.forEach(callback => callback(wsEvent));
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  };

  private handleError = (error: Event) => {
    console.error('WebSocket error:', error);
    this.cleanup();
    this.handleReconnect();
  };

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
        
        // Check if we haven't received a pong in the last 30 seconds
        if (Date.now() - this.lastPongTime > 30000) {
          console.warn('No pong received, reconnecting...');
          this.socket.close();
        }
      }
    }, 15000);
  }

  private cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
    }
  }

  subscribe(eventType: string, callback: (event: WebSocketEvent) => void) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)?.add(callback);
    
    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  unsubscribe(eventType: string, callback: (event: WebSocketEvent) => void) {
    this.subscribers.get(eventType)?.delete(callback);
  }

  send(eventType: string, payload: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: eventType, payload }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }
}

export const webSocketService = new WebSocketService(); 