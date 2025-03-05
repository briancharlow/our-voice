
// import { queryDocument, storeDocument } from '../utils/openAiHelper.js';
// import pdfParse from 'pdf-parse';
// import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { DbHelper } from '../Database Helper/dbHelper.js';



// import { askDocument } from '../utils/openAiHelper.js';
// import pdfParse from 'pdf-parse';
// import AWS from 'aws-sdk';
// import { fileURLToPath } from 'url'; //HELPER TO LOCATE OUR POSITION OF DB.JS

// //GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
// const __filename = fileURLToPath(import.meta.url);
// //GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
// const __dirname = path.dirname(__filename);
// //POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE

// // const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: path.resolve(__dirname, '../.env') });


// const db = new DbHelper();



// dotenv.config();

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION
// });

// export const chatWithDocument = async (req, res) => {
//     const { documentId } = req.params;
//     const { question } = req.body;

//     try {
//         // Fetch document details from the database
//         const result = await db.executeProcedure('GetDocumentById', { DocumentId: documentId });
//         const document = result.recordset[0];

//         if (!document) {
//             return res.status(404).json({ message: 'Document not found' });
//         }

//         const documentUrl = document.DocumentFile;
//         if (!documentUrl) {
//             return res.status(400).json({ message: 'Document file URL is missing' });
//         }

//         // Extract the S3 key from the URL
//         const s3Key = documentUrl.split('.com/')[1];

//         // Download the PDF from S3
//         const pdfBuffer = await s3.getObject({
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: s3Key
//         }).promise();

//         // Extract text from PDF
//         const pdfData = await pdfParse(pdfBuffer.Body);
//         const documentText = pdfData.text || 'No readable text found in the document.';

//         // Limit text to 3000 characters to reduce token usage
//         const trimmedText = documentText.slice(0, 3000);

//         // Ask GPT-3.5 Turbo based on the document text
//         const response = await askDocument(trimmedText, question);

//         res.json({ response });
//     } catch (error) {
//         console.error('Error processing document chat:', error);
//         res.status(500).json({ error: 'Failed to process document chat' });
//     }
// };


import { summarizeText } from '../utils/openAiHelper.js';

export const summarizeIssues = async (req, res) => {
    try {
        const { issues } = req.body; // Expect issues from frontend

        console.log('Issues:', issues);

        if (!issues || !Array.isArray(issues) || issues.length === 0) {
            return res.status(400).json({ message: 'No issues provided for summarization' });
        }

        // Format issues into a string for summarization
        const issueText = issues
            .map(issue => `${issue.Title}: ${issue.Content} : ${issue.created_at} (Status: ${issue.Status}) (Location: ${issue.Location})`)
            .join('. ');

        // Limit the text to ~2000 characters to reduce cost
        const trimmedText = issueText.slice(0, 2000);

        // Call OpenAI API for summarization
        const summary = await summarizeText(trimmedText);

        res.json({ summary });
    } catch (error) {
        console.error('Error summarizing issues:', error);
        res.status(500).json({ error: 'Failed to summarize issues' });
    }
};
