import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { gender, location } = req.query;
        
        // Base query: all users except the current user
        const query = { _id: { $ne: currentUserId } };
        
        if (gender && gender !== 'all') {
            query.gender = gender;
        }
        
        if (location && location.trim() !== '') {
            query.location = { $regex: location, $options: 'i' };
        }
        
        const users = await User.find(query)
            .select('-password -__v') // Exclude sensitive/internal fields
            .sort({ username: 1 });
            
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
