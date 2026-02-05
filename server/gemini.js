const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY1; // ✅ fixed typo
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');

console.log('🔑 Gemini API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
console.log('📨 SMTP config loaded:', SMTP_USER ? 'Yes' : 'No');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const emailTemplates = {
  newsletter: {
    subject: 'Your Weekly Newsletter',
    structure: 'newsletter with sections, engaging headlines, and call-to-action'
  },
  marketing: {
    subject: 'Special Offer Just for You',
    structure: 'marketing email with compelling offer, benefits, and strong CTA'
  },
  announcement: {
    subject: 'Important Announcement',
    structure: 'clear announcement with details and next steps'
  },
  custom: {
    subject: 'Custom Email',
    structure: 'custom email based on user prompt'
  }
};

const toneGuidelines = {
  professional: 'formal, business-like, respectful',
  casual: 'friendly, relaxed, conversational',
  friendly: 'warm, approachable, helpful',
  formal: 'dignified, proper, official'
};

async function generateEmailContent(topic, emailType = 'newsletter', tone = 'professional') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const template = emailTemplates[emailType] || emailTemplates['custom'];
    const toneGuide = toneGuidelines[tone] || toneGuidelines['professional'];

    const prompt = `
Generate a professional and engaging HTML email.

Topic: ${topic}
Email Type: ${emailType}
Tone: ${tone} (${toneGuide})
Structure: ${template.structure}

Requirements:
1. Create a compelling subject line
2. Generate professional HTML content with inline CSS for email compatibility
3. Include proper email structure with header, body, and footer
4. Make it mobile-responsive
5. Use engaging content that matches the tone
6. Include a clear call-to-action if appropriate
7. Ensure the HTML is clean and well-formatted

Return in this exact JSON format:
{
  "subject": "Your compelling subject line here",
  "html": "Your complete HTML email content with inline CSS",
  "plainText": "Plain text version of the email content"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response from Gemini");

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      subject: parsed.subject || `${topic} - ${emailType}`,
      html: parsed.html || `<html><body>${text}</body></html>`,
      plainText: parsed.plainText || parsed.html.replace(/<[^>]+>/g, '')
    };
  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    return {
      subject: "Email",
      html: `<p>Failed to generate content. Please try again.</p>`,
      plainText: "Failed to generate email"
    };
  }
}

async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // ✅ secure flag based on port
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: SMTP_USER,
      to,
      subject,
      html
    });

    return { success: true, to };
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    return { success: false, to, error: err.message };
  }
}

async function generateBulkEmails(topics, emailType = 'newsletter', tone = 'professional') {
  const results = [];
  for (let i = 0; i < topics.length; i++) {
    try {
      const content = await generateEmailContent(topics[i], emailType, tone);
      results.push({ topic: topics[i], content, success: true });
      if (i < topics.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // rate limit
      }
    } catch (error) {
      results.push({ topic: topics[i], error: error.message, success: false });
    }
  }
  return results;
}

function validateEmailContent(content) {
  const issues = [];
  if (!content.subject || content.subject.trim().length < 5) {
    issues.push('Subject line is too short');
  }
  if (!content.html || content.html.trim().length < 50) {
    issues.push('HTML content is too short');
  }
  if (content.html && content.html.includes('<script>')) {
    issues.push('HTML contains script tags');
  }
  return {
    isValid: issues.length === 0,
    issues
  };
}

module.exports = {
  generateEmailContent,
  generateBulkEmails,
  validateEmailContent,
  sendEmail,
  emailTemplates,
  toneGuidelines
};
