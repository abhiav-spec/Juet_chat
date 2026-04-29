import { removeFromRoom } from '../state/rooms.js';
import { getUserContext, unregisterUser, getUserSockets } from '../state/users.js';
import { broadcastPresence } from '../utils/broadcast.js';

/**
 * Handle WebSocket disconnect.
 * Cleans up all in-memory state for the disconnected client.
 *
 * @param {import('ws').WebSocket} ws
 * @param {import('ws').WebSocketServer} wss
 */
const handleDisconnect = (ws, wss) => {
    const ctx = getUserContext(ws);

    if (ctx) {
        const { userId, currentRoomId } = ctx;
        
        if (currentRoomId) {
            removeFromRoom(currentRoomId, ws);
            console.log(`[WS] User ${userId} left room ${currentRoomId}`);
        }
        
        unregisterUser(ws);
        
        // Check if user has NO more sockets open
        const remainingSockets = getUserSockets(userId);
        if (!remainingSockets || remainingSockets.size === 0) {
            console.log(`[WS] User ${userId} is now offline (last socket closed)`);
            broadcastPresence(wss, userId, 'offline');
        } else {
            console.log(`[WS] User ${userId} disconnected one socket (${remainingSockets.size} remaining)`);
        }
    }
};

export default handleDisconnect;
