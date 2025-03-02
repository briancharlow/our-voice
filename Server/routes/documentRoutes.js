import express from 'express';
import multer from 'multer';
import { softDeleteDocument, getAllDocuments, getDocumentByName, getDocumentById, addDocument } from '../controllers/documentControllers.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const documentRouter = express.Router();


// Routes
documentRouter.post('/upload', isAuthenticated, isAdmin, addDocument);
documentRouter.put('/delete/:documentId', softDeleteDocument);
documentRouter.get('/all', getAllDocuments);
documentRouter.get('/name/:title', getDocumentByName);
documentRouter.get('/id/:documentId', getDocumentById);

export default documentRouter;

