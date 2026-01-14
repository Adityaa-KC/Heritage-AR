export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { monument, question } = JSON.parse(event.body);

  const prompt = question
    ? `Answer this question about ${monument}: ${question}`
    : `Give a short engaging "unsuni daastaan" or mysterious story of ${monument} in hindi language in only 500 words.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      text: data.choices?.[0]?.message?.content || "No response"
    })
  };
}
