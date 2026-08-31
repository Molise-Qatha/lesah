import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './KopanangTest.css';

// Import Kopanang assets with CORRECT paths
import body01 from '../../assets/kopanang_body/kopanang_body_01.png';
import body02 from '../../assets/kopanang_body/kopanang_body_02.png';
import body03 from '../../assets/kopanang_body/kopanang_body_03.png';
import body04 from '../../assets/kopanang_body/kopanang_body_04.png';
import body05 from '../../assets/kopanang_body/kopanang_body_05.png';

import faceNeutral from '../../assets/kopanang_face/kopanang_face_neutral.png';
import faceAngry from '../../assets/kopanang_face/kopanang_face_angry.png';
import faceSad from '../../assets/kopanang_face/kopanang_face_sad.png';
import faceWorried from '../../assets/kopanang_face/kopanang_face_worried.png';

import mouth1 from '../../assets/kopanang_mouth/kopanang_mouth_1.png';
import mouth2 from '../../assets/kopanang_mouth/kopanang_mouth_2.png';
import mouth3 from '../../assets/kopanang_mouth/kopanang_mouth_3.png';
import mouth4 from '../../assets/kopanang_mouth/kopanang_mouth_4.png';
import mouth5 from '../../assets/kopanang_mouth/kopanang_mouth_5.png';
import mouth6 from '../../assets/kopanang_mouth/kopanang_mouth_6.png';
import mouth7 from '../../assets/kopanang_mouth/kopanang_mouth_7.png';
import mouth8 from '../../assets/kopanang_mouth/kopanang_mouth_8.png';
import mouth9 from '../../assets/kopanang_mouth/kopanang_mouth_9.png';
import mouth10 from '../../assets/kopanang_mouth/kopanang_mouth_10.png';

const BODY_OPTIONS = [
  { id: 'body01', label: 'Body 01', src: body01 },
  { id: 'body02', label: 'Body 02', src: body02 },
  { id: 'body03', label: 'Body 03', src: body03 },
  { id: 'body04', label: 'Body 04', src: body04 },
  { id: 'body05', label: 'Body 05', src: body05 },
];

const FACE_OPTIONS = [
  { id: 'neutral', label: 'Neutral', src: faceNeutral },
  { id: 'angry', label: 'Angry', src: faceAngry },
  { id: 'sad', label: 'Sad', src: faceSad },
  { id: 'worried', label: 'Worried', src: faceWorried },
];

const MOUTH_FRAMES = [
  mouth1, mouth2, mouth3, mouth4, mouth5,
  mouth6, mouth7, mouth8, mouth9, mouth10,
];

function KopanangTest() {
  const [selectedBody, setSelectedBody] = useState('body01');
  const [selectedFace, setSelectedFace] = useState('neutral');
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [isTalking, setIsTalking] = useState(true);
  const [talkSpeed, setTalkSpeed] = useState(150);
  const [charScale, setCharScale] = useState(1);
  const mouthTimerRef = useRef(null);

  // Mouth animation loop
  useEffect(() => {
    if (isTalking) {
      mouthTimerRef.current = setInterval(() => {
        setCurrentMouthIndex(prev => (prev + 1) % MOUTH_FRAMES.length);
      }, talkSpeed);
    }
    return () => {
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
    };
  }, [isTalking, talkSpeed]);

  const currentBody = BODY_OPTIONS.find(b => b.id === selectedBody);
  const currentFace = FACE_OPTIONS.find(f => f.id === selectedFace);
  const currentMouth = MOUTH_FRAMES[currentMouthIndex];

  return (
    <div className="kopanang-test-page">
      <div className="kopanang-test-container">
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="test-header">
          <h1>🧪 Kopanang Animation Test</h1>
          <p className="test-subtitle">Modular Layer Compositing Test</p>
          <span className="test-badge">TECHNICAL TEST</span>
        </div>

        {/* Character Stage */}
        <div className="test-stage">
          <div className="character-composite" style={{ transform: `scale(${charScale})` }}>
            {/* Layer 1: Body — defines container size */}
            <div className="layer-body">
              <img src={currentBody.src} alt={`Body ${selectedBody}`} className="character-body-img" />
            </div>

            {/* Layer 2: Face — positioned OVER body */}
            <div className="layer-face">
              <img src={currentFace.src} alt={`Face ${selectedFace}`} className="character-face-img" />
            </div>

            {/* Layer 3: Mouth — positioned OVER face */}
            <div className="layer-mouth">
              <img src={currentMouth} alt={`Mouth ${currentMouthIndex + 1}`} className="character-mouth-img" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="test-controls">
          <div className="control-section">
            <h3>🎙️ Talking Animation</h3>
            <div className="control-buttons">
              <button 
                className={`test-btn ${isTalking ? 'active' : ''}`}
                onClick={() => setIsTalking(!isTalking)}
              >
                {isTalking ? '⏸ Stop Talking' : '▶ Start Talking'}
              </button>
              <button 
                className="test-btn"
                onClick={() => setCurrentMouthIndex(0)}
              >
                🔄 Reset Mouth
              </button>
            </div>
            <div className="speed-control">
              <label>Talk Speed:</label>
              <input 
                type="range" 
                min="50" 
                max="400" 
                value={talkSpeed} 
                onChange={(e) => setTalkSpeed(Number(e.target.value))}
              />
              <span>{talkSpeed}ms</span>
            </div>
          </div>

          <div className="control-section">
            <h3>😊 Face Expression</h3>
            <div className="control-buttons">
              {FACE_OPTIONS.map(face => (
                <button 
                  key={face.id}
                  className={`test-btn ${selectedFace === face.id ? 'active' : ''}`}
                  onClick={() => setSelectedFace(face.id)}
                >
                  {face.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>🧍 Body Pose</h3>
            <div className="control-buttons">
              {BODY_OPTIONS.map(body => (
                <button 
                  key={body.id}
                  className={`test-btn ${selectedBody === body.id ? 'active' : ''}`}
                  onClick={() => setSelectedBody(body.id)}
                >
                  {body.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>📐 Character Scale</h3>
            <div className="control-buttons">
              <button 
                className="test-btn"
                onClick={() => setCharScale(prev => Math.max(prev - 0.1, 0.5))}
              >
                −
              </button>
              <span className="scale-display">{charScale.toFixed(1)}x</span>
              <button 
                className="test-btn"
                onClick={() => setCharScale(prev => Math.min(prev + 0.1, 2))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="test-status">
          <h3>Current Composition</h3>
          <div className="status-row">
            <span>Body:</span>
            <span>{currentBody.label}</span>
          </div>
          <div className="status-row">
            <span>Face:</span>
            <span>{currentFace.label}</span>
          </div>
          <div className="status-row">
            <span>Mouth:</span>
            <span>Frame {currentMouthIndex + 1} of 10</span>
          </div>
          <div className="status-row">
            <span>Talking:</span>
            <span>{isTalking ? 'Yes' : 'No'}</span>
          </div>
          <div className="status-row">
            <span>Layers:</span>
            <span>3 (Body + Face + Mouth)</span>
          </div>
        </div>

        {/* Architecture Note */}
        <div className="test-note">
          <h3>📐 Layer Architecture</h3>
          <pre className="layer-diagram">
{`BODY (base)
  ↓
FACE (emotion)
  ↓
MOUTH (speech)`}
          </pre>
          <p className="note-text">
            The body is the foundation. The face sits on top for emotional expression.
            The mouth sits on top of the face for speech animation.
            Each layer is independent and can be swapped without affecting the others.
          </p>
        </div>
      </div>
    </div>
  );
}

export default KopanangTest;