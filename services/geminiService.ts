
import { GoogleGenAI } from "@google/genai";

// Assume API key is set in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Analyzes an image and returns a description.
 * @param imageBase64 The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @param prompt The prompt for the analysis.
 * @returns The text description from Gemini.
 */
export const analyzeImage = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
  if (!API_KEY) return "AI features are disabled. API key is missing.";
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return "Error analyzing image. Please try again.";
  }
};

/**
 * Sends a message to the Gemini chatbot and gets a response.
 * @param message The user's message.
 * @param history The chat history.
 * @returns The chatbot's response.
 */
export const getChatbotResponse = async (message: string, history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
    if (!API_KEY) return "AI features are disabled. API key is missing.";
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "You are Smarty, a helpful and friendly chatbot for the Smart Porter delivery service. Your tone should be cheerful and professional. Keep your answers concise."
            }
        });
        
        const response = await chat.sendMessage({ message: message });
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response from Gemini:", error);
        return "I'm having a little trouble thinking right now. Please try again later.";
    }
};
