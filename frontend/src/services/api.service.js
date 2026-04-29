const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * A generalized fetch wrapper that automatically handles authentication headers
 * and parses JSON responses. Throws formatted errors for non-2xx responses.
 *
 * @param {string} endpoint - The relative API path (e.g., '/api/rooms').
 * @param {RequestInit} [options={}] - Standard fetch options (method, body, headers).
 * @returns {Promise<any>} The parsed JSON response body.
 * @throws {Error} If the response is not OK, with the error message from the backend.
 */
async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        // If 401, token might be expired. Optionally handle logout/refresh here.
        if (response.status === 401) {
            console.error('Session expired or unauthorized');
            // localStorage.removeItem('accessToken');
            // window.location.href = '/login';
        }
        throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
}

export const apiService = {
    // Auth helper
    getToken: () => localStorage.getItem('accessToken'),

    // Rooms
    getRooms: () => fetchWithAuth('/api/rooms'),
    getFeaturedRooms: () => fetchWithAuth('/api/rooms/featured'),
    getRoom: (id) => fetchWithAuth(`/api/rooms/${id}`),
    createRoom: (roomData) => fetchWithAuth('/api/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
    }),

    deleteRoom: (roomId) => fetchWithAuth(`/api/rooms/${roomId}`, {
        method: 'DELETE',
    }),

    leaveRoom: (roomId) => fetchWithAuth(`/api/rooms/${roomId}/leave`, {
        method: 'POST',
    }),

    // User Utils
    getProfile: () => fetchWithAuth('/api/auth/profile'),
    deleteAccount: () => fetchWithAuth('/api/auth/profile', {
        method: 'DELETE',
    }),
    getCurrentUserId: () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (e) {
            return null;
        }
    },

    // Users
    getUsers: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.location) params.append('location', filters.location);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return fetchWithAuth(`/api/users${queryString}`);
    },

    // Direct Messages
    startConversation: (targetUserId) => fetchWithAuth('/api/dms/conversation', {
        method: 'POST',
        body: JSON.stringify({ targetUserId }),
    }),
    getConversations: () => fetchWithAuth('/api/dms/conversations'),
    getDirectMessages: (conversationId, limit = 50) => fetchWithAuth(`/api/dms/messages/${conversationId}?limit=${limit}`),
};
