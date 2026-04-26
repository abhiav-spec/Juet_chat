import { WebSocketServer } from 'ws';
import wsAuth from './middleware/wsAuth.js';
import handleConnection from './handlers/connection.js';
import handleJoinRoom from './handlers/room.js';
import handleSendMessage from './handlers/message.js';
import handleDeleteMessage from './handlers/delete.js';
import handleDisconnect from './handlers/disconnect.js';
import { WS_EVENTS } from '../utils/constants.js';
import { getTotalConnections } from './state/rooms.js';

/**
 * Create and attach a WebSocket server to the existing HTTP server.
 *
 * @param {import('http').Server} httpServer - The HTTP server created from the Express app.
 * @param {import('express').Application} app - The Express app (used to expose WS state).
 * @returns {import('ws').WebSocketServer}
 */
const createWebSocketServer = (httpServer, app) => {
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (ws, req) => {
        // ─── 1. Authenticate ──────────────────────────────────────────────────
        wsAuth(ws, req, () => {
            // ─── 2. Register user context ─────────────────────────────────────
            handleConnection(ws);

            // ─── 3. Route incoming messages ───────────────────────────────────
            ws.on('message', (rawData) => {
                let parsed;
                try {
                    parsed = JSON.parse(rawData.toString());
                } catch (e) {
                    return;
                }

                const { type, ...payload } = parsed;

                switch (type) {
                    case WS_EVENTS.JOIN:
                        handleJoinRoom(ws, payload);
                        break;
                    case WS_EVENTS.MESSAGE:
                        handleSendMessage(ws, payload);
                        break;
                    case WS_EVENTS.DELETE_MESSAGE:
                        handleDeleteMessage(ws, payload);
                        break;
                    default:
                        // Ignore unknown events
                        break;
                }
            });

            // ─── 4. Handle disconnect ─────────────────────────────────────────
            ws.on('close', () => handleDisconnect(ws));

            // ─── 5. Handle connection-level errors ────────────────────────────
            ws.on('error', (err) => {
                console.error(`[WS] Socket error for user ${ws.user?.id}:`, err.message);
                handleDisconnect(ws);
            });
        });
    });

    // Expose total connection count for the health route
    if (app) {
        setInterval(() => {
            app.set('wsState', { totalConnections: getTotalConnections() });
        }, 5000);
    }

    console.log('[WS] WebSocket server attached and ready.');
    return wss;
};

export default createWebSocketServer;
