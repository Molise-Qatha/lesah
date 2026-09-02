// src/pages/animation-lab/scenes/Scene01CameraTest.jsx
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

// Scene layer configuration
// 🛠️ FIX: Added 'forwardScale' and 'yOffset' for depth-based zooming
const SCENE_LAYERS = [
  {
    id: 'sky',
    name: 'Sky',
    src: skyImg,
    depth: 0.05,
    baseScale: 1.0,
    forwardScale: 1.05, // Barely grows
    yOffset: 0,
    zIndex: 1,
    visible: true,
  },
  {
    id: 'mountains',
    name: 'Mountains',
    src: mountainsImg,
    depth: 0.1,
    baseScale: 1.0,
    forwardScale: 1.15, // Grows very slightly
    yOffset: 0,
    zIndex: 2,
    visible: true,
  },
  {
    id: 'distant_forest',
    name: 'Distant Forest',
    src: forestImg,
    depth: 0.2,
    baseScale: 1.0,
    forwardScale: 1.3,
    yOffset: 0,
    zIndex: 3,
    visible: true,
  },
  {
    id: 'clearing',
    name: 'Clearing',
    src: clearingImg,
    depth: 0.4,
    baseScale: 1.0,
    forwardScale: 1.6, // Grows noticeably
    yOffset: 0,
    zIndex: 4,
    visible: true,
  },
  {
    id: 'landmark_tree',
    name: 'Landmark Tree',
    src: landmarkImg,
    depth: 0.65,
    baseScale: 1.0,
    forwardScale: 2.2, // Grows fast
    yOffset: 0,
    zIndex: 5,
    visible: true,
  },
  {
    id: 'near_tree_01',
    name: 'Near Tree 01',
    src: nearTree01Img,
    depth: 0.85,
    baseScale: 1.15,
    forwardScale: 3.0, // Grows very fast
    yOffset: 0,
    zIndex: 6,
    visible: true,
  },
  {
    id: 'near_tree_02',
    name: 'Near Tree 02',
    src: nearTree02Img,
    depth: 1.0,
    baseScale: 1.25,
    forwardScale: 4.0, // Grows fastest
    yOffset: 0,
    zIndex: 7,
    visible: true,
  },
];

// 🛠️ FIX: Smooth Ease In-Out Cubic function
const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

function Scene01CameraTest() {
  const [camera, setCamera] = useState({
    x: 0, 
    y: 0, 
    zoom: 1.0, 
    forward: 0, // 0 to 100
  });

  const [debugMode, setDebugMode] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {})
  );

  const [autoPlay, setAutoPlay] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const autoPlayFrameRef = useRef(null);
  const keysPressed = useRef({});
  const autoPlayStartTime = useRef(null);

  // 🛠️ FIX: Calculate layer position and scale using DEPTH ZOOM
  const getLayerTransform = useCallback((layer) => {
    const depthFactor = layer.depth;
    const progress = camera.forward / 100; // 0.0 to 1.0
    
    // Parallax offset (keeps slight sideways movement)
    const parallaxX = camera.x * depthFactor;
    const parallaxY = camera.y * depthFactor * 0.5;
    
    // 🛠️ THE BIG FIX: Calculate scale based on forward progress
    // Closer layers (higher depth) grow faster
    const forwardScale = 1 + progress * (layer.forwardScale - 1);
    const baseScale = layer.baseScale;
    const scale = baseScale * forwardScale;
    
    // 🛠️ THE BIG FIX: Calculate vertical offset to push the scene UP as it grows
    // (This simulates moving forward without sliding off-screen)
    const forwardOffsetY = progress * 100 * depthFactor; 
    
    return {
      transform: `translate(${parallaxX}px, ${parallaxY - forwardOffsetY}px) scale(${scale})`,
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
    const moveCamera = () => {
      const speed = 0.5 * cameraSpeed;
      let moved = false;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, forward: Math.min(prev.forward + speed, 100) }));
        moved = true;
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, forward: Math.max(prev.forward - speed, 0) }));
        moved = true;
      }
      if (keysPressed.current['a']) {
        setCamera(prev => ({ ...prev, x: prev.x - speed }));
        moved = true;
      }
      if (keysPressed.current['d']) {
        setCamera(prev => ({ ...prev, x: prev.x + speed }));
        moved = true;
      }
      
      if (moved || autoPlay) {
        animationFrameRef.current = requestAnimationFrame(moveCamera);
      }
    };
    
    const handleKeyFrame = () => {
      if (Object.values(keysPressed.current).some(Boolean) || autoPlay) {
        moveCamera();
      }
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraSpeed, autoPlay]);

  // 🛠️ FIX: Auto-play now goes from 0 to 100 using a smooth cubic ease
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    const duration = 12000; // 12 seconds for a slower, cinematic journey
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // 🛠️ FIX: Use true ease in-out cubic
      const eased = easeInOutCubic(progress);
      
      setCamera(prev => ({
        ...prev,
        forward: eased * 100, // 🛠️ Goes all the way to 100%
        x: Math.sin(eased * Math.PI) * 15, 
        zoom: 1 + eased * 0.2,
      }));
      
      if (progress < 1) {
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

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.001;
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(2.0, prev.zoom + zoomDelta)),
    }));
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, cameraX: 0, cameraY: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      cameraX: camera.x,
      cameraY: camera.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setCamera(prev => ({
      ...prev,
      x: dragStart.current.cameraX + dx,
      y: dragStart.current.cameraY + dy,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetCamera = () => {
    setCamera({ x: 0, y: 0, zoom: 1.0, forward: 0 });
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
          <p className="scene-subtitle">Parallax Camera System — Forest Establishing Shot</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        {/* 🛠️ FIX: Removed drag/pan event listeners from viewport to let auto-play work */}
        <div 
          className="scene-viewport"
          ref={sceneRef}
          onWheel={handleWheel}
        >
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
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Camera Controls */}
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
              <label>Forward:</label>
              <span>{camera.forward.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>X:</label>
              <span>{camera.x.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>Y:</label>
              <span>{camera.y.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>Zoom:</label>
              <span>{camera.zoom.toFixed(2)}x</span>
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
              {autoPlay ? '⏸ Stop Auto' : '▶ Auto Demo'}
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
            <p><kbd>W</kbd> Forward</p>
            <p><kbd>S</kbd> Backward</p>
            <p><kbd>A</kbd> Left</p>
            <p><kbd>D</kbd> Right</p>
            <p><kbd>Scroll</kbd> Zoom</p>
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
                  <span>{layer.visible ? '✓' : '✗'} {layer.name}</span>
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