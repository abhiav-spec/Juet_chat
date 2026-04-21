import { verifyToken } from '../../utils/jwt.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';

/**
 * Authenticate a WebSocket upgrade request.
 *
 * Expects the JWT as a query parameter: ws://host/?token=<jwt>
 *
 * On success:  attaches `ws.user = { id, session_id }` and calls next().
 * On failure:  sends an error event and closes the connection.
 *
 * @param {import('ws').WebSocket} ws
 * @param {import('http').IncomingMessage} req
 * @param {() => void} next
 */
const wsAuth = (ws, req, next) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
            ws.send(JSON.stringify({ event: WS_SERVER_EVENTS.ERROR, message: 'Authentication required. Provide ?token=<jwt>.' }));
            ws.terminate();
            return;
        }

        const decoded = verifyToken(token);
        ws.user = { id: decoded.id, session_id: decoded.session_id };
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? 'Token expired. Please refresh your session.'
            : 'Invalid token.';
        ws.send(JSON.stringify({ event: WS_SERVER_EVENTS.ERROR, message }));
        ws.terminate();
    }
};

export default wsAuth;
