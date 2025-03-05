import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI with modern syntax
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Summarization function using the latest OpenAI SDK
export async function summarizeText(text) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Summarize the following text in 1-4 concise sentences:\n\n${text}`
            }],
            max_tokens: 150,
            temperature: 0.5
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error summarizing text:', error);
        throw new Error('Failed to generate summary');
    }
}

// Document-based question-answering function
export async function askDocument(documentText, question) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an AI assistant that answers questions based on provided documents." },
                { role: "user", content: `Document:\n${documentText}\n\nQuestion: ${question}` }
            ],
            max_tokens: 300,
            temperature: 0.7
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error querying document:', error);
        throw new Error('Failed to process document chat');
    }
}
