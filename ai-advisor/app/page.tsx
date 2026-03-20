"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Change this to test different endpoints:
  // "/api/chat"    - Day 1: Basic LLM call
  // "/api/advisor" - Day 2: System prompts
  // "/api/rag"     - Day 3: RAG with context
  // "/api/agent"   - Day 4: Agent with tools
  const API_ENDPOINT = "/api/chat";

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>AI Advisor</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Using: <code>{API_ENDPOINT}</code>
      </p>
      <ChatInterface
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </main>
  );
}
