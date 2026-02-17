
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Tone, OutputLength, Platform, ImprovedPromptResponse } from "../types";

export const improvePromptWithAI = async (
  originalPrompt: string,
  category: Category,
  tone: Tone,
  platform: Platform,
  length: OutputLength
): Promise<ImprovedPromptResponse> => {
  // Use a safe access pattern for process.env
  const env = (typeof process !== 'undefined' && process.env) ? process.env : (window as any).process?.env;
  const apiKey = env?.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Configuration Error: The API_KEY environment variable is not detected. Please ensure it is set in your Netlify dashboard.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are an elite AI Prompt Engineer. Your task is to transform the user's basic input into a high-performance, structured prompt.
    
    Optimization Parameters:
    - Domain: ${category}
    - Tone: ${tone}
    - Target Platform: ${platform}
    - Desired Depth: ${length}
    
    The output must be a valid JSON object containing:
    1. 'improvedPrompt': The full, rewritten prompt with clear instructions, context, and formatting.
    2. 'scores': Clarity, Detail, and Creativity ratings (1-10).
    3. 'explanation': A brief summary of why these changes improve the AI's response quality.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve this prompt: "${originalPrompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvedPrompt: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                clarity: { type: Type.NUMBER },
                detail: { type: Type.NUMBER },
                creativity: { type: Type.NUMBER }
              },
              required: ['clarity', 'detail', 'creativity']
            },
            explanation: { type: Type.STRING }
          },
          required: ['improvedPrompt', 'scores', 'explanation']
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("Empty response from AI engine.");
    }

    return JSON.parse(jsonStr) as ImprovedPromptResponse;
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};
