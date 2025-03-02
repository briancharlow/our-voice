import express from 'express';
import { createIssue, updateIssueStatus, getAllIssues, getIssuesByLocation, getIssueById } from '../controllers/issueController.js';
import { isAuthenticated, isCitizen, isGovernmentOfficial } from '../middleware/authMiddleware.js';

const issueRouter = express.Router();

// Routes
issueRouter.post('/create', createIssue);
issueRouter.put('/status', isAuthenticated, isGovernmentOfficial, updateIssueStatus);
issueRouter.get('/all', getAllIssues);
issueRouter.get('/location/:location', getIssuesByLocation);
issueRouter.get('/id/:issueId', getIssueById);

export default issueRouter;
