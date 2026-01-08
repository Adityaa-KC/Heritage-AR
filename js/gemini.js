async function talkToMonument(monumentName) {
  const API_KEY = "AIzaSyChAhwT1xSgqhDdYfsX-KrcHTxIWkgCpZ4";

  const prompt = `
You are a cultural heritage storyteller.
Explain ${monumentName} in a fun, Gen-Z friendly tone.
Keep it under 60 words.
Be accurate, respectful, and engaging.
No emojis.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text
      || "This monument has a long story to tell — coming soon.";
  } catch (error) {
    console.error(error);
    return "AI is resting right now. Please try again.";
  }
}
