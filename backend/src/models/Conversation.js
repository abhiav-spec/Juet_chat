import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }]
}, { timestamps: true });

// Ensure that a conversation always has exactly 2 participants
// and that there is only one conversation per pair of users.
// We'll enforce the uniqueness at the application level (controller)
// by sorting the user IDs before checking/creating.

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
