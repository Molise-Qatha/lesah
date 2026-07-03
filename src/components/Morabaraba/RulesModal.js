import React from 'react';

function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="rules-modal-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>How to Play Morabaraba</h2>
        
        <h3>🎯 Objective</h3>
        <p>Capture your opponent's pieces until they have fewer than 3 pieces or cannot move.</p>
        
        <h3>📜 Rules</h3>
        
        <h4>Phase 1 – Placing</h4>
        <p>Players alternate placing one piece on any empty intersection. Each player has 12 pieces.</p>
        
        <h4>Phase 2 – Moving</h4>
        <p>After all pieces are placed, players take turns moving one piece along a line to an adjacent empty intersection.</p>
        
        <h4>Phase 3 – Flying</h4>
        <p>When a player has only 3 pieces left, they can move to ANY empty intersection (not just adjacent).</p>
        
        <h4>⚡ Mills</h4>
        <p>If you form a straight line of 3 of your pieces (horizontal or vertical), you have a "mill". You must then remove one of your opponent's pieces (not in a mill, if possible).</p>
        
        <h4>🏆 Winning</h4>
        <p>Win by reducing your opponent to fewer than 3 pieces, or by blocking them so they cannot move.</p>
        
        <h3>🎨 Colors</h3>
        <p><span className="color-dot green"></span> Green – Player 1</p>
        <p><span className="color-dot brown"></span> Brown – Player 2</p>
      </div>
    </div>
  );
}

export default RulesModal;