import express from 'express';
import { createIssue, updateIssueStatus, getAllIssues, getIssuesByLocation, getIssueById } from '../controllers/issueController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const issueRouter = express.Router();

// Routes
issueRouter.post('/create', isAuthenticated, createIssue);
issueRouter.put('/update-status', isAuthenticated, updateIssueStatus);
issueRouter.get('/all', getAllIssues);
issueRouter.get('/location/:location', getIssuesByLocation);
issueRouter.get('/id/:issueId', getIssueById);

export default issueRouter;
