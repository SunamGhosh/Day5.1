import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

// /gemini ROUTE WITH LOGGING
app.post("/gemini", async (req, res) => {
  console.log("=== GEMINI ROUTE HIT! ===");
  console.log("Prompt received:", req.body.prompt);

  try {
    const { prompt } = req.body;
    if (!prompt) {
      console.log("ERROR: No prompt sent");
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Calling Gemini API with key:", API_KEY ? "SET" : "MISSING");
    
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    console.log("Gemini API status:", apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Gemini API Error:", errorText);
      return res.status(apiResponse.status).json({ error: "Gemini API error", details: errorText });
    }

    const data = await apiResponse.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
    console.log("Gemini reply length:", reply.length);

    res.json({ reply });
    console.log("Response sent to client");

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// /ping route
app.get("/ping", (req, res) => {
  res.json({ status: "alive", time: new Date().toISOString() });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Sunam Bot API is running! Try POST /gemini" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: https://chatbot-4ocx.onrender.com/gemini`);
  console.log(`Ping URL: https://chatbot-4ocx.onrender.com/ping`);
});