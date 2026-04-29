/**
 * In-memory state: per-connection user context.
 *
 * Structure: WeakMap<WebSocket, { userId: string, currentRoomId: string|null }>
 *
 * Using WeakMap so entries are garbage-collected when the ws object is destroyed.
 */

/** @type {WeakMap<import('ws').WebSocket, { userId: string, currentRoomId: string|null }>} */
const userContextMap = new WeakMap();

/**
 * Reverse mapping to find all active sockets for a given user.
 * Structure: Map<string, Set<WebSocket>>
 */
/** @type {Map<string, Set<import('ws').WebSocket>>} */
const userSockets = new Map();

/**
 * Register a user context when they connect.
 * @param {import('ws').WebSocket} ws
 * @param {string} userId
 */
export const registerUser = (ws, userId) => {
    userContextMap.set(ws, { userId, currentRoomId: null });
    
    // Add to reverse map
    if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(ws);
};

/**
 * Get the user context for a given connection.
 * @param {import('ws').WebSocket} ws
 * @returns {{ userId: string, currentRoomId: string|null } | undefined}
 */
export const getUserContext = (ws) => {
    return userContextMap.get(ws);
};

/**
 * Update the room the user is currently in.
 * @param {import('ws').WebSocket} ws
 * @param {string} roomId
 */
export const setUserRoom = (ws, roomId) => {
    const ctx = userContextMap.get(ws);
    if (ctx) ctx.currentRoomId = roomId;
};

/**
 * Get all active sockets for a given user.
 * @param {string} userId
 * @returns {Set<import('ws').WebSocket> | undefined}
 */
export const getUserSockets = (userId) => {
    return userSockets.get(userId);
};

/**
 * Remove user context on disconnect.
 * @param {import('ws').WebSocket} ws
 */
export const unregisterUser = (ws) => {
    const ctx = userContextMap.get(ws);
    if (ctx) {
        const { userId } = ctx;
        const sockets = userSockets.get(userId);
        if (sockets) {
            sockets.delete(ws);
            if (sockets.size === 0) {
                userSockets.delete(userId);
            }
        }
    }
    userContextMap.delete(ws);
};

/**
 * Get all user IDs currently online (at least one active socket).
 * @returns {string[]}
 */
export const getOnlineUserIds = () => {
    return Array.from(userSockets.keys());
};

/**
 * Send a targeted event to all sockets belonging to a specific user.
 * @param {string} userId 
 * @param {string} event 
 * @param {object} payload 
 */
export const notifyUser = (userId, event, payload = {}) => {
    const sockets = userSockets.get(userId);
    if (sockets) {
        const data = JSON.stringify({ type: event, ...payload });
        sockets.forEach(ws => {
            if (ws.readyState === 1) {
                ws.send(data);
            }
        });
    }
};

/**
 * Force disconnect all sockets for a user.
 * @param {string} userId 
 */
export const disconnectUser = (userId) => {
    const sockets = userSockets.get(userId);
    if (sockets) {
        sockets.forEach(ws => {
            ws.close();
        });
    }
};
