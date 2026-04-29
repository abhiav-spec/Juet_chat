import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import healthRouter from './routes/health.routes.js';
import userRoutes from './routes/user.routes.js';
import dmRoutes from './routes/dm.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173'];

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

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dms', dmRoutes);

// Health routes (must be mounted before error handler, no auth required)
app.use('/', healthRouter);

// Root
app.get('/', (req, res) => {
    res.send('Welcome to the chat application API');
});

// ─── Centralised Error Handler (must be last) ─────────────────────────────────
app.use(errorHandler);

export default app;
