const chat = document.getElementById("chat");
const input = document.getElementById("question");

async function askAI() {
  const question = input.value;
  if (!question) return;

  appendMessage("user", question);
  input.value = "";

  const response = await fetch("/.netlify/functions/ai-faq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();
  appendMessage("ai", data.answer);
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = `${sender === "user" ? "You" : "AI"}: ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
