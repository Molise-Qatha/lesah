import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Scene01CameraTest.css';

// Import scene assets
import skyImg from '../../../assets/scene01/scene01_sky.png';
import mountainsImg from '../../../assets/scene01/scene01_distant_mountains.png';
import forestImg from '../../../assets/scene01/scene01_distant_forest.png';
import clearingImg from '../../../assets/scene01/scene01_clearing.png';
import landmarkImg from '../../../assets/scene01/scene01_tree_landmark.png';
import nearTree01Img from '../../../assets/scene01/scene01_tree_near_01.png';
import nearTree02Img from '../../../assets/scene01/scene01_tree_near_02.png';

// 🛠️ PURE 3D DEPTH: No hide, no slide. Just true camera travel.
const SCENE_LAYERS = [
  { id: 'sky', name: 'Sky', src: skyImg, zIndex: 1, visible: true, zDepth: 1000, baseScale: 1.0 },
  { id: 'mountains', name: 'Mountains', src: mountainsImg, zIndex: 2, visible: true, zDepth: 800, baseScale: 1.0 },
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, zIndex: 3, visible: true, zDepth: 600, baseScale: 1.0 },
  { id: 'clearing', name: 'Clearing', src: clearingImg, zIndex: 4, visible: true, zDepth: 400, baseScale: 1.0 },
  { id: 'landmark_tree', name: 'Landmark Tree', src: landmarkImg, zIndex: 5, visible: true, zDepth: 200, baseScale: 1.0 },
  { id: 'near_tree_01', name: 'Near Tree 01', src: nearTree01Img, zIndex: 6, visible: true, zDepth: 100, baseScale: 1.15 },
  { id: 'near_tree_02', name: 'Near Tree 02', src: nearTree02Img, zIndex: 7, visible: true, zDepth: 50, baseScale: 1.25 },
];

// 🛠️ TRUE CAMERA DOLLY
const CAMERA_PATH = {
  startZ: 950, // Start far back (near the sky)
  endZ: 100,   // End deep in the forest (past the near trees)
  duration: 14000,
  easeInDuration: 0.20,
  easeOutDuration: 0.35,
};

function Scene01CameraTest() {
  // 🛠️ Camera moves along the Z axis (forward/backward)
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    z: CAMERA_PATH.startZ,
  });

  const [debugMode, setDebugMode] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {})
  );

  const [autoPlay, setAutoPlay] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  
  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});
  const autoPlayStartTime = useRef(null);
  const autoPlayFrameRef = useRef(null);

  // 🛠️ TRUE PERSPECTIVE PROJECTION
  const getLayerTransform = useCallback((layer) => {
    // Calculate the distance from the camera to the layer
    const distance = layer.zDepth - camera.z;

    // Clamp distance so layers don't go behind the camera
    const safeDistance = Math.max(distance, 10);

    // Perspective Division: 100 / distance
    // - Large distance = Tiny scale (Far away)
    // - Small distance = Huge scale (Very close)
    const perspectiveScale = 100 / safeDistance;
    const scale = perspectiveScale * layer.baseScale;

    // Parallax: Closer layers move faster sideways
    const parallaxX = camera.x * (100 / safeDistance);
    const parallaxY = camera.y * (100 / safeDistance) * 0.5;

    return {
      transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${scale})`,
      opacity: 1,
    };
  }, [camera]);

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

  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.4 * cameraSpeed;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, z: Math.max(prev.z - speed, CAMERA_PATH.endZ) }));
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, z: Math.min(prev.z + speed, CAMERA_PATH.startZ) }));
      }
      if (keysPressed.current['a']) {
        setCamera(prev => ({ ...prev, x: prev.x - speed }));
      }
      if (keysPressed.current['d']) {
        setCamera(prev => ({ ...prev, x: prev.x + speed }));
      }
      
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraSpeed]);

  // 🛠️ PLAY BUTTON: Smoothly dolly through Z-space
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / CAMERA_PATH.duration, 1);
      
      // Smooth easing
      const eased = rawProgress < 0.5 
        ? 2 * rawProgress * rawProgress 
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
      
      const newZ = CAMERA_PATH.startZ - (eased * (CAMERA_PATH.startZ - CAMERA_PATH.endZ));
      
      setCamera(prev => ({ 
        ...prev, 
        z: newZ,
        x: Math.sin(eased * Math.PI) * 10 // Slight natural sway
      }));
      
      if (rawProgress < 1) {
        autoPlayFrameRef.current = requestAnimationFrame(animateCamera);
      } else {
        setAutoPlay(false);
      }
    };
    
    autoPlayFrameRef.current = requestAnimationFrame(animateCamera);
    
    return () => {
      if (autoPlayFrameRef.current) {
        cancelAnimationFrame(autoPlayFrameRef.current);
      }
    };
  }, [autoPlay]);

  const resetCamera = () => {
    setCamera({ x: 0, y: 0, z: CAMERA_PATH.startZ });
  };

  const toggleLayer = (layerId) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

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
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="scene-header">
          <h1>🎥 Scene 01 Camera Test</h1>
          <p className="scene-subtitle">True 3D Perspective Camera — Deep Forest Dolly</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        <div className="scene-viewport">
          <div className="scene-stage">
            {SCENE_LAYERS.map(layer => (
              layerVisibility[layer.id] && (
                <div
                  key={layer.id}
                  className="scene-layer"
                  style={{
                    zIndex: layer.zIndex,
                    ...getLayerTransform(layer),
                  }}
                >
                  <img
                    src={layer.src}
                    alt={layer.name}
                    className="scene-layer-img"
                    draggable={false}
                  />
                  
                  {debugMode && (
                    <div className="layer-debug-info">
                      <span>{layer.name}</span>
                      <span>Depth: {layer.zDepth}</span>
                      <span>Dist: {Math.max(layer.zDepth - camera.z, 10).toFixed(0)}</span>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Camera Controls</h3>
            <button 
              className={`debug-toggle ${debugMode ? 'active' : ''}`}
              onClick={() => setDebugMode(!debugMode)}
            >
              🐛 Debug
            </button>
          </div>
          
          <div className="camera-info">
            <div className="camera-stat">
              <label>Z (Dolly):</label>
              <span>{camera.z.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>X (Sway):</label>
              <span>{camera.x.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>Y (Pan):</label>
              <span>{camera.y.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="camera-buttons">
            <button 
              className={`camera-btn ${autoPlay ? 'active' : ''}`}
              onClick={() => {
                setAutoPlay(!autoPlay);
                if (!autoPlay) resetCamera();
              }}
            >
              {autoPlay ? '⏸ Stop Auto' : '▶ Play Cinematic'}
            </button>
            <button className="camera-btn" onClick={resetCamera}>
              🔄 Reset
            </button>
          </div>
          
          <div className="slider-row">
            <label>Speed:</label>
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1" 
              value={cameraSpeed} 
              onChange={(e) => setCameraSpeed(Number(e.target.value))} 
            />
            <span>{cameraSpeed}x</span>
          </div>
          
          <div className="keyboard-hints">
            <p><kbd>W</kbd> Dolly Forward</p>
            <p><kbd>S</kbd> Dolly Backward</p>
            <p><kbd>A</kbd> Left</p>
            <p><kbd>D</kbd> Right</p>
          </div>
          
          {debugMode && (
            <div className="debug-layers">
              <h4>Layer Visibility</h4>
              {SCENE_LAYERS.map(layer => (
                <label key={layer.id} className="layer-toggle">
                  <input
                    type="checkbox"
                    checked={layerVisibility[layer.id]}
                    onChange={() => toggleLayer(layer.id)}
                  />
                  <span>{layerVisibility[layer.id] ? '✓' : '✗'} {layer.name}</span>
                  <span className="depth-value">({layer.zDepth})</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scene01CameraTest;