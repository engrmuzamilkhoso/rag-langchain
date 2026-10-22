import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// 1. Create the chat model
const model = new ChatOllama({
  model: "llama3.2:3b",
  temperature: 0,
});

// 2. Send messages, get an answer
const response = await model.invoke([
  new SystemMessage("You are a support assistant for a payment company. Answer in one line."),
  new HumanMessage("What is a chargeback?"),
]);

// 3. Print the answer
console.log(response.text);

// console.log("\n--- Streaming ---\n");

// const stream = await model.stream([
//   ["system", "You are a support assistant for a payment company."],
//   ["human", "Explain what a refund is in 3 sentences."],
// ]);

// for await (const chunk of stream) {
//   process.stdout.write(chunk.text);
// }
// console.log();