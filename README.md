# AI Advisor

AI Advisor is a learning project for building a real Retrieval-Augmented Generation
(RAG) application.

The current app is a small Next.js chat interface backed by a server-side Gemini
API route. The long-term goal is to turn it into a practical RAG system that can
ingest source material, embed it, retrieve relevant context, and answer questions
with citations.

## Project Origin

This repository began from a small AI advisor starter project used to learn the
basics of Next.js API routes, React state, and Gemini API integration.

The original scaffold provided the initial chat UI, starter API route, and sample
advisor data. I am keeping that history visible because it is part of the
project's origin and I do not want to present starter code as if it were written
from scratch.

My work is focused on evolving the scaffold into a more complete RAG application:
designing the retrieval architecture, replacing static JSON context with a real
document pipeline, adding source traceability, and exploring a production-style
stack around Postgres, pgvector, object storage, and local AI processing.

In other words, this project is not meant to demonstrate that the first chat
interface was built entirely from scratch. It is meant to demonstrate how a
starter AI app can be understood, reshaped, extended, and turned into a more
serious retrieval-backed system.

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
