const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY1);
  try {
    // This calls the API to ask "What models can I actually use?"
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY1}`);
    const data = await response.json();
    
    console.log("--- YOUR AUTHORIZED MODELS ---");
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`✅ Use this ID: ${m.name.split('/')[1]}`);
      }
    });
  } catch (err) {
    console.error("❌ Error listing models:", err.message);
  }
}
listModels();