import { verifyToken, extractBearerToken } from '../utils/jwt.js';

/**
 * Express middleware — authenticates requests using JWT Bearer tokens.
 * Attaches `req.user = { id, session_id }` on success.
 */
const authenticate = (req, res, next) => {
    try {
        const token = extractBearerToken(req.headers['authorization']);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required. Provide a Bearer token.' });
        }

        const decoded = verifyToken(token);
        req.user = { id: decoded.id, session_id: decoded.session_id };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please refresh your session.' });
        }
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

export default authenticate;
