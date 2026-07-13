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
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const modelSelect = document.getElementById('model-select');
const sendBtn = document.getElementById('send-btn');

let idCounter = 0;

function createMessageEl({id, role, text, loading = false}){
  const wrap = document.createElement('div');
  wrap.className = `message ${role}${loading? ' loading':''}`;
  wrap.id = id;

  const body = document.createElement('div');
  body.className = 'body';
  body.textContent = text;

  const meta = document.createElement('span');
  meta.className = 'meta';
  meta.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  wrap.appendChild(body);
  wrap.appendChild(meta);

  if (loading) {
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    body.appendChild(spinner);
  }

  return wrap;
}

function renderMessage(role, text, opts = {}){
  const id = `msg-${idCounter++}`;
  const el = createMessageEl({id, role, text, loading: opts.loading});
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

function replaceMessage(id, role, text){
  const old = document.getElementById(id);
  if (!old) return renderMessage(role, text);
  const newEl = createMessageEl({id, role, text, loading:false});
  old.replaceWith(newEl);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

function removeMessage(id){
  const el = document.getElementById(id);
  if (el) el.remove();
}

async function sendMessage(message){
  if (!message) return;
  const selectedModel = modelSelect ? modelSelect.value : undefined;

  // show user's message
  renderMessage('user', message);

  // clear input and keep focus
  userInput.value = '';
  userInput.focus();

  // disable UI while waiting
  sendBtn.disabled = true;

  // add loading AI placeholder
  const loadingId = renderMessage('ai', 'Thinking...', {loading:true});

  try{
    const res = await fetch('/.netlify/functions/ai-faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: message, model: selectedModel })
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    const answer = data.answer || data.output || 'No response';
    replaceMessage(loadingId, 'ai', answer);

  }catch(err){
    console.error(err);
    replaceMessage(loadingId, 'ai', 'Error: ' + (err.message || 'Unknown'));
  }finally{
    sendBtn.disabled = false;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// form submit handles Enter and button
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  sendMessage(text);
});

// keyboard shortcuts
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') userInput.value = '';
});

// initial focus
userInput.focus();

