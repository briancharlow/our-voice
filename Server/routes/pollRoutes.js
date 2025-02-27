import express from 'express';
import { createPoll, getAllPolls, getPollById, softDeletePoll, voteInPoll } from '../controllers/pollController.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const pollRouter = express.Router();

// Routes
pollRouter.post('/create', isAuthenticated, isAdmin, createPoll);
pollRouter.get('/all', getAllPolls);
pollRouter.get('/id/:pollId', getPollById);
pollRouter.put('/delete/:pollId', isAuthenticated, isAdmin, softDeletePoll);
pollRouter.post('/vote', isAuthenticated, voteInPoll);

export default pollRouter;
