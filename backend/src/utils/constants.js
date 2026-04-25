// WebSocket event names — client sends these
export const WS_EVENTS = {
    JOIN: 'join',
    MESSAGE: 'message',
};

// WebSocket event names — server sends these
export const WS_SERVER_EVENTS = {
    HISTORY: 'history',
    MESSAGE: 'message',
    ERROR: 'error',
};

// Room types
export const ROOM_TYPES = {
    PUBLIC: 'public',
    PRIVATE: 'private',
};

// Chat history — number of messages to send on join
export const CHAT_HISTORY_LIMIT = 50;
