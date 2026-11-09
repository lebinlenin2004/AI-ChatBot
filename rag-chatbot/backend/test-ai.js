import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: process.env.LLM_MODEL,
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3
});

async function testAI() {
    try {
        const response = await model.invoke(
            "Explain RAG in simple words."
        );

        console.log("Gemini Response:");
        console.log(response.content);

    } catch (error) {
        console.error("Gemini Error:", error.message);
    }
}

testAI();