import { getRoomClients } from '../state/rooms.js';
import { WS_SERVER_EVENTS } from '../../utils/constants.js';

/**
 * Broadcast the list of active users in a specific room to all clients in that room.
 * 
 * @param {string} roomId - The ID of the room to broadcast to.
 */
export const broadcastRoomUsers = (roomId) => {
    const clients = getRoomClients(roomId);
    
    // Group users by ID to handle multiple connections from same user
    const userMap = new Map();
    for (const client of clients) {
        if (client.readyState === 1 /* WebSocket.OPEN */ && client.user) {
            userMap.set(client.user.id, {
                id: client.user.id,
                username: client.user.username
            });
        }
    }

    const members = Array.from(userMap.values());
    const payload = JSON.stringify({
        type: WS_SERVER_EVENTS.ROOM_USERS,
        roomId,
        members
    });

    for (const client of clients) {
        if (client.readyState === 1) {
            client.send(payload);
        }
    }
};
