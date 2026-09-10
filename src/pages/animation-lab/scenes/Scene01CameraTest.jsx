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
  const [layerVisibility, setLayerVisibility] = useState({ background: true, kopanang: true, lerato: true });
  const [selectedKopanangPose, setSelectedKopanangPose] = useState('ksit1');
  const [selectedLeratoPose, setSelectedLeratoPose] = useState('sit1');
  const [kopanangPos, setKopanangPos] = useState({ x: -100, y: 50, scale: 1 });
  const [leratoPos, setLeratoPos] = useState({ x: -100, y: -50, scale: 1 });
  const [kopanangTalking, setKopanangTalking] = useState(false);
  const [leratoTalking, setLeratoTalking] = useState(false);
  const [mouthIndex, setMouthIndex] = useState(0);
  const mouthTimerRef = useRef(null);

  const [kopanangMouthPos, setKopanangMouthPos] = useState({ x: 0, y: -40 });
  const [leratoMouthPos, setLeratoMouthPos] = useState({ x: 0, y: -40 });
  const [kopanangMouthScale, setKopanangMouthScale] = useState(1);
  const [leratoMouthScale, setLeratoMouthScale] = useState(1);

  const [debugMode, setDebugMode] = useState(true);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  const [unlimitedMode, setUnlimitedMode] = useState(false);
  const [backgroundScale, setBackgroundScale] = useState(1.0);
  const [selectedCharacter, setSelectedCharacter] = useState('kopanang');
  const [showSelectionOutline, setShowSelectionOutline] = useState(true);
  const [showMouthOutline, setShowMouthOutline] = useState(true);
  const [lockKopanangPos, setLockKopanangPos] = useState(false);
  const [lockLeratoPos, setLockLeratoPos] = useState(false);
  const [selectMode, setSelectMode] = useState('character');

  const [draggingCharacter, setDraggingCharacter] = useState(null);
  const [draggingMouth, setDraggingMouth] = useState(null);
  const [draggingCamera, setDraggingCamera] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, charX: 0, charY: 0, mouthX: 0, mouthY: 0 });
  const cameraDragStartRef = useRef({ mouseX: 0, mouseY: 0, camX: 0, camY: 0 });
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

  // Timeline state
  const [timelineKeyframes, setTimelineKeyframes] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineDuration, setTimelineDuration] = useState(10);
  const playbackFrameRef = useRef(null);
  const playbackStartTimeRef = useRef(null);

  useEffect(() => {
    let loaded = 0;
    const total = SCENE_LAYERS.length + KOPANANG_SIT.length + LERATO_SIT.length + MOUTH_FRAMES.length;
    const loadImage = (src) => {
      const img = new Image();
      img.onload = () => { loaded++; if (loaded === total) { imagesLoadedRef.current = true; setImagesLoaded(true); } };
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
    return { transform: `translate(${cameraX - forwardOffset}px, ${cameraY}px) scale(${backgroundScale})`, opacity: 1, transformOrigin: 'center center' };
  }, [camera, backgroundScale]);

  const getCharacterTransform = (pos) => {
    const depthFactor = 0.8;
    const cameraX = camera.x * depthFactor;
    const cameraY = camera.y * depthFactor * 0.5;
    const forwardProgress = camera.forward / 100;
    const forwardOffset = forwardProgress * depthFactor * 2;
    return { transform: `translate(${pos.x + cameraX - forwardOffset}px, ${pos.y + cameraY}px) scale(${pos.scale})`, opacity: 1, transformOrigin: 'center bottom' };
  };

  const getMouthAbsolutePosition = (character) => {
    const pos = character === 'kopanang' ? kopanangPos : leratoPos;
    const mouthPos = character === 'kopanang' ? kopanangMouthPos : leratoMouthPos;
    const depthFactor = 0.8;
    const cameraX = camera.x * depthFactor;
    const cameraY = camera.y * depthFactor * 0.5;
    const forwardProgress = camera.forward / 100;
    const forwardOffset = forwardProgress * depthFactor * 2;
    const charX = pos.x + cameraX - forwardOffset;
    const charY = pos.y + cameraY;
    const scaledMouthX = mouthPos.x * pos.scale;
    const scaledMouthY = mouthPos.y * pos.scale;
    return { x: charX + scaledMouthX, y: charY + scaledMouthY };
  };

  const handleKeyDown = useCallback((e) => { keysPressed.current[e.key.toLowerCase()] = true; }, []);
  const handleKeyUp = useCallback((e) => { keysPressed.current[e.key.toLowerCase()] = false; }, []);

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
      if (selectMode === 'character') {
        if (selectedCharacter === 'kopanang' && !lockKopanangPos) {
          setKopanangPos(prev => {
            let newX = prev.x, newY = prev.y;
            if (keysPressed.current['arrowleft']) newX -= charSpeed;
            if (keysPressed.current['arrowright']) newX += charSpeed;
            if (keysPressed.current['arrowup']) newY -= charSpeed;
            if (keysPressed.current['arrowdown']) newY += charSpeed;
            return { ...prev, x: newX, y: newY };
          });
        }
        if (selectedCharacter === 'lerato' && !lockLeratoPos) {
          setLeratoPos(prev => {
            let newX = prev.x, newY = prev.y;
            if (keysPressed.current['arrowleft']) newX -= charSpeed;
            if (keysPressed.current['arrowright']) newX += charSpeed;
            if (keysPressed.current['arrowup']) newY -= charSpeed;
            if (keysPressed.current['arrowdown']) newY += charSpeed;
            return { ...prev, x: newX, y: newY };
          });
        }
      } else {
        const mouthSpeed = 3;
        if (selectedCharacter === 'kopanang') {
          setKopanangMouthPos(prev => {
            let newX = prev.x, newY = prev.y;
            if (keysPressed.current['arrowleft']) newX -= mouthSpeed;
            if (keysPressed.current['arrowright']) newX += mouthSpeed;
            if (keysPressed.current['arrowup']) newY -= mouthSpeed;
            if (keysPressed.current['arrowdown']) newY += mouthSpeed;
            return { x: newX, y: newY };
          });
        } else {
          setLeratoMouthPos(prev => {
            let newX = prev.x, newY = prev.y;
            if (keysPressed.current['arrowleft']) newX -= mouthSpeed;
            if (keysPressed.current['arrowright']) newX += mouthSpeed;
            if (keysPressed.current['arrowup']) newY -= mouthSpeed;
            if (keysPressed.current['arrowdown']) newY += mouthSpeed;
            return { x: newX, y: newY };
          });
        }
      }

      if (keysPressed.current['[']) scaleCharacter(-0.02);
      if (keysPressed.current[']']) scaleCharacter(0.02);
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [cameraSpeed, unlimitedMode, rangeLimits, selectedCharacter, camera, lockKopanangPos, lockLeratoPos, selectMode]);

  const scaleCharacter = (delta) => {
    if (selectedCharacter === 'kopanang' && !lockKopanangPos) setKopanangPos(prev => ({ ...prev, scale: Math.max(0.2, Math.min(3, prev.scale + delta)) }));
    else if (selectedCharacter === 'lerato' && !lockLeratoPos) setLeratoPos(prev => ({ ...prev, scale: Math.max(0.2, Math.min(3, prev.scale + delta)) }));
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
    if (selectMode !== 'character') return;
    if (character === 'kopanang' && lockKopanangPos) return;
    if (character === 'lerato' && lockLeratoPos) return;
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

  const handleMouthMouseDown = (e, character) => {
    if (selectMode !== 'mouth') return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingMouth(character);
    setSelectedCharacter(character);
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    const mouthPos = character === 'kopanang' ? kopanangMouthPos : leratoMouthPos;
    dragStartRef.current = { mouseX, mouseY, mouthX: mouthPos.x, mouthY: mouthPos.y };
  };

  const handleStageMouseDown = (e) => {
    if (draggingCharacter || draggingMouth) return;
    if (selectMode !== 'character') return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    cameraDragStartRef.current = { mouseX, mouseY, camX: camera.x, camY: camera.y };
    setDraggingCamera(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const stageRect = stageRef.current.getBoundingClientRect();
      const mouseX = e.clientX - stageRect.left;
      const mouseY = e.clientY - stageRect.top;

      if (draggingCamera) {
        const dx = mouseX - cameraDragStartRef.current.mouseX;
        const dy = mouseY - cameraDragStartRef.current.mouseY;
        const newCamX = cameraDragStartRef.current.camX - dx;
        const newCamY = cameraDragStartRef.current.camY - dy;
        setCamera(prev => ({ ...prev, x: newCamX, y: newCamY }));
      }
      if (draggingCharacter) {
        const dx = mouseX - dragStartRef.current.mouseX;
        const dy = mouseY - dragStartRef.current.mouseY;
        const newX = dragStartRef.current.charX + dx;
        const newY = dragStartRef.current.charY + dy;
        if (draggingCharacter === 'kopanang' && !lockKopanangPos) setKopanangPos(prev => ({ ...prev, x: newX, y: newY }));
        else if (draggingCharacter === 'lerato' && !lockLeratoPos) setLeratoPos(prev => ({ ...prev, x: newX, y: newY }));
      } else if (draggingMouth) {
        const dx = mouseX - dragStartRef.current.mouseX;
        const dy = mouseY - dragStartRef.current.mouseY;
        const newMouthX = dragStartRef.current.mouthX + dx;
        const newMouthY = dragStartRef.current.mouthY + dy;
        if (draggingMouth === 'kopanang') setKopanangMouthPos({ x: newMouthX, y: newMouthY });
        else if (draggingMouth === 'lerato') setLeratoMouthPos({ x: newMouthX, y: newMouthY });
      }
    };
    const handleMouseUp = () => {
      setDraggingCamera(false);
      setDraggingCharacter(null);
      setDraggingMouth(null);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingCamera, draggingCharacter, draggingMouth, lockKopanangPos, lockLeratoPos]);

  const handleStageClick = (e) => {
    if (draggingCharacter || draggingMouth || draggingCamera) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    const offsetX = mouseX - stageRect.width / 2;
    const offsetY = mouseY - stageRect.height / 2;
    if (selectMode === 'character') {
      if (selectedCharacter === 'kopanang' && !lockKopanangPos) setKopanangPos(prev => ({ ...prev, x: offsetX, y: offsetY }));
      if (selectedCharacter === 'lerato' && !lockLeratoPos) setLeratoPos(prev => ({ ...prev, x: offsetX, y: offsetY }));
    } else {
      if (selectedCharacter === 'kopanang') setKopanangMouthPos({ x: (offsetX - kopanangPos.x) / kopanangPos.scale, y: (offsetY - kopanangPos.y) / kopanangPos.scale });
      else setLeratoMouthPos({ x: (offsetX - leratoPos.x) / leratoPos.scale, y: (offsetY - leratoPos.y) / leratoPos.scale });
    }
  };

  const nudgeCharacter = (axis, direction) => {
    const amount = 10;
    if (selectMode !== 'character') return;
    if (selectedCharacter === 'kopanang' && !lockKopanangPos) {
      setKopanangPos(prev => { const n = { ...prev }; if (axis === 'x') n.x += direction * amount; if (axis === 'y') n.y += direction * amount; return n; });
    } else if (selectedCharacter === 'lerato' && !lockLeratoPos) {
      setLeratoPos(prev => { const n = { ...prev }; if (axis === 'x') n.x += direction * amount; if (axis === 'y') n.y += direction * amount; return n; });
    }
  };

  const nudgeScale = (direction) => scaleCharacter(direction * 0.1);

  const nudgeMouth = (character, axis, direction) => {
    const amount = 5;
    if (character === 'kopanang') {
      setKopanangMouthPos(prev => { const n = { ...prev }; if (axis === 'x') n.x += direction * amount; if (axis === 'y') n.y += direction * amount; return n; });
    } else {
      setLeratoMouthPos(prev => { const n = { ...prev }; if (axis === 'x') n.x += direction * amount; if (axis === 'y') n.y += direction * amount; return n; });
    }
  };

  const resetMouth = (character) => {
    const defaultPos = { x: 0, y: -40 };
    if (character === 'kopanang') setKopanangMouthPos(defaultPos);
    else setLeratoMouthPos(defaultPos);
  };

  const nudgeMouthScale = (character, direction) => {
    const amount = 0.1;
    const maxScale = 5;
    const minScale = 0.2;
    if (character === 'kopanang') setKopanangMouthScale(prev => Math.max(minScale, Math.min(maxScale, prev + direction * amount)));
    else setLeratoMouthScale(prev => Math.max(minScale, Math.min(maxScale, prev + direction * amount)));
  };

  const resetKopanangPos = () => setKopanangPos({ x: -100, y: 50, scale: 1 });
  const resetLeratoPos = () => setLeratoPos({ x: -100, y: -50, scale: 1 });
  const resetCamera = () => setCamera({ x: 0, y: 0, forward: 0 });

  const nudgeCamera = (axis, direction) => {
    const amount = 20;
    setCamera(prev => {
      const newCam = { ...prev };
      if (axis === 'x') newCam.x += direction * amount;
      if (axis === 'y') newCam.y += direction * amount;
      return newCam;
    });
  };

  const nudgeCameraForward = (direction) => {
    setCamera(prev => ({ ...prev, forward: Math.max(-100, Math.min(5000, prev.forward + direction * 10)) }));
  };

  // Timeline functions
  const addKeyframe = () => {
    const kf = {
      id: Date.now(),
      time: currentTime,
      camera: { ...camera },
      kopanangPos: { ...kopanangPos },
      leratoPos: { ...leratoPos },
      kopanangMouthPos: { ...kopanangMouthPos },
      leratoMouthPos: { ...leratoMouthPos },
      selectedKopanangPose,
      selectedLeratoPose,
      kopanangTalking,
      leratoTalking,
      backgroundScale,
    };
    setTimelineKeyframes(prev => [...prev, kf].sort((a, b) => a.time - b.time));
  };

  const deleteKeyframe = (id) => {
    setTimelineKeyframes(prev => prev.filter(kf => kf.id !== id));
  };

  const selectKeyframe = (kf) => {
    setCurrentTime(kf.time);
    setCamera({ ...kf.camera });
    setKopanangPos({ ...kf.kopanangPos });
    setLeratoPos({ ...kf.leratoPos });
    setKopanangMouthPos({ ...kf.kopanangMouthPos });
    setLeratoMouthPos({ ...kf.leratoMouthPos });
    setSelectedKopanangPose(kf.selectedKopanangPose);
    setSelectedLeratoPose(kf.selectedLeratoPose);
    setKopanangTalking(kf.kopanangTalking);
    setLeratoTalking(kf.leratoTalking);
    setBackgroundScale(kf.backgroundScale);
  };

  const lerp = (a, b, t) => a + (b - a) * t;

  const interpolateAtTime = (time) => {
    if (timelineKeyframes.length === 0) return;
    const sorted = [...timelineKeyframes].sort((a, b) => a.time - b.time);
    let kf1 = sorted[0];
    let kf2 = sorted[sorted.length - 1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (time >= sorted[i].time && time <= sorted[i + 1].time) {
        kf1 = sorted[i];
        kf2 = sorted[i + 1];
        break;
      }
    }
    if (time <= kf1.time) kf2 = kf1;
    if (time >= kf2.time) kf1 = kf2;
    const t = (time - kf1.time) / (kf2.time - kf1.time || 1);
    const newCamera = { x: lerp(kf1.camera.x, kf2.camera.x, t), y: lerp(kf1.camera.y, kf2.camera.y, t), forward: lerp(kf1.camera.forward, kf2.camera.forward, t) };
    const newKopanangPos = { x: lerp(kf1.kopanangPos.x, kf2.kopanangPos.x, t), y: lerp(kf1.kopanangPos.y, kf2.kopanangPos.y, t), scale: lerp(kf1.kopanangPos.scale, kf2.kopanangPos.scale, t) };
    const newLeratoPos = { x: lerp(kf1.leratoPos.x, kf2.leratoPos.x, t), y: lerp(kf1.leratoPos.y, kf2.leratoPos.y, t), scale: lerp(kf1.leratoPos.scale, kf2.leratoPos.scale, t) };
    const newKopanangMouthPos = { x: lerp(kf1.kopanangMouthPos.x, kf2.kopanangMouthPos.x, t), y: lerp(kf1.kopanangMouthPos.y, kf2.kopanangMouthPos.y, t) };
    const newLeratoMouthPos = { x: lerp(kf1.leratoMouthPos.x, kf2.leratoMouthPos.x, t), y: lerp(kf1.leratoMouthPos.y, kf2.leratoMouthPos.y, t) };
    const newBackgroundScale = lerp(kf1.backgroundScale, kf2.backgroundScale, t);
    const newSelectedKopanangPose = t < 0.5 ? kf1.selectedKopanangPose : kf2.selectedKopanangPose;
    const newSelectedLeratoPose = t < 0.5 ? kf1.selectedLeratoPose : kf2.selectedLeratoPose;
    const newKopanangTalking = t < 0.5 ? kf1.kopanangTalking : kf2.kopanangTalking;
    const newLeratoTalking = t < 0.5 ? kf1.leratoTalking : kf2.leratoTalking;
    setCamera(newCamera);
    setKopanangPos(newKopanangPos);
    setLeratoPos(newLeratoPos);
    setKopanangMouthPos(newKopanangMouthPos);
    setLeratoMouthPos(newLeratoMouthPos);
    setBackgroundScale(newBackgroundScale);
    setSelectedKopanangPose(newSelectedKopanangPose);
    setSelectedLeratoPose(newSelectedLeratoPose);
    setKopanangTalking(newKopanangTalking);
    setLeratoTalking(newLeratoTalking);
  };

  const play = () => {
    if (timelineKeyframes.length === 0) return;
    setIsPlaying(true);
    playbackStartTimeRef.current = performance.now();
    const animate = (now) => {
      const elapsed = (now - playbackStartTimeRef.current) / 1000;
      const time = elapsed % timelineDuration;
      setCurrentTime(time);
      interpolateAtTime(time);
      playbackFrameRef.current = requestAnimationFrame(animate);
    };
    playbackFrameRef.current = requestAnimationFrame(animate);
  };

  const pause = () => {
    setIsPlaying(false);
    if (playbackFrameRef.current) cancelAnimationFrame(playbackFrameRef.current);
  };

  const stop = () => {
    setIsPlaying(false);
    if (playbackFrameRef.current) cancelAnimationFrame(playbackFrameRef.current);
    setCurrentTime(0);
    if (timelineKeyframes.length > 0) selectKeyframe(timelineKeyframes[0]);
  };

  useEffect(() => {
    return () => {
      if (playbackFrameRef.current) cancelAnimationFrame(playbackFrameRef.current);
    };
  }, []);

  // Draw to canvas for recording
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
      ctx.save(); ctx.translate(width / 2 + tx, height / 2 + ty); ctx.scale(scale, scale); ctx.drawImage(bgImg, -width, -height, width * 2, height * 2); ctx.restore();
    }

    const kopImg = imagesRef.current[`kopanang_${selectedKopanangPose}`];
    if (layerVisibility.kopanang && kopImg) {
      const pos = kopanangPos; const depth = 0.8; const camX = camera.x * depth; const camY = camera.y * depth * 0.5; const forwardOff = (camera.forward / 100) * depth * 2; const finalX = pos.x + camX - forwardOff; const finalY = pos.y + camY;
      ctx.save(); ctx.translate(width / 2 + finalX, height / 2 + finalY); ctx.scale(pos.scale, pos.scale); ctx.drawImage(kopImg, -kopImg.width / 2, -kopImg.height / 2); ctx.restore();
    }

    const lerImg = imagesRef.current[`lerato_${selectedLeratoPose}`];
    if (layerVisibility.lerato && lerImg) {
      const pos = leratoPos; const depth = 0.8; const camX = camera.x * depth; const camY = camera.y * depth * 0.5; const forwardOff = (camera.forward / 100) * depth * 2; const finalX = pos.x + camX - forwardOff; const finalY = pos.y + camY;
      ctx.save(); ctx.translate(width / 2 + finalX, height / 2 + finalY); ctx.scale(pos.scale, pos.scale); ctx.drawImage(lerImg, -lerImg.width / 2, -lerImg.height / 2); ctx.restore();
    }

    if (kopanangTalking) {
      const mouthImg = imagesRef.current[`mouth_${MOUTH_FRAMES[mouthIndex].id}`];
      if (mouthImg) {
        const posAbs = getMouthAbsolutePosition('kopanang');
        const scale = kopanangMouthScale;
        ctx.save(); ctx.translate(width / 2 + posAbs.x, height / 2 + posAbs.y); ctx.scale(scale, scale); ctx.drawImage(mouthImg, -15, -15, 30, 30); ctx.restore();
      }
    }
    if (leratoTalking) {
      const mouthImg = imagesRef.current[`mouth_${MOUTH_FRAMES[mouthIndex].id}`];
      if (mouthImg) {
        const posAbs = getMouthAbsolutePosition('lerato');
        const scale = leratoMouthScale;
        ctx.save(); ctx.translate(width / 2 + posAbs.x, height / 2 + posAbs.y); ctx.scale(scale, scale); ctx.drawImage(mouthImg, -15, -15, 30, 30); ctx.restore();
      }
    }
  }, [camera, layerVisibility, selectedKopanangPose, selectedLeratoPose, kopanangPos, leratoPos, kopanangMouthPos, leratoMouthPos, kopanangTalking, leratoTalking, mouthIndex, getBackgroundTransform, getMouthAbsolutePosition, kopanangMouthScale, leratoMouthScale]);

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

  return (
    <div className="scene01-page">
      <div className="scene01-container">
        <div className="scene-viewport" ref={stageRef} onClick={handleStageClick} onMouseDown={handleStageMouseDown} onWheel={handleWheel}>
          <div className="scene-stage">
            {/* Background */}
            {layerVisibility.background && (
              <div className="scene-layer" style={{ zIndex: 0, ...getBackgroundTransform() }}>
                <img src={backgroundImg} alt="Background" className="scene-layer-img" draggable={false} />
              </div>
            )}

            {/* Kopanang */}
            {layerVisibility.kopanang && (
              <div className="scene-layer draggable-character" style={{ zIndex: 10, ...getCharacterTransform(kopanangPos), cursor: selectMode === 'character' ? 'grab' : 'default', outline: showSelectionOutline && selectedCharacter === 'kopanang' ? '2px solid #ffd700' : 'none' }} onMouseDown={(e) => handleCharacterMouseDown(e, 'kopanang')}>
                <img src={KOPANANG_SIT.find(pose => pose.id === selectedKopanangPose).src} alt="Kopanang" className="scene-layer-img" draggable={false} />
              </div>
            )}

            {/* Lerato */}
            {layerVisibility.lerato && (
              <div className="scene-layer draggable-character" style={{ zIndex: 10, ...getCharacterTransform(leratoPos), cursor: selectMode === 'character' ? 'grab' : 'default', outline: showSelectionOutline && selectedCharacter === 'lerato' ? '2px solid #ffd700' : 'none' }} onMouseDown={(e) => handleCharacterMouseDown(e, 'lerato')}>
                <img src={LERATO_SIT.find(pose => pose.id === selectedLeratoPose).src} alt="Lerato" className="scene-layer-img" draggable={false} />
              </div>
            )}

            {/* Mouths */}
            {kopanangTalking && layerVisibility.kopanang && (
              <div className="mouth-overlay draggable-mouth" style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${getMouthAbsolutePosition('kopanang').x}px, ${getMouthAbsolutePosition('kopanang').y}px) translate(-${15 * kopanangMouthScale}px, -${15 * kopanangMouthScale}px)`, zIndex: 20, cursor: selectMode === 'mouth' ? 'grab' : 'default', outline: showMouthOutline && selectMode === 'mouth' ? '2px dashed #00ff00' : 'none', width: `${30 * kopanangMouthScale}px`, height: `${30 * kopanangMouthScale}px` }} onMouseDown={(e) => handleMouthMouseDown(e, 'kopanang')}>
                <img src={MOUTH_FRAMES[mouthIndex].src} alt="Mouth" style={{ width: '100%', height: '100%' }} />
              </div>
            )}

            {leratoTalking && layerVisibility.lerato && (
              <div className="mouth-overlay draggable-mouth" style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${getMouthAbsolutePosition('lerato').x}px, ${getMouthAbsolutePosition('lerato').y}px) translate(-${15 * leratoMouthScale}px, -${15 * leratoMouthScale}px)`, zIndex: 20, cursor: selectMode === 'mouth' ? 'grab' : 'default', outline: showMouthOutline && selectMode === 'mouth' ? '2px dashed #00ff00' : 'none', width: `${30 * leratoMouthScale}px`, height: `${30 * leratoMouthScale}px` }} onMouseDown={(e) => handleMouthMouseDown(e, 'lerato')}>
                <img src={MOUTH_FRAMES[mouthIndex].src} alt="Mouth" style={{ width: '100%', height: '100%' }} />
              </div>
            )}
          </div>

          <canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
          {isRecording && <div className="recording-indicator"><span className="rec-dot"></span> REC</div>}
        </div>

        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Scene Editor</h3>
            <button className={`debug-toggle ${debugMode ? 'active' : ''}`} onClick={() => setDebugMode(!debugMode)}>🐛 Toggle Controls</button>
          </div>

          {/* Timeline Panel */}
          <div className="timeline-panel">
            <h3>🎬 Timeline</h3>
            <div className="timeline-controls">
              <button className="test-btn" onClick={play} disabled={isPlaying || timelineKeyframes.length === 0}>▶ Play</button>
              <button className="test-btn" onClick={pause} disabled={!isPlaying}>⏸ Pause</button>
              <button className="test-btn" onClick={stop}>⏹ Stop</button>
              <button className="test-btn" onClick={addKeyframe}>➕ Add Keyframe @ {currentTime.toFixed(2)}s</button>
            </div>
            <div className="timeline-duration">
              <label>Duration: </label>
              <input type="range" min="1" max="60" step="0.5" value={timelineDuration} onChange={(e) => setTimelineDuration(Number(e.target.value))} />
              <span>{timelineDuration}s</span>
            </div>
            <div className="timeline-tracks">
              <div className="timeline-bar" style={{ width: '100%', background: '#333', height: '20px', position: 'relative' }}>
                <div className="playhead" style={{ left: `${(currentTime / timelineDuration) * 100}%`, position: 'absolute', top: '-5px', width: '2px', height: '30px', background: '#ffd700' }} />
                {timelineKeyframes.map(kf => (
                  <div key={kf.id} className="keyframe-marker" style={{ left: `${(kf.time / timelineDuration) * 100}%`, position: 'absolute', top: '0', width: '8px', height: '20px', background: '#e94560', cursor: 'pointer' }} onClick={() => selectKeyframe(kf)} title={`Keyframe @ ${kf.time.toFixed(2)}s`} />
                ))}
              </div>
            </div>
            <div className="keyframe-list">
              {timelineKeyframes.map(kf => (
                <div key={kf.id} className="keyframe-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="test-btn" onClick={() => selectKeyframe(kf)}>@{kf.time.toFixed(2)}s</button>
                  <button className="test-btn delete-btn" onClick={() => deleteKeyframe(kf.id)}>🗑️</button>
                </div>
              ))}
              {timelineKeyframes.length === 0 && <p>No keyframes yet.</p>}
            </div>
          </div>

          {/* Unlimited Mode + Record */}
          <div className="unlimited-mode-section">
            <div className="unlimited-mode-toggle">
              <label><input type="checkbox" checked={unlimitedMode} onChange={() => setUnlimitedMode(!unlimitedMode)} /><span className="unlimited-label">🔓 Camera Unlimited Mode</span></label>
            </div>
            <div className="record-section">
              {!isRecording ? <button className="record-btn" onClick={startRecording}>🎥 Record Scene</button> : <button className="record-btn recording" onClick={stopRecording}>⏹️ Stop Recording</button>}
            </div>
          </div>

          {/* Background Scale */}
          <div className="background-controls">
            <strong>🌄 Background</strong>
            <div className="slider-row">
              <label>Scale:</label>
              <input type="range" min="0.5" max="2" step="0.1" value={backgroundScale} onChange={(e) => setBackgroundScale(Number(e.target.value))} />
              <span>{backgroundScale.toFixed(1)}x</span>
            </div>
          </div>

          {/* Layer Visibility */}
          <div className="asset-visibility-panel">
            <strong>🎨 Layers</strong>
            <label className="asset-toggle-item"><input type="checkbox" checked={layerVisibility.background} onChange={() => setLayerVisibility(prev => ({ ...prev, background: !prev.background }))} /><span className="asset-toggle-label">Background</span></label>
            <label className="asset-toggle-item"><input type="checkbox" checked={layerVisibility.kopanang} onChange={() => setLayerVisibility(prev => ({ ...prev, kopanang: !prev.kopanang }))} /><span className="asset-toggle-label">Kopanang</span></label>
            <label className="asset-toggle-item"><input type="checkbox" checked={layerVisibility.lerato} onChange={() => setLayerVisibility(prev => ({ ...prev, lerato: !prev.lerato }))} /><span className="asset-toggle-label">Lerato</span></label>
          </div>

          {/* Character & Mouth Controls */}
          <div className="character-controls">
            <h4>Select Character</h4>
            <div className="pose-buttons">
              <button className={`test-btn ${selectedCharacter === 'kopanang' ? 'active' : ''}`} onClick={() => setSelectedCharacter('kopanang')}>Kopanang</button>
              <button className={`test-btn ${selectedCharacter === 'lerato' ? 'active' : ''}`} onClick={() => setSelectedCharacter('lerato')}>Lerato</button>
            </div>

            <h4>Select Mode</h4>
            <div className="pose-buttons">
              <button className={`test-btn ${selectMode === 'character' ? 'active' : ''}`} onClick={() => setSelectMode('character')}>🗣️ Move Character</button>
              <button className={`test-btn ${selectMode === 'mouth' ? 'active' : ''}`} onClick={() => setSelectMode('mouth')}>👄 Move Mouth</button>
            </div>

            {/* Camera controls */}
            <h4>🎥 Camera</h4>
            <div className="nudge-buttons">
              <button className="nudge-btn" onClick={() => nudgeCamera('y', -1)}>↑</button>
              <button className="nudge-btn" onClick={() => nudgeCamera('x', -1)}>←</button>
              <button className="nudge-btn" onClick={() => nudgeCamera('x', 1)}>→</button>
              <button className="nudge-btn" onClick={() => nudgeCamera('y', 1)}>↓</button>
            </div>
            <div className="nudge-buttons">
              <button className="nudge-btn" onClick={() => nudgeCameraForward(-1)}>− Zoom</button>
              <button className="nudge-btn" onClick={() => nudgeCameraForward(1)}>+ Zoom</button>
            </div>
            <p className="movement-hint">Drag background to pan camera. Use WASD keys or nudge buttons.</p>

            <h4>🎯 Move Character</h4>
            <div className="nudge-buttons">
              <button className="nudge-btn" onClick={() => nudgeCharacter('y', -1)}>↑</button>
              <button className="nudge-btn" onClick={() => nudgeCharacter('x', -1)}>←</button>
              <button className="nudge-btn" onClick={() => nudgeCharacter('x', 1)}>→</button>
              <button className="nudge-btn" onClick={() => nudgeCharacter('y', 1)}>↓</button>
            </div>
            <h4>🔍 Character Scale</h4>
            <div className="nudge-buttons">
              <button className="nudge-btn" onClick={() => nudgeScale(-1)}>−</button>
              <button className="nudge-btn" onClick={() => nudgeScale(1)}>+</button>
            </div>

            <h4>👄 Mouth Scale</h4>
            <div className="nudge-buttons">
              <button className="nudge-btn" onClick={() => nudgeMouthScale(selectedCharacter, -1)}>−</button>
              <button className="nudge-btn" onClick={() => nudgeMouthScale(selectedCharacter, 1)}>+</button>
            </div>

            <h4>🎨 Outline</h4>
            <label className="asset-toggle-item"><input type="checkbox" checked={showSelectionOutline} onChange={() => setShowSelectionOutline(!showSelectionOutline)} /><span className="asset-toggle-label">Show Character Outline</span></label>
            <label className="asset-toggle-item"><input type="checkbox" checked={showMouthOutline} onChange={() => setShowMouthOutline(!showMouthOutline)} /><span className="asset-toggle-label">Show Mouth Outline</span></label>

            <h4>🔒 Lock Position</h4>
            <label className="asset-toggle-item"><input type="checkbox" checked={lockKopanangPos} onChange={() => setLockKopanangPos(!lockKopanangPos)} /><span className="asset-toggle-label">Lock Kopanang</span></label>
            <label className="asset-toggle-item"><input type="checkbox" checked={lockLeratoPos} onChange={() => setLockLeratoPos(!lockLeratoPos)} /><span className="asset-toggle-label">Lock Lerato</span></label>
            <div className="pose-buttons">
              <button className="test-btn" onClick={resetKopanangPos}>Reset Kopanang</button>
              <button className="test-btn" onClick={resetLeratoPos}>Reset Lerato</button>
              <button className="test-btn" onClick={resetCamera}>Reset Camera</button>
            </div>
          </div>

          {/* Poses and Talking */}
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

          {/* Mouth Position Controls */}
          {debugMode && (
            <div className="character-controls">
              <h4>👄 Kopanang Mouth</h4>
              <div className="pose-buttons">
                <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'y', -1)}>↑</button>
                <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'x', -1)}>←</button>
                <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'x', 1)}>→</button>
                <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'y', 1)}>↓</button>
                <button className="test-btn" onClick={() => resetMouth('kopanang')}>Reset</button>
              </div>
              <span className="mouth-pos-display">X: {kopanangMouthPos.x}, Y: {kopanangMouthPos.y}</span>

              <h4>👄 Lerato Mouth</h4>
              <div className="pose-buttons">
                <button className="test-btn" onClick={() => nudgeMouth('lerato', 'y', -1)}>↑</button>
                <button className="test-btn" onClick={() => nudgeMouth('lerato', 'x', -1)}>←</button>
                <button className="test-btn" onClick={() => nudgeMouth('lerato', 'x', 1)}>→</button>
                <button className="test-btn" onClick={() => nudgeMouth('lerato', 'y', 1)}>↓</button>
                <button className="test-btn" onClick={() => resetMouth('lerato')}>Reset</button>
              </div>
              <span className="mouth-pos-display">X: {leratoMouthPos.x}, Y: {leratoMouthPos.y}</span>
            </div>
          )}

          <div className="slider-row">
            <label>Camera Speed:</label>
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