import { WS_SERVER_EVENTS } from '../../utils/constants.js';

/**
 * Broadcast a message to all connected clients.
 * @param {import('ws').WebSocketServer} wss 
 * @param {object} data 
 */
export const broadcastToAll = (wss, data) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
            client.send(payload);
        }
    });
};

/**
 * Broadcast a user's presence update to everyone.
 * @param {import('ws').WebSocketServer} wss 
 * @param {string} userId 
 * @param {'online' | 'offline'} status 
 */
export const broadcastPresence = (wss, userId, status) => {
    broadcastToAll(wss, {
        event: WS_SERVER_EVENTS.PRESENCE,
        userId,
        status
    });
};

/**
 * Send a targeted event to all sockets belonging to a specific user.
 * @param {string} userId 
 * @param {string} event 
 * @param {object} payload 
 */
export const notifyUser = (userId, event, payload = {}) => {
    // Note: We'll import this dynamically or handle it carefully to avoid circular deps
    // Actually, it's better to pass the sockets or a getter.
    // For now, let's assume we can get it.
};
