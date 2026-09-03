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

// --- LAYERS: DO NOT CHANGE ---
const SCENE_LAYERS = [
  { id: 'sky', name: 'Sky', src: skyImg, zIndex: 1, visible: true, depth: 0.05, baseScale: 1.0 },
  { id: 'mountains', name: 'Mountains', src: mountainsImg, zIndex: 2, visible: true, depth: 0.1, baseScale: 1.0 },
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, zIndex: 3, visible: true, depth: 0.2, baseScale: 1.0 },
  { id: 'clearing', name: 'Clearing', src: clearingImg, zIndex: 4, visible: true, depth: 0.4, baseScale: 1.0, floorDropY: 400 },
  { id: 'landmark_tree', name: 'Landmark Tree', src: landmarkImg, zIndex: 5, visible: true, depth: 0.65, baseScale: 1.0 },
  { id: 'near_tree_01', name: 'Near Tree 01', src: nearTree01Img, zIndex: 6, visible: true, depth: 0.85, baseScale: 1.15 },
  { id: 'near_tree_02', name: 'Near Tree 02', src: nearTree02Img, zIndex: 7, visible: true, depth: 1.0, baseScale: 1.25 },
];

// 🛠️ CAMERA DOLLY PARAMETERS (This is the magic)
const CAMERA_DOLLY = {
  startZ: 100, // Distance from the scene (far back)
  endZ: 0,     // Distance when inside the character area
};

function Scene01CameraTest() {
  // 🛠️ Our camera has: X (Left/Right), Y (Up/Down), and **Z** (Forward/Backward)
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    z: CAMERA_DOLLY.startZ, // Start at the back
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

  // 🛠️ Perspective Projection (Closer layers appear bigger, farther layers appear smaller)
  const getLayerTransform = useCallback((layer) => {
    const relativeDistance = layer.depth * 100; // How far is this layer from the camera's 0 point?
    const layerZ = Math.max(relativeDistance - camera.z, 10); // Can't go below 10 units away

    // Perspective scaling: 100 / layerZ
    const scale = (100 / layerZ) * layer.baseScale;

    // Parallax x and y offset (moves slightly slower for distant layers)
    const parallaxX = camera.x * (100 / layerZ);
    const parallaxY = camera.y * (100 / layerZ);
    
    // Flat floor handling (Clearing slides down as camera moves forward)
    const forwardProgress = 1 - (camera.z / CAMERA_DOLLY.startZ);
    const clearingDrop = layer.id === 'clearing' ? forwardProgress * 400 : 0;

    return {
      transform: `translate(${parallaxX}px, ${parallaxY + clearingDrop}px) scale(${scale})`,
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

  // 🛠️ KEYBOARD MOVEMENT: W/S controls Z-Axis, A/D controls X-Axis
  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = cameraSpeed;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, z: Math.max(prev.z - speed, CAMERA_DOLLY.endZ) })); // Move Forward
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, z: Math.min(prev.z + speed, CAMERA_DOLLY.startZ) })); // Move Backward
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

  // 🛠️ AUTO CINEMATIC: Smoothly moves Z from 100 to 0 (The Dolly)
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    const duration = 12000;
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Smooth easing (starts slow, speeds up, ends slow)
      const eased = rawProgress < 0.5 
        ? 2 * rawProgress * rawProgress 
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
      
      const newZ = CAMERA_DOLLY.startZ - (eased * (CAMERA_DOLLY.startZ - CAMERA_DOLLY.endZ));
      
      setCamera(prev => ({ ...prev, z: newZ, x: Math.sin(eased * Math.PI) * 15 }));
      
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
    setCamera({ x: 0, y: 0, z: CAMERA_DOLLY.startZ });
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
          <p className="scene-subtitle">Dolly Camera — Forest Opening Shot</p>
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
                      <span>Depth: {layer.depth}</span>
                      <span>Z-Dist: {Math.max(layer.depth * 100 - camera.z, 10).toFixed(0)}</span>
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
              <label>X (Left/Right):</label>
              <span>{camera.x.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>Z (Forward/Back):</label>
              <span>{camera.z.toFixed(1)}</span>
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
              min="0.5" 
              max="3" 
              step="0.1" 
              value={cameraSpeed} 
              onChange={(e) => setCameraSpeed(Number(e.target.value))} 
            />
            <span>{cameraSpeed}x</span>
          </div>
          
          <div className="keyboard-hints">
            <p><kbd>W</kbd> Forward (Dolly)</p>
            <p><kbd>S</kbd> Backward (Dolly)</p>
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
                  <span className="depth-value">({layer.depth})</span>
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