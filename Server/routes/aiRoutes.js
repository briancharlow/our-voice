// routes/summarizationRoutes.js
import express from 'express';
import { summarizeIssues } from '../controllers/aiController.js';
import { chatWithDocument, indexDocument } from '../controllers/testController.js';
const aiRouter = express.Router();

// Route for summarizing issues
aiRouter.post('/summarize/issues', summarizeIssues);

aiRouter.post('/document/:documentId', chatWithDocument);
aiRouter.post('/index/:documentId', indexDocument);

// Route for document chat
// aiRouter.post('/chat/document/:documentId', chatWithDocument);

export default aiRouter;
