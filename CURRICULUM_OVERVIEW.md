# 5-Day AI Course - Curriculum Overview

## Course Structure

Each day builds on the previous, progressively adding capabilities to an AI advisor system.

---

## Day 0: Introduction & Setup

**Goal**: Get students ready to build

### Topics Covered
- What they'll build over 5 days
- How to get a Gemini API key (ai.google.dev)
- Clone the repo and install dependencies
- Basic Next.js project structure overview

### Expected Outcome
- Students have the starter project running locally
- API key configured in `.env.local`
- Understanding of the project structure

---

## Day 1: Your First AI API Call

**Goal**: Make a working LLM integration

### What They'll Build
Simple API endpoint that sends a message to Gemini and returns a response.

### Key Concepts
- How LLM APIs work (request/response)
- Installing and importing the Gemini SDK
- Environment variables for API keys
- Basic error handling

### Implementation
**File**: `app/api/chat/route.ts`

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const result = await model.generateContent(message);
  const response = result.response.text();
  return NextResponse.json({ response });
}
```

### Learning Outcomes
- Understand API authentication
- Know how to make LLM API calls
- See how simple the basic integration is

### Common Issues
- Forgetting to add API key to `.env.local`
- Not restarting dev server after adding env variable
- Import errors with SDK

---

## Day 2: System Prompts & Personas

**Goal**: Control AI behavior with prompts

### What They'll Build
Enhanced endpoint that gives the AI a specific role and personality.

### Key Concepts
- System prompts vs user messages
- How prompts shape AI behavior
- Creating effective instructions
- Maintaining conversation context

### Implementation
**File**: `app/api/advisor/route.ts`

```typescript
const SYSTEM_PROMPT = `You are an experienced AI developer mentor.
- Give practical, beginner-friendly explanations
- Use real code examples
- Break complex topics into digestible steps
- Encourage hands-on learning`;

// Inject system prompt before user message
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "System: " + SYSTEM_PROMPT }]
    },
    {
      role: "model",
      parts: [{ text: "I understand. I'm ready to help!" }]
    }
  ]
});
```

### Learning Outcomes
- How to create effective system prompts
- The impact of prompt engineering on output quality
- Different ways to inject context

### Exercises
- Experiment with different personas
- See how changing the prompt changes responses
- Make the AI more/less formal, technical, friendly, etc.

---

## Day 3: Simple RAG (Retrieval-Augmented Generation)

**Goal**: Give AI access to custom knowledge

### What They'll Build
System that searches a knowledge base and injects relevant content into prompts.

### Key Concepts
- What RAG is and why it's needed
- Keyword-based retrieval (intentionally simple)
- Context injection into prompts
- Limitations of keyword matching

### Implementation
**File**: `app/api/rag/route.ts`

```typescript
// 1. Search knowledge base
function searchKnowledge(query: string) {
  const queryLower = query.toLowerCase();
  return knowledgeBase.filter(entry =>
    entry.keywords.some(keyword =>
      queryLower.includes(keyword.toLowerCase())
    )
  );
}

// 2. Format found entries as context
const relevantDocs = searchKnowledge(message);
const context = relevantDocs
  .map(doc => `[${doc.topic}]\n${doc.content}`)
  .join("\n\n");

// 3. Inject into prompt
const promptWithContext = `
Context from knowledge base:
${context}

User question: ${message}

Answer using the provided context.`;
```

### Learning Outcomes
- How RAG extends LLM capabilities
- Simple retrieval techniques
- When to use RAG vs fine-tuning
- Understanding RAG limitations

### Data Structure
**File**: `data/knowledge-base.json`

```json
[
  {
    "id": "prompting-basics",
    "topic": "Prompt Engineering",
    "keywords": ["prompts", "prompting", "instructions"],
    "content": "The key to effective prompting is..."
  }
]
```

### Exercises
- Add their own expert knowledge to the knowledge base
- Test retrieval with different queries
- See what happens with no matches

---

## Day 4: Downloading YouTube Transcripts

**Goal**: Add real-world data to your RAG system using YouTube transcripts

### What They'll Build
A transcript downloading workflow using Google Colab that fetches YouTube video transcripts and injects them into the AI advisor system.

### Key Concepts
- Using Google Colab to run Python scripts
- YouTube Transcript API
- Context window limitations
- Selective data injection based on user queries
- Information architecture for RAG

### Implementation

**Google Colab Script**: `scripts/download_transcripts_colab.py`

```python
from youtube_transcript_api import YouTubeTranscriptApi

def download_transcript(video_id, languages=['en']):
    api = YouTubeTranscriptApi()
    transcript = api.fetch(video_id, languages=languages)
    snippets = transcript.snippets
    full_text = " ".join(s.text for s in snippets)
    return {
        "video_id": video_id,
        "text": full_text,
        "char_count": len(full_text)
    }

VIDEO_IDS = ["X6AR2RMB5tE"]  # Add your video IDs
for vid in VIDEO_IDS:
    result = download_transcript(vid)
    # Save to .txt and .json files
```

**API Route Update**: `app/api/chat/route.ts`

```typescript
import fs from "fs";

// Check if user is asking about a specific advisor
function getTranscriptForMessage(message: string): string {
  const messageLower = message.toLowerCase();

  if (messageLower.includes("theo")) {
    const path = "data/transcripts/theo.txt";
    if (fs.existsSync(path)) {
      return fs.readFileSync(path, "utf-8");
    }
  }
  return "";
}

// In POST handler:
const transcript = getTranscriptForMessage(message);
const systemPrompt = `...
${transcript ? `Here is a transcript from the relevant expert:\n${transcript}` : ""}
...`;
```

### Learning Outcomes
- How to extract data from YouTube videos
- Context window management strategies
- Selective retrieval based on user intent
- Why vector databases are needed for scale

### Exercises
- Download transcripts from your favorite tech YouTubers
- Add multiple creators to your advisory board
- Organize transcripts by topic
- Improve the transcript selection logic

---

## Day 5: Real Product Demo & What's Next

**Goal**: See how these concepts scale to real products + career opportunity

### Topics Covered

#### Recap: What You Built
- Day 1: LLM API calls (text in, text out)
- Day 2: System prompts to control behavior
- Day 3: RAG with knowledge base
- Day 4: Real data with YouTube transcripts

Key insight: **It's just software development. It's just a new type of API.**

#### Real Product Demo: TikTok Creator Finder
Live demo of a product built for Roc Nation and Universal:
- Finding TikTok creators to promote songs
- User inputs: artist, genre, budget, target countries, content type
- System runs: SQL queries + vector database search + LLM reasoning
- Output: Curated list of creators with pricing and reach estimates

**The key insight**: This is the same concepts you learned, just at scale:
- JSON file → Vector database with millions of records
- Keyword matching → Semantic search with embeddings
- One transcript → Thousands of creator profiles
- Same core pattern: Retrieve → Inject → Generate

#### The Hiring Gap
This stuff is hard to hire for:
- Few developers know RAG properly
- Even fewer know how to build agents
- Testing and observability for AI systems is rare
- This will become table stakes (like knowing React/AWS)

#### Two Types of Developers
1. "How do I prompt better and write more code?"
2. "How do I build the infrastructure and products that make money?"

Knowing AI systems is how you level up.

### What To Do Next

**Share what you've learned:**
- Tell your team: "Here's how RAG can work for us"
- Maybe naive RAG is enough for your use case
- Do a hackathon to socialize these ideas

**Extend your project:**
- Add more creators
- Try a different niche
- Experiment with Chroma (local vector DB)

### Call to Action
- Applied AI Accelerator program details
- Humans in the loop, senior engineers, guest speakers
- Learn what companies are actually hiring for
- Contact: brian@parity.io or LinkedIn

---

## Teaching Philosophy

### Intentional Simplifications
- Keyword matching instead of embeddings: Easier to understand retrieval concepts
- Flat JSON instead of database: Focus on RAG patterns, not infrastructure
- Full transcripts instead of chunking: Simpler mental model before scaling
- Name-based retrieval instead of semantic search: Clear cause and effect

### Why This Works
- Students build a working system in 5 days
- Each concept is isolated and testable
- Clear progression from simple to complex
- Limitations are explicitly discussed in Day 5

### Core Principles
1. **Progressive Enhancement**: Each day adds one new capability
2. **Working Code**: Every day ends with a functioning feature
3. **Hands-On**: Students write code, not just watch videos
4. **Production Awareness**: Teach simple patterns while explaining production reality

---

## Student Success Metrics

### By End of Course, Students Should:
- [ ] Understand how LLM APIs work
- [ ] Be able to write effective system prompts
- [ ] Know what RAG is and when to use it
- [ ] Know how to add real-world data (transcripts)
- [ ] Recognize limitations of simple approaches
- [ ] Have a working AI system they can extend
- [ ] Know what to learn next

### Common Student Questions

**"Why not use OpenAI?"**
Gemini has a generous free tier perfect for learning. The concepts apply to any LLM.

**"Should I use LangChain?"**
Not yet. Understanding the fundamentals first makes frameworks more useful later.

**"How do I deploy this?"**
Vercel makes Next.js deployment simple. Focus on learning first, deployment second.

**"What about embeddings/vector DBs?"**
Day 5 covers this. Learn the simple version first, then understand why you need the complex version.

---

## Resources for Instructors

### Recommended Video Length
- Intro: 5-7 minutes
- Day 1-4: 10-15 minutes each
- Day 5: 15-20 minutes

### Demo Tips
- Show the API call in action first, then explain code
- Use console.log to show retrieval/tool results
- Have examples of different prompts ready
- Show failure cases (no API key, bad prompt, etc.)

### Code Walkthrough Order
1. Show desired outcome (working demo)
2. Explain high-level approach
3. Walk through code line by line
4. Show it working
5. Suggest exercises/modifications

### Common Student Issues
- Forgetting to restart dev server after env changes
- Not seeing changes due to caching
- Confusion about Gemini message format
- Overthinking the simple examples
