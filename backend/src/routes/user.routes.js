import express from 'express';
import { listUsers } from '../controllers/user.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

// Get list of all users and their online status
router.get('/', authenticate, listUsers);

export default router;
