import Message from '../../models/message.js';
import { getRoomClients } from '../state/rooms.js';
import { getUserContext } from '../state/users.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';

/** Send a structured error event to a single client. */
const sendError = (ws, message) => {
    ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message }));
};

/**
 * Handle the `send_message` event. Validates content, verifies room membership,
 * persists the message to MongoDB, and broadcasts it to all active clients in the room.
 *
 * @param {import('ws').WebSocket} ws - The client WebSocket connection.
 * @param {{ content: string }} payload - The data containing the message text content.
 */
const handleSendMessage = async (ws, payload) => {
    try {
        const { content } = payload || {};

        // ─── Validate input ───────────────────────────────────────────────────
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return sendError(ws, 'Message content cannot be empty.');
        }
        if (content.trim().length > 4000) {
            return sendError(ws, 'Message cannot exceed 4000 characters.');
        }

        // ─── Verify the user is in a room ─────────────────────────────────────
        const ctx = getUserContext(ws);
        if (!ctx || !ctx.currentRoomId) {
            return sendError(ws, 'You must join a room before sending messages.');
        }

        // ─── SENDER IDENTITY ALWAYS COMES FROM SERVER (never trust client) ─────
        const senderId = ws.user.id;
        const roomId = ctx.currentRoomId;

        // ─── 1. PERSIST TO DATABASE (Wait for confirmation) ─────────────────
        const message = await Message.create({
            room: roomId,
            sender: senderId,
            content: content.trim(),
        });

        // Ensure we have the latest sender info for the UI
        await message.populate('sender', 'username');

        // ─── 2. BROADCAST TO ROOM ────────────────────────────────────────────
        const outboundPayload = JSON.stringify({
            type: WS_SERVER_EVENTS.MESSAGE,
            message: message.content,
            sender: message.sender?.username ?? 'Unknown',
            senderId: message.sender?._id, // Add this for precise alignment
            createdAt: message.createdAt,
            id: message._id,
        });

        const clients = getRoomClients(roomId);
        for (const client of clients) {
            if (client.readyState === 1 /* WebSocket.OPEN */) {
                client.send(outboundPayload);
            }
        }

        console.log(`[WS] Message from ${message.sender?.username} in ${roomId}`);
    } catch (error) {
        console.error('[WS] handleSendMessage error:', error.message);
        sendError(ws, 'Failed to send message. Please try again.');
    }
};

export default handleSendMessage;
