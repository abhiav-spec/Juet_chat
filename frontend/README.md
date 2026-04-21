# The Cinematic Stream - Frontend

Welcome to the frontend of **The Cinematic Stream**, a modern, premium real-time chat application. This project is built with a focus on immersive aesthetics, smooth transitions, and high-performance real-time communication.

## 🚀 Technology Stack

- **Core**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`, `useMemo`)
- **Real-Time**: Native WebSockets (`ws` protocol)
- **Styling**: Vanilla CSS with modern utility patterns (Glassmorphism, CSS Variables, Cinematic Gradients)
- **Icons**: [Google Material Symbols](https://fonts.google.com/icons)

## 📂 Folder Structure

```text
frontend/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── assets/             # Images and local branding assets
│   ├── services/           # Backend communication layer
│   │   ├── api.service.js  # REST API wrapper (Auth, Rooms)
│   │   └── socket.service.js # WebSocket event manager
│   ├── pages/              # UI Page Components
│   │   ├── LandingPage      # Cinematic entry point
│   │   ├── SignupPage       # User registration
│   │   ├── VerifyEmailPage  # OTP verification flow
│   │   ├── LoginPage        # Secure authentication
│   │   ├── DashboardPage    # Room discovery and management
│   │   ├── CreateChatroomPage # New space configuration
│   │   └── ChatRoomPage     # Real-time messaging interface
│   ├── App.jsx             # Main router & Protected Route logic
│   ├── main.jsx            # React entry point
│   ├── index.css           # Global typography & reset
│   └── App.css             # Main theme variables & layouts
├── .env                    # Environment variables (API/WS URLs)
├── package.json            # Dependencies & scripts
└── vite.config.js          # Vite configuration
```

## 🛠️ Key Components & Services

### Service Layer (The Engine)
We use a dedicated service layer to keep UI components decoupled from backend logic:

*   **`api.service.js`**: Automatically attaches the JWT `accessToken` from localStorage to all requests. It handles room fetching, creation, and profile management.
*   **`socket.service.js`**: A class-based manager that handles the WebSocket handshake, event registration (`on`), and messaging (`send`).

### Protected Routes
The application implements security at the routing level. Internal pages (Dashboard, Chat, Create Room) are wrapped in a `ProtectedRoute` component that validates the user session before rendering, redirecting guests to the login page.

### Cinematic UI Logic
*   **Glassmorphism**: High blur gradients and semi-transparent layers used extensively across the chat and dashboard.
*   **Real-time Handlers**: The `ChatRoomPage` uses `useEffect` to manage complex socket lifecycles, ensuring connections are cleaned up on unmount.
*   **Password Modal**: A tailored UX for private rooms that prompts for an access code only when required by the backend.

## 🚦 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    VITE_API_BASE_URL=http://localhost:3000
    VITE_WS_URL=ws://localhost:3000
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

---
*Created with ❤️ for The Cinematic Stream Community.*
