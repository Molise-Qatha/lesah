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

// Scene layer configuration — DO NOT MODIFY
const SCENE_LAYERS = [
  {
    id: 'sky',
    name: 'Sky',
    src: skyImg,
    depth: 0.05,
    baseScale: 1.0,
    zIndex: 1,
    visible: true,
    slideOutX: 0,
    layerType: 'background',
  },
  {
    id: 'mountains',
    name: 'Mountains',
    src: mountainsImg,
    depth: 0.1,
    baseScale: 1.0,
    zIndex: 2,
    visible: true,
    slideOutX: 0,
    layerType: 'background',
  },
  {
    id: 'distant_forest',
    name: 'Distant Forest',
    src: forestImg,
    depth: 0.2,
    baseScale: 1.0,
    zIndex: 3,
    visible: true,
    slideOutX: 0,
    layerType: 'background',
  },
  {
    id: 'clearing',
    name: 'Clearing',
    src: clearingImg,
    depth: 0.4,
    baseScale: 1.0,
    zIndex: 4,
    visible: true,
    slideOutX: 0,
    layerType: 'floor',
    floorDropY: 300,
  },
  {
    id: 'landmark_tree',
    name: 'Landmark Tree',
    src: landmarkImg,
    depth: 0.65,
    baseScale: 1.0,
    zIndex: 5,
    visible: true,
    slideOutX: -250,
    slideOutStart: 55,
    slideOutEnd: 85,
    layerType: 'background',
  },
  {
    id: 'near_tree_01',
    name: 'Near Tree 01',
    src: nearTree01Img,
    depth: 0.85,
    baseScale: 1.15,
    zIndex: 6,
    visible: true,
    slideOutX: -800,
    slideOutStart: 45,
    slideOutEnd: 75,
    layerType: 'background',
  },
  {
    id: 'near_tree_02',
    name: 'Near Tree 02',
    src: nearTree02Img,
    depth: 1.0,
    baseScale: 1.25,
    zIndex: 7,
    visible: true,
    slideOutX: 800,
    slideOutStart: 50,
    slideOutEnd: 80,
    layerType: 'background',
  },
];

// Cinematic camera path configuration
const CAMERA_PATH = {
  // Start position (wide establishing shot)
  start: {
    forward: 0,
    x: 0,
    y: 0,
    zoom: 1.0,
  },
  // End position (at the clearing, looking deeper into forest)
  end: {
    forward: 85, // Not 100 — stops at a natural point near the clearing
    x: 15,       // Slight right drift for natural feel
    y: -10,      // Very slight upward drift
    zoom: 1.45,  // Moderate zoom — not too close
  },
  // Movement timing
  duration: 14000, // 14 seconds — slow and cinematic
  // Easing configuration
  easeInDuration: 0.20,   // 20% of the journey for ease-in
  easeOutDuration: 0.35,  // 35% of the journey for ease-out (slow stop)
};

function Scene01CameraTest() {
  // Camera state
  const [camera, setCamera] = useState({
    x: CAMERA_PATH.start.x,
    y: CAMERA_PATH.start.y,
    zoom: CAMERA_PATH.start.zoom,
    forward: CAMERA_PATH.start.forward,
  });

  // Debug mode
  const [debugMode, setDebugMode] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {})
  );

  // Auto-camera animation
  const [autoPlay, setAutoPlay] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  
  // Refs
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});
  const autoPlayStartTime = useRef(null);
  const autoPlayFrameRef = useRef(null);

  // Custom cinematic easing — smooth ease-in-out with slow stop
  const cinematicEase = useCallback((t) => {
    // t goes from 0 to 1
    // Clamp t
    const clampedT = Math.max(0, Math.min(1, t));
    
    // Ease-in phase
    if (clampedT < CAMERA_PATH.easeInDuration) {
      const phaseT = clampedT / CAMERA_PATH.easeInDuration;
      return 0.5 * phaseT * phaseT; // Quadratic ease-in
    }
    
    // Ease-out phase (longer for slow stop)
    if (clampedT > 1 - CAMERA_PATH.easeOutDuration) {
      const phaseT = (clampedT - (1 - CAMERA_PATH.easeOutDuration)) / CAMERA_PATH.easeOutDuration;
      return 1 - 0.5 * (1 - phaseT) * (1 - phaseT); // Quadratic ease-out
    }
    
    // Middle phase — smooth linear with slight sine wave
    const midStart = CAMERA_PATH.easeInDuration;
    const midEnd = 1 - CAMERA_PATH.easeOutDuration;
    const midProgress = (clampedT - midStart) / (midEnd - midStart);
    
    // Base linear interpolation
    const linearValue = 0.5 * (midStart * midStart) + 
      midProgress * (1 - 0.5 * CAMERA_PATH.easeOutDuration * CAMERA_PATH.easeOutDuration - 0.5 * midStart * midStart);
    
    return linearValue;
  }, []);

  // Calculate layer position based on camera
  const getLayerTransform = useCallback((layer) => {
    const depthFactor = layer.depth;
    
    // Parallax offset
    const parallaxX = camera.x * depthFactor;
    const parallaxY = camera.y * depthFactor * 0.5;
    
    // Handle FLAT FLOOR
    if (layer.layerType === 'floor') {
      const floorProgress = camera.forward / 100;
      const floorDrop = layer.floorDropY * floorProgress;
      const floorScale = layer.baseScale * (1 + (camera.zoom - 1) * 0.05);
      
      return {
        transform: `translate(${parallaxX}px, ${parallaxY + floorDrop}px) scale(${floorScale})`,
        opacity: 1,
      };
    }
    
    // Regular backgrounds
    const zoomFactor = 1 + (camera.zoom - 1) * depthFactor;
    const scale = layer.baseScale * zoomFactor;
    const forwardOffset = camera.forward * depthFactor * 2;
    
    let slideX = 0;
    if (layer.slideOutX !== 0 && layer.slideOutStart !== undefined) {
      const start = layer.slideOutStart;
      const end = layer.slideOutEnd;
      
      if (camera.forward > start) {
        const slideProgress = Math.min((camera.forward - start) / (end - start), 1);
        const eased = slideProgress < 0.5 
          ? 2 * slideProgress * slideProgress 
          : 1 - Math.pow(-2 * slideProgress + 2, 2) / 2;
        slideX = layer.slideOutX * eased;
      }
    }
    
    return {
      transform: `translate(${parallaxX - forwardOffset + slideX}px, ${parallaxY}px) scale(${scale})`,
      opacity: 1,
    };
  }, [camera]);

  // Manual controls
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

  // Manual camera loop
  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.4 * cameraSpeed;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, forward: Math.min(prev.forward + speed, 100) }));
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, forward: Math.max(prev.forward - speed, 0) }));
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

  // Auto-play cinematic camera
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / CAMERA_PATH.duration, 1);
      
      // Apply cinematic easing
      const easedProgress = cinematicEase(rawProgress);
      
      // Interpolate camera position with subtle natural drift
      const forward = CAMERA_PATH.start.forward + 
        (CAMERA_PATH.end.forward - CAMERA_PATH.start.forward) * easedProgress;
      
      const x = CAMERA_PATH.start.x + 
        (CAMERA_PATH.end.x - CAMERA_PATH.start.x) * easedProgress +
        Math.sin(easedProgress * Math.PI * 2) * 3; // Subtle sine sway
      
      const y = CAMERA_PATH.start.y + 
        (CAMERA_PATH.end.y - CAMERA_PATH.start.y) * easedProgress +
        Math.sin(easedProgress * Math.PI * 3) * 2; // Very slight vertical drift
      
      const zoom = CAMERA_PATH.start.zoom + 
        (CAMERA_PATH.end.zoom - CAMERA_PATH.start.zoom) * easedProgress;
      
      setCamera({
        forward,
        x,
        y,
        zoom,
      });
      
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
  }, [autoPlay, cinematicEase]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.001;
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(2.5, prev.zoom + zoomDelta)),
    }));
  }, []);

  // Mouse drag
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

  // Reset
  const resetCamera = () => {
    setCamera({
      x: CAMERA_PATH.start.x,
      y: CAMERA_PATH.start.y,
      zoom: CAMERA_PATH.start.zoom,
      forward: CAMERA_PATH.start.forward,
    });
  };

  // Toggle layer
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
          <p className="scene-subtitle">Cinematic Parallax Camera — Forest Opening Shot</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        {/* Scene Viewport */}
        <div 
          className="scene-viewport"
          ref={sceneRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
                      <span>Type: {layer.layerType || 'background'}</span>
                      {layer.slideOutX !== 0 && (
                        <span>Slide: {layer.slideOutX}px</span>
                      )}
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
            <p><kbd>W</kbd> Forward</p>
            <p><kbd>S</kbd> Backward</p>
            <p><kbd>A</kbd> Left</p>
            <p><kbd>D</kbd> Right</p>
            <p><kbd>Scroll</kbd> Zoom</p>
            <p><kbd>Drag</kbd> Pan</p>
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