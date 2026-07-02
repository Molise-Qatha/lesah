// src/components/WordSearch.js
import React, { useState, useEffect } from 'react';
import './WordSearch.css';

// Pre‑made puzzle: 10x10 grid with hidden words (horizontal/vertical)
const PUZZLE = {
  grid: [
    ['L','E','S','O','T','H','O','E','S','A'],
    ['E','R','O','M','A','L','I','B','R','A'],
    ['S','U','C','C','E','S','S','T','U','D'],
    ['A','H','O','S','T','E','L','E','X','A'],
    ['H','L','A','W','T','R','A','C','T','I'],
    ['E','X','A','M','P','L','E','S','O','N'],
    ['L','E','S','A','H','S','T','U','D','Y'],
    ['L','I','B','R','A','R','Y','R','O','M'],
    ['O','S','T','U','D','E','N','T','H','E'],
    ['T','R','A','C','T','I','O','N','S','S'],
  ],
  words: ['LESOTHO', 'LESAH', 'STUDENT', 'LAW', 'EXAM', 'HOSTEL', 'LIBRARY', 'ROMA', 'SUCCESS', 'TRACTION'],
};

function WordSearch() {
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [message, setMessage] = useState('');

  const grid = PUZZLE.grid;
  const words = PUZZLE.words;

  // Check if selected cells form one of the target words (horizontal/vertical only for simplicity)
  useEffect(() => {
    if (selectedCells.length >= 2) {
      const selectedWord = selectedCells.map(([r, c]) => grid[r][c]).join('');
      if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        setFoundWords([...foundWords, selectedWord]);
        setMessage(`✅ Found: ${selectedWord}`);
        setSelectedCells([]);
      }
    }
  }, [selectedCells]);

  const handleCellClick = (row, col) => {
    // toggle selection
    const exists = selectedCells.some(([r, c]) => r === row && c === col);
    if (exists) {
      setSelectedCells(selectedCells.filter(([r, c]) => !(r === row && c === col)));
    } else {
      setSelectedCells([...selectedCells, [row, col]]);
    }
  };

  const isSelected = (r, c) => selectedCells.some(([rr, cc]) => rr === r && cc === c);
  const isFound = (word) => foundWords.includes(word);

  return (
    <div className="wordsearch">
      <h2>🔍 Word Search</h2>
      <div className="ws-grid">
        {grid.map((row, ri) => (
          <div key={ri} className="ws-row">
            {row.map((letter, ci) => (
              <button
                key={ci}
                className={`ws-cell ${isSelected(ri, ci) ? 'selected' : ''} ${foundWords.some(word => {
                  // optional: highlight letters of found words (can be improved)
                  return false;
                }) ? 'found' : ''}`}
                onClick={() => handleCellClick(ri, ci)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="ws-words">
        {words.map(word => (
          <span key={word} className={`ws-word ${isFound(word) ? 'found' : ''}`}>
            {word}
          </span>
        ))}
      </div>
      {message && <p className="ws-message">{message}</p>}
      {foundWords.length === words.length && (
        <p className="ws-complete">🎉 You found all words!</p>
      )}
      <button className="ws-clear" onClick={() => setSelectedCells([])}>Clear Selection</button>
    </div>
  );
}

export default WordSearch;