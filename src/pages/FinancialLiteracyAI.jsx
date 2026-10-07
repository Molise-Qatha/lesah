import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAIResponseAsync } from '../data/mlClassifier';
import './FinancialLiteracyAI.css';

const SUGGESTIONS = {
  english: [
    { id: 'budget', icon: '💰', color: 'green',  text: 'How can I budget my money?', query: 'How can I budget my money?' },
    { id: 'scam',   icon: '🛡️', color: 'red',    text: 'How do I spot a scam?',      query: 'How do I spot a scam?' },
    { id: 'learn',  icon: '📚', color: 'orange', text: 'Start learning lessons',     route: '/financial-literacy/learn' },
    { id: 'save',   icon: '🪙', color: 'blue',   text: 'What is saving?',            query: 'What is saving?' },
  ],
  sesotho: [
    { id: 'budget', icon: '💰', color: 'green',  text: 'Nka rera chelete ea ka joang?', query: 'Ke rera chelete ea ka joang?' },
    { id: 'scam',   icon: '🛡️', color: 'red',    text: 'Ke tseba boqhekanyetsi joang?', query: 'Ke tseba boqhekanyetsi joang?' },
    { id: 'learn',  icon: '📚', color: 'orange', text: 'Qala lithuto',                  route: '/financial-literacy/learn' },
    { id: 'save',   icon: '🪙', color: 'blue',   text: 'Ho boloka ke eng?',             query: 'Ho boloka ke eng?' },
  ]
};

const UI = {
  english: {
    subtitle:  'Ask anything. Get clear answers.',
    subtitle2: 'For your money, your studies and your LeSAH journey.',
    placeholder: 'Type a message...',
  },
  sesotho: {
    subtitle:  'Botsa eng kapa eng. Fumana likarabo tse hlakileng.',
    subtitle2: 'Bakeng sa chelete ea hao, lithuto tsa hao le leeto la hao la LeSAH.',
    placeholder: 'Ngola molaetsa...',
  }
};

function RobotAvatar() {
  return (
    <svg viewBox="0 0 220 220" className="flai-robot" aria-hidden="true">
      <ellipse cx="110" cy="120" rx="90" ry="80" fill="#e8f5e9" opacity="0.55" />
      <line x1="110" y1="42" x2="110" y2="62" stroke="#0d3b66" strokeWidth="3" strokeLinecap="round" />
      <circle cx="110" cy="38" r="6" fill="#2e7d32" />
      <rect x="52" y="82" width="12" height="34" rx="6" fill="#2e7d32" />
      <rect x="156" y="82" width="12" height="34" rx="6" fill="#2e7d32" />
      <rect x="64" y="62" width="92" height="72" rx="24" fill="#0d3b66" />
      <rect x="72" y="72" width="76" height="52" rx="18" fill="#122a4a" />
      <path d="M84 96 Q92 88 100 96" stroke="#7ed957" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 96 Q128 88 136 96" stroke="#7ed957" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M96 112 Q110 120 124 112" stroke="#7ed957" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="110" cy="162" rx="46" ry="36" fill="#0d3b66" />
      <rect x="98" y="148" width="24" height="22" rx="3" fill="#ffffff" />
      <rect x="98" y="148" width="24" height="6" fill="#2e7d32" />
      <line x1="110" y1="154" x2="110" y2="170" stroke="#0d3b66" strokeWidth="1" />
      <ellipse cx="66" cy="162" rx="10" ry="14" fill="#2e7d32" />
      <ellipse cx="154" cy="162" rx="10" ry="14" fill="#2e7d32" />
      <line x1="180" y1="70" x2="190" y2="60" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
      <line x1="185" y1="82" x2="198" y2="82" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
      <line x1="180" y1="94" x2="190" y2="104" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function FinancialLiteracyAI() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(() => localStorage.getItem('fl_language') || 'english');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  const ui = UI[language] || UI.english;
  const suggestions = SUGGESTIONS[language] || SUGGESTIONS.english;

  useEffect(() => {
    localStorage.setItem('fl_language', language);
  }, [language]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || isTyping) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setIsTyping(true);
    try {
      const answer = await getAIResponseAsync(q);
      setMessages((prev) => [...prev, { role: 'ai', text: answer }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'ai',
        text: language === 'sesotho' ? 'Nka u thusa joang?' : 'How can I help?'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChip = (chip) => {
    if (chip.route) navigate(chip.route);
    else if (chip.query) send(chip.query);
  };

  const hasChat = messages.length > 0;

  return (
    <div className="flai-page">
      <div className="flai-lang">
        <button
          className={language === 'english' ? 'active' : ''}
          onClick={() => setLanguage('english')}
        >EN</button>
        <button
          className={language === 'sesotho' ? 'active' : ''}
          onClick={() => setLanguage('sesotho')}
        >ST</button>
      </div>

      {!hasChat && (
        <div className="flai-hero">
          <RobotAvatar />
          <h1 className="flai-title">
            LeSAH <span className="flai-title-accent">AI</span>
          </h1>
          <p className="flai-subtitle">{ui.subtitle}</p>
          <p className="flai-subtitle-sm">{ui.subtitle2}</p>

          <div className="flai-chips">
            {suggestions.map((chip) => (
              <button
                key={chip.id}
                className={`flai-chip flai-chip-${chip.color}`}
                onClick={() => handleChip(chip)}
              >
                <span className="flai-chip-icon">{chip.icon}</span>
                <span className="flai-chip-text">{chip.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasChat && (
        <div className="flai-chat">
          {messages.map((m, i) => (
            <div key={i} className={`flai-msg flai-msg-${m.role}`}>
              <div className="flai-bubble">
                {m.text.split('\n').map((line, j) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < m.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flai-msg flai-msg-ai">
              <div className="flai-bubble flai-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      <form
        className="flai-input-bar"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <span className="flai-sparkle">✦</span>
        <input
          type="text"
          className="flai-input"
          placeholder={ui.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
        />
        <button
          type="submit"
          className="flai-send"
          disabled={isTyping || !input.trim()}
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default FinancialLiteracyAI;