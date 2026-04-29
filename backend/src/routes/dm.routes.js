import express from 'express';
import { getOrCreateConversation, getConversationHistory, getUserConversations } from '../controllers/dm.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/conversation', getOrCreateConversation);
router.get('/conversations', getUserConversations);
router.get('/messages/:conversationId', getConversationHistory);

export default router;
