import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const apiRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok",
        messages: [
          { role: "user", content: req.body.message || "Hello" }
        ]
      })
    });

    const data = await apiRes.json();

    // 🔴 IMPORTANT: safety check
    if (!data.choices || !Array.isArray(data.choices)) {
      console.error("RAW API RESPONSE:", data);
      return res.status(500).json({
        error: "Invalid API response",
        api_response: data
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
