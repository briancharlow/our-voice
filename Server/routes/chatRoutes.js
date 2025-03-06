import express from 'express';
import { 
    chatWithDocument
} from '../controllers/documentQueryController.js';

import { summarizeIssues } from  '../controllers/aiController.js'


const chatRouter = express.Router();

chatRouter.post('/document/:documentId', chatWithDocument);
chatRouter.post('/summarize/issues', summarizeIssues);
export default chatRouter;