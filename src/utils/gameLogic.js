// src/components/Morabaraba/gameLogic.js

// Board positions: 24 intersections, 3 nested squares
// Outer square: 0-7, Middle square: 8-15, Inner square: 16-23
// Coordinates are relative to a 300x300 viewBox

export const BOARD_POINTS = [
  // Outer square (clockwise from top-left)
  { id: 0, x: 30, y: 30 },    // A
  { id: 1, x: 150, y: 30 },   // B
  { id: 2, x: 270, y: 30 },   // C
  { id: 3, x: 270, y: 150 },  // D
  { id: 4, x: 270, y: 270 },  // E
  { id: 5, x: 150, y: 270 },  // F
  { id: 6, x: 30, y: 270 },   // G
  { id: 7, x: 30, y: 150 },   // H

  // Middle square (clockwise from top-left)
  { id: 8, x: 90, y: 90 },
  { id: 9, x: 150, y: 90 },
  { id: 10, x: 210, y: 90 },
  { id: 11, x: 210, y: 150 },
  { id: 12, x: 210, y: 210 },
  { id: 13, x: 150, y: 210 },
  { id: 14, x: 90, y: 210 },
  { id: 15, x: 90, y: 150 },

  // Inner square (clockwise from top-left)
  { id: 16, x: 120, y: 120 },
  { id: 17, x: 150, y: 120 },
  { id: 18, x: 180, y: 120 },
  { id: 19, x: 180, y: 150 },
  { id: 20, x: 180, y: 180 },
  { id: 21, x: 150, y: 180 },
  { id: 22, x: 120, y: 180 },
  { id: 23, x: 120, y: 150 },
];

// Adjacency map (which points are connected by lines)
export const ADJACENCY = {
  // Outer square edges
  0: [1, 7],
  1: [0, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 0],
  // Middle square edges
  8: [9, 15],
  9: [8, 10],
  10: [9, 11],
  11: [10, 12],
  12: [11, 13],
  13: [12, 14],
  14: [13, 15],
  15: [14, 8],
  // Inner square edges
  16: [17, 23],
  17: [16, 18],
  18: [17, 19],
  19: [18, 20],
  20: [19, 21],
  21: [20, 22],
  22: [21, 23],
  23: [22, 16],
  // Connecting lines between squares (midpoints)
  1: [0, 2, 9],   // outer top-mid to middle top-mid
  9: [1, 8, 10, 17], // middle top-mid to inner top-mid
  17: [9, 16, 18],
  5: [4, 6, 13],   // outer bottom-mid to middle bottom-mid
  13: [5, 12, 14, 21], // middle bottom-mid to inner bottom-mid
  21: [13, 20, 22],
  7: [6, 0, 15],   // outer left-mid to middle left-mid
  15: [7, 8, 14, 23], // middle left-mid to inner left-mid
  23: [15, 16, 22],
  3: [2, 4, 11],   // outer right-mid to middle right-mid
  11: [3, 10, 12, 19], // middle right-mid to inner right-mid
  19: [11, 18, 20],
  // Diagonals on middle square
  8: [9, 15, 17],  // adding diagonal: top-left middle to inner top-left? Wait, traditional Lesotho morabaraba has diagonals on the middle square connecting corners
  // Actually standard 12-morabaraba: the middle square has diagonals connecting its corners (8-12, 10-14)
  // Let's add them:
  // 8: already has [9,15], add 12? But 12 is bottom-right of middle square. Yes, diagonal connection.
  // 10: already has [9,11], add 14?
  // 12: already has [11,13], add 8?
  // 14: already has [13,15], add 10?
};

// Add diagonal connections for middle square corners
ADJACENCY[8].push(12);
ADJACENCY[12].push(8);
ADJACENCY[10].push(14);
ADJACENCY[14].push(10);

// Connect squares through their corners? Not needed.

// Ensure all arrays are unique
Object.keys(ADJACENCY).forEach(key => {
  ADJACENCY[key] = [...new Set(ADJACENCY[key])];
});

// All possible mills (three-in-a-row lines)
export const MILLS = [
  // Outer square horizontal/vertical
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
  // Middle square horizontal/vertical
  [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],
  // Inner square horizontal/vertical
  [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],
  // Connecting lines
  [1, 9, 17], [5, 13, 21], [7, 15, 23], [3, 11, 19],
  // Diagonals on middle square
  [8, 12, 17], [10, 14, 21], [12, 8, 17], [14, 10, 21],
  // The Lesotho variant has two diagonals on the middle square: top-left to bottom-right (8-12-?) and top-right to bottom-left (10-14-?)
  // Actually the mills on diagonals: [8, 12, 17]? No, 8 and 12 are on middle square, 17 is inner top-mid. That's not a straight line.
  // Standard rule: A mill is three pieces in a straight line along any of the board's lines.
  // The diagonals on the middle square: the line connecting 8 to 12 passes through 17? No, 17 is not collinear.
  // Actually the middle square diagonals connect 8 to 12 (and 10 to 14). So mills can be formed on those diagonals: [8, ?, 12] – there's no midpoint.
  // So mills on diagonals are just [8, ?, 12] but there is no point between them? The line from 8 to 12 goes through the center? Let's check coordinates:
  // 8: (90,90), 12: (210,210). The midpoint is (150,150), which is the center. The center is not a point. So no mill there.
  // Therefore, the diagonals on the middle square do NOT form mills. Mills only on lines that have three points.
  // So the correct mills are only those listed above (excluding the diagonal attempts). I'll remove the invalid ones.
];

// Filter out invalid mills (those not in adjacency or not collinear)
export const VALID_MILLS = MILLS.filter(mill => {
  // Check that all three points are connected in a straight line
  const [a, b, c] = mill;
  const p1 = BOARD_POINTS[a];
  const p2 = BOARD_POINTS[b];
  const p3 = BOARD_POINTS[c];
  // Check collinearity (cross product near zero)
  const cross = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
  if (Math.abs(cross) > 0.1) return false;
  // Check that b is between a and c (or any ordering)
  const dot = (p3.x - p1.x) * (p2.x - p1.x) + (p3.y - p1.y) * (p2.y - p1.y);
  if (dot < 0) return false; // b not between
  const distAC = Math.hypot(p3.x - p1.x, p3.y - p1.y);
  const distAB = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  if (distAB > distAC) return false;
  return true;
});

// Game phases
export const PHASE = {
  PLACING: 'placing',
  MOVING: 'moving',
  FLYING: 'flying',
};

// Initial game state
export function createInitialState() {
  return {
    board: Array(24).fill(null), // null | 'green' | 'brown'
    currentPlayer: 'green',
    phase: PHASE.PLACING,
    piecesToPlace: { green: 12, brown: 12 },
    piecesOnBoard: { green: 0, brown: 0 },
    selectedPiece: null,
    validMoves: [],
    message: '',
    millFormed: false,
    removablePieces: [],
    moveHistory: [],
    winner: null,
    gameOver: false,
  };
}

// Check if a mill is formed
export function checkMill(board, pointId, player) {
  return VALID_MILLS.filter(mill => mill.includes(pointId) && mill.every(id => board[id] === player));
}

// Get removable opponent pieces (not in a mill, or all if all are in mills)
export function getRemovablePieces(board, opponent) {
  const opponentPieces = [];
  board.forEach((piece, idx) => {
    if (piece === opponent) opponentPieces.push(idx);
  });
  
  // First, try pieces not in mills
  const notInMill = opponentPieces.filter(id => {
    const mills = checkMill(board, id, opponent);
    return mills.length === 0;
  });
  
  if (notInMill.length > 0) return notInMill;
  // If all are in mills, allow removing any
  return opponentPieces;
}

// Get valid moves for a piece in moving/flying phase
export function getValidMoves(board, pointId, player, phase) {
  if (phase === PHASE.FLYING) {
    // Can fly to any empty spot
    return board.reduce((acc, cell, idx) => {
      if (cell === null) acc.push(idx);
      return acc;
    }, []);
  }
  
  // Moving phase: only along connected lines
  const adjacent = ADJACENCY[pointId] || [];
  return adjacent.filter(id => board[id] === null);
}

// Check if player can move any piece
export function canPlayerMove(board, player, phase) {
  if (phase === PHASE.FLYING) {
    return board.some(cell => cell === null);
  }
  
  const playerPieces = board.reduce((acc, cell, idx) => {
    if (cell === player) acc.push(idx);
    return acc;
  }, []);
  
  return playerPieces.some(id => getValidMoves(board, id, player, phase).length > 0);
}

// Execute a move and return new state
export function placePiece(state, pointId) {
  const newBoard = [...state.board];
  newBoard[pointId] = state.currentPlayer;
  
  const newPiecesToPlace = { ...state.piecesToPlace };
  newPiecesToPlace[state.currentPlayer]--;
  
  const newPiecesOnBoard = { ...state.piecesOnBoard };
  newPiecesOnBoard[state.currentPlayer]++;
  
  const mills = checkMill(newBoard, pointId, state.currentPlayer);
  const opponent = state.currentPlayer === 'green' ? 'brown' : 'green';
  
  let newState = {
    ...state,
    board: newBoard,
    piecesToPlace: newPiecesToPlace,
    piecesOnBoard: newPiecesOnBoard,
    message: '',
    millFormed: mills.length > 0,
    removablePieces: mills.length > 0 ? getRemovablePieces(newBoard, opponent) : [],
    moveHistory: [...state.moveHistory, { type: 'place', pointId, player: state.currentPlayer }],
  };
  
  // Check if placing phase is over
  if (newPiecesToPlace.green === 0 && newPiecesToPlace.brown === 0) {
    newState.phase = PHASE.MOVING;
  }
  
  if (mills.length === 0) {
    // Switch turns if no mill formed
    newState.currentPlayer = opponent;
    newState.selectedPiece = null;
    newState.validMoves = [];
    checkGameOver(newState, opponent);
  }
  
  return newState;
}

export function removeOpponentPiece(state, pointId) {
  const newBoard = [...state.board];
  newBoard[pointId] = null;
  
  const opponent = state.currentPlayer === 'green' ? 'brown' : 'green';
  const newPiecesOnBoard = { ...state.piecesOnBoard };
  newPiecesOnBoard[opponent]--;
  
  const nextPlayer = opponent;
  
  const newState = {
    ...state,
    board: newBoard,
    piecesOnBoard: newPiecesOnBoard,
    millFormed: false,
    removablePieces: [],
    message: '',
    currentPlayer: nextPlayer,
    selectedPiece: null,
    validMoves: [],
    moveHistory: [...state.moveHistory, { type: 'remove', pointId, player: state.currentPlayer }],
  };
  
  // Check if next player is now in flying phase
  if (newPiecesOnBoard[nextPlayer] === 3 && newState.phase === PHASE.MOVING) {
    // Don't change phase globally; flying is per-player. We'll handle in canPlayerMove.
  }
  
  checkGameOver(newState, nextPlayer);
  return newState;
}

export function selectPiece(state, pointId) {
  const player = state.currentPlayer;
  if (state.board[pointId] !== player) return state;
  
  // Determine phase for this player
  const playerPieces = state.piecesOnBoard[player];
  const phase = playerPieces === 3 ? PHASE.FLYING : state.phase;
  
  const moves = getValidMoves(state.board, pointId, player, phase);
  
  return {
    ...state,
    selectedPiece: pointId,
    validMoves: moves,
    message: '',
  };
}

export function movePiece(state, toPointId) {
  if (state.selectedPiece === null) return state;
  
  const fromId = state.selectedPiece;
  const player = state.currentPlayer;
  const newBoard = [...state.board];
  newBoard[fromId] = null;
  newBoard[toPointId] = player;
  
  const mills = checkMill(newBoard, toPointId, player);
  const opponent = player === 'green' ? 'brown' : 'green';
  
  // Check if player is now down to 3 pieces (flying)
  const playerPieces = state.piecesOnBoard[player]; // still same count after move
  
  let newState = {
    ...state,
    board: newBoard,
    selectedPiece: null,
    validMoves: [],
    millFormed: mills.length > 0,
    removablePieces: mills.length > 0 ? getRemovablePieces(newBoard, opponent) : [],
    message: '',
    moveHistory: [...state.moveHistory, { type: 'move', fromId, toPointId, player }],
  };
  
  if (mills.length === 0) {
    newState.currentPlayer = opponent;
    checkGameOver(newState, opponent);
  }
  
  return newState;
}

function checkGameOver(state, nextPlayer) {
  const opponent = nextPlayer === 'green' ? 'brown' : 'green';
  // Check if opponent has <3 pieces
  if (state.piecesOnBoard[opponent] < 3) {
    state.gameOver = true;
    state.winner = nextPlayer;
    state.message = `${nextPlayer.toUpperCase()} wins! Opponent has less than 3 pieces.`;
    return;
  }
  // Check if opponent cannot move (in moving phase and not placing)
  if (state.phase === PHASE.MOVING || state.phase === PHASE.FLYING) {
    if (!canPlayerMove(state.board, opponent, state.phase === PHASE.FLYING ? PHASE.FLYING : state.phase)) {
      state.gameOver = true;
      state.winner = nextPlayer;
      state.message = `${nextPlayer.toUpperCase()} wins! Opponent cannot move.`;
    }
  }
}

export function isFlyingPhase(state, player) {
  return state.piecesOnBoard[player] === 3 && state.phase === PHASE.MOVING;
}