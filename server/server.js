const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const cors = require("cors");

const OpenAI = require("openai");

const nodemailer = require('nodemailer');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const authRoutes = require("./routes/authRoutes");



dotenv.config();



const app = express();



// ✅ CORS configuration - Allow all localhost ports in development

app.use(cors({

  origin: function (origin, callback) {

    // Allow requests with no origin (like mobile apps or curl requests)

    if (!origin) return callback(null, true);

   

    // In development, allow all localhost ports

    if (process.env.NODE_ENV === 'development') {

      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {

        return callback(null, true);

      }

    }

   

    // In production, you can specify exact origins

    const allowedOrigins = [

      'http://localhost:5173',

      'http://localhost:5174',

      'http://localhost:5175',

      'http://localhost:3000'

    ];

   

    if (allowedOrigins.includes(origin)) {

      callback(null, true);

    } else {

      callback(new Error('Not allowed by CORS'));

    }

  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization']

}));



app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true }));



// ✅ Connect to MongoDB (optional)

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI)

  .then(() => {

    console.log("✅ MongoDB Connected Successfully");

  })

  .catch((err) => {

    console.error("❌ MongoDB Connection Failed:", err.message);

  });



// Start server regardless of MongoDB connection status

app.listen(PORT, () => {

  console.log(`🚀 Enhanced Email Server running on port ${PORT}`);

  console.log(`📧 Email features: AI generation, bulk sending, templates`);

  console.log(`🔗 Health check: http://localhost:${PORT}/health`);

});



// ✅ Auth routes

app.use("/api/auth", authRoutes);



// ✅ Optional backend test route

app.get("/", (req, res) => {

  res.send("✅ Backend is working");

});



// ✅ OpenAI API for website generation

const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY2,

  baseURL: "https://openrouter.ai/api/v1",

});



// ✅ Gemini AI setup for email generation

// Use GEMINI_API_KEY1 consistently across all services

const GEMINI_API_KEY = process.env.GEMINI_API_KEY1;

let genAI;



if (GEMINI_API_KEY) {

  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  console.log('🔑 Gemini API initialized for email generation');

} else {

  console.warn('⚠️ GEMINI_API_KEY1 not found - email generation will not work');

}



// ✅ Email transporter setup

let transporter;



function initializeTransporter() {

  try {

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {

      console.warn('⚠️ Email credentials not configured - email sending will not work');

      return false;

    }



    transporter = nodemailer.createTransport({

      service: 'gmail',

      auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASSWORD

      }

    });

   

    console.log('📧 Email transporter initialized');

    return true;

  } catch (error) {

    console.error('❌ Failed to initialize email transporter:', error);

    return false;

  }

}



initializeTransporter();



// Email generation helper functions

const emailTemplates = {

  newsletter: {

    subject: 'Your Weekly Newsletter',

    structure: 'newsletter with sections, engaging headlines, and call-to-action',

    purpose: 'inform and engage subscribers with valuable content'

  },

  marketing: {

    subject: 'Special Offer Just for You',

    structure: 'marketing email with compelling offer, benefits, and strong CTA',

    purpose: 'promote products/services and drive sales'

  },

  announcement: {

    subject: 'Important Announcement',

    structure: 'clear announcement with details and next steps',

    purpose: 'communicate important business updates or news'

  },

  promotional: {

    subject: 'Limited Time Offer',

    structure: 'promotional email with discount/offer details and urgency',

    purpose: 'drive immediate action with special offers'

  },

  welcome: {

    subject: 'Welcome to Our Community',

    structure: 'welcoming new customers/subscribers with next steps',

    purpose: 'onboard new customers and build relationships'

  },

  followup: {

    subject: 'Following Up on Your Interest',

    structure: 'follow-up email with additional value and next steps',

    purpose: 'nurture leads and maintain engagement'

  },

  custom: {

    subject: 'Custom Email',

    structure: 'custom email based on user prompt',

    purpose: 'address specific business needs'

  }

};



const toneGuidelines = {

  professional: 'formal, business-like, respectful, authoritative',

  casual: 'friendly, relaxed, conversational, approachable',

  friendly: 'warm, approachable, helpful, personal',

  formal: 'dignified, proper, official, traditional',

  enthusiastic: 'energetic, exciting, motivational, passionate',

  trustworthy: 'reliable, honest, credible, reassuring'

};



function stripHtml(html) {

  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

}



function generateFallbackContent(prompt, tone, emailType) {

  const subject = `${emailType.charAt(0).toUpperCase() + emailType.slice(1)}: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`;

 

  const html = `

<!DOCTYPE html>

<html>

<head>

    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${subject}</title>

</head>

<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; line-height: 1.6;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

        <!-- Header -->

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">

            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">

                ${subject}

            </h1>

        </div>

       

        <!-- Content -->

        <div style="padding: 40px 30px; color: #333;">

            <h2 style="color: #4A90E2; margin: 0 0 20px 0;">Hello!</h2>

            <p style="font-size: 16px; margin-bottom: 20px;">

                We're excited to share this important update with you regarding: <strong>${prompt}</strong>

            </p>

           

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4A90E2;">

                <p style="margin: 0; font-size: 16px; color: #555;">

                    This ${emailType} email was generated to address your specific needs. We've crafted this message with a ${tone} tone to ensure it resonates with you and provides valuable information.

                </p>

            </div>

           

            <p style="font-size: 16px; margin-bottom: 30px;">

                Thank you for your continued interest and support. We look forward to connecting with you soon!

            </p>

           

            <!-- CTA Button -->

            <div style="text-align: center; margin: 30px 0;">

                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">

                    Learn More

                </a>

            </div>

        </div>

       

        <!-- Footer -->

        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">

            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">

                Thank you for choosing our services

            </p>

            <p style="margin: 0; color: #9ca3af; font-size: 12px;">

                This email was generated with AI assistance

            </p>

        </div>

    </div>

</body>

</html>`;



  return {

    subject,

    html,

    plainText: stripHtml(html)

  };

}

async function generateEmailFromPrompt(prompt, tone = 'professional', emailType = 'newsletter') {
  try {
    if (!genAI) throw new Error('Gemini API not configured');

    // ✅ Using the 2.0-flash model ID confirmed by your discovery script
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.0-flash" }, 
      { apiVersion: 'v1' }
    );
    
    const enhancedPrompt = `
      Act as an Elite Copywriter. 
      Topic: ${prompt}
      Tone: ${tone}
      Type: ${emailType}

      CRITICAL DESIGN SPECIFICATION:
      - The email MUST be clearly visible. 
      - Use a dark container (#1a1a2e) with bright white or gold text for high contrast.
      - Center the content in a 600px wide card with 40px padding.
      - Use large, bold headings.
      - Ensure the Call-to-Action button is a vibrant blue (#3b82f6) with white text.

      Return ONLY a JSON object:
      {
        "subject": "Compelling subject line",
        "html": "Full HTML string with inline CSS for dark mode visibility",
        "plainText": "Clean text version"
      }`;

    console.log('🎯 Generating high-visibility email with Gemini 2.0...');
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean JSON extraction logic
    const startJson = text.indexOf('{');
    const endJson = text.lastIndexOf('}') + 1;
    if (startJson === -1) throw new Error("Invalid format");
    
    const jsonStr = text.substring(startJson, endJson);
    const parsed = JSON.parse(jsonStr);

    console.log("✅ High-Contrast Email Generated");
    return {
      subject: parsed.subject,
      html: parsed.html,
      plainText: parsed.plainText || stripHtml(parsed.html)
    };

  } catch (error) {
    console.error('❌ Generation Error:', error.message);
    throw error; // No more boring fallbacks!
  }
}
// ✅ Website Generation Route (existing)

app.post("/generate", async (req, res) => {

  const { prompt } = req.body;



  try {

    const chatCompletion = await openai.chat.completions.create({

      model: "meta-llama/llama-3-8b-instruct",

      messages: [

        {

          role: "system",

          content: `You are an expert web designer and developer.



Your task is to generate a complete and visually appealing one-page website as a JSON object with this format:

{

  "html": "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Digital Spark</title><link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap\" rel=\"stylesheet\"></head><body><header class=\"hero\"><div class=\"container\"><h1>Welcome to Digital Spark</h1><p>Creative solutions for a digital world</p><a href=\"#contact\" class=\"btn\">Get in Touch</a></div></header><section id=\"about\" class=\"section about\"><div class=\"container\"><h2>About Us</h2><p>We are a full-service digital agency delivering modern design, strategy, and tech services to brands worldwide.</p></div></section><section id=\"services\" class=\"section services\"><div class=\"container\"><h2>Services</h2><div class=\"grid\"><div class=\"card\"><h3>Design</h3><p>UX/UI, branding, and graphics that speak volumes.</p></div><div class=\"card\"><h3>Development</h3><p>Web, mobile, and scalable digital products.</p></div><div class=\"card\"><h3>Marketing</h3><p>SEO, ads, content, and outreach that convert.</p></div></div></div></section><section id=\"contact\" class=\"section contact\"><div class=\"container\"><h2>Contact Us</h2><form><input type=\"text\" placeholder=\"Name\" required><input type=\"email\" placeholder=\"Email\" required><textarea placeholder=\"Message\" required></textarea><button type=\"submit\">Send</button></form></div></section><footer class=\"footer\"><div class=\"container\"><p>&copy; 2025 Digital Spark Agency</p></div></footer></body></html>",

  "css": "body{margin:0;padding:0;font-family:'Roboto',sans-serif;background:#f4f4f4;color:#333;}h1,h2,h3{margin:0 0 10px;}p{margin:0 0 20px;}.container{width:90%;max-width:1200px;margin:0 auto;padding:20px;}.hero{background:#0f172a;color:#fff;text-align:center;padding:100px 20px;}.btn{display:inline-block;padding:10px 25px;background:#3b82f6;color:#fff;border:none;border-radius:5px;text-decoration:none;font-weight:bold;transition:background 0.3s;}.btn:hover{background:#2563eb;}.section{padding:60px 0;text-align:center;}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;}.card{background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);transition:transform 0.3s ease;}.card:hover{transform:translateY(-5px);}.form input,.form textarea{width:100%;padding:10px;margin:10px 0;border:1px solid #ccc;border-radius:4px;}.form button{padding:10px 20px;background:#3b82f6;color:#fff;border:none;border-radius:5px;cursor:pointer;}.form button:hover{background:#2563eb;}.footer{background:#1e293b;color:#fff;text-align:center;padding:20px 0;}"

}

 Guidelines:

- Do NOT include any markdown like \\\ or explanations.

- Only return raw, valid JSON.

- Use attractive color schemes and matching fonts.

- Ensure the site is mobile responsive (use Flexbox/Grid and media queries).

- Add hover effects or smooth transitions where appropriate.

- Design should reflect the business type and style (e.g., modern, elegant, bold).

- Include section-specific IDs/classes for better styling.

- Use Google Fonts (via <link> if needed).



Example sections to include: hero, about, services, testimonials, contact — depending on the input.



Do not output anything else except valid JSON`,

        },

        {

          role: "user",

          content: `Generate a beautiful, responsive website based on: ${prompt}`,

        },

      ],

    });



    let raw = chatCompletion.choices[0].message.content.trim();



    // ✅ Clean up and sanitize model response

    raw = raw.replace(/^```(json)?\s*/i, "").replace(/```$/i, "").trim();

    raw = raw.replace(/[""]/g, '"').replace(/[\u0000-\u001F]+/g, " ");



    let parsed;

    try {

      parsed = JSON.parse(raw);

    } catch (err) {

      console.warn("⚠️ JSON.parse() failed:", err.message);

      return res.status(500).json({

        error: "Invalid JSON response from model.",

        rawOutput: raw,

      });

    }



    res.json({

      html: parsed.html || "",

      css: parsed.css || "",

    });

  } catch (err) {

    console.error("API error:", err);

    res.status(500).json({ error: "Something went wrong while generating the website." });

  }

});



// ✅ NEW: Email Generation Routes



// Health check endpoint

app.get('/health', (req, res) => {

  res.json({

    status: 'Server is running',

    timestamp: new Date().toISOString(),

    services: {

      mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',

      website_generation: 'Available',

      email_generation: genAI ? 'Available' : 'Not configured',

      email_sending: transporter ? 'Available' : 'Not configured'

    },

    env_check: {

      OPENAI_API_KEY2: process.env.OPENAI_API_KEY2 ? 'Set' : 'Missing',

      GEMINI_API_KEY1: process.env.GEMINI_API_KEY1 ? 'Set' : 'Missing',

      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',

      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Missing'

    }

  });

});



// Generate email content endpoint

app.post('/api/generate-email', async (req, res) => {

  try {

    console.log('📧 Received email generation request');

    const { prompt, tone = 'professional', emailType = 'newsletter' } = req.body;



    if (!prompt || prompt.trim().length === 0) {

      return res.status(400).json({

        error: 'Prompt is required',

        message: 'Please provide a prompt for email generation'

      });

    }



    console.log('🎯 Generating email with Gemini AI...');

    const emailContent = await generateEmailFromPrompt(prompt.trim(), tone, emailType);



    console.log('✅ Email content generated successfully');

    res.json({

      subject: emailContent.subject,

      html: emailContent.html,

      plainText: emailContent.plainText

    });



  } catch (error) {

    console.error('❌ Email generation error:', error);

   

    let errorMessage = 'Failed to generate email content';

    let statusCode = 500;



    if (error.message.includes('API key')) {

      errorMessage = 'Invalid or missing Gemini API key';

      statusCode = 401;

    } else if (error.message.includes('quota')) {

      errorMessage = 'API quota exceeded. Please try again later';

      statusCode = 429;

    } else if (error.message.includes('network')) {

      errorMessage = 'Network error. Please check your connection';

      statusCode = 503;

    }



    res.status(statusCode).json({

      error: errorMessage,

      message: error.message

    });

  }

});



// Send email endpoint

app.post('/send-email', async (req, res) => {

  try {

    const { to, subject, html, text } = req.body;



    if (!to || !subject || (!html && !text)) {

      return res.status(400).json({

        error: 'Missing required fields',

        message: 'Email address, subject, and content are required'

      });

    }



    if (!transporter) {

      return res.status(500).json({

        error: 'Email service not configured',

        message: 'Email transporter is not properly initialized'

      });

    }



    console.log(`📧 Sending email to: ${to}`);



    const mailOptions = {

      from: process.env.EMAIL_USER,

      to: to,

      subject: subject,

      html: html,

      text: text || html.replace(/<[^>]*>/g, '')

    };



    const info = await transporter.sendMail(mailOptions);

   

    console.log(`✅ Email sent successfully to ${to}:`, info.messageId);



    res.json({

      success: true,

      message: 'Email sent successfully',

      messageId: info.messageId,

      recipient: to

    });



  } catch (error) {

    console.error('❌ Email sending error:', error);

   

    let errorMessage = 'Failed to send email';

   

    if (error.code === 'EAUTH') {

      errorMessage = 'Email authentication failed. Check your email credentials';

    } else if (error.code === 'ENOTFOUND') {

      errorMessage = 'Email service not found. Check your internet connection';

    } else if (error.responseCode === 550) {

      errorMessage = 'Invalid recipient email address';

    }



    res.status(500).json({

      error: errorMessage,

      message: error.message,

      code: error.code

    });

  }

});



// Test email endpoint

app.post('/test-email', async (req, res) => {

  try {

    if (!transporter) {

      return res.status(500).json({

        error: 'Email service not configured'

      });

    }



    await transporter.verify();



    res.json({

      success: true,

      message: 'Email service is properly configured and ready to send emails'

    });



  } catch (error) {

    console.error('❌ Email test failed:', error);

    res.status(500).json({

      error: 'Email service test failed',

      message: error.message

    });

  }

});



// Error handling middleware

app.use((error, req, res, next) => {

  console.error('Server error:', error);

  res.status(500).json({

    error: 'Internal server error',

    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'

  });

});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // System prompt to give the bot a "BizBot" personality
    const prompt = `
      You are BizBot, an elite AI Business Consultant. 
      Provide strategic, data-driven, and actionable advice.
      Keep responses professional yet approachable. 
      Use bullet points for clarity when providing steps or lists.
      
      User Question: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ reply: "I'm having trouble analyzing that business query right now." });
  }
});

// 404 handler

app.use((req, res) => {

  res.status(404).json({

    error: 'Endpoint not found',

    message: `The endpoint ${req.method} ${req.path} was not found`,

    availableEndpoints: [

      'GET /',

      'GET /health',

      'POST /generate (website)',

      'POST /api/generate-email',

      'POST /send-email',

      'POST /test-email',

      'POST /api/auth/*'

    ]

  });

});

