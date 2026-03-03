class WebSocketService {
  constructor(url, options = {}) {
    this.url = url;
    this.socket = null;
    this.listeners = new Set();
    this.messageQueue = [];
    this.shouldReconnect = true;

    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectInterval = options.maxReconnectInterval || 30000;
    this.currentReconnectInterval = this.reconnectInterval;
    this.onConnectionChange = options.onConnectionChange || (() => {});

    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', () => {
      console.log('WebSocket conectado');
      this.currentReconnectInterval = this.reconnectInterval;
      this.flushMessageQueue();
      this.onConnectionChange('connected');
    });

    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(data));
      } catch (error) {
        console.error('Mensagem WebSocket invalida:', error);
      }
    });

    this.socket.addEventListener('close', () => {
      console.warn('WebSocket desconectado');
      this.onConnectionChange('disconnected');

      if (this.shouldReconnect) {
        setTimeout(() => this.reconnect(), this.currentReconnectInterval);
      }
    });

    this.socket.addEventListener('error', (error) => {
      console.error('Erro no WebSocket', error);
      this.socket.close();
    });
  }

  reconnect() {
    if (!this.shouldReconnect) {
      return;
    }

    console.log('Tentando reconectar...');
    this.currentReconnectInterval = Math.min(
      this.currentReconnectInterval * 2,
      this.maxReconnectInterval,
    );
    this.connect();
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return;
    }

    console.warn('WebSocket nao conectado. Mensagem em fila.');
    this.messageQueue.push(message);
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  addMessageListener(callback) {
    this.listeners.add(callback);
  }

  removeMessageListener(callback) {
    this.listeners.delete(callback);
  }

  close() {
    this.shouldReconnect = false;

    if (this.socket) {
      this.socket.close();
    }
  }
}

export default WebSocketService;
