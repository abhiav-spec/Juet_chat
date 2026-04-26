import Message from '../../models/message.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';
import { getRoomClients } from '../state/rooms.js';
import { getUserContext } from '../state/users.js';

/**
 * Handle a message deletion request.
 * 
 * @param {import('ws').WebSocket} ws - The sender's WebSocket
 * @param {Object} payload - The message payload
 * @param {string} payload.messageId - The ID of the message to delete
 */
const handleDeleteMessage = async (ws, payload) => {
    try {
        const { messageId } = payload;
        
        if (!messageId) return;

        // ─── 1. FETCH MESSAGE & VERIFY OWNERSHIP ───────────────────────────
        const message = await Message.findById(messageId);

        if (!message) {
            return;
        }

        // Backend enforcement: ONLY the sender can delete their own message
        if (message.sender.toString() !== ws.user.id.toString()) {
            console.warn(`[WS] Unauthorized delete attempt by ${ws.user.id} on message ${messageId}`);
            return;
        }

        // ─── 2. PERFORM SOFT DELETE ───────────────────────────────────────
        message.isDeleted = true;
        message.content = 'This message was deleted'; 
        await message.save();

        // ─── 3. BROADCAST DELETION TO ALL CLIENTS IN ROOM ──────────────────
        const outboundPayload = JSON.stringify({
            type: WS_SERVER_EVENTS.MESSAGE_DELETED,
            messageId: message._id,
            roomId: message.room
        });

        const clients = getRoomClients(message.room.toString());
        for (const client of clients) {
            if (client.readyState === 1 /* OPEN */) {
                client.send(outboundPayload);
            }
        }

        console.log(`[WS] Message ${messageId} deleted by ${ws.user.id}`);
    } catch (error) {
        console.error('[WS] handleDeleteMessage error:', error.message);
    }
};

export default handleDeleteMessage;
