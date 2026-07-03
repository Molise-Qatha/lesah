// src/components/Morabaraba/gameLogic.js

// Board positions: 24 intersections, 3 nested squares
export const BOARD_POINTS = [
  { id: 0, x: 30, y: 30 }, { id: 1, x: 150, y: 30 }, { id: 2, x: 270, y: 30 },
  { id: 3, x: 270, y: 150 }, { id: 4, x: 270, y: 270 }, { id: 5, x: 150, y: 270 },
  { id: 6, x: 30, y: 270 }, { id: 7, x: 30, y: 150 },
  { id: 8, x: 90, y: 90 }, { id: 9, x: 150, y: 90 }, { id: 10, x: 210, y: 90 },
  { id: 11, x: 210, y: 150 }, { id: 12, x: 210, y: 210 }, { id: 13, x: 150, y: 210 },
  { id: 14, x: 90, y: 210 }, { id: 15, x: 90, y: 150 },
  { id: 16, x: 120, y: 120 }, { id: 17, x: 150, y: 120 }, { id: 18, x: 180, y: 120 },
  { id: 19, x: 180, y: 150 }, { id: 20, x: 180, y: 180 }, { id: 21, x: 150, y: 180 },
  { id: 22, x: 120, y: 180 }, { id: 23, x: 120, y: 150 },
];

// Adjacency map – which points are connected by lines
export const ADJACENCY = {
  0: [1,7], 1: [0,2,9], 2: [1,3], 3: [2,4,11], 4: [3,5], 5: [4,6,13], 6: [5,7], 7: [6,0,15],
  8: [9,15], 9: [8,10,1,17], 10: [9,11], 11: [10,12,3,19], 12: [11,13], 13: [12,14,5,21],
  14: [13,15], 15: [14,8,7,23], 16: [17,23], 17: [16,18,9], 18: [17,19],
  19: [18,20,11], 20: [19,21], 21: [20,22,13], 22: [21,23], 23: [22,16,15],
  // Diagonal connections on middle square
  8: [9,15,12], 10: [9,11,14], 12: [11,13,8], 14: [13,15,10],
};
// Fix duplicate keys: need to merge 8,10,12,14 properly
ADJACENCY[8] = [...new Set([9,15,12])];
ADJACENCY[10] = [...new Set([9,11,14])];
ADJACENCY[12] = [...new Set([11,13,8])];
ADJACENCY[14] = [...new Set([13,15,10])];
ADJACENCY[1].push(9); // already there? re-check
ADJACENCY[9] = [...new Set([8,10,1,17])];
ADJACENCY[13] = [...new Set([12,14,5,21])];
ADJACENCY[15] = [...new Set([14,8,7,23])];
ADJACENCY[17] = [...new Set([16,18,9])];
ADJACENCY[19] = [...new Set([18,20,11])];
ADJACENCY[21] = [...new Set([20,22,13])];
ADJACENCY[23] = [...new Set([22,16,15])];

// Valid mills (three-in-a-row on a straight line)
export const VALID_MILLS = [
  // Outer square
  [0,1,2], [2,3,4], [4,5,6], [6,7,0],
  // Middle square
  [8,9,10], [10,11,12], [12,13,14], [14,15,8],
  // Inner square
  [16,17,18], [18,19,20], [20,21,22], [22,23,16],
  // Connecting lines (vertical/horizontal through midpoints)
  [1,9,17], [5,13,21], [7,15,23], [3,11,19],
  // Middle square diagonals
  [8,12,17], [10,14,21]  // actually these three are not collinear, let's remove invalid ones
].filter(mill => {
  const [a,b,c] = mill;
  const p1 = BOARD_POINTS[a], p2 = BOARD_POINTS[b], p3 = BOARD_POINTS[c];
  const cross = (p2.x-p1.x)*(p3.y-p1.y) - (p2.y-p1.y)*(p3.x-p1.x);
  if (Math.abs(cross) > 0.1) return false;
  const dot = (p3.x-p1.x)*(p2.x-p1.x) + (p3.y-p1.y)*(p2.y-p1.y);
  if (dot < 0) return false;
  const distAC = Math.hypot(p3.x-p1.x, p3.y-p1.y);
  const distAB = Math.hypot(p2.x-p1.x, p2.y-p1.y);
  return distAB <= distAC;
});

export const PHASE = { PLACING: 'placing', MOVING: 'moving', FLYING: 'flying' };

export function createInitialState() {
  return {
    board: Array(24).fill(null),
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

export function checkMill(board, pointId, player) {
  return VALID_MILLS.filter(mill => mill.includes(pointId) && mill.every(id => board[id] === player));
}

export function getRemovablePieces(board, opponent) {
  const pieces = board.reduce((acc, cell, idx) => cell === opponent ? [...acc, idx] : acc, []);
  const notInMill = pieces.filter(id => checkMill(board, id, opponent).length === 0);
  return notInMill.length > 0 ? notInMill : pieces;
}

export function getValidMoves(board, pointId, player, phase) {
  if (phase === PHASE.FLYING) {
    return board.reduce((acc, cell, idx) => cell === null ? [...acc, idx] : acc, []);
  }
  return (ADJACENCY[pointId] || []).filter(id => board[id] === null);
}

export function canPlayerMove(board, player, phase) {
  if (phase === PHASE.FLYING) return board.includes(null);
  return board.some((cell, idx) => cell === player && getValidMoves(board, idx, player, phase).length > 0);
}

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
    millFormed: mills.length > 0,
    removablePieces: mills.length > 0 ? getRemovablePieces(newBoard, opponent) : [],
    moveHistory: [...state.moveHistory, { type: 'place', pointId, player: state.currentPlayer }],
  };
  if (newPiecesToPlace.green === 0 && newPiecesToPlace.brown === 0) {
    newState.phase = PHASE.MOVING;
  }
  if (mills.length === 0) {
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
    currentPlayer: nextPlayer,
    selectedPiece: null,
    validMoves: [],
    moveHistory: [...state.moveHistory, { type: 'remove', pointId, player: state.currentPlayer }],
  };
  checkGameOver(newState, nextPlayer);
  return newState;
}

export function selectPiece(state, pointId) {
  if (state.board[pointId] !== state.currentPlayer) return state;
  const phase = state.piecesOnBoard[state.currentPlayer] === 3 ? PHASE.FLYING : state.phase;
  const moves = getValidMoves(state.board, pointId, state.currentPlayer, phase);
  return { ...state, selectedPiece: pointId, validMoves: moves };
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
  let newState = {
    ...state,
    board: newBoard,
    selectedPiece: null,
    validMoves: [],
    millFormed: mills.length > 0,
    removablePieces: mills.length > 0 ? getRemovablePieces(newBoard, opponent) : [],
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
  if (state.piecesOnBoard[opponent] < 3) {
    state.gameOver = true;
    state.winner = nextPlayer;
    return;
  }
  const phase = state.piecesOnBoard[opponent] === 3 ? PHASE.FLYING : state.phase;
  if (!canPlayerMove(state.board, opponent, phase)) {
    state.gameOver = true;
    state.winner = nextPlayer;
  }
}