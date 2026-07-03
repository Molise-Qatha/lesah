import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Morabaraba.css';

/* ---------- CORRECT BASOTHO BOARD GEOMETRY ---------- */
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
];

/* Adjacency – horizontal & vertical connections only, no diagonals */
const ADJ = {
  0: [1,7], 1: [0,2,9], 2: [1,3], 3: [2,4,11], 4: [3,5], 5: [4,6,13], 6: [5,7], 7: [6,0,15],
  8: [9,15], 9: [8,10,1,17], 10: [9,11], 11: [10,12,3,19],
  12: [11,13], 13: [12,14,5,21], 14: [13,15], 15: [14,8,7,23],
  16: [17,23], 17: [16,18,9], 18: [17,19], 19: [18,20,11],
  20: [19,21], 21: [20,22,13], 22: [21,23], 23: [22,16,15],
};
// Clean duplicates
Object.keys(ADJ).forEach(k => ADJ[k] = [...new Set(ADJ[k])]);

/* Valid mills – only along straight lines (no diagonals) */
const MILLS = [
  // outer square
  [0,1,2],[2,3,4],[4,5,6],[6,7,0],
  // middle square
  [8,9,10],[10,11,12],[12,13,14],[14,15,8],
  // inner square
  [16,17,18],[18,19,20],[20,21,22],[22,23,16],
  // connecting lines (vertical & horizontal mid‑points)
  [1,9,17],[5,13,21],[7,15,23],[3,11,19],
];

/* ---------- GAME STATE & LOGIC (unchanged) ---------- */
const PHASE = { PLACING:'placing', MOVING:'moving', FLYING:'flying' };

function freshState() {
  return {
    board: Array(24).fill(null),
    player: 'green',
    phase: PHASE.PLACING,
    toPlace: { green:12, brown:12 },
    onBoard: { green:0, brown:0 },
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

function mills(board, pt, player) {
  return MILLS.filter(m => m.includes(pt) && m.every(i => board[i]===player));
}

function removable(board, opponent) {
  const pieces = board.reduce((a, v, i) => v===opponent? [...a, i] : a, []);
  const notInMill = pieces.filter(i => mills(board, i, opponent).length===0);
  return notInMill.length ? notInMill : pieces;
}

function validMoves(board, pt, player, phase) {
  if (phase===PHASE.FLYING) return board.reduce((a, v, i) => v===null? [...a, i] : a, []);
  return ADJ[pt].filter(i => board[i]===null);
}

function canMove(board, player, phase) {
  if (phase===PHASE.FLYING) return board.includes(null);
  return board.some((v, i) => v===player && validMoves(board, i, player, phase).length);
}

function checkGameOver(s) {
  const opp = s.player==='green'?'brown':'green';
  if (s.onBoard[opp] < 3) { s.gameOver = true; s.winner = s.player; }
  else if (!canMove(s.board, opp, s.onBoard[opp]===3?PHASE.FLYING:s.phase)) {
    s.gameOver = true; s.winner = s.player;
  }
}

export default function MorabarabaPage() {
  const [s, setS] = useState(freshState());
  const [rulesOpen, setRulesOpen] = useState(false);
  const [animating, setAnimating] = useState(null);   // track last placed/moved piece for pop animation

  const click = useCallback((pointId, action) => {
    setS(prev => {
      if (prev.gameOver) return prev;
      if (prev.millAlert && action!=='remove') return prev;
      let next = {...prev, board:[...prev.board], toPlace:{...prev.toPlace}, onBoard:{...prev.onBoard}, history:[...prev.history]};
      const p = next.player, opp = p==='green'?'brown':'green';

      if (action==='place' && next.phase===PHASE.PLACING && !next.board[pointId]) {
        next.board[pointId] = p;
        next.toPlace[p]--;
        next.onBoard[p]++;
        const m = mills(next.board, pointId, p);
        next.history.push({type:'place', pointId, player:p});
        if (next.toPlace.green===0 && next.toPlace.brown===0) next.phase = PHASE.MOVING;
        if (m.length) {
          next.millAlert = true; next.removable = removable(next.board, opp);
        } else {
          next.player = opp; checkGameOver(next);
        }
        setAnimating(pointId);   // trigger pop animation on this piece
        setTimeout(() => setAnimating(null), 400);
        return next;
      }

      if (action==='remove' && prev.millAlert && prev.removable.includes(pointId)) {
        next.board[pointId] = null;
        next.onBoard[opp]--;
        next.millAlert = false; next.removable = [];
        next.history.push({type:'remove', pointId, player:p});
        next.player = opp; checkGameOver(next);
        setAnimating(null);
        return next;
      }

      if (action==='select' && prev.phase!==PHASE.PLACING && prev.board[pointId]===p) {
        const fly = prev.onBoard[p]===3 ? PHASE.FLYING : prev.phase;
        next.selected = pointId;
        next.moves = validMoves(next.board, pointId, p, fly);
        return next;
      }

      if (action==='move' && prev.selected!==null && prev.moves.includes(pointId)) {
        next.board[prev.selected] = null;
        next.board[pointId] = p;
        next.selected = null; next.moves = [];
        const m = mills(next.board, pointId, p);
        next.history.push({type:'move', from:prev.selected, to:pointId, player:p});
        if (m.length) {
          next.millAlert = true; next.removable = removable(next.board, opp);
        } else {
          next.player = opp; checkGameOver(next);
        }
        setAnimating(pointId);
        setTimeout(() => setAnimating(null), 400);
        return next;
      }

      return prev;
    });
  }, []);

  const phaseText = () => {
    if (s.phase===PHASE.PLACING) return 'Placing';
    if (s.onBoard[s.player]===3 && s.phase===PHASE.MOVING) return 'Flying';
    return 'Moving';
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="morabaraba-page">
      <div className="morabaraba-container">
        {/* Back button at top */}
        <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>

        <div className="game-header">
          <h1>🕹️ Morabaraba</h1>
          <p className="basotho-subtitle">Papali ea Basotho</p>
        </div>

        <div className="game-info">
          <div className="info-section">
            <div className={`player-indicator ${s.player}`}>
              <span className="player-dot"></span> {s.player.toUpperCase()}
            </div>
            <div className="phase-indicator">Phase: {phaseText()}</div>
          </div>
          <div className="piece-counts">
            <div>🟢 Green: {s.onBoard.green} on board, {s.toPlace.green} to place</div>
            <div>🟤 Brown: {s.onBoard.brown} on board, {s.toPlace.brown} to place</div>
          </div>
        </div>

        {s.millAlert && (
          <div className="mill-alert">⚡ Mill formed! Remove an opponent piece.</div>
        )}

        <div className="board-container">
          <svg viewBox="0 0 300 300" className="morabaraba-board">
            <rect width="300" height="300" fill="#f5e6d3" />

            {/* Board lines – only horizontal & vertical connections */}
            {Object.entries(ADJ).map(([from, toList]) =>
              toList.map(to =>
                parseInt(from) < to ? (
                  <line
                    key={`${from}-${to}`}
                    x1={POINTS[from].x} y1={POINTS[from].y}
                    x2={POINTS[to].x} y2={POINTS[to].y}
                    stroke="#e6d7b8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
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
                  {/* Intersection dot (small) */}
                  <circle
                    cx={pt.x} cy={pt.y} r="5"
                    fill="#b89c7a"
                    className={`intersection ${isValid ? 'valid-move' : ''} ${isRem ? 'removable' : ''} ${isSel ? 'selected' : ''}`}
                  />

                  {/* Playable hover indicator (empty intersections) */}
                  {!piece && !isRem && (
                    <circle
                      cx={pt.x} cy={pt.y} r="8"
                      fill="transparent"
                      className="hover-indicator"
                    />
                  )}

                  {/* Piece (glass bottle style) */}
                  {piece && (
                    <g className={`piece-group ${isNew ? 'pop-in' : ''}`}>
                      <defs>
                        <radialGradient id={`grad-${piece}-${pt.id}`} cx="30%" cy="30%">
                          <stop offset="0%" stopColor={piece === 'green' ? '#6ee7b7' : '#d97706'} stopOpacity="0.9" />
                          <stop offset="100%" stopColor={piece === 'green' ? '#064e3b' : '#78350f'} stopOpacity="0.9" />
                        </radialGradient>
                        <filter id={`shadow-${piece}`}>
                          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5" />
                        </filter>
                      </defs>
                      <circle
                        cx={pt.x} cy={pt.y} r="12"
                        fill={`url(#grad-${piece}-${pt.id})`}
                        filter={`url(#shadow-${piece})`}
                        stroke={isSel ? '#facc15' : 'transparent'}
                        strokeWidth="2"
                        className={isSel ? 'piece-selected' : ''}
                      />
                    </g>
                  )}

                  {/* Valid move dots (glowing) */}
                  {isValid && !piece && (
                    <circle cx={pt.x} cy={pt.y} r="6" className="move-dot" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="controls">
          {s.message && <div className="game-message">{s.message}</div>}
          <div className="control-buttons">
            <button onClick={() => setS(freshState())} className="control-btn restart">🔄 Restart</button>
            <button onClick={() => setRulesOpen(true)} className="control-btn rules">📖 How to Play</button>
          </div>
        </div>

        {s.gameOver && (
          <div className="victory-overlay">
            <div className="victory-card">
              <h2>🎉 {s.winner.toUpperCase()} Wins!</h2>
              <button onClick={() => setS(freshState())} className="play-again-btn">Play Again</button>
            </div>
          </div>
        )}

        {rulesOpen && (
          <div className="rules-modal-overlay" onClick={() => setRulesOpen(false)}>
            <div className="rules-modal" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setRulesOpen(false)}>✕</button>
              <h2>How to Play</h2>
              <p><strong>Phase 1 – Placing:</strong> Alternate placing pieces on empty points.</p>
              <p><strong>Phase 2 – Moving:</strong> After all pieces are placed, move along lines.</p>
              <p><strong>Phase 3 – Flying:</strong> With 3 pieces left, move anywhere.</p>
              <p><strong>Mills:</strong> Form a line of 3 to remove an opponent piece.</p>
              <p><strong>Winning:</strong> Reduce opponent to &lt;3 pieces or block all moves.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}