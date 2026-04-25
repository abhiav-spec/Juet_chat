import crypto from 'crypto';
import Room from '../../models/Room.js';
import Message from '../../models/Message.js';
import { addToRoom, removeFromRoom } from '../state/rooms.js';
import { getUserContext, setUserRoom } from '../state/users.js';
import { broadcastRoomUsers } from '../utils/broadcast.js';
import { WS_SERVER_EVENTS, ROOM_TYPES, CHAT_HISTORY_LIMIT } from '../../utils/constants.js';

/** Send a structured error event to a single client. */
const sendError = (ws, message) => {
    ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message }));
};

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

        // Fetch room — include passkey only if needed for comparison
        const room = await Room.findById(roomId).select('+passkey');
        if (!room) {
            return sendError(ws, 'Room not found.');
        }

        // ─── Access Control ───────────────────────────────────────────────────
        const isCreator = room.creator.toString() === ws.user.id;

        if (room.type === ROOM_TYPES.PRIVATE && !isCreator) {
            if (!password || typeof password !== 'string') {
                return sendError(ws, 'A passkey is required to join this private room.');
            }
            if (password !== room.passkey) {
                return sendError(ws, 'Incorrect room passkey.');
            }
        }

        // ─── Leave current room if already in one ─────────────────────────────
        const ctx = getUserContext(ws);
        const oldRoomId = ctx?.currentRoomId;
        if (oldRoomId && oldRoomId !== roomId) {
            removeFromRoom(oldRoomId, ws);
            broadcastRoomUsers(oldRoomId);
        }

        // ─── Join new room ────────────────────────────────────────────────────
        const roomIdStr = room._id.toString();
        addToRoom(roomIdStr, ws);
        setUserRoom(ws, roomIdStr);
        broadcastRoomUsers(roomIdStr);

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
