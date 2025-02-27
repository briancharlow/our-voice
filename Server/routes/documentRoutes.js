import express from 'express';
import multer from 'multer';
import { uploadDocument, softDeleteDocument, getAllDocuments, getDocumentByName, getDocumentById } from '../controllers/documentControllers.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const documentRouter = express.Router();
const upload = multer(); // Multer for handling file uploads (stored in memory)

// Routes
documentRouter.post('/upload', isAuthenticated, isAdmin, upload.single('file'), uploadDocument);
documentRouter.put('/delete/:documentId', isAuthenticated, isAdmin, softDeleteDocument);
documentRouter.get('/all', getAllDocuments);
documentRouter.get('/name/:title', getDocumentByName);
documentRouter.get('/id/:documentId', getDocumentById);

export default documentRouter;
