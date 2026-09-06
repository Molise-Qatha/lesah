/* global VideoEncoder, VideoFrame */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Scene01CameraTest.css';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

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
  const [camera, setCamera] = useState({ x: 0, y: 0, forward: 0 });
  const [layerPositions, setLayerPositions] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: { x: 0, y: 0, scale: 1 } }), {})
  );
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layer.defaultVisible }), {})
  );

  const [debugMode, setDebugMode] = useState(true);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  const [linkScale, setLinkScale] = useState(false);
  const [unlimitedMode, setUnlimitedMode] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});
  const muxerRef = useRef(null);
  const videoEncoderRef = useRef(null);

  // Preload all images
  const imagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesLoadedRef = useRef(false);

  useEffect(() => {
    let loaded = 0;
    const total = SCENE_LAYERS.length;
    
    SCENE_LAYERS.forEach(layer => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === total) {
          imagesLoadedRef.current = true;
          setImagesLoaded(true);
        }
      };
      img.src = layer.src;
      imagesRef.current[layer.id] = img;
    });
  }, []);

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
      if (unlimitedMode) {
        if (keysPressed.current['w']) setCamera(prev => ({ ...prev, forward: prev.forward + speed }));
        if (keysPressed.current['s']) setCamera(prev => ({ ...prev, forward: prev.forward - speed }));
        if (keysPressed.current['a']) setCamera(prev => ({ ...prev, x: prev.x - speed }));
        if (keysPressed.current['d']) setCamera(prev => ({ ...prev, x: prev.x + speed }));
      } else {
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
    setLayerVisibility(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layer.defaultVisible }), {})
    );
  };

  const showOnly = (layerIds) => {
    setLayerVisibility(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layerIds.includes(layer.id) }), {})
    );
  };

  // Canvas Drawing Function
  const drawSceneToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!imagesLoadedRef.current) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    SCENE_LAYERS.forEach(layer => {
      if (!layerVisibility[layer.id]) return;
      
      const img = imagesRef.current[layer.id];
      if (!img) return;

      const transform = getLayerTransform(layer);
      
      const translateMatch = transform.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
      const scaleMatch = transform.transform.match(/scale\(([\d.]+)\)/);
      
      if (!translateMatch || !scaleMatch) return;

      const x = parseFloat(translateMatch[1]);
      const y = parseFloat(translateMatch[2]);
      const scale = parseFloat(scaleMatch[1]);

      ctx.save();
      ctx.translate(width / 2 + x, height / 2 + y);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    });
  }, [layerVisibility, layerPositions, camera, getLayerTransform]);

  // Animation loop for canvas
  useEffect(() => {
    let canvasAnimationFrame;
    
    const animateCanvas = () => {
      drawSceneToCanvas();
      canvasAnimationFrame = requestAnimationFrame(animateCanvas);
    };
    
    animateCanvas();
    
    return () => cancelAnimationFrame(canvasAnimationFrame);
  }, [drawSceneToCanvas]);

  // MP4 Recording Functions
  const startRecording = async () => {
    console.log('🎬 START RECORDING called');
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas not found');
        return;
      }
      console.log('✅ Canvas found:', canvas.width, 'x', canvas.height);

      // Force a draw first
      drawSceneToCanvas();
      console.log('✅ Canvas drawn');

      // Create MP4 muxer
      console.log('📦 Creating Muxer...');
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: 'avc',
          width: canvas.width,
          height: canvas.height,
          firstTimestampBehavior: 'offset'  // 🛠️ FIX: This is the correct placement!
        },
        fastStart: 'in-memory'
      });
      console.log('✅ Muxer created');

      muxerRef.current = muxer;

      // Create video encoder
      console.log('🎥 Creating VideoEncoder...');
      const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => {
          muxer.addVideoChunk(chunk, meta);
        },
        error: (e) => console.error('❌ Encoder error:', e)
      });

      videoEncoderRef.current = videoEncoder;
      console.log('✅ VideoEncoder created');

      console.log('⚙️ Configuring encoder...');
      videoEncoder.configure({
        codec: 'avc1.42001f',
        width: canvas.width,
        height: canvas.height,
        bitrate: 5_000_000,
        framerate: 15
      });
      console.log('✅ Encoder configured, state:', videoEncoder.state);

      // Start recording frames
      let frameNumber = 0;
      const frameRate = 15;
      const frameInterval = 1000000 / frameRate; // microseconds per frame

      isRecordingRef.current = true;
      console.log('✅ isRecordingRef set to true');

      const processFrame = async () => {
        if (!videoEncoderRef.current || videoEncoderRef.current.state !== 'configured') {
          if (isRecordingRef.current) {
            requestAnimationFrame(processFrame);
          }
          return;
        }

        if (videoEncoderRef.current.encodeQueueSize > 2) {
          if (isRecordingRef.current) {
            requestAnimationFrame(processFrame);
          }
          return;
        }

        try {
          const timestamp = frameNumber * frameInterval;
          
          const frame = new VideoFrame(canvas, { timestamp });
          videoEncoderRef.current.encode(frame, { keyFrame: frameNumber % 15 === 0 });
          frame.close();
          frameNumber++;
        } catch (error) {
          console.error('❌ Frame encoding failed:', error);
        }

        if (isRecordingRef.current) {
          requestAnimationFrame(processFrame);
        } else {
          console.log('🛑 Frame loop stopping');
        }
      };

      console.log('🚀 Starting frame loop...');
      requestAnimationFrame(processFrame);
      setIsRecording(true);
      console.log('✅ Recording started!');

    } catch (error) {
      console.error('❌ Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    console.log('⏹️ STOP RECORDING called');
    isRecordingRef.current = false;
    console.log('✅ isRecordingRef set to false');

    if (videoEncoderRef.current && videoEncoderRef.current.state === 'configured') {
      try {
        console.log('⏳ Flushing encoder...');
        await videoEncoderRef.current.flush();
        console.log('✅ Encoder flushed');
        
        console.log('📦 Finalizing muxer...');
        muxerRef.current.finalize();
        console.log('✅ Muxer finalized');
        
        const { buffer } = muxerRef.current.target;
        console.log('✅ Buffer size:', buffer.byteLength);
        
        const blob = new Blob([buffer], { type: 'video/mp4' });
        console.log('✅ Blob created, size:', blob.size);
        
        const url = URL.createObjectURL(blob);
        console.log('✅ Object URL created:', url);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lesah-scene01-${Date.now()}.mp4`;
        a.click();
        console.log('✅ Download triggered');
        
        URL.revokeObjectURL(url);
        console.log('✅ URL revoked');
      } catch (error) {
        console.error('❌ Error finalizing recording:', error);
      }
    } else {
      console.warn('⚠️ Encoder not in configured state:', videoEncoderRef.current?.state);
    }
    
    if (videoEncoderRef.current) {
      console.log('🛑 Closing encoder...');
      videoEncoderRef.current.close();
      videoEncoderRef.current = null;
      console.log('✅ Encoder closed');
    }
    
    muxerRef.current = null;
    setIsRecording(false);
    console.log('✅ Recording stopped');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoEncoderRef.current && videoEncoderRef.current.state === 'configured') {
        videoEncoderRef.current.close();
      }
      if (muxerRef.current) {
        muxerRef.current = null;
      }
    };
  }, []);

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
        <div className="scene-viewport">
          <div className="scene-stage">
            {SCENE_LAYERS.map(layer => (
              layerVisibility[layer.id] && (
                <div key={layer.id} className="scene-layer" style={{ zIndex: layer.zIndex, ...getLayerTransform(layer) }}>
                  <img src={layer.src} alt={layer.name} className="scene-layer-img" draggable={false} />
                </div>
              )
            ))}
          </div>
          
          {/* Hidden Canvas for recording */}
          <canvas 
            ref={canvasRef} 
            width={1280} 
            height={720} 
            style={{ display: 'none' }} 
          />
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="recording-indicator">
              <span className="rec-dot"></span>
              REC
            </div>
          )}
        </div>

        {/* FULL MANUAL CONTROLS */}
        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Manual Editor</h3>
            <button className={`debug-toggle ${debugMode ? 'active' : ''}`} onClick={() => setDebugMode(!debugMode)}>
              🐛 Toggle Controls
            </button>
          </div>

          {/* Unlimited Mode Toggle + Record Button */}
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

          {/* Asset Visibility Panel */}
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

          {/* Manual Camera Controls */}
          <div className="camera-stat-group">
            <strong>Camera Parallax</strong>
            <label>Camera X (Left/Right): 
              <input 
                type="range" 
                min={-rangeLimits.cameraX} 
                max={rangeLimits.cameraX} 
                value={camera.x} 
                onChange={(e) => setCamera(prev => ({ ...prev, x: Number(e.target.value) }))} 
              />
            </label>
            <label>Camera Y (Up/Down): 
              <input 
                type="range" 
                min={-rangeLimits.cameraY} 
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

          {/* Layer Editor */}
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