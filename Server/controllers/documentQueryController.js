// controllers/documentQueryController.js
import { DbHelper } from '../Database Helper/dbHelper.js';
import { askDocument } from '../utils/openAiHelper.js';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import * as pdfjsLib from 'pdfjs-dist';

const db = new DbHelper();

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

async function extractTextFromPDF(pdfBuffer) {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) }); // Convert Buffer to Uint8Array
    const pdf = await loadingTask.promise;
    let text = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + '\n';
    }

    return text.trim() || 'No readable text found in the document.';
}

export const chatWithDocument = async (req, res) => {
    const { documentId } = req.params;
    const { question } = req.body;

    try {
        const document = await db.executeProcedure('GetDocumentById', { DocumentId: documentId });
        if (!document.recordset.length) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const documentUrl = document.recordset[0].DocumentFile;
        if (!documentUrl) {
            return res.status(400).json({ message: 'Document file URL is missing' });
        }

        // Download the PDF from S3
        const pdfBuffer = await s3.getObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: documentUrl.split('.com/')[1] // Extract S3 key from URL
        }).promise();

        // Extract text from the PDF
        const documentText = await extractTextFromPDF(pdfBuffer.Body);
        
        // Query OpenAI with extracted text
        const response = await askDocument(documentText, question);

        res.json({ response });
    } catch (error) {
        console.error('Error processing document chat:', error);
        res.status(500).json({ error: 'Failed to process document chat' });
    }
};
