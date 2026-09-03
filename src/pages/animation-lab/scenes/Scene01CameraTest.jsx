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

// Camera dolly range — NO COLLISION, camera passes through
const CAMERA_DOLLY = {
  startZ: 0,      // Far back — all layers visible
  endZ: 100,      // Deep in the forest — near layers passed
};

function Scene01CameraTest() {
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    z: CAMERA_DOLLY.startZ,
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

  // FIXED: Camera passes through layers — no Math.max wall
  const getLayerTransform = useCallback((layer) => {
    // Each layer's z-distance from camera
    // When camera.z > layer depth, camera has PASSED that layer
    const layerZPosition = layer.depth * 100;
    const cameraPassed = camera.z > layerZPosition;
    
    // If camera has passed the layer, push it far away and behind
    let effectiveZ;
    if (cameraPassed) {
      // Layer is now BEHIND the camera — push it away and fade out
      const passedDistance = camera.z - layerZPosition;
      effectiveZ = -passedDistance * 5; // Negative Z = behind camera
    } else {
      // Layer is still ahead — normal depth
      effectiveZ = layerZPosition - camera.z;
    }
    
    // Perspective scale — closer = bigger
    const scale = (100 / Math.max(effectiveZ, 1)) * layer.baseScale;
    
    // Parallax offset
    const parallaxX = camera.x * (100 / Math.max(effectiveZ, 1));
    const parallaxY = camera.y * (100 / Math.max(effectiveZ, 1));
    
    // Floor drop for clearing
    const forwardProgress = camera.z / CAMERA_DOLLY.endZ;
    const clearingDrop = layer.id === 'clearing' ? forwardProgress * layer.floorDropY : 0;
    
    // Opacity fade when passed
    const opacity = cameraPassed ? Math.max(0, 1 - (camera.z - layerZPosition) / 30) : 1;
    
    return {
      transform: `translate(${parallaxX}px, ${parallaxY + clearingDrop}px) scale(${scale})`,
      opacity: opacity,
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

  // Keyboard movement — continuous dolly, no collision
  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = cameraSpeed;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, z: Math.min(prev.z + speed, CAMERA_DOLLY.endZ) }));
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, z: Math.max(prev.z - speed, CAMERA_DOLLY.startZ) }));
      }
      if (keysPressed.current['a']) {
        setCamera(prev => ({ ...prev, x: prev.x - speed * 0.5 }));
      }
      if (keysPressed.current['d']) {
        setCamera(prev => ({ ...prev, x: prev.x + speed * 0.5 }));
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

  // Auto cinematic dolly
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    const duration = 14000; // 14 seconds
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Smooth cinematic easing
      const eased = rawProgress < 0.3
        ? 0.5 * (rawProgress / 0.3) * (rawProgress / 0.3)
        : rawProgress > 0.7
          ? 1 - 0.5 * ((1 - rawProgress) / 0.3) * ((1 - rawProgress) / 0.3)
          : rawProgress;
      
      const newZ = CAMERA_DOLLY.startZ + eased * (CAMERA_DOLLY.endZ - CAMERA_DOLLY.startZ);
      
      setCamera(prev => ({
        ...prev,
        z: newZ,
        x: Math.sin(eased * Math.PI) * 10, // Subtle sway
        y: Math.sin(eased * Math.PI * 2) * 3, // Slight vertical drift
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
                      <span>Camera Z: {camera.z.toFixed(1)}</span>
                      <span>{camera.z > layer.depth * 100 ? 'PASSED' : 'AHEAD'}</span>
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
            <div className="camera-stat">
              <label>Progress:</label>
              <span>{((camera.z / CAMERA_DOLLY.endZ) * 100).toFixed(0)}%</span>
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