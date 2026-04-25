import { verifyToken } from '../../utils/jwt.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';

/**
 * Authenticate a WebSocket upgrade request.
 */
const wsAuth = (ws, req, next) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
            ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message: 'Authentication required.' }));
            ws.terminate();
            return;
        }

        const decoded = verifyToken(token);
        ws.user = { id: decoded.id, session_id: decoded.session_id };
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? 'Token expired.'
            : 'Invalid token.';
        ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message }));
        ws.terminate();
    }
};

export default wsAuth;
