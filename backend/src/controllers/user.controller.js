import User from '../models/User.js';
import { getOnlineUserIds } from '../websocket/state/users.js';

/**
 * GET /api/users
 * Retrieve all registered users and their online status.
 */
export const listUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, 'username email createdAt').lean();
        const onlineUserIds = getOnlineUserIds();

        const usersWithStatus = users.map(user => ({
            ...user,
            id: user._id,
            isOnline: onlineUserIds.includes(user._id.toString())
        }));

        return res.status(200).json({ users: usersWithStatus });
    } catch (error) {
        next(error);
    }
};
