import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Morabaraba.css';
import greenPieceImg from './morabaraba-green-piece.png';
import brownPieceImg from './morabaraba-brown-piece.png';
import boardBgImg from './morabaraba-board.jpg';

/* ==================== BOARD GEOMETRY (25 points) ==================== */
/* 🛠️ FINE-TUNED: Added perspective offsets for the Center Vertical Line */
const CENTER = 150;   // Base center
const OUTER = 98;     // Outer ring
const MID = 50;       // Middle ring
const INNER = 25;     // Inner ring
const TOP_OUTER = -6;  // Top outer ring
const TOP_MID = -4;    // Top middle ring
const TOP_INNER = -2;  // Top inner ring
const BOTTOM_INNER = 2; // 🛠️ Pushed bottom inner piece DOWN slightly
const CENTER_OFFSET = 1; // 🛠️ Pushed center piece DOWN slightly (perspective bulge)

const POINTS = [
  // Outer Ring (0-7)
  { id: 0,  x: CENTER - OUTER, y: CENTER - OUTER + TOP_OUTER },
  { id: 1,  x: CENTER, y: CENTER - OUTER + TOP_OUTER },
  { id: 2,  x: CENTER + OUTER, y: CENTER - OUTER + TOP_OUTER },
  { id: 3,  x: CENTER + OUTER, y: CENTER },
  { id: 4,  x: CENTER + OUTER, y: CENTER + OUTER },
  { id: 5,  x: CENTER, y: CENTER + OUTER },
  { id: 6,  x: CENTER - OUTER, y: CENTER + OUTER },
  { id: 7,  x: CENTER - OUTER, y: CENTER },
  // Middle Ring (8-15)
  { id: 8,  x: CENTER - MID, y: CENTER - MID + TOP_MID },
  { id: 9,  x: CENTER, y: CENTER - MID + TOP_MID },
  { id: 10, x: CENTER + MID, y: CENTER - MID + TOP_MID },
  { id: 11, x: CENTER + MID, y: CENTER },
  { id: 12, x: CENTER + MID, y: CENTER + MID },
  { id: 13, x: CENTER, y: CENTER + MID },
  { id: 14, x: CENTER - MID, y: CENTER + MID },
  { id: 15, x: CENTER - MID, y: CENTER },
  // Inner Ring (16-23)
  { id: 16, x: CENTER - INNER, y: CENTER - INNER + TOP_INNER },
  { id: 17, x: CENTER, y: CENTER - INNER + TOP_INNER },
  { id: 18, x: CENTER + INNER, y: CENTER - INNER + TOP_INNER },
  { id: 19, x: CENTER + INNER, y: CENTER },
  { id: 20, x: CENTER + INNER, y: CENTER + INNER },
  { id: 21, x: CENTER, y: CENTER + INNER + BOTTOM_INNER }, // 🛠️ Bottom inner pushed down
  { id: 22, x: CENTER - INNER, y: CENTER + INNER },
  { id: 23, x: CENTER - INNER, y: CENTER },
  // Center (24)
  { id: 24, x: CENTER, y: CENTER + CENTER_OFFSET }, // 🛠️ Center pushed down slightly
];

/* ==================== ADJACENCY ==================== */
const RAW_ADJ = {
  0: [1, 7], 1: [0, 2, 9], 2: [1, 3], 3: [2, 4, 11], 4: [3, 5], 5: [4, 6, 13], 6: [5, 7], 7: [6, 0, 15],
  8: [9, 15], 9: [8, 10, 1, 17], 10: [9, 11], 11: [10, 12, 3, 19],
  12: [11, 13], 13: [12, 14, 5, 21], 14: [13, 15], 15: [14, 8, 7, 23],
  16: [17, 23], 17: [16, 18, 9, 24], 18: [17, 19], 19: [18, 20, 11, 24],
  20: [19, 21], 21: [20, 22, 13, 24], 22: [21, 23], 23: [22, 16, 15, 24],
  24: [17, 21, 23, 19],
};

const ADJ = {};
for (let i = 0; i < 25; i++) ADJ[i] = [];
Object.entries(RAW_ADJ).forEach(([k, v]) => {
  const key = +k;
  v.forEach(n => { if (!ADJ[key].includes(n)) ADJ[key].push(n); });
});
for (let i = 0; i < 25; i++) {
  ADJ[i].forEach(j => { if (!ADJ[j].includes(i)) ADJ[j].push(i); });
  ADJ[i].sort();
}

/* ==================== MILLS ==================== */
const ALL_LINES = [
  [0,1,2], [2,3,4], [4,5,6], [6,7,0],
  [8,9,10], [10,11,12], [12,13,14], [14,15,8],
  [16,17,18], [18,19,20], [20,21,22], [22,23,16],
  [1,9,17], [9,17,24], [17,24,21], [24,21,13], [21,13,5],
  [7,15,23], [15,23,24], [23,24,19], [24,19,11], [19,11,3],
];
const MILLS = ALL_LINES.filter(arr => {
  const [a,b,c] = arr;
  const p1=POINTS[a], p2=POINTS[b], p3=POINTS[c];
  const cross = (p2.x-p1.x)*(p3.y-p1.y) - (p2.y-p1.y)*(p3.x-p1.x);
  if (Math.abs(cross) > 0.1) return false;
  const dot = (p3.x-p1.x)*(p2.x-p1.x) + (p3.y-p1.y)*(p2.y-p1.y);
  return dot >= 0;
});

/* ==================== CONSTANTS ==================== */
const PHASE = { PLACING: 'placing', MOVING: 'moving', FLYING: 'flying' };
const NUM_PIECES = 12;
const TIME_OPTIONS = [
  { label: '30 sec', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: 'No limit', value: 0 },
];

/* ==================== AUDIO ==================== */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudioCtx() { if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx; }
function playTone(freq, duration, type = 'sine', volume = 0.15) {
  try { const ctx = getAudioCtx(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration);
  } catch (e) {} }
function playChord(freqs, duration, volume = 0.12) { freqs.forEach(f => playTone(f, duration, 'triangle', volume)); }
const sounds = {
  place: () => { playTone(600,0.1); setTimeout(()=>playTone(800,0.08),50); },
  move: () => playTone(400,0.15,'triangle',0.1),
  mill: () => { playChord([523,659,784],0.4); setTimeout(()=>playChord([659,784,1047],0.5),300); },
  capture: () => { playTone(800,0.15,'square',0.08); setTimeout(()=>playTone(600,0.2,'sawtooth',0.06),100); },
  victory: () => { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.6,'triangle',0.2),i*200)); setTimeout(()=>playChord([523,659,784,1047],1.2,0.25),800); },
  click: () => playTone(1000,0.05,'sine',0.05),
};

/* ==================== HELPERS ==================== */
function millsForPlayer(board, point, player) {
  return MILLS.filter(m => m.includes(point) && m.every(i => board[i] === player));
}
function getRemovable(board, opponent) {
  const pieces = board.reduce((a, v, i) => v === opponent ? [...a, i] : a, []);
  const notInMill = pieces.filter(i => millsForPlayer(board, i, opponent).length === 0);
  return notInMill.length ? notInMill : pieces;
}
function validDestinations(board, point, player, phase) {
  if (phase === PHASE.FLYING) return board.reduce((a, v, i) => v === null ? [...a, i] : a, []);
  return ADJ[point].filter(i => board[i] === null);
}
function canPlayerMove(board, player, phase) {
  if (phase === PHASE.FLYING) return board.includes(null);
  return board.some((v, i) => v === player && validDestinations(board, i, player, phase).length > 0);
}
function boardToString(board) { return board.map(c => c ?? '.').join(''); }

function checkGameOver(s) {
  if (s.gameOver || s.phase === PHASE.PLACING) return;
  const opp = s.player === 'green' ? 'brown' : 'green';
  if (s.onBoard[opp] < 3) {
    s.gameOver = true; s.winner = s.player; s.message = `🏆 ${s.player.toUpperCase()} Wins!`;
    sounds.victory(); return;
  }
  const oppPhase = s.onBoard[opp] === 3 ? PHASE.FLYING : s.phase;
  if (!canPlayerMove(s.board, opp, oppPhase)) {
    s.gameOver = true; s.winner = s.player; s.message = `🏆 ${s.player.toUpperCase()} Wins!`;
    sounds.victory();
  }
}

function cloneState(s) {
  return {
    ...s,
    board: [...s.board], toPlace: { ...s.toPlace }, onBoard: { ...s.onBoard },
    history: [...s.history], moves: [...s.moves], removable: [...s.removable],
    millPoints: s.millPoints ? [...s.millPoints] : null,
    repetitionCount: { ...s.repetitionCount },
  };
}

function freshState(timeLimit = 120) {
  return {
    board: Array(25).fill(null),
    player: 'green',
    phase: PHASE.PLACING,
    toPlace: { green: NUM_PIECES, brown: NUM_PIECES },
    onBoard: { green: 0, brown: 0 },
    selected: null, moves: [],
    millAlert: false, removable: [], millPoints: null,
    history: [],
    repetitionCount: {},
    winner: null, gameOver: false, message: '',
    gameTimeRemaining: timeLimit === 0 ? null : timeLimit,
    timeLimit: timeLimit,
  };
}

/* ==================== AI ==================== */
function evaluateState(s) {
  const aiPlayer = 'brown', human = 'green';
  let score = 0;
  score += (s.onBoard[aiPlayer] - s.onBoard[human]) * 10;
  const aiPhase = s.onBoard[aiPlayer] === 3 ? PHASE.FLYING : s.phase;
  const humanPhase = s.onBoard[human] === 3 ? PHASE.FLYING : s.phase;
  let aiMobility = 0, humanMobility = 0;
  s.board.forEach((v, i) => {
    if (v === aiPlayer) aiMobility += validDestinations(s.board, i, aiPlayer, aiPhase).length;
    if (v === human) humanMobility += validDestinations(s.board, i, human, humanPhase).length;
  });
  score += (aiMobility - humanMobility) * 2;
  let aiMills = 0, humanMills = 0;
  MILLS.forEach(mill => {
    if (mill.every(i => s.board[i] === aiPlayer)) aiMills++;
    if (mill.every(i => s.board[i] === human)) humanMills++;
  });
  score += (aiMills - humanMills) * 30;
  if (s.onBoard[aiPlayer] === 3 && s.onBoard[human] > 3) score += 20;
  if (s.onBoard[human] === 3 && s.onBoard[aiPlayer] > 3) score -= 20;
  return score;
}
function generateMoves(s) {
  const moves = [];
  const p = s.player, opp = p === 'green' ? 'brown' : 'green';
  const fly = s.onBoard[p] === 3 ? PHASE.FLYING : s.phase;
  if (s.phase === PHASE.PLACING) {
    s.board.forEach((cell, i) => {
      if (cell === null) {
        const next = cloneState(s);
        next.board[i] = p; next.toPlace[p]--; next.onBoard[p]++;
        const mill = millsForPlayer(next.board, i, p);
        if (next.toPlace.green === 0 && next.toPlace.brown === 0) next.phase = PHASE.MOVING;
        if (mill.length > 0) {
          getRemovable(next.board, opp).forEach(r => {
            const after = cloneState(next);
            after.board[r] = null; after.onBoard[opp]--; after.player = opp;
            moves.push({ state: after });
          });
        } else {
          next.player = opp;
          moves.push({ state: next });
        }
      }
    });
  } else {
    s.board.forEach((cell, i) => {
      if (cell === p) {
        validDestinations(s.board, i, p, fly).forEach(d => {
          const next = cloneState(s);
          next.board[i] = null; next.board[d] = p; next.selected = null; next.moves = [];
          const mill = millsForPlayer(next.board, d, p);
          if (mill.length > 0) {
            getRemovable(next.board, opp).forEach(r => {
              const after = cloneState(next);
              after.board[r] = null; after.onBoard[opp]--; after.player = opp;
              moves.push({ state: after });
            });
          } else {
            next.player = opp;
            moves.push({ state: next });
          }
        });
      }
    });
  }
  return moves;
}
function minimax(state, depth, alpha, beta, max) {
  if (depth === 0 || state.gameOver) return evaluateState(state);
  const moves = generateMoves(state);
  if (!moves.length) return evaluateState(state);
  if (max) {
    let best = -Infinity;
    for (const m of moves) { best = Math.max(best, minimax(m.state, depth-1, alpha, beta, false)); alpha = Math.max(alpha, best); if (beta <= alpha) break; }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) { best = Math.min(best, minimax(m.state, depth-1, alpha, beta, true)); beta = Math.min(beta, best); if (beta <= alpha) break; }
    return best;
  }
}
function computerMove(s) {
  const moves = generateMoves(s);
  if (!moves.length) { const next = cloneState(s); next.player = s.player === 'green' ? 'brown' : 'green'; return next; }
  const depth = 4;
  let best = moves[0], bestScore = -Infinity;
  for (const m of moves) {
    const score = minimax(m.state, depth-1, -Infinity, Infinity, false);
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best.state;
}

/* ==================== MAIN COMPONENT ==================== */
export default function Morabaraba() {
  const [mode, setMode] = useState(null);
  const [gameTime, setGameTime] = useState(120);
  const [s, setS] = useState(freshState(120));
  const [rulesOpen, setRulesOpen] = useState(false);
  const [animating, setAnimating] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [capturingPiece, setCapturingPiece] = useState(null);

  const timerRef = useRef(null);
  const aiTimerRef = useRef(null);
  const thinkingRef = useRef(false);

  const startGame = () => {
    setMode('vsComputer');
    setS(freshState(gameTime));
    setThinking(false);
    thinkingRef.current = false;
    setShowConfetti(false);
    setCapturingPiece(null);
    sounds.click();
  };

  useEffect(() => {
    if (!mode || s.gameOver || s.millAlert || s.gameTimeRemaining === null) return;
    timerRef.current = setInterval(() => {
      setS(prev => {
        if (prev.gameTimeRemaining <= 1) {
          clearInterval(timerRef.current);
          const greenCount = prev.onBoard.green;
          const brownCount = prev.onBoard.brown;
          let msg = '';
          if (greenCount > brownCount) { prev.winner = 'green'; msg = '🏆 Green Wins (time)'; }
          else if (brownCount > greenCount) { prev.winner = 'brown'; msg = '🏆 Brown Wins (time)'; }
          else { prev.winner = null; msg = '🤝 Draw (time)'; }
          return { ...prev, gameOver: true, message: msg, gameTimeRemaining: 0 };
        }
        return { ...prev, gameTimeRemaining: prev.gameTimeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [mode, s.gameOver, s.millAlert, s.player, s.gameTimeRemaining]);

  useEffect(() => {
    if (mode !== 'vsComputer' || s.player !== 'brown' || s.gameOver || s.millAlert) return;
    if (thinkingRef.current) return;
    thinkingRef.current = true;
    setThinking(true);
    aiTimerRef.current = setTimeout(() => {
      setS(prev => {
        const bestMove = computerMove(prev);
        checkGameOver(bestMove);
        if (bestMove.gameOver) setShowConfetti(true);
        const boardKey = boardToString(bestMove.board) + bestMove.player;
        const repCount = (bestMove.repetitionCount[boardKey] || 0) + 1;
        bestMove.repetitionCount = { ...bestMove.repetitionCount, [boardKey]: repCount };
        if (repCount >= 3) { bestMove.gameOver = true; bestMove.message = '🤝 Draw (repetition)'; }
        thinkingRef.current = false;
        setThinking(false);
        return bestMove;
      });
    }, 600);
    return () => clearTimeout(aiTimerRef.current);
  }, [s.player, s.gameOver, s.millAlert, mode]);

  const click = useCallback((pointId, action) => {
    if (mode === 'vsComputer' && s.player === 'brown') return;
    setS(prev => {
      if (prev.gameOver) return prev;
      if (prev.millAlert && action !== 'remove') return prev;
      let next = cloneState(prev);
      const p = next.player, opp = p === 'green' ? 'brown' : 'green';

      if (action === 'place' && next.phase === PHASE.PLACING && !next.board[pointId]) {
        next.board[pointId] = p; next.toPlace[p]--; next.onBoard[p]++;
        const mill = millsForPlayer(next.board, pointId, p);
        sounds.place();
        if (next.toPlace.green === 0 && next.toPlace.brown === 0) next.phase = PHASE.MOVING;
        if (mill.length > 0) {
          next.millAlert = true; next.removable = getRemovable(next.board, opp);
          next.millPoints = mill[0];
          sounds.mill();
        } else {
          next.player = opp; checkGameOver(next);
          const key = boardToString(next.board) + next.player;
          next.repetitionCount = { ...next.repetitionCount, [key]: (next.repetitionCount[key]||0)+1 };
          if (next.repetitionCount[key] >= 3) { next.gameOver = true; next.message = '🤝 Draw (repetition)'; }
        }
        setAnimating(pointId); setTimeout(() => setAnimating(null), 400);
        return next;
      }
      if (action === 'remove' && prev.millAlert && prev.removable.includes(pointId)) {
        setCapturingPiece(pointId);
        sounds.capture();
        setTimeout(() => {
          setCapturingPiece(null);
          setS(prev => {
            const n = cloneState(prev);
            n.board[pointId] = null; n.onBoard[opp]--; n.millAlert = false; n.removable = []; n.millPoints = null;
            n.player = opp; checkGameOver(n);
            if (n.gameOver) setShowConfetti(true);
            return n;
          });
        }, 600);
        return { ...prev, millAlert: false };
      }
      if (action === 'select' && next.phase !== PHASE.PLACING && next.board[pointId] === p) {
        const fly = next.onBoard[p] === 3 ? PHASE.FLYING : next.phase;
        next.selected = pointId; next.moves = validDestinations(next.board, pointId, p, fly);
        sounds.click();
        return next;
      }
      if (action === 'move' && prev.selected !== null && prev.moves.includes(pointId)) {
        next.board[prev.selected] = null; next.board[pointId] = p;
        next.selected = null; next.moves = [];
        const mill = millsForPlayer(next.board, pointId, p);
        sounds.move();
        if (mill.length > 0) {
          next.millAlert = true; next.removable = getRemovable(next.board, opp);
          next.millPoints = mill[0];
          sounds.mill();
        } else {
          next.player = opp; checkGameOver(next);
          const key = boardToString(next.board) + next.player;
          next.repetitionCount = { ...next.repetitionCount, [key]: (next.repetitionCount[key]||0)+1 };
          if (next.repetitionCount[key] >= 3) { next.gameOver = true; next.message = '🤝 Draw (repetition)'; }
        }
        setAnimating(pointId); setTimeout(() => setAnimating(null), 400);
        return next;
      }
      return prev;
    });
  }, [mode, s.player]);

  useEffect(() => { if (s.gameOver) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); } }, [s.gameOver]);

  const phaseText = () => {
    if (s.phase === PHASE.PLACING) return 'Placing Pieces';
    if (s.onBoard[s.player] === 3 && s.phase === PHASE.MOVING) return 'Flying';
    return 'Moving Pieces';
  };

  if (!mode) {
    return (
      <div className="morabaraba-landing">
        <div className="morabaraba-landing-inner">
          <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>
          
          <div className="landing-header">
            <h1>MORABARABA</h1>
            <p className="landing-subtitle">Traditional Basotho Strategy Game</p>
            <p className="landing-desc">Challenge the AI in the classic game of Morabaraba.</p>
          </div>

          <button className="ai-play-card" onClick={startGame}>
            <span className="ai-play-icon">🤖</span>
            <span className="ai-play-title">Play Against AI</span>
            <span className="ai-play-subtitle">Challenge the LeSAH AI</span>
          </button>

          <div className="game-time-section">
            <h2>Game Time</h2>
            <div className="time-chips">
              {TIME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`time-chip ${gameTime === opt.value ? 'active' : ''}`}
                  onClick={() => { setGameTime(opt.value); sounds.click(); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button className="start-game-btn" onClick={startGame}>
            START GAME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="morabaraba-page">
      {showConfetti && <Confetti />}
      <div className="morabaraba-container">
        <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>
        <div className="game-header">
          <h1>🕹️ Morabaraba</h1>
          <p className="basotho-subtitle">Papali ea Basotho</p>
          <button onClick={() => setMode(null)} className="back-to-menu-btn">← Change Mode</button>
        </div>
        <div className="game-info">
          <div className="info-section">
            <div className={`player-indicator ${s.player}`}>
              <span className="player-dot"></span> {s.player === 'green' ? 'YOU' : 'AI'}
              {s.player === 'brown' && <span className="ai-label"> (VERY HARD)</span>}
            </div>
            <div className="phase-indicator">Phase: {phaseText()}</div>
            {s.gameTimeRemaining !== null && (
              <div className="timer-display">⏳ {Math.floor(s.gameTimeRemaining / 60)}:{(s.gameTimeRemaining % 60).toString().padStart(2, '0')}</div>
            )}
          </div>
          <div className="piece-counts">
            {s.phase === PHASE.PLACING ? (
              <><div>🟢 You to place: {s.toPlace.green}</div><div>🟤 AI to place: {s.toPlace.brown}</div></>
            ) : (
              <><div>🟢 You: {s.onBoard.green}</div><div>🟤 AI: {s.onBoard.brown}</div></>
            )}
          </div>
          {thinking && <div className="thinking-indicator">AI is thinking…</div>}
        </div>
        {s.millAlert && <div className="mill-alert">⚡ Mill formed! Capture one opponent piece.</div>}
        {capturingPiece !== null && <div className="capture-alert">🔴 Removing piece…</div>}
        
        <Board s={s} animating={animating} capturing={capturingPiece} click={click} mode={mode} />

        <div className="controls">
          <button onClick={() => { setS(freshState(gameTime)); sounds.click(); }} className="control-btn restart">🔄 Restart</button>
          <button onClick={() => setRulesOpen(true)} className="control-btn rules">📖 How to Play</button>
        </div>
        {s.gameOver && (
          <div className="victory-overlay">
            <div className="victory-card">
              <h2>{s.message}</h2>
              <button onClick={() => { setS(freshState(gameTime)); sounds.click(); }} className="play-again-btn">Play Again</button>
            </div>
          </div>
        )}
        <RulesModal open={rulesOpen} close={() => setRulesOpen(false)} />
      </div>
    </div>
  );
}

/* ==================== THE FIXED 3D BOARD ==================== */
function Board({ s, animating, capturing, click, mode }) {
  const millPointSet = s.millPoints ? new Set(s.millPoints) : new Set();
  
  return (
    <div 
      className="board-3d-container" 
      style={{ 
        backgroundImage: `url(${boardBgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        aspectRatio: '1',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        touchAction: 'manipulation'
      }}
    >
      <svg 
        viewBox="0 0 300 300" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none' 
        }}
      >
        {POINTS.map(pt => {
          const piece = s.board[pt.id];
          const isSel = s.selected === pt.id;
          const isValid = s.moves.includes(pt.id);
          const isRem = s.removable.includes(pt.id);
          const isMill = millPointSet.has(pt.id);
          const clickable = (mode === 'vsComputer' && s.player === 'green');
          const pieceImg = piece === 'green' ? greenPieceImg : brownPieceImg;
          
          return (
            <g key={pt.id}>
              {/* Invisible click area */}
              <circle 
                cx={pt.x} cy={pt.y} r="16" fill="transparent"
                onClick={() => {
                  if (!clickable) return;
                  if (isRem && s.millAlert) click(pt.id, 'remove');
                  else if (isValid && s.selected !== null) click(pt.id, 'move');
                  else if (piece === s.player && s.phase !== PHASE.PLACING) click(pt.id, 'select');
                  else if (s.phase === PHASE.PLACING && !piece) click(pt.id, 'place');
                }}
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
              />
              
              {/* 3D Piece Image */}
              {piece && (
                <image 
                  href={pieceImg}
                  x={pt.x - 15}
                  y={pt.y - 15}
                  width="30"
                  height="30"
                  style={{ 
                    pointerEvents: 'none',
                    filter: isSel ? 'drop-shadow(0 0 5px #facc15)' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))'
                  }}
                />
              )}
              
              {/* Mill Ring */}
              {isMill && (
                <circle cx={pt.x} cy={pt.y} r="18" fill="none" stroke="#facc15" strokeWidth="2" />
              )}
              
              {/* Valid Move Indicator */}
              {isValid && !piece && (
                <circle cx={pt.x} cy={pt.y} r="5" fill="rgba(16,185,129,0.7)" />
              )}
              
              {/* Removable Indicator */}
              {isRem && s.millAlert && (
                <circle cx={pt.x} cy={pt.y} r="16" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RulesModal({ open, close }) {
  if (!open) return null;
  return (
    <div className="rules-modal-overlay" onClick={close}>
      <div className="rules-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>✕</button>
        <h2>How to Play</h2>
        <p><strong>Phase 1 – Placing:</strong> Alternate placing pieces until all 24 are placed.</p>
        <p><strong>Phase 2 – Moving:</strong> Move one piece per turn along lines.</p>
        <p><strong>Phase 3 – Flying:</strong> With 3 pieces left, move anywhere.</p>
        <p><strong>Mills:</strong> Form 3 in a line to capture an opponent piece.</p>
        <p><strong>Winning:</strong> Reduce opponent to fewer than 3 pieces or block all moves.</p>
        <p><strong>Draw:</strong> If the same position repeats 3 times, the game is a draw.</p>
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