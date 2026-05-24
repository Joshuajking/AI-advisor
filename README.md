# AI Advisor

AI Advisor is a learning project for building a real Retrieval-Augmented Generation
(RAG) application.

The current app is a small Next.js chat interface backed by a server-side Gemini
API route. The long-term goal is to turn it into a practical RAG system that can
ingest source material, embed it, retrieve relevant context, and answer questions
with citations.

## Project Goals

- Build a working AI chat interface with Next.js.
- Keep model/API keys on the server side.
- Add system prompts for role, tone, and guardrails.
- Replace static JSON context with a real RAG pipeline.
- Use Postgres with pgvector for local vector search.
- Store source documents, transcripts, and media references for traceability.

## Planned RAG Architecture

```text
source documents / transcripts / web pages
  -> clean and normalize text
  -> split text into chunks
  -> create embeddings
  -> store chunks and vectors
  -> retrieve relevant chunks for each user question
  -> send context + question to the LLM
  -> return an answer with source references
```

## Project Structure

```text
ai-advisor/                 Next.js app
  app/page.tsx              Browser chat UI
  app/api/chat/route.ts     Server-side chat endpoint
  data/                     Starter knowledge/transcript data
scripts/                    Utility scripts
```

## Getting Started

```bash
cd ai-advisor
npm install
cp .env.example .env.local
npm run dev
```

Add your Gemini API key to:

```text
ai-advisor/.env.local
```

```env
GEMINI_API_KEY=your_api_key_here
```

Then open:

```text
http://localhost:3000
```

## Current Stack

- Next.js
- React
- TypeScript
- Gemini API

## Intended Stack

- Postgres
- pgvector
- Prisma
- MinIO or S3-compatible object storage
- Local document ingestion and embedding pipeline

## Status

This project is early-stage. The current focus is understanding the request flow
from the React UI to the backend API route, then evolving that route into a real
RAG-backed advisor.
