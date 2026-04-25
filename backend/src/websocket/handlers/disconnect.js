import { removeFromRoom } from '../state/rooms.js';
import { getUserContext, unregisterUser } from '../state/users.js';
import { broadcastRoomUsers } from '../utils/broadcast.js';

/**
 * Handle WebSocket disconnect.
 * Cleans up all in-memory state for the disconnected client.
 *
 * @param {import('ws').WebSocket} ws
 */
const handleDisconnect = (ws) => {
    const ctx = getUserContext(ws);

    if (ctx) {
        if (ctx.currentRoomId) {
            removeFromRoom(ctx.currentRoomId, ws);
            broadcastRoomUsers(ctx.currentRoomId);
            console.log(`[WS] User ${ctx.userId} left room ${ctx.currentRoomId}`);
        }
        unregisterUser(ws);
        console.log(`[WS] User ${ctx.userId} disconnected`);
    }
};

export default handleDisconnect;
