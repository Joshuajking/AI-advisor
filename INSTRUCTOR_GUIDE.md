# Instructor Guide - 5-Day AI Course

## Repository Branches

This repo has two branches for different purposes:

### `main` - Complete Solution
Full working implementation of all 5 days. Use this for:
- Reference when teaching
- Creating demo videos
- Showing the end result to students
- Testing that everything works

### `student-starter` - Simplified Starting Point
Minimal scaffolding for students to build from scratch. Features:
- Simple UI with no complex state management
- API routes with TODO comments
- No lib utilities - students build these themselves
- Minimal knowledge base to start with

## Quick Start

### For Instructors (Complete Solution)
```bash
git checkout main
cd ai-advisor
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

Test endpoints by changing `API_ENDPOINT` in `app/page.tsx`:
- `/api/chat` - Day 1
- `/api/advisor` - Day 2
- `/api/rag` - Day 3
- `/api/agent` - Day 4

### For Students (Starter)
```bash
git checkout student-starter
cd ai-advisor
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

## Key Differences

| Feature | Main (Complete) | Student-Starter |
|---------|----------------|-----------------|
| **UI** | Full chat interface with history | Simple input/response form |
| **lib/gemini.ts** | ✅ Helper functions | ❌ Students create |
| **lib/prompts.ts** | ✅ All system prompts | ❌ Students write |
| **lib/rag.ts** | ✅ Search logic | ❌ Students build |
| **API routes** | ✅ Fully implemented | ⚠️ TODO comments only |
| **Components** | ChatInterface component | None (inline JSX) |

## File Comparison

### Main Branch Structure
```
ai-advisor/
├── app/
│   ├── page.tsx          # Chat UI with history
│   └── api/
│       ├── chat/         # ✅ Working implementation
│       ├── advisor/      # ✅ Working implementation
│       ├── rag/          # ✅ Working implementation
│       └── agent/        # ✅ Working implementation
├── lib/
│   ├── gemini.ts         # ✅ Client setup + helpers
│   ├── prompts.ts        # ✅ All system prompts
│   └── rag.ts            # ✅ Search logic
├── components/
│   └── ChatInterface.tsx # ✅ Full chat UI
└── data/
    └── knowledge-base.json # Full sample data
```

### Student-Starter Branch Structure
```
ai-advisor/
├── app/
│   ├── page.tsx          # Simple form (no history)
│   └── api/
│       ├── chat/         # TODO comments
│       ├── advisor/      # TODO comments
│       ├── rag/          # TODO comments
│       └── agent/        # TODO comments
├── lib/                  # (empty - students create)
├── components/           # (empty - students create)
└── data/
    └── knowledge-base.json # Same sample data
```

## Teaching Flow

### Day 1: First API Call
**Students will create:**
- `lib/gemini.ts` with basic client setup
- Implementation in `app/api/chat/route.ts`

**What to cover:**
- Installing `@google/generative-ai` package
- Getting API key from ai.google.dev
- Basic error handling
- Testing the endpoint

**Demo tip:** Show it working in main branch first, then code it live.

### Day 2: System Prompts
**Students will add:**
- System prompt in `app/api/advisor/route.ts`
- (Optional) Create `lib/prompts.ts` for reusable prompts

**What to cover:**
- How prompts shape behavior
- Injecting system messages into chat history
- Testing different personas

**Demo tip:** Show side-by-side comparisons of different prompts.

### Day 3: Simple RAG
**Students will create:**
- `lib/rag.ts` with keyword search function
- Implementation in `app/api/rag/route.ts`

**What to cover:**
- What RAG is and why it's useful
- Simple keyword matching
- Context injection into prompts
- Limitations (discussed in Day 5)

**Demo tip:** Show console logs of what gets retrieved.

### Day 4: Agents
**Students will add:**
- Tool definitions in `app/api/agent/route.ts`
- Routing logic to select tools
- Context injection from tool results

**What to cover:**
- What agents are
- Tool selection patterns
- Combining tool results with LLM reasoning

**Demo tip:** Show how different queries trigger different tools.

### Day 5: Production Concepts
**No coding - discussion day**

**What to cover:**
- Keyword → vector search
- Flat file → real database
- Simple routing → function calling
- Single tool → multi-step agents
- Error handling, costs, streaming
- CTA for 30-day program

## Video Recording Tips

### Setup
- Use main branch for demos
- Have multiple terminal windows open
- Show both code and browser
- Use a large font (18pt+)

### Structure Each Video
1. **Intro** (30 sec): What we're building today
2. **Demo** (1 min): Show it working in main branch
3. **Code Walkthrough** (8-12 min): Explain implementation
4. **Live Test** (1 min): Show it working
5. **Wrap** (1 min): What they learned + next day preview

### Recording Checklist
- [ ] API key in .env.local (but don't show it on camera!)
- [ ] Dev server running
- [ ] Console open to show logs
- [ ] Code editor ready with file open
- [ ] Browser window sized appropriately

## Common Student Issues

### Environment Setup
**Issue:** "It's not working"
- Check they restarted dev server after adding .env.local
- Verify API key is correct (test at ai.google.dev)
- Check for typos in environment variable name

### Day 1
**Issue:** SDK import errors
```bash
npm install @google/generative-ai
```

**Issue:** "generateContent is not a function"
- Verify model initialization
- Check SDK version

### Day 2
**Issue:** System prompt not working
- Gemini doesn't have a native "system" role
- Must inject as first user/model exchange

### Day 3
**Issue:** No results from knowledge base
- Check keyword matching logic
- Console.log the search results
- Try different queries

### Day 4
**Issue:** Tool not being selected
- Check keyword detection logic
- Console.log the selected tool
- Add more trigger keywords

## Curriculum Files

The `curriculum/` folder contains HTML files ready for Kajabi:
- `00-intro.html` - Course introduction
- `day-01-first-api-call.html` - Day 1 content
- `day-02-prompting.html` - Day 2 content
- `day-03-simple-rag.html` - Day 3 content
- `day-04-agents.html` - Day 4 content
- `day-05-whats-next.html` - Day 5 content

These files use simple HTML with no CSS (Kajabi styling will be applied).

**Note:** The `curriculum/` folder is gitignored to keep the repo focused on the code project.

## Testing Checklist

Before recording videos, verify:

### Main Branch
- [ ] All API endpoints return responses
- [ ] RAG returns relevant knowledge
- [ ] Agent selects correct tools
- [ ] Chat interface displays properly
- [ ] No console errors

### Student-Starter Branch
- [ ] Project builds without errors
- [ ] TODO comments are clear
- [ ] No references to deleted lib files
- [ ] Simple UI works
- [ ] API routes have proper structure

## Getting Help

If you encounter issues:
1. Check both branches are at correct commits
2. Verify npm dependencies are installed
3. Test with a fresh Gemini API key
4. Compare your code to main branch

## Distribution

**For students:**
```bash
git clone [repo-url]
git checkout student-starter
```

**For TAs/reviewers:**
```bash
git clone [repo-url]
# Main branch is default (complete solution)
```

## Next Steps After Course

Suggest students:
1. Add their own knowledge to the knowledge base
2. Create new tools for the agent
3. Experiment with different prompts
4. Try streaming responses
5. Add proper error handling

Then pitch the 30-day program for production concepts!
