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
  { id: 'sky', name: 'Sky', src: skyImg, depth: 0.05, zIndex: 1, visible: true },
  { id: 'mountains', name: 'Mountains', src: mountainsImg, depth: 0.1, zIndex: 2, visible: true },
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, depth: 0.2, zIndex: 3, visible: true },
  { id: 'clearing', name: 'Clearing', src: clearingImg, depth: 0.4, zIndex: 4, visible: true, isGround: true },
  { id: 'landmark_tree', name: 'Landmark Tree', src: landmarkImg, depth: 0.65, zIndex: 5, visible: true },
  { id: 'near_tree_01', name: 'Near Tree 01', src: nearTree01Img, depth: 0.85, zIndex: 6, visible: true },
  { id: 'near_tree_02', name: 'Near Tree 02', src: nearTree02Img, depth: 1.0, zIndex: 7, visible: true },
];

const CAMERA_PATH = {
  startForward: 0,
  endForward: 85,
  duration: 14000,
  easeInDuration: 0.20,
  easeOutDuration: 0.35,
};

function Scene01CameraTest() {
  // 🛠️ MANUAL LAYER SETTINGS: Everyone starts at X=0, Y=0, Scale=1
  const [layerPositions, setLayerPositions] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: { x: 0, y: 0, scale: 1 } }), {})
  );

  const [camera, setCamera] = useState({ forward: CAMERA_PATH.startForward, x: 0, y: 0 });
  const [debugMode, setDebugMode] = useState(true); // Start in Debug mode so you can edit!
  const [autoPlay, setAutoPlay] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  
  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});
  const autoPlayStartTime = useRef(null);
  const autoPlayFrameRef = useRef(null);

  // ------------------------------------------------------------------
  // 🛠️ CORE MATH: Automatically calculates how much layers should move 
  // based on their depth, PLUS adds your manual offsets.
  // ------------------------------------------------------------------
  const getLayerTransform = useCallback((layer) => {
    const depthFactor = layer.depth;
    const manualPos = layerPositions[layer.id];

    // Camera parallax (from camera movement)
    const cameraX = camera.x * depthFactor;
    const cameraY = camera.y * depthFactor * 0.5;

    // The "Forward" push
    const forwardProgress = camera.forward / 100;
    const forwardOffset = forwardProgress * depthFactor * 2;

    // 🛠️ FINAL LAYER POSITION = Manual X/Y/Scale + Camera Parallax
    const finalX = manualPos.x + cameraX - forwardOffset;
    const finalY = manualPos.y + cameraY;
    const finalScale = manualPos.scale;

    // For the ground, we push it down so it can act like a flat floor
    let groundOffset = 0;
    if (layer.isGround) {
      groundOffset = forwardProgress * 300; // Flat drop
    }

    return {
      transform: `translate(${finalX}px, ${finalY + groundOffset}px) scale(${finalScale})`,
      opacity: 1,
      transformOrigin: 'center center',
    };
  }, [camera, layerPositions]);

  // 🛠️ Handler to update a specific layer's position
  const updateLayerPosition = (layerId, axis, value) => {
    setLayerPositions(prev => ({
      ...prev,
      [layerId]: { ...prev[layerId], [axis]: value }
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

  // Manual forward movement
  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.4 * cameraSpeed;
      if (keysPressed.current['w']) setCamera(prev => ({ ...prev, forward: Math.min(prev.forward + speed, 100) }));
      if (keysPressed.current['s']) setCamera(prev => ({ ...prev, forward: Math.max(prev.forward - speed, 0) }));
      if (keysPressed.current['a']) setCamera(prev => ({ ...prev, x: prev.x - speed }));
      if (keysPressed.current['d']) setCamera(prev => ({ ...prev, x: prev.x + speed }));
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [cameraSpeed]);

  // Cinematic Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    autoPlayStartTime.current = Date.now();
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / CAMERA_PATH.duration, 1);
      
      const clampedT = Math.max(0, Math.min(1, rawProgress));
      const eased = clampedT < CAMERA_PATH.easeInDuration 
        ? 0.5 * (clampedT / CAMERA_PATH.easeInDuration) * (clampedT / CAMERA_PATH.easeInDuration)
        : clampedT > 1 - CAMERA_PATH.easeOutDuration
          ? 1 - 0.5 * (1 - (clampedT - (1 - CAMERA_PATH.easeOutDuration)) / CAMERA_PATH.easeOutDuration) * (1 - (clampedT - (1 - CAMERA_PATH.easeOutDuration)) / CAMERA_PATH.easeOutDuration)
          : clampedT;
      
      setCamera(prev => ({ 
        ...prev, 
        forward: CAMERA_PATH.startForward + (CAMERA_PATH.endForward - CAMERA_PATH.startForward) * eased 
      }));
      
      if (rawProgress < 1) autoPlayFrameRef.current = requestAnimationFrame(animateCamera);
      else setAutoPlay(false);
    };
    autoPlayFrameRef.current = requestAnimationFrame(animateCamera);
    return () => { if (autoPlayFrameRef.current) cancelAnimationFrame(autoPlayFrameRef.current); };
  }, [autoPlay]);

  const resetCamera = () => {
    setCamera({ forward: CAMERA_PATH.startForward, x: 0, y: 0 });
  };

  const toggleLayer = (layerId) => {
    setLayerVisibility(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  // We need this! (I forgot to declare it above)
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {})
  );

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
        <div className="scene-viewport" style={{ cursor: debugMode ? 'grab' : 'default' }}>
          <div className="scene-stage">
            {SCENE_LAYERS.map(layer => (
              layerVisibility[layer.id] && (
                <div
                  key={layer.id}
                  className="scene-layer"
                  style={{ zIndex: layer.zIndex, ...getLayerTransform(layer) }}
                >
                  <img src={layer.src} alt={layer.name} className="scene-layer-img" draggable={false} />
                </div>
              )
            ))}
          </div>
        </div>

        {/* Camera Controls */}
        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Layer Editor</h3>
            <button className={`debug-toggle ${debugMode ? 'active' : ''}`} onClick={() => setDebugMode(!debugMode)}>
              🐛 Edit Mode
            </button>
          </div>

          {/* 🛠️ LAYER EDITOR: Drag to change specific layer positions */}
          {debugMode && (
            <div className="layer-editor">
              {SCENE_LAYERS.map(layer => (
                <div key={layer.id} className="layer-editor-item">
                  <strong>{layer.name}</strong>
                  <label>X: <input type="range" min="-500" max="500" value={layerPositions[layer.id].x} onChange={(e) => updateLayerPosition(layer.id, 'x', Number(e.target.value))} /></label>
                  <label>Y: <input type="range" min="-300" max="500" value={layerPositions[layer.id].y} onChange={(e) => updateLayerPosition(layer.id, 'y', Number(e.target.value))} /></label>
                  <label>Scale: <input type="range" min="0.5" max="3" step="0.1" value={layerPositions[layer.id].scale} onChange={(e) => updateLayerPosition(layer.id, 'scale', Number(e.target.value))} /></label>
                </div>
              ))}
            </div>
          )}

          {!debugMode && (
            <>
              <div className="camera-info">
                <div className="camera-stat">
                  <label>Forward:</label>
                  <span>{camera.forward.toFixed(1)}</span>
                </div>
                <div className="camera-stat">
                  <label>X:</label>
                  <span>{camera.x.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="camera-buttons">
                <button className={`camera-btn ${autoPlay ? 'active' : ''}`} onClick={() => { setAutoPlay(!autoPlay); if (!autoPlay) resetCamera(); }}>
                  {autoPlay ? '⏸ Stop Auto' : '▶ Play Cinematic'}
                </button>
                <button className="camera-btn" onClick={resetCamera}>🔄 Reset</button>
              </div>

              <div className="slider-row">
                <label>Speed:</label>
                <input type="range" min="0.1" max="3" step="0.1" value={cameraSpeed} onChange={(e) => setCameraSpeed(Number(e.target.value))} />
                <span>{cameraSpeed}x</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scene01CameraTest;