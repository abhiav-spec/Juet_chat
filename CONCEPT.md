# BolChal Project Concepts

This file is a quick revision guide for the important engineering concepts used in this project. Use it when preparing for interviews or when you want to quickly remember why a feature was added and how it works.

## Table of Contents

- [Full-Stack Architecture](#full-stack-architecture)
- [REST API Concept](#rest-api-concept)
- [Authentication Concept](#authentication-concept)
- [JWT Concept](#jwt-concept)
- [Refresh Token And Session Concept](#refresh-token-and-session-concept)
- [OTP Verification Concept](#otp-verification-concept)
- [Protected Routes Concept](#protected-routes-concept)
- [Password Hashing Concept](#password-hashing-concept)
- [MongoDB And Mongoose Concept](#mongodb-and-mongoose-concept)
- [WebSocket Concept](#websocket-concept)
- [Room Chat Concept](#room-chat-concept)
- [Direct Message Concept](#direct-message-concept)
- [Rate Limiting Concept](#rate-limiting-concept)
- [CORS Concept](#cors-concept)
- [Middleware Concept](#middleware-concept)
- [Error Handling Concept](#error-handling-concept)
- [Environment Variables Concept](#environment-variables-concept)
- [Scalability Concepts](#scalability-concepts)
- [Interview Summary](#interview-summary)

## Full-Stack Architecture

BolChal is a full-stack real-time chat application.

The frontend is built with React and Vite. It handles pages, forms, protected routes, API calls, and WebSocket connections.

The backend is built with Node.js and Express. It handles authentication, rooms, users, direct messages, MongoDB persistence, and WebSocket communication.

MongoDB stores long-term data such as users, sessions, OTPs, rooms, room messages, conversations, and direct messages.

Simple flow:

```text
React Frontend
   -> REST API calls
   -> Express Backend
   -> MongoDB

React Frontend
   -> WebSocket connection
   -> Express HTTP server with ws
   -> Real-time chat events
```

Interview line:

> This project separates normal request-response operations through REST APIs and real-time communication through WebSockets.

## REST API Concept

REST APIs are used when the frontend needs to request data or perform a fixed operation.

Examples in this project:

- Register user
- Login user
- Verify OTP
- Fetch profile
- Create room
- List rooms
- Fetch direct-message history
- Update profile
- Delete account

REST is useful here because these operations have a clear request and response.

Example:

```text
POST /api/auth/login
GET /api/rooms
POST /api/dms/conversation
```

Interview line:

> REST APIs are used for structured request-response operations such as authentication, room management, profile management, and loading stored data.

## Authentication Concept

Authentication means verifying who the user is.

In this project, authentication happens through:

1. User registers with email and password.
2. Password is hashed before storage.
3. OTP is sent to verify email ownership.
4. User logs in with email and password.
5. Backend returns an access token.
6. Frontend stores the access token.
7. Protected API requests send the token in the `Authorization` header.

Authentication protects private pages and APIs so only logged-in users can access them.

Interview line:

> Authentication verifies user identity and ensures protected APIs and pages are accessed only by logged-in users.

## JWT Concept

JWT means JSON Web Token.

In this project, JWT is used as an access token. After login, the backend signs a token containing the user ID. The frontend sends that token with protected API requests.

Header format:

```text
Authorization: Bearer <accessToken>
```

For WebSocket connections, the token is sent in the connection URL:

```text
ws://localhost:3000?token=<jwt>
```

Why JWT is useful:

- It identifies the user without querying the database for every request.
- It can expire automatically.
- It works for both REST APIs and WebSocket authentication.

Interview line:

> JWT allows the backend to verify authenticated users in a stateless way for both REST APIs and WebSocket connections.

## Refresh Token And Session Concept

Access tokens are short-lived compared to refresh tokens.

In this project:

- Access token is used by the frontend for API and WebSocket authentication.
- Refresh token is stored in an HTTP-only cookie.
- A hashed refresh token is stored in the `Session` collection.
- Logout revokes the session.
- Logout-all revokes all sessions for a user.

Why sessions are used with refresh tokens:

- The backend can revoke refresh tokens.
- Users can log out from one device or all devices.
- Storing hashed refresh tokens is safer than storing raw tokens.

Interview line:

> Refresh tokens keep users logged in, while server-side session records allow logout and token revocation.

## OTP Verification Concept

OTP means One-Time Password.

In this project, OTP is used for email verification after registration.

Flow:

```text
User registers
   -> Backend generates 6-digit OTP
   -> Backend hashes OTP
   -> Hashed OTP is stored in MongoDB
   -> Plain OTP is sent by email
   -> User submits OTP
   -> Backend hashes submitted OTP
   -> Backend compares hashes
   -> User email becomes verified
```

Why OTP is used:

- Confirms that the user owns the email.
- Prevents fake or mistyped emails.
- Adds trust before allowing full login flow.

Interview line:

> OTP verification confirms email ownership by sending a temporary code and validating its hash on the backend.

## Protected Routes Concept

Protected routes prevent unauthenticated users from accessing private screens.

In the frontend, `App.jsx` checks whether `accessToken` exists in localStorage. If it does not exist, the user is redirected to `/login`.

Protected frontend pages include:

- `/dashboard`
- `/chat/:roomId`
- `/create-room`
- `/dms`

Important note:

Frontend protected routes improve user experience, but real security must still happen on the backend. That is why protected backend routes also verify JWT tokens.

Interview line:

> Frontend protected routes control navigation, while backend JWT middleware provides actual API security.

## Password Hashing Concept

Password hashing means converting a plain password into a fixed-length hash before saving it.

In this project, passwords are hashed before being stored in MongoDB. This means the database does not store the plain password.

Why hashing is important:

- Plain passwords should never be stored.
- If the database leaks, attackers should not directly see user passwords.
- During login, the submitted password is hashed again and compared with the stored hash.

Current implementation note:

This project uses SHA-256 hashing. For production, `bcrypt` or `argon2` is better because they are slower and designed specifically for password security.

Interview line:

> Passwords are hashed before storage so the backend never saves plain-text passwords.

## MongoDB And Mongoose Concept

MongoDB is a NoSQL document database. Mongoose is an ODM that provides schemas, validation, and query helpers.

Main models in this project:

- `User`: account and profile data
- `Session`: refresh-token sessions
- `Otp`: email verification codes
- `Room`: room metadata, members, admins, blocked users
- `Message`: room chat messages
- `Conversation`: direct-message conversation metadata
- `DirectMessage`: private messages

Why MongoDB fits this project:

- Chat applications naturally store document-like data.
- Messages, users, and rooms can be represented as flexible documents.
- Mongoose makes validation and relationships easier.

Interview line:

> MongoDB stores the application's persistent data, while Mongoose provides schemas and validation for safer database operations.

## WebSocket Concept

WebSocket is a persistent two-way connection between client and server.

Unlike REST, the client does not need to repeatedly request updates. The server can push new data instantly.

In this project, WebSocket is used for:

- Joining rooms
- Sending room messages
- Deleting messages
- Sending direct messages
- Presence updates
- Online users
- Kicked or blocked notifications

WebSocket URL:

```text
ws://localhost:3000?token=<jwt>
```

Why WebSocket is used:

- Real-time chat needs instant updates.
- Polling REST APIs repeatedly would be slower and more expensive.
- WebSocket lets the backend push messages immediately.

Interview line:

> WebSockets are used for real-time chat because they allow the server to push messages instantly to connected clients.

## Room Chat Concept

Room chat means multiple users can join the same room and exchange messages.

Flow:

```text
User opens chat page
   -> Frontend connects to WebSocket
   -> Frontend sends join event with roomId
   -> Backend validates room access
   -> Backend adds socket to room state
   -> Backend sends recent message history
   -> User sends message
   -> Backend stores message in MongoDB
   -> Backend broadcasts message to room users
```

Room chat uses:

- MongoDB for message persistence
- WebSocket for real-time broadcast
- In-memory room state for active connections

Interview line:

> Room chat combines persistent storage with real-time broadcasting so messages are both saved and instantly delivered.

## Direct Message Concept

Direct messages are private conversations between users.

In this project:

- A conversation is created or reused between users.
- Message history is loaded through REST API.
- New messages are sent through WebSocket.
- Messages are stored in MongoDB.
- If the receiver is online, the backend pushes the message to their active sockets.

Why direct messages are separate from room messages:

- Room messages belong to a room.
- Direct messages belong to a conversation.
- Separate models make the data easier to manage.

Interview line:

> Direct messages use conversation records for private chat history and WebSocket events for instant delivery.

## Rate Limiting Concept

Rate limiting means controlling how many times a user or IP address can perform an action in a fixed time window.

Example: if login is limited to 5 attempts per 15 minutes, then after 5 repeated attempts the backend temporarily blocks more login attempts and returns:

```json
{
  "error": "Too many login attempts. Please try again later.",
  "retryAfter": 120
}
```

`retryAfter` tells the client how many seconds to wait.

What was added:

- A reusable rate limiter was added in `backend/src/utils/rateLimiter.js`.
- It stores request counts in memory using a JavaScript `Map`.
- Auth rate limits were applied in `backend/src/routes/auth.routes.js`.
- Room message limits were applied in `backend/src/websocket/handlers/message.js`.
- Direct message limits were applied in `backend/src/websocket/handlers/directMessage.js`.

Limits used:

| Action | Limit |
| --- | --- |
| Login by same IP + email | Max 5 attempts in 15 minutes |
| Login by same IP | Max 20 attempts in 15 minutes |
| OTP register/resend by same IP + email | Max 3 requests in 10 minutes |
| OTP register/resend by same IP | Max 10 requests in 10 minutes |
| OTP verify by same IP + email | Max 10 attempts in 10 minutes |
| Room messages | Max 30 messages per user per minute |
| Direct messages | Max 30 messages per user per minute |

Problems solved:

- Prevents brute-force login attempts.
- Prevents OTP spam.
- Protects the email service from abuse.
- Prevents room message flooding.
- Prevents direct message flooding.
- Reduces unnecessary database writes.
- Keeps WebSocket traffic controlled.

Limitation:

This is in-memory rate limiting. It works for a single backend instance. In production with multiple backend servers, Redis is better because all servers can share the same rate-limit counters.

Interview line:

> I added fixed-window rate limiting to protect sensitive and high-frequency actions. Login and OTP routes are limited by IP and email to reduce brute-force and spam attacks, while WebSocket messages are limited per authenticated user to prevent chat flooding and unnecessary database load.

## CORS Concept

CORS means Cross-Origin Resource Sharing.

The frontend runs on one origin:

```text
http://localhost:5173
```

The backend runs on another origin:

```text
http://localhost:3000
```

Because the origins are different, the backend must allow the frontend origin.

In this project, CORS is configured in `backend/src/app.js`.

Why CORS is needed:

- Browsers block cross-origin requests by default.
- Backend must explicitly allow trusted frontend URLs.
- It protects APIs from unwanted browser-based access.

Interview line:

> CORS allows the React frontend to safely call the Express backend from a different origin.

## Middleware Concept

Middleware is code that runs between the request and the final route handler.

Examples in this project:

- `cors()` allows frontend requests.
- `express.json()` parses JSON request bodies.
- `cookieParser()` reads cookies.
- `morgan()` logs requests.
- `auth.middleware.js` verifies JWT tokens.
- Rate limit middleware blocks excessive requests.
- Error middleware centralizes error responses.

Interview line:

> Middleware keeps common request logic reusable, such as authentication, parsing, logging, CORS, and rate limiting.

## Error Handling Concept

Centralized error handling means errors are handled in one place instead of repeating logic in every route.

In this project, `backend/src/middleware/error.middleware.js` handles:

- Mongoose validation errors
- Duplicate key errors
- JWT errors
- Generic server errors

Why it is useful:

- Cleaner controllers
- Consistent error responses
- Easier debugging

Interview line:

> Centralized error handling keeps API responses consistent and avoids repeating error logic in every controller.

## Environment Variables Concept

Environment variables store configuration and secrets outside source code.

Examples:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- Gmail or Google email credentials

Why environment variables are used:

- Keeps secrets out of code.
- Allows different values for local, staging, and production.
- Makes deployment easier.

Interview line:

> Environment variables separate configuration and secrets from the codebase.

## Scalability Concepts

Current project state:

- WebSocket room/user state is stored in memory.
- Rate-limit counters are stored in memory.
- This is fine for one backend server.

If the project grows:

- Move WebSocket state to Redis or a pub/sub layer.
- Move rate-limit counters to Redis.
- Use load balancing with sticky sessions or shared socket state.
- Add pagination for messages and users.
- Add indexes for frequent queries.
- Add background jobs for email sending.

Interview line:

> The current design is good for a single server, and Redis can be added later to share WebSocket and rate-limit state across multiple backend instances.

## Interview Summary

If asked to explain the project concepts quickly, say:

> BolChal is a full-stack real-time chat app. REST APIs handle authentication, profiles, rooms, and persisted data. WebSockets handle real-time room messages, direct messages, and presence. JWT protects APIs and socket connections. MongoDB stores users, rooms, sessions, OTPs, conversations, and messages. Rate limiting protects login, OTP, and message sending from abuse.

Most important concepts to revise:

- REST API
- Authentication
- JWT
- Refresh tokens and sessions
- OTP verification
- Protected routes
- MongoDB and Mongoose
- WebSocket real-time communication
- Room chat and direct messages
- Rate limiting
- Middleware
- CORS
- Error handling
- Environment variables
- Scalability with Redis
