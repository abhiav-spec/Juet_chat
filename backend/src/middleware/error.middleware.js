/**
 * Centralised Express error handler.
 * Must be registered AFTER all routes in app.js.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(`[ErrorHandler] ${req.method} ${req.path} →`, err.message);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: 'Validation failed', details: messages });
    }

    // Mongoose duplicate key (e.g. unique room name)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({ error: `${field} already exists.` });
    }

    // JWT errors — shouldn't reach here normally (caught in middleware)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({ error: message });
};

export default errorHandler;
