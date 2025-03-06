import express from 'express';
import { 
    registerUser, 
    loginUser, 
    updateUserRole, 
    getAllUsers, 
    forgotPassword, 
    resetPassword,
    getCurrentUser 
} from '../controllers/userControllers.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.put('/update-role', isAuthenticated, isAdmin, updateUserRole);
userRouter.get('/getUsers', isAuthenticated, isAdmin, getAllUsers);
userRouter.get('/session', isAuthenticated, getCurrentUser);

export default userRouter;