import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Verify API key / connectivity
app.post("/api/verify", async (req, res) => {
  const { model, apiKey } = req.body;

  try {
    if (model === "gemini") {
      const activeKey = apiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return res.status(400).json({ 
          success: false, 
          message: "No Gemini API key found. Please provide an API key or ensure GEMINI_API_KEY is configured in the environment." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: activeKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Respond with only one word: Connected.",
      });

      if (response.text && response.text.trim().toLowerCase().includes("connected")) {
        return res.json({ success: true, message: "Successfully connected to Gemini API!" });
      } else {
        return res.status(500).json({ success: false, message: "Unexpected response from Gemini." });
      }
    } else if (model === "openai") {
      if (!apiKey) {
        return res.status(400).json({ success: false, message: "OpenAI API key is required." });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Respond with only one word: Connected." }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        if (content.trim().toLowerCase().includes("connected")) {
          return res.json({ success: true, message: "Successfully connected to OpenAI API!" });
        }
      }
      const errText = await response.text();
      return res.status(response.status).json({ success: false, message: `OpenAI connection failed: ${errText || response.statusText}` });
    } else if (model === "claude") {
      if (!apiKey) {
        return res.status(400).json({ success: false, message: "Anthropic Claude API key is required." });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-the-api-key-on-the-client": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 10,
          messages: [{ role: "user", content: "Respond with only one word: Connected." }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content?.[0]?.text || "";
        if (content.trim().toLowerCase().includes("connected")) {
          return res.json({ success: true, message: "Successfully connected to Anthropic Claude API!" });
        }
      }
      const errText = await response.text();
      return res.status(response.status).json({ success: false, message: `Claude connection failed: ${errText || response.statusText}` });
    } else {
      return res.status(400).json({ success: false, message: `Unsupported model type: ${model}` });
    }
  } catch (error: any) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, message: error.message || "An unexpected error occurred during verification." });
  }
});

// API: Autocomplete/Creative Sounding Board (@idea and @fix)
app.post("/api/complete", async (req, res) => {
  const { precedingText, tag, model, apiKey, trailingText } = req.body;

  if (!precedingText && precedingText !== "") {
    return res.status(400).json({ error: "Preceding text is required." });
  }

  try {
    let prompt = "";
    let systemInstruction = "";

    if (tag === "@idea") {
      systemInstruction = 
        "You are Scribe's literary sounding board, an elegant, comforting, and cozy creative companion. " +
        "Your role is to support the writer's creativity, acting as a sounding board that explores their sea of ideas alongside them. " +
        "Do NOT discuss coding, programming, software development, politics, or unrelated topics unless the user is explicitly writing a creative story/essay about it. " +
        "Always adhere to safety guidelines. " +
        "Analyze the user's written content carefully to understand its context, genre, tone, characters, setting, and style. " +
        "Detect whether the user's text ends with a narrative flow (a story in progress needing a next development) or if it contains an explicit request or question seeking creative ideas/brainstorming suggestions (e.g., asking for plot twists, names, character backgrounds, descriptions, or solutions). " +
        "If they are explicitly asking for suggestions or brainstorming options, directly provide a highly creative, inspiring, and beautiful set of specific idea suggestions that match their request and context. " +
        "If it is a narrative flow, provide a beautiful, evocative, and cozy continuation of 1 to 3 sentences (or a short paragraph) that naturally develops the plot or introduces an inspiring creative idea. " +
        "Do NOT repeat the user's preceding text. Do NOT include any introductory or meta-chatter like 'Sure, here is...' or 'Here are some suggestions:'. Output ONLY the clean continuation or suggestion text, ready to be appended directly to their note.";

      prompt = `Here is the user's written content as the basis and context:\n\n"""\n${precedingText}\n"""\n\nIdentify the context, style, and what specific idea suggestion the user is looking for. Generate the highly specific creative idea suggestion or continuation to help them overcome their block. Output ONLY the raw content to insert.`;
    } else if (tag === "@fix") {
      systemInstruction =
        "You are Scribe's master literary editor. Your task is strictly limited to identifying and correcting any grammatical mistakes, spelling errors, typos, or punctuation issues in the provided text. " +
        "You must return ONLY the corrected text. Do NOT include any preamble, introduction, wrap-up, commentary, explanations, notes, formatting blocks, or conversational filler. " +
        "Do not offer suggestions or tips on how to write. If the text has no errors, return it exactly as it was provided. " +
        "Your entire response must consist exclusively of the corrected words or text, simple as that.";

      const textToFix = trailingText || precedingText;
      prompt = `Correct any spelling or grammar mistakes in the following text. Return ONLY the final corrected text, with absolutely no other text, comments, or explanations:\n\n${textToFix}`;
    } else {
      return res.status(400).json({ error: "Invalid tag. Must be @idea or @fix." });
    }

    // Process using chosen model
    if (model === "gemini") {
      const activeKey = apiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return res.status(400).json({ 
          error: "No Gemini API key found. Please set an API key in Profile Settings." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: activeKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      const responseText = result.text || "";
      return res.json({ completion: responseText });
    } else if (model === "openai") {
      if (!apiKey) {
        return res.status(400).json({ error: "OpenAI API key is required to use the OpenAI model." });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          temperature: 0.8,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content || "";
        return res.json({ completion: responseText });
      } else {
        const errText = await response.text();
        return res.status(response.status).json({ error: `OpenAI API returned error: ${errText}` });
      }
    } else if (model === "claude") {
      if (!apiKey) {
        return res.status(400).json({ error: "Anthropic Claude API key is required to use the Claude model." });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-the-api-key-on-the-client": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 500,
          system: systemInstruction,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const responseText = data.content?.[0]?.text || "";
        return res.json({ completion: responseText });
      } else {
        const errText = await response.text();
        return res.status(response.status).json({ error: `Claude API returned error: ${errText}` });
      }
    } else {
      return res.status(400).json({ error: `Unsupported model: ${model}` });
    }
  } catch (error: any) {
    console.error("AI Completion error:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
});

// Serve frontend assets or mount Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
