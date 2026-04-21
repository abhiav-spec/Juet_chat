import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

const buildHealthResponse = (service, extra = {}) => ({
    service,
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    ...extra,
});

/**
 * GET /health  (mounted at / in app.js → resolves to /health)
 * Top-level server health — no auth required.
 */
router.get('/health', (req, res) => {
    res.status(200).json(buildHealthResponse('chat-server'));
});

/**
 * GET /api/health
 * API layer health — mounted separately in app.js.
 */
router.get('/api/health', (req, res) => {
    res.status(200).json(buildHealthResponse('api'));
});

/**
 * GET /api/auth/health
 * Auth service health.
 */
router.get('/api/auth/health', (req, res) => {
    res.status(200).json(buildHealthResponse('auth-service'));
});


/**
 * GET /api/ws/health
 * WebSocket layer health with active connection count.
 */
router.get('/api/ws/health', (req, res) => {
    const wsState = req.app.get('wsState') || {};
    const totalConnections = wsState.totalConnections ?? 0;
    res.status(200).json(buildHealthResponse('websocket-service', { activeConnections: totalConnections }));
});

export default router;
