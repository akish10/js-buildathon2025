import OpenAI from "openai";
import { readFileSync } from "node:fs";
import { writeFileSync } from "node:fs";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

// Util function to get image as data URL
function getImageDataUrl(imageFile, imageFormat) {
  try {
      const imageBuffer = readFileSync(imageFile);
      const imageBase64 = imageBuffer.toString('base64');
      return `data:image/${imageFormat};base64,${imageBase64}`;
  } catch (error) {
      console.error(`Could not read '${imageFile}'.`);
      console.error('Set the correct path to the image file before running this sample.');
      process.exit(1);
  }
}

export async function main() {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  // Change the prompt to request HTML+CSS
  const prompt = `
You are provided with a hand-drawn webpage layout image.
Generate a single HTML file with embedded CSS (<style> in the <head>) that closely matches the layout, content, and style of the sketch.
Do NOT use markdown or code fences. Output only the complete HTML file as plain text.
`;

  const response = await client.chat.completions.create({
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: {
                url: getImageDataUrl("contoso_layout_sketch.jpg", "jpeg"), // use "jpeg" or "jpg"
                detail: "high"
            }}
          ]
        }
      ],
      model: modelName,
      max_tokens: 2000
    });

  // Save the result as HTML file (optional)
  
  writeFileSync("generated_webpage.html", response.choices[0].message.content);

  console.log("Generated HTML saved to generated_webpage.html");
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});