import React from 'react';
import Piece from './Piece';
import { BOARD_POINTS, ADJACENCY } from './gameLogic';

function MorabarabaBoard({ board, selectedPiece, validMoves, onPointClick, phase, currentPlayer, removablePieces, millFormed, onRemovePiece }) {
  // Generate SVG lines from adjacency
  const lines = [];
  Object.entries(ADJACENCY).forEach(([from, toList]) => {
    toList.forEach(to => {
      // Avoid duplicates (only draw if from < to)
      if (parseInt(from) < to) {
        const p1 = BOARD_POINTS[from];
        const p2 = BOARD_POINTS[to];
        lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, key: `${from}-${to}` });
      }
    });
  });

  return (
    <svg viewBox="0 0 300 300" className="morabaraba-board">
      {/* Background */}
      <rect width="300" height="300" fill="#f5e6d3" rx="10" />
      
      {/* Board lines */}
      {lines.map(line => (
        <line
          key={line.key}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#8B7355"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      
      {/* Intersection points (clickable areas) */}
      {BOARD_POINTS.map(point => {
        const piece = board[point.id];
        const isSelected = selectedPiece === point.id;
        const isValidMove = validMoves.includes(point.id);
        const isRemovable = removablePieces.includes(point.id);
        
        return (
          <g key={point.id} onClick={() => {
            if (isRemovable && millFormed) {
              onRemovePiece(point.id);
            } else if (isValidMove && selectedPiece !== null) {
              // Trigger move (handled in parent)
              onPointClick(point.id, 'move');
            } else if (piece === currentPlayer && phase !== 'placing') {
              // Select own piece
              onPointClick(point.id, 'select');
            } else if (phase === 'placing' && piece === null) {
              // Place piece
              onPointClick(point.id, 'place');
            }
          }}>
            {/* Intersection circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="none"
              stroke="#8B7355"
              strokeWidth="2"
              className={`intersection ${isValidMove ? 'valid-move' : ''} ${isRemovable ? 'removable' : ''} ${isSelected ? 'selected' : ''}`}
            />
            {piece && (
              <Piece
                cx={point.x}
                cy={point.y}
                color={piece}
                isSelected={isSelected}
              />
            )}
            {isValidMove && !piece && (
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="rgba(0,128,0,0.3)"
                className="move-hint"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default MorabarabaBoard;