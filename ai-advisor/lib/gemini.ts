import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get the model - using gemini-3-flash-preview for speed and free tier
export const model = genAI.getGenerativeModel({
	model: 'gemini-3-flash-preview',
});

// Simple helper to generate text
export async function generateText(prompt: string): Promise<string> {
	const result = await model.generateContent(prompt);
	return result.response.text();
}
