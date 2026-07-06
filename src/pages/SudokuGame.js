import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SudokuGame.css';

/* ---------- SUDOKU GENERATOR / SOLVER ---------- */
const SIZE = 9;
const BOX_SIZE = 3;
const DIFFICULTY_CLUES = { easy: 38, medium: 30, hard: 24 };

function solveBoard(board) {
  // Returns solved board (copy) or null if unsolvable
  const copy = board.map(row => [...row]);
  if (solve(copy)) return copy;
  return null;
}

function solve(board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(board, r, c, num)) {
            board[r][c] = num;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValidPlacement(board, row, col, num) {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false;
    }
  }
  return true;
}

function countSolutions(board, limit = 2) {
  let count = 0;
  function solveCount(board) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, r, c, num)) {
              board[r][c] = num;
              solveCount(board);
              board[r][c] = 0;
              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  solveCount(board);
  return count;
}

function generatePuzzle(difficulty) {
  // Create a solved board
  const solved = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  fillRandom(solved);
  const solution = solved.map(row => [...row]);

  // Remove cells based on difficulty
  const clues = DIFFICULTY_CLUES[difficulty] || 30;
  const puzzle = solution.map(row => [...row]);
  const positions = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      positions.push([r, c]);
    }
  }
  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let removed = 81 - clues;
  for (const [r, c] of positions) {
    if (removed <= 0) break;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    const copy = puzzle.map(row => [...row]);
    if (countSolutions(copy, 2) === 1) {
      removed--;
    } else {
      puzzle[r][c] = backup; // restore
    }
  }

  return { puzzle, solution };
}

function fillRandom(board) {
  const nums = [1,2,3,4,5,6,7,8,9];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) {
        const shuffled = [...nums].sort(() => Math.random() - 0.5);
        for (const num of shuffled) {
          if (isValidPlacement(board, r, c, num)) {
            board[r][c] = num;
            if (fillRandom(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/* ---------- STUDY TIPS ---------- */
const STUDY_TIPS = [
  "The Pomodoro Technique (25 min study, 5 min break) can boost focus.",
  "Writing notes by hand improves memory retention.",
  "Teaching a concept to someone else is the best way to learn it.",
  "Take regular breaks to avoid burnout.",
  "A good night's sleep helps consolidate what you studied.",
  "Setting specific goals for each session increases productivity.",
  "Distraction‑free environment = better concentration.",
  "Reviewing material within 24 hours helps move it to long‑term memory.",
  "Practice active recall instead of passive reading.",
];

/* ---------- LOCAL STORAGE KEY ---------- */
const STORAGE_KEY = 'lesah_sudoku_save';

/* ---------- COMPONENT ---------- */
export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [originalPuzzle, setOriginalPuzzle] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [pencilMode, setPencilMode] = useState(false);
  const [notes, setNotes] = useState(Array(SIZE).fill().map(() => Array(SIZE).fill().map(() => new Set())));
  const [timer, setTimer] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [invalidCells, setInvalidCells] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const timerRef = useRef(null);

  // Load saved game on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setBoard(data.board);
      setSolution(data.solution);
      setOriginalPuzzle(data.originalPuzzle);
      setTimer(data.timer);
      setMistakes(data.mistakes);
      setHintsLeft(data.hintsLeft);
      setNotes(data.notes.map(row => row.map(arr => new Set(arr))));
      setDifficulty(data.difficulty);
    } else {
      startNewGame(difficulty);
    }
  }, []);

  // Timer
  useEffect(() => {
    if (board && !gameWon) {
      timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [board, gameWon]);

  // Save progress
  const saveProgress = useCallback(() => {
    if (!board || gameWon) return;
    const data = {
      board,
      solution,
      originalPuzzle,
      timer,
      mistakes,
      hintsLeft,
      notes: notes.map(row => row.map(set => [...set])),
      difficulty,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [board, solution, originalPuzzle, timer, mistakes, hintsLeft, notes, difficulty, gameWon]);

  useEffect(() => {
    saveProgress();
  }, [board, timer, mistakes, hintsLeft, notes]);

  const startNewGame = (diff) => {
    const { puzzle, solution } = generatePuzzle(diff);
    setBoard(puzzle.map(row => [...row]));
    setSolution(solution.map(row => [...row]));
    setOriginalPuzzle(puzzle.map(row => [...row]));
    setNotes(Array(SIZE).fill().map(() => Array(SIZE).fill().map(() => new Set())));
    setSelectedCell(null);
    setPencilMode(false);
    setTimer(0);
    setMistakes(0);
    setHintsLeft(3);
    setGameWon(false);
    setShowConfetti(false);
    setInvalidCells([]);
    setDifficulty(diff);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || gameWon || originalPuzzle[selectedCell[0]][selectedCell[1]] !== 0) return;

    const [r, c] = selectedCell;
    if (pencilMode) {
      const newNotes = notes.map(row => row.map(set => new Set(set)));
      if (newNotes[r][c].has(num)) {
        newNotes[r][c].delete(num);
      } else {
        newNotes[r][c].add(num);
      }
      setNotes(newNotes);
    } else {
      // Enter number
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = num;
      // Check correctness
      if (num !== solution[r][c]) {
        setMistakes(prev => prev + 1);
        setInvalidCells(prev => [...prev, `${r},${c}`]);
      } else {
        setInvalidCells(prev => prev.filter(cell => cell !== `${r},${c}`));
      }
      // Clear notes for this cell
      const newNotes = notes.map(row => row.map(set => new Set(set)));
      newNotes[r][c] = new Set();
      setNotes(newNotes);
      setBoard(newBoard);

      // Check win
      if (newBoard.every((row, ri) => row.every((val, ci) => val === solution[ri][ci]))) {
        setGameWon(true);
        setShowConfetti(true);
        clearInterval(timerRef.current);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const handleErase = () => {
    if (!selectedCell || gameWon || originalPuzzle[selectedCell[0]][selectedCell[1]] !== 0) return;
    const [r, c] = selectedCell;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = 0;
    setBoard(newBoard);
    setInvalidCells(prev => prev.filter(cell => cell !== `${r},${c}`));
    const newNotes = notes.map(row => row.map(set => new Set(set)));
    newNotes[r][c] = new Set();
    setNotes(newNotes);
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || !selectedCell || gameWon) return;
    const [r, c] = selectedCell;
    if (originalPuzzle[r][c] !== 0) return; // already filled
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = solution[r][c];
    setBoard(newBoard);
    setHintsLeft(prev => prev - 1);
    const newNotes = notes.map(row => row.map(set => new Set(set)));
    newNotes[r][c] = new Set();
    setNotes(newNotes);
    setInvalidCells(prev => prev.filter(cell => cell !== `${r},${c}`));
  };

  const handleCheckSolution = () => {
    const invalid = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] !== 0 && board[r][c] !== solution[r][c]) {
          invalid.push(`${r},${c}`);
        }
      }
    }
    setInvalidCells(invalid);
    if (invalid.length === 0) {
      alert('Everything looks correct so far!');
    }
  };

  const handleSolve = () => {
    if (window.confirm('Do you want to see the solution? This will end the game.')) {
      setBoard(solution.map(row => [...row]));
      setGameWon(true);
      setShowConfetti(true);
      clearInterval(timerRef.current);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isOriginalCell = (r, c) => originalPuzzle && originalPuzzle[r][c] !== 0;
  const isSelected = (r, c) => selectedCell && selectedCell[0] === r && selectedCell[1] === c;
  const isInvalid = (r, c) => invalidCells.includes(`${r},${c}`);
  const isSameNumber = (num) => selectedCell && board[selectedCell[0]][selectedCell[1]] === num;

  const studyTip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];

  return (
    <div className="sudoku-page">
      <div className="sudoku-container">
        <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>

        <div className="sudoku-header">
          <h1>🧩 Sudoku</h1>
          <div className="difficulty-select">
            {['easy','medium','hard'].map(d => (
              <button key={d} className={`diff-btn ${difficulty === d ? 'active' : ''}`}
                onClick={() => startNewGame(d)}>
                {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}
              </button>
            ))}
          </div>
        </div>

        <div className="sudoku-info">
          <span>⏱️ {formatTime(timer)}</span>
          <span>❌ Mistakes: {mistakes}</span>
          <span>💡 Hints: {hintsLeft}</span>
        </div>

        {/* Board */}
        <div className="sudoku-board">
          {board && board.map((row, ri) => (
            <div key={ri} className="sudoku-row">
              {row.map((val, ci) => {
                const orig = isOriginalCell(ri, ci);
                const sel = isSelected(ri, ci);
                const inv = isInvalid(ri, ci);
                const sameNum = selectedNumber && val === selectedNumber;
                return (
                  <div key={ci}
                    className={`sudoku-cell ${ri % 3 === 0 ? 'top-border' : ''} ${ci % 3 === 0 ? 'left-border' : ''} ${orig ? 'original' : ''} ${sel ? 'selected' : ''} ${inv ? 'invalid' : ''} ${sameNum ? 'same-number' : ''}`}
                    onClick={() => setSelectedCell([ri, ci])}
                  >
                    {val !== 0 ? val : (
                      <div className="notes">
                        {[1,2,3,4,5,6,7,8,9].map(n => (
                          notes[ri][ci].has(n) ? <span key={n} className="note">{n}</span> : null
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Number Pad */}
        <div className="number-pad">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="num-btn" onClick={() => handleNumberInput(n)}>{n}</button>
          ))}
          <button className="num-btn erase" onClick={handleErase}>⌫</button>
        </div>

        {/* Game Controls */}
        <div className="game-controls">
          <button className="control-btn" onClick={handleHint} disabled={hintsLeft <= 0}>💡 Hint</button>
          <button className="control-btn" onClick={() => setPencilMode(!pencilMode)}>{pencilMode ? '✏️ On' : '📝 Pencil'}</button>
          <button className="control-btn" onClick={handleCheckSolution}>✅ Check</button>
          <button className="control-btn" onClick={handleSolve}>🔍 Solve</button>
          <button className="control-btn new-game" onClick={() => startNewGame(difficulty)}>🔄 New Game</button>
        </div>

        {/* Study Tip */}
        <div className="study-tip-card">
          💡 <strong>Study Tip of the Day</strong>
          <p>{studyTip}</p>
        </div>

        {/* Win Overlay */}
        {gameWon && (
          <div className="victory-overlay">
            <div className="victory-card">
              <h2>🎉 Congratulations!</h2>
              <p>You solved the puzzle!</p>
              <div className="stats">
                <div>⏱️ Time: {formatTime(timer)}</div>
                <div>{difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴'} {difficulty}</div>
                <div>❌ Mistakes: {mistakes}</div>
              </div>
              <div className="victory-buttons">
                <button onClick={() => startNewGame(difficulty)}>Play Again</button>
                <Link to="/student-zone">Back to Student Zone</Link>
              </div>
            </div>
          </div>
        )}

        {showConfetti && <Confetti />}
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ['#f43f5e','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'];
  return (
    <div className="confetti-container">
      {Array.from({length: 60}).map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: Math.random()*100+'%',
          animationDelay: Math.random()*2+'s',
          backgroundColor: colors[Math.floor(Math.random()*colors.length)],
          width: Math.random()*10+6+'px',
          height: Math.random()*10+6+'px',
        }} />
      ))}
    </div>
  );
}