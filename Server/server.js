import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/userRoutes.js';
import documentRouter from './routes/documentRoutes.js';
import pollRouter from './routes/pollRoutes.js';
import issueRouter from './routes/issueRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import FileStore from 'session-file-store';

const app = express();

// Middleware
app.use(json());
app.use(express.urlencoded({ extended: true })); // Parse form data

// CORS (Allow credentials for session cookies)
app.use(cors({
    origin: [
        'http://localhost:5173',  // Allow local development
        'http://16.171.28.194',  // Your backend's public IP
        'http://your-frontend-domain.com' // If you have a domain
    ],
    credentials: true
}));

const fileStore = FileStore(session);
// Session Middleware
app.use(session({
    store: new fileStore({ path: "./sessions" }), // ✅ Store sessions in files
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false,  // Keep false since HTTP is used
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 1 day session expiry
    }
}));

// Routes
app.use('/users', userRouter);
app.use('/documents', documentRouter);
app.use('/polls', pollRouter);
app.use('/issues', issueRouter);
// app.use('/ai', aiRouter)
app.use('/ai', chatRouter)

// Start Server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
