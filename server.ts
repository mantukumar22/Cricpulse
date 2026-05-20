import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI on the server side securely
const geminiKey = process.env.GEMINI_API_KEY || "AIzaSyB13UAfY7fyv_YLngCOr99KpBml-brBrGo";
const cricketKey = process.env.CRICKET_API_KEY || "bf0602c0-23dc-4cc9-b7ed-c3cd64bc25ae";

const ai = new GoogleGenAI({
  apiKey: geminiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Cache for Cricket Matches to avoid rate limits
let cachedMatches: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 60 seconds

// 1. Live Cricket Matches Endpoint (SECURE: Cricket Key is never sent to browser)
app.get("/api/cricket/matches", async (req, res) => {
  const currentTime = Date.now();
  if (cachedMatches && (currentTime - lastFetchTime < CACHE_TTL_MS)) {
    return res.json({ source: "cache", ...cachedMatches });
  }

  try {
    const url = `https://api.cricapi.com/v1/currentMatches?apikey=${cricketKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Cricket API returned status ${response.status}`);
    }
    const data = await response.json();
    cachedMatches = data;
    lastFetchTime = currentTime;
    res.json({ source: "live", ...data });
  } catch (error: any) {
    console.error("Error fetching live matches:", error.message);
    // Graceful fallback lists or old cached copies if available
    if (cachedMatches) {
      res.json({ source: "cache-fallback", status: "success", info: "using cached matches due to upstream failure", ...cachedMatches });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to connect to Cricket Data API",
        error: error.message
      });
    }
  }
});

// 2. AI Live Commentary generator (SECURE: Gemini Key remains server-only)
app.post("/api/gemini/commentary", async (req, res) => {
  const { matchState } = req.body;

  if (!matchState) {
    return res.status(400).json({ error: "Missing match state details for generated commentary" });
  }

  const {
    battingTeam,
    bowlingTeam,
    runs,
    wickets,
    oversCompleted,
    ballsCurrentOver,
    batsmen,
    bowler,
    recentBalls
  } = matchState;

  const currentOverStr = `${oversCompleted}.${ballsCurrentOver}`;
  const recentBallsStr = recentBalls && recentBalls.length > 0 ? recentBalls.join(" | ") : "None";
  const batsmanA = batsmen?.[0] ? `${batsmen[0].name} (${batsmen[0].runs} runs, ${batsmen[0].balls} balls)` : "N/A";
  const batsmanB = batsmen?.[1] ? `${batsmen[1].name} (${batsmen[1].runs} runs, ${batsmen[1].balls} balls)` : "N/A";
  const bowlerName = bowler ? `${bowler.name} (economy: ${bowler.economy || 'N/A'})` : "N/A";

  const aiPrompt = `You are a legendary, super-energetic Hindi-English (Hinglish) IPL TV cricket commentator, famous for catchy phrases, witty metaphors, enthusiastic yelling, and tactical breakdowns. It is the IPL tournament!
Generate a single-paragraph live, dramatic, high-energy professional Commentary byte for the current moment based on this exact real-time game situation:
Match: ${battingTeam} is batting against ${bowlingTeam}.
Score: ${runs}/${wickets} in ${currentOverStr} overs.
Recent deliveries in this over: [${recentBallsStr}].
Batsman on strike: ${batsmanA}. Non-striker: ${batsmanB}.
Current bowl delivered by: ${bowlerName}.

Maintain extreme hype. Focus on what might happen next, or analyze who is dominating this exact ball! Keep your response under 100 words. Do not put markdown headers, just return raw comment text directly.`;

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: aiPrompt,
      config: {
        temperature: 0.85,
        systemInstruction: "You are Ravi Shastri and Harsha Bhogle combined into an ultra-high energy Hinglish cricket analyst."
      }
    });

    const commentary = aiResponse.text?.trim() || "What a tactical match we have on our hands! Excellent fielding and extreme intensity by both sides.";
    res.json({ success: true, commentary });
  } catch (error: any) {
    const errMsg = typeof error === 'object' ? JSON.stringify(error) : String(error);
    const isQuota = errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("exhausted") || errMsg.toLowerCase().includes("429");
    console.error("Gemini AI Commentary failure:", errMsg);
    res.status(isQuota ? 429 : 500).json({
      success: false,
      error: error.message || errMsg,
      isQuotaExceeded: isQuota,
      commentary: "Unbelievable game of cricket! The atmosphere at the stadium is electric right now. (Our interactive AI commentator has exhausted its free daily sandbox quota, but the game is still roaring!)"
    });
  }
});

// 3. AI Assistant / Analyst Chatbot Endpoint (SECURE: Gemini Key server-only)
app.post("/api/gemini/ai-assistant", async (req, res) => {
  const { userMessage, chatHistory, matchState } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "Empty user message" });
  }

  // Construct context prompt incorporating match status
  let stateContext = "";
  if (matchState) {
    stateContext = `Current live game data: ${matchState.battingTeam} is batting vs ${matchState.bowlingTeam} at ${matchState.runs}/${matchState.wickets} in ${matchState.oversCompleted}.${matchState.ballsCurrentOver} overs. Recent balls: [${matchState.recentBalls?.join(", ") || 'none'}].`;
  }

  const systemInstruction = `You are "CricPulse AI Analyst", an intelligent, friendly, and super-informed IPL cricket expert.
You help fans analyze live match situations, player stats, team strategies, history of matches, and cricket trivia.
Always write short, highly scannable, engaging responses (max 150 words). Format with clear bullet points if helpful.
Feel free to use Hinglish (Hindi + English) words like "Thala", "Bhajji", "Wicket-to-wicket", "Paltan", etc., to match the passionate fan vibe.
Here is the context of the user's active screen: ${stateContext}`;

  try {
    // Generate simple content incorporating history
    // Since it's a stateless API proxy, we can pass system instruction and prefix the prompt with history & latest question
    let promptWithContext = "";
    if (chatHistory && chatHistory.length > 0) {
      const historyStr = chatHistory.slice(-5).map((h: any) => `${h.sender === 'user' ? 'Fan' : 'CricPulse AI'}: ${h.text}`).join("\n");
      promptWithContext = `Chat history:\n${historyStr}\n\nFan: ${userMessage}\n\nCricPulse AI:`;
    } else {
      promptWithContext = `Fan: ${userMessage}\n\nCricPulse AI:`;
    }

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptWithContext,
      config: {
        temperature: 0.7,
        systemInstruction: systemInstruction,
      }
    });

    const reply = aiResponse.text?.trim() || "That's a stellar tactical question! Looking at the overs, they need to rotate strike and avoid risk.";
    res.json({ success: true, reply });
  } catch (error: any) {
    const errMsg = typeof error === 'object' ? JSON.stringify(error) : String(error);
    const isQuota = errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("exhausted") || errMsg.toLowerCase().includes("429");
    console.error("Gemini AI Assistant Chat failure:", errMsg);
    res.status(isQuota ? 429 : 500).json({
      success: false,
      error: error.message || errMsg,
      isQuotaExceeded: isQuota,
      reply: "Arre! My analysis engine hit a rate boundary at this moment. We have exhausted our sandbox's free daily inquiries/token quota! Please configure your custom key in Settings."
    });
  }
});

// Configure Vite as Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Loading Vite dev server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve client router fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CricPulse full-stack server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
