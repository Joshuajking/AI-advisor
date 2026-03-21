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

## Day 4: AI Agents with Tools

**Goal**: Enable AI to take actions

### What They'll Build
Agent that can use tools like searching knowledge, analyzing code, or suggesting resources.

### Key Concepts
- What agents are
- Tool/function definitions
- Routing logic (which tool to use)
- Combining tools with LLM reasoning

### Implementation
**File**: `app/api/agent/route.ts`

```typescript
// 1. Define tools
const tools = {
  searchKnowledge: (query: string) => {
    // Search and return knowledge base results
  },
  analyzeCode: (code: string) => {
    // Mock code analysis
    return "Analysis: Consider adding error handling...";
  },
  suggestResources: (topic: string) => {
    // Return curated learning resources
  }
};

// 2. Simple routing (keyword-based for learning)
function selectTool(message: string) {
  if (message.includes("search") || message.includes("what is")) {
    return "searchKnowledge";
  }
  if (message.includes("analyze") || message.includes("review")) {
    return "analyzeCode";
  }
  if (message.includes("learn") || message.includes("resources")) {
    return "suggestResources";
  }
  return null;
}

// 3. Execute tool and add results to prompt
const tool = selectTool(message);
const toolResult = tool ? tools[tool](message) : null;

const prompt = toolResult
  ? `[Tool: ${tool}]\n[Result: ${toolResult}]\n\nUser: ${message}`
  : message;
```

### Learning Outcomes
- How agents extend LLMs with actions
- Tool selection patterns
- Difference between simple routing and function calling
- Agent architecture patterns

### Exercises
- Add new tools
- Improve tool selection logic
- Chain multiple tools together

---

## Day 5: Production Concepts & What's Next

**Goal**: Understand what changes for production

### Topics Covered

#### What We Simplified
1. **Keyword Search → Vector Search**
   - Embeddings and semantic similarity
   - Vector databases (Pinecone, Weaviate)

2. **Flat File → Real Database**
   - Scaling beyond JSON files
   - Ingestion pipelines

3. **Keyword Routing → Function Calling**
   - LLM-native function calling
   - Structured tool schemas

4. **Single Tool → Multi-Step Agents**
   - Planning and orchestration
   - Agent frameworks (LangChain, etc.)

#### Production Considerations
- Error handling and retries
- Rate limiting and cost management
- Streaming responses
- Observability and logging
- Testing and evaluation

### Architecture Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   API Layer │────▶│   LLM API   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌─────────┐ ┌─────────┐ ┌─────────┐
        │ Vector  │ │ Tools/  │ │ Cache   │
        │   DB    │ │ Actions │ │         │
        └─────────┘ └─────────┘ └─────────┘
```

### Learning Path Forward
- Immediate: Add more tools and knowledge
- Intermediate: Implement streaming and better error handling
- Advanced: Build production RAG with vector DB

### Call to Action
- 30-Day AI Developer Program details
- What's covered in deeper course
- How to keep learning and building

---

## Teaching Philosophy

### Intentional Simplifications
- Keyword matching instead of embeddings: Easier to understand retrieval concepts
- Flat JSON instead of database: Focus on RAG patterns, not infrastructure
- if/else routing instead of function calling: Clearer cause and effect
- Single tool per request: Simpler mental model for agents

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
- [ ] Understand agent architecture basics
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
