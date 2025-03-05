import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import { storeDocument, queryDocument } from '../utils/docHelper.js';

/**
 * Extract text from PDF using PDFjs
 * @param {string|ArrayBuffer} pdfSource - PDF file URL or buffer
 * @returns {Promise<string>} Extracted text from PDF
 */
async function extractPDFText(pdfSource) {
  try {
    let pdfData;
    
    // Handle different input types
    if (typeof pdfSource === 'string') {
      // If it's a URL, download the PDF first
      const response = await axios({
        method: 'get',
        url: pdfSource,
        responseType: 'arraybuffer'
      });
      pdfData = response.data;
    } else {
      // If it's already a buffer
      pdfData = pdfSource;
    }

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let textContent = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textLayer = await page.getTextContent();
      const pageText = textLayer.items.map(item => item.str).join(' ');
      textContent += pageText + '\n';
    }

    return textContent;
  } catch (error) {
    console.error('PDF Text Extraction Error:', error);
    throw error;
  }
}

/**
 * Controller to index a document from S3 URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function indexDocument(req, res) {
  try {
    const { documentId } = req.params;
    const { documentUrl } = req.body;

    // Validate inputs
    if (!documentId || !documentUrl) {
      return res.status(400).json({ 
        error: 'Missing Parameters',
        message: 'Document ID and URL are required'
      });
    }

    // Extract text from PDF
    const documentText = await extractPDFText(documentUrl);

    // Store document in Weaviate
    const storeResult = await storeDocument(documentId, documentText);

    // Respond with success
    res.status(201).json({
      message: 'Document indexed successfully',
      documentId,
      textLength: documentText.length
    });

  } catch (error) {
    console.error('Document Indexing Error:', error);
    res.status(500).json({ 
      error: 'Document indexing failed',
      message: error.message 
    });
  }
}

/**
 * Controller to chat with a document
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function chatWithDocument(req, res) {
  try {
    const { documentId } = req.params;
    const { question } = req.body;

    // Validate inputs
    if (!documentId) {
      return res.status(400).json({ 
        error: 'Missing Document ID',
        message: 'A valid document ID is required'
      });
    }

    if (!question) {
      return res.status(400).json({ 
        error: 'Missing Question',
        message: 'Please provide a question to query the document'
      });
    }

    // Query the document
    const answer = await queryDocument(documentId, question);

    // Respond with the answer
    res.status(200).json({
      documentId,
      question,
      answer
    });

  } catch (error) {
    console.error('Document Chat Error:', error);
    res.status(500).json({ 
      error: 'Document chat failed',
      message: error.message 
    });
  }
}

// Example route setup
/* 
import express from 'express';
import { 
  indexDocument, 
  chatWithDocument 
} from './documentChatController.js';

const router = express.Router();

// Index a document
router.post('/documents/index', indexDocument);

// Chat with a document
router.post('/documents/chat', chatWithDocument);

export default router;
*/