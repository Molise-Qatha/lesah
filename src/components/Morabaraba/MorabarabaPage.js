import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Morabaraba.css';

/* ---------- 25‑POINT BOARD (PLUS CENTRE) ---------- */
const POINTS = [
  { id: 0,  x: 30, y: 30 },  { id: 1,  x: 150, y: 30 },  { id: 2,  x: 270, y: 30 },
  { id: 3,  x: 270, y: 150 }, { id: 4,  x: 270, y: 270 }, { id: 5,  x: 150, y: 270 },
  { id: 6,  x: 30, y: 270 }, { id: 7,  x: 30, y: 150 },
  { id: 8,  x: 90, y: 90 },  { id: 9,  x: 150, y: 90 },  { id: 10, x: 210, y: 90 },
  { id: 11, x: 210, y: 150 }, { id: 12, x: 210, y: 210 }, { id: 13, x: 150, y: 210 },
  { id: 14, x: 90, y: 210 }, { id: 15, x: 90, y: 150 },
  { id: 16, x: 120, y: 120 },{ id: 17, x: 150, y: 120 },{ id: 18, x: 180, y: 120 },
  { id: 19, x: 180, y: 150 },{ id: 20, x: 180, y: 180 },{ id: 21, x: 150, y: 180 },
  { id: 22, x: 120, y: 180 },{ id: 23, x: 120, y: 150 },
  { id: 24, x: 150, y: 150 },
];

/* ---------- ADJACENCY ---------- */
const BASE_ADJ = {
  0: [1,7], 1: [0,2], 2: [1,3], 3: [2,4], 4: [3,5], 5: [4,6], 6: [5,7], 7: [6,0],
  8: [9,15], 9: [8,10], 10: [9,11], 11: [10,12], 12: [11,13], 13: [12,14], 14: [13,15], 15: [14,8],
  16: [17,23], 17: [16,18], 18: [17,19], 19: [18,20], 20: [19,21], 21: [20,22], 22: [21,23], 23: [22,16],
};

const MIDDLE_CONNECTIONS = {
  1: [9],   9: [1,17],   17: [9,24],   24: [17],
  24: [21],  21: [24,13], 13: [21,5],   5: [13],
  7: [15],   15: [7,23],  23: [15,24],  24: [23],
  24: [19],  19: [24,11], 11: [19,3],   3: [11],
};

const ADJ = {};
for (let i = 0; i < 25; i++) ADJ[i] = [];
Object.entries(BASE_ADJ).forEach(([k, v]) => v.forEach(n => ADJ[+k].push(n)));
Object.entries(MIDDLE_CONNECTIONS).forEach(([k, v]) => v.forEach(n => { if (!ADJ[+k].includes(n)) ADJ[+k].push(n); }));
for (let i = 0; i < 25; i++) {
  ADJ[i] = [...new Set(ADJ[i])];
  ADJ[i].forEach(j => { if (!ADJ[j].includes(i)) ADJ[j].push(i); });
}

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

const PHASE = { PLACING: 'placing', MOVING: 'moving', FLYING: 'flying' };
const NUM_PIECES = 12;
const TURN_TIME = 30; // seconds per turn

/* ---------- AUDIO ENGINE ---------- */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playTone(freq, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}
function playChord(freqs, duration, volume = 0.12) {
  freqs.forEach(f => playTone(f, duration, 'triangle', volume));
}
const sounds = {
  place: () => { playTone(600,0.1); setTimeout(()=>playTone(800,0.08),50); },
  move: () => playTone(400,0.15,'triangle',0.1),
  mill: () => { playChord([523,659,784],0.4); setTimeout(()=>playChord([659,784,1047],0.5),300); },
  capture: () => { playTone(800,0.15,'square',0.08); setTimeout(()=>playTone(600,0.2,'sawtooth',0.06),100); },
  victory: () => { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.6,'triangle',0.2),i*200)); setTimeout(()=>playChord([523,659,784,1047],1.2,0.25),800); },
  click: () => playTone(1000,0.05,'sine',0.05),
  timeout: () => { playTone(200,0.4,'sawtooth',0.1); },
};

/* ---------- HELPERS ---------- */
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
function checkGameOver(s) {
  if (s.gameOver || s.phase === PHASE.PLACING) return;
  const opp = s.player === 'green' ? 'brown' : 'green';
  if (s.onBoard[opp] < 3) { s.gameOver = true; s.winner = s.player; s.message = `🏆 ${s.player.toUpperCase()} Wins!`; sounds.victory(); return; }
  const oppPhase = s.onBoard[opp] === 3 ? PHASE.FLYING : s.phase;
  if (!canPlayerMove(s.board, opp, oppPhase)) { s.gameOver = true; s.winner = s.player; s.message = `🏆 ${s.player.toUpperCase()} Wins!`; sounds.victory(); }
}
function cloneState(s) {
  return {
    ...s,
    board: [...s.board], toPlace: { ...s.toPlace }, onBoard: { ...s.onBoard },
    history: [...s.history], moves: [...s.moves], removable: [...s.removable],
  };
}
function freshState() {
  return {
    board: Array(25).fill(null),
    player: 'green',
    phase: PHASE.PLACING,
    toPlace: { green: NUM_PIECES, brown: NUM_PIECES },
    onBoard: { green: 0, brown: 0 },
    selected: null, moves: [],
    millAlert: false, removable: [],
    history: [],
    winner: null, gameOver: false, message: '',
    timer: TURN_TIME,
  };
}

/* ---------- AI ---------- */
function evaluateState(s) { /* same as before */ }
function generateMoves(s) { /* same as before */ }
function minimax(state, depth, alpha, beta, max) { /* same as before */ }
function computerMove(s, difficulty) { /* same as before */ }

// (keeping the AI functions, truncated for readability — they are identical to the previous version)

/* ---------- COMPONENT ---------- */
export default function MorabarabaPage() {
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [s, setS] = useState(freshState);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [animating, setAnimating] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [capturingPiece, setCapturingPiece] = useState(null); // highlighted capture
  const timerRef = useRef(null);
  const aiTimerRef = useRef(null);

  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setS(freshState());
    setThinking(false);
    setShowConfetti(false);
    setCapturingPiece(null);
    sounds.click();
  };

  // Turn timer for human players
  useEffect(() => {
    if (s.gameOver || s.millAlert || (mode === 'vsComputer' && s.player === 'brown')) return;
    setS(prev => ({ ...prev, timer: TURN_TIME }));
    const interval = setInterval(() => {
      setS(prev => {
        if (prev.timer <= 1) {
          sounds.timeout();
          // time's up — switch turns
          const next = cloneState(prev);
          next.player = prev.player === 'green' ? 'brown' : 'green';
          next.timer = TURN_TIME;
          next.selected = null;
          next.moves = [];
          return next;
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [s.player, s.gameOver, s.millAlert, mode]);

  // AI move with visual steps
  useEffect(() => {
    if (mode !== 'vsComputer' || s.player !== 'brown' || s.gameOver || s.millAlert || thinking) return;

    setThinking(true);
    aiTimerRef.current = setTimeout(() => {
      setS(prev => {
        const bestMove = computerMove(prev, difficulty);

        // Step 1: select piece and move (if moving phase)
        // For placing, just place; for moving, we need to show selection and movement separately
        if (bestMove.history.length > prev.history.length) {
          const lastAction = bestMove.history[bestMove.history.length - 1];

          if (lastAction.type === 'place') {
            sounds.place();
            setAnimating(lastAction.pointId);
            setTimeout(() => setAnimating(null), 400);
          } else if (lastAction.type === 'move') {
            // show the piece being moved
            setAnimating(null);
            // we need to simulate the movement step by step — we already have the final state
            // instead, we directly set the state and let the piece animation happen
            sounds.move();
            setAnimating(lastAction.to);
            setTimeout(() => setAnimating(null), 400);
          }

          if (bestMove.millAlert) {
            // show the captured piece before removal
            const capturedId = bestMove.removable[0]; // AI picks first removable
            setCapturingPiece(capturedId);
            sounds.mill();
            setTimeout(() => {
              setCapturingPiece(null);
              sounds.capture();
            }, 800);

            // after delay, apply the final state
            setTimeout(() => {
              setS(bestMove);
              checkGameOver(bestMove);
              if (bestMove.gameOver) setShowConfetti(true);
              setThinking(false);
            }, 1200);
            return prev; // keep current state while animating
          }
        }

        checkGameOver(bestMove);
        if (bestMove.gameOver) setShowConfetti(true);
        setThinking(false);
        return bestMove;
      });
    }, 600);
    return () => clearTimeout(aiTimerRef.current);
  }, [s.player, s.gameOver, s.millAlert, mode, difficulty, thinking]);

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
          sounds.mill();
        } else { next.player = opp; next.timer = TURN_TIME; checkGameOver(next); }
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
            n.board[pointId] = null; n.onBoard[opp]--; n.millAlert = false; n.removable = [];
            n.player = opp; n.timer = TURN_TIME; checkGameOver(n);
            if (n.gameOver) setShowConfetti(true);
            return n;
          });
        }, 600);
        return { ...prev, millAlert: false }; // temporarily disable alerts
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
          sounds.mill();
        } else { next.player = opp; next.timer = TURN_TIME; checkGameOver(next); }
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

  // ── MENU ──
  if (!mode) {
    return (
      <div className="morabaraba-page">
        <div className="morabaraba-container">
          <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>
          <div className="game-header"><h1>🕹️ Morabaraba</h1><p className="basotho-subtitle">Papali ea Basotho</p></div>
          <div className="mode-selection">
            <h2>Choose Game Mode</h2>
            <div className="mode-cards">
              <button className="mode-card" onClick={() => startGame('twoPlayer')}>
                <span className="mode-icon">👥</span><span className="mode-title">Two Players</span><span className="mode-desc">Play with a friend</span>
              </button>
              <button className="mode-card" onClick={() => startGame('vsComputer')}>
                <span className="mode-icon">🤖</span><span className="mode-title">vs Computer</span><span className="mode-desc">Challenge the AI</span>
              </button>
            </div>
            <div className="difficulty-select">
              <label>Difficulty:</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME ──
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
              <span className="player-dot"></span> {s.player.toUpperCase()}
              {mode === 'vsComputer' && s.player === 'brown' && <span className="ai-label"> (Computer)</span>}
            </div>
            <div className="phase-indicator">Phase: {phaseText()}</div>
            <div className="timer-display">⏳ {s.timer}s</div>
          </div>
          <div className="piece-counts">
            {s.phase === PHASE.PLACING ? (
              <><div>🟢 Green to place: {s.toPlace.green}</div><div>🟤 Brown to place: {s.toPlace.brown}</div></>
            ) : (
              <><div>🟢 Green: {s.onBoard.green}</div><div>🟤 Brown: {s.onBoard.brown}</div></>
            )}
          </div>
          {thinking && <div className="thinking-indicator">Computer is thinking…</div>}
        </div>
        {s.millAlert && <div className="mill-alert">⚡ Mill formed! Capture one opponent piece.</div>}
        {capturingPiece !== null && <div className="capture-alert">🔴 Removing piece…</div>}
        <Board s={s} animating={animating} capturing={capturingPiece} click={click} mode={mode} />
        <div className="controls">
          <button onClick={() => { setS(freshState()); sounds.click(); }} className="control-btn restart">🔄 Restart</button>
          <button onClick={() => setRulesOpen(true)} className="control-btn rules">📖 How to Play</button>
        </div>
        {s.gameOver && (
          <div className="victory-overlay">
            <div className="victory-card">
              <h2>{s.message}</h2>
              <button onClick={() => { setS(freshState()); sounds.click(); }} className="play-again-btn">Play Again</button>
            </div>
          </div>
        )}
        <RulesModal open={rulesOpen} close={() => setRulesOpen(false)} />
      </div>
    </div>
  );
}

/* ---------- SUB-COMPONENTS (same as before, but Board now uses capturing prop) ---------- */
function Board({ s, animating, capturing, click, mode }) {
  return (
    <div className="board-container">
      <svg viewBox="0 0 300 300" className="morabaraba-board">
        <rect width="300" height="300" fill="#f5e6d3" />
        {Object.entries(ADJ).map(([from, toList]) =>
          toList.map(to => +from < +to ? (
            <line key={`${from}-${to}`} x1={POINTS[from].x} y1={POINTS[from].y} x2={POINTS[to].x} y2={POINTS[to].y}
              stroke="#8B7355" strokeWidth="4" strokeLinecap="round" />
          ) : null)
        )}
        {POINTS.map(pt => {
          const piece = s.board[pt.id];
          const isSel = s.selected === pt.id;
          const isValid = s.moves.includes(pt.id);
          const isRem = s.removable.includes(pt.id);
          const isNew = animating === pt.id;
          const isCapturing = capturing === pt.id;
          const clickable = mode === 'twoPlayer' || (mode === 'vsComputer' && s.player === 'green');
          return (
            <g key={pt.id} onClick={() => {
              if (!clickable) return;
              if (isRem && s.millAlert) click(pt.id, 'remove');
              else if (isValid && s.selected !== null) click(pt.id, 'move');
              else if (piece === s.player && s.phase !== PHASE.PLACING) click(pt.id, 'select');
              else if (s.phase === PHASE.PLACING && !piece) click(pt.id, 'place');
            }}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#a08464"
                className={`intersection ${isValid?'valid-move':''} ${isRem?'removable':''} ${isSel?'selected':''} ${isCapturing?'capturing':''}`} />
              {!piece && !isRem && <circle cx={pt.x} cy={pt.y} r="9" fill="transparent" className="hover-indicator" />}
              {piece && (
                <g className={`piece-group ${isNew?'pop-in':''} ${isCapturing?'shake':''}`}>
                  <defs>
                    <radialGradient id={`grad-${piece}-${pt.id}`} cx="30%" cy="30%">
                      <stop offset="0%" stopColor={piece==='green'?'#6ee7b7':'#d97706'} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={piece==='green'?'#064e3b':'#78350f'} stopOpacity="0.9" />
                    </radialGradient>
                    <filter id={`shadow-${piece}`}><feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5"/></filter>
                  </defs>
                  <circle cx={pt.x} cy={pt.y} r="12" fill={`url(#grad-${piece}-${pt.id})`}
                    filter={`url(#shadow-${piece})`} stroke={isSel?'#facc15':'transparent'} strokeWidth="2"
                    className={isSel?'piece-selected':''} />
                </g>
              )}
              {isValid && !piece && <circle cx={pt.x} cy={pt.y} r="6" className="move-dot" />}
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
        <p><strong>Winning:</strong> Reduce opponent to &lt;3 pieces or block all moves.</p>
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