import crypto from 'crypto';
import Room from '../models/room.js';
import { ROOM_TYPES } from '../utils/constants.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Safe room projection — never expose passkey by default. */
const safeRoomFields = '_id name creator type createdAt updatedAt members';

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/rooms
 * Create a new public or private room.
 *
 * @param {import('express').Request} req - The Express request object containing the user and room data.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const createRoom = async (req, res, next) => {
    try {
        const { name, type = ROOM_TYPES.PUBLIC, password } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ error: 'Room name must be at least 2 characters.' });
        }

        if (!Object.values(ROOM_TYPES).includes(type)) {
            return res.status(400).json({ error: `Room type must be one of: ${Object.values(ROOM_TYPES).join(', ')}.` });
        }

        if (type === ROOM_TYPES.PRIVATE) {
            if (!password || typeof password !== 'string' || password.length < 4) {
                return res.status(400).json({ error: 'Private rooms require a password (min 4 characters).' });
            }
        }

        const roomData = {
            name: name.trim(),
            creator: req.user.id,
            type,
            members: [{ user: req.user.id, isAdmin: true }],
        };

        if (type === ROOM_TYPES.PRIVATE) {
            roomData.passkey = password;
        }

        const room = await Room.create(roomData);

        // Return without passwordHash
        return res.status(201).json({
            message: 'Room created successfully.',
            room: {
                id: room._id,
                name: room.name,
                type: room.type,
                creator: room.creator,
                createdAt: room.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/rooms
 * Retrieve a list of all chat rooms. Sensitive data like passwordHash is excluded.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const listRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find({}, safeRoomFields)
            .populate('creator', 'username')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({ rooms });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/rooms/:id
 * Retrieve metadata for a single room by its unique ID.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const getRoomById = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id, safeRoomFields)
            .populate('creator', 'username')
            .lean();

        if (!room) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        // ─── ADMIN PRIVILEGE: Creator can see the passkey ─────────────────────
        if (room.creator?._id.toString() === req.user.id && room.type === ROOM_TYPES.PRIVATE) {
            const privateData = await Room.findById(req.params.id).select('passkey').lean();
            room.passkey = privateData.passkey;
        }

        return res.status(200).json({ room });
    } catch (error) {
        next(error);
    }
};
