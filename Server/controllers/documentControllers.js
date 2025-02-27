import { DbHelper } from '../Database Helper/dbHelper.js';
const db = new DbHelper(); // Instantiate DB Helper

// Upload Document
export const uploadDocument = async (req, res) => {
    const { title, description } = req.body;
    const file = req.file; // Uploaded file

    if (!file) {
        return res.status(400).json({ message: 'File is required' });
    }

    try {
        await db.executeProcedure('UploadDocument', {
            Title: title,
            Description: description,
            DocumentFile: file.buffer, // Store file as binary
        });

        res.status(201).json({ message: 'Document uploaded successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        let results = await db.executeProcedure('GetAllDocuments');
        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Document by Name
export const getDocumentByName = async (req, res) => {
    const { title } = req.params;

    try {
        let results = await db.executeProcedure('GetDocumentByName', { DocumentTitle: title });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json(results[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Document by ID
export const getDocumentById = async (req, res) => {
    const { documentId } = req.params;

    try {
        let results = await db.executeProcedure('GetDocumentById', { DocumentId: documentId });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json(results[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
