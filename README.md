# JUET Chat — High-Performance Real-Time Messaging Platform

## 🚀 Introduction

JUET Chat is a modern, high-performance real-time messaging application designed to provide a seamless, WhatsApp-style communication experience. Built with a focus on speed, security, and user experience, the platform supports both public and private chat rooms, secure password-protected access, and advanced real-time synchronization.

The application features a hybrid architecture that separates live messaging (via WebSockets) from persistent storage (via MongoDB), ensuring zero-latency interaction while maintaining a reliable record of all conversations.

---

## 🛠️ Tech Stack & Technologies Used

### **Frontend**
- **React 19**: Modern UI library for building a reactive and fast user interface.
- **Vite**: Ultra-fast build tool and development server for a smooth developer experience.
- **Tailwind CSS**: Utility-first CSS framework for a premium, custom-designed interface.
- **WebSockets (Vanilla)**: Real-time communication for instant message delivery without polling.
- **Lucide React**: Beautiful icons for a clean, professional look.

### **Backend**
- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express.js**: Lightweight and robust web framework for API and routing.
- **MongoDB & Mongoose**: NoSQL database for flexible and scalable message and user storage.
- **JSON Web Tokens (JWT)**: Secure, stateless authentication for users and WebSocket handshakes.
- **Crypto**: Secure hashing for room passkeys and sensitive data.

---

## ✨ Key Features

### **1. Real-Time WebSocket Core**
- **Zero-Latency Messaging**: Instant broadcast of messages using the broadcast-first/database-async architecture.
- **Room Management**: Dynamic joining and leaving of rooms with real-time membership updates.
- **History Syncing**: Automatic loading of the last 50 messages upon joining a room to provide instant context.

### **2. WhatsApp-Style UX**
- **Smart Alignment**: Strict per-user alignment (Your messages on **RIGHT**, others on **LEFT**) based on unique user IDs.
- **Optimistic Updates**: Immediate UI feedback for sent messages.
- **Deduplication & Sorting**: Advanced frontend logic to ensure messages are never duplicated and always shown in chronological order.

### **3. Advanced Room Security**
- **Private Rooms**: Passkey-protected rooms ensuring only authorized members can access content.
- **Persistent Membership**: Once a user enters the correct passkey, they are added as a member and never asked for the passkey again.
- **Admin Privileges**: Creators can delete rooms, while members can leave them at any time.

---

## 📂 Project Structure

### **Backend (`/backend`)**
- `src/server.js`: entry point for HTTP and WebSocket servers.
- `src/websocket/`: Core real-time logic, including handlers for messages and rooms.
- `src/models/`: MongoDB schemas for Users, Rooms, and Messages.
- `src/controllers/`: Business logic for authentication and room management API.
- `src/middleware/`: JWT verification for both HTTP routes and WebSocket handshakes.

### **Frontend (`/frontend`)**
- `src/pages/`: Main application views including Dashboard and ChatRoom.
- `src/services/`: Modular service layers for API calls (`api.service`) and WebSockets (`socket.service`).
- `src/components/`: Reusable UI components (Modals, Room cards, etc).

---

## 🚦 Getting Started

### **1. Prerequisites**
- Node.js installed.
- MongoDB instance running (locally or via MongoDB Atlas).

### **2. Installation**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **3. Environment Setup**
Create a `.env` file in the `/backend` directory:
```env
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
PORT=3000
```

### **4. Running the App**
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

---

## ⚖️ License
This project is for educational and communication purposes within the JUET community.
