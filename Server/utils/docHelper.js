import OpenAI from 'openai';
import weaviate from 'weaviate-ts-client';

import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Weaviate
const weaviateClient = weaviate.client({
  scheme: 'https',
  host: process.env.WEAVIATE_HOST, // Removes 'https://' to match Weaviate's requirement
  apiKey: process.env.WEAVIATE_API_KEY
});

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

/**
 * Splits a document into smaller chunks for embedding.
 */
function splitText(text, chunkSize = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Embeds text using OpenAI.
 */
async function embedText(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text
  });
  return response.data[0].embedding;
}

/**
 * Stores document chunks in Weaviate.
 */
export async function storeDocument(documentId, documentText) {
  const chunks = splitText(documentText);
  
  for (const chunk of chunks) {
    const vector = await embedText(chunk);
    await weaviateClient.data
      .creator()
      .withClassName("DocumentChunk")
      .withProperties({
        documentId,
        text: chunk
      })
      .withVector(vector)
      .do();
  }
  return { message: "Document stored successfully" };
}

/**
 * Queries relevant document chunks using Weaviate.
 */
export async function queryDocument(documentId, question) {
  const vector = await embedText(question);
  const response = await weaviateClient.graphql
    .get()
    .withClassName("DocumentChunk")
    .withFields("text")
    .withNearVector({ vector })
    .withWhere({
      operator: "Equal",
      path: ["documentId"],
      valueText: documentId
    })
    .withLimit(3) // Retrieve top 3 relevant chunks
    .do();
  const relevantChunks = response.data.Get.DocumentChunk.map(doc => doc.text).join("\n");
  return askDocument(relevantChunks, question);
}

/**
 * Queries OpenAI with relevant document context.
 */
export async function askDocument(context, question) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an AI assistant trained to answer questions based on provided documents." },
      { role: "user", content: `Document Context:\n${context}\n\nQuestion: ${question}` }
    ],
    max_tokens: 200
  });
  return response.choices[0].message.content;
}