import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { AGENT_SYSTEM_PROMPT } from "@/lib/prompts";
import { searchKnowledgeBase, formatRetrievedContext } from "@/lib/rag";

// Day 4: Simple Agent with Tools
// The model decides which tools to use based on the user's request

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Define our tools (mock implementations for learning)
const tools = {
  searchKnowledgeBase: {
    description: "Search the knowledge base for relevant information",
    execute: (query: string) => {
      const results = searchKnowledgeBase(query);
      return formatRetrievedContext(results).join("\n\n");
    },
  },
  analyzeCode: {
    description: "Analyze code for best practices and potential issues",
    execute: (code: string) => {
      // Mock analysis - in production this could use static analysis tools
      return `Code Analysis Results:
- Lines of code: ${code.split("\n").length}
- Suggestions: Consider adding error handling and type annotations
- Overall: Code structure looks reasonable`;
    },
  },
  suggestResources: {
    description: "Suggest learning resources for a topic",
    execute: (topic: string) => {
      // Mock resource suggestions
      const resources: Record<string, string> = {
        default: `Resources for ${topic}:
- Official documentation
- YouTube tutorials
- Practice projects on GitHub`,
        prompts: `Prompt Engineering Resources:
- Anthropic's prompt engineering guide
- OpenAI's best practices
- Prompting.dev interactive tutorials`,
        rag: `RAG Resources:
- LangChain documentation
- Pinecone learning center
- Building RAG applications (Anthropic cookbook)`,
      };
      const key = Object.keys(resources).find(k =>
        topic.toLowerCase().includes(k)
      ) || "default";
      return resources[key];
    },
  },
};

// Simple tool selection based on keywords
function selectTool(message: string): { tool: keyof typeof tools; query: string } | null {
  const messageLower = message.toLowerCase();

  if (messageLower.includes("search") || messageLower.includes("find") ||
      messageLower.includes("what is") || messageLower.includes("explain")) {
    return { tool: "searchKnowledgeBase", query: message };
  }

  if (messageLower.includes("analyze") || messageLower.includes("review") ||
      messageLower.includes("code")) {
    // Extract code block if present
    const codeMatch = message.match(/```[\s\S]*?```/) ||
                      message.match(/`[^`]+`/);
    return {
      tool: "analyzeCode",
      query: codeMatch ? codeMatch[0] : message
    };
  }

  if (messageLower.includes("resource") || messageLower.includes("learn") ||
      messageLower.includes("tutorial") || messageLower.includes("recommend")) {
    return { tool: "suggestResources", query: message };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Step 1: Decide if we need a tool
    const toolSelection = selectTool(message);
    let toolResult = "";
    let toolUsed = "";

    if (toolSelection) {
      // Step 2: Execute the tool
      toolUsed = toolSelection.tool;
      toolResult = tools[toolSelection.tool].execute(toolSelection.query);
      console.log(`Used tool: ${toolUsed}`);
    }

    // Step 3: Build prompt with tool results
    const systemWithTools = toolResult
      ? `${AGENT_SYSTEM_PROMPT}\n\n[Tool Used: ${toolUsed}]\n[Tool Result]\n${toolResult}\n[/Tool Result]\n\nUse this information to help answer the user's question.`
      : AGENT_SYSTEM_PROMPT;

    // Step 4: Convert history and generate response
    const geminiHistory = history.map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System: " + systemWithTools }],
        },
        {
          role: "model",
          parts: [{ text: "I'm ready to help! I have access to tools for searching the knowledge base, analyzing code, and suggesting resources. How can I assist you?" }],
        },
        ...geminiHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({
      response,
      _debug: {
        toolUsed: toolUsed || "none",
      }
    });
  } catch (error) {
    console.error("Agent API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
