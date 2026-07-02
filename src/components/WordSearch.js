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
  const words = puzzle.words;

  // Reset state when puzzle changes
  useEffect(() => {
    setSelectedCells([]);
    setFoundWords([]);
    setMessage('');
    setPuzzleCompleted(false);
  }, [currentPuzzleIndex]);

  // Check if selected cells form a word (horizontal/vertical/diagonal)
  const checkSelection = useCallback(() => {
    if (selectedCells.length < 2) return;
    // Sort selected cells by position to detect direction
    const sorted = [...selectedCells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // Determine if cells are in a straight line
    const rowDiff = last[0] - first[0];
    const colDiff = last[1] - first[1];
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    if (steps + 1 !== selectedCells.length) return; // not a continuous line

    // Verify all cells in between are selected
    const selectedSet = new Set(selectedCells.map(([r, c]) => `${r},${c}`));
    let validLine = true;
    const directionRow = rowDiff === 0 ? 0 : rowDiff / steps;
    const directionCol = colDiff === 0 ? 0 : colDiff / steps;

    for (let i = 0; i <= steps; i++) {
      const r = first[0] + directionRow * i;
      const c = first[1] + directionCol * i;
      if (!selectedSet.has(`${r},${c}`)) {
        validLine = false;
        break;
      }
    }
    if (!validLine) return;

    // Build the word from selected cells
    const word = selectedCells
      .sort((a, b) => {
        const idxA = a[0] * grid[0].length + a[1];
        const idxB = b[0] * grid[0].length + b[1];
        return idxA - idxB;
      })
      .map(([r, c]) => grid[r][c])
      .join('');

    if (words.includes(word) && !foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word]);
      setMessage(`✅ Found: ${word}`);
      setSelectedCells([]);
    }
  }, [selectedCells, grid, words, foundWords]);

  useEffect(() => {
    checkSelection();
  }, [selectedCells, checkSelection]);

  // Check if all words found
  useEffect(() => {
    if (foundWords.length === words.length && words.length > 0) {
      setPuzzleCompleted(true);
      setMessage('🎉 Congratulations! You found all the words.');
      // Check if this was the last puzzle
      if (currentPuzzleIndex === puzzles.length - 1) {
        setAllCompleted(true);
      }
    }
  }, [foundWords, words, currentPuzzleIndex]);

  const handleCellClick = (row, col) => {
    if (puzzleCompleted) return;
    const cellKey = `${row},${col}`;
    const exists = selectedCells.some(([r, c]) => r === row && c === col);
    if (exists) {
      setSelectedCells(selectedCells.filter(([r, c]) => !(r === row && c === col)));
    } else {
      setSelectedCells([...selectedCells, [row, col]]);
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
    // Reset current puzzle
    setCurrentPuzzleIndex(currentPuzzleIndex); // triggers reset via useEffect? Actually we need to force remount. We'll just reset the state manually.
    setSelectedCells([]);
    setFoundWords([]);
    setMessage('');
    setPuzzleCompleted(false);
    // To force a new puzzle without changing index, we'll re-set the same puzzle
    // but the useEffect only runs on currentPuzzleIndex change. So we can do:
    setCurrentPuzzleIndex(prev => prev); // no change, so no remount. So we'll directly reset the found words etc. Already done above.
    // However, the cells may remain visually highlighted? We'll clear selection. That's enough.
  };

  const isSelected = (r, c) => selectedCells.some(([rr, cc]) => rr === r && cc === c);

  // Check if a cell belongs to any found word (for optional styling)
  const isCellInFoundWord = (r, c) => {
    return foundWords.some(word => {
      // find coordinates of word in grid (simple scan)
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          for (const dir of [[0,1],[1,0],[1,1],[1,-1]]) {
            let found = true;
            const cells = [];
            for (let i = 0; i < word.length; i++) {
              const rr = row + dir[0] * i;
              const cc = col + dir[1] * i;
              if (rr < 0 || rr >= grid.length || cc < 0 || cc >= grid[0].length || grid[rr][cc] !== word[i]) {
                found = false;
                break;
              }
              cells.push([rr, cc]);
            }
            if (found) {
              if (cells.some(([rr, cc]) => rr === r && cc === c)) return true;
            }
          }
        }
      }
      return false;
    });
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
        {words.map(word => (
          <span key={word} className={`ws-word ${foundWords.includes(word) ? 'found' : ''}`}>
            {word}
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