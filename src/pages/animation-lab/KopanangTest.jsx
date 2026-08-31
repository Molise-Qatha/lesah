import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './KopanangTest.css';

// Import Kopanang body assets
import body01 from '../../assets/kopanang_body/kopanang_body_01.png';
import body02 from '../../assets/kopanang_body/kopanang_body_02.png';
import body03 from '../../assets/kopanang_body/kopanang_body_03.png';
import body04 from '../../assets/kopanang_body/kopanang_body_04.png';
import body05 from '../../assets/kopanang_body/kopanang_body_05.png';

// Import face expressions
import faceNeutral from '../../assets/kopanang_face/kopanang_face_neutral.png';
import faceAngry from '../../assets/kopanang_face/kopanang_face_angry.png';
import faceSad from '../../assets/kopanang_face/kopanang_face_sad.png';
import faceWorried from '../../assets/kopanang_face/kopanang_face_worried.png';

// Import NEW mouth-ONLY sprites
import mouthOnly01 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_01.png';
import mouthOnly02 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_02.png';
import mouthOnly03 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_03.png';
import mouthOnly04 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_04.png';
import mouthOnly05 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_05.png';
import mouthOnly06 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_06.png';
import mouthOnly07 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_07.png';
import mouthOnly08 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_08.png';
import mouthOnly09 from '../../assets/kopanang_mouth_only/kopanang_mouth_only_09.png';

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
  mouthOnly01, mouthOnly02, mouthOnly03, mouthOnly04, mouthOnly05,
  mouthOnly06, mouthOnly07, mouthOnly08, mouthOnly09,
];

function KopanangTest() {
  // Layer selection
  const [selectedBody, setSelectedBody] = useState('body01');
  const [selectedFace, setSelectedFace] = useState('neutral');
  const [isTalking, setIsTalking] = useState(true);
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [talkSpeed, setTalkSpeed] = useState(200);

  // Body controls
  const [bodyScale, setBodyScale] = useState(200);
  const [bodyRotation, setBodyRotation] = useState(0);

  // Head (face) controls
  const [headScale, setHeadScale] = useState(60);
  const [headX, setHeadX] = useState(0);
  const [headY, setHeadY] = useState(20);
  const [headRotation, setHeadRotation] = useState(0);

  // Mouth-only controls
  const [mouthScale, setMouthScale] = useState(30);
  const [mouthX, setMouthX] = useState(0);
  const [mouthY, setMouthY] = useState(45);
  const [mouthRotation, setMouthRotation] = useState(0);
  const [mouthAspectRatio, setMouthAspectRatio] = useState(0.4); // height = width * 0.4

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
          <p className="test-subtitle">Body + Face + Mouth-Only Layers</p>
          <span className="test-badge">DEVELOPER TOOL</span>
        </div>

        {/* Stage */}
        <div className="test-stage">
          <div className="character-canvas" style={{ width: `${bodyScale}px` }}>
            {/* Layer 1: Body */}
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

            {/* Layer 2: Face (static expression) */}
            <img 
              src={currentFace.src}
              alt="Face"
              className="layer-head-img"
              style={{
                width: `${headScale}px`,
                position: 'absolute',
                top: `${headY}px`,
                left: `calc(50% + ${headX}px)`,
                transform: `translateX(-50%) rotate(${headRotation}deg)`,
                zIndex: 10,
              }}
            />

            {/* Layer 3: Mouth-ONLY — FIXED container prevents jumping */}
            {isTalking && (
              <div
                style={{
                  width: `${mouthScale}px`,
                  height: `${mouthScale * mouthAspectRatio}px`,
                  position: 'absolute',
                  top: `${mouthY}px`,
                  left: `calc(50% + ${mouthX}px)`,
                  transform: `translate(-50%, -50%) rotate(${mouthRotation}deg)`,
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'visible',
                  pointerEvents: 'none',
                }}
              >
                <img 
                  src={MOUTH_FRAMES[currentMouthIndex]}
                  alt={`Mouth ${currentMouthIndex + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            )}
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
            <h3>👤 Head Layer (Face)</h3>
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
            <div className="pose-buttons">
              {FACE_OPTIONS.map(face => (
                <button key={face.id} className={`test-btn ${selectedFace === face.id ? 'active' : ''}`} onClick={() => setSelectedFace(face.id)}>
                  {face.label}
                </button>
              ))}
            </div>
          </div>

          {/* MOUTH CONTROLS */}
          <div className="control-panel mouth-panel">
            <h3>👄 Mouth Layer</h3>
            <div className="slider-row">
              <label>Mouth Width:</label>
              <input type="range" min="5" max="150" value={mouthScale} onChange={(e) => setMouthScale(Number(e.target.value))} />
              <span>{mouthScale}px</span>
            </div>
            <div className="slider-row">
              <label>Mouth Height Ratio:</label>
              <input type="range" min="0.2" max="1" step="0.05" value={mouthAspectRatio} onChange={(e) => setMouthAspectRatio(Number(e.target.value))} />
              <span>{mouthAspectRatio.toFixed(2)}</span>
            </div>
            <div className="slider-row">
              <label>Mouth Y Position:</label>
              <input type="range" min="-100" max="200" value={mouthY} onChange={(e) => setMouthY(Number(e.target.value))} />
              <span>{mouthY}px</span>
            </div>
            <div className="slider-row">
              <label>Mouth X Offset:</label>
              <input type="range" min="-100" max="100" value={mouthX} onChange={(e) => setMouthX(Number(e.target.value))} />
              <span>{mouthX}px</span>
            </div>
            <div className="slider-row">
              <label>Mouth Rotation:</label>
              <input type="range" min="-45" max="45" value={mouthRotation} onChange={(e) => setMouthRotation(Number(e.target.value))} />
              <span>{mouthRotation}°</span>
            </div>
            <div className="pose-buttons">
              <button className={`test-btn ${isTalking ? 'active' : ''}`} onClick={() => setIsTalking(true)}>▶ Start Talking</button>
              <button className="test-btn" onClick={() => setIsTalking(false)}>⏹ Stop Talking</button>
            </div>
            <div className="slider-row" style={{ marginTop: '10px' }}>
              <label>Speed:</label>
              <input type="range" min="50" max="500" value={talkSpeed} onChange={(e) => setTalkSpeed(Number(e.target.value))} />
              <span>{talkSpeed}ms</span>
            </div>
          </div>
        </div>

        {/* Current values */}
        <div className="test-status">
          <h3>📋 Current Values (copy for hardcoding)</h3>
          <pre className="values-display">
{`Body: { width: ${bodyScale}, rotation: ${bodyRotation} }
Head: { width: ${headScale}, y: ${headY}, x: ${headX}, rotation: ${headRotation} }
Mouth: { width: ${mouthScale}, ratio: ${mouthAspectRatio.toFixed(2)}, y: ${mouthY}, x: ${mouthX}, rotation: ${mouthRotation} }`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default KopanangTest;