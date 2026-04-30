import {Router} from 'express';
import {registerUser, getUserProfile, updateProfile, refreshToken,logout,logoutAll,login,verifyEmail,resendOtp, deleteAccount} from '../controllers/auth.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import { buildIpEmailKey, createRateLimit } from '../utils/rateLimiter.js';

const router = Router();

const loginRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Please try again later.',
    keyGenerator: buildIpEmailKey,
});

const loginIpRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many login attempts from this network. Please try again later.',
});

const otpRequestRateLimit = createRateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: 'Too many OTP requests. Please wait before requesting another OTP.',
    keyGenerator: buildIpEmailKey,
});

const otpRequestIpRateLimit = createRateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Too many OTP requests from this network. Please wait before requesting another OTP.',
});

const otpVerifyRateLimit = createRateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Too many OTP verification attempts. Please try again later.',
    keyGenerator: buildIpEmailKey,
});

router.post('/register', otpRequestIpRateLimit, otpRequestRateLimit, registerUser);
router.get("/refresh-token", refreshToken);
router.get('/profile', getUserProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/logout', logout);
router.get('/logout-all', logoutAll);
router.post('/login', loginIpRateLimit, loginRateLimit, login);
router.post('/verify-email', otpVerifyRateLimit, verifyEmail);
router.post('/resend-otp', otpRequestIpRateLimit, otpRequestRateLimit, resendOtp);
router.delete('/profile', authenticate, deleteAccount);




export default router;
