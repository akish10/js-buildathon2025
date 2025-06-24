import dotenv from 'dotenv';

dotenv.config();

import { AzureOpenAI } from "openai";

const endpoint = "<my-end-point>/";
const modelName = "gpt-4o";
const deployment = "js-aibuildathongpt-4o";

export async function main() {

  const apiKey = "<my-api-key>";
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: "You are a helpful assistant." },
      { role:"user", content: "Highlight some iron rich sources for a vegan?" }
    ],
    max_tokens: 4096,
      temperature: 1,
      top_p: 1,
      model: modelName
  });

  if (response?.error !== undefined && response.status !== "200") {
    throw response.error;
  }

  for (const choice of response.choices) {
    console.log(choice.message.content);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});