import crypto from 'crypto';
import Room from '../models/Room.js';
import Message from '../models/message.js';
import { ROOM_TYPES, WS_SERVER_EVENTS } from '../utils/constants.js';
import { notifyUser } from '../websocket/state/users.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Hash a plain-text password using SHA-256 (same approach as user passwords). */
const hashPassword = (password) =>
    crypto.createHash('sha256').update(password).digest('hex');

/** Safe room projection — never expose passwordHash. */
const safeRoomFields = '_id name creator type description members passkey createdAt updatedAt';

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

        // Only allow creators to see their own room's passkey
        rooms.forEach(r => {
            if (r.creator?._id?.toString() !== req.user.id && r.creator?.toString() !== req.user.id) {
                delete r.passkey;
            }
        });

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

        // Cascading delete: Remove all messages associated with this room
        await Message.deleteMany({ room: req.params.id });
        
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

/**
 * GET /api/rooms/:id/members
 * Retrieve a list of all members in a room.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const getRoomMembers = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('members.user', 'username email gender location about')
            .lean();

        if (!room) {
            return res.status(404).json({ error: 'Room not found.' });
        }

        const members = room.members.map(m => ({
            userId: m.user._id,
            username: m.user.username,
            isAdmin: m.isAdmin,
            joinedAt: m.joinedAt
        }));

        return res.status(200).json(members);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/rooms/:id/remove
 * Kick a user from the room (Admin only).
 */
export const removeMember = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);

        if (!room) return res.status(404).json({ error: 'Room not found.' });
        if (room.creator.toString() !== req.user.id) return res.status(403).json({ error: 'Only admin can remove members.' });
        if (userId === req.user.id) return res.status(400).json({ error: 'You cannot remove yourself.' });

        room.members = room.members.filter(m => m.user.toString() !== userId);
        await room.save();

        // Notify user via WebSocket
        notifyUser(userId, WS_SERVER_EVENTS.KICKED, { roomId: room._id, roomName: room.name });

        return res.status(200).json({ message: 'User removed successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/rooms/:id/block
 * Block a user from the room (Admin only).
 */
export const blockMember = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);

        if (!room) return res.status(404).json({ error: 'Room not found.' });
        if (room.creator.toString() !== req.user.id) return res.status(403).json({ error: 'Only admin can block members.' });
        if (userId === req.user.id) return res.status(400).json({ error: 'You cannot block yourself.' });

        // Remove from members
        room.members = room.members.filter(m => m.user.toString() !== userId);
        
        // Add to blockedUsers if not already there
        if (!room.blockedUsers.includes(userId)) {
            room.blockedUsers.push(userId);
        }
        
        await room.save();

        // Notify user via WebSocket
        notifyUser(userId, WS_SERVER_EVENTS.BLOCKED, { roomId: room._id, roomName: room.name });

        return res.status(200).json({ message: 'User blocked successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/rooms/:id/code
 * Update room code/passkey (Admin only).
 */
export const updateRoomCode = async (req, res, next) => {
    try {
        const { roomCode } = req.body;
        const room = await Room.findById(req.params.id);

        if (!room) return res.status(404).json({ error: 'Room not found.' });
        if (room.creator.toString() !== req.user.id) return res.status(403).json({ error: 'Only admin can update the code.' });

        if (!roomCode || roomCode.length < 4) {
            return res.status(400).json({ error: 'Room code must be at least 4 characters.' });
        }

        room.passkey = roomCode;
        room.passwordHash = hashPassword(roomCode);

        await room.save();

        return res.status(200).json({ message: 'Room code updated successfully.', roomCode });
    } catch (error) {
        next(error);
    }
};
