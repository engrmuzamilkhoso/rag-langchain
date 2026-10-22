import { OllamaEmbeddings } from "@langchain/ollama";

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
});

// Same similarity function as your first project
function similarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 1. The "documents"
const texts = [
  "Card refunds take 5 to 7 business days.",
  "Wallet refunds are instant, up to 24 hours.",
  "Merchants are settled on the next business day.",
  "API requests must be signed with HMAC-SHA256.",
];

// 2. Embed ALL documents in one call
const vectors = await embeddings.embedDocuments(texts);
console.log(`Embedded ${vectors.length} texts\n`);

// 3. Embed the question
const question = "How long until I get my money back on my card?";
const questionVector = await embeddings.embedQuery(question);

// 4. Compare the question with every text
const results = texts.map((text, i) => ({
  text,
  score: similarity(questionVector, vectors[i]!),
}));

results.sort((x, y) => y.score - x.score);

console.log(`Question: ${question}\n`);
for (const r of results) {
  console.log(r.score.toFixed(3), r.text);
}