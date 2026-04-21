/**
 * In-memory state: active connections per room.
 *
 * Structure: Map<roomId: string, Set<WebSocket>>
 *
 * This is NEVER persisted to MongoDB.
 * It is rebuilt from scratch on every server start.
 */

/** @type {Map<string, Set<import('ws').WebSocket>>} */
const roomConnections = new Map();

/**
 * Add a WebSocket connection to a room.
 * @param {string} roomId
 * @param {import('ws').WebSocket} ws
 */
export const addToRoom = (roomId, ws) => {
    if (!roomConnections.has(roomId)) {
        roomConnections.set(roomId, new Set());
    }
    roomConnections.get(roomId).add(ws);
};

/**
 * Remove a WebSocket connection from a room.
 * Deletes the room entry if it becomes empty.
 * @param {string} roomId
 * @param {import('ws').WebSocket} ws
 */
export const removeFromRoom = (roomId, ws) => {
    const clients = roomConnections.get(roomId);
    if (!clients) return;
    clients.delete(ws);
    if (clients.size === 0) {
        roomConnections.delete(roomId);
    }
};

/**
 * Get all active WebSocket clients in a room.
 * @param {string} roomId
 * @returns {Set<import('ws').WebSocket>}
 */
export const getRoomClients = (roomId) => {
    return roomConnections.get(roomId) || new Set();
};

/**
 * Total number of active connections across all rooms.
 * @returns {number}
 */
export const getTotalConnections = () => {
    let count = 0;
    for (const clients of roomConnections.values()) {
        count += clients.size;
    }
    return count;
};
