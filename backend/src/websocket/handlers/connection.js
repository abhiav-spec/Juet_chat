import { registerUser } from '../state/users.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';

/**
 * Called immediately after a new WebSocket connection is authenticated.
 * Registers the user in the in-memory user context map and sends a welcome event.
 *
 * @param {import('ws').WebSocket} ws
 */
const handleConnection = (ws) => {
    console.log(`[WS] User connected: ${ws.user.id}`);
    registerUser(ws, ws.user.id);

    ws.send(
        JSON.stringify({
            event: WS_SERVER_EVENTS.CONNECTED,
            message: 'Connected. Join a room to start chatting.',
            userId: ws.user.id,
        })
    );
};

export default handleConnection;
