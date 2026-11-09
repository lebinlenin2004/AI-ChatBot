// services/embeddingService.js

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { getChunksCollection } from "../config/database.js";

let embeddings = null;
let vectorStore = null;

// Generate Gemini embeddings
export function getEmbeddings() {
  if (!embeddings) {
    embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
      outputDimensionality: 768,
    });
  }

  return embeddings;
}

// Connect embeddings with MongoDB Atlas Vector Search
export function getVectorStore() {
  if (!vectorStore) {
    vectorStore = new MongoDBAtlasVectorSearch(getEmbeddings(), {
      collection: getChunksCollection(),
      indexName: "gemini_vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });
  }

  return vectorStore;
}