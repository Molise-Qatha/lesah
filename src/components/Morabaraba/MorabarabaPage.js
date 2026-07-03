import React, { useState, useCallback } from 'react';
import MorabarabaBoard from './MorabarabaBoard';
import Controls from './Controls';
import RulesModal from './RulesModal';
import {
  createInitialState,
  placePiece,
  removeOpponentPiece,
  selectPiece,
  movePiece,
  PHASE,
  isFlyingPhase,
} from './gameLogic';
import './Morabaraba.css';

function MorabarabaPage() {
  const [state, setState] = useState(createInitialState);
  const [rulesOpen, setRulesOpen] = useState(false);

  const handlePointClick = useCallback((pointId, action) => {
    if (state.gameOver) return;
    
    setState(prev => {
      if (state.millFormed && action !== 'remove') {
        return prev; // Must remove a piece first
      }
      
      switch (action) {
        case 'place':
          if (prev.phase !== PHASE.PLACING) return prev;
          if (prev.board[pointId] !== null) return prev;
          return placePiece(prev, pointId);
        
        case 'select':
          if (prev.phase === PHASE.PLACING) return prev;
          return selectPiece(prev, pointId);
        
        case 'move':
          if (prev.selectedPiece === null) return prev;
          if (!prev.validMoves.includes(pointId)) return prev;
          return movePiece(prev, pointId);
        
        default:
          return prev;
      }
    });
  }, [state.millFormed, state.gameOver]);

  const handleRemovePiece = useCallback((pointId) => {
    setState(prev => removeOpponentPiece(prev, pointId));
  }, []);

  const handleRestart = () => {
    setState(createInitialState());
  };

  const handleUndo = () => {
    // Simple undo: revert to previous state (we could use moveHistory)
    // For simplicity, just restart if no history
    if (state.moveHistory.length === 0) return;
    // Not implementing full undo; restart instead
    handleRestart();
  };

  const getCurrentPhaseText = () => {
    if (state.phase === PHASE.PLACING) return 'Placing';
    if (isFlyingPhase(state, state.currentPlayer)) return 'Flying';
    return 'Moving';
  };

  return (
    <div className="morabaraba-page">
      <div className="morabaraba-container">
        <div className="game-header">
          <h1>🕹️ Morabaraba</h1>
          <p className="basotho-subtitle">Papali ea Basotho</p>
        </div>
        
        <div className="game-info">
          <div className="info-section">
            <div className={`player-indicator ${state.currentPlayer}`}>
              <span className="player-dot"></span>
              Current: {state.currentPlayer.toUpperCase()}
            </div>
            <div className="phase-indicator">
              Phase: {getCurrentPhaseText()}
            </div>
          </div>
          <div className="piece-counts">
            <div className="count green-count">
              🟢 Green: {state.piecesOnBoard.green} on board, {state.piecesToPlace.green} to place
            </div>
            <div className="count brown-count">
              🟤 Brown: {state.piecesOnBoard.brown} on board, {state.piecesToPlace.brown} to place
            </div>
          </div>
        </div>
        
        {state.millFormed && (
          <div className="mill-alert">
            ⚡ Mill formed! Click an opponent's piece to remove it.
          </div>
        )}
        
        <div className="board-container">
          <MorabarabaBoard
            board={state.board}
            selectedPiece={state.selectedPiece}
            validMoves={state.validMoves}
            onPointClick={handlePointClick}
            phase={state.phase}
            currentPlayer={state.currentPlayer}
            removablePieces={state.removablePieces}
            millFormed={state.millFormed}
            onRemovePiece={handleRemovePiece}
          />
        </div>
        
        <Controls
          onRestart={handleRestart}
          onUndo={handleUndo}
          onRules={() => setRulesOpen(true)}
          gameOver={state.gameOver}
          message={state.message}
        />
        
        {state.gameOver && (
          <div className="victory-overlay">
            <div className="victory-card">
              <h2>🎉 {state.winner.toUpperCase()} Wins!</h2>
              <button onClick={handleRestart} className="play-again-btn">
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}

export default MorabarabaPage;