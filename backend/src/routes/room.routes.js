import { Router } from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { createRoom, listRooms, getRoomById, deleteRoom, leaveRoom } from '../controllers/room.controller.js';

const router = Router();

// ─── Health check (no auth required) ─────────────────────────────────────────
router.get('/health', (req, res) => {
    res.status(200).json({
        service: 'rooms-service',
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});

// ─── All other room routes require authentication ─────────────────────────────
router.use(authenticate);

router.post('/', createRoom);
router.get('/', listRooms);
router.get('/:id', getRoomById);
router.post('/:id/leave', leaveRoom);
router.delete('/:id', deleteRoom);

export default router;
