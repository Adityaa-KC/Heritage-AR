const API_KEY = window.__API_KEY__;
const MODEL = "openai/gpt-3.5-turbo";

async function talkToMonument(monument) {
  const res = await fetch("/.netlify/functions/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ monument })
  });

  const data = await res.json();
  return data.text;
}

async function askQuestion(monument, question) {
  const res = await fetch("/.netlify/functions/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ monument, question })
  });

  const data = await res.json();
  return data.text;
}


async function callLLM(prompt) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.href,
          "X-Title": "Heritage AR Project"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: "You are a helpful cultural heritage assistant." },
            { role: "user", content: prompt }
          ],
          max_tokens: 180,
          temperature: 0.6
        })
      }
    );

    const data = await response.json();
    console.log("LLM response:", data);

    return data?.choices?.[0]?.message?.content
      || "I couldn’t find that information.";

  } catch (error) {
    console.error(error);
    return "AI is temporarily unavailable.";
  }
}


function handleBack() {
  const out = document.getElementById("story");
  const input = document.getElementById("questionInput");
  const backBtn = document.getElementById("backBtn");

  // Clear text
  out.innerText = "";

  // Clear input
  if (input) input.value = "";

  // Hide back button
  backBtn.style.display = "none";

  // Stop any ongoing speech
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
