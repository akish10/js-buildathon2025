import dotenv from 'dotenv';

dotenv.config();

import { AzureOpenAI } from "openai";

const endpoint = "https://odhia-mc81i572-eastus2.cognitiveservices.azure.com/";
const modelName = "gpt-4o";
const deployment = "js-aibuildathongpt-4o";

export async function main() {

  const apiKey = "PHAZSwj7bqWQwNGqzuamYWxdGpCPfDqbuac3scuqJ07GuZQA8tOcJQQJ99BFACHYHv6XJ3w3AAAAACOGZyv2";
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: "You are a helpful assistant." },
      { role:"user", content: "I am going to Paris, what should I see?" }
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