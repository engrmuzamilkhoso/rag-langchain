import { Document } from "@langchain/core/documents";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PGVectorStore } from "@langchain/pgvector";

// 1. The embeddings (same as Lesson 2)
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
});

// 2. Connect the vector store to Postgres
const store = await PGVectorStore.initialize(embeddings, {
    scoreNormalization: "similarity",
  postgresConnectionOptions: {
    connectionString: "postgres://postgres:postgres@localhost:5433/rag",
  },
  tableName: "lc_documents",
  distanceStrategy: "cosine",
  dimensions: 768,
});

// 3. Clear old rows (so running this twice doesn't make duplicates)
await store.pool.query("DELETE FROM lc_documents");

// 4. Add documents: LangChain embeds AND saves them
const docs = [
  new Document({ pageContent: "Card refunds take 5 to 7 business days.", metadata: { source: "refunds.md" } }),
  new Document({ pageContent: "Wallet refunds are instant, up to 24 hours.", metadata: { source: "refunds.md" } }),
  new Document({ pageContent: "Merchants are settled on the next business day.", metadata: { source: "settlements.md" } }),
  new Document({ pageContent: "API requests must be signed with HMAC-SHA256.", metadata: { source: "api-security.md" } }),
];

await store.addDocuments(docs);
console.log(`Saved ${docs.length} documents\n`);

// 5. Search
const question = "How long until I get my money back on my card?";
const results = await store.similaritySearchWithScore(question, 2);

console.log(`Question: ${question}\n`);
for (const [doc, score] of results) {
  console.log(score.toFixed(3), `[${doc.metadata["source"]}]`, doc.pageContent);
}

// 6. Close the database connection
await store.end();