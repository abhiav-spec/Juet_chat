import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token
 * @returns {{ id: string, session_id: string }}
 * @throws {Error} if token is invalid or expired
 */
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Extracts a Bearer token from an Authorization header value.
 * @param {string|undefined} authHeader
 * @returns {string|null}
 */
export const extractBearerToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.slice(7);
};
