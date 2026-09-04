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
// 🛠️ scaleSpeed rebalanced: Near trees grow just enough to frame edges, not block.
const SCENE_LAYERS = [
  { id: 'sky', name: 'Sky', src: skyImg, depth: 0.05, baseScale: 1.0, zIndex: 1, visible: true, scaleSpeed: 0.05 },
  { id: 'mountains', name: 'Mountains', src: mountainsImg, depth: 0.1, baseScale: 1.0, zIndex: 2, visible: true, scaleSpeed: 0.12 },
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, depth: 0.2, baseScale: 1.0, zIndex: 3, visible: true, scaleSpeed: 0.22 },
  { id: 'clearing', name: 'Clearing', src: clearingImg, depth: 0.4, baseScale: 1.0, zIndex: 4, visible: true, scaleSpeed: 0.45 },
  { id: 'landmark_tree', name: 'Landmark Tree', src: landmarkImg, depth: 0.65, baseScale: 1.0, zIndex: 5, visible: true, scaleSpeed: 0.9 },
  { id: 'near_tree_01', name: 'Near Tree 01', src: nearTree01Img, depth: 0.85, baseScale: 1.15, zIndex: 6, visible: true, scaleSpeed: 1.15 },
  { id: 'near_tree_02', name: 'Near Tree 02', src: nearTree02Img, depth: 1.0, baseScale: 1.25, zIndex: 7, visible: true, scaleSpeed: 1.4 },
];

// 🛠️ Camera stops at the "Perfect View" (Zoom: 60)
const CAMERA_ZOOM = {
  startZoom: 0,     
  endZoom: 60,      // 🛠️ The Perfect View
  maxZoom: 100,     // Manual Zoom can go up to 100
  duration: 12000,  
  easeInDuration: 0.25,   
  easeOutDuration: 0.45,  
};

function Scene01CameraTest() {
  const [camera, setCamera] = useState({
    zoom: CAMERA_ZOOM.startZoom,
    x: 0,
    y: 0,
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

  const cinematicEase = useCallback((t) => {
    const clampedT = Math.max(0, Math.min(1, t));
    if (clampedT < CAMERA_ZOOM.easeInDuration) {
      const phaseT = clampedT / CAMERA_ZOOM.easeInDuration;
      return 0.5 * phaseT * phaseT;
    }
    if (clampedT > 1 - CAMERA_ZOOM.easeOutDuration) {
      const phaseT = (clampedT - (1 - CAMERA_ZOOM.easeOutDuration)) / CAMERA_ZOOM.easeOutDuration;
      return 1 - 0.5 * (1 - phaseT) * (1 - phaseT);
    }
    const midStart = CAMERA_ZOOM.easeInDuration;
    const midEnd = 1 - CAMERA_ZOOM.easeOutDuration;
    const midProgress = (clampedT - midStart) / (midEnd - midStart);
    return midProgress;
  }, []);

  const getLayerTransform = useCallback((layer) => {
    const zoomProgress = camera.zoom / CAMERA_ZOOM.maxZoom;
    const scale = layer.baseScale + (zoomProgress * layer.scaleSpeed);
    
    const parallaxX = camera.x * layer.depth;
    const parallaxY = camera.y * layer.depth * 0.5;
    
    return {
      transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${scale})`,
      opacity: 1,
      transformOrigin: 'center center',
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
      const speed = 0.6 * cameraSpeed;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, zoom: Math.min(prev.zoom + speed, CAMERA_ZOOM.maxZoom) }));
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, zoom: Math.max(prev.zoom - speed, CAMERA_ZOOM.startZoom) }));
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

  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / CAMERA_ZOOM.duration, 1);
      
      const easedProgress = cinematicEase(rawProgress);
      
      const zoom = CAMERA_ZOOM.startZoom + 
        (CAMERA_ZOOM.endZoom - CAMERA_ZOOM.startZoom) * easedProgress;
      
      const x = Math.sin(easedProgress * Math.PI * 2) * 8;
      const y = Math.sin(easedProgress * Math.PI * 3) * 3;
      
      setCamera({ zoom, x, y });
      
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

  const resetCamera = () => {
    setCamera({ zoom: CAMERA_ZOOM.startZoom, x: 0, y: 0 });
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
        <div className="scene-header">
          <h1>🎥 Scene 01 Camera Test</h1>
          <p className="scene-subtitle">Scale-Based Zoom — Forest Opening Shot</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        {/* 🛠️ SIDE-BY-SIDE LAYOUT */}
        <div className="scene-layout">
          {/* Scene Viewport (Left) */}
          <div className="scene-viewport" style={{ backgroundColor: '#000' }}>
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
                        <span>Scale Speed: {layer.scaleSpeed}</span>
                        <span>Scale: {(layer.baseScale + (camera.zoom / CAMERA_ZOOM.maxZoom) * layer.scaleSpeed).toFixed(2)}x</span>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>

          {/* 🛠️ Camera Controls (Right Side) */}
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
                <label>Zoom:</label>
                <span>{camera.zoom.toFixed(1)}</span>
              </div>
              <div className="camera-stat">
                <label>Progress:</label>
                <span>{((camera.zoom / CAMERA_ZOOM.maxZoom) * 100).toFixed(0)}%</span>
              </div>
              <div className="camera-stat">
                <label>X:</label>
                <span>{camera.x.toFixed(1)}</span>
              </div>
              <div className="camera-stat">
                <label>Y:</label>
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
              <p><kbd>W</kbd> Zoom In</p>
              <p><kbd>S</kbd> Zoom Out</p>
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
                    <span className="scale-speed">Scale: {layer.scaleSpeed}x</span>
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