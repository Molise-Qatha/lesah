/* global VideoEncoder, VideoFrame */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Scene01CameraTest.css';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

// Scene Assets
import backgroundImg from '../../../assets/scene01/background.png';

// Kopanang sit frames
import ksit1 from '../../../assets/Kopanang_sit/ksit_1.png';
import ksit2 from '../../../assets/Kopanang_sit/ksit_2.png';
import ksit3 from '../../../assets/Kopanang_sit/ksit_3.png';
import ksit4 from '../../../assets/Kopanang_sit/ksit_4.png';
import ksit5 from '../../../assets/Kopanang_sit/ksit_5.png';
import ksit6 from '../../../assets/Kopanang_sit/ksit_6.png';
import ksit7 from '../../../assets/Kopanang_sit/ksit7.png';
import ksit8 from '../../../assets/Kopanang_sit/ksit_8.png';

// Lerato sit frames
import lsit1 from '../../../assets/lerato_sit/sit_1.png';
import lsit2 from '../../../assets/lerato_sit/sit_2.png';
import lsit3 from '../../../assets/lerato_sit/sit_3.png';
import lsit4 from '../../../assets/lerato_sit/sit_4.png';
import lsit5 from '../../../assets/lerato_sit/sit_5.png';

// Shared mouth sprites
import mouthA from '../../../assets/mouth/mouth_a.png';
import mouthE from '../../../assets/mouth/mouth_e.png';
import mouthI from '../../../assets/mouth/mouth_i.png';
import mouthO from '../../../assets/mouth/mouth_o.png';
import mouthU from '../../../assets/mouth/mouth_u.png';

const SCENE_LAYERS = [
  { id: 'background', name: 'Background', src: backgroundImg, depth: 1.0, zIndex: 0, defaultVisible: true },
];

const KOPANANG_SIT = [
  { id: 'ksit1', label: 'Sit 1', src: ksit1 },
  { id: 'ksit2', label: 'Sit 2', src: ksit2 },
  { id: 'ksit3', label: 'Sit 3', src: ksit3 },
  { id: 'ksit4', label: 'Sit 4', src: ksit4 },
  { id: 'ksit5', label: 'Sit 5', src: ksit5 },
  { id: 'ksit6', label: 'Sit 6', src: ksit6 },
  { id: 'ksit7', label: 'Sit 7', src: ksit7 },
  { id: 'ksit8', label: 'Sit 8', src: ksit8 },
];

const LERATO_SIT = [
  { id: 'sit1', label: 'Sit 1', src: lsit1 },
  { id: 'sit2', label: 'Sit 2', src: lsit2 },
  { id: 'sit3', label: 'Sit 3', src: lsit3 },
  { id: 'sit4', label: 'Sit 4', src: lsit4 },
  { id: 'sit5', label: 'Sit 5', src: lsit5 },
];

const MOUTH_FRAMES = [
  { id: 'A', label: 'A', src: mouthA },
  { id: 'E', label: 'E', src: mouthE },
  { id: 'I', label: 'I', src: mouthI },
  { id: 'O', label: 'O', src: mouthO },
  { id: 'U', label: 'U', src: mouthU },
];

function Scene01CameraTest() {
  const [camera, setCamera] = useState({ x: 0, y: 0, forward: 0 });
  const [layerVisibility, setLayerVisibility] = useState({
    background: true,
    kopanang: true,
    lerato: true,
  });

  const [selectedKopanangPose, setSelectedKopanangPose] = useState('ksit1');
  const [selectedLeratoPose, setSelectedLeratoPose] = useState('sit1');
  const [kopanangPos, setKopanangPos] = useState({ x: -100, y: 50, scale: 1 });
  const [leratoPos, setLeratoPos] = useState({ x: -100, y: -50, scale: 1 });
  const [kopanangTalking, setKopanangTalking] = useState(false);
  const [leratoTalking, setLeratoTalking] = useState(false);
  const [mouthIndex, setMouthIndex] = useState(0);
  const mouthTimerRef = useRef(null);

  const [debugMode, setDebugMode] = useState(true);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  const [unlimitedMode, setUnlimitedMode] = useState(false);

  const [backgroundScale, setBackgroundScale] = useState(1.0);
  const [selectedCharacter, setSelectedCharacter] = useState('kopanang');
  const [showSelectionOutline, setShowSelectionOutline] = useState(true);

  const [draggingCharacter, setDraggingCharacter] = useState(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, charX: 0, charY: 0 });
  const stageRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});
  const muxerRef = useRef(null);
  const videoEncoderRef = useRef(null);

  const imagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesLoadedRef = useRef(false);

  useEffect(() => {
    let loaded = 0;
    const total = SCENE_LAYERS.length + KOPANANG_SIT.length + LERATO_SIT.length + MOUTH_FRAMES.length;
    
    const loadImage = (src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === total) {
          imagesLoadedRef.current = true;
          setImagesLoaded(true);
        }
      };
      img.src = src;
      return img;
    };

    SCENE_LAYERS.forEach(layer => imagesRef.current[layer.id] = loadImage(layer.src));
    KOPANANG_SIT.forEach(pose => imagesRef.current[`kopanang_${pose.id}`] = loadImage(pose.src));
    LERATO_SIT.forEach(pose => imagesRef.current[`lerato_${pose.id}`] = loadImage(pose.src));
    MOUTH_FRAMES.forEach(mouth => imagesRef.current[`mouth_${mouth.id}`] = loadImage(mouth.src));
  }, []);

  const rangeLimits = unlimitedMode ? { cameraX: 10000, cameraY: 10000, forward: 5000 } : { cameraX: 200, cameraY: 200, forward: 100 };

  const getBackgroundTransform = useCallback(() => {
    const depthFactor = 1.0;
    const cameraX = camera.x * depthFactor;
    const cameraY = camera.y * depthFactor * 0.5;
    const forwardProgress = camera.forward / 100;
    const forwardOffset = forwardProgress * depthFactor * 2;
    return {
      transform: `translate(${cameraX - forwardOffset}px, ${cameraY}px) scale(${backgroundScale})`,
      opacity: 1,
      transformOrigin: 'center center',
    };
  }, [camera, backgroundScale]);

  const getCharacterTransform = (pos) => {
    const depthFactor = 0.8;
    const cameraX = camera.x * depthFactor;
    const cameraY = camera.y * depthFactor * 0.5;
    const forwardProgress = camera.forward / 100;
    const forwardOffset = forwardProgress * depthFactor * 2;
    return {
      transform: `translate(${pos.x + cameraX - forwardOffset}px, ${pos.y + cameraY}px) scale(${pos.scale})`,
      opacity: 1,
      transformOrigin: 'center bottom',
    };
  };

  const handleKeyDown = useCallback((e) => {
    keysPressed.current[e.key.toLowerCase()] = true;
  }, []);

  const handleKeyUp = useCallback((e) => {
    keysPressed.current[e.key.toLowerCase()] = false;
  }, []);

  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.4 * cameraSpeed;
      const currentCamera = { ...camera };
      if (unlimitedMode) {
        if (keysPressed.current['w']) currentCamera.forward += speed;
        if (keysPressed.current['s']) currentCamera.forward -= speed;
        if (keysPressed.current['a']) currentCamera.x -= speed;
        if (keysPressed.current['d']) currentCamera.x += speed;
      } else {
        if (keysPressed.current['w']) currentCamera.forward = Math.min(currentCamera.forward + speed, rangeLimits.forward);
        if (keysPressed.current['s']) currentCamera.forward = Math.max(currentCamera.forward - speed, -rangeLimits.forward);
        if (keysPressed.current['a']) currentCamera.x = Math.max(currentCamera.x - speed, -rangeLimits.cameraX);
        if (keysPressed.current['d']) currentCamera.x = Math.min(currentCamera.x + speed, rangeLimits.cameraX);
      }
      setCamera(currentCamera);

      const charSpeed = 5;
      if (selectedCharacter === 'kopanang') {
        setKopanangPos(prev => {
          let newX = prev.x, newY = prev.y;
          if (keysPressed.current['arrowleft']) newX -= charSpeed;
          if (keysPressed.current['arrowright']) newX += charSpeed;
          if (keysPressed.current['arrowup']) newY -= charSpeed;
          if (keysPressed.current['arrowdown']) newY += charSpeed;
          return { ...prev, x: newX, y: newY };
        });
      } else {
        setLeratoPos(prev => {
          let newX = prev.x, newY = prev.y;
          if (keysPressed.current['arrowleft']) newX -= charSpeed;
          if (keysPressed.current['arrowright']) newX += charSpeed;
          if (keysPressed.current['arrowup']) newY -= charSpeed;
          if (keysPressed.current['arrowdown']) newY += charSpeed;
          return { ...prev, x: newX, y: newY };
        });
      }

      if (keysPressed.current['[']) scaleCharacter(-0.02);
      if (keysPressed.current[']']) scaleCharacter(0.02);

      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [cameraSpeed, unlimitedMode, rangeLimits, selectedCharacter, camera]);

  const scaleCharacter = (delta) => {
    if (selectedCharacter === 'kopanang') {
      setKopanangPos(prev => ({ ...prev, scale: Math.max(0.2, Math.min(3, prev.scale + delta)) }));
    } else {
      setLeratoPos(prev => ({ ...prev, scale: Math.max(0.2, Math.min(3, prev.scale + delta)) }));
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    scaleCharacter(delta);
  };

  useEffect(() => {
    if (kopanangTalking || leratoTalking) {
      mouthTimerRef.current = setInterval(() => setMouthIndex(prev => (prev + 1) % MOUTH_FRAMES.length), 200);
    }
    return () => clearInterval(mouthTimerRef.current);
  }, [kopanangTalking, leratoTalking]);

  const handleCharacterMouseDown = (e, character) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCharacter(character);
    setSelectedCharacter(character);
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    const currentPos = character === 'kopanang' ? kopanangPos : leratoPos;
    dragStartRef.current = { mouseX, mouseY, charX: currentPos.x, charY: currentPos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingCharacter) return;
      const stageRect = stageRef.current.getBoundingClientRect();
      const mouseX = e.clientX - stageRect.left;
      const mouseY = e.clientY - stageRect.top;
      const dx = mouseX - dragStartRef.current.mouseX;
      const dy = mouseY - dragStartRef.current.mouseY;
      const newX = dragStartRef.current.charX + dx;
      const newY = dragStartRef.current.charY + dy;
      if (draggingCharacter === 'kopanang') setKopanangPos(prev => ({ ...prev, x: newX, y: newY }));
      else if (draggingCharacter === 'lerato') setLeratoPos(prev => ({ ...prev, x: newX, y: newY }));
    };
    const handleMouseUp = () => setDraggingCharacter(null);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingCharacter]);

  const handleStageClick = (e) => {
    if (draggingCharacter) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    const offsetX = mouseX - stageRect.width / 2;
    const offsetY = mouseY - stageRect.height / 2;
    if (selectedCharacter === 'kopanang') setKopanangPos(prev => ({ ...prev, x: offsetX, y: offsetY }));
    else setLeratoPos(prev => ({ ...prev, x: offsetX, y: offsetY }));
  };

  const drawSceneToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoadedRef.current) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width, height = canvas.height;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const bgImg = imagesRef.current['background'];
    if (layerVisibility.background && bgImg) {
      const bgTransform = getBackgroundTransform();
      const translateMatch = bgTransform.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
      const scaleMatch = bgTransform.transform.match(/scale\(([\d.]+)\)/);
      const tx = translateMatch ? parseFloat(translateMatch[1]) : 0;
      const ty = translateMatch ? parseFloat(translateMatch[2]) : 0;
      const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
      ctx.save();
      ctx.translate(width / 2 + tx, height / 2 + ty);
      ctx.scale(scale, scale);
      ctx.drawImage(bgImg, -width, -height, width * 2, height * 2);
      ctx.restore();
    }

    const kopImg = imagesRef.current[`kopanang_${selectedKopanangPose}`];
    if (layerVisibility.kopanang && kopImg) {
      const pos = kopanangPos;
      const depth = 0.8;
      const camX = camera.x * depth;
      const camY = camera.y * depth * 0.5;
      const forwardOff = (camera.forward / 100) * depth * 2;
      const finalX = pos.x + camX - forwardOff;
      const finalY = pos.y + camY;
      ctx.save();
      ctx.translate(width / 2 + finalX, height / 2 + finalY);
      ctx.scale(pos.scale, pos.scale);
      ctx.drawImage(kopImg, -kopImg.width / 2, -kopImg.height / 2);
      ctx.restore();
    }

    const lerImg = imagesRef.current[`lerato_${selectedLeratoPose}`];
    if (layerVisibility.lerato && lerImg) {
      const pos = leratoPos;
      const depth = 0.8;
      const camX = camera.x * depth;
      const camY = camera.y * depth * 0.5;
      const forwardOff = (camera.forward / 100) * depth * 2;
      const finalX = pos.x + camX - forwardOff;
      const finalY = pos.y + camY;
      ctx.save();
      ctx.translate(width / 2 + finalX, height / 2 + finalY);
      ctx.scale(pos.scale, pos.scale);
      ctx.drawImage(lerImg, -lerImg.width / 2, -lerImg.height / 2);
      ctx.restore();
    }

    if (kopanangTalking) {
      const mouthImg = imagesRef.current[`mouth_${MOUTH_FRAMES[mouthIndex].id}`];
      if (mouthImg) {
        const mouthX = kopanangPos.x + camera.x * 0.8 - (camera.forward / 100) * 0.8 * 2;
        const mouthY = kopanangPos.y + camera.y * 0.8 - 30;
        ctx.drawImage(mouthImg, width / 2 + mouthX - 15, height / 2 + mouthY - 15, 30, 30);
      }
    }
    if (leratoTalking) {
      const mouthImg = imagesRef.current[`mouth_${MOUTH_FRAMES[mouthIndex].id}`];
      if (mouthImg) {
        const mouthX = leratoPos.x + camera.x * 0.8 - (camera.forward / 100) * 0.8 * 2;
        const mouthY = leratoPos.y + camera.y * 0.8 - 30;
        ctx.drawImage(mouthImg, width / 2 + mouthX - 15, height / 2 + mouthY - 15, 30, 30);
      }
    }
  }, [camera, layerVisibility, selectedKopanangPose, selectedLeratoPose, kopanangPos, leratoPos, kopanangTalking, leratoTalking, mouthIndex, getBackgroundTransform]);

  useEffect(() => {
    let canvasAnimationFrame;
    const animateCanvas = () => {
      drawSceneToCanvas();
      canvasAnimationFrame = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();
    return () => cancelAnimationFrame(canvasAnimationFrame);
  }, [drawSceneToCanvas]);

  const startRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: 'avc', width: canvas.width, height: canvas.height, firstTimestampBehavior: 'offset' }, fastStart: 'in-memory' });
    muxerRef.current = muxer;
    const videoEncoder = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => console.error('Encoder error:', e) });
    videoEncoderRef.current = videoEncoder;
    videoEncoder.configure({ codec: 'avc1.42001f', width: canvas.width, height: canvas.height, bitrate: 5_000_000, framerate: 15 });
    let frameNumber = 0;
    const frameInterval = 1000000 / 15;
    isRecordingRef.current = true;
    const processFrame = () => {
      if (!isRecordingRef.current) return;
      if (videoEncoderRef.current.encodeQueueSize > 2) { requestAnimationFrame(processFrame); return; }
      const timestamp = frameNumber * frameInterval;
      const frame = new VideoFrame(canvas, { timestamp });
      videoEncoderRef.current.encode(frame, { keyFrame: frameNumber % 15 === 0 });
      frame.close();
      frameNumber++;
      requestAnimationFrame(processFrame);
    };
    requestAnimationFrame(processFrame);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    isRecordingRef.current = false;
    if (videoEncoderRef.current) {
      await videoEncoderRef.current.flush();
      muxerRef.current.finalize();
      const { buffer } = muxerRef.current.target;
      const blob = new Blob([buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lesah-scene-${Date.now()}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
      videoEncoderRef.current.close();
      videoEncoderRef.current = null;
    }
    setIsRecording(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // 🛠️ FIX: This function was missing
  const resetCamera = () => {
    setCamera({ x: 0, y: 0, forward: 0 });
  };

  const nudgeCharacter = (axis, direction) => {
    const amount = 10;
    if (selectedCharacter === 'kopanang') {
      setKopanangPos(prev => {
        const newPos = { ...prev };
        if (axis === 'x') newPos.x += direction * amount;
        if (axis === 'y') newPos.y += direction * amount;
        return newPos;
      });
    } else {
      setLeratoPos(prev => {
        const newPos = { ...prev };
        if (axis === 'x') newPos.x += direction * amount;
        if (axis === 'y') newPos.y += direction * amount;
        return newPos;
      });
    }
  };

  const nudgeScale = (direction) => scaleCharacter(direction * 0.1);

  return (
    <div className="scene01-page">
      <div className="scene01-container">
        <div className="scene-viewport" ref={stageRef} onClick={handleStageClick} onWheel={handleWheel}>
          <div className="scene-stage">
            {layerVisibility.background && (
              <div className="scene-layer" style={{ zIndex: 0, ...getBackgroundTransform() }}>
                <img src={backgroundImg} alt="Background" className="scene-layer-img" draggable={false} />
              </div>
            )}
            {layerVisibility.kopanang && (
              <div
                className="scene-layer draggable-character"
                style={{
                  zIndex: 10,
                  ...getCharacterTransform(kopanangPos),
                  cursor: draggingCharacter === 'kopanang' ? 'grabbing' : 'grab',
                  outline: showSelectionOutline && selectedCharacter === 'kopanang' ? '2px solid #ffd700' : 'none',
                }}
                onMouseDown={(e) => handleCharacterMouseDown(e, 'kopanang')}
              >
                <img src={KOPANANG_SIT.find(pose => pose.id === selectedKopanangPose).src} alt="Kopanang" className="scene-layer-img" draggable={false} />
                {kopanangTalking && (
                  <div className="mouth-overlay" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <img src={MOUTH_FRAMES[mouthIndex].src} alt="Mouth" style={{ width: '30px' }} />
                  </div>
                )}
              </div>
            )}
            {layerVisibility.lerato && (
              <div
                className="scene-layer draggable-character"
                style={{
                  zIndex: 10,
                  ...getCharacterTransform(leratoPos),
                  cursor: draggingCharacter === 'lerato' ? 'grabbing' : 'grab',
                  outline: showSelectionOutline && selectedCharacter === 'lerato' ? '2px solid #ffd700' : 'none',
                }}
                onMouseDown={(e) => handleCharacterMouseDown(e, 'lerato')}
              >
                <img src={LERATO_SIT.find(pose => pose.id === selectedLeratoPose).src} alt="Lerato" className="scene-layer-img" draggable={false} />
                {leratoTalking && (
                  <div className="mouth-overlay" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <img src={MOUTH_FRAMES[mouthIndex].src} alt="Mouth" style={{ width: '30px' }} />
                  </div>
                )}
              </div>
            )}
          </div>
          <canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
          {isRecording && (
            <div className="recording-indicator">
              <span className="rec-dot"></span> REC
            </div>
          )}
        </div>

        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Scene Editor</h3>
            <button className={`debug-toggle ${debugMode ? 'active' : ''}`} onClick={() => setDebugMode(!debugMode)}>🐛 Toggle Controls</button>
          </div>

          <div className="unlimited-mode-section">
            <div className="unlimited-mode-toggle">
              <label><input type="checkbox" checked={unlimitedMode} onChange={() => setUnlimitedMode(!unlimitedMode)} /><span className="unlimited-label">🔓 Camera Unlimited Mode</span></label>
            </div>
            <div className="record-section">
              {!isRecording ? <button className="record-btn" onClick={startRecording}>🎥 Record Scene</button> : <button className="record-btn recording" onClick={stopRecording}>⏹️ Stop Recording</button>}
            </div>
          </div>

          <div className="background-controls">
            <strong>🌄 Background</strong>
            <div className="slider-row">
              <label>Scale:</label>
              <input type="range" min="0.5" max="2" step="0.1" value={backgroundScale} onChange={(e) => setBackgroundScale(Number(e.target.value))} />
              <span>{backgroundScale.toFixed(1)}x</span>
            </div>
          </div>

          <div className="asset-visibility-panel">
            <strong>🎨 Layers</strong>
            <label className="asset-toggle-item"><input type="checkbox" checked={layerVisibility.background} onChange={() => setLayerVisibility(prev => ({ ...prev, background: !prev.background }))} /><span className="asset-toggle-label">Background</span></label>
            <label className="asset-toggle-item"><input type="checkbox" checked={layerVisibility.kopanang} onChange={() => setLayerVisibility(prev => ({ ...prev, kopanang: !prev.kopanang }))} /><span className="asset-toggle-label">Kopanang</span></label>
            <label className="asset-toggle-item"><input type="checkbox" checked={layerVisibility.lerato} onChange={() => setLayerVisibility(prev => ({ ...prev, lerato: !prev.lerato }))} /><span className="asset-toggle-label">Lerato</span></label>
          </div>

          <div className="character-controls">
            <h4>Select Character</h4>
            <div className="pose-buttons">
              <button className={`test-btn ${selectedCharacter === 'kopanang' ? 'active' : ''}`} onClick={() => setSelectedCharacter('kopanang')}>Kopanang</button>
              <button className={`test-btn ${selectedCharacter === 'lerato' ? 'active' : ''}`} onClick={() => setSelectedCharacter('lerato')}>Lerato</button>
            </div>
            <h4>🎯 Quick Move</h4>
            <div className="nudge-buttons">
              <button className="nudge-btn" onClick={() => nudgeCharacter('y', -1)}>↑</button>
              <button className="nudge-btn" onClick={() => nudgeCharacter('x', -1)}>←</button>
              <button className="nudge-btn" onClick={() => nudgeCharacter('x', 1)}>→</button>
              <button className="nudge-btn" onClick={() => nudgeCharacter('y', 1)}>↓</button>
            </div>
            <h4>🔍 Scale</h4>
            <div className="nudge-buttons">
              <button className="nudge-btn" onClick={() => nudgeScale(-1)}>−</button>
              <button className="nudge-btn" onClick={() => nudgeScale(1)}>+</button>
            </div>
            <p className="movement-hint">Use [ and ] keys or mouse wheel to scale selected character.</p>
            <h4>🎨 Selection Outline</h4>
            <label className="asset-toggle-item"><input type="checkbox" checked={showSelectionOutline} onChange={() => setShowSelectionOutline(!showSelectionOutline)} /><span className="asset-toggle-label">Show Outline</span></label>
          </div>

          {debugMode && (
            <div className="character-controls">
              <h4>Kopanang Poses</h4>
              <div className="pose-buttons">
                {KOPANANG_SIT.map(pose => <button key={pose.id} className={`test-btn ${selectedKopanangPose === pose.id ? 'active' : ''}`} onClick={() => setSelectedKopanangPose(pose.id)}>{pose.label}</button>)}
              </div>
              <h4>Lerato Poses</h4>
              <div className="pose-buttons">
                {LERATO_SIT.map(pose => <button key={pose.id} className={`test-btn ${selectedLeratoPose === pose.id ? 'active' : ''}`} onClick={() => setSelectedLeratoPose(pose.id)}>{pose.label}</button>)}
              </div>
              <h4>Talking</h4>
              <button className={`test-btn ${kopanangTalking ? 'active' : ''}`} onClick={() => setKopanangTalking(!kopanangTalking)}>{kopanangTalking ? '⏹ Stop Kopanang' : '🗣️ Talk Kopanang'}</button>
              <button className={`test-btn ${leratoTalking ? 'active' : ''}`} onClick={() => setLeratoTalking(!leratoTalking)}>{leratoTalking ? '⏹ Stop Lerato' : '🗣️ Talk Lerato'}</button>
            </div>
          )}

          <div className="camera-stat-group">
            <strong>Camera Parallax</strong>
            <label>Camera X: <input type="range" min={unlimitedMode ? -10000 : -200} max={unlimitedMode ? 10000 : 200} value={camera.x} onChange={(e) => setCamera({ ...camera, x: Number(e.target.value) })} /></label>
            <label>Camera Y: <input type="range" min={unlimitedMode ? -10000 : -200} max={unlimitedMode ? 10000 : 200} value={camera.y} onChange={(e) => setCamera({ ...camera, y: Number(e.target.value) })} /></label>
            <label>Forward: <input type="range" min={unlimitedMode ? -5000 : 0} max={unlimitedMode ? 5000 : 100} value={camera.forward} onChange={(e) => setCamera({ ...camera, forward: Number(e.target.value) })} /></label>
            <div className="camera-position-display"><span>X: {camera.x.toFixed(2)}</span><span>Y: {camera.y.toFixed(2)}</span><span>F: {camera.forward.toFixed(2)}</span></div>
          </div>

          <div className="camera-buttons">
            <button className="camera-btn" onClick={resetCamera}>🔄 Reset Camera</button>
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