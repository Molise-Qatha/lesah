import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './WordScramble.css';

// ── 100+ student‑themed words with hints ──
const WORDS = [
  { word: 'STUDENT', hint: 'A person enrolled in a school or university.' },
  { word: 'LECTURE', hint: 'A formal talk given by a professor.' },
  { word: 'EXAM', hint: 'A test taken by students.' },
  { word: 'LIBRARY', hint: 'A place where you borrow books.' },
  { word: 'HOSTEL', hint: 'A place where students stay on campus.' },
  { word: 'DEGREE', hint: 'A qualification awarded by a university.' },
  { word: 'SEMESTER', hint: 'Half of an academic year.' },
  { word: 'CAMPUS', hint: 'The grounds of a university.' },
  { word: 'ASSIGNMENT', hint: 'A piece of work given to a student.' },
  { word: 'NOTEBOOK', hint: 'A book for writing notes.' },
  { word: 'PEN', hint: 'An instrument for writing.' },
  { word: 'BOOK', hint: 'A collection of printed pages.' },
  { word: 'RESEARCH', hint: 'A detailed study of a subject.' },
  { word: 'STUDY', hint: 'The act of learning.' },
  { word: 'LEARNING', hint: 'The process of gaining knowledge.' },
  { word: 'UNIVERSITY', hint: 'An institution of higher education.' },
  { word: 'SCHOLARSHIP', hint: 'Financial aid for a student.' },
  { word: 'DIPLOMA', hint: 'A certificate awarded upon graduation.' },
  { word: 'CLASSROOM', hint: 'A room where lessons are held.' },
  { word: 'TEST', hint: 'An assessment of knowledge.' },
  { word: 'PROJECT', hint: 'A planned piece of work.' },
  { word: 'REPORT', hint: 'A written account of something.' },
  { word: 'PRESENTATION', hint: 'A talk to an audience.' },
  { word: 'TUTORIAL', hint: 'A small group teaching session.' },
  { word: 'ROOM', hint: 'A space in a building.' },
  { word: 'RENT', hint: 'Payment for using a property.' },
  { word: 'LANDLORD', hint: 'The owner of a rented property.' },
  { word: 'TENANT', hint: 'A person who rents a property.' },
  { word: 'SECURITY', hint: 'Measures taken to keep a place safe.' },
  { word: 'BATHROOM', hint: 'A room with a bath or shower.' },
  { word: 'KITCHEN', hint: 'A room for cooking food.' },
  { word: 'BED', hint: 'A piece of furniture for sleeping.' },
  { word: 'WINDOW', hint: 'An opening in a wall to let in light.' },
  { word: 'DOOR', hint: 'A movable barrier at the entrance.' },
  { word: 'HOUSE', hint: 'A building for living in.' },
  { word: 'HOME', hint: 'The place where one lives.' },
  { word: 'GATE', hint: 'A hinged barrier used to close an opening.' },
  { word: 'ELECTRICITY', hint: 'A form of energy used for lighting.' },
  { word: 'WATER', hint: 'A liquid essential for life.' },
  { word: 'FURNITURE', hint: 'Items like chairs and tables.' },
  { word: 'WARDROBE', hint: 'A cupboard for clothes.' },
  { word: 'MATTRESS', hint: 'A soft pad for a bed.' },
  { word: 'KEY', hint: 'A device for opening a lock.' },
  { word: 'COMPUTER', hint: 'An electronic device for processing data.' },
  { word: 'LAPTOP', hint: 'A portable computer.' },
  { word: 'PHONE', hint: 'A device for making calls.' },
  { word: 'TABLET', hint: 'A thin portable computer.' },
  { word: 'SOFTWARE', hint: 'Programs that run on a computer.' },
  { word: 'INTERNET', hint: 'A global network of computers.' },
  { word: 'WEBSITE', hint: 'A set of related web pages.' },
  { word: 'PROGRAMMING', hint: 'Writing code for computers.' },
  { word: 'JAVASCRIPT', hint: 'A popular web programming language.' },
  { word: 'REACT', hint: 'A JavaScript library for building UIs.' },
  { word: 'PYTHON', hint: 'A popular programming language.' },
  { word: 'DATABASE', hint: 'A collection of stored data.' },
  { word: 'SERVER', hint: 'A computer that provides services.' },
  { word: 'NETWORK', hint: 'A group of connected computers.' },
  { word: 'EMAIL', hint: 'Electronic mail.' },
  { word: 'PASSWORD', hint: 'A secret word for authentication.' },
  { word: 'LOGIN', hint: 'The act of signing into a system.' },
  { word: 'KEYBOARD', hint: 'A device for typing.' },
  { word: 'MOUSE', hint: 'A pointing device for a computer.' },
  { word: 'MONITOR', hint: 'A screen for displaying output.' },
  { word: 'LESOTHO', hint: 'A country in Southern Africa.' },
  { word: 'BASOTHO', hint: 'The people of Lesotho.' },
  { word: 'ROMA', hint: 'A town where NUL is located.' },
  { word: 'MASERU', hint: 'The capital city of Lesotho.' },
  { word: 'MALOTI', hint: 'The currency of Lesotho.' },
  { word: 'THABA', hint: 'A mountain in Sesotho.' },
  { word: 'MOKHOTLONG', hint: 'A district in Lesotho.' },
  { word: 'QUTHING', hint: 'A district in southern Lesotho.' },
  { word: 'LERIBE', hint: 'A district in Lesotho.' },
  { word: 'BUTHA', hint: 'A town in Lesotho.' },
  { word: 'BEREA', hint: 'A district in Lesotho.' },
  { word: 'MOHALE', hint: 'A famous Basotho warrior.' },
  { word: 'SENQU', hint: 'A major river in Lesotho.' },
  { word: 'MATEKANE', hint: 'An area in Maseru.' },
  { word: 'SESOTHO', hint: 'The language of the Basotho.' },
  { word: 'KINGDOM', hint: 'A country ruled by a king/queen.' },
  { word: 'AFRICA', hint: 'The second largest continent.' },
  { word: 'MOUNTAIN', hint: 'A very high hill.' },
  { word: 'HIGHLANDS', hint: 'An area of high land.' },
  { word: 'BLANKET', hint: 'A traditional Basotho covering.' },
  { word: 'LAW', hint: 'A system of rules.' },
  { word: 'COURT', hint: 'A place where legal cases are heard.' },
  { word: 'JUDGE', hint: 'A person who decides cases in court.' },
  { word: 'LAWYER', hint: 'A person who practices law.' },
  { word: 'CONTRACT', hint: 'A formal agreement.' },
  { word: 'RIGHTS', hint: 'Legal entitlements.' },
  { word: 'CONSTITUTION', hint: 'The supreme law of a country.' },
  { word: 'SUCCESS', hint: 'Achievement of a goal.' },
  { word: 'FOCUS', hint: 'Concentration on something.' },
  { word: 'DISCIPLINE', hint: 'Self‑control and order.' },
  { word: 'KNOWLEDGE', hint: 'Understanding and information.' },
  { word: 'COURAGE', hint: 'Bravery in difficult situations.' },
  { word: 'AMBITION', hint: 'A strong desire to succeed.' },
  { word: 'LEADER', hint: 'A person who guides others.' },
  { word: 'DREAM', hint: 'A cherished aspiration.' },
  { word: 'VISION', hint: 'A mental image of the future.' },
  { word: 'FUTURE', hint: 'The time yet to come.' },
  { word: 'PROGRESS', hint: 'Forward movement.' },
  { word: 'GROWTH', hint: 'Increase in size or ability.' },
  { word: 'OPPORTUNITY', hint: 'A chance for progress.' },
  { word: 'CREATIVITY', hint: 'The use of imagination.' },
  { word: 'BUSINESS', hint: 'Commercial activity.' },
  { word: 'ACHIEVEMENT', hint: 'Something accomplished.' },
  { word: 'INNOVATION', hint: 'A new method or idea.' },
  { word: 'MOTIVATION', hint: 'The reason to act.' },
  { word: 'CONFIDENCE', hint: 'Belief in oneself.' },
  { word: 'PERSISTENCE', hint: 'Continuing despite difficulty.' },
];

// Shuffle an array (Fisher‑Yates)
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Scramble a word (guaranteed different from original)
function scrambleWord(word) {
  const letters = word.split('');
  let scrambled;
  do {
    scrambled = shuffleArray(letters).join('');
  } while (scrambled === word && word.length > 1);
  return scrambled;
}

function WordScramble() {
  const [words] = useState(() => shuffleArray(WORDS));           // random order
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const total = words.length;
  const currentWord = words[currentIndex]?.word || '';
  const currentHint = words[currentIndex]?.hint || '';
  const scrambled = scrambleWord(currentWord);

  const checkAnswer = (e) => {
    e.preventDefault();
    const trimmed = guess.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === currentWord.toLowerCase()) {
      setScore(prev => prev + 1);
      setIsCorrect(true);
      setMessage('✅ Correct! +1 Score');
    } else {
      setMessage('❌ Try again!');
      setGuess('');            // clear input for retry
    }
  };

  const handleSkip = () => {
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex + 1 >= total) {
      setGameOver(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setGuess('');
      setMessage('');
      setShowHint(false);
      setHintUsed(false);
      setIsCorrect(false);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setGuess('');
    setMessage('');
    setShowHint(false);
    setHintUsed(false);
    setIsCorrect(false);
    setGameOver(false);
  };

  // ── Game Over Screen ──
  if (gameOver) {
    return (
      <div className="scramble-card">
        <h2>🎉 Congratulations!</h2>
        <p>You completed the Word Scramble.</p>
        <div className="final-score">
          ⭐ Final Score: {score} / {total}
        </div>
        <div className="scramble-actions">
          <button className="scramble-btn primary" onClick={restartGame}>Play Again</button>
          <Link to="/student-zone" className="scramble-btn secondary">Back to Student Zone</Link>
        </div>
      </div>
    );
  }

  // ── Main Game ──
  return (
    <div className="scramble-card">
      <h1>🔤 Word Scramble</h1>
      <div className="scramble-stats">
        <span>⭐ Score: {score}</span>
        <span>📖 Word {currentIndex + 1} of {total}</span>
      </div>

      <div className="scrambled-word">{scrambled}</div>

      {showHint && (
        <div className="hint-card">
          💡 Hint: {currentHint}
        </div>
      )}

      <form onSubmit={checkAnswer} className="scramble-form">
        <input
          type="text"
          placeholder="Type your answer"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          autoFocus
          disabled={isCorrect}
        />
        {!isCorrect ? (
          <button type="submit" className="scramble-btn primary">Check</button>
        ) : (
          <button type="button" className="scramble-btn primary" onClick={goToNext}>Next Word →</button>
        )}
      </form>

      {message && (
        <div className={`scramble-message ${isCorrect ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="scramble-extra-actions">
        {!isCorrect && !hintUsed && (
          <button className="scramble-btn hint" onClick={handleHint}>💡 Hint</button>
        )}
        {!isCorrect && (
          <button className="scramble-btn skip" onClick={handleSkip}>⏭️ Skip Word</button>
        )}
      </div>
    </div>
  );
}

export default WordScramble;