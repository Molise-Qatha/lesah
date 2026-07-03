import React from 'react';

function Controls({ onRestart, onUndo, onRules, gameOver, message }) {
  return (
    <div className="controls">
      {message && <div className="game-message">{message}</div>}
      <div className="control-buttons">
        <button onClick={onRestart} className="control-btn restart">
          🔄 Restart Game
        </button>
        <button onClick={onUndo} className="control-btn undo">
          ↩️ Undo Last Move
        </button>
        <button onClick={onRules} className="control-btn rules">
          📖 How to Play
        </button>
      </div>
    </div>
  );
}

export default Controls;