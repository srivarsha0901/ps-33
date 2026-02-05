# 🚀 Quick Start Guide - Enhanced Email Generator

Get your AI-powered email system up and running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client/bissolve
npm install
```

### 2. Configure Environment
```bash
# Run the interactive setup
cd server
npm run setup
```

Follow the prompts to configure:
- Gmail account and app password
- Gemini API key
- Server settings

### 3. Start the System
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client/bissolve
npm run dev
```

### 4. Test the System
```bash
# Test all features
cd server
npm test
```

## 🎯 What You Get

### ✨ Enhanced Features
- **AI Email Generation** with Gemini AI
- **Beautiful UI** with animations and progress tracking
- **Bulk Email Sending** with rate limiting
- **Template Management** for reusable emails
- **Multiple Input Methods** (CSV, Excel, manual)
- **Real-time Progress** tracking
- **Email Validation** and duplicate detection

### 🎨 Modern Interface
- **Step-by-step workflow** with progress indicators
- **Responsive design** that works on all devices
- **Smooth animations** using Framer Motion
- **Professional styling** with Tailwind CSS
- **Intuitive navigation** with clear visual feedback

### 🔧 Advanced Backend
- **Enhanced error handling** with detailed messages
- **Rate limiting** to prevent spam filters
- **Batch processing** for efficient bulk sending
- **Content validation** for security
- **Comprehensive logging** for debugging

## 📧 Usage Examples

### Generate a Newsletter
1. Select "Newsletter" type
2. Choose "Professional" tone
3. Enter topic: "Weekly Tech Updates"
4. Click "Generate Email with AI"
5. Preview and approve content
6. Add recipients
7. Send to all recipients

### Send Marketing Email
1. Select "Marketing" type
2. Choose "Friendly" tone
3. Enter topic: "Summer Sale"
4. Generate content with AI
5. Upload recipient list via CSV
6. Send with progress tracking

## 🔑 API Keys Needed

### Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate password for "Mail"
5. Use this password in setup

### Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy and use in setup

## 🐛 Troubleshooting

### Common Issues
- **Email not sending**: Check Gmail app password
- **AI generation failing**: Verify Gemini API key
- **Frontend not loading**: Ensure server is running on port 5000

### Quick Fixes
```bash
# Check server health
curl http://localhost:5000/health

# Test email generation
curl -X POST http://localhost:5000/api/generate-email \
  -H "Content-Type: application/json" \
  -d '{"topic":"test","emailType":"newsletter","tone":"professional"}'

# Run full test suite
cd server && npm test
```

## 📊 System Requirements

- **Node.js**: v16 or higher
- **Memory**: 512MB RAM minimum
- **Storage**: 100MB free space
- **Network**: Internet connection for AI and email

## 🎉 Success Indicators

✅ Server starts without errors
✅ Health check returns "OK"
✅ Email generation works
✅ Template system loads
✅ Frontend connects to backend
✅ All tests pass

## 📚 Next Steps

1. **Read EMAIL_SETUP.md** for detailed configuration
2. **Customize templates** for your business needs
3. **Set up monitoring** for production use
4. **Configure backup** for important data
5. **Test with small batches** before bulk sending

## 🆘 Need Help?

1. Check the troubleshooting section
2. Review server logs for errors
3. Run the test suite: `npm test`
4. Verify environment variables
5. Check network connectivity

---

**Ready to send professional emails with AI? Start with `npm run setup`! 🚀** 