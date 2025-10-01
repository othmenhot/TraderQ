import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generates educational content for a trading chapter using the Gemini API.
 * @param {string} chapterTitle The title of the chapter.
 * @returns {Promise<string>} A promise that resolves to the generated text content.
 */
export const generateChapterContent = async (chapterTitle) => {
  const systemPrompt = `
    You are an expert trading educator and content creator for a platform called "Trader Quest".
    Your audience consists of absolute beginners. Your tone should be clear, encouraging, and engaging.
    Avoid complex jargon where possible, or explain it immediately in simple terms.
    Use metaphors and real-world examples to make concepts understandable.
    The output must be only the main text content for the chapter, without any titles, headers, or markdown formatting like '#'.
    The response should be a single block of text.
  `;

  const prompt = `${systemPrompt}\nGenerate the chapter content for the following topic: "${chapterTitle}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate chapter content. Please check the API key and configuration.");
  }
};
