import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/userRoutes.js';
import documentRouter from './routes/documentRoutes.js';
import pollRouter from './routes/pollRoutes.js';
import issueRouter from './routes/issueRoutes.js';

const app = express();

// Middleware
app.use(json());
app.use(express.urlencoded({ extended: true })); // Parse form data

// CORS (Allow credentials for session cookies)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Helps prevent XSS attacks
        maxAge: 1000 * 60 * 60 * 24, // 1 day session expiry
    }
}));

// Routes
app.use('/users', userRouter);
app.use('/documents', documentRouter);
app.use('/polls', pollRouter);
app.use('/issues', issueRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
