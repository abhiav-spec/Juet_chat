import config from './config/configure.js';
import app from './app.js';
import connectDB from './config/db.js';
import { createServer } from 'http';
import createWebSocketServer from './websocket/socket.server.js';

const startServer = async () => {
    try {
        await connectDB();

        // Create a raw HTTP server from the Express app so that WS
        // and HTTP can share the same port.
        const httpServer = createServer(app);

        // Attach the WebSocket server to the same HTTP server
        createWebSocketServer(httpServer, app);

        httpServer.listen(config.PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${config.PORT}`);
            console.log(`HTTP: http://localhost:${config.PORT}`);
            console.log(`WebSocket: ws://localhost:${config.PORT}?token=<jwt>`);
            console.log(`Health: http://localhost:${config.PORT}/health`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
