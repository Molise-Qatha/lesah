// src/pages/StudentZone.js
import React, { useState } from 'react';
import './StudentZonePage.css';
import GameSection from '../components/GameSection';      // Lilotho + English
import WordScramble from '../components/WordScramble';
import WordSearch from '../components/WordSearch';

const games = [
  {
    id: 'lilotho',
    title: '🎭 Lilotho',
    description: 'Traditional Basotho riddle game. Test your wit with Sesotho proverbs.',
    available: true,
  },
  {
    id: 'english',
    title: '🧠 English Puzzles',
    description: 'Mind‑bending riddles and brain teasers.',
    available: true,
  },
  {
    id: 'wordscramble',
    title: '🔤 Word Scramble',
    description: 'Unscramble student‑themed words. How fast can you solve them?',
    available: true,
  },
  {
    id: 'wordsearch',
    title: '🔍 Word Search',
    description: 'Find hidden words in the puzzle grid.',
    available: true,
  },
  {
    id: 'sudoku',
    title: '🧩 Sudoku',
    description: 'Coming soon – challenge your logic skills.',
    available: false,
  },
  {
    id: 'memorymatch',
    title: '🃏 Memory Match',
    description: 'Coming soon – flip cards and find matching pairs.',
    available: false,
  },
  {
    id: 'hangman',
    title: '💀 Hangman',
    description: 'Coming soon – guess the word before it\'s too late!',
    available: false,
  },
  {
    id: 'quiz',
    title: '❓ Quiz Game',
    description: 'Coming soon – test your knowledge on various topics.',
    available: false,
  },
  {
    id: 'morebasotho',
    title: '🇱🇸 More Basotho Games',
    description: 'Coming soon – more traditional games to explore.',
    available: false,
  },
];

function StudentZone() {
  const [activeGame, setActiveGame] = useState(null);

  const handleCardClick = (gameId) => {
    if (games.find(g => g.id === gameId)?.available) {
      setActiveGame(gameId);
    }
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'lilotho':
      case 'english':
        // Both modes are inside GameSection; we pass a prop to start in the selected mode
        return <GameSection initialMode={activeGame} />;
      case 'wordscramble':
        return <WordScramble />;
      case 'wordsearch':
        return <WordSearch />;
      default:
        return null;
    }
  };

  return (
    <div className="student-zone-page">
      <div className="sz-hero">
        <h1>🎓 Student Zone</h1>
        <p>Take a break. Refresh your mind. Challenge yourself.</p>
        <p className="sz-sub">Play traditional Basotho games and brain puzzles.</p>
      </div>

      <div className="sz-games-grid">
        {games.map(game => (
          <div
            key={game.id}
            className={`sz-game-card ${!game.available ? 'disabled' : ''}`}
            onClick={() => handleCardClick(game.id)}
          >
            <div className="sz-game-icon">{game.title.split(' ')[0]}</div>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            {game.available ? (
              <button className="sz-play-btn">Play Now</button>
            ) : (
              <button className="sz-play-btn" disabled>Coming Soon</button>
            )}
          </div>
        ))}
      </div>

      {activeGame && (
        <div className="sz-game-area">
          <button className="sz-back-btn" onClick={() => setActiveGame(null)}>← Back to Games</button>
          {renderGame()}
        </div>
      )}
    </div>
  );
}

export default StudentZone;