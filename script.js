document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatMessages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    // 1. Show user message
    addMessage("You: " + message);

    input.value = "";

    // 2. Show typing animation
    const typing = showTyping();

    try {
      // 3. Get AI response
      const reply = await getAIResponse(message);

      // 4. Remove typing + show response
      typing.remove();
      addMessage("AI: " + reply);

    } catch (err) {
      typing.remove();
      addMessage("AI: Error - " + err.message);
    }
  });

  // 🔹 API call
  async function getAIResponse(text) {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text }]
          }]
        })
      }
    );

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
  }

  // 🔹 Add message
  function addMessage(text) {
    const div = document.createElement("div");
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  // 🔹 Typing animation (dots)
  function showTyping() {
    const div = document.createElement("div");
    div.className = "typing";
    div.innerHTML = "AI is typing<span>.</span><span>.</span><span>.</span>";
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }
});
