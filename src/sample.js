import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url"; 

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "meta/Llama-4-Maverick-17B-128E-Instruct-FP8";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, "contoso_layout_sketch.jpg");



export async function main() {

  const imageMetadata = await sharp(imagePath).metadata();
  //console.log("Image metadata:", imageMetadata);

  const prompt = `Convert the image into a webpage user interface .The image is ${imagePath}`;


  const client = ModelClient(endpoint,new AzureKeyCredential(token),);

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role:"system", content: "You are a helpful assistant." },
        { role:"user", content: prompt }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  const generatedHtml = response.body.choices[0].message.content;
  console.log("Generated HTML:", generatedHtml);

  await fs.writeFile("generated_webpage.html", generatedHtml);
  console.log("Generated HTML saved to generated_webpage.html");


  //console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

