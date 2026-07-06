import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './WordSearch.css';
import { puzzles } from '../utils/wordSearchPuzzles';

function WordSearch() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(() =>
    Math.floor(Math.random() * puzzles.length)
  );
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [message, setMessage] = useState('');
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const puzzle = puzzles[currentPuzzleIndex];
  const grid = puzzle.grid;
  const placedWords = puzzle.placedWords;   // { word, startRow, startCol, endRow, endCol, direction }

  // Reset when puzzle changes
  useEffect(() => {
    setSelectedCells([]);
    setFoundWords([]);
    setMessage('');
    setPuzzleCompleted(false);
  }, [currentPuzzleIndex]);

  // Check selection against placedWords coordinates
  const checkSelection = useCallback(() => {
    if (selectedCells.length < 2) return;
    const selectedSet = new Set(selectedCells.map(([r, c]) => `${r},${c}`));

    for (const pw of placedWords) {
      const { word, startRow, startCol, endRow, endCol, direction } = pw;
      // Build coordinates of this word
      const coords = [];
      let r = startRow, c = startCol;
      const dr = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
      const dc = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
      while (r !== endRow || c !== endCol) {
        coords.push([r, c]);
        r += dr; c += dc;
      }
      coords.push([endRow, endCol]);

      // Check if selected cells exactly match these coordinates (order ignored for simplicity)
      if (coords.length === selectedCells.length && coords.every(([rr, cc]) => selectedSet.has(`${rr},${cc}`))) {
        if (!foundWords.includes(word)) {
          setFoundWords(prev => [...prev, word]);
          setMessage(`✅ Found: ${word}`);
          setSelectedCells([]);
        }
        return;
      }
    }
  }, [selectedCells, placedWords, foundWords]);

  useEffect(() => {
    checkSelection();
  }, [selectedCells, checkSelection]);

  // All words found?
  useEffect(() => {
    if (foundWords.length === placedWords.length && placedWords.length > 0) {
      setPuzzleCompleted(true);
      setMessage('🎉 Congratulations! You found all the words.');
      if (currentPuzzleIndex === puzzles.length - 1) {
        setAllCompleted(true);
      }
    }
  }, [foundWords, placedWords, currentPuzzleIndex]);

  const handleCellClick = (row, col) => {
    if (puzzleCompleted) return;
    const cellKey = `${row},${col}`;
    const exists = selectedCells.some(([r, c]) => r === row && c === col);
    if (exists) {
      setSelectedCells(prev => prev.filter(([r, c]) => !(r === row && c === col)));
    } else {
      setSelectedCells(prev => [...prev, [row, col]]);
    }
  };

  const clearSelection = () => {
    setSelectedCells([]);
  };

  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
    }
  };

  const playAgain = () => {
    // Reset current puzzle (shuffle a new one)
    setCurrentPuzzleIndex(Math.floor(Math.random() * puzzles.length));
  };

  const isSelected = (r, c) => selectedCells.some(([rr, cc]) => rr === r && cc === c);
  const isCellInFoundWord = (r, c) => {
    for (const pw of placedWords) {
      if (!foundWords.includes(pw.word)) continue;
      const { startRow, startCol, endRow, endCol } = pw;
      const dr = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
      const dc = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
      let rr = startRow, cc = startCol;
      while (rr !== endRow || cc !== endCol) {
        if (rr === r && cc === c) return true;
        rr += dr; cc += dc;
      }
      if (endRow === r && endCol === c) return true;
    }
    return false;
  };

  return (
    <div className="wordsearch">
      <h2>🔍 Word Search</h2>
      <p className="puzzle-counter">Puzzle {currentPuzzleIndex + 1} of {puzzles.length}</p>

      <div className="ws-grid">
        {grid.map((row, ri) => (
          <div key={ri} className="ws-row">
            {row.map((letter, ci) => {
              const selected = isSelected(ri, ci);
              const found = isCellInFoundWord(ri, ci);
              return (
                <button
                  key={ci}
                  className={`ws-cell ${selected ? 'selected' : ''} ${found ? 'found' : ''}`}
                  onClick={() => handleCellClick(ri, ci)}
                  disabled={puzzleCompleted}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="ws-words">
        {placedWords.map(pw => (
          <span key={pw.word} className={`ws-word ${foundWords.includes(pw.word) ? 'found' : ''}`}>
            {pw.word}
          </span>
        ))}
      </div>

      {message && <p className="ws-message">{message}</p>}

      <div className="ws-actions">
        {!puzzleCompleted && (
          <button className="ws-clear" onClick={clearSelection}>Clear Selection</button>
        )}
        {puzzleCompleted && !allCompleted && (
          <>
            <button className="ws-next" onClick={nextPuzzle}>Next Puzzle ➡️</button>
            <button className="ws-play-again" onClick={playAgain}>Play Again 🔄</button>
          </>
        )}
        {allCompleted && (
          <div className="ws-all-complete">
            <p>🏆 Congratulations! You completed every Word Search puzzle.</p>
            <button className="ws-play-again" onClick={playAgain}>Play Again 🔄</button>
          </div>
        )}
      </div>

      <div className="ws-back">
        <Link to="/student-zone" className="sz-back-btn">← Back to Student Zone</Link>
      </div>
    </div>
  );
}

export default WordSearch;