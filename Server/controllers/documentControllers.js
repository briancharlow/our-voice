import { DbHelper } from '../Database Helper/dbHelper.js';
import { validateDocument } from '../validators/validators.js';
import { uploadFile } from '../middleware/uploadMiddleware.js';

const db = new DbHelper();

// Middleware to handle file upload
const uploadDocument = uploadFile('documents').single('document');

export async function addDocument(req, res) {
    // Handle file upload
    uploadDocument(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Validate request body
        const { error } = validateDocument(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            // Ensure file is uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'File is required' });
            }

            const { title, description } = req.body;
            const DocumentFile = req.file.location; // S3 File URL

            // Store file URL in the database
            await db.executeProcedure('UploadDocument', {
                Title: title,
                Description: description,
                DocumentFile: DocumentFile,
            });

            res.status(201).json({
                message: 'Document uploaded successfully',
                DocumentFile
            });

        } catch (error) {
            console.error('An error occurred while uploading the document', error);
            res.status(500).json({ message: `Internal server error: ${error.message}` });
        }
    });
}


// Soft Delete a Document
export const softDeleteDocument = async (req, res) => {
    const { documentId } = req.params;

    try {
        await db.executeProcedure('SoftDeleteDocument', { DocumentId: documentId });

        res.status(200).json({ message: 'Document deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Documents (Only Active)
export const getAllDocuments = async (req, res) => {
    try {
        let results = await db.executeProcedure('GetAllDocuments', {});
        let documents = results.recordsets[0];
        res.status(200).json(documents);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Document by Name
export const getDocumentByName = async (req, res) => {
    const { title } = req.params;

    try {
        let results = await db.executeProcedure('GetDocumentByName', { DocumentTitle: title });

        let documents = results.recordsets[0];

        if (documents.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json(documents);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Document by ID
export const getDocumentById = async (req, res) => {
    const { documentId } = req.params;

    try {
        let results = await db.executeProcedure('GetDocumentById', { DocumentId: documentId });

        let documents = results.recordsets[0];

        if (documents.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json(documents);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
