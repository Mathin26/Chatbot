// Import node-fetch for environments without native fetch
import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.user;

    const response = await fetch("https://api.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: data.choices[0]?.message?.content || "No response"
      })
    };

  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "Server error: " + error.message })
    };
  }
}
