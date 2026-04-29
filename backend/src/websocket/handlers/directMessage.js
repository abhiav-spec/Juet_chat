import Conversation from '../../models/Conversation.js';
import DirectMessage from '../../models/DirectMessage.js';
import { getUserContext, getUserSockets } from '../state/users.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';

/**
 * Handle incoming direct messages.
 * Payload format: { conversationId, message }
 *
 * @param {import('ws').WebSocket} ws
 * @param {Object} payload
 */
const handleDirectMessage = async (ws, payload) => {
    const ctx = getUserContext(ws);
    if (!ctx) return;

    const { userId } = ctx;
    const { conversationId, message } = payload;

    if (!conversationId || !message || typeof message !== 'string') {
        ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message: 'Invalid payload' }));
        return;
    }

    try {
        // Verify conversation exists and user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message: 'Conversation not found' }));
            return;
        }

        if (!conversation.participants.includes(userId)) {
            ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message: 'Not a participant in this conversation' }));
            return;
        }

        // Save message to database
        const dm = await DirectMessage.create({
            conversationId,
            senderId: userId,
            content: message
        });

        const responsePayload = JSON.stringify({
            type: WS_SERVER_EVENTS.DIRECT_MESSAGE,
            data: {
                _id: dm._id,
                conversationId: dm.conversationId,
                senderId: dm.senderId,
                content: dm.content,
                createdAt: dm.createdAt
            }
        });

        // Determine the other participant(s)
        const receivers = conversation.participants.filter(p => p.toString() !== userId.toString());

        // Push to all active sockets of the receivers
        for (const receiverId of receivers) {
            const receiverSockets = getUserSockets(receiverId.toString());
            if (receiverSockets) {
                for (const clientWs of receiverSockets) {
                    if (clientWs.readyState === 1) { // WebSocket.OPEN
                        clientWs.send(responsePayload);
                    }
                }
            }
        }

        // Also push back to all sockets of the sender (to sync tabs)
        const senderSockets = getUserSockets(userId.toString());
        if (senderSockets) {
            for (const clientWs of senderSockets) {
                if (clientWs.readyState === 1) {
                    clientWs.send(responsePayload);
                }
            }
        }

    } catch (error) {
        console.error(`[WS] Error sending direct message from user ${userId}:`, error.message);
        ws.send(JSON.stringify({ type: WS_SERVER_EVENTS.ERROR, message: 'Failed to send direct message' }));
    }
};

export default handleDirectMessage;
