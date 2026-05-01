import crypto from 'crypto';
import Room from '../../models/room.js';
import Message from '../../models/message.js';
import { addToRoom, removeFromRoom } from '../state/rooms.js';
import { getUserContext, setUserRoom } from '../state/users.js';
import { WS_SERVER_EVENTS, ROOM_TYPES, CHAT_HISTORY_LIMIT } from '../../utils/constants.js';

/** Send a structured error event to a single client. */
const sendError = (ws, message) => {
    ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message }));
};

/** Hash a plain-text password (same algorithm used in room creation). */
const hashPassword = (password) =>
    crypto.createHash('sha256').update(password).digest('hex');

/**
 * Handle the `join_room` event. Validates the roomId, checks password for private rooms,
 * tracks the user's room state, and sends the chat history back to the client.
 *
 * @param {import('ws').WebSocket} ws - The client WebSocket connection.
 * @param {{ roomId: string, password?: string }} payload - The data containing room ID and optional password.
 */
const handleJoinRoom = async (ws, payload) => {
    try {
        const { roomId, password } = payload || {};

        if (!roomId || typeof roomId !== 'string') {
            return sendError(ws, 'roomId is required.');
        }

        // Fetch room — include passwordHash and blockedUsers
        const room = await Room.findById(roomId).select('+passwordHash +blockedUsers');
        if (!room) {
            return sendError(ws, 'Room not found.');
        }

        // Check if user is blocked
        const userIdStr = ws.user.id.toString();
        if (room.blockedUsers && room.blockedUsers.some(id => id.toString() === userIdStr)) {
            return sendError(ws, 'You are blocked from this room.');
        }

        // ─── Access Control ───────────────────────────────────────────────────
        const isCreator = ws.user.id.toString() === room.creator.toString();
        const isMember = room.members.some(m => m.user.toString() === ws.user.id);

        if (room.type === ROOM_TYPES.PRIVATE && !isCreator && !isMember) {
            if (!password || typeof password !== 'string') {
                return sendError(ws, 'A password is required to join this private room.');
            }
            if (hashPassword(password) !== room.passwordHash) {
                return sendError(ws, 'Incorrect room password.');
            }

            // Successfully entered -> Add to persistent members
            room.members.push({ user: ws.user.id, isAdmin: false });
            await room.save();
        }

        // ─── Leave current room if already in one ─────────────────────────────
        const ctx = getUserContext(ws);
        if (ctx && ctx.currentRoomId && ctx.currentRoomId !== roomId) {
            removeFromRoom(ctx.currentRoomId, ws);
        }

        // ─── Join new room ────────────────────────────────────────────────────
        const roomIdStr = room._id.toString();
        addToRoom(roomIdStr, ws);
        setUserRoom(ws, roomIdStr);

        // ─── Send Chat History (This signals success in the new contract) ──────
        const history = await Message.find({ room: room._id })
            .sort({ createdAt: -1 })
            .limit(CHAT_HISTORY_LIMIT)
            .populate('sender', 'username')
            .lean();

        // Send in chronological order (oldest first)
        ws.send(
            JSON.stringify({
                type: WS_SERVER_EVENTS.HISTORY,
                messages: history.reverse().map((m) => ({
                    id: m._id,
                    sender: m.sender?.username ?? 'Unknown',
                    senderId: m.sender?._id,
                    content: m.content,
                    isDeleted: m.isDeleted || false,
                    createdAt: m.createdAt,
                })),
            })
        );

        console.log(`[WS] User ${ws.user.id} joined room "${room.name}" (${roomIdStr})`);
    } catch (error) {
        console.error('[WS] handleJoinRoom error:', error.message);
        sendError(ws, 'Failed to join room. Please try again.');
    }
};

export default handleJoinRoom;
