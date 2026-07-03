import React from 'react';
import { Link } from 'react-router-dom';
import './StudentZonePage.css';

const games = [
  {
    id: 'lilotho',
    title: '🎭 Lilotho',
    description: 'Traditional Basotho riddle game. Test your wit with Sesotho proverbs.',
    path: '/student-zone/lilotho',
    available: true,
  },
  {
    id: 'morabaraba',
    title: '🕹️ Morabaraba',
    description: 'The classic Basotho board game. Challenge a friend!',
    path: '/student-zone/morabaraba',
    available: true,
  },
  {
    id: 'wordscramble',
    title: '🔤 Word Scramble',
    description: 'Unscramble student‑themed words. How fast can you solve them?',
    path: '/student-zone/word-scramble',
    available: true,
  },
  {
    id: 'wordsearch',
    title: '🔍 Word Search',
    description: 'Find hidden words in the puzzle grid.',
    path: '/student-zone/word-search',
    available: true,
  },
  {
    id: 'sudoku',
    title: '🧩 Sudoku',
    description: 'Coming soon – challenge your logic skills.',
    path: null,
    available: false,
  },
  {
    id: 'memorymatch',
    title: '🃏 Memory Match',
    description: 'Coming soon – flip cards and find matching pairs.',
    path: null,
    available: false,
  },
  {
    id: 'hangman',
    title: '💀 Hangman',
    description: 'Coming soon – guess the word before it\'s too late!',
    path: null,
    available: false,
  },
  {
    id: 'quiz',
    title: '❓ Quiz Game',
    description: 'Coming soon – test your knowledge on various topics.',
    path: null,
    available: false,
  },
  {
    id: 'morebasotho',
    title: '🇱🇸 More Basotho Games',
    description: 'Coming soon – more traditional games to explore.',
    path: null,
    available: false,
  },
];

function StudentZone() {
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
          >
            <div className="sz-game-icon">{game.title.split(' ')[0]}</div>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            {game.available ? (
              <Link to={game.path} className="sz-play-btn">Play Now</Link>
            ) : (
              <button className="sz-play-btn" disabled>Coming Soon</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentZone;