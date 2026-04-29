// WebSocket event names — client sends these
export const WS_EVENTS = {
    JOIN: 'join',
    MESSAGE: 'message',
    DELETE_MESSAGE: 'delete_message',
    DIRECT_MESSAGE: 'direct_message',
};

// WebSocket event names — server sends these
export const WS_SERVER_EVENTS = {
    HISTORY: 'history',
    MESSAGE: 'message',
    MESSAGE_DELETED: 'message_deleted',
    DIRECT_MESSAGE: 'direct_message',
    ERROR: 'error',
    PRESENCE: 'presence',
    ONLINE_USERS: 'online_users',
    KICKED: 'kicked',
    BLOCKED: 'blocked',
};

// Room types
export const ROOM_TYPES = {
    PUBLIC: 'public',
    PRIVATE: 'private',
};

// Chat history — number of messages to send on join
export const CHAT_HISTORY_LIMIT = 50;
