import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import documentRouter from './routes/documentRoutes.js';
import pollRouter from './routes/pollRoutes.js';
import issueRouter from './routes/issueRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import chatRouter from './routes/chatRoutes.js';

const app = express();

// Middleware
app.use(json());
app.use(express.urlencoded({ extended: true })); // Parse form data

// CORS (Allow credentials for JWT in Authorization header)
app.use(cors({
    origin: [
        'http://localhost:5173',  // Allow local development
        'http://16.171.28.194',  // Your backend's public IP
        'http://voiceclientchvr.s3-website.eu-north-1.amazonaws.com' // If you have a domain
    ],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/users', userRouter);
app.use('/documents', documentRouter);
app.use('/polls', pollRouter);
app.use('/issues', issueRouter);
// app.use('/ai', aiRouter)
app.use('/ai', chatRouter);

// Start Server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server is already running on port ${PORT}`));