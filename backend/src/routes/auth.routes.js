import {Router} from 'express';
import {registerUser, getUserProfile,refreshToken,logout,logoutAll,login,verifyEmail,resendOtp} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', registerUser);
router.get("/refresh-token", refreshToken);
router.get('/profile', getUserProfile);
router.get('/logout', logout);
router.get('/logout-all', logoutAll);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);




export default router;