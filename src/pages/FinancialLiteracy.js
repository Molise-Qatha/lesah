import React, { useState, useEffect, useRef } from 'react';
import './FinancialLiteracy.css';
import { curriculumData } from '../data/financialLiteracyCurriculum';

// ── INTERSECTION OBSERVER HOOK ──────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── LEVELS ─────────────────────────────
const LEVELS = [
  { id: 'primary', icon: '🎒', label: { en: 'Primary School', st: 'Sekolo sa Mathomo' } },
  { id: 'high_school', icon: '📚', label: { en: 'High School', st: 'Sekolo se Phahameng' } },
  { id: 'university', icon: '🎓', label: { en: 'University', st: 'Univesithi' } },
];

// ── TOPICS ─────────────────────────────
const TOPICS = [
  { id: 'saving', icon: '💰', label: 'Saving' },
  { id: 'budgeting', icon: '📊', label: 'Budgeting' },
  { id: 'money', icon: '🪙', label: 'Money' },
  { id: 'needs_wants', icon: '⚖️', label: 'Needs & Wants' },
  { id: 'interest', icon: '📈', label: 'Interest' },
  { id: 'loans', icon: '🏦', label: 'Loans' },
  { id: 'debt', icon: '💳', label: 'Debt' },
  { id: 'investing', icon: '🌱', label: 'Investing' },
];

// ── QUICK QUESTIONS ────────────────────
const QUICK_QUESTIONS = [
  'What is saving?',
  'How does a budget work?',
  'What is interest?',
  'What is a loan?',
  'Needs vs wants?',
];

// ── AI INITIAL MESSAGES ────────────────
const INITIAL_MESSAGES = [
  {
    type: 'assistant',
    text: "Hi! 👋 I'm LeSAH, your financial literacy assistant.\nWhat would you like to learn about today?",
    time: 'Now',
  },
  {
    type: 'user',
    text: 'What is saving?',
    time: '2 min ago',
  },
  {
    type: 'assistant',
    text: 'Saving means keeping some of your money instead of spending all of it right away. It helps you have money for things you need later.\n\nExample: If you receive M100 and keep M20 for later, you have saved M20.',
    time: '2 min ago',
    related: 'Budgeting',
  },
];

// ── PROGRESS DATA ──────────────────────
const PROGRESS = {
  percent: 80,
  message: "Great job! 🎉",
  detail: "You're building strong money habits.",
  topicsExplored: '4 of 5',
  topicsLabel: 'beginner topics explored.',
};

// ── DAILY TIP ──────────────────────────
const DAILY_TIP = {
  text: 'Small savings become powerful habits when you make them consistently.',
  icon: '🌿',
};

// ── CONTINUE LEARNING ──────────────────
const CONTINUE_LEARNING = [
  { label: 'Budgeting', arrow: '→' },
  { label: 'Interest', arrow: '→' },
  { label: 'Needs & Wants', arrow: '→' },
];

// ── MAIN COMPONENT ─────────────────────
function FinancialLiteracy() {
  const [level, setLevel] = useState(() => localStorage.getItem('fl_level') || 'high_school');
  const [language, setLanguage] = useState(() => localStorage.getItem('fl_language') || 'english');
  const [activeTopic, setActiveTopic] = useState('saving');
  const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [heroRef, heroInView] = useInView(0.1);
  const [progressRef, progressInView] = useInView(0.3);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('fl_level', level);
  }, [level]);

  useEffect(() => {
    localStorage.setItem('fl_language', language);
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = (question) => {
    const text = question || chatInput.trim();
    if (!text || isTyping) return;
    
    setChatInput('');
    setChatMessages((prev) => [...prev, { type: 'user', text, time: 'Now' }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setChatMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  const getResponse = (question) => {
    const q = question.toLowerCase();
    if (q.includes('save') || q.includes('saving')) {
      return {
        type: 'assistant',
        text: 'Saving means setting aside some of your money for later instead of spending it all now. It helps you prepare for the future, handle emergencies, and reach your goals.\n\nExample: If you receive M100 and keep M20, you have saved M20.',
        time: 'Now',
        related: 'Budgeting',
      };
    }
    if (q.includes('budget') || q.includes('spending plan')) {
      return {
        type: 'assistant',
        text: 'A budget is a plan for your money. It helps you see how much you have and decide what to spend it on.\n\nExample: M50 pocket money — M20 snacks, M20 savings, M10 giving.',
        time: 'Now',
        related: 'Saving',
      };
    }
    if (q.includes('interest')) {
      return {
        type: 'assistant',
        text: 'Interest is extra money you earn when you save in a bank, or extra money you pay when you borrow.\n\nExample: Save M100 at 5% interest → you get M105 after one year.',
        time: 'Now',
        related: 'Loans',
      };
    }
    if (q.includes('loan')) {
      return {
        type: 'assistant',
        text: 'A loan is money you borrow and agree to pay back later, usually with extra money called interest.',
        time: 'Now',
        related: 'Interest',
      };
    }
    if (q.includes('need') || q.includes('want')) {
      return {
        type: 'assistant',
        text: 'Needs are things you must have to live (food, shelter). Wants are nice to have but you can live without (toys, fancy shoes).',
        time: 'Now',
        related: 'Budgeting',
      };
    }
    return {
      type: 'assistant',
      text: "That's a great question! I can help with saving, budgeting, interest, loans, needs vs wants, and more. Try asking about one of those topics!",
      time: 'Now',
      related: 'Saving',
    };
  };

  const handleQuickQuestion = (q) => {
    handleSendMessage(q);
  };

  const levelLabel = LEVELS.find((l) => l.id === level);
  const ui = curriculumData.ui[language] || curriculumData.ui.english;

  return (
    <div className="fl-redesign">
      {/* ═══════════ HERO ═══════════ */}
      <section className="flr-hero" ref={heroRef}>
        <div className="flr-hero-bg">
          <div className="flr-hero-glow flr-glow-1" />
          <div className="flr-hero-glow flr-glow-2" />
          <div className="flr-hero-particle flr-particle-1" />
          <div className="flr-hero-particle flr-particle-2" />
          <div className="flr-hero-particle flr-particle-3" />
          <div className="flr-hero-particle flr-particle-4" />
        </div>

        <div className={`flr-hero-content ${heroInView ? 'visible' : ''}`}>
          <div className="flr-hero-text">
            <span className="flr-badge">💡 LeSAH Financial Literacy</span>
            <h1>
              Learn Money.
              <br />
              <span className="flr-gold">Build Your Future.</span>
            </h1>
            <p>
              LeSAH's financial literacy assistant helps you understand money, make
              better financial decisions and develop strong financial habits from
              your first lessons through university life.
            </p>
            <div className="flr-hero-actions">
              <button className="flr-btn-primary" onClick={() => document.getElementById('flr-learning').scrollIntoView({ behavior: 'smooth' })}>
                Start Learning →
              </button>
              <button className="flr-btn-secondary" onClick={() => document.getElementById('flr-chat').scrollIntoView({ behavior: 'smooth' })}>
                Ask the Assistant →
              </button>
            </div>
          </div>

          <div className="flr-hero-character">
            <div className="flr-character-circle">
              <span className="flr-character-icon">🧑🏾‍🏫</span>
              <div className="flr-character-glow" />
            </div>
            <div className="flr-character-ring flr-ring-1" />
            <div className="flr-character-ring flr-ring-2" />
          </div>
        </div>
      </section>

      {/* ═══════════ LEVEL SELECTOR ═══════════ */}
      <section id="flr-learning" className="flr-section">
        <div className="flr-section-intro">
          <h2>Who are you learning for?</h2>
          <p>Choose your level so LeSAH can explain financial concepts at the right depth.</p>
        </div>
        <div className="flr-level-selector">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              className={`flr-level-btn ${level === lvl.id ? 'active' : ''}`}
              onClick={() => setLevel(lvl.id)}
            >
              <span className="flr-level-icon">{lvl.icon}</span>
              <span className="flr-level-label">{lvl.label[language === 'sesotho' ? 'st' : 'en']}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════ TOPIC NAVIGATION ═══════════ */}
      <section className="flr-topics-section">
        <div className="flr-topics-scroll">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              className={`flr-topic-btn ${activeTopic === topic.id ? 'active' : ''}`}
              onClick={() => setActiveTopic(topic.id)}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
          <button className="flr-topic-btn flr-view-all">
            View all topics →
          </button>
        </div>
      </section>

      {/* ═══════════ MAIN LEARNING AREA ═══════════ */}
      <section className="flr-workspace">
        <div className="flr-workspace-grid">
          {/* Left — Lesson */}
          <div className="flr-lesson">
            <span className="flr-lesson-icon">💰</span>
            <h3>SAVING</h3>
            <p className="flr-lesson-text">
              Saving means keeping some of your money instead of spending all of it.
            </p>
            <div className="flr-lesson-example">
              <strong>Example</strong>
              <p>If you receive M100 and keep M20 for later, you have saved M20.</p>
            </div>
            <div className="flr-lesson-why">
              <strong>Why it matters</strong>
              <p>Saving helps you prepare for the future, handle emergencies and reach your goals.</p>
            </div>
            <button className="flr-try-question-btn" onClick={() => handleQuickQuestion('What is saving?')}>
              Try a question →
            </button>
          </div>

          {/* Right — AI Chat */}
          <div id="flr-chat" className="flr-chat-panel">
            <div className="flr-chat-header">
              <span className="flr-chat-avatar">🤖</span>
              <div>
                <h3>Ask LeSAH</h3>
                <p>Have a question about money? Ask in your own words.</p>
              </div>
            </div>
            <div className="flr-chat-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flr-chat-msg flr-chat-${msg.type}`}>
                  <div className="flr-chat-bubble">
                    {msg.text.split('\n').map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        {j < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                    {msg.related && (
                      <button
                        className="flr-chat-related"
                        onClick={() => handleQuickQuestion(`What is ${msg.related.toLowerCase()}?`)}
                      >
                        Learn about: {msg.related} →
                      </button>
                    )}
                    <span className="flr-chat-time">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flr-chat-msg flr-chat-assistant">
                  <div className="flr-chat-bubble flr-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form
              className="flr-chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                placeholder="Ask me anything about money..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" disabled={isTyping || !chatInput.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════ QUICK QUESTIONS ═══════════ */}
      <section className="flr-quick-section">
        <div className="flr-quick-pills">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} className="flr-quick-pill" onClick={() => handleQuickQuestion(q)}>
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════ PROGRESS ═══════════ */}
      <section className="flr-progress-section" ref={progressRef}>
        <div className={`flr-progress ${progressInView ? 'visible' : ''}`}>
          <h3>Your Progress</h3>
          <div className="flr-progress-bar">
            <div className="flr-progress-fill" style={{ width: `${PROGRESS.percent}%` }} />
          </div>
          <p className="flr-progress-percent">{PROGRESS.percent}%</p>
          <p className="flr-progress-message">{PROGRESS.message}</p>
          <p className="flr-progress-detail">{PROGRESS.detail}</p>
          <p className="flr-progress-topics">{PROGRESS.topicsExplored} {PROGRESS.topicsLabel}</p>
        </div>
      </section>

      {/* ═══════════ DAILY TIP ═══════════ */}
      <section className="flr-tip-section">
        <div className="flr-tip">
          <span className="flr-tip-icon">{DAILY_TIP.icon}</span>
          <div>
            <h4>Today's Money Tip</h4>
            <p>{DAILY_TIP.text}</p>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTINUE LEARNING ═══════════ */}
      <section className="flr-continue-section">
        <h3>Continue Learning</h3>
        <div className="flr-continue-list">
          {CONTINUE_LEARNING.map((item, i) => (
            <button
              key={i}
              className="flr-continue-item"
              onClick={() => setActiveTopic(item.label.toLowerCase().replace(/\s+/g, '_'))}
            >
              <span>{item.label}</span>
              <span className="flr-continue-arrow">{item.arrow}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════ OFFLINE NOTICE ═══════════ */}
      <div className="flr-offline-notice">
        <span>📶</span>
        <p>All lessons work offline. Learn anytime, anywhere.</p>
      </div>
    </div>
  );
}

export default FinancialLiteracy;