/**
 * Simple WebSocket Manager for the chat application.
 */
export class ChatSocket {
    constructor() {
        this.ws = null;
        this.handlers = new Map(); // event name -> callback
    }

    /**
     * Connect to the WebSocket server using a JWT for authentication.
     *
     * @param {string} token - The JWT access token obtained from the login flow.
     * @returns {Promise<void>} Resolves when the connection is successfully opened.
     */
    connect(token) {
        // In production with single-origin deployment, construct wsURL from current location
        // In dev, use localhost:3000
        let wsUrl = import.meta.env.VITE_WS_URL;
        
        if (!wsUrl) {
            if (import.meta.env.PROD) {
                // Same-origin WebSocket in production
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                wsUrl = `${protocol}//${window.location.host}`;
            } else {
                // Dev uses localhost
                wsUrl = 'ws://localhost:3000';
            }
        }

        this.ws = new WebSocket(`${wsUrl}?token=${token}`);

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const { type: eventName, ...payload } = data;
                
                const handler = this.handlers.get(eventName);
                if (handler) {
                    handler(payload);
                } else if (this.handlers.has('all')) {
                    this.handlers.get('all')(eventName, payload);
                }
            } catch (err) {
                console.error('[WS] Error parsing message:', err);
            }
        };

        this.ws.onclose = () => {
            console.log('[WS] Disconnected');
            if (this.handlers.has('disconnect')) {
                this.handlers.get('disconnect')();
            }
        };

        this.ws.onerror = (err) => {
            console.error('[WS] Error:', err);
            if (this.handlers.get('error')) {
                this.handlers.get('error')(err);
            }
        };

        return new Promise((resolve, reject) => {
            const onOpen = () => {
                this.ws.removeEventListener('open', onOpen);
                resolve();
            };
            this.ws.addEventListener('open', onOpen);
        });
    }

    /**
     * Register a callback function for a specific server-sent event.
     *
     * @param {string} event - The name of the event to listen for (e.g., 'new_message').
     * @param {Function} callback - The function to execute when the event is received.
     */
    on(event, callback) {
        this.handlers.set(event, callback);
    }

    /**
     * Send a structured JSON message to the server.
     *
     * @param {string} type - The event name the server should handle (e.g., 'message').
     * @param {Object} [payload={}] - Additional data for the event.
     */
    send(type, payload = {}) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('[WS] Cannot send message: Connection not open');
            return;
        }
        this.ws.send(JSON.stringify({ type, ...payload }));
    }

    /**
     * Request to join a specific chat room.
     *
     * @param {string} roomId - The unique ID of the room.
     * @param {string} [password=null] - The password if the room is private.
     */
    joinRoom(roomId, password = null) {
        this.send('join', { roomId, password });
    }

    /**
     * Broadcast a text message to the current room.
     *
     * @param {string} content - The plain text message to send.
     */
    sendMessage(content) {
        this.send('message', { content });
    }

    /**
     * Request to delete a specific message.
     * Only the sender of the message can perform this action.
     * 
     * @param {string} messageId - The unique ID of the message to delete.
     */
    deleteMessage(messageId) {
        this.send('delete_message', { messageId });
    }

    /**
     * Explicitly close the WebSocket connection and clean up.
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    /**
     * Send a direct message to a user in a specific conversation.
     * 
     * @param {string} conversationId - The unique ID of the conversation.
     * @param {string} message - The content of the direct message.
     */
    sendDirectMessage(conversationId, message) {
        this.send('direct_message', { conversationId, message });
    }
}

export const socketService = new ChatSocket();
