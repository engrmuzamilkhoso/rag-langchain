import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
// 1. Create a template with {placeholders}
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

// 2. See which placeholders it found
console.log("Placeholders:", prompt.inputVariables);

// 3. Fill in the placeholders
const messages = await prompt.formatMessages({
  context: "- Card refunds take 5 to 7 business days.",
  question: "How long do card refunds take?",
});

// 4. Print the final messages
for (const m of messages) {
  console.log(`\n[${m.type}]\n${m.text}`);
}
const model = new ChatOllama({ model: "llama3.2:3b", temperature: 0 });

const promptValue = await prompt.invoke({
  context: "- Card refunds take 5 to 7 business days.",
  question: "What is a chargeback?",
});
const response = await model.invoke(promptValue);

console.log("\nAnswer:", response.text);