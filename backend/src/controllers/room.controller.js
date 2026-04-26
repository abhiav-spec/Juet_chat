import crypto from 'crypto';
import Room from '../models/room.js';
import { ROOM_TYPES } from '../utils/constants.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Hash a plain-text password using SHA-256 (same approach as user passwords). */
const hashPassword = (password) =>
    crypto.createHash('sha256').update(password).digest('hex');

/** Safe room projection — never expose passwordHash. */
const safeRoomFields = '_id name creator type description members createdAt updatedAt';

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
        const { name, type = ROOM_TYPES.PUBLIC, password, description } = req.body;

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
            description: description ? description.trim() : `A community for enthusiasts of ${name.trim()}. Join us to discuss and share ideas!`,
            members: [{ user: req.user.id, isAdmin: true }]
        };

        if (type === ROOM_TYPES.PRIVATE) {
            roomData.passwordHash = hashPassword(password);
            roomData.passkey = password; // Save for admin visibility
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
                description: room.description,
                passkey: room.passkey,
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

        // Ensure passkey is NEVER sent in list
        rooms.forEach(r => delete r.passkey);

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
        // Query passkey so we can decide whether to include it
        const room = await Room.findById(req.params.id, safeRoomFields + ' passkey')
            .populate('creator', 'username _id')
            .populate('members.user', 'username')
            .lean();

        if (!room) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        // Only explicitly allow the creator to see the passkey
        if (req.user.id !== room.creator._id.toString()) {
            delete room.passkey;
        }

        return res.status(200).json({ room });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/rooms/:id
 * Delete a chat room. Only the creator is authorized to perform this action.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        // Authorization: Only the creator can delete the room
        if (room.creator.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Only the room creator can delete this room.' });
        }

        await Room.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Room deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/rooms/:id/leave
 * Remove the current user from the room's members list.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const leaveRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        // Admins/Creators should not "leave" using this method (they should delete instead)
        if (room.creator.toString() === req.user.id) {
            return res.status(400).json({ error: 'Admins cannot leave their own room. Use Delete instead.' });
        }

        // Remove user from members array
        room.members = room.members.filter(m => m.user.toString() !== req.user.id);
        await room.save();

        return res.status(200).json({ message: 'You have left the room successfully.' });
    } catch (error) {
        next(error);
    }
};
