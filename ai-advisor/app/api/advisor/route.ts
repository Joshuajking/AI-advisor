import { NextRequest, NextResponse } from "next/server";

// Day 2: System Prompts
// TODO: Import your model
// TODO: Create a system prompt that defines the AI's personality

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // TODO: Add a system prompt before the user's message
    // TODO: Send to Gemini
    // TODO: Return response

    return NextResponse.json({
      response: "TODO: Add system prompt functionality",
    });
  } catch (error) {
    console.error("Advisor API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
