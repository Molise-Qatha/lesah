import React, { useState, useEffect } from 'react';
import './FinancialLiteracy.css';
import { curriculumData } from '../data/financialLiteracyCurriculum';

function FinancialLiteracy() {
  const [gradeId, setGradeId] = useState(() => localStorage.getItem('fl_grade') || 'grade4');
  const [language, setLanguage] = useState(() => localStorage.getItem('fl_language') || 'english');
  const [view, setView] = useState('learn'); // 'learn' | 'quiz'
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const ui = curriculumData.ui[language];
  const gradeData = curriculumData.grades[gradeId];
  const modules = gradeData?.modules || [];
  const currentModule = modules[currentModuleIndex];

  useEffect(() => {
    localStorage.setItem('fl_grade', gradeId);
  }, [gradeId]);

  useEffect(() => {
    localStorage.setItem('fl_language', language);
  }, [language]);

  useEffect(() => {
    // Collect all quiz questions from all modules
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

  const handleGradeChange = (newGrade) => {
    setGradeId(newGrade);
    setView('learn');
    setCurrentModuleIndex(0);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setSelectedOption(null);
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

  const phaseData = gradeData ? curriculumData.phases[gradeData.phase] : null;

  return (
    <div className="fl-page">
      {/* Hero */}
      <section className="fl-hero">
        <h1>{ui.heroTitle}</h1>
        <p>{ui.heroSubtitle}</p>
        <span className="fl-dev-badge">{ui.inDevelopment}</span>
      </section>

      {/* Controls - Wrapped inside fl-level-bar so it matches your CSS */}
      <div className="fl-level-bar">
        {/* Language */}
        <div className="fl-control-group">
          <span className="fl-control-label">{ui.languageLabel}</span>
          <div className="fl-level-buttons">
            <button
              className={`fl-level-btn ${language === 'english' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('english')}
            >
              {ui.english}
            </button>
            <button
              className={`fl-level-btn ${language === 'sesotho' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('sesotho')}
            >
              {ui.sesotho}
            </button>
          </div>
        </div>

        {/* Grade */}
        <div className="fl-control-group">
          <span className="fl-control-label">{ui.chooseGrade}</span>
          <select
            className="fl-grade-select"
            value={gradeId}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {curriculumData.gradeOptions.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label[language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Phase Indicator */}
      {phaseData && (
        <div className="fl-phase-indicator">
          <span className="fl-phase-icon">{gradeData.icon}</span>
          <span className="fl-phase-name">{ui.phaseLabel} {phaseData.title[language]}</span>
          <span className="fl-phase-grades">{gradeData.label[language]} — {gradeData.age[language]}</span>
        </div>
      )}

      {/* Content Area */}
      {view === 'learn' ? (
        <div className="fl-learn-area">
          {/* Module Selector */}
          {modules.length > 0 && (
            <div className="fl-module-tabs">
              {modules.map((mod, i) => (
                <button
                  key={mod.id}
                  className={`fl-module-tab ${i === currentModuleIndex ? 'active' : ''}`}
                  onClick={() => setCurrentModuleIndex(i)}
                >
                  {mod.title[language]}
                </button>
              ))}
            </div>
          )}

          {/* Current Module */}
          {currentModule && (
            <div className="fl-module-content">
              <h2>{currentModule.title[language]}</h2>
              <p className="fl-module-explanation">{currentModule.explanation[language]}</p>
              <div className="fl-module-example">
                <strong>{language === 'sesotho' ? 'Mohlala:' : 'Example:'}</strong> {currentModule.example[language]}
              </div>
              <button className="fl-quiz-btn" onClick={startQuiz}>
                📝 {ui.takeQuiz}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="fl-quiz-area">
          {!showResult ? (
            quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length ? (
              <div className="fl-quiz-question">
                <span className="fl-quiz-progress">
                  {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
                <h3>{quizQuestions[currentQuestionIndex].question[language]}</h3>
                <div className="fl-quiz-options">
                  {quizQuestions[currentQuestionIndex].options[language].map((opt, i) => (
                    <button
                      key={i}
                      className={`fl-quiz-option ${
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
                  <div className="fl-quiz-feedback">
                    {selectedOption === quizQuestions[currentQuestionIndex].correctIndex ? (
                      <span className="fl-quiz-correct">{ui.quizCorrect}</span>
                    ) : (
                      <span className="fl-quiz-wrong">
                        {ui.quizWrong}{' '}
                        <strong>
                          {quizQuestions[currentQuestionIndex].options[language][quizQuestions[currentQuestionIndex].correctIndex]}
                        </strong>
                      </span>
                    )}
                    <button className="fl-quiz-next" onClick={nextQuestion}>
                      {currentQuestionIndex < quizQuestions.length - 1 ? ui.quizNext : ui.quizFinish}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="fl-quiz-empty">
                <p>{ui.chooseGrade}</p>
                <button onClick={backToLearning}>← {ui.quizBack}</button>
              </div>
            )
          ) : (
            <div className="fl-quiz-result">
              <span className="fl-result-icon">{score >= quizQuestions.length / 2 ? '🎉' : '📚'}</span>
              <h2>{ui.quizScore}</h2>
              <p className="fl-result-score">
                {score} / {quizQuestions.length}
              </p>
              <p className="fl-result-message">
                {score === quizQuestions.length
                  ? '🌟 Perfect score!'
                  : score >= quizQuestions.length * 0.7
                  ? '👏 Great job!'
                  : score >= quizQuestions.length * 0.5
                  ? '👍 Keep learning!'
                  : '💪 Practice more and try again!'}
              </p>
              <div className="fl-result-actions">
                <button className="fl-quiz-btn" onClick={retryQuiz}>
                  🔄 {ui.quizRetry}
                </button>
                <button className="fl-quiz-btn fl-quiz-btn-secondary" onClick={backToLearning}>
                  ← {ui.quizBack}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FinancialLiteracy;