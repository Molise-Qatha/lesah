import React from 'react';

function Piece({ cx, cy, color, isSelected }) {
  const gradientId = `grad-${color}`;
  const baseColor = color === 'green' ? '#2d6a4f' : '#8B4513';
  const lightColor = color === 'green' ? '#52b788' : '#CD853F';
  
  return (
    <>
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="30%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="100%" stopColor={baseColor} />
        </radialGradient>
        <filter id={`shadow-${color}`}>
          <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.4" />
        </filter>
        <filter id={`glow-${color}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r="10"
        fill={`url(#${gradientId})`}
        filter={isSelected ? `url(#glow-${color})` : `url(#shadow-${color})`}
        className={`piece ${isSelected ? 'piece-selected' : ''}`}
      />
    </>
  );
}

export default Piece;