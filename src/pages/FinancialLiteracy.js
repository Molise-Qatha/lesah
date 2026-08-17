import React, { useState, useEffect, useRef } from 'react';
import './FinancialLiteracy.css';
import { financialLiteracyData } from '../data/financialLiteracy';

const EDUCATION_LEVELS = [
  { id: 'primary', label: 'Primary School', icon: '🎒' },
  { id: 'high_school', label: 'High School', icon: '📚' },
  { id: 'university', label: 'University', icon: '🎓' },
];

function FinancialLiteracy() {
  const [level, setLevel] = useState(() => localStorage.getItem('fl_level') || 'high_school');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('fl_level', level);
  }, [level]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const findTopic = (question) => {
    const normalized = question.toLowerCase();
    let bestTopic = null;
    let bestScore = 0;

    for (const [topicId, topicData] of Object.entries(financialLiteracyData.topics)) {
      let score = 0;
      for (const keyword of topicData.keywords) {
        const kw = keyword.toLowerCase();
        if (normalized.includes(kw)) {
          score += kw.length;
        }
        // Check word fragments
        const words = normalized.split(' ');
        for (const word of words) {
          if (word.length > 3 && (kw.includes(word) || word.includes(kw))) {
            score += 2;
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestTopic = topicId;
      }
    }

    return bestScore > 3 ? bestTopic : null;
  };

  const getAnswer = (question) => {
    const topicId = findTopic(question);
    
    if (!topicId) {
      return {
        found: false,
        text: financialLiteracyData.fallbackResponse,
        related: null,
      };
    }

    const topicData = financialLiteracyData.topics[topicId];
    const levelData = topicData.levels[level] || topicData.levels.primary;
    
    let text = `**${levelData.title}**\n\n${levelData.explanation}`;
    if (levelData.example) {
      text += `\n\n**Example:** ${levelData.example}`;
    }

    const relatedTopicId = levelData.related;
    const relatedTitle = relatedTopicId && financialLiteracyData.topics[relatedTopicId]
      ? financialLiteracyData.topics[relatedTopicId].levels[level]?.title || relatedTopicId.replace(/_/g, ' ')
      : null;

    return {
      found: true,
      text,
      related: relatedTitle ? relatedTitle.toLowerCase() : null,
      relatedId: relatedTopicId,
    };
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const question = input.trim();
    setInput('');
    setHasStarted(true);

    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setIsThinking(true);

    setTimeout(() => {
      const answer = getAnswer(question);
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          text: answer.text,
          related: answer.related,
          relatedId: answer.relatedId,
        },
      ]);
      setIsThinking(false);
    }, 600);
  };

  const handleSuggestedQuestion = (question) => {
    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setHasStarted(true);
    setIsThinking(true);

    setTimeout(() => {
      const answer = getAnswer(question);
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          text: answer.text,
          related: answer.related,
          relatedId: answer.relatedId,
        },
      ]);
      setIsThinking(false);
    }, 600);
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setMessages([]);
    setHasStarted(false);
    setInput('');
  };

  return (
    <div className="fl-page">
      {/* Hero */}
      <section className="fl-hero">
        <h1>💰 Learn Money. Build Your Future.</h1>
        <p>
          LeSAH's financial literacy assistant helps you understand money, saving,
          budgeting and financial decisions at every stage of your education.
        </p>
        <span className="fl-dev-badge">In Development</span>
      </section>

      {/* Level Selector */}
      <div className="fl-level-bar">
        {EDUCATION_LEVELS.map((l) => (
          <button
            key={l.id}
            className={`fl-level-btn ${level === l.id ? 'active' : ''}`}
            onClick={() => handleLevelChange(l.id)}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="fl-chat">
        {!hasStarted ? (
          <div className="fl-welcome">
            <span className="fl-welcome-icon">💡</span>
            <h2>Ask me anything about money</h2>
            <p>Choose your education level above, then try one of these:</p>
            <div className="fl-suggestions">
              {financialLiteracyData.suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => handleSuggestedQuestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="fl-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`fl-msg fl-msg-${msg.type}`}>
                <div className="fl-msg-content">
                  {msg.text.split('\n').map((line, j) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  {msg.related && (
                    <button
                      className="fl-related"
                      onClick={() => handleSuggestedQuestion(`What is ${msg.related}?`)}
                    >
                      Learn about: {msg.related} →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="fl-msg fl-msg-assistant">
                <div className="fl-msg-content">
                  <div className="fl-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input */}
        <form className="fl-input-bar" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Ask about saving, budgeting, interest, loans..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={isThinking || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default FinancialLiteracy;