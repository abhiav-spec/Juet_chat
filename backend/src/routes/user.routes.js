import express from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllUsers);

export default router;
