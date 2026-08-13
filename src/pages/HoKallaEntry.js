import React, { useEffect, useState } from 'react';
import './HoKallaEntry.css';
import HoKalla from './HoKalla'; // Import your actual game

// Helper to generate a random number for particle positioning
const getRandom = (min, max) => Math.random() * (max - min) + min;

const HoKallaEntry = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate floating dust particles on mount
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${getRandom(0, 100)}%`,
      top: `${getRandom(0, 100)}%`,
      size: `${getRandom(2, 6)}px`,
      duration: `${getRandom(20, 40)}s`,
      delay: `${getRandom(0, 10)}s`,
    }));
    setParticles(newParticles);
  }, []);

  // Handle the Fade-to-Black transition
  const handlePlay = () => {
    const container = document.querySelector('.ho-kalla-entry-container');
    if (container) {
      container.style.transition = 'opacity 0.8s ease';
      container.style.opacity = '0';
      setTimeout(() => setGameStarted(true), 900);
    }
  };

  // If the game has started, render the actual game logic
  if (gameStarted) {
    return <HoKalla />;
  }

  // Otherwise, render the Cinematic Entry Screen
  return (
    <div className="ho-kalla-entry-container">
      {/* The Image */}
      <div className="entry-background"></div>
      
      {/* Dark Gradient Edge Overlay */}
      <div className="entry-overlay"></div>

      {/* Floating Particles */}
      {particles.map((p) => (
        <div 
          key={p.id} 
          className="particle" 
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Central Content */}
      <div className="entry-content">
        <h1 className="ho-kalla-title">HO KALLA</h1>
        <div className="ho-kalla-subtitle">Legends of Lesotho</div>

        <div className="entry-menu">
          <button className="ho-kalla-btn play-btn" onClick={handlePlay}>
            PLAY
          </button>
          <button className="ho-kalla-btn">CHARACTERS</button>
          <button className="ho-kalla-btn">HOW TO PLAY</button>
          <button className="ho-kalla-btn">SETTINGS</button>
          
          <button className="ho-kalla-btn back-btn" onClick={() => window.history.back()}>
            BACK TO LESAH
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoKallaEntry;