// import fetch from 'node-fetch';

// export async function handler(event, context) {
//   try {
//     const body = JSON.parse(event.body);
//     const userMessage = body.question || body.user; // accept either key

//     if (!userMessage) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ answer: "No question provided" }),
//       };
//     }

//     const response = await fetch("https://api.openrouter.ai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "google/gemma-2-9b-it:free",
//         messages: [
//           { role: "system", content: "You are a helpful assistant." },
//           { role: "user", content: userMessage }
//         ]
//       })
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("OpenRouter API error:", errorText);
//       return {
//         statusCode: response.status,
//         body: JSON.stringify({ answer: "OpenRouter API error: " + errorText }),
//       };
//     }

//     const data = await response.json();

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         answer: data.choices[0]?.message?.content || "No response"
//       }),
//     };

//   } catch (error) {
//     console.error("Function error:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ answer: "Server error: " + error.message }),
//     };
//   }
// }

import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    // Parse the incoming request body
    const body = JSON.parse(event.body);
    const userMessage = body.question || body.user; // accept either key

    // Validate input
    if (!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ answer: "No question provided" })
      };
    }

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

    // Check if API response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ answer: "OpenRouter API error: " + errorText })
      };
    }

    // Parse and return the AI response
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
