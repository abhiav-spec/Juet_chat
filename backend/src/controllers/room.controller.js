import crypto from 'crypto';
import Room from '../models/room.js';
import Message from '../models/message.js';
import { ROOM_TYPES, CHAT_HISTORY_LIMIT } from '../utils/constants.js';

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

/**
 * POST /api/rooms/:id/join
 * Join a room. For private rooms, requires a passkey.
 * Adds user to members array on success.
 */
export const joinRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { passkey } = req.body;
        const userId = req.user.id;

        const room = await Room.findById(id).select('+passkey');
        if (!room) return res.status(404).json({ error: 'Room not found.' });

        // Check if already a member or creator
        const isMember = room.members.some(m => m.user.toString() === userId);
        const isCreator = room.creator.toString() === userId;
        
        if (isMember || isCreator) {
            return res.status(200).json({ message: 'Already a member or admin.', room });
        }

        // Private room validation
        if (room.type === ROOM_TYPES.PRIVATE) {
            if (passkey !== room.passkey) {
                return res.status(401).json({ error: 'Invalid passkey.' });
            }
        }

        // Add to members
        room.members.push({ user: userId, isAdmin: false });
        await room.save();

        return res.status(200).json({ message: 'Joined successfully.', room });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/rooms/:id/leave
 * Remove user from room members list.
 */
export const leaveRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const room = await Room.findById(id);
        if (!room) return res.status(404).json({ error: 'Room not found.' });

        // Admins/creators cannot leave their own room via this method in some apps, 
        // but the requirement is to remove from members.
        room.members = room.members.filter(m => m.user.toString() !== userId);
        await room.save();

        return res.status(200).json({ message: 'Left room successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/rooms/:id/members
 * Retrieve list of active members in the room.
 */
export const getRoomMembers = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const room = await Room.findById(id).populate('members.user', 'username');
        if (!room) return res.status(404).json({ error: 'Room not found.' });

        // Access check for private rooms: must be member OR creator
        const isCreator = room.creator.toString() === userId;
        const isMember = room.members.some(m => m.user._id.toString() === userId);
        
        if (room.type === ROOM_TYPES.PRIVATE && !isMember && !isCreator) {
            return res.status(403).json({ error: 'Access denied. You must be a member.' });
        }

        const members = room.members.map(m => ({
            id: m.user._id,
            username: m.user.username,
            isAdmin: m.isAdmin,
            joinedAt: m.joinedAt
        }));

        return res.status(200).json({ members });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/rooms/:id/messages
 * Retrieve chat history for the room.
 */
export const getRoomMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const room = await Room.findById(id);
        if (!room) return res.status(404).json({ error: 'Room not found.' });

        // Private room access check: member or creator
        const isMember = room.members.some(m => m.user.toString() === req.user.id);
        const isCreator = room.creator.toString() === req.user.id;

        if (room.type === ROOM_TYPES.PRIVATE && !isMember && !isCreator) {
            return res.status(403).json({ error: 'Access denied. You must be a member.' });
        }

        const messages = await Message.find({ room: id })
            .sort({ createdAt: -1 })
            .limit(CHAT_HISTORY_LIMIT)
            .populate('sender', 'username')
            .lean();

        return res.status(200).json({ 
            messages: messages.reverse().map(m => ({
                id: m._id,
                sender: m.sender?.username ?? 'Unknown',
                senderId: m.sender?._id,
                content: m.content,
                createdAt: m.createdAt
            }))
        });
    } catch (error) {
        next(error);
    }
};
