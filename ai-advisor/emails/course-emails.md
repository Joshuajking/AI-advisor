# 5-Day AI Developer Course - Daily Emails

---

## Day 1: Let's Build an AI Advisor

**Subject:** Day 1: We're building an AI advisory board (and it's simpler than you think)

Hey!

I'm super excited for you to start this course. I'm a senior software engineer who spent the last couple years building AI-powered products for startups - one got acquired, the other was for finding TikTok influencers for major record labels. I'll show you that at the end of the week.

Here's what we're building: an **AI advisory board** through a chat interface. You'll be able to ask questions like "What does Theo think about testing?" or "What's Primeagen's take on Vim?" and get responses grounded in what these creators actually said.

Pretty cool, right?

But before we get there, we have to start at the very basics. Today we're doing the most fundamental thing: making an API call to Gemini. You type something in, it goes to Gemini, Gemini sends something back. Super duper simple.

**[Start Day 1 →]({{DAY_1_LINK}})**

You should be on the `student-starter` branch, not main. Main has all the solutions and that's no fun. The whole point is to make this your own.

Here's the thing - the frameworks and languages don't matter. You're a software developer. You could build this in Rust, Python, whatever. The syntax changes, the concepts do not. I've literally rewritten the same product from Python to TypeScript and back again at different startups. Same exact stuff.

So extend things. Break things. Make it weird. That's the whole point.

Also - if you want to use Cursor or Claude to help you code, you absolutely should. I do.

Oh, and connect with me on LinkedIn if you haven't: [linkedin.com/in/brianjenney](https://linkedin.com/in/brianjenney). I know, I know. But it's still weirdly the best place to get hired and I post AI stuff that might actually be useful.

– Brian

---

## Day 2: System Prompts (aka How to Not Be Chipotle)

**Subject:** Day 2: Your AI is too helpful. Let's fix that.

You're back. Nice.

Remember how Chipotle's chatbot was helping people solve linked lists? Yeah, don't be Chipotle.

Today we add system prompts - basically telling the AI who it is, what it should do, and what it should absolutely NOT do. Think of it like SRP (Single Responsibility Principle) but for your prompts. I'm gonna keep mentioning SRP because it's genuinely the best mental model for this stuff.

We're gonna make our advisor actually stay in its lane. No more answering questions about the weather in France when it should be talking about code.

**[Start Day 2 →]({{DAY_2_LINK}})**

Here's why this matters: if you're paying for tokens (and eventually you will be), every dumb question someone asks costs you money. Guardrails aren't just nice - they save you cash.

Quick heads up: we're not doing chat history in this course. You know that fish from Finding Nemo that couldn't remember anything past 5 minutes? That's our chatbot right now. Every message starts fresh. It's something you could extend on your own though - the model totally supports it.

Make this your own. Experiment with different personas. See what happens when you change the constraints.

– Brian

---

## Day 3: RAG (Your AI Gets a Knowledge Base)

**Subject:** Day 3: Your AI is about to get way smarter

Still here? Respect.

Today we do RAG - Retrieval Augmented Generation. Fancy words for "give the AI some data it doesn't already have."

Here's the deal: these models have a training cutoff. They don't know what Theo said last week. They don't know your company's vacation policy. They don't know what Primeagen thinks about Vim (well, they might know that one). If you want them to know stuff, you gotta tell them.

We're adding a knowledge base with thoughts from some YouTubers - Theo Brown, Primeagen, and yeah, me too (I had to pick someone, why not). Now when you ask "what does Primo think about Vim?" - it actually knows.

**[Start Day 3 →]({{DAY_3_LINK}})**

This AI advisory board concept actually came from a student in our program who built a more productionized version. He had business advisors like Alex Hormozi and Sahil Bloom, put all their transcripts in a vector database, and could get targeted advice based on hundreds of hours of their content.

You can't just do this with ChatGPT. It doesn't have access to all that stuff.

By the way - RAG is the most popular use case for AI in companies right now. It's the most obvious and "boring" way to do it, but that's why big companies like DoorDash and Spotify are using it. Not as sexy as agents, but this is what companies are actually paying for.

Think about your information architecture. How will the LLM find the right piece of data? Structure matters.

– Brian

---

## Day 4: YouTube Transcripts (Real Data from the Web)

**Subject:** Day 4: We're scraping YouTube now

We're in the home stretch.

Today we grab actual transcripts from YouTube using a Python script in Google Colab. No special keys needed. Just video IDs. This is really cool - you can take any video, pass in the ID, and boom, you get the transcript.

Now your AI advisor can answer questions based on what these creators *actually said* - not just what I wrote in a JSON file.

**[Start Day 4 →]({{DAY_4_LINK}})**

I encourage you to use videos from whoever you like. Maybe it's me. Maybe it's Primeagen. Maybe it's Theo. Maybe it's completely outside tech - business, fitness, knitting, sharks, whatever floats your boat.

Quick heads up though: we'll talk about vector databases and chunking today. We won't build one (that's a bigger topic we cover in the Applied AI Accelerator), but you should know they exist.

Here's the problem: transcripts can be really, really long. What if you wanted a thousand transcripts? You can't just dump all of that into Gemini. Context windows have limits. And even if they didn't, it muddies up the response. You want to give the model as little information as it needs, not everything you have.

We're doing a naive version: if someone asks about Theo, we inject Theo's transcript. Simple. But it works.

– Brian

---

## Day 5: What's Next (+ A Real Product)

**Subject:** Day 5: You built something. Now what?

Final day. You made it.

Look - what you built might not feel that complex. And that's kind of the secret. This stuff IS software development. It's just a new type of API with some quirks.

Even though it might not feel that complex, I hope you're proud of the work you've done.

Today I'm showing you a real product I built - a TikTok influencer finder for record labels like Roc Nation and Universal. Uses all the same concepts you learned, just at scale. Millions of data points, vector databases, the whole thing.

**[Start Day 5 →]({{DAY_5_LINK}})**

Here's my ask: **extend this thing.** Add more transcripts. Try a vector database. Break it. Show it to your team. Do a hackathon at work where you introduce these ideas. This is how you gain leverage.

There are developers working on "how do I prompt better and write more code?" And there are developers thinking "how do I build the infrastructure and products that make our company money?"

Knowing how to build AI systems is how you level up.

This stuff is hard to hire for. I designed the AI engineer interview process at my last company, and you would not believe how difficult it was to find people who knew RAG, how to build things properly, the pitfalls, how to test them. There's just not a lot of people that know this stuff yet.

That's leverage. That's opportunity.

If you want to go deeper, check out the **Applied AI Accelerator** at parity.io. It's where we teach the production-level stuff with actual humans in the loop - me, other senior engineers, guest speakers monthly. I don't know of any other program like it.

Either way - reach out on LinkedIn or brian@parity.io. I genuinely want to see what you build. If you've extended this, figured out how to use a vector database, or you're confused about something - let me know.

Thanks for doing this with me. Now go build something.

– Brian

---

## Placeholder Links

Replace these in your email system:

- `{{DAY_1_LINK}}` - Day 1: Building Your AI Advisor
- `{{DAY_2_LINK}}` - Day 2: System Prompts
- `{{DAY_3_LINK}}` - Day 3: RAG with Knowledge Base
- `{{DAY_4_LINK}}` - Day 4: YouTube Transcripts
- `{{DAY_5_LINK}}` - Day 5: What's Next
