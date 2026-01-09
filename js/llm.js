const API_KEY = window.__API_KEY__;
const MODEL = "openai/gpt-3.5-turbo";

async function talkToMonument(monumentName) {
  const prompt = `
You are a cultural heritage guide.
Give a short, engaging introduction of ${monumentName} in under 60 words.
Tone: respectful, modern, informative.
Explain in genz style
Language: english.
`;

  return callLLM(prompt);
}

async function askQuestion(monumentName, question) {
  const prompt = `
You are a knowledgeable heritage expert.
Answer the question about ${monumentName} clearly and concisely.
Explain in genz style
Language: Hindi.

Question: ${question}
`;

  return callLLM(prompt);
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
