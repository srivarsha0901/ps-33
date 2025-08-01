const express = require("express");
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

// Dummy reply logic — replace with OpenAI if needed
const getBotReply = (message) => {
  if (message.toLowerCase().includes("grow business")) {
    return "To grow your business, focus on customer engagement, branding, and digital channels.";
  }
  return `You said: ${message}`;
};

// POST /api/chat
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const userMsg = new ChatMessage({ from: "user", text: message });
    await userMsg.save();

    const reply = getBotReply(message);
    const botMsg = new ChatMessage({ from: "bot", text: reply });
    await botMsg.save();

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Chat error" });
  }
});

// GET /api/chat/history
router.get("/chat/history", async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
