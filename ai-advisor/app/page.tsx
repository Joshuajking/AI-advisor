"use client";

import { useState } from "react";

const W = 80; // terminal column width

function row(char = "─") {
  return char.repeat(W);
}

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setResponse(data.response || "ERROR");
    } catch (error) {
      setResponse("ERROR: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: `${W}ch`,
        margin: "0 auto",
        fontSize: "14px",
        lineHeight: "1.4",
      }}
    >
      {/* ── Header ── */}
      <pre style={{ margin: 0, color: "#00ff41" }}>{row("═")}</pre>
      <pre style={{ margin: 0, color: "#00ff41" }}>
        {"║"} {"AI ADVISOR SYSTEM".padEnd(W - 4)} {"║"}
      </pre>
      <pre style={{ margin: 0, color: "#00ff41" }}>
        {"║"} {"IBM AS/400  -  ADVISORY TERMINAL  V1.0".padEnd(W - 4)} {"║"}
      </pre>
      <pre style={{ margin: 0, color: "#00ff41" }}>{row("═")}</pre>

      <pre style={{ margin: "0.5rem 0", color: "#00ff41" }}>
        {`SYSTEM DATE: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}    TIME: ${new Date().toLocaleTimeString("en-US", {
          hour12: false,
        })}    SESSION: ADV001`}
      </pre>

      <pre style={{ margin: 0, color: "#00ff41" }}>{row()}</pre>

      {/* ── Input section ── */}
      <pre style={{ margin: "0.75rem 0 0.25rem", color: "#00ff41" }}>
        INQUIRY INPUT:
      </pre>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ color: "#00ff41", whiteSpace: "nowrap" }}>{"> "}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER QUERY..."
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #00ff41",
            color: "#00ff41",
            fontFamily: "inherit",
            fontSize: "inherit",
            outline: "none",
            padding: "2px 4px",
            caretColor: "#00ff41",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#003300" : "#00ff41",
            color: "#000",
            border: "none",
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "bold",
            padding: "2px 12px",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.05em",
          }}
        >
          {loading ? "PROCESSING" : "F5=SEND"}
        </button>
      </form>

      <pre style={{ margin: "0.75rem 0 0", color: "#00ff41" }}>{row()}</pre>

      {/* ── Response section ── */}
      <pre style={{ margin: "0.25rem 0", color: "#00ff41" }}>
        SYSTEM RESPONSE:
      </pre>

      <div
        style={{
          minHeight: "10rem",
          border: "1px solid #00ff41",
          padding: "0.5rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: loading ? "#007a1f" : "#00ff41",
        }}
      >
        {loading
          ? "*** PROCESSING REQUEST — PLEASE WAIT ***"
          : response || "** NO OUTPUT — SUBMIT AN INQUIRY TO BEGIN **"}
      </div>

      {/* ── Function key bar ── */}
      <pre style={{ margin: "0.75rem 0 0", color: "#00ff41" }}>{row("═")}</pre>
      <pre style={{ margin: 0, color: "#00ff41" }}>
        {" F1=HELP   F3=EXIT   F5=SEND   F12=CANCEL   F24=MORE KEYS"}
      </pre>
      <pre style={{ margin: 0, color: "#00ff41" }}>{row("═")}</pre>
    </div>
  );
}
