// const chat = document.getElementById("chat");
// const input = document.getElementById("question");

// async function askAI() {
//   const question = input.value;
//   if (!question) return;

//   appendMessage("user", question);
//   input.value = "";

//   const response = await fetch("/.netlify/functions/ai-faq", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ question })
//   });

//   const data = await response.json();
//   appendMessage("ai", data.answer);
// }

// function appendMessage(sender, text) {
//   const div = document.createElement("div");
//   div.className = sender;
//   div.textContent = `${sender === "user" ? "You" : "AI"}: ${text}`;
//   chat.appendChild(div);
//   chat.scrollTop = chat.scrollHeight;
// }

// const sendBtn = document.getElementById("send-btn");
// const userInput = document.getElementById("user-input");
// const chatBox = document.getElementById("chat-box");

// sendBtn.addEventListener("click", async () => {
//   const message = userInput.value;
//   if (!message) return;

//   appendMessage("You", message);
//   userInput.value = "";

//   try {
//     const response = await fetch("/.netlify/functions/ai-faq", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ user: message })
//     });

//     const data = await response.json();
//     appendMessage("AI", data.answer);
//   } catch (err) {
//     appendMessage("AI", "Error: " + err.message);
//   }
// });

// function appendMessage(sender, text) {
//   const p = document.createElement("p");
//   p.textContent = `${sender}: ${text}`;
//   chatBox.appendChild(p);
// }

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  // Display user message
  appendMessage("You", message);
  userInput.value = "";

  try {
    const response = await fetch("/.netlify/functions/ai-faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: message })  // Send as 'user' key
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    appendMessage("AI", data.answer || "No response");

  } catch (err) {
    console.error("Fetch error:", err);
    appendMessage("AI", "Error: " + err.message);
  }
});

// Allow Enter key to send message
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

function appendMessage(sender, text) {
  const p = document.createElement("p");
  p.textContent = `${sender}: ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}
