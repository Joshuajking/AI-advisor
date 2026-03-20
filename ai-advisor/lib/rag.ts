import knowledgeBase from "@/data/knowledge-base.json";

type KnowledgeEntry = {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
};

// Simple keyword-based retrieval
// (In production, you'd use embeddings + vector search)
export function searchKnowledgeBase(query: string, maxResults = 3): KnowledgeEntry[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  // Score each entry based on keyword matches
  const scored = (knowledgeBase as KnowledgeEntry[]).map((entry) => {
    let score = 0;

    // Check topic match
    if (queryLower.includes(entry.topic.toLowerCase())) {
      score += 10;
    }

    // Check keyword matches
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += 5;
      }
      // Partial word matching
      for (const word of queryWords) {
        if (keyword.toLowerCase().includes(word) && word.length > 2) {
          score += 2;
        }
      }
    }

    // Check content for query words
    const contentLower = entry.content.toLowerCase();
    for (const word of queryWords) {
      if (word.length > 3 && contentLower.includes(word)) {
        score += 1;
      }
    }

    return { entry, score };
  });

  // Return top matches with score > 0
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.entry);
}

// Format retrieved entries for context injection
export function formatRetrievedContext(entries: KnowledgeEntry[]): string[] {
  return entries.map(
    (entry) => `[${entry.topic}]\n${entry.content}`
  );
}
