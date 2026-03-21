import { NextRequest, NextResponse } from "next/server";

// Day 1: Your First AI API Call
// TODO: Import Gemini SDK
// TODO: Initialize the model

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // TODO: Send message to Gemini API
    // TODO: Get the response text
    // TODO: Return it

    return NextResponse.json({
      response: "TODO: Replace with actual AI response",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
