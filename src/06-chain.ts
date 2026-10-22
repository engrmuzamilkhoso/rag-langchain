import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";

// 1. The prompt (same as Lesson 5)
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a support assistant for a payment company.
Answer using ONLY the documents below.
If the documents don't contain the answer, say: "I don't know, please contact support."

DOCUMENTS:
{context}`,
  ],
  ["human", "{question}"],
]);

// 2. The model (same as Lesson 4)
const model = new ChatOllama({ model: "llama3.2:3b", temperature: 0 });

// 3. The output parser: turns the AI's message into plain text
const parser = new StringOutputParser();

// 4. THE CHAIN: connect them in order
const chain = prompt.pipe(model).pipe(parser);

// 5. Run the whole chain with ONE call
const answer = await chain.invoke({
  context: "- Card refunds take 5 to 7 business days.",
  question: "How long do card refunds take?",
});

console.log("Answer:", answer);
console.log("\n--- Streaming ---");

const stream = await chain.stream({
  context: "- Wallet refunds (JazzCash, Easypaisa) are instant, up to 24 hours.",
  question: "How fast is a JazzCash refund?",
});

for await (const piece of stream) {
  process.stdout.write(piece);
}
console.log();