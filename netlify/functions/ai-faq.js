// netlify/functions/ai-faq.js
import fetch from "node-fetch";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { question } = JSON.parse(event.body);

  const response = await fetch("https://api.openrouter.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "google/gemma-2-9b-it",
      messages: [
        { role: "system", content: "You are a helpful assistant for this website. Answer questions concisely." },
        { role: "user", content: question }
      ]
    })
  });

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return {
    statusCode: 200,
    body: JSON.stringify({ answer })
  };
}
