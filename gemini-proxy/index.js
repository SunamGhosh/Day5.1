// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// app.post("/ask", async (req, res) => {
//   const { query } = req.body;
//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: query }] }],
//         }),
//       }
//     );

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error connecting to Gemini API" });
//   }
// });

// app.listen(3000, () => console.log("Gemini api running on port 3000"));
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.send("🚀 Gemini Proxy is running successfully on Render!");
});
app.post("/ask", async (req, res) => {
  const { query } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  try {
    console.log("Incoming Query:", query);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }],
        }),
      }
    );

    const text = await response.text(); // 👈 capture raw body first
    console.log("Gemini raw response:", text);

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Error connecting to Gemini API", details: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
