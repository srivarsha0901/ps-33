import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatbotHero from "./ChatbotHero";
import "./Chatbot.css";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to clean and format the bot response
  const cleanBotResponse = (text: string) => {
    return text
      // Remove markdown formatting (but preserve newlines)
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      // Convert markdown bullets to clean bullets
      .replace(/^\- /gm, '• ')
      .replace(/\n\- /g, '\n• ')
      .replace(/^\* /gm, '• ')
      .replace(/\n\* /g, '\n• ')
      // Clean up excessive line breaks (3+ becomes 2)
      .replace(/\n{3,}/g, '\n\n')
      // Clean up multiple spaces within a line (but preserve newlines)
      .replace(/[^\S\n]+/g, ' ')
      .trim();
  };

  // Function to format text with proper line breaks and bullet points
  const formatMessage = (text: string) => {
    const cleaned = cleanBotResponse(text);
    return cleaned.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Style bullet points
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="bullet-point">
            {line.trim()}
          </div>
        );
      }
      
      return (
        <div key={index} className="text-line">
          {line}
        </div>
      );
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:3000/chat", {
        message: input,
      });
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        const botMsg: Message = { 
          sender: "bot", 
          text: res.data.reply, 
          timestamp: new Date() 
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 1500);
    } catch {
      setTimeout(() => {
        const errorMsg: Message = { 
          sender: "bot", 
          text: "💼 Sorry, I'm temporarily unavailable. Please try again.", 
          timestamp: new Date() 
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsTyping(false);
      }, 1500);
    }
  };

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        const welcomeMsg: Message = {
          sender: "bot",
          text: "Welcome to BizBot! 💼 Your intelligent business assistant. I'm here to help with business insights, strategies, and solutions. How can I assist you today?",
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
      }, 500);
    }
  }, [open]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <ChatbotHero />
      
      <div className={`bizbot-widget ${darkMode ? 'dark-mode' : ''}`}>
        <div className={`toggle-btn ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}>
          <div className="btn-icon">
            {open ? '✕' : '💼'}
          </div>
          {!open && <div className="pulse-ring"></div>}
        </div>

        <div className={`chat-window ${open ? 'open' : ''}`}>
          <div className="header">
            <div className="header-content">
              <div className="bot-avatar">🤖</div>
              <div className="header-text">
                <h3>BizBot</h3>
                <span className="status">● Online</span>
              </div>
              <div className="header-controls">
                <button 
                  className="theme-toggle" 
                  onClick={toggleTheme}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? '☀' : '🌙'}
                </button>
              </div>
            </div>
            <div className="header-bg"></div>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-container ${msg.sender}`}>
                <div className={`msg ${msg.sender}`}>
                  <div className="msg-content">
                    {msg.sender === 'bot' ? formatMessage(msg.text) : msg.text}
                  </div>
                  <div className="msg-time">
                    {msg.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="msg-container bot">
                <div className="msg bot typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input">
            <input
              placeholder="Type your business question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="send-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}