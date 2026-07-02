// src/components/WordScramble.js
import React, { useState } from 'react';
import './WordScramble.css';

const WORDS = [
  'LESOTHO', 'LESAH', 'STUDENT', 'LAW', 'EXAM', 'HOSTEL', 'LIBRARY', 'ROMA', 'SUCCESS', 'TRACTION'
];

function scrambleWord(word) {
  let arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // ensure it's not the same as original
  if (arr.join('') === word && word.length > 1) return scrambleWord(word);
  return arr.join('');
}

function WordScramble() {
  const [currentWord, setCurrentWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [scrambled, setScrambled] = useState(() => scrambleWord(currentWord));
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  const checkAnswer = (e) => {
    e.preventDefault();
    if (guess.toUpperCase() === currentWord) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      nextWord();
    } else {
      setMessage('❌ Try again.');
    }
    setGuess('');
  };

  const nextWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(newWord);
    setScrambled(scrambleWord(newWord));
    setMessage('');
  };

  return (
    <div className="wordscramble">
      <h2>🔤 Word Scramble</h2>
      <p className="scramble-word">{scrambled}</p>
      <form onSubmit={checkAnswer} className="scramble-form">
        <input
          type="text"
          placeholder="Your guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          autoFocus
        />
        <button type="submit">Check</button>
      </form>
      {message && <p className="scramble-message">{message}</p>}
      <div className="scramble-score">Score: {score}</div>
      <button onClick={nextWord} className="scramble-next">Next Word</button>
    </div>
  );
}

export default WordScramble;