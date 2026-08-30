return fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: messages, extra: extra || null })
}).then(function (res) {
  return res.json().then(function (data) {
    if (!res.ok) {
      throw new Error(data.error || ("Server error " + res.status));
    }
    if (!data.content) {
      throw new Error("Empty response from AI.");
    }
    return data.content;
  });
}).catch(function (err) {
  if (err.message && (err.message.toLowerCase().indexOf("failed to fetch") !== -1 || err.name === "TypeError")) {
    throw new Error("Could not reach the PromptForge server. Refresh the page and try again.");
  }
  throw err;
});
