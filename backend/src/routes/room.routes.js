import { Router } from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { createRoom, listRooms, getRoomById, deleteRoom, leaveRoom, getRoomMembers, removeMember, blockMember, updateRoomCode, updateRoom } from '../controllers/room.controller.js';

const router = Router();

// ─── Public Room Routes ───────────────────────────────────────────────────────
router.get('/health', (req, res) => {
    res.status(200).json({
        service: 'rooms-service',
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});

// GET /api/rooms/featured — Public list for landing page
import Room from '../models/room.js';
router.get('/featured', async (req, res) => {
    try {
        const rooms = await Room.find({ type: 'public' }, '_id name description members')
            .limit(10)
            .lean();
        // Shuffle and take 3
        const featured = rooms.sort(() => 0.5 - Math.random()).slice(0, 3);
        res.status(200).json({ rooms: featured });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// ─── All other room routes require authentication ─────────────────────────────
router.use(authenticate);

router.post('/', createRoom);
router.get('/', listRooms);
router.get('/:id', getRoomById);
router.get('/:id/members', getRoomMembers);
router.post('/:id/leave', leaveRoom);
router.post('/:id/remove', removeMember);
router.post('/:id/block', blockMember);
router.patch('/:id/code', updateRoomCode);
router.patch('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
