import React, { useState, useEffect, useRef } from 'react';
import './FinancialLiteracy.css';
import { curriculumData } from '../data/financialLiteracyCurriculum';

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

const LEVELS = [
  { id: 'primary', icon: '🎒', label: { english: 'Primary School', sesotho: 'Sekolo sa Mathomo' } },
  { id: 'high_school', icon: '📚', label: { english: 'High School', sesotho: 'Sekolo se Phahameng' } },
  { id: 'university', icon: '🎓', label: { english: 'University', sesotho: 'Univesithi' } },
];

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
  english: [
    'What is saving?',
    'How does a budget work?',
    'What is interest?',
    'What is a loan?',
    'Needs vs wants?',
  ],
  sesotho: [
    'Ho boloka ke eng?',
    'Tekanyetso e sebetsa joang?',
    'Phaello ke eng?',
    'Kalimo ke eng?',
    'Litlhoko le litakatso?',
  ],
};

const CONTINUE_LEARNING = [
  { label: { english: 'Budgeting', sesotho: 'Tekanyetso' }, topic: 'budgeting' },
  { label: { english: 'Interest', sesotho: 'Phaello' }, topic: 'interest' },
  { label: { english: 'Needs & Wants', sesotho: 'Litlhoko le Litakatso' }, topic: 'needs_vs_wants' },
];

function FinancialLiteracy() {
  const [level, setLevel] = useState(() => localStorage.getItem('fl_level') || 'high_school');
  const [language, setLanguage] = useState(() => localStorage.getItem('fl_language') || 'english');
  const [gradeId, setGradeId] = useState(() => localStorage.getItem('fl_grade') || 'grade4');
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
    const levelGradeMap = {
      primary: 'grade4',
      high_school: 'grade8',
      university: 'uni_1',
    };
    const mappedGrade = levelGradeMap[level];
    if (mappedGrade) {
      setGradeId(mappedGrade);
    }
  }, [level]);

  useEffect(() => {
    localStorage.setItem('fl_level', level);
  }, [level]);

  useEffect(() => {
    localStorage.setItem('fl_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('fl_grade', gradeId);
  }, [gradeId]);

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
    }
  }, [gradeId, modules]);

  const getResponse = (question) => {
    const q = question.toLowerCase();
    
    for (const mod of modules) {
      const titleEn = mod.title?.english?.toLowerCase() || '';
      const titleSt = mod.title?.sesotho?.toLowerCase() || '';
      const explanation = mod.explanation?.[language] || mod.explanation?.english || '';
      const example = mod.example?.[language] || mod.example?.english || '';
      
      if (titleEn && q.includes(titleEn) || titleSt && q.includes(titleSt)) {
        let text = `**${mod.title?.[language] || mod.title?.english}**\n\n${explanation}`;
        if (example) {
          text += `\n\n${language === 'sesotho' ? 'Mohlala' : 'Example'}: ${example}`;
        }
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
            m.title?.english?.toLowerCase().includes(match.topic.replace(/_/g, ' '))
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
      text: curriculumData.fallbackResponse[language] || curriculumData.fallbackResponse.english,
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
    }, 800);
  };

  const handleQuickQuestion = (q) => {
    handleSendMessage(q);
  };

  const handleTopicClick = (topicId) => {
    setActiveTopic(topicId);
    setView('learn');
    const modIndex = modules.findIndex((m) => 
      m.id?.includes(topicId) || 
      m.title?.english?.toLowerCase().includes(topicId.replace(/_/g, ' '))
    );
    if (modIndex >= 0) {
      setCurrentModuleIndex(modIndex);
    }
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
  const progressMessage = progressPercent > 70 
    ? (language === 'sesotho' ? 'Mosebetsi o motle! 🎉' : 'Great job! 🎉') 
    : (language === 'sesotho' ? 'Tsoela pele!' : 'Keep going!');
  const progressDetail = language === 'sesotho' 
    ? 'U ntse u haha mekhoa e metle ea chelete.' 
    : "You're building strong money habits.";

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

      {/* LEVEL SELECTOR */}
      <section id="flr-learning" className="flr-section">
        <div className="flr-section-intro">
          <h2>{language === 'sesotho' ? 'U ithutela mang?' : 'Who are you learning for?'}</h2>
          <p>{language === 'sesotho' ? 'Khetha boemo ba hau hore LeSAH e hlalose ka botebo bo nepahetseng.' : 'Choose your level so LeSAH can explain financial concepts at the right depth.'}</p>
        </div>

        <div className="flr-lang-toggle">
          <button className={`flr-lang-btn ${language === 'english' ? 'active' : ''}`} onClick={() => setLanguage('english')}>
            English
          </button>
          <button className={`flr-lang-btn ${language === 'sesotho' ? 'active' : ''}`} onClick={() => setLanguage('sesotho')}>
            Sesotho
          </button>
        </div>

        <div className="flr-level-selector">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              className={`flr-level-btn ${level === lvl.id ? 'active' : ''}`}
              onClick={() => setLevel(lvl.id)}
            >
              <span className="flr-level-icon">{lvl.icon}</span>
              <span className="flr-level-label">{lvl.label[language]}</span>
            </button>
          ))}
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

      {/* MAIN WORKSPACE */}
      <section className="flr-workspace">
        <div className="flr-workspace-grid">
          {/* LEFT — LESSON OR QUIZ */}
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
                  <div className="flr-lesson-why">
                    <strong>{language === 'sesotho' ? 'Hobaneng ho le bohlokoa' : 'Why it matters'}</strong>
                    <p>{language === 'sesotho' ? 'Ho utloisisa taba ena ho u thusa ho etsa liqeto tse nepahetseng tsa lichelete.' : 'Understanding this helps you make better financial decisions.'}</p>
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
                      <button className="flr-try-question-btn" onClick={retryQuiz}>
                        🔄 {language === 'sesotho' ? 'Leka Hape' : 'Try Again'}
                      </button>
                      <button className="flr-try-question-btn" onClick={backToLearning}>
                        ← {language === 'sesotho' ? 'Khutlela Thutong' : 'Back to Learning'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — AI CHAT */}
          <div id="flr-chat" className="flr-chat-panel">
            <div className="flr-chat-header">
              <span className="flr-chat-avatar">🤖</span>
              <div>
                <h3>{language === 'sesotho' ? 'Botsa LeSAH' : 'Ask LeSAH'}</h3>
                <p>{language === 'sesotho' ? 'Na u na le potso ka chelete? Botsa ka puo ea hau.' : 'Have a question about money? Ask in your own words.'}</p>
              </div>
            </div>
            <div className="flr-chat-messages">
              {chatMessages.length === 0 ? (
                <div className="flr-chat-empty">
                  <span>💬</span>
                  <p>{language === 'sesotho' ? 'Botsa potso e le \'ngoe ho qala!' : 'Ask a question to get started!'}</p>
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
                      {msg.related && (
                        <button
                          className="flr-chat-related"
                          onClick={() => handleQuickQuestion(
                            language === 'sesotho' ? `${msg.related} ke eng?` : `What is ${msg.related.toLowerCase()}?`
                          )}
                        >
                          {language === 'sesotho' ? 'Ithute ka:' : 'Learn about:'} {msg.related} →
                        </button>
                      )}
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
            <form
              className="flr-chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
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
            <button key={i} className="flr-quick-pill" onClick={() => handleQuickQuestion(q)}>
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
          <p className="flr-progress-message">{progressMessage}</p>
          <p className="flr-progress-detail">{progressDetail}</p>
          <p className="flr-progress-topics">
            {currentModuleIndex + 1} {language === 'sesotho' ? 'ho tsoa ho' : 'of'} {modules.length} {language === 'sesotho' ? 'lihloho' : 'topics'}
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

      {/* CONTINUE LEARNING */}
      <section className="flr-continue-section">
        <h3>{language === 'sesotho' ? 'Tsoela Pele ho Ithuta' : 'Continue Learning'}</h3>
        <div className="flr-continue-list">
          {CONTINUE_LEARNING.map((item, i) => (
            <button
              key={i}
              className="flr-continue-item"
              onClick={() => handleTopicClick(item.topic)}
            >
              <span>{item.label[language]}</span>
              <span className="flr-continue-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      {/* OFFLINE NOTICE */}
      <div className="flr-offline-notice">
        <span>📶</span>
        <p>
          {language === 'sesotho'
            ? 'Lithuto tsohle li sebetsa ntle le inthanete. Ithute neng kapa neng, kae kapa kae.'
            : 'All lessons work offline. Learn anytime, anywhere.'}
        </p>
      </div>
    </div>
  );
}

export default FinancialLiteracy;