import express from 'express';
import { 
    chatWithDocument
} from '../controllers/documentQueryController.js';


const chatRouter = express.Router();

chatRouter.post('/document/:documentId', chatWithDocument);
export default chatRouter;