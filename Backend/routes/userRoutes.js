import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { getCurrentUser } from '../controllers/userController.js';
import { updateProfile } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
const userRouter = express.Router();

userRouter.get('/getcurrentuser', isAuthenticated, getCurrentUser);
userRouter.post('/profile', isAuthenticated,upload.single("photoUrl"), updateProfile);

export default userRouter;