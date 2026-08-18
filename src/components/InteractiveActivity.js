import React, { useState } from 'react';
import './InteractiveActivity.css';

function InteractiveActivity({ activity, language = 'english', onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    const correct = activity.correctItem !== undefined 
      ? index === activity.correctItem 
      : activity.options?.[index]?.correct;
    setIsCorrect(correct);
  };

  const feedback = isCorrect 
    ? activity.feedback?.correct?.[language] || activity.feedback?.correct?.english
    : activity.feedback?.wrong?.[language] || activity.feedback?.wrong?.english;

  return (
    <div className="ia-activity">
      <div className="ia-character">
        <span className="ia-character-emoji">{activity.character || '🧑🏾‍🏫'}</span>
        {activity.characterName && (
          <span className="ia-character-name">
            {activity.characterName[language] || activity.characterName.english}
          </span>
        )}
      </div>

      <div className="ia-prompt">
        <p>{activity.prompt?.[language] || activity.prompt?.english}</p>
      </div>

      {/* Shopping Activity */}
      {activity.type === 'shopping' && (
        <div className="ia-shopping-items">
          {activity.items.map((item, i) => (
            <button
              key={i}
              className={`ia-shopping-item ${selectedOption === i ? (isCorrect ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleSelect(i)}
              disabled={showFeedback}
            >
              <span className="ia-item-emoji">{item.emoji}</span>
              <span className="ia-item-name">{item.name[language]}</span>
              <span className="ia-item-price">M{item.price}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tap Choice */}
      {activity.type === 'tap_choice' && (
        <div className="ia-options">
          {activity.options.map((opt, i) => (
            <button
              key={i}
              className={`ia-option ${selectedOption === i ? (isCorrect ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleSelect(i)}
              disabled={showFeedback}
            >
              {opt.label[language] || opt.label.english}
            </button>
          ))}
        </div>
      )}

      {/* Coin Counting */}
      {activity.type === 'coin_counting' && (
        <div className="ia-coins">
          {activity.coins.map((coin, i) => (
            <button
              key={i}
              className="ia-coin"
              onClick={() => handleSelect(i === activity.answer - 1 ? 0 : 1)}
            >
              🪙
            </button>
          ))}
        </div>
      )}

      {/* Scenario */}
      {activity.type === 'scenario' && (
        <div className="ia-options">
          {activity.options.map((opt, i) => (
            <button
              key={i}
              className={`ia-option ${selectedOption === i ? (isCorrect ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleSelect(i)}
              disabled={showFeedback}
            >
              {opt.label[language] || opt.label.english}
            </button>
          ))}
        </div>
      )}

      {showFeedback && (
        <div className={`ia-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          <span>{feedback}</span>
          {!isCorrect && activity.explanation && (
            <p className="ia-explanation">
              {activity.explanation?.[language] || activity.explanation?.english}
            </p>
          )}
          <button className="ia-next-btn" onClick={onComplete}>
            {language === 'sesotho' ? 'Tsoela Pele →' : 'Continue →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default InteractiveActivity;