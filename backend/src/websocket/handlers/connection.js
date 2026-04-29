import { registerUser, getUserSockets, getOnlineUserIds } from '../state/users.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';
import { broadcastPresence } from '../utils/broadcast.js';

/**
 * Called immediately after a new WebSocket connection is authenticated.
 * Registers the user in the in-memory user context map and sends a welcome event.
 *
 * @param {import('ws').WebSocket} ws
 * @param {import('ws').WebSocketServer} wss
 */
const handleConnection = (ws, wss) => {
    const userId = ws.user.id;
    const isFirstConnection = !getUserSockets(userId) || getUserSockets(userId).size === 0;

    console.log(`[WS] User connected: ${userId} (First: ${isFirstConnection})`);
    registerUser(ws, userId);

    // 1. Send welcome message
    ws.send(
        JSON.stringify({
            event: WS_SERVER_EVENTS.CONNECTED,
            message: 'Connected. Join a room to start chatting.',
            userId: userId,
        })
    );

    // 2. Send current online users to this new connection
    ws.send(
        JSON.stringify({
            event: WS_SERVER_EVENTS.ONLINE_USERS,
            users: getOnlineUserIds(),
        })
    );

    // 3. Notify others if this is a fresh online status
    if (isFirstConnection) {
        broadcastPresence(wss, userId, 'online');
    }
};

export default handleConnection;
