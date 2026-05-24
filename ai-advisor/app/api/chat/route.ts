import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const SYSTEM_PROMPT = `
    You are an AI mentor that understands RAG, agents, and other advanced AI concepts.
    You only answer questions related to coding.
    You only use TypeScript in your responses for code examples.
    If the question is not related to coding, you should say that you are not sure and you should not try to answer it.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `${SYSTEM_PROMPT}\n\n User message: ${message}`,
    })
    const response = result.text;

    return NextResponse.json({
      response: response,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
