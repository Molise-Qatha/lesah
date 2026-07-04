import React, { useState, useCallback } from 'react';
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

/* ---------- ADJACENCY (HORIZONTAL / VERTICAL ONLY, PLUS CENTRE) ---------- */
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

function freshState() {
  return {
    board: Array(25).fill(null),
    player: 'green',
    phase: PHASE.PLACING,
    toPlace: { green: NUM_PIECES, brown: NUM_PIECES },
    onBoard: { green: 0, brown: 0 },
    selected: null,
    moves: [],
    millAlert: false,
    removable: [],
    history: [],
    winner: null,
    gameOver: false,
    message: '',
  };
}

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

/* ---------- FIX: only check game over in moving/flying phases ---------- */
function checkGameOver(s) {
  if (s.gameOver || s.phase === PHASE.PLACING) return;   // <-- no winner during placing
  const opp = s.player === 'green' ? 'brown' : 'green';
  if (s.onBoard[opp] < 3) {
    s.gameOver = true;
    s.winner = s.player;
    s.message = `🏆 ${s.player.toUpperCase()} Wins!`;
    return;
  }
  const oppPhase = s.onBoard[opp] === 3 ? PHASE.FLYING : s.phase;
  if (!canPlayerMove(s.board, opp, oppPhase)) {
    s.gameOver = true;
    s.winner = s.player;
    s.message = `🏆 ${s.player.toUpperCase()} Wins!`;
  }
}

/* ---------- COMPONENT ---------- */
export default function MorabarabaPage() {
  const [s, setS] = useState(freshState);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [animating, setAnimating] = useState(null);

  const click = useCallback((pointId, action) => {
    setS(prev => {
      if (prev.gameOver) return prev;
      if (prev.millAlert && action !== 'remove') return prev;

      let next = {
        ...prev,
        board: [...prev.board],
        toPlace: { ...prev.toPlace },
        onBoard: { ...prev.onBoard },
        history: [...prev.history],
      };
      const p = next.player;
      const opp = p === 'green' ? 'brown' : 'green';

      // ----- PLACING -----
      if (action === 'place' && next.phase === PHASE.PLACING && !next.board[pointId]) {
        next.board[pointId] = p;
        next.toPlace[p]--;
        next.onBoard[p]++;
        const mill = millsForPlayer(next.board, pointId, p);
        next.history.push({ type: 'place', pointId, player: p });
        if (next.toPlace.green === 0 && next.toPlace.brown === 0) {
          next.phase = PHASE.MOVING;
        }
        if (mill.length > 0) {
          next.millAlert = true;
          next.removable = getRemovable(next.board, opp);
        } else {
          next.player = opp;
          checkGameOver(next);
        }
        setAnimating(pointId);
        setTimeout(() => setAnimating(null), 400);
        return next;
      }

      // ----- REMOVE AFTER MILL -----
      if (action === 'remove' && prev.millAlert && prev.removable.includes(pointId)) {
        next.board[pointId] = null;
        next.onBoard[opp]--;
        next.millAlert = false;
        next.removable = [];
        next.history.push({ type: 'remove', pointId, player: p });
        next.player = opp;
        checkGameOver(next);
        setAnimating(null);
        return next;
      }

      // ----- SELECT OWN PIECE -----
      if (action === 'select' && next.phase !== PHASE.PLACING && next.board[pointId] === p) {
        const fly = next.onBoard[p] === 3 ? PHASE.FLYING : next.phase;
        next.selected = pointId;
        next.moves = validDestinations(next.board, pointId, p, fly);
        return next;
      }

      // ----- MOVE PIECE -----
      if (action === 'move' && prev.selected !== null && prev.moves.includes(pointId)) {
        next.board[prev.selected] = null;
        next.board[pointId] = p;
        next.selected = null;
        next.moves = [];
        const mill = millsForPlayer(next.board, pointId, p);
        next.history.push({ type: 'move', from: prev.selected, to: pointId, player: p });
        if (mill.length > 0) {
          next.millAlert = true;
          next.removable = getRemovable(next.board, opp);
        } else {
          next.player = opp;
          checkGameOver(next);
        }
        setAnimating(pointId);
        setTimeout(() => setAnimating(null), 400);
        return next;
      }

      return prev;
    });
  }, []);

  const phaseText = () => {
    if (s.phase === PHASE.PLACING) return 'Placing Pieces';
    if (s.onBoard[s.player] === 3 && s.phase === PHASE.MOVING) return 'Flying';
    return 'Moving Pieces';
  };

  return (
    <div className="morabaraba-page">
      <div className="morabaraba-container">
        <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>

        <div className="game-header">
          <h1>🕹️ Morabaraba</h1>
          <p className="basotho-subtitle">Papali ea Basotho</p>
        </div>

        <div className="game-info">
          <div className="info-section">
            <div className={`player-indicator ${s.player}`}>
              <span className="player-dot"></span> Current Turn: {s.player.toUpperCase()}
            </div>
            <div className="phase-indicator">Phase: {phaseText()}</div>
          </div>
          <div className="piece-counts">
            {s.phase === PHASE.PLACING ? (
              <>
                <div>🟢 Green to place: {s.toPlace.green}</div>
                <div>🟤 Brown to place: {s.toPlace.brown}</div>
              </>
            ) : (
              <>
                <div>🟢 Green pieces: {s.onBoard.green}</div>
                <div>🟤 Brown pieces: {s.onBoard.brown}</div>
              </>
            )}
          </div>
        </div>

        {s.millAlert && (
          <div className="mill-alert">⚡ Mill formed! Capture one opponent piece.</div>
        )}

        <div className="board-container">
          <svg viewBox="0 0 300 300" className="morabaraba-board">
            <rect width="300" height="300" fill="#f5e6d3" />
            {Object.entries(ADJ).map(([from, toList]) =>
              toList.map(to =>
                +from < +to ? (
                  <line key={`${from}-${to}`} x1={POINTS[from].x} y1={POINTS[from].y}
                        x2={POINTS[to].x} y2={POINTS[to].y} stroke="#8B7355" strokeWidth="4" strokeLinecap="round" />
                ) : null
              )
            )}
            {POINTS.map(pt => {
              const piece = s.board[pt.id];
              const isSel = s.selected === pt.id;
              const isValid = s.moves.includes(pt.id);
              const isRem = s.removable.includes(pt.id);
              const isNew = animating === pt.id;
              return (
                <g key={pt.id} onClick={() => {
                  if (isRem && s.millAlert) click(pt.id, 'remove');
                  else if (isValid && s.selected !== null) click(pt.id, 'move');
                  else if (piece === s.player && s.phase !== PHASE.PLACING) click(pt.id, 'select');
                  else if (s.phase === PHASE.PLACING && !piece) click(pt.id, 'place');
                }}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#a08464"
                    className={`intersection ${isValid?'valid-move':''} ${isRem?'removable':''} ${isSel?'selected':''}`} />
                  {!piece && !isRem && <circle cx={pt.x} cy={pt.y} r="9" fill="transparent" className="hover-indicator" />}
                  {piece && (
                    <g className={`piece-group ${isNew?'pop-in':''}`}>
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

        <div className="controls">
          <div className="control-buttons">
            <button onClick={() => setS(freshState())} className="control-btn restart">🔄 Restart</button>
            <button onClick={() => setRulesOpen(true)} className="control-btn rules">📖 How to Play</button>
          </div>
        </div>

        {s.gameOver && (
          <div className="victory-overlay">
            <div className="victory-card">
              <h2>{s.message}</h2>
              <button onClick={() => setS(freshState())} className="play-again-btn">Play Again</button>
            </div>
          </div>
        )}

        {rulesOpen && (
          <div className="rules-modal-overlay" onClick={() => setRulesOpen(false)}>
            <div className="rules-modal" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setRulesOpen(false)}>✕</button>
              <h2>How to Play</h2>
              <p><strong>Phase 1 – Placing:</strong> Alternate placing pieces on empty points until all 12 of each are placed.</p>
              <p><strong>Phase 2 – Moving:</strong> Move one piece per turn to an adjacent empty point along a line.</p>
              <p><strong>Phase 3 – Flying:</strong> With only 3 pieces left, move to any empty point.</p>
              <p><strong>Mills:</strong> Form a straight line of 3 to capture one opponent piece (not in a mill if possible).</p>
              <p><strong>Winning:</strong> Reduce opponent to fewer than 3 pieces, or block all legal moves.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}