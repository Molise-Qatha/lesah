import React, { useState } from 'react';
import './InteractiveActivity.css';

function InteractiveActivity({ activity, language = 'english', onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [sortedItems, setSortedItems] = useState({});

  const handleSelect = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    
    let correct = false;
    if (activity.correctItem !== undefined) correct = index === activity.correctItem;
    else if (activity.options?.[index]?.correct !== undefined) correct = activity.options[index].correct;
    else if (activity.correctCoin !== undefined) correct = index === activity.correctCoin;
    
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
        <h3>{activity.title?.[language] || activity.title?.english}</h3>
        <p>{activity.prompt?.[language] || activity.prompt?.english}</p>
      </div>

      {/* SHOPPING */}
      {activity.type === 'shopping' && (
        <div className="ia-shopping-items">
          <div className="ia-budget-display">
            💰 {language === 'sesotho' ? 'U na le' : 'You have'} M{activity.budget}
          </div>
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

      {/* COIN COUNTING */}
      {activity.type === 'coin_counting' && (
        <div className="ia-coins-area">
          <div className="ia-coins">
            {activity.coins.map((coin, i) => (
              <span key={i} className="ia-coin-display">🪙</span>
            ))}
          </div>
          <div className="ia-options">
            {activity.answerOptions?.map((opt, i) => (
              <button
                key={i}
                className={`ia-option ${selectedOption === i ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleSelect(i)}
                disabled={showFeedback}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAP CHOICE */}
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

      {/* PIGGY BANK */}
      {activity.type === 'piggy_bank' && (
        <div className="ia-piggy-bank">
          <div className="ia-piggy-emoji">🐷</div>
          <p className="ia-piggy-target">
            {language === 'sesotho' ? 'Kenya' : 'Put in'} M{activity.targetAmount}
          </p>
          <div className="ia-coins">
            {activity.coins.map((coin, i) => (
              <button
                key={i}
                className={`ia-coin-btn ${selectedOption === i ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleSelect(i)}
                disabled={showFeedback}
              >
                M{coin}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MATCHING */}
      {activity.type === 'matching' && (
        <div className="ia-matching">
          {activity.pairs.map((pair, i) => (
            <div key={i} className="ia-matching-pair">
              <span className="ia-matching-left">{pair.left[language] || pair.left.english}</span>
              <span className="ia-matching-arrow">↔</span>
              <span className="ia-matching-right">{pair.right[language] || pair.right.english}</span>
            </div>
          ))}
          <button className="ia-next-btn" onClick={onComplete}>
            {language === 'sesotho' ? 'Ke balile! →' : 'I see it! →'}
          </button>
        </div>
      )}

      {/* SORTING */}
      {activity.type === 'sorting' && (
        <div className="ia-sorting">
          <div className="ia-buckets">
            {activity.buckets.map((bucket) => (
              <div key={bucket.id} className={`ia-bucket ia-bucket-${bucket.id}`}>
                <h4>{bucket.label[language]}</h4>
              </div>
            ))}
          </div>
          <div className="ia-sort-items">
            {activity.items.map((item, i) => (
              <button
                key={i}
                className="ia-sort-item"
                onClick={() => {
                  setSortedItems((prev) => ({ ...prev, [i]: item.correctBucket }));
                  setIsCorrect(true);
                  setShowFeedback(true);
                }}
              >
                <span>{item.emoji}</span>
                <span>{item.name[language]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BUDGET CHALLENGE */}
      {activity.type === 'budget_challenge' && (
        <div className="ia-budget">
          <p className="ia-budget-total">
            {language === 'sesotho' ? 'Kakaretso:' : 'Total:'} M{activity.income}
          </p>
          {activity.categories.map((cat, i) => (
            <div key={i} className="ia-budget-row">
              <span>{cat.emoji} {cat.name[language]}</span>
              <span>M{cat.min} - M{cat.max}</span>
            </div>
          ))}
          <button className="ia-next-btn" onClick={onComplete}>
            {language === 'sesotho' ? 'Ke utloile! →' : 'Got it! →'}
          </button>
        </div>
      )}

      {/* SCENARIO */}
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
          {showFeedback && activity.explanation && (
            <p className="ia-explanation">
              {activity.explanation?.[language] || activity.explanation?.english}
            </p>
          )}
        </div>
      )}

      {/* MEMORY GAME */}
      {activity.type === 'memory_game' && (
        <div className="ia-memory">
          <div className="ia-memory-cards">
            {activity.cards.map((card) => (
              <button key={card.id} className="ia-memory-card">
                {matchedPairs.includes(card.id) ? card.emoji : '❓'}
              </button>
            ))}
          </div>
          <p className="ia-memory-hint">
            {language === 'sesotho' ? 'Tobetsa likarete ho fumana lipara!' : 'Tap cards to find pairs!'}
          </p>
        </div>
      )}

      {/* FEEDBACK */}
      {showFeedback && activity.type !== 'matching' && activity.type !== 'budget_challenge' && activity.type !== 'sorting' && (
        <div className={`ia-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          <span>{feedback}</span>
          <button className="ia-next-btn" onClick={onComplete}>
            {language === 'sesotho' ? 'Tsoela Pele →' : 'Continue →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default InteractiveActivity;