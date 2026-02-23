import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, PieChart, ShieldCheck, Download, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">
          <Zap className="primary-color" />
          <span>KharchaAI</span>
        </div>
        <button className="auth-btn-sm" onClick={() => navigate('/auth')}>Login</button>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Smart Kharcha, <span className="gradient-text">Zero Stress.</span></h1>
          <p>
            Track your expenses with AI. Just tell KharchaAI what you spent,
            and we'll handle the rest—categorization, charts, and budget alerts.
          </p>
          <div className="hero-btns">
            <button className="hero-btn-primary" onClick={() => navigate('/auth?signup=true')}>Get Started Free</button>
            <button className="hero-btn-secondary" onClick={() => document.getElementById('features').scrollIntoView()}>Explore Features</button>
          </div>
        </div>
        <div className="hero-visual">
          {/* Mockup or dynamic visual here */}
          <div className="glass-card mockup-card">
            <div className="card-header">Total Spending</div>
            <div className="card-amount">₹12,450</div>
            <div className="card-footer">↑ 12% from last month</div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="section-title">Why choose KharchaAI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Zap className="feature-icon" />
            <h3>AI Extraction</h3>
            <p>Don't type. Just say "Spent 50 on chai" and we'll record it instantly.</p>
          </div>
          <div className="feature-card">
            <PieChart className="feature-icon" />
            <h3>Visual Insights</h3>
            <p>Beautiful charts show exactly where your money is going.</p>
          </div>
          <div className="feature-card">
            <ShieldCheck className="feature-icon" />
            <h3>Budget Alerts</h3>
            <p>Set a limit and get warned before you overspend.</p>
          </div>
          <div className="feature-card">
            <Download className="feature-icon" />
            <h3>Easy Export</h3>
            <p>Download your data in Excel or CSV anytime for your records.</p>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <h2 className="section-title">How to Start</h2>
        <div className="guide-steps">
          <div className="step">
            <span className="step-num">1</span>
            <p>Create an account or Sign In.</p>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <p>Speak or Type your expense (e.g., "Food 200").</p>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <p>See your dashboard update in real-time!</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 KharchaAI. Smartly managing your Kharcha.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
