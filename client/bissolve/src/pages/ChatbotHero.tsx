import React from "react";
import "./ChatbotHero.css";

export default function ChatbotHero() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <span>🚀 AI-Powered Business Intelligence</span>
        </div>
        <h1 className="hero-title">
          Welcome to <span className="gradient-text">BizBot</span>
        </h1>
        <p className="hero-description">
          Your intelligent business companion for strategic insights, market analysis, 
          and data-driven decision making. Experience the future of business consulting.
        </p>
        <div className="hero-features">
          <div className="feature">
            <div className="feature-icon">📊</div>
            <span>Market Analysis</span>
          </div>
          <div className="feature">
            <div className="feature-icon">💡</div>
            <span>Strategic Insights</span>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <span>Real-time Advice</span>
          </div>
        </div>
        <div className="cta-section">
          <p className="cta-text">Click the business icon to start your consultation</p>
          <div className="arrow-indicator">
            <span>💼</span>
            <div className="arrow">↘</div>
          </div>
        </div>
      </div>
      <div className="hero-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </div>
  );
} 