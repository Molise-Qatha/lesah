import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AnimationLab.css';

// Simple placeholder sprite data (will be replaced with actual assets later)
const placeholderSprite = {
  body: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120">
      <rect x="15" y="20" width="50" height="70" rx="10" fill="#2e7d32"/>
      <circle cx="40" cy="15" r="12" fill="#f5c6a0"/>
      <rect x="5" y="20" width="10" height="50" rx="5" fill="#2e7d32"/>
      <rect x="65" y="20" width="10" height="50" rx="5" fill="#2e7d32"/>
      <rect x="25" y="90" width="12" height="25" rx="4" fill="#1b5e20"/>
      <rect x="43" y="90" width="12" height="25" rx="4" fill="#1b5e20"/>
      <circle cx="35" cy="12" r="2" fill="#000"/>
      <circle cx="45" cy="12" r="2" fill="#000"/>
      <path d="M37 18 Q40 20 43 18" stroke="#000" strokeWidth="1.5" fill="none"/>
    </svg>
  `),
  eyes_open: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20">
      <circle cx="15" cy="10" r="4" fill="#000"/>
      <circle cx="25" cy="10" r="4" fill="#000"/>
    </svg>
  `),
  eyes_closed: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20">
      <path d="M11 10 Q15 6 19 10" stroke="#000" strokeWidth="2" fill="none"/>
      <path d="M21 10 Q25 6 29 10" stroke="#000" strokeWidth="2" fill="none"/>
    </svg>
  `),
  mouth_closed: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 20 10">
      <path d="M5 5 Q10 8 15 5" stroke="#000" strokeWidth="1.5" fill="none"/>
    </svg>
  `),
  mouth_open: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15">
      <ellipse cx="10" cy="7" rx="6" ry="5" fill="#000"/>
    </svg>
  `),
  mouth_smile: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 20 10">
      <path d="M4 4 Q10 10 16 4" stroke="#000" strokeWidth="1.5" fill="none"/>
    </svg>
  `),
};

function AnimationLab() {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [selectedAnimation, setSelectedAnimation] = useState('idle');
  const [characterPosition, setCharacterPosition] = useState({ x: 200, y: 150 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [expression, setExpression] = useState('neutral');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Blink timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Talk timer
  useEffect(() => {
    if (isTalking) {
      const talkInterval = setInterval(() => {
        // Cycle mouth sprites while talking
      }, 200);
      return () => clearInterval(talkInterval);
    }
  }, [isTalking]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCharacterPosition({ x: 200, y: 150 });
    setScale(1);
    setRotation(0);
    setExpression('neutral');
    setIsTalking(false);
    setIsBlinking(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCharacterPosition({ x: 200, y: 150 });
    setScale(1);
    setRotation(0);
    setExpression('neutral');
    setIsTalking(false);
    setIsBlinking(false);
    setAnimationSpeed(1);
  };

  const handleMoveLeft = () => {
    setCharacterPosition(prev => ({ ...prev, x: prev.x - 50 }));
  };

  const handleMoveRight = () => {
    setCharacterPosition(prev => ({ ...prev, x: prev.x + 50 }));
  };

  const handleMoveUp = () => {
    setCharacterPosition(prev => ({ ...prev, y: prev.y - 30 }));
  };

  const handleMoveDown = () => {
    setCharacterPosition(prev => ({ ...prev, y: prev.y + 30 }));
  };

  const handleTalk = () => {
    setIsTalking(!isTalking);
  };

  const handleExpression = (expr) => {
    setExpression(expr);
  };

  const handleScaleUp = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleScaleDown = () => {
    setScale(prev => Math.max(prev - 0.2, 0.2));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 15);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 15);
  };

  const handleFadeIn = () => {
    setScale(1);
  };

  const handleFadeOut = () => {
    setScale(0.5);
  };

  const navigateToScene01CameraTest = () => {
    navigate('/animation-lab/scene01-camera-test');
  };

  const navigateToKopanangTest = () => {
    navigate('/animation-lab/kopanang-test');
  };

  return (
    <div className="animation-lab-page">
      <div className="animation-lab-container">
        <Link to="/" className="back-link">← Back to LeSAH</Link>
        
        <div className="animation-lab-header">
          <h1>🎬 Animation Lab</h1>
          <p className="animation-lab-subtitle">Sprite Animation Workshop</p>
          <span className="dev-badge">UNLISTED DEVELOPMENT AREA</span>
        </div>

        {/* Development Tools Quick Access */}
        <div className="dev-tools-nav">
          <h3>🧪 Development Tools</h3>
          <div className="dev-tools-buttons">
            <button className="dev-tool-btn" onClick={navigateToKopanangTest}>
              🧍 Kopanang Animation Tool
              <span className="dev-tool-desc">Character testing + Audio sync</span>
            </button>
            <button className="dev-tool-btn" onClick={navigateToScene01CameraTest}>
              🎥 Scene 01 Camera Test
              <span className="dev-tool-desc">Parallax camera system</span>
            </button>
          </div>
        </div>

        {/* Animation Stage */}
        <div className="animation-stage" ref={stageRef}>
          {/* Background layers */}
          <div className="stage-layer stage-sky">
            <div className="sky-gradient"></div>
          </div>
          <div className="stage-layer stage-mountains">
            <div className="mountain mountain-1"></div>
            <div className="mountain mountain-2"></div>
            <div className="mountain mountain-3"></div>
          </div>
          <div className="stage-layer stage-ground">
            <div className="ground-gradient"></div>
          </div>

          {/* Character */}
          <div 
            className="character-container"
            style={{
              transform: `translate(${characterPosition.x}px, ${characterPosition.y}px) rotate(${rotation}deg) scale(${scale})`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* Body */}
            <div className="character-body">
              <img 
                src={placeholderSprite.body} 
                alt="Character body" 
                className="sprite-body"
              />
            </div>

            {/* Eyes */}
            <div className="character-eyes">
              <img 
                src={isBlinking ? placeholderSprite.eyes_closed : placeholderSprite.eyes_open} 
                alt="Eyes" 
                className="sprite-eyes"
              />
            </div>

            {/* Mouth */}
            <div className="character-mouth">
              <img 
                src={
                  isTalking ? placeholderSprite.mouth_open :
                  expression === 'happy' ? placeholderSprite.mouth_smile :
                  placeholderSprite.mouth_closed
                } 
                alt="Mouth" 
                className="sprite-mouth"
              />
            </div>
          </div>

          {/* Placeholder overlay */}
          <div className="stage-placeholder">
            <span>🎨 Character assets coming soon</span>
            <span className="placeholder-hint">This is a placeholder sprite system</span>
          </div>
        </div>

        {/* Controls */}
        <div className="animation-controls">
          <div className="control-group">
            <h3>Playback</h3>
            <div className="control-buttons">
              <button className={`control-btn ${isPlaying ? 'active' : ''}`} onClick={handlePlay}>
                ▶ Play
              </button>
              <button className="control-btn" onClick={handlePause}>
                ⏸ Pause
              </button>
              <button className="control-btn" onClick={handleRestart}>
                🔄 Restart
              </button>
              <button className="control-btn" onClick={handleReset}>
                🔃 Reset
              </button>
            </div>
          </div>

          <div className="control-group">
            <h3>Movement</h3>
            <div className="control-buttons">
              <button className="control-btn" onClick={handleMoveLeft}>← Left</button>
              <button className="control-btn" onClick={handleMoveUp}>↑ Up</button>
              <button className="control-btn" onClick={handleMoveDown}>↓ Down</button>
              <button className="control-btn" onClick={handleMoveRight}>Right →</button>
            </div>
          </div>

          <div className="control-group">
            <h3>Transform</h3>
            <div className="control-buttons">
              <button className="control-btn" onClick={handleScaleUp}>🔍 +</button>
              <button className="control-btn" onClick={handleScaleDown}>🔍 −</button>
              <button className="control-btn" onClick={handleRotateLeft}>↺ Left</button>
              <button className="control-btn" onClick={handleRotateRight}>↻ Right</button>
            </div>
          </div>

          <div className="control-group">
            <h3>Facial Animation</h3>
            <div className="control-buttons">
              <button className="control-btn" onClick={handleTalk}>
                {isTalking ? '🔇 Stop Talking' : '🔊 Talk'}
              </button>
              <button className="control-btn" onClick={() => handleExpression('neutral')}>😐 Neutral</button>
              <button className="control-btn" onClick={() => handleExpression('happy')}>😊 Happy</button>
              <button className="control-btn" onClick={() => setIsBlinking(true)}>👁️ Blink</button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="animation-info">
          <h3>System Status</h3>
          <div className="info-row">
            <span>Position:</span>
            <span>x: {Math.round(characterPosition.x)}, y: {Math.round(characterPosition.y)}</span>
          </div>
          <div className="info-row">
            <span>Scale:</span>
            <span>{scale.toFixed(1)}x</span>
          </div>
          <div className="info-row">
            <span>Rotation:</span>
            <span>{rotation}°</span>
          </div>
          <div className="info-row">
            <span>Expression:</span>
            <span>{expression}</span>
          </div>
          <div className="info-row">
            <span>Talking:</span>
            <span>{isTalking ? 'Yes' : 'No'}</span>
          </div>
          <div className="info-row">
            <span>Blinking:</span>
            <span>{isBlinking ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Architecture Preview */}
        <div className="architecture-preview">
          <h3>Development Progress</h3>
          <div className="arch-list">
            <div className="arch-item">✅ Sprite loading</div>
            <div className="arch-item">✅ Position control</div>
            <div className="arch-item">✅ Rotation</div>
            <div className="arch-item">✅ Scaling</div>
            <div className="arch-item">✅ Opacity</div>
            <div className="arch-item">✅ Blinking</div>
            <div className="arch-item">✅ Talking (basic)</div>
            <div className="arch-item">✅ Expressions (basic)</div>
            <div className="arch-item">✅ Movement animation</div>
            <div className="arch-item">✅ Audio sync</div>
            <div className="arch-item">✅ Audio mixer (multi-track)</div>
            <div className="arch-item">✅ Particle effects</div>
            <div className="arch-item">✅ Camera system (Scene 01)</div>
            <div className="arch-item">✅ Parallax layers (Scene 01)</div>
            <div className="arch-item">🔜 Character placement in scene</div>
            <div className="arch-item">🔜 Scene transitions</div>
            <div className="arch-item">🔜 Full animation timeline</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimationLab;