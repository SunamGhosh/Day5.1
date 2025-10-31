import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/gemini", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Gemini Proxy Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Gemini proxy running on port ${PORT}`));
