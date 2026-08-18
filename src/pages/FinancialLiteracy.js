import React, { useState, useEffect, useRef } from 'react';
import './FinancialLiteracy.css';
import { curriculumData } from '../data/financialLiteracyCurriculum';
import { getConversationalResponse, getRandomResponse } from '../data/conversationalAI';

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

const TOPICS = [
  { id: 'saving', icon: '💰', label: { english: 'Saving', sesotho: 'Ho Boloka' } },
  { id: 'budgeting', icon: '📊', label: { english: 'Budgeting', sesotho: 'Tekanyetso' } },
  { id: 'spending', icon: '🛒', label: { english: 'Spending', sesotho: 'Tšebeliso' } },
  { id: 'needs_vs_wants', icon: '⚖️', label: { english: 'Needs & Wants', sesotho: 'Litlhoko le Litakatso' } },
  { id: 'interest', icon: '📈', label: { english: 'Interest', sesotho: 'Phaello' } },
  { id: 'loans', icon: '🏦', label: { english: 'Loans', sesotho: 'Likoloto' } },
  { id: 'investing', icon: '🌱', label: { english: 'Investing', sesotho: 'Matsete' } },
  { id: 'income', icon: '💵', label: { english: 'Income', sesotho: 'Moputso' } },
];

const QUICK_QUESTIONS = {
  english: ['What is saving?', 'How does a budget work?', 'What is interest?', 'What is a loan?', 'Needs vs wants?'],
  sesotho: ['Ho boloka ke eng?', 'Tekanyetso e sebetsa joang?', 'Phaello ke eng?', 'Kalimo ke eng?', 'Litlhoko le litakatso?'],
};

function FinancialLiteracy() {
  const [gradeId, setGradeId] = useState(() => localStorage.getItem('fl_grade') || 'grade4');
  const [language, setLanguage] = useState(() => localStorage.getItem('fl_language') || 'english');
  const [activeTopic, setActiveTopic] = useState('saving');
  const [view, setView] = useState('learn');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [heroRef, heroInView] = useInView(0.1);
  const [progressRef, progressInView] = useInView(0.3);
  const chatEndRef = useRef(null);

  const ui = curriculumData.ui[language] || curriculumData.ui.english;
  const gradeData = curriculumData.grades[gradeId];
  const modules = gradeData?.modules || [];
  const currentModule = modules[currentModuleIndex];
  const phaseData = gradeData ? curriculumData.phases[gradeData.phase] : null;

  useEffect(() => {
    localStorage.setItem('fl_grade', gradeId);
  }, [gradeId]);

  useEffect(() => {
    localStorage.setItem('fl_language', language);
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (modules.length > 0) {
      const allQuestions = [];
      modules.forEach((mod) => {
        if (mod.quiz) {
          mod.quiz.forEach((q) => {
            allQuestions.push({ ...q, moduleTitle: mod.title });
          });
        }
      });
      setQuizQuestions(allQuestions);
      setCurrentModuleIndex(0);
      setView('learn');
      setSelectedOption(null);
    }
  }, [gradeId]);

  const getResponse = (question) => {
    // FIRST: Check conversational responses
    const conversational = getConversationalResponse(question, language);
    if (conversational) {
      return { type: 'assistant', text: conversational, time: 'Now', related: null };
    }

    // THEN: Search curriculum
    const q = question.toLowerCase();

    for (const mod of modules) {
      const titleEn = (mod.title?.english || '').toLowerCase();
      const titleSt = (mod.title?.sesotho || '').toLowerCase();
      if ((titleEn && q.includes(titleEn)) || (titleSt && q.includes(titleSt))) {
        const explanation = mod.explanation?.[language] || mod.explanation?.english || '';
        const example = mod.example?.[language] || mod.example?.english || '';
        let text = `**${mod.title?.[language] || mod.title?.english}**\n\n${explanation}`;
        if (example) text += `\n\n${language === 'sesotho' ? 'Mohlala' : 'Example'}: ${example}`;
        return { type: 'assistant', text, time: 'Now', related: null };
      }
    }

    const fallbackMatches = [
      { keywords: ['save', 'saving', 'boloka', 'poloko'], topic: 'saving' },
      { keywords: ['budget', 'budgeting', 'tekanyetso'], topic: 'budgeting' },
      { keywords: ['interest', 'phaello'], topic: 'interest' },
      { keywords: ['loan', 'borrow', 'kalimo', 'sekoloto'], topic: 'loans' },
      { keywords: ['spend', 'spending', 'tšebeliso'], topic: 'spending' },
      { keywords: ['invest', 'investing', 'matsete'], topic: 'investing' },
      { keywords: ['need', 'want', 'tlhoko', 'takatso'], topic: 'needs_vs_wants' },
      { keywords: ['income', 'earn', 'moputso'], topic: 'income' },
    ];

    for (const match of fallbackMatches) {
      if (match.keywords.some((kw) => q.includes(kw))) {
        for (const [gId, gData] of Object.entries(curriculumData.grades)) {
          const mod = gData.modules?.find((m) =>
            m.id?.includes(match.topic) ||
            (m.title?.english?.toLowerCase() || '').includes(match.topic.replace(/_/g, ' '))
          );
          if (mod) {
            const explanation = mod.explanation?.[language] || mod.explanation?.english || '';
            const example = mod.example?.[language] || mod.example?.english || '';
            let text = `**${mod.title?.[language] || mod.title?.english}**\n\n${explanation}`;
            if (example) text += `\n\n${language === 'sesotho' ? 'Mohlala' : 'Example'}: ${example}`;
            return { type: 'assistant', text, time: 'Now', related: null };
          }
        }
      }
    }

    return {
      type: 'assistant',
      text: getRandomResponse(
        language === 'sesotho'
          ? ["Ke ntse ke ithuta! 🤔 Mpotse ka ho boloka, tekanyetso, phaello, likoloto, kapa matsete."]
          : ["I'm still learning! 🤔 Ask me about saving, budgeting, interest, loans, or investing."]
      ),
      time: 'Now',
      related: null,
    };
  };

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
    }, 700);
  };

  const handleTopicClick = (topicId) => {
    setActiveTopic(topicId);
    setView('learn');
    const modIndex = modules.findIndex((m) =>
      m.id?.includes(topicId) ||
      (m.title?.english?.toLowerCase() || '').includes(topicId.replace(/_/g, ' '))
    );
    if (modIndex >= 0) setCurrentModuleIndex(modIndex);
  };

  const startQuiz = () => {
    setView('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleAnswer = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === quizQuestions[currentQuestionIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const retryQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const backToLearning = () => {
    setView('learn');
    setSelectedOption(null);
  };

  const progressPercent = Math.min(100, Math.round((modules.length > 0 ? (currentModuleIndex + 1) / modules.length : 0) * 100));

  return (
    <div className="fl-redesign">
      {/* HERO */}
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
              {language === 'sesotho' ? 'Ithute ka Chelete.' : 'Learn Money.'}
              <br />
              <span className="flr-gold">{language === 'sesotho' ? 'Haha Bokamoso ba Hau.' : 'Build Your Future.'}</span>
            </h1>
            <p>{ui.heroSubtitle}</p>
            <div className="flr-hero-actions">
              <button className="flr-btn-primary" onClick={() => document.getElementById('flr-learning').scrollIntoView({ behavior: 'smooth' })}>
                {language === 'sesotho' ? 'Qala ho Ithuta →' : 'Start Learning →'}
              </button>
              <button className="flr-btn-secondary" onClick={() => document.getElementById('flr-chat').scrollIntoView({ behavior: 'smooth' })}>
                {language === 'sesotho' ? 'Botsa Mothusi →' : 'Ask the Assistant →'}
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

      {/* GRADE SELECTOR */}
      <section id="flr-learning" className="flr-section">
        <div className="flr-section-intro">
          <h2>{ui.chooseGrade}</h2>
          <p>{language === 'sesotho' ? 'Khetha kereiti ea hau hore re hlalose ka botebo bo nepahetseng.' : 'Select your grade so lessons match your level.'}</p>
        </div>

        <div className="flr-lang-toggle">
          <button className={`flr-lang-btn ${language === 'english' ? 'active' : ''}`} onClick={() => setLanguage('english')}>
            English
          </button>
          <button className={`flr-lang-btn ${language === 'sesotho' ? 'active' : ''}`} onClick={() => setLanguage('sesotho')}>
            Sesotho
          </button>
        </div>

        <div className="flr-grade-selector">
          <select
            className="flr-grade-select"
            value={gradeId}
            onChange={(e) => setGradeId(e.target.value)}
          >
            {curriculumData.gradeOptions.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label[language]}
              </option>
            ))}
          </select>
        </div>

        {gradeData && (
          <div className="flr-grade-indicator">
            <span>{gradeData.icon}</span>
            <span>{gradeData.label[language]}</span>
            <span>— {gradeData.age[language]}</span>
            {phaseData && <span className="flr-phase-badge">{phaseData.title[language]}</span>}
          </div>
        )}
      </section>

      {/* TOPIC NAVIGATION */}
      <section className="flr-topics-section">
        <div className="flr-topics-scroll">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              className={`flr-topic-btn ${activeTopic === topic.id ? 'active' : ''}`}
              onClick={() => handleTopicClick(topic.id)}
            >
              <span>{topic.icon}</span>
              <span>{topic.label[language]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* WORKSPACE */}
      <section className="flr-workspace">
        <div className="flr-workspace-grid">
          {/* LEFT */}
          <div className="flr-lesson">
            {view === 'learn' ? (
              currentModule ? (
                <>
                  <span className="flr-lesson-icon">{gradeData?.icon || '💰'}</span>
                  <h3>{currentModule.title?.[language] || currentModule.title?.english}</h3>
                  <p className="flr-lesson-text">
                    {currentModule.explanation?.[language] || currentModule.explanation?.english}
                  </p>
                  <div className="flr-lesson-example">
                    <strong>{language === 'sesotho' ? 'Mohlala' : 'Example'}</strong>
                    <p>{currentModule.example?.[language] || currentModule.example?.english}</p>
                  </div>
                  <button className="flr-try-question-btn" onClick={startQuiz}>
                    📝 {language === 'sesotho' ? 'Nka Quiz' : 'Try a Quiz'} →
                  </button>
                </>
              ) : (
                <p className="flr-lesson-text">Loading lessons...</p>
              )
            ) : (
              <div className="flr-quiz-view">
                {!showResult ? (
                  quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length ? (
                    <>
                      <span className="flr-quiz-progress">
                        {currentQuestionIndex + 1} / {quizQuestions.length}
                      </span>
                      <h3>{quizQuestions[currentQuestionIndex].question[language]}</h3>
                      <div className="flr-quiz-options">
                        {quizQuestions[currentQuestionIndex].options[language].map((opt, i) => (
                          <button
                            key={i}
                            className={`flr-quiz-option ${
                              selectedOption !== null
                                ? i === quizQuestions[currentQuestionIndex].correctIndex
                                  ? 'correct'
                                  : i === selectedOption
                                  ? 'wrong'
                                  : ''
                                : ''
                            }`}
                            onClick={() => handleAnswer(i)}
                            disabled={selectedOption !== null}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {selectedOption !== null && (
                        <div className="flr-quiz-feedback">
                          {selectedOption === quizQuestions[currentQuestionIndex].correctIndex ? (
                            <span className="flr-quiz-correct">✅ {language === 'sesotho' ? 'Ho nepahetse!' : 'Correct!'}</span>
                          ) : (
                            <span className="flr-quiz-wrong">
                              ❌ {language === 'sesotho' ? 'Karabo e nepahetseng ke:' : 'Correct answer:'}{' '}
                              {quizQuestions[currentQuestionIndex].options[language][quizQuestions[currentQuestionIndex].correctIndex]}
                            </span>
                          )}
                          <button className="flr-quiz-next" onClick={nextQuestion}>
                            {currentQuestionIndex < quizQuestions.length - 1
                              ? (language === 'sesotho' ? 'Potso e latelang →' : 'Next Question →')
                              : (language === 'sesotho' ? 'Qetella Quiz' : 'Finish Quiz')}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p>{language === 'sesotho' ? 'Ha ho lipotso.' : 'No questions available.'}</p>
                  )
                ) : (
                  <div className="flr-quiz-result">
                    <span className="flr-result-icon">{score >= quizQuestions.length / 2 ? '🎉' : '📚'}</span>
                    <h3>{language === 'sesotho' ? 'Lintlha tsa hau' : 'Your Score'}</h3>
                    <p className="flr-result-score">{score} / {quizQuestions.length}</p>
                    <div className="flr-result-actions">
                      <button className="flr-try-question-btn" onClick={retryQuiz}>🔄 {ui.quizRetry}</button>
                      <button className="flr-try-question-btn" onClick={backToLearning}>← {ui.quizBack}</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — CHAT */}
          <div id="flr-chat" className="flr-chat-panel">
            <div className="flr-chat-header">
              <span className="flr-chat-avatar">🤖</span>
              <div>
                <h3>{language === 'sesotho' ? 'Botsa LeSAH' : 'Ask LeSAH'}</h3>
                <p>{language === 'sesotho' ? 'Na u na le potso ka chelete?' : 'Have a question about money?'}</p>
              </div>
            </div>
            <div className="flr-chat-messages">
              {chatMessages.length === 0 ? (
                <div className="flr-chat-empty">
                  <span>💬</span>
                  <p>{language === 'sesotho' ? 'Botsa potso ho qala!' : 'Ask a question to get started!'}</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flr-chat-msg flr-chat-${msg.type}`}>
                    <div className="flr-chat-bubble">
                      {msg.text.split('\n').map((line, j) => (
                        <React.Fragment key={j}>
                          {line}
                          {j < msg.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                      <span className="flr-chat-time">{msg.time}</span>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flr-chat-msg flr-chat-assistant">
                  <div className="flr-chat-bubble flr-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form className="flr-chat-input" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <input
                type="text"
                placeholder={ui.inputPlaceholder}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" disabled={isTyping || !chatInput.trim()}>
                {ui.send}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* QUICK QUESTIONS */}
      <section className="flr-quick-section">
        <div className="flr-quick-pills">
          {QUICK_QUESTIONS[language].map((q, i) => (
            <button key={i} className="flr-quick-pill" onClick={() => handleSendMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* PROGRESS */}
      <section className="flr-progress-section" ref={progressRef}>
        <div className={`flr-progress ${progressInView ? 'visible' : ''}`}>
          <h3>{language === 'sesotho' ? 'Tsoelo-pele ea Hau' : 'Your Progress'}</h3>
          <div className="flr-progress-bar">
            <div className="flr-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="flr-progress-percent">{progressPercent}%</p>
          <p className="flr-progress-topics">
            {currentModuleIndex + 1} / {modules.length} {language === 'sesotho' ? 'lihloho' : 'topics'}
          </p>
        </div>
      </section>

      {/* DAILY TIP */}
      <section className="flr-tip-section">
        <div className="flr-tip">
          <span className="flr-tip-icon">🌿</span>
          <div>
            <h4>{language === 'sesotho' ? 'Keletso ea Kajeno' : "Today's Money Tip"}</h4>
            <p>
              {language === 'sesotho'
                ? 'Ho boloka hanyane khafetsa ho haha mekhoa e metle ea lichelete.'
                : 'Small savings become powerful habits when you make them consistently.'}
            </p>
          </div>
        </div>
      </section>

      {/* OFFLINE NOTICE */}
      <div className="flr-offline-notice">
        <span>📶</span>
        <p>
          {language === 'sesotho'
            ? 'Lithuto tsohle li sebetsa ntle le inthanete.'
            : 'All lessons work offline. Learn anytime, anywhere.'}
        </p>
      </div>
    </div>
  );
}

export default FinancialLiteracy;