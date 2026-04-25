import mongoose from 'mongoose';
import { ROOM_TYPES } from '../utils/constants.js';

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Room name is required'],
            unique: true,
            trim: true,
            minlength: [2, 'Room name must be at least 2 characters'],
            maxlength: [50, 'Room name cannot exceed 50 characters'],
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator reference is required'],
        },
        type: {
            type: String,
            enum: Object.values(ROOM_TYPES),
            required: [true, 'Room type is required'],
            default: ROOM_TYPES.PUBLIC,
        },
        // Stored as passkey for admin visibility
        passkey: {
            type: String,
            default: null,
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                isAdmin: {
                    type: Boolean,
                    default: false,
                },
                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
