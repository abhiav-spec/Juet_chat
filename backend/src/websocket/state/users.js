/**
 * In-memory state: per-connection user context.
 *
 * Structure: WeakMap<WebSocket, { userId: string, currentRoomId: string|null }>
 *
 * Using WeakMap so entries are garbage-collected when the ws object is destroyed.
 */

/** @type {Map<import('ws').WebSocket, { userId: string, currentRoomId: string|null }>} */
const userContextMap = new Map();

/**
 * Register a user context when they connect.
 * @param {import('ws').WebSocket} ws
 * @param {string} userId
 */
export const registerUser = (ws, userId) => {
    userContextMap.set(ws, { userId, currentRoomId: null });
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
 * Remove user context on disconnect.
 * @param {import('ws').WebSocket} ws
 */
export const unregisterUser = (ws) => {
    userContextMap.delete(ws);
};

/**
 * Get unique online user IDs.
 * @returns {string[]}
 */
export const getOnlineUserIds = () => {
    const userIds = new Set();
    for (const ctx of userContextMap.values()) {
        userIds.add(ctx.userId);
    }
    return Array.from(userIds);
};
