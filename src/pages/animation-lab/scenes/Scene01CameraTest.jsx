import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Scene01CameraTest.css';

// Import scene assets
import skyImg from '../../../assets/scene01/scene01_sky.png';
import mountainsImg from '../../../assets/scene01/scene01_distant_mountains.png';
import forestImg from '../../../assets/scene01/scene01_distant_forest.png';
import clearingImg from '../../../assets/scene01/scene01_clearing.png';
import landmarkImg from '../../../assets/scene01/scene01_tree_landmark.png';
import nearTree01Img from '../../../assets/scene01/scene01_tree_near_01.png';
import nearTree02Img from '../../../assets/scene01/scene01_tree_near_02.png';

const SCENE_LAYERS = [
  { id: 'sky', name: 'Sky', src: skyImg, depth: 0.05, zIndex: 1, defaultVisible: true },
  { id: 'mountains', name: 'Distant Mountains', src: mountainsImg, depth: 0.1, zIndex: 2, defaultVisible: true },
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, depth: 0.2, zIndex: 3, defaultVisible: false },
  { id: 'clearing', name: 'Clearing', src: clearingImg, depth: 0.4, zIndex: 4, defaultVisible: false, isGround: true },
  { id: 'landmark_tree', name: 'Landmark Tree', src: landmarkImg, depth: 0.65, zIndex: 5, defaultVisible: false },
  { id: 'near_tree_01', name: 'Near Tree 01', src: nearTree01Img, depth: 0.85, zIndex: 6, defaultVisible: false },
  { id: 'near_tree_02', name: 'Near Tree 02', src: nearTree02Img, depth: 1.0, zIndex: 7, defaultVisible: false },
];

function Scene01CameraTest() {
  // 🛠️ MANUAL CAMERA STATE: Just X, Y, and Forward
  const [camera, setCamera] = useState({ x: 0, y: 0, forward: 0 });

  // 🛠️ LAYER SETTINGS: Individual X, Y, Scale for every layer
  const [layerPositions, setLayerPositions] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: { x: 0, y: 0, scale: 1 } }), {})
  );

  // 🛠️ Asset visibility state
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layer.defaultVisible }), {})
  );

  const [debugMode, setDebugMode] = useState(true);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  const [linkScale, setLinkScale] = useState(false);
  
  // 🛠️ NEW: Unlimited Mode
  const [unlimitedMode, setUnlimitedMode] = useState(false);

  // 🛠️ NEW: Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const sceneViewportRef = useRef(null);
  const streamRef = useRef(null);

  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});

  // 🛠️ NEW: Range limits based on mode
  const rangeLimits = unlimitedMode ? {
    cameraX: 10000,
    cameraY: 10000,
    forward: 5000,
    layerX: 10000,
    layerY: 10000,
    scale: 100
  } : {
    cameraX: 200,
    cameraY: 200,
    forward: 100,
    layerX: 500,
    layerY: 300,
    scale: 4
  };

  // 🛠️ CORE MATH: User controls everything
  const getLayerTransform = useCallback((layer) => {
    const depthFactor = layer.depth;
    const manualPos = layerPositions[layer.id];

    const cameraX = camera.x * depthFactor;
    const cameraY = camera.y * depthFactor * 0.5;

    const forwardProgress = camera.forward / 100;
    const forwardOffset = forwardProgress * depthFactor * 2;

    const finalX = manualPos.x + cameraX - forwardOffset;
    const finalY = manualPos.y + cameraY;
    const finalScale = manualPos.scale;

    let groundOffset = 0;
    if (layer.isGround) {
      groundOffset = forwardProgress * 300;
    }

    return {
      transform: `translate(${finalX}px, ${finalY + groundOffset}px) scale(${finalScale})`,
      opacity: 1,
      transformOrigin: 'center center',
    };
  }, [camera, layerPositions]);

  const updateLayerPosition = (layerId, axis, value) => {
    if (linkScale && axis === 'scale' && (layerId === 'mountains' || layerId === 'distant_forest')) {
      setLayerPositions(prev => ({
        ...prev,
        mountains: { ...prev.mountains, scale: value },
        distant_forest: { ...prev.distant_forest, scale: value },
      }));
    } else {
      setLayerPositions(prev => ({
        ...prev,
        [layerId]: { ...prev[layerId], [axis]: value }
      }));
    }
  };

  // 🛠️ Toggle asset visibility
  const toggleLayerVisibility = (layerId) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleKeyDown = useCallback((e) => {
    keysPressed.current[e.key.toLowerCase()] = true;
    if (e.key === 'ArrowUp') keysPressed.current['w'] = true;
    if (e.key === 'ArrowDown') keysPressed.current['s'] = true;
    if (e.key === 'ArrowLeft') keysPressed.current['a'] = true;
    if (e.key === 'ArrowRight') keysPressed.current['d'] = true;
  }, []);

  const handleKeyUp = useCallback((e) => {
    keysPressed.current[e.key.toLowerCase()] = false;
    if (e.key === 'ArrowUp') keysPressed.current['w'] = false;
    if (e.key === 'ArrowDown') keysPressed.current['s'] = false;
    if (e.key === 'ArrowLeft') keysPressed.current['a'] = false;
    if (e.key === 'ArrowRight') keysPressed.current['d'] = false;
  }, []);

  // Manual movement loop
  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.4 * cameraSpeed;
      
      // 🛠️ NEW: In unlimited mode, movement goes to infinity
      if (unlimitedMode) {
        if (keysPressed.current['w']) setCamera(prev => ({ ...prev, forward: prev.forward + speed }));
        if (keysPressed.current['s']) setCamera(prev => ({ ...prev, forward: prev.forward - speed }));
        if (keysPressed.current['a']) setCamera(prev => ({ ...prev, x: prev.x - speed }));
        if (keysPressed.current['d']) setCamera(prev => ({ ...prev, x: prev.x + speed }));
      } else {
        // Limited mode - keep within bounds
        if (keysPressed.current['w']) setCamera(prev => ({ ...prev, forward: Math.min(prev.forward + speed, rangeLimits.forward) }));
        if (keysPressed.current['s']) setCamera(prev => ({ ...prev, forward: Math.max(prev.forward - speed, -rangeLimits.forward) }));
        if (keysPressed.current['a']) setCamera(prev => ({ ...prev, x: Math.min(prev.x - speed, -rangeLimits.cameraX) }));
        if (keysPressed.current['d']) setCamera(prev => ({ ...prev, x: Math.min(prev.x + speed, rangeLimits.cameraX) }));
      }
      
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [cameraSpeed, unlimitedMode, rangeLimits]);

  const resetCamera = () => {
    setCamera({ x: 0, y: 0, forward: 0 });
    setLayerPositions(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: { x: 0, y: 0, scale: 1 } }), {})
    );
    // Reset visibility to defaults
    setLayerVisibility(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layer.defaultVisible }), {})
    );
  };

  // 🛠️ Show only specific layers (quick presets)
  const showOnly = (layerIds) => {
    setLayerVisibility(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layerIds.includes(layer.id) }), {})
    );
  };

  // 🛠️ NEW: Recording Functions
  const startRecording = async () => {
    try {
      const viewport = sceneViewportRef.current;
      if (!viewport) return;

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: false,
        preferCurrentTab: true
      });

      // Try to capture just the viewport element
      const canvasStream = viewport.captureStream(60);
      
      streamRef.current = canvasStream;
      
      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lesah-scene01-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setRecordedChunks([]);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Stop recording when user stops sharing
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="scene01-page">
      <div className="scene01-container">
        
        {/* Scene Viewport */}
        <div className="scene-viewport" ref={sceneViewportRef}>
          <div className="scene-stage">
            {SCENE_LAYERS.map(layer => (
              layerVisibility[layer.id] && (
                <div key={layer.id} className="scene-layer" style={{ zIndex: layer.zIndex, ...getLayerTransform(layer) }}>
                  <img src={layer.src} alt={layer.name} className="scene-layer-img" draggable={false} />
                </div>
              )
            ))}
          </div>
          {/* 🛠️ NEW: Recording Indicator */}
          {isRecording && (
            <div className="recording-indicator">
              <span className="rec-dot"></span>
              REC
            </div>
          )}
        </div>

        {/* 🛠️ FULL MANUAL CONTROLS */}
        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Manual Editor</h3>
            <button className={`debug-toggle ${debugMode ? 'active' : ''}`} onClick={() => setDebugMode(!debugMode)}>
              🐛 Toggle Controls
            </button>
          </div>

          {/* 🛠️ NEW: Unlimited Mode Toggle + Record Button */}
          <div className="unlimited-mode-section">
            <div className="unlimited-mode-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={unlimitedMode} 
                  onChange={() => setUnlimitedMode(!unlimitedMode)}
                />
                <span className="unlimited-label">🔓 Unlimited Mode</span>
              </label>
              <span className="unlimited-hint">{unlimitedMode ? 'Movement is infinite' : 'Movement has limits'}</span>
            </div>

            <div className="record-section">
              {!isRecording ? (
                <button className="record-btn" onClick={startRecording}>
                  🎥 Record Scene
                </button>
              ) : (
                <button className="record-btn recording" onClick={stopRecording}>
                  ⏹️ Stop Recording
                </button>
              )}
            </div>
          </div>

          {/* 🛠️ Asset Visibility Panel */}
          <div className="asset-visibility-panel">
            <div className="asset-visibility-header">
              <strong>🎨 Asset Visibility</strong>
            </div>
            
            <div className="asset-quick-presets">
              <button onClick={() => showOnly(['sky', 'mountains'])}>🌄 Opening Shot</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest'])}>🌲 Add Forest</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest', 'clearing'])}>🏞️ Add Clearing</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest', 'clearing', 'landmark_tree'])}>🌳 Add Landmark</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest', 'clearing', 'landmark_tree', 'near_tree_01', 'near_tree_02'])}>🎬 Full Scene</button>
            </div>

            <div className="asset-list">
              {SCENE_LAYERS.map(layer => (
                <label key={layer.id} className="asset-toggle-item">
                  <input 
                    type="checkbox" 
                    checked={layerVisibility[layer.id]} 
                    onChange={() => toggleLayerVisibility(layer.id)}
                  />
                  <span className="asset-toggle-label">{layer.name}</span>
                  <span className="asset-toggle-status">
                    {layerVisibility[layer.id] ? '✅ Visible' : '👁️ Hidden'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 🛠️ Manual Camera Controls */}
          <div className="camera-stat-group">
            <strong>Camera Parallax</strong>
            <label>Camera X (Left/Right): 
              <input 
                type="range" 
                min={unlimitedMode ? -rangeLimits.cameraX : -rangeLimits.cameraX} 
                max={rangeLimits.cameraX} 
                value={camera.x} 
                onChange={(e) => setCamera(prev => ({ ...prev, x: Number(e.target.value) }))} 
              />
            </label>
            <label>Camera Y (Up/Down): 
              <input 
                type="range" 
                min={unlimitedMode ? -rangeLimits.cameraY : -rangeLimits.cameraY} 
                max={rangeLimits.cameraY} 
                value={camera.y} 
                onChange={(e) => setCamera(prev => ({ ...prev, y: Number(e.target.value) }))} 
              />
            </label>
            <label>Forward (Zoom Dolly): 
              <input 
                type="range" 
                min={unlimitedMode ? -rangeLimits.forward : 0} 
                max={rangeLimits.forward} 
                value={camera.forward} 
                onChange={(e) => setCamera(prev => ({ ...prev, forward: Number(e.target.value) }))} 
              />
            </label>
            <div className="camera-position-display">
              <span>X: {camera.x.toFixed(2)}</span>
              <span>Y: {camera.y.toFixed(2)}</span>
              <span>F: {camera.forward.toFixed(2)}</span>
            </div>
          </div>

          {/* 🛠️ Layer Editor */}
          {debugMode && (
            <div className="layer-editor">
              <div className="layer-editor-header">
                <strong>Layer Positions</strong>
                <label className="link-scale-label">
                  <input type="checkbox" checked={linkScale} onChange={() => setLinkScale(!linkScale)} />
                  Link Mountains + Forest Scale
                </label>
              </div>

              {SCENE_LAYERS.map(layer => (
                <div key={layer.id} className="layer-editor-item">
                  <strong>{layer.name}</strong>
                  <label>X: 
                    <input 
                      type="range" 
                      min={-rangeLimits.layerX} 
                      max={rangeLimits.layerX} 
                      value={layerPositions[layer.id].x} 
                      onChange={(e) => updateLayerPosition(layer.id, 'x', Number(e.target.value))} 
                    />
                  </label>
                  <label>Y: 
                    <input 
                      type="range" 
                      min={-rangeLimits.layerY} 
                      max={rangeLimits.layerY} 
                      value={layerPositions[layer.id].y} 
                      onChange={(e) => updateLayerPosition(layer.id, 'y', Number(e.target.value))} 
                    />
                  </label>
                  <label>Scale: 
                    <input 
                      type="range" 
                      min="0.1" 
                      max={rangeLimits.scale} 
                      step="0.1" 
                      value={layerPositions[layer.id].scale} 
                      onChange={(e) => updateLayerPosition(layer.id, 'scale', Number(e.target.value))} 
                    />
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="camera-buttons">
            <button className="camera-btn" onClick={resetCamera}>🔄 Reset All</button>
          </div>
          
          <div className="slider-row">
            <label>Speed:</label>
            <input type="range" min="0.1" max="10" step="0.1" value={cameraSpeed} onChange={(e) => setCameraSpeed(Number(e.target.value))} />
            <span>{cameraSpeed}x</span>
          </div>

          <div className="keyboard-hints">
            <p><kbd>W</kbd> Push Forward</p>
            <p><kbd>S</kbd> Pull Back</p>
            <p><kbd>A</kbd> Left</p>
            <p><kbd>D</kbd> Right</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scene01CameraTest;