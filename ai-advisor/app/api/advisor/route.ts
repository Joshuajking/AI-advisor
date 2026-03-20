import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { ADVISOR_SYSTEM_PROMPT } from "@/lib/prompts";

// Day 2: System prompts and personas
// Now we add a system prompt to give the AI a specific personality and expertise

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Convert history to Gemini format
    const geminiHistory = history.map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Start chat with system prompt as first message
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System instructions: " + ADVISOR_SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'm ready to help as your AI advisor. How can I assist you today?" }],
        },
        ...geminiHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Advisor API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
