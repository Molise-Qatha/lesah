import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './KopanangTest.css';

// Import Kopanang assets
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
  // Layer selection
  const [selectedBody, setSelectedBody] = useState('body01');
  const [selectedFace, setSelectedFace] = useState('neutral');
  const [isTalking, setIsTalking] = useState(true);
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [talkSpeed, setTalkSpeed] = useState(200);

  // Body controls
  const [bodyScale, setBodyScale] = useState(200); // px width
  const [bodyX, setBodyX] = useState(0);
  const [bodyY, setBodyY] = useState(0);
  const [bodyRotation, setBodyRotation] = useState(0);

  // Head controls
  const [headScale, setHeadScale] = useState(60); // px width
  const [headX, setHeadX] = useState(0); // offset from center
  const [headY, setHeadY] = useState(20); // offset from top of body
  const [headRotation, setHeadRotation] = useState(0);
  const [headOpacity, setHeadOpacity] = useState(1);

  const mouthTimerRef = useRef(null);

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

  return (
    <div className="kopanang-test-page">
      <div className="kopanang-test-container">
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="test-header">
          <h1>🧪 Kopanang Alignment Tool</h1>
          <p className="test-subtitle">Position and scale each layer visually</p>
          <span className="test-badge">DEVELOPER TOOL</span>
        </div>

        {/* Stage */}
        <div className="test-stage">
          <div className="character-canvas" style={{ width: `${bodyScale}px` }}>
            {/* Body Layer */}
            <img 
              src={currentBody.src} 
              alt="Body" 
              className="layer-body-img"
              style={{
                width: '100%',
                transform: `rotate(${bodyRotation}deg)`,
                position: 'relative',
                zIndex: 1,
              }}
            />

            {/* Head Layer */}
            <img 
              src={isTalking ? MOUTH_FRAMES[currentMouthIndex] : currentFace.src}
              alt="Head"
              className="layer-head-img"
              style={{
                width: `${headScale}px`,
                position: 'absolute',
                top: `${headY}px`,
                left: `calc(50% + ${headX}px)`,
                transform: `translateX(-50%) rotate(${headRotation}deg)`,
                zIndex: 10,
                opacity: headOpacity,
              }}
            />
          </div>
        </div>

        {/* ═══════════ LAYER CONTROLS ═══════════ */}
        <div className="layer-controls">
          {/* BODY CONTROLS */}
          <div className="control-panel body-panel">
            <h3>🧍 Body Layer</h3>
            <div className="slider-row">
              <label>Body Width:</label>
              <input type="range" min="50" max="400" value={bodyScale} onChange={(e) => setBodyScale(Number(e.target.value))} />
              <span>{bodyScale}px</span>
            </div>
            <div className="slider-row">
              <label>Body Rotation:</label>
              <input type="range" min="-20" max="20" value={bodyRotation} onChange={(e) => setBodyRotation(Number(e.target.value))} />
              <span>{bodyRotation}°</span>
            </div>
            <div className="pose-buttons">
              {BODY_OPTIONS.map(body => (
                <button key={body.id} className={`test-btn ${selectedBody === body.id ? 'active' : ''}`} onClick={() => setSelectedBody(body.id)}>
                  {body.label}
                </button>
              ))}
            </div>
          </div>

          {/* HEAD CONTROLS */}
          <div className="control-panel head-panel">
            <h3>👤 Head Layer</h3>
            <div className="slider-row">
              <label>Head Width:</label>
              <input type="range" min="20" max="200" value={headScale} onChange={(e) => setHeadScale(Number(e.target.value))} />
              <span>{headScale}px</span>
            </div>
            <div className="slider-row">
              <label>Head Y Position:</label>
              <input type="range" min="-100" max="200" value={headY} onChange={(e) => setHeadY(Number(e.target.value))} />
              <span>{headY}px</span>
            </div>
            <div className="slider-row">
              <label>Head X Offset:</label>
              <input type="range" min="-100" max="100" value={headX} onChange={(e) => setHeadX(Number(e.target.value))} />
              <span>{headX}px</span>
            </div>
            <div className="slider-row">
              <label>Head Rotation:</label>
              <input type="range" min="-45" max="45" value={headRotation} onChange={(e) => setHeadRotation(Number(e.target.value))} />
              <span>{headRotation}°</span>
            </div>
            <div className="slider-row">
              <label>Head Opacity:</label>
              <input type="range" min="0" max="100" value={headOpacity * 100} onChange={(e) => setHeadOpacity(Number(e.target.value) / 100)} />
              <span>{Math.round(headOpacity * 100)}%</span>
            </div>
            <div className="pose-buttons">
              {FACE_OPTIONS.map(face => (
                <button key={face.id} className={`test-btn ${selectedFace === face.id && !isTalking ? 'active' : ''}`} onClick={() => { setSelectedFace(face.id); setIsTalking(false); }}>
                  {face.label}
                </button>
              ))}
            </div>
          </div>

          {/* TALKING CONTROLS */}
          <div className="control-panel talk-panel">
            <h3>🎙️ Talking</h3>
            <div className="pose-buttons">
              <button className={`test-btn ${isTalking ? 'active' : ''}`} onClick={() => setIsTalking(true)}>▶ Start</button>
              <button className="test-btn" onClick={() => setIsTalking(false)}>⏹ Stop</button>
            </div>
            <div className="slider-row">
              <label>Speed:</label>
              <input type="range" min="50" max="500" value={talkSpeed} onChange={(e) => setTalkSpeed(Number(e.target.value))} />
              <span>{talkSpeed}ms</span>
            </div>
          </div>
        </div>

        {/* Current values */}
        <div className="test-status">
          <h3>📋 Current Values (copy these for hardcoding)</h3>
          <pre className="values-display">
{`Body: { width: ${bodyScale}, rotation: ${bodyRotation} }
Head: { width: ${headScale}, y: ${headY}, x: ${headX}, rotation: ${headRotation} }`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default KopanangTest;