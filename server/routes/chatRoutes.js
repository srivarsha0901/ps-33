const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Enhanced and more restrictive prompt for professional business responses
    const businessPrompt = `You are BizBot, a professional business consultant AI assistant. You must ONLY provide appropriate, professional business advice.

STRICT GUIDELINES:
- Only answer business-related questions (strategy, finance, marketing, operations, management, technology, entrepreneurship)
- Always maintain a professional, respectful tone
- Provide factual, actionable business insights
- If asked non-business questions, politely redirect to business topics
- Never provide inappropriate, offensive, or non-professional content
- Use simple formatting without asterisks or complex markdown

FORMATTING RULES:
- No asterisks (*) for emphasis
- Use bullet points with • symbol only when necessary
- Keep responses clear and concise
- Separate main points with line breaks

BUSINESS FOCUS AREAS:
• Strategic planning and business development
• Financial analysis and budgeting
• Marketing and customer acquisition
• Operations and process optimization
• Leadership and team management
• Technology and digital transformation
• Market research and competitive analysis
• Risk management and compliance

If the user asks about topics outside business (personal advice, entertainment, etc.), respond: "I'm BizBot, specialized in business consulting. Let me help you with business strategy, operations, finance, or marketing instead. What business challenge can I assist you with?"

User question: "${message}"

Professional business response:`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY1}`,
      {
        contents: [{ parts: [{ text: businessPrompt }] }],
        generationConfig: {
          temperature: 0.3, // Reduced for more consistent, professional responses
          topK: 20,         // More focused responses
          topP: 0.8,        // Less randomness
          maxOutputTokens: 600, // Concise responses
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I'm having trouble processing your business question. Could you please rephrase it?";

    // Enhanced text cleaning for professional responses
    botReply = botReply
      // Remove all markdown formatting
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      // Convert markdown bullets to clean bullets
      .replace(/^\- /gm, '• ')
      .replace(/\n\- /g, '\n• ')
      .replace(/^\* /gm, '• ')
      .replace(/\n\* /g, '\n• ')
      // Clean up spacing
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();

    // Additional content filter for business appropriateness
    const inappropriateWords = ['inappropriate', 'offensive', 'personal', 'dating', 'relationship'];
    const hasInappropriate = inappropriateWords.some(word => 
      botReply.toLowerCase().includes(word.toLowerCase())
    );

    if (hasInappropriate || botReply.length < 20) {
      botReply = "I'm BizBot, your professional business consultant. I can help you with business strategy, financial planning, marketing, operations, and management. What business challenge would you like to discuss?";
    }

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    
    // Professional error responses
    let errorMessage = "I'm temporarily unable to provide business insights. Please try your question again.";
    
    if (error.response?.status === 429) {
      errorMessage = "I'm currently managing high demand. Please wait a moment and ask your business question again.";
    } else if (error.response?.status === 401) {
      errorMessage = "There's a configuration issue with my business intelligence service. Please contact our support team.";
    } else if (error.response?.status === 400) {
      errorMessage = "I couldn't process that request. Please ensure your question is business-related and try again.";
    }
    
    res.status(500).json({ 
      error: "Business consultation service error",
      reply: errorMessage
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ 
    status: "active", 
    service: "BizBot Business Intelligence",
    apiConnected: !!process.env.GEMINI_API_KEY1
  });
});

module.exports = router;
