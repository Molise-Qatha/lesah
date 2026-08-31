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

// Import 2-frame walking sprites
import walkFrame1 from '../../assets/kopanang_walk/kopanang_walk_1.png';
import walkFrame2 from '../../assets/kopanang_walk/kopanang_walk_2.png';

const WALK_FRAMES = [
  { id: 'walk1', src: walkFrame1 },
  { id: 'walk2', src: walkFrame2 },
];

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
  const [selectedBody, setSelectedBody] = useState('body01');
  const [selectedFace, setSelectedFace] = useState('neutral');
  const [isTalking, setIsTalking] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [currentWalkFrame, setCurrentWalkFrame] = useState(0);
  const [talkSpeed, setTalkSpeed] = useState(250);
  const [walkSpeed, setWalkSpeed] = useState(300);

  const [bodyScale, setBodyScale] = useState(200);
  const [bodyRotation, setBodyRotation] = useState(0);
  const [bodyX, setBodyX] = useState(0);
  const [bodyY, setBodyY] = useState(0);

  const [headScale, setHeadScale] = useState(60);
  const [headX, setHeadX] = useState(0);
  const [headY, setHeadY] = useState(20);
  const [headRotation, setHeadRotation] = useState(0);

  const [mouthScale, setMouthScale] = useState(30);
  const [mouthX, setMouthX] = useState(0);
  const [mouthY, setMouthY] = useState(45);
  const [mouthRotation, setMouthRotation] = useState(0);
  const [mouthAspectRatio, setMouthAspectRatio] = useState(0.4);

  const [walkScale, setWalkScale] = useState(150);
  const [walkY, setWalkY] = useState(50);
  const [walkX, setWalkX] = useState(0);
  const [walkHeightRatio, setWalkHeightRatio] = useState(1.8);

  const [savedPresets, setSavedPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kopanang_presets') || '[]');
    } catch { return []; }
  });
  const [presetName, setPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const [draggingLayer, setDraggingLayer] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const mouthTimerRef = useRef(null);
  const walkTimerRef = useRef(null);

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

  useEffect(() => {
    if (isWalking) {
      walkTimerRef.current = setInterval(() => {
        setCurrentWalkFrame(prev => (prev + 1) % WALK_FRAMES.length);
      }, walkSpeed);
    }
    return () => {
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
    };
  }, [isWalking, walkSpeed]);

  const handleMouseDown = (e, layer) => {
    if (layer === 'mouth') return;
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
      mouthAspectRatio,
      walkScale,
      walkX: Math.round(walkX),
      walkY: Math.round(walkY),
      walkHeightRatio,
    };
    
    const updated = [...savedPresets, preset];
    setSavedPresets(updated);
    localStorage.setItem('kopanang_presets', JSON.stringify(updated));
    setPresetName('');
    setShowSaveDialog(false);
  };

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
    if (preset.walkScale) setWalkScale(preset.walkScale);
    if (preset.walkX !== undefined) setWalkX(preset.walkX);
    if (preset.walkY !== undefined) setWalkY(preset.walkY);
    if (preset.walkHeightRatio) setWalkHeightRatio(preset.walkHeightRatio);
  };

  const handleDeletePreset = (presetId) => {
    const updated = savedPresets.filter(p => p.id !== presetId);
    setSavedPresets(updated);
    localStorage.setItem('kopanang_presets', JSON.stringify(updated));
  };

  const currentBody = BODY_OPTIONS.find(b => b.id === selectedBody);
  const currentFace = FACE_OPTIONS.find(f => f.id === selectedFace);
  const currentMouth = MOUTH_FRAMES[currentMouthIndex];
  const currentWalk = WALK_FRAMES[currentWalkFrame];

  return (
    <div className="kopanang-test-page">
      <div className="kopanang-test-container">
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="test-header">
          <h1>🧪 Kopanang Animation Tool</h1>
          <p className="test-subtitle">Talking + Walking + Expressions</p>
          <span className="test-badge">DEVELOPER TOOL</span>
        </div>

        <div className="main-layout">
          {/* LEFT: Stage */}
          <div className="stage-container">
            <div 
              className="test-stage" 
              ref={stageRef}
              style={{ cursor: draggingLayer ? 'grabbing' : 'default' }}
            >
              <div className="character-canvas" style={{ width: `${bodyScale}px`, position: 'relative' }}>
                {/* Walking — FIXED container size prevents bouncing */}
                {isWalking ? (
                  <div
                    style={{
                      width: `${walkScale}px`,
                      height: `${walkScale * walkHeightRatio}px`,
                      position: 'relative',
                      top: `${walkY}px`,
                      left: `${walkX}px`,
                      zIndex: 1,
                      pointerEvents: 'none',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={currentWalk.src}
                      alt={`Walking ${currentWalkFrame + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Static Body */}
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

                    {/* Face */}
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

                    {/* Mouth */}
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
                  </>
                )}
              </div>
            </div>

            <div className="drag-hint">
              💡 <strong>DRAG:</strong> Body & Head | <strong>SLIDERS:</strong> Mouth & Walk
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div className="controls-container">
            <div className="layer-controls">
              {/* Walk Panel */}
              <div className="control-panel walk-panel">
                <h3>🚶 Walking (2 Frames)</h3>
                <div className="pose-buttons">
                  <button className={`test-btn ${isWalking ? 'active' : ''}`} onClick={() => setIsWalking(true)}>▶ Start</button>
                  <button className="test-btn" onClick={() => setIsWalking(false)}>⏹ Stop</button>
                </div>
                <div className="slider-row" style={{ marginTop: '8px' }}>
                  <label>Speed:</label>
                  <input type="range" min="100" max="800" value={walkSpeed} onChange={(e) => setWalkSpeed(Number(e.target.value))} />
                  <span>{walkSpeed}ms</span>
                </div>
                <div className="slider-row">
                  <label>Scale:</label>
                  <input type="range" min="50" max="300" value={walkScale} onChange={(e) => setWalkScale(Number(e.target.value))} />
                  <span>{walkScale}px</span>
                </div>
                <div className="slider-row">
                  <label>Height Ratio:</label>
                  <input type="range" min="1" max="3" step="0.1" value={walkHeightRatio} onChange={(e) => setWalkHeightRatio(Number(e.target.value))} />
                  <span>{walkHeightRatio.toFixed(1)}</span>
                </div>
                <div className="slider-row">
                  <label>Y Position:</label>
                  <input type="range" min="-200" max="300" value={walkY} onChange={(e) => setWalkY(Number(e.target.value))} />
                  <span>{walkY}px</span>
                </div>
                <div className="slider-row">
                  <label>X Offset:</label>
                  <input type="range" min="-200" max="200" value={walkX} onChange={(e) => setWalkX(Number(e.target.value))} />
                  <span>{walkX}px</span>
                </div>
                <div className="mouth-frame-indicator">
                  Frame: <strong>{currentWalkFrame + 1}/2</strong>
                </div>
              </div>

              {/* Body Panel */}
              <div className="control-panel body-panel">
                <h3>🧍 Body</h3>
                <div className="slider-row">
                  <label>Width:</label>
                  <input type="range" min="50" max="400" value={bodyScale} onChange={(e) => setBodyScale(Number(e.target.value))} />
                  <span>{bodyScale}px</span>
                </div>
                <div className="pose-buttons">
                  {BODY_OPTIONS.map(body => (
                    <button key={body.id} className={`test-btn ${selectedBody === body.id ? 'active' : ''}`} onClick={() => setSelectedBody(body.id)}>
                      {body.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Head Panel */}
              <div className="control-panel head-panel">
                <h3>👤 Head</h3>
                <div className="slider-row">
                  <label>Width:</label>
                  <input type="range" min="20" max="200" value={headScale} onChange={(e) => setHeadScale(Number(e.target.value))} />
                  <span>{headScale}px</span>
                </div>
                <div className="pose-buttons">
                  {FACE_OPTIONS.map(face => (
                    <button key={face.id} className={`test-btn ${selectedFace === face.id ? 'active' : ''}`} onClick={() => setSelectedFace(face.id)}>
                      {face.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mouth Panel */}
              <div className="control-panel mouth-panel">
                <h3>👄 Mouth</h3>
                <div className="pose-buttons">
                  <button className={`test-btn ${isTalking ? 'active' : ''}`} onClick={() => setIsTalking(true)}>▶ Start</button>
                  <button className="test-btn" onClick={() => setIsTalking(false)}>⏹ Stop</button>
                </div>
                <div className="slider-row" style={{ marginTop: '6px' }}>
                  <label>Width:</label>
                  <input type="range" min="5" max="150" value={mouthScale} onChange={(e) => setMouthScale(Number(e.target.value))} />
                  <span>{mouthScale}px</span>
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
                <div className="slider-row">
                  <label>Speed:</label>
                  <input type="range" min="100" max="600" value={talkSpeed} onChange={(e) => setTalkSpeed(Number(e.target.value))} />
                  <span>{talkSpeed}ms</span>
                </div>
                <div className="mouth-frame-indicator">
                  Frame: <strong>{currentMouth.label}</strong>
                </div>
              </div>
            </div>

            {/* Save Presets */}
            <div className="presets-section">
              <h3>💾 Presets</h3>
              
              {savedPresets.length > 0 ? (
                <div className="presets-list">
                  {savedPresets.map(preset => (
                    <div key={preset.id} className="preset-item">
                      <div className="preset-info">
                        <strong>{preset.name}</strong>
                        <span className="preset-detail">{preset.body} | {preset.face}</span>
                      </div>
                      <div className="preset-actions">
                        <button className="test-btn" onClick={() => handleLoadPreset(preset)}>Load</button>
                        <button className="test-btn delete-btn" onClick={() => handleDeletePreset(preset.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-presets">No presets saved.</p>
              )}

              {showSaveDialog ? (
                <div className="save-dialog">
                  <input 
                    type="text" 
                    placeholder="Preset name" 
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
                  💾 Save Position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KopanangTest;