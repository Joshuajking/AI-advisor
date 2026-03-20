import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";

// Day 1: Basic LLM API call
// This is the simplest possible integration - just send a message and get a response

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Make the API call to Gemini
    const response = await generateText(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
