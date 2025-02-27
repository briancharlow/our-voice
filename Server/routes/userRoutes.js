import express from 'express';
import { registerUser, loginUser, logoutUser, updateUserRole } from '../controllers/userControllers.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', isAuthenticated, logoutUser);
userRouter.put('/update-role', isAuthenticated, isAdmin, updateUserRole);

export default userRouter;
