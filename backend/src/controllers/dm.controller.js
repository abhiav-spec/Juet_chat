import Conversation from '../models/Conversation.js';
import DirectMessage from '../models/DirectMessage.js';
import User from '../models/User.js';

export const getOrCreateConversation = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user.id;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ error: 'Cannot start a conversation with yourself' });
        }

        // Validate target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find existing conversation
        // The $all operator with $size ensures exact match of participants
        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, targetUserId], $size: 2 }
        }).populate('participants', 'username email');

        if (!conversation) {
            // Create new conversation
            conversation = await Conversation.create({
                participants: [currentUserId, targetUserId]
            });
            await conversation.populate('participants', 'username email');
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error in getOrCreateConversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getConversationHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const currentUserId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        if (!conversation.participants.includes(currentUserId)) {
            return res.status(403).json({ error: 'Not authorized to view this conversation' });
        }

        const messages = await DirectMessage.find({ conversationId, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('senderId', 'username email');

        // Reverse to return in chronological order
        res.status(200).json(messages.reverse());
    } catch (error) {
        console.error('Error in getConversationHistory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        
        const conversations = await Conversation.find({
            participants: currentUserId
        }).populate('participants', 'username email');

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error in getUserConversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
