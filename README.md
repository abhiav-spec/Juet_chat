# BolChal - Real-Time Chat Application

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg) ![Express](https://img.shields.io/badge/Express.js-API-lightgrey.svg) ![WebSocket](https://img.shields.io/badge/WebSocket-ws-blue.svg) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg) ![React](https://img.shields.io/badge/React-19-blue.svg) ![Vite](https://img.shields.io/badge/Vite-Frontend-purple.svg)

BolChal is a full-stack real-time messaging platform built with React, Vite, Node.js, Express, MongoDB, Mongoose, JWT authentication, and native WebSockets using the `ws` package. It supports user registration with email OTP verification, login, protected dashboard pages, public and private chat rooms, room administration, direct messages, online presence, message history, and real-time message delivery.

The main idea behind this project is simple: REST APIs handle durable business operations such as authentication, user profiles, rooms, and conversation history, while WebSockets handle live communication such as joining rooms, sending messages, direct messages, message deletion, and presence updates.

## Table of Contents

- [Project Summary](#project-summary)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [How The Application Works](#how-the-application-works)
- [Authentication Flow](#authentication-flow)
- [Room Chat Flow](#room-chat-flow)
- [Direct Message Flow](#direct-message-flow)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [API Reference](#api-reference)
- [WebSocket Events](#websocket-events)
- [Database Models](#database-models)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Running The Project](#running-the-project)
- [Interview Revision Notes](#interview-revision-notes)
- [Possible Improvements](#possible-improvements)
- [License](#license)

## Project Summary

BolChal is designed like a modern chat product. A user can create an account, verify email with OTP, log in, browse rooms, create public or private rooms, join rooms, chat in real time, manage room members, and send direct messages to other users.

For interview revision, explain the project in one line like this:

> BolChal is a MERN-style real-time chat application where Express REST APIs manage authentication and persisted resources, MongoDB stores users, rooms, sessions, and messages, and WebSockets provide instant room messaging, direct messaging, and presence updates.

## Tech Stack

### Frontend

- **React 19**: Component-based UI.
- **Vite**: Fast frontend dev server and build tool.
- **React Router**: Client-side routing and protected pages.
- **Vanilla CSS / app styles**: Main UI styling in `App.css` and `index.css`.
- **Native WebSocket client**: Connects to the backend WebSocket server using a JWT token.
- **LocalStorage**: Stores the access token used by API and WebSocket requests.

### Backend

- **Node.js**: JavaScript runtime for the server.
- **Express.js**: REST API routing and middleware.
- **MongoDB**: NoSQL database for users, rooms, sessions, messages, OTPs, and conversations.
- **Mongoose**: Schema modeling and database queries.
- **JWT**: Access token and refresh token based authentication.
- **HTTP-only cookies**: Store refresh token securely.
- **ws**: WebSocket server for real-time communication.
- **Nodemailer**: Sends OTP emails for email verification.
- **Morgan, CORS, cookie-parser, dotenv**: Logging, cross-origin access, cookie parsing, and environment configuration.

## Core Features

### Authentication

- Register with username, email, password, gender, location, and about text.
- Passwords are hashed before storage.
- OTP is generated and sent by email for verification.
- Login returns a JWT access token.
- Refresh token is stored as an HTTP-only cookie.
- Session records store hashed refresh tokens for logout and logout-all flows.
- Protected backend routes validate JWT through auth middleware.
- Protected frontend routes redirect unauthenticated users to login.

### Chat Rooms

- Users can create public and private rooms.
- Private rooms require a passkey.
- Room creator becomes admin automatically.
- Admin can delete the room.
- Admin can remove or block members.
- Admin can update room details and room passkey.
- Members can leave rooms.
- Public featured rooms are visible on the landing page.

### Real-Time Messaging

- WebSocket connection is authenticated using the JWT token.
- Users join rooms through WebSocket events.
- Server sends recent message history after joining a room.
- Messages are broadcast instantly to connected room members.
- Messages are stored in MongoDB for persistence.
- Message deletion is broadcast in real time.
- Online/offline presence is tracked.

### Direct Messages

- Users can view other users with filters.
- Users can start or reuse a conversation with another user.
- Conversation history is loaded from the REST API.
- New direct messages are sent over WebSocket.
- Conversations and direct messages are stored in MongoDB.

## Architecture

```text
Frontend (React + Vite)
        |
        | REST API calls with Authorization: Bearer <token>
        v
Backend (Express API) -----> MongoDB (Mongoose models)
        ^
        | WebSocket connection: ws://localhost:3000?token=<jwt>
        |
Frontend WebSocket Client
```

The application uses a hybrid communication model:

- **REST APIs** are used for request-response operations: register, login, profile, room CRUD, user list, conversations, and message history.
- **WebSockets** are used for real-time operations: room join, room message, direct message, message deletion, presence, kicked, and blocked notifications.
- **MongoDB** stores the final state so data remains available after refresh or reconnect.

## How The Application Works

1. User opens the React app.
2. Public routes such as landing, signup, login, terms, privacy, and support are available without login.
3. After login, the frontend stores `accessToken` in localStorage.
4. Protected routes check for `accessToken`.
5. API calls use `Authorization: Bearer <token>`.
6. Chat pages open a WebSocket connection with the token in the query string.
7. Backend verifies the token before accepting WebSocket messages.
8. Room messages and direct messages are delivered instantly over WebSocket.
9. MongoDB stores users, rooms, messages, conversations, OTPs, and sessions.

## Authentication Flow

```text
Signup form
   -> POST /api/auth/register
   -> Backend hashes password
   -> Backend creates user
   -> Backend creates refresh-token session
   -> Backend generates OTP
   -> Backend sends OTP email
   -> Frontend moves user to verification flow

Verify email
   -> POST /api/auth/verify-email
   -> Backend checks OTP hash
   -> User becomes verified

Login
   -> POST /api/auth/login
   -> Backend validates credentials
   -> Backend returns accessToken
   -> Frontend stores accessToken
   -> Protected routes become accessible
```

Important interview point: access tokens are used for API authorization and WebSocket authentication, while refresh tokens are stored in cookies and tracked using server-side session records.

## Room Chat Flow

```text
User opens /chat/:roomId
   -> Frontend loads room data through REST API
   -> Frontend connects to WebSocket with JWT
   -> Frontend sends { type: "join", roomId, password? }
   -> Backend validates room access
   -> Backend adds user to room state
   -> Backend sends last 50 messages
   -> User sends { type: "message", content }
   -> Backend broadcasts message to room
   -> Backend stores message in MongoDB
```

This design gives fast user experience because the message is broadcast through WebSocket immediately, while persistence is handled by the backend.

## Direct Message Flow

```text
User opens direct messages page
   -> GET /api/users
   -> POST /api/dms/conversation
   -> GET /api/dms/messages/:conversationId
   -> WebSocket sends { type: "direct_message", conversationId, message }
   -> Backend stores message
   -> Backend notifies the receiver if online
```

Direct messaging is separated from room messaging by using `Conversation` and `DirectMessage` models.

## Backend Overview

The backend starts from `backend/src/server.js`.

1. Loads environment configuration.
2. Connects to MongoDB using `connectDB()`.
3. Creates an HTTP server from the Express app.
4. Attaches the WebSocket server to the same HTTP server.
5. Starts listening on `PORT`.

Main backend responsibilities:

- Configure Express middleware in `app.js`.
- Mount API routes under `/api/auth`, `/api/rooms`, `/api/users`, and `/api/dms`.
- Validate JWT access tokens using auth middleware.
- Hash passwords and private room passkeys.
- Store refresh token sessions.
- Send OTP emails.
- Manage room membership and admin actions.
- Authenticate WebSocket connections.
- Track connected users and joined rooms in memory.
- Persist messages and conversations in MongoDB.

## Frontend Overview

The frontend starts from `frontend/src/main.jsx` and renders `App.jsx`.

Main frontend responsibilities:

- Define routes using React Router.
- Protect dashboard, chat, create-room, and direct-message pages.
- Store and read JWT access token from localStorage.
- Use `api.service.js` for REST calls.
- Use `socket.service.js` for WebSocket connection and events.
- Render public pages, auth pages, dashboard, room chat, room creation, direct messages, terms, privacy, and support.

Frontend routes:

| Route | Page | Access |
| --- | --- | --- |
| `/` | Landing page | Public |
| `/signup` | Signup page | Public |
| `/login` | Login page | Public |
| `/verify-email` | OTP verification | Public |
| `/terms` | Terms page | Public |
| `/privacy` | Privacy page | Public |
| `/support` | Support page | Public |
| `/dashboard` | Room dashboard | Protected |
| `/chat/:roomId` | Room chat | Protected |
| `/create-room` | Create room | Protected |
| `/dms` | Direct messages | Protected |

## API Reference

Base URL:

```text
http://localhost:3000
```

### Health

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Server health |
| GET | `/api/health` | API health |
| GET | `/api/auth/health` | Auth service health |
| GET | `/api/ws/health` | WebSocket health and active connection count |
| GET | `/api/rooms/health` | Room service health |

### Auth

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user and send OTP |
| POST | `/api/auth/verify-email` | Verify email using OTP |
| POST | `/api/auth/resend-otp` | Send a new OTP |
| POST | `/api/auth/login` | Login and receive access token |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |
| DELETE | `/api/auth/profile` | Delete account |
| GET | `/api/auth/refresh-token` | Issue new access token from refresh cookie |
| GET | `/api/auth/logout` | Revoke current session |
| GET | `/api/auth/logout-all` | Revoke all sessions |

### Rooms

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/rooms/featured` | Public featured rooms for landing page |
| POST | `/api/rooms` | Create room |
| GET | `/api/rooms` | List rooms |
| GET | `/api/rooms/:id` | Get single room |
| GET | `/api/rooms/:id/members` | Get room members |
| POST | `/api/rooms/:id/leave` | Leave room |
| POST | `/api/rooms/:id/remove` | Admin removes member |
| POST | `/api/rooms/:id/block` | Admin blocks member |
| PATCH | `/api/rooms/:id/code` | Admin updates private room code |
| PATCH | `/api/rooms/:id` | Admin updates room name or description |
| DELETE | `/api/rooms/:id` | Admin deletes room |

### Users

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/users` | Get users, optionally filtered by gender or location |

Example filters:

```text
/api/users?gender=male
/api/users?gender=all
/api/users?location=Guna
```

### Direct Messages

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/dms/conversation` | Create or reuse a conversation with another user |
| GET | `/api/dms/conversations` | Get current user's conversations |
| GET | `/api/dms/messages/:conversationId` | Get direct message history |

## WebSocket Events

WebSocket URL:

```text
ws://localhost:3000?token=<jwt>
```

The token is required because the backend authenticates the socket before handling real-time events.

### Client To Server

| Event type | Payload | Purpose |
| --- | --- | --- |
| `join` | `{ roomId, password? }` | Join a public or private room |
| `message` | `{ content }` | Send message to current room |
| `delete_message` | `{ messageId }` | Delete a message |
| `direct_message` | `{ conversationId, message }` | Send private direct message |

### Server To Client

| Event type | Purpose |
| --- | --- |
| `history` | Sends recent room messages after join |
| `message` | Broadcasts a new room message |
| `message_deleted` | Notifies clients that a message was deleted |
| `direct_message` | Delivers a direct message |
| `presence` | Sends online/offline updates |
| `online_users` | Sends list of online users |
| `kicked` | Notifies a removed room member |
| `blocked` | Notifies a blocked room member |
| `error` | Sends WebSocket error details |

## Database Models

### User

Stores account and profile data.

- `username`
- `email`
- `password`
- `verified`
- `gender`
- `location`
- `about`
- timestamps

### Session

Stores refresh-token sessions.

- `user`
- `refreshToken`
- `ip`
- `userAgent`
- `revoked`

### OTP

Stores email verification OTP data.

- `email`
- `otpHash`
- expiry-related data from schema

### Room

Stores chat room metadata and membership.

- `name`
- `description`
- `creator`
- `type`: `public` or `private`
- `passkey`
- `passwordHash`
- `members`
- `blockedUsers`
- timestamps

### Message

Stores room messages.

- `room`
- `sender`
- `content`
- `isDeleted`
- timestamps

It also has an index on `{ room: 1, createdAt: -1 }` for efficient message history loading.

### Conversation

Stores direct-message conversation metadata between users.

### DirectMessage

Stores private messages inside conversations.

## Folder Structure

```text
JUET_chat/
+-- README.md
+-- backend/
|   +-- package.json
|   +-- package-lock.json
|   +-- README.md
|   +-- src/
|       +-- server.js
|       +-- app.js
|       +-- config/
|       |   +-- configure.js
|       |   +-- db.js
|       +-- controllers/
|       |   +-- auth.controller.js
|       |   +-- dm.controller.js
|       |   +-- room.controller.js
|       |   +-- user.controller.js
|       +-- middleware/
|       |   +-- auth.middleware.js
|       |   +-- error.middleware.js
|       +-- models/
|       |   +-- Conversation.js
|       |   +-- DirectMessage.js
|       |   +-- message.js
|       |   +-- otp.js
|       |   +-- room.js
|       |   +-- session.js
|       |   +-- user.js
|       +-- routes/
|       |   +-- auth.routes.js
|       |   +-- dm.routes.js
|       |   +-- health.routes.js
|       |   +-- room.routes.js
|       |   +-- user.routes.js
|       +-- services/
|       |   +-- auth.service.js
|       |   +-- email.service.js
|       |   +-- message.service.js
|       |   +-- room.service.js
|       +-- utils/
|       |   +-- constants.js
|       |   +-- jwt.js
|       |   +-- otp.util.js
|       +-- websocket/
|           +-- socket.server.js
|           +-- handlers/
|           |   +-- connection.js
|           |   +-- delete.js
|           |   +-- directMessage.js
|           |   +-- disconnect.js
|           |   +-- message.js
|           |   +-- room.js
|           +-- middleware/
|           |   +-- wsAuth.js
|           +-- state/
|           |   +-- rooms.js
|           |   +-- users.js
|           +-- utils/
|               +-- broadcast.js
+-- frontend/
    +-- package.json
    +-- package-lock.json
    +-- vite.config.js
    +-- index.html
    +-- README.md
    +-- src/
        +-- main.jsx
        +-- App.jsx
        +-- App.css
        +-- index.css
        +-- assets/
        |   +-- logo.png
        |   +-- ChatGPT Image Apr 29, 2026, 03_18_43 PM.png
        +-- hooks/
        |   +-- useLanguage.js
        +-- locales/
        |   +-- auth.js
        |   +-- dashboard.js
        |   +-- landing.js
        |   +-- legal.js
        +-- pages/
        |   +-- ChatRoomPage.jsx
        |   +-- CreateChatroomPage.jsx
        |   +-- DashboardPage.jsx
        |   +-- DirectMessagePage.jsx
        |   +-- JoinRoomPage.jsx
        |   +-- LandingPage.jsx
        |   +-- LoginPage.jsx
        |   +-- PrivacyPage.jsx
        |   +-- SignupPage.jsx
        |   +-- SupportPage.jsx
        |   +-- TermsPage.jsx
        |   +-- VerifyEmailPage.jsx
        +-- services/
            +-- api.service.js
            +-- socket.service.js
```

### Backend Folder Explanation

The backend follows a layered Express structure. In an interview, explain it like this: routes define the API URLs, middleware protects or prepares requests, controllers handle business logic, models talk to MongoDB, services hold reusable logic, and the WebSocket folder handles real-time communication.

| Path | Purpose | Interview explanation |
| --- | --- | --- |
| `backend/package.json` | Backend dependencies and scripts | Defines commands like `npm start` and `npm run dev`, plus packages such as Express, Mongoose, JWT, Nodemailer, and `ws`. |
| `backend/src/server.js` | Server entry point | First connects to MongoDB, then creates the HTTP server, attaches WebSocket support, and starts the app on `PORT`. |
| `backend/src/app.js` | Express app configuration | Adds CORS, JSON parsing, cookie parsing, logging, API routes, health routes, and the centralized error handler. |
| `backend/src/config/configure.js` | Environment configuration | Loads environment variables and exposes app-level config such as the server port. |
| `backend/src/config/db.js` | Database connection | Connects the backend to MongoDB using Mongoose. |
| `backend/src/routes/` | API route layer | Keeps URL definitions separate from business logic. Example: `/api/auth/login` is declared in route files and handled by controllers. |
| `backend/src/controllers/` | Request handling layer | Contains the main API logic for auth, rooms, users, and direct messages. Controllers read request data, call models/services, and send responses. |
| `backend/src/middleware/` | Shared request middleware | `auth.middleware.js` verifies JWT tokens for protected APIs, and `error.middleware.js` centralizes error responses. |
| `backend/src/models/` | MongoDB schema layer | Defines Mongoose schemas for users, rooms, messages, sessions, OTPs, conversations, and direct messages. |
| `backend/src/services/` | Reusable backend logic | Holds logic that can be reused by controllers or WebSocket handlers, such as email sending, message operations, room operations, and auth helpers. |
| `backend/src/utils/` | Helper constants and utilities | Contains shared constants, JWT helpers, and OTP generation/email-template utilities. |
| `backend/src/websocket/` | Real-time communication layer | Authenticates socket connections, handles join/message/delete/direct-message events, tracks online users, tracks room connections, and broadcasts events. |

Important backend files:

| File | What it does |
| --- | --- |
| `auth.controller.js` | Handles register, login, OTP verification, profile update, refresh token, logout, logout-all, and account delete. |
| `room.controller.js` | Handles room creation, room listing, room details, member management, blocking, passkey update, room update, and room delete. |
| `dm.controller.js` | Handles creating/reusing direct-message conversations and loading DM history. |
| `user.controller.js` | Handles user listing and filters used by direct messages. |
| `auth.middleware.js` | Protects API routes by validating the JWT access token and attaching user data to the request. |
| `socket.server.js` | Creates the WebSocket server and routes incoming socket events to handlers. |
| `wsAuth.js` | Verifies the JWT token before allowing a WebSocket connection. |
| `websocket/state/users.js` | Tracks online users and lets the backend notify a specific connected user. |
| `websocket/state/rooms.js` | Tracks room membership and active WebSocket connections. |
| `websocket/utils/broadcast.js` | Sends real-time events to the correct room or user group. |

### Frontend Folder Explanation

The frontend is organized around pages and services. In an interview, explain it like this: pages render the UI, services communicate with the backend, routing decides which page is visible, and protected routes prevent unauthenticated users from opening private screens.

| Path | Purpose | Interview explanation |
| --- | --- | --- |
| `frontend/package.json` | Frontend dependencies and scripts | Defines commands like `npm run dev`, `npm run build`, and packages such as React, Vite, and React Router. |
| `frontend/vite.config.js` | Vite configuration | Configures the React/Vite development and build setup. |
| `frontend/index.html` | HTML root | Contains the root element where React mounts the application. |
| `frontend/src/main.jsx` | React entry point | Mounts the React app into the DOM. |
| `frontend/src/App.jsx` | Routing and protected routes | Defines public and protected routes. It checks localStorage for `accessToken` before allowing dashboard, chat, room creation, and DM pages. |
| `frontend/src/pages/` | Page components | Contains full screens such as landing, signup, login, dashboard, chat room, create room, direct messages, privacy, terms, and support. |
| `frontend/src/services/api.service.js` | REST API service | Centralizes `fetch` calls, attaches `Authorization: Bearer <token>`, parses JSON, and exposes functions like `getRooms`, `login`, `getProfile`, and `getDirectMessages`. |
| `frontend/src/services/socket.service.js` | WebSocket client service | Opens the socket connection with the JWT token, registers event handlers, sends room messages, deletes messages, joins rooms, and sends direct messages. |
| `frontend/src/hooks/useLanguage.js` | Custom language hook | Helps the UI read and switch localized text. |
| `frontend/src/locales/` | Localization text | Stores page text for auth, dashboard, landing, and legal sections. |
| `frontend/src/assets/` | Static assets | Stores images and branding assets used by the UI. |
| `frontend/src/App.css` | Main app styling | Contains most application-level layout and component styles. |
| `frontend/src/index.css` | Global styling | Contains global CSS reset/base styles. |

Important frontend pages:

| File | What it does |
| --- | --- |
| `LandingPage.jsx` | Public first page that introduces the app and can show featured rooms. |
| `SignupPage.jsx` | Registration UI for creating a new user. |
| `VerifyEmailPage.jsx` | OTP verification UI after signup. |
| `LoginPage.jsx` | Login UI that stores the access token after successful login. |
| `DashboardPage.jsx` | Protected room dashboard where users can view rooms and navigate into chats. |
| `CreateChatroomPage.jsx` | Protected page for creating public or private rooms. |
| `ChatRoomPage.jsx` | Main room chat page that loads room data, connects WebSocket, joins a room, displays history, and sends messages. |
| `DirectMessagePage.jsx` | Protected page for user discovery, conversations, and private messages. |
| `TermsPage.jsx`, `PrivacyPage.jsx`, `SupportPage.jsx` | Public informational pages. |

### How To Remember The Structure

Use this mental model:

```text
backend/src/routes      -> What URL was called?
backend/src/middleware  -> Is the request allowed?
backend/src/controllers -> What should happen?
backend/src/models      -> What data is stored or fetched?
backend/src/websocket   -> What must happen instantly in real time?

frontend/src/pages      -> What screen is shown?
frontend/src/services   -> How does the UI talk to the backend?
frontend/src/App.jsx    -> Which route opens which page?
frontend/src/assets     -> What images are used?
frontend/src/locales    -> What text appears in the UI?
```

## Environment Variables

### Backend `.env`

Create this file inside `backend/`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
```

Minimum required variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`

Email-related variables are required for production OTP email delivery. In development, the backend can expose/log OTP fallback data depending on environment settings.

### Frontend `.env`

Create this file inside `frontend/` if you want to override defaults:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

If this file is missing, the frontend service code falls back to:

- API: `http://localhost:3000`
- WebSocket: `ws://localhost:3000`

## Running The Project

### Prerequisites

- Node.js installed.
- MongoDB database available locally or on MongoDB Atlas.
- Backend `.env` configured.

### Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Start Backend

```bash
cd backend
npm run dev
```

If `nodemon` hits a file watcher limit on macOS, use:

```bash
npm start
```

Backend runs at:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend usually runs at:

```text
http://localhost:5173
```

or:

```text
http://127.0.0.1:5173
```

## Interview Revision Notes

### How To Explain This Project

BolChal is a real-time chat app with a React frontend and an Express backend. The backend exposes REST APIs for authentication, room management, user profiles, and direct-message history. It also attaches a WebSocket server to the same HTTP server for real-time room messages, direct messages, and presence updates. MongoDB stores persistent data, while in-memory WebSocket state tracks active users and room connections.

### Why REST And WebSocket Both Are Used

- REST is better for structured request-response operations like login, profile update, room creation, and fetching history.
- WebSocket is better for real-time events because the server can push messages instantly without polling.

### Why JWT Is Used

JWT allows stateless access-token authentication. The frontend sends the token in API headers and WebSocket query params. The backend verifies the token and identifies the user.

### Why MongoDB Is Used

Chat data is document-friendly. Users, rooms, messages, sessions, and conversations can be represented naturally as documents with references.

### Why Mongoose Is Used

Mongoose gives schemas, validation, indexes, population, and a cleaner query API on top of MongoDB.

### How Private Rooms Work

Private rooms store a passkey and a hashed password value. When a user tries to join, the backend validates the supplied password. Once access is allowed, membership is stored so the user is recognized as a room member.

### How Real-Time Chat Works

The frontend opens a WebSocket connection with the access token. The backend authenticates the socket, stores user/socket state, and listens for event types like `join`, `message`, and `direct_message`. When a message arrives, the backend broadcasts it to relevant connected clients and saves it in MongoDB.

### How Protected Routes Work

The frontend checks for `accessToken` in localStorage. If missing, protected pages redirect to `/login`. The backend separately verifies tokens for protected API routes, so security does not depend only on frontend checks.

### Important Files To Remember

| File | Why it matters |
| --- | --- |
| `backend/src/server.js` | Starts database, HTTP server, and WebSocket server |
| `backend/src/app.js` | Express middleware and API route mounting |
| `backend/src/routes/*.routes.js` | API endpoint definitions |
| `backend/src/controllers/*.controller.js` | Backend business logic |
| `backend/src/middleware/auth.middleware.js` | JWT route protection |
| `backend/src/websocket/socket.server.js` | WebSocket setup and event routing |
| `backend/src/websocket/middleware/wsAuth.js` | WebSocket JWT authentication |
| `backend/src/models/*.js` | MongoDB schemas |
| `frontend/src/App.jsx` | Frontend routes and protected routes |
| `frontend/src/services/api.service.js` | REST API wrapper |
| `frontend/src/services/socket.service.js` | WebSocket client manager |
| `frontend/src/pages/ChatRoomPage.jsx` | Main room chat UI |
| `frontend/src/pages/DirectMessagePage.jsx` | Direct messaging UI |

### Common Interview Questions

**Q: What problem does this project solve?**  
It provides real-time communication through public/private rooms and direct messages, with authentication and persistent chat history.

**Q: How do you handle real-time messaging?**  
The frontend connects to a backend WebSocket server using a JWT token. The server authenticates the connection, listens for message events, broadcasts them to the correct room or user, and stores them in MongoDB.

**Q: How do you secure APIs?**  
Protected APIs use JWT authentication middleware. The frontend sends the access token in the `Authorization` header.

**Q: How do you secure WebSockets?**  
The frontend sends the JWT in the WebSocket URL query string. The backend verifies it before registering the socket.

**Q: How do you store chat history?**  
Room messages are stored in the `Message` collection. Direct messages are stored in the `DirectMessage` collection and linked to a `Conversation`.

**Q: What happens when a user joins a room?**  
The backend validates the room and passkey if needed, adds the user to room state, and sends the latest 50 messages.

**Q: What is the role of room admin?**  
The room creator is admin. Admin can delete the room, update details, change private room code, remove members, and block members.

**Q: What would you improve next?**  
Use bcrypt instead of SHA-256 for password hashing, add rate limiting, improve token refresh on the frontend, add tests, add pagination, and deploy with production-safe environment settings.

## Possible Improvements

- Use `bcrypt` or `argon2` for stronger password hashing.
- Add rate limiting for login, OTP, and message sending.
- Add automated tests for auth, rooms, and WebSocket events.
- Add pagination for rooms, users, and messages.
- Add typing indicators and read receipts.
- Add file/image sharing.
- Move WebSocket state to Redis for multi-server scaling.
- Add Docker setup for easier local development.
- Add CI checks for linting and builds.
- Improve production cookie settings based on deployment domain and HTTPS.

## License

This project is for educational and communication purposes within the JUET community.
