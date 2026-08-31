export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Server is not configured." });
  }

  const { messages, extra } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid request." });
  }

  const body = {
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: messages
  };
  if (extra && typeof extra === "object") {
    Object.assign(body, extra);
  }

  try {
    const openai = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify(body)
    });
    const data = await openai.json();
    if (!openai.ok) {
      const msg = (data && data.error && data.error.message) || "The AI service is busy.";
      return res.status(openai.status).json({ error: msg });
    }
    const content =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;
    if (!content) {
      return res.status(502).json({ error: "Empty response from AI." });
    }
    return res.status(200).json({ content: content });
  } catch (e) {
    return res.status(500).json({ error: "Server could not reach OpenAI." });
  }
}
