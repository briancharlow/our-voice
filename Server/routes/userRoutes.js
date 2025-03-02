import express from 'express';
import { registerUser, loginUser, logoutUser, updateUserRole, getAllUsers, forgotPassword, resetPassword } from '../controllers/userControllers.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', isAuthenticated, logoutUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.put('/update-role', isAuthenticated, isAdmin, updateUserRole);
userRouter.get('/getUsers', isAuthenticated, isAdmin, getAllUsers);
userRouter.get("/session", (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: "No active session" });
    }
});


export default userRouter;
