import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    outputDimensionality: 768,
    apiKey: process.env.GOOGLE_API_KEY
});

async function testEmbedding() {
    try {
        const text = "RAG combines information retrieval with AI generation.";

        const result = await embeddings.embedQuery(text);

        console.log("Embedding generated successfully!");
        console.log("Vector dimensions:", result.length);
        console.log("First 10 values:", result.slice(0, 10));

    } catch (error) {
        console.error("Embedding Error:", error.message);
    }
}

testEmbedding();