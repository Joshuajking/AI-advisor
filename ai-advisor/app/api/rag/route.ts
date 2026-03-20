import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { formatContextPrompt } from "@/lib/prompts";
import { searchKnowledgeBase, formatRetrievedContext } from "@/lib/rag";

// Day 3: Simple RAG (Retrieval-Augmented Generation)
// We search our knowledge base and inject relevant context into the prompt

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

    // Step 1: Search the knowledge base
    const relevantEntries = searchKnowledgeBase(message);
    const context = formatRetrievedContext(relevantEntries);

    console.log(`Found ${relevantEntries.length} relevant entries:`,
      relevantEntries.map(e => e.topic));

    // Step 2: Build the prompt with context
    const promptWithContext = formatContextPrompt(context, message);

    // Step 3: Convert history to Gemini format
    const geminiHistory = history.map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Step 4: Generate response with context
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: promptWithContext }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'll use the knowledge base context to help answer questions. What would you like to know?" }],
        },
        ...geminiHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({
      response,
      // Include metadata about what was retrieved (useful for debugging)
      _debug: {
        retrievedTopics: relevantEntries.map(e => e.topic),
      }
    });
  } catch (error) {
    console.error("RAG API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
