import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Index for efficient querying of messages by conversation, ordered by creation time
directMessageSchema.index({ conversationId: 1, createdAt: 1 });

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;
