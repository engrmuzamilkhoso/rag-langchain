import { readFileSync } from "node:fs";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// 1. Read a real file into a Document
const doc = new Document({
  pageContent: readFileSync("docs/refunds.md", "utf8"),
  metadata: { source: "refunds.md" },
});

// 2. Create a splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 30,
});

// 3. Split
const chunks = await splitter.splitDocuments([doc]);

// 4. Print the result
console.log(`1 document → ${chunks.length} chunks\n`);
for (const chunk of chunks) {
  console.log(`(${chunk.pageContent.length} chars)`, chunk.pageContent);
  console.log("metadata:", chunk.metadata);
  console.log("---");
}