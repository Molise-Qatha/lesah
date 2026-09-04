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

// 🛠️ FINAL LAYERS: Duplicated trees, Compensatory Scaling, Flat Ground
const SCENE_LAYERS = [
  // Background (No duplicates)
  { id: 'sky', name: 'Sky', src: skyImg, zDepth: 0, baseScale: 1.0, zIndex: 1, visible: true },
  { id: 'mountains', name: 'Mountains', src: mountainsImg, zDepth: -100, baseScale: 1.5, zIndex: 2, visible: true },
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, zDepth: -200, baseScale: 2.0, zIndex: 3, visible: true },

  // 🛠️ FLAT GROUND: Rotated flat, extends deep into the background
  { id: 'clearing', name: 'Clearing', src: clearingImg, zDepth: -150, baseScale: 4.0, zIndex: 4, visible: true, isGround: true },

  // 🛠️ DUPLICATED TREES: Multiple layers for density
  { id: 'landmark_tree_a', name: 'Landmark Tree A', src: landmarkImg, zDepth: -250, baseScale: 2.8, zIndex: 5, visible: true },
  { id: 'landmark_tree_b', name: 'Landmark Tree B', src: landmarkImg, zDepth: -350, baseScale: 3.2, zIndex: 5, visible: true },
  
  { id: 'near_tree_01_a', name: 'Near Tree 01 A', src: nearTree01Img, zDepth: -450, baseScale: 3.0, zIndex: 6, visible: true },
  { id: 'near_tree_01_b', name: 'Near Tree 01 B', src: nearTree01Img, zDepth: -520, baseScale: 3.6, zIndex: 6, visible: true },
  { id: 'near_tree_01_c', name: 'Near Tree 01 C', src: nearTree01Img, zDepth: -580, baseScale: 3.8, zIndex: 6, visible: true },

  { id: 'near_tree_02_a', name: 'Near Tree 02 A', src: nearTree02Img, zDepth: -480, baseScale: 3.4, zIndex: 7, visible: true },
  { id: 'near_tree_02_b', name: 'Near Tree 02 B', src: nearTree02Img, zDepth: -550, baseScale: 3.8, zIndex: 7, visible: true },
];

const CAMERA_PATH = {
  startZ: 0,
  endZ: -600, // Travel through all the duplicated trees
  duration: 14000,
};

function Scene01CameraTest() {
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

  const getLayerTransform = useCallback((layer) => {
    const distance = layer.zDepth - camera.z;
    const safeDistance = Math.max(distance, 1);

    // Perspective
    const perspectiveScale = 100 / safeDistance;
    const scale = perspectiveScale * layer.baseScale;

    // Parallax
    const parallaxX = camera.x * perspectiveScale;
    const parallaxY = camera.y * perspectiveScale * 0.5;

    let opacity = 1;
    let blur = 0;

    // 🛠️ DISTANCE EFFECTS: Close layers blur and fade out to hide flatness
    if (distance < 80) {
      // Blur the layer (using CSS filter)
      blur = Math.max(0, (80 - distance) / 80) * 10; // 0 to 10px blur
      // Fade it out so it never looks like a solid wall
      opacity = Math.max(0, distance / 80);
    }

    // 🛠️ GROUND LAYER SPECIAL HANDLING
    if (layer.isGround) {
      // We rotate it 90 degrees on X-axis, push it down the Y-axis
      return {
        transform: `translate(${parallaxX}px, ${parallaxY + 250}px) rotateX(90deg) scale(${scale})`,
        opacity: opacity,
        filter: `blur(${blur}px)`,
      };
    }

    return {
      transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${scale})`,
      opacity: opacity,
      filter: `blur(${blur}px)`,
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
      const speed = cameraSpeed;
      
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

  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / CAMERA_PATH.duration, 1);
      
      const eased = rawProgress < 0.5 
        ? 2 * rawProgress * rawProgress 
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
      
      const newZ = CAMERA_PATH.startZ - (eased * (CAMERA_PATH.startZ - CAMERA_PATH.endZ));
      
      setCamera(prev => ({ 
        ...prev, 
        z: newZ,
        x: Math.sin(eased * Math.PI) * 10 
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

  const handleZoomIn = () => {
    setCamera(prev => ({ ...prev, z: Math.max(prev.z - 10, CAMERA_PATH.endZ) }));
  };

  const handleZoomOut = () => {
    setCamera(prev => ({ ...prev, z: Math.min(prev.z + 10, CAMERA_PATH.startZ) }));
  };

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
          <p className="scene-subtitle">True 3D Environment Camera — Forest Fly-Through</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        {/* 🛠️ FINAL: Side-by-side layout */}
        <div className="scene-layout">
          {/* MAIN SCENE (Left) */}
          <div className="scene-viewport" style={{ backgroundColor: '#D2B48C' }}>
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
                      style={{ transform: layer.isGround ? 'rotateX(90deg)' : 'none' }}
                    />
                    
                    {debugMode && (
                      <div className="layer-debug-info">
                        <span>{layer.name}</span>
                        <span>Z-Depth: {layer.zDepth}</span>
                        <span>Camera Z: {camera.z.toFixed(0)}</span>
                        <span>Dist: {Math.max(layer.zDepth - camera.z, 1).toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>

          {/* CAMERA CONTROLS (Right Panel) */}
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
                <label>Z-Dolly:</label>
                <span>{camera.z.toFixed(1)}</span>
              </div>
              <div className="camera-stat">
                <label>X-Sway:</label>
                <span>{camera.x.toFixed(1)}</span>
              </div>
              <div className="camera-stat">
                <label>Y-Pan:</label>
                <span>{camera.y.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Zoom Controls */}
            <div className="camera-buttons">
              <button className="camera-btn zoom-btn" onClick={handleZoomIn}>🔍 Zoom In</button>
              <button className="camera-btn zoom-btn" onClick={handleZoomOut}>🔍 Zoom Out</button>
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
    </div>
  );
}

export default Scene01CameraTest;