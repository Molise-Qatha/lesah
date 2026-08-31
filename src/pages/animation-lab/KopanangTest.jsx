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

// Import vowel mouth sprites
import mouthA from '../../assets/kopanang_mouth_vowels/kopanang_mouth_a.png';
import mouthE from '../../assets/kopanang_mouth_vowels/kopanang_mouth_e.png';
import mouthI from '../../assets/kopanang_mouth_vowels/kopanang_mouth_i.png';
import mouthO from '../../assets/kopanang_mouth_vowels/kopanang_mouth_o.png';

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
  { id: 'A', label: 'A (Open)', src: mouthA },
  { id: 'E', label: 'E (Smile)', src: mouthE },
  { id: 'I', label: 'I (Narrow)', src: mouthI },
  { id: 'O', label: 'O (Round)', src: mouthO },
];

function KopanangTest() {
  // Layer selection
  const [selectedBody, setSelectedBody] = useState('body01');
  const [selectedFace, setSelectedFace] = useState('neutral');
  const [isTalking, setIsTalking] = useState(true);
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [talkSpeed, setTalkSpeed] = useState(250);

  // Body controls (draggable)
  const [bodyScale, setBodyScale] = useState(200);
  const [bodyRotation, setBodyRotation] = useState(0);
  const [bodyX, setBodyX] = useState(0);
  const [bodyY, setBodyY] = useState(0);

  // Head controls (draggable)
  const [headScale, setHeadScale] = useState(60);
  const [headX, setHeadX] = useState(0);
  const [headY, setHeadY] = useState(20);
  const [headRotation, setHeadRotation] = useState(0);

  // Mouth controls (SLIDER-BASED — no drag for small element)
  const [mouthScale, setMouthScale] = useState(30);
  const [mouthX, setMouthX] = useState(0);
  const [mouthY, setMouthY] = useState(45);
  const [mouthRotation, setMouthRotation] = useState(0);
  const [mouthAspectRatio, setMouthAspectRatio] = useState(0.4);

  // Save presets
  const [savedPresets, setSavedPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kopanang_presets') || '[]');
    } catch { return []; }
  });
  const [presetName, setPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Drag state (only for body and head)
  const [draggingLayer, setDraggingLayer] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

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

  // Drag handlers (body and head only)
  const handleMouseDown = (e, layer) => {
    if (layer === 'mouth') return; // Mouth is not draggable
    e.preventDefault();
    setDraggingLayer(layer);
    
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    
    let layerX, layerY;
    if (layer === 'body') {
      layerX = bodyX;
      layerY = bodyY;
    } else if (layer === 'head') {
      layerX = headX + stageRect.width / 2;
      layerY = headY;
    }
    
    setDragOffset({
      x: mouseX - (layerX || 0),
      y: mouseY - (layerY || 0),
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingLayer) return;
    
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    
    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;
    
    if (draggingLayer === 'body') {
      setBodyX(newX);
      setBodyY(newY);
    } else if (draggingLayer === 'head') {
      setHeadX(newX - stageRect.width / 2);
      setHeadY(newY);
    }
  };

  const handleMouseUp = () => {
    setDraggingLayer(null);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingLayer, dragOffset]);

  // Save preset
  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const preset = {
      id: Date.now(),
      name: presetName.trim(),
      body: selectedBody,
      face: selectedFace,
      bodyScale,
      bodyRotation,
      bodyX: Math.round(bodyX),
      bodyY: Math.round(bodyY),
      headScale,
      headRotation,
      headX: Math.round(headX),
      headY: Math.round(headY),
      mouthScale,
      mouthRotation,
      mouthX: Math.round(mouthX),
      mouthY: Math.round(mouthY),
      mouthAspectRatio: mouthAspectRatio,
    };
    
    const updated = [...savedPresets, preset];
    setSavedPresets(updated);
    localStorage.setItem('kopanang_presets', JSON.stringify(updated));
    setPresetName('');
    setShowSaveDialog(false);
  };

  // Load preset
  const handleLoadPreset = (preset) => {
    setSelectedBody(preset.body);
    setSelectedFace(preset.face);
    setBodyScale(preset.bodyScale);
    setBodyRotation(preset.bodyRotation);
    setBodyX(preset.bodyX);
    setBodyY(preset.bodyY);
    setHeadScale(preset.headScale);
    setHeadRotation(preset.headRotation);
    setHeadX(preset.headX);
    setHeadY(preset.headY);
    setMouthScale(preset.mouthScale);
    setMouthRotation(preset.mouthRotation);
    setMouthX(preset.mouthX);
    setMouthY(preset.mouthY);
    setMouthAspectRatio(preset.mouthAspectRatio);
  };

  // Delete preset
  const handleDeletePreset = (presetId) => {
    const updated = savedPresets.filter(p => p.id !== presetId);
    setSavedPresets(updated);
    localStorage.setItem('kopanang_presets', JSON.stringify(updated));
  };

  const currentBody = BODY_OPTIONS.find(b => b.id === selectedBody);
  const currentFace = FACE_OPTIONS.find(f => f.id === selectedFace);
  const currentMouth = MOUTH_FRAMES[currentMouthIndex];

  return (
    <div className="kopanang-test-page">
      <div className="kopanang-test-container">
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="test-header">
          <h1>🧪 Kopanang Alignment Tool</h1>
          <p className="test-subtitle">4 Vowel Talking Animation (A-E-I-O)</p>
          <span className="test-badge">DEVELOPER TOOL</span>
        </div>

        {/* Stage */}
        <div 
          className="test-stage" 
          ref={stageRef}
          style={{ cursor: draggingLayer ? 'grabbing' : 'default' }}
        >
          <div className="character-canvas" style={{ width: `${bodyScale}px`, position: 'relative' }}>
            {/* Body — draggable */}
            <img 
              src={currentBody.src} 
              alt="Body" 
              className="layer-body-img draggable"
              style={{
                width: '100%',
                transform: `translate(${bodyX}px, ${bodyY}px) rotate(${bodyRotation}deg)`,
                position: 'relative',
                zIndex: 1,
                cursor: 'grab',
              }}
              onMouseDown={(e) => handleMouseDown(e, 'body')}
            />

            {/* Face — draggable */}
            <img 
              src={currentFace.src}
              alt="Face"
              className="layer-head-img draggable"
              style={{
                width: `${headScale}px`,
                position: 'absolute',
                top: `${headY}px`,
                left: `calc(50% + ${headX}px)`,
                transform: `translateX(-50%) rotate(${headRotation}deg)`,
                zIndex: 10,
                cursor: 'grab',
                pointerEvents: 'auto',
              }}
              onMouseDown={(e) => handleMouseDown(e, 'head')}
            />

            {/* Mouth — NOT draggable, controlled by sliders */}
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
                  pointerEvents: 'none',
                }}
              >
                <img 
                  src={currentMouth.src}
                  alt={`Mouth ${currentMouth.label}`}
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

        {/* Drag hint */}
        <div className="drag-hint">
          💡 <strong>DRAG:</strong> Body and Head. <strong>SLIDERS:</strong> Mouth (too small to grab).
        </div>

        {/* Controls */}
        <div className="layer-controls">
          {/* Body */}
          <div className="control-panel body-panel">
            <h3>🧍 Body</h3>
            <div className="slider-row">
              <label>Width:</label>
              <input type="range" min="50" max="400" value={bodyScale} onChange={(e) => setBodyScale(Number(e.target.value))} />
              <span>{bodyScale}px</span>
            </div>
            <div className="slider-row">
              <label>Rotation:</label>
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

          {/* Head */}
          <div className="control-panel head-panel">
            <h3>👤 Head</h3>
            <div className="slider-row">
              <label>Width:</label>
              <input type="range" min="20" max="200" value={headScale} onChange={(e) => setHeadScale(Number(e.target.value))} />
              <span>{headScale}px</span>
            </div>
            <div className="slider-row">
              <label>Rotation:</label>
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

          {/* Mouth — SLIDER CONTROLS */}
          <div className="control-panel mouth-panel">
            <h3>👄 Mouth (Slider Controls)</h3>
            <div className="slider-row">
              <label>Width:</label>
              <input type="range" min="5" max="150" value={mouthScale} onChange={(e) => setMouthScale(Number(e.target.value))} />
              <span>{mouthScale}px</span>
            </div>
            <div className="slider-row">
              <label>Height Ratio:</label>
              <input type="range" min="0.2" max="1" step="0.05" value={mouthAspectRatio} onChange={(e) => setMouthAspectRatio(Number(e.target.value))} />
              <span>{mouthAspectRatio.toFixed(2)}</span>
            </div>
            <div className="slider-row">
              <label>Y Position:</label>
              <input type="range" min="-100" max="200" value={mouthY} onChange={(e) => setMouthY(Number(e.target.value))} />
              <span>{mouthY}px</span>
            </div>
            <div className="slider-row">
              <label>X Offset:</label>
              <input type="range" min="-100" max="100" value={mouthX} onChange={(e) => setMouthX(Number(e.target.value))} />
              <span>{mouthX}px</span>
            </div>
            <div className="slider-row">
              <label>Rotation:</label>
              <input type="range" min="-45" max="45" value={mouthRotation} onChange={(e) => setMouthRotation(Number(e.target.value))} />
              <span>{mouthRotation}°</span>
            </div>
            <div className="pose-buttons">
              <button className={`test-btn ${isTalking ? 'active' : ''}`} onClick={() => setIsTalking(true)}>▶ Start</button>
              <button className="test-btn" onClick={() => setIsTalking(false)}>⏹ Stop</button>
            </div>
            <div className="slider-row" style={{ marginTop: '10px' }}>
              <label>Speed:</label>
              <input type="range" min="100" max="600" value={talkSpeed} onChange={(e) => setTalkSpeed(Number(e.target.value))} />
              <span>{talkSpeed}ms</span>
            </div>
            <div className="mouth-frame-indicator">
              Current: <strong>{currentMouth.label}</strong>
            </div>
          </div>
        </div>

        {/* Save Presets */}
        <div className="presets-section">
          <h3>💾 Saved Presets</h3>
          
          {savedPresets.length > 0 ? (
            <div className="presets-list">
              {savedPresets.map(preset => (
                <div key={preset.id} className="preset-item">
                  <div className="preset-info">
                    <strong>{preset.name}</strong>
                    <span className="preset-detail">
                      Body: {preset.body} | Face: {preset.face}
                    </span>
                  </div>
                  <div className="preset-actions">
                    <button className="test-btn" onClick={() => handleLoadPreset(preset)}>📂 Load</button>
                    <button className="test-btn delete-btn" onClick={() => handleDeletePreset(preset.id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-presets">No presets saved yet. Find a good position and save it!</p>
          )}

          {showSaveDialog ? (
            <div className="save-dialog">
              <input 
                type="text" 
                placeholder="Preset name (e.g., Body01-Neutral)" 
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="preset-input"
                autoFocus
              />
              <div className="preset-dialog-buttons">
                <button className="test-btn" onClick={handleSavePreset}>✅ Save</button>
                <button className="test-btn" onClick={() => setShowSaveDialog(false)}>❌ Cancel</button>
              </div>
            </div>
          ) : (
            <button className="save-preset-btn" onClick={() => setShowSaveDialog(true)}>
              💾 Save Current Position
            </button>
          )}
        </div>

        {/* Current values */}
        <div className="test-status">
          <h3>📋 Current Values</h3>
          <pre className="values-display">
{`Body: { width: ${bodyScale}, x: ${Math.round(bodyX)}, y: ${Math.round(bodyY)}, rotation: ${bodyRotation} }
Head: { width: ${headScale}, x: ${Math.round(headX)}, y: ${Math.round(headY)}, rotation: ${headRotation} }
Mouth: { width: ${mouthScale}, x: ${Math.round(mouthX)}, y: ${Math.round(mouthY)}, rotation: ${mouthRotation}, ratio: ${mouthAspectRatio.toFixed(2)} }
Frame: ${currentMouth.label}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default KopanangTest;