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
    getRoom: (id) => fetchWithAuth(`/api/rooms/${id}`),
    createRoom: (roomData) => fetchWithAuth('/api/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
    }),
};
