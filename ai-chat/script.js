const chatLog = document.querySelector("#chat-log");
const chatForm = document.querySelector("#chat-form");
const questionInput = document.querySelector("#question");
const sendButton = document.querySelector("#send-button");

const messages = [];

function addMessage(role, content) {
  messages.push({ role, content });
  renderMessages();
}

function renderMessages() {
  chatLog.replaceChildren();

  if (messages.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "message system";
    emptyMessage.textContent = "Ask a question to start the chat.";
    chatLog.append(emptyMessage);
    return;
  }

  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${message.role}`;
    messageElement.textContent = message.content;
    chatLog.append(messageElement);
  });

  chatLog.scrollTop = chatLog.scrollHeight;
}

async function askAI() {
  const apiKey = window.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API key.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages
    })
  });
 
  if (!response.ok) {
    throw new Error("The AI request failed.");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();
  if (!question) return;

  addMessage("user", question);
  questionInput.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "Thinking...";

  try {
    const answer = await askAI();
    addMessage("assistant", answer);
  } catch (error) {
    addMessage(
      "assistant",
      "Sorry, something went wrong. Make sure your local config.js file has an API key and try again."
    );
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
    questionInput.focus();
  }
});

renderMessages();
