import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username is already taken'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already registered'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profilePic: {
        type: String,
        default: '',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other',
    },
    location: {
        type: String,
        trim: true,
        default: '',
    },
    about: {
        type: String,
        trim: true,
        maxlength: [500, 'About section cannot exceed 500 characters'],
        default: '',
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;