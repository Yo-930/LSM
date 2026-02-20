import express from 'express';
const router = express.Router();
import {SignUp,Login,Logout,sendOtp,verifyOtp,resetPassword} from '../controllers/authController.js';


router.post('/signup', SignUp);
router.post('/login', Login);
router.get('/logout', Logout);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;