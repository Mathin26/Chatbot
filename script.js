// // const chat = document.getElementById("chat");
// // const input = document.getElementById("question");

// // async function askAI() {
// //   const question = input.value;
// //   if (!question) return;

// //   appendMessage("user", question);
// //   input.value = "";

// //   const response = await fetch("/.netlify/functions/ai-faq", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ question })
// //   });

// //   const data = await response.json();
// //   appendMessage("ai", data.answer);
// // }

// // function appendMessage(sender, text) {
// //   const div = document.createElement("div");
// //   div.className = sender;
// //   div.textContent = `${sender === "user" ? "You" : "AI"}: ${text}`;
// //   chat.appendChild(div);
// //   chat.scrollTop = chat.scrollHeight;
// // }

// // const sendBtn = document.getElementById("send-btn");
// // const userInput = document.getElementById("user-input");
// // const chatBox = document.getElementById("chat-box");

// // sendBtn.addEventListener("click", async () => {
// //   const message = userInput.value;
// //   if (!message) return;

// //   appendMessage("You", message);
// //   userInput.value = "";

// //   try {
// //     const response = await fetch("/.netlify/functions/ai-faq", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ user: message })
// //     });

// //     const data = await response.json();
// //     appendMessage("AI", data.answer);
// //   } catch (err) {
// //     appendMessage("AI", "Error: " + err.message);
// //   }
// // });

// // function appendMessage(sender, text) {
// //   const p = document.createElement("p");
// //   p.textContent = `${sender}: ${text}`;
// //   chatBox.appendChild(p);
// // }

// const sendBtn = document.getElementById("send-btn");
// const userInput = document.getElementById("user-input");
// const chatBox = document.getElementById("chat-box");

// sendBtn.addEventListener("click", async () => {
//   const message = userInput.value.trim();
//   if (!message) return;

//   // Display user message
//   appendMessage("You", message);
//   userInput.value = "";

//   try {
//     const response = await fetch("/.netlify/functions/ai-faq", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ user: message })  // Send as 'user' key
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     appendMessage("AI", data.answer || "No response");

//   } catch (err) {
//     console.error("Fetch error:", err);
//     appendMessage("AI", "Error: " + err.message);
//   }
// });

// // Allow Enter key to send message
// userInput.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") {
//     sendBtn.click();
//   }
// });

// function appendMessage(sender, text) {
//   const p = document.createElement("p");
//   p.textContent = `${sender}: ${text}`;
//   chatBox.appendChild(p);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const modelSelect = document.getElementById("model-select");

sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  const selectedModel = modelSelect.value;

  // Display user message
  appendMessage("You", message);
  userInput.value = "";

  // Show loading indicator
  const loadingId = appendMessage("AI", "Thinking...");

  try {
    const response = await fetch("/.netlify/functions/ai-faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user: message,
        model: selectedModel 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Remove loading message
    removeMessage(loadingId);
    
    // Display AI response
    appendMessage("AI", data.answer || "No response");

  } catch (err) {
    console.error("Fetch error:", err);
    removeMessage(loadingId);
    appendMessage("AI", "Error: " + err.message);
  }
});

// Allow Enter key to send message
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

let messageIdCounter = 0;

function appendMessage(sender, text) {
  const p = document.createElement("p");
  const id = `msg-${messageIdCounter++}`;
  p.id = id;
  p.textContent = `${sender}: ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

function removeMessage(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}
