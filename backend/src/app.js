import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import healthRouter from './routes/health.routes.js';
import userRoutes from './routes/user.routes.js';
import dmRoutes from './routes/dm.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

const defaultOrigins = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'https://bol-chal.netlify.app',
];
const envOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

if (process.env.TRUST_PROXY === '1' || process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// ─── Serve Static Frontend Files ──────────────────────────────────────────────
app.use(express.static(publicDir));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dms', dmRoutes);

// Health routes (must be mounted before error handler, no auth required)
app.use('/api', healthRouter);

// ─── SPA Fallback - Serve index.html for all non-API GET routes ───────────────
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        next();
        return;
    }

    if (req.path.startsWith('/api/')) {
        next();
        return;
    }

    if (path.extname(req.path)) {
        next();
        return;
    }

    if (!req.accepts('html')) {
        next();
        return;
    }

    res.sendFile(path.join(publicDir, 'index.html'));
});

// ─── Centralised Error Handler (must be last) ─────────────────────────────────
app.use(errorHandler);

export default app;
