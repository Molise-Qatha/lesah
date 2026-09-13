/* global VideoEncoder, VideoFrame */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Scene01CameraTest.css';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { drawSceneToCanvas } from './Scene01Canvas';
import Scene01Controls from './Scene01Controls';

import backgroundImg from '../../../assets/scene01/background.png';

import grass01 from '../../../assets/scene01/grass/grass_01.png';
import grass02 from '../../../assets/scene01/grass/grass_02.png';
import grass03 from '../../../assets/scene01/grass/grass_03.png';
import grass04 from '../../../assets/scene01/grass/grass_04.png';
import grass05 from '../../../assets/scene01/grass/grass_05.png';
import grass06 from '../../../assets/scene01/grass/grass_06.png';
import grass07 from '../../../assets/scene01/grass/grass_07.png';
import grass08 from '../../../assets/scene01/grass/grass_08.png';
import grass09 from '../../../assets/scene01/grass/grass_09.png';
import grass10 from '../../../assets/scene01/grass/grass_10.png';

import butterfly01 from '../../../assets/scene01/butterfly/butterfly_01.png';
import butterfly02 from '../../../assets/scene01/butterfly/butterfly_02.png';
import butterfly03 from '../../../assets/scene01/butterfly/butterfly_03.png';
import butterfly04 from '../../../assets/scene01/butterfly/butterfly_04.png';

import ksit1 from '../../../assets/Kopanang_sit/ksit_1.png';
import ksit2 from '../../../assets/Kopanang_sit/ksit_2.png';
import ksit3 from '../../../assets/Kopanang_sit/ksit_3.png';
import ksit4 from '../../../assets/Kopanang_sit/ksit_4.png';
import ksit5 from '../../../assets/Kopanang_sit/ksit_5.png';
import ksit6 from '../../../assets/Kopanang_sit/ksit_6.png';
import ksit7 from '../../../assets/Kopanang_sit/ksit7.png';
import ksit8 from '../../../assets/Kopanang_sit/ksit_8.png';

import lsit1 from '../../../assets/lerato_sit/sit_1.png';
import lsit2 from '../../../assets/lerato_sit/sit_2.png';
import lsit3 from '../../../assets/lerato_sit/sit_3.png';
import lsit4 from '../../../assets/lerato_sit/sit_4.png';
import lsit5 from '../../../assets/lerato_sit/sit_5.png';

import mouthA from '../../../assets/mouth/mouth_a.png';
import mouthE from '../../../assets/mouth/mouth_e.png';
import mouthI from '../../../assets/mouth/mouth_i.png';
import mouthO from '../../../assets/mouth/mouth_o.png';
import mouthU from '../../../assets/mouth/mouth_u.png';

const GRASS_ASSETS = [
  { src: grass01, x: -380, y: 280, size: 220 },
  { src: grass02, x: -240, y: 300, size: 180 },
  { src: grass03, x: -100, y: 320, size: 150 },
  { src: grass04, x: 60,   y: 330, size: 200 },
  { src: grass05, x: 200,  y: 310, size: 180 },
  { src: grass06, x: 340,  y: 320, size: 160 },
  { src: grass07, x: -300, y: 340, size: 200 },
  { src: grass08, x: -150, y: 350, size: 190 },
  { src: grass09, x: 30,   y: 360, size: 210 },
  { src: grass10, x: 180,  y: 350, size: 200 },
];

const BUTTERFLY_FRAMES = [butterfly01, butterfly02, butterfly03, butterfly04];

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
  const [leratoPos, setLeratoPos] = useState({ x: 200, y: -50, scale: 1 });
  const [kopanangTalking, setKopanangTalking] = useState(false);
  const [leratoTalking, setLeratoTalking] = useState(false);
  const [mouthIndex, setMouthIndex] = useState(0);
  const mouthTimerRef = useRef(null);

  const [kopanangMouthPos, setKopanangMouthPos] = useState({ x: 0, y: -180 });
  const [leratoMouthPos, setLeratoMouthPos] = useState({ x: 0, y: -180 });
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

  const [grassEnabled, setGrassEnabled] = useState(true);
  const [grassWindSpeed, setGrassWindSpeed] = useState(3);
  const [grassPositions, setGrassPositions] = useState(
    GRASS_ASSETS.map((g) => ({ x: g.x, y: g.y, size: g.size }))
  );
  const [selectedGrassIdx, setSelectedGrassIdx] = useState(0);

  const [butterflyEnabled, setButterflyEnabled] = useState(true);
  const [butterflyCount, setButterflyCount] = useState(4);
  const [butterflySpeed, setButterflySpeed] = useState(2);
  const [butterflies, setButterflies] = useState([]);
  const [grassSway, setGrassSway] = useState(0);

  const [kopanangAudioUrl, setKopanangAudioUrl] = useState(null);
  const [leratoAudioUrl, setLeratoAudioUrl] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioSourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  const [draggingCharacter, setDraggingCharacter] = useState(null);
  const [draggingMouth, setDraggingMouth] = useState(null);
  const [draggingCamera, setDraggingCamera] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, charX: 0, charY: 0, mouthX: 0, mouthY: 0 });
  const cameraDragStartRef = useRef({ mouseX: 0, mouseY: 0, camX: 0, camY: 0 });
  const stageRef = useRef(null);

  const backgroundImgRef = useRef(null);
  const kopanangImgRef = useRef(null);
  const leratoImgRef = useRef(null);
  const kopanangMouthImgRef = useRef(null);
  const leratoMouthImgRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const canvasRef = useRef(null);
  const keysPressed = useRef({});
  const muxerRef = useRef(null);
  const videoEncoderRef = useRef(null);

  const imagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesLoadedRef = useRef(false);

  const [timelineKeyframes, setTimelineKeyframes] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineDuration, setTimelineDuration] = useState(10);
  const playbackFrameRef = useRef(null);
  const playbackStartTimeRef = useRef(null);

  // ────────── Unified camera / view ──────────
  // A single zoom + offset applied identically to every layer.
  const viewZoom = backgroundScale * Math.max(0.1, 1 + camera.forward / 500);
  const camX = camera.x;
  const camY = camera.y * 0.5;

  // Preload all images
  useEffect(() => {
    let loaded = 0;
    const total =
      SCENE_LAYERS.length + KOPANANG_SIT.length + LERATO_SIT.length + MOUTH_FRAMES.length +
      GRASS_ASSETS.length + BUTTERFLY_FRAMES.length;
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
    SCENE_LAYERS.forEach((l) => (imagesRef.current[l.id] = loadImage(l.src)));
    KOPANANG_SIT.forEach((p) => (imagesRef.current[`kopanang_${p.id}`] = loadImage(p.src)));
    LERATO_SIT.forEach((p) => (imagesRef.current[`lerato_${p.id}`] = loadImage(p.src)));
    MOUTH_FRAMES.forEach((m) => (imagesRef.current[`mouth_${m.id}`] = loadImage(m.src)));
    GRASS_ASSETS.forEach((g, i) => (imagesRef.current[`grass_${i}`] = loadImage(g.src)));
    BUTTERFLY_FRAMES.forEach((b, i) => (imagesRef.current[`butterfly_${i}`] = loadImage(b)));
  }, []);

  // Init butterflies
  useEffect(() => {
    const newB = [];
    for (let i = 0; i < butterflyCount; i++) {
      newB.push({
        id: i,
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * butterflySpeed * 2,
        vy: (Math.random() - 0.5) * butterflySpeed,
        scale: 0.6 + Math.random() * 0.6,
        frame: Math.floor(Math.random() * 4),
        frameTimer: 0,
      });
    }
    setButterflies(newB);
  }, [butterflyCount, butterflySpeed]);

  // Animate butterflies
  useEffect(() => {
    if (!butterflyEnabled) return;
    let id;
    const animate = () => {
      setButterflies((prev) =>
        prev.map((b) => {
          let x = b.x + b.vx;
          let y = b.y + b.vy;
          let frame = b.frame;
          let ft = b.frameTimer + 1;
          if (ft >= 6) { frame = (frame + 1) % 4; ft = 0; }
          if (x > 700) { x = -700; y = (Math.random() - 0.5) * 400; }
          if (x < -700) { x = 700; y = (Math.random() - 0.5) * 400; }
          if (y > 400) y = -400;
          if (y < -400) y = 400;
          return { ...b, x, y, frame, frameTimer: ft };
        })
      );
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [butterflyEnabled]);

  // Animate grass sway
  useEffect(() => {
    if (!grassEnabled) return;
    let id, t = 0;
    const animate = () => {
      t += 0.02 * grassWindSpeed;
      setGrassSway(Math.sin(t) * 2);
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [grassEnabled, grassWindSpeed]);

  const rangeLimits = unlimitedMode
    ? { cameraX: 10000, cameraY: 10000, forward: 5000 }
    : { cameraX: 200, cameraY: 200, forward: 100 };

  // ────────── Transforms (unified) ──────────
  const getBackgroundTransform = useCallback(() => {
    return {
      transform: `translate(${camX}px, ${camY}px) scale(${viewZoom})`,
      opacity: 1,
      transformOrigin: 'center center',
    };
  }, [camX, camY, viewZoom]);

  const getCharacterTransform = (pos) => {
    const finalX = pos.x * viewZoom + camX;
    const finalY = pos.y * viewZoom + camY;
    const finalScale = pos.scale * viewZoom;
    return {
      transform: `translate(${finalX}px, ${finalY}px) scale(${finalScale})`,
      opacity: 1,
      transformOrigin: 'center bottom',
    };
  };

  const handleKeyDown = useCallback((e) => { keysPressed.current[e.key.toLowerCase()] = true; }, []);
  const handleKeyUp = useCallback((e) => { keysPressed.current[e.key.toLowerCase()] = false; }, []);

  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.4 * cameraSpeed;
      const cur = { ...camera };
      if (unlimitedMode) {
        if (keysPressed.current['w']) cur.forward += speed * 20;
        if (keysPressed.current['s']) cur.forward -= speed * 20;
        if (keysPressed.current['a']) cur.x -= speed;
        if (keysPressed.current['d']) cur.x += speed;
      } else {
        if (keysPressed.current['w']) cur.forward = Math.min(cur.forward + speed * 5, rangeLimits.forward);
        if (keysPressed.current['s']) cur.forward = Math.max(cur.forward - speed * 5, -rangeLimits.forward);
        if (keysPressed.current['a']) cur.x = Math.max(cur.x - speed, -rangeLimits.cameraX);
        if (keysPressed.current['d']) cur.x = Math.min(cur.x + speed, rangeLimits.cameraX);
      }
      setCamera(cur);

      const cs = 5;
      if (selectMode === 'character') {
        if (selectedCharacter === 'kopanang' && !lockKopanangPos) {
          setKopanangPos((prev) => {
            let nx = prev.x, ny = prev.y;
            if (keysPressed.current['arrowleft']) nx -= cs;
            if (keysPressed.current['arrowright']) nx += cs;
            if (keysPressed.current['arrowup']) ny -= cs;
            if (keysPressed.current['arrowdown']) ny += cs;
            return { ...prev, x: nx, y: ny };
          });
        }
        if (selectedCharacter === 'lerato' && !lockLeratoPos) {
          setLeratoPos((prev) => {
            let nx = prev.x, ny = prev.y;
            if (keysPressed.current['arrowleft']) nx -= cs;
            if (keysPressed.current['arrowright']) nx += cs;
            if (keysPressed.current['arrowup']) ny -= cs;
            if (keysPressed.current['arrowdown']) ny += cs;
            return { ...prev, x: nx, y: ny };
          });
        }
      } else {
        const ms = 3;
        if (selectedCharacter === 'kopanang') {
          setKopanangMouthPos((prev) => {
            let nx = prev.x, ny = prev.y;
            if (keysPressed.current['arrowleft']) nx -= ms;
            if (keysPressed.current['arrowright']) nx += ms;
            if (keysPressed.current['arrowup']) ny -= ms;
            if (keysPressed.current['arrowdown']) ny += ms;
            return { x: nx, y: ny };
          });
        } else {
          setLeratoMouthPos((prev) => {
            let nx = prev.x, ny = prev.y;
            if (keysPressed.current['arrowleft']) nx -= ms;
            if (keysPressed.current['arrowright']) nx += ms;
            if (keysPressed.current['arrowup']) ny -= ms;
            if (keysPressed.current['arrowdown']) ny += ms;
            return { x: nx, y: ny };
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
    if (selectedCharacter === 'kopanang' && !lockKopanangPos)
      setKopanangPos((p) => ({ ...p, scale: Math.max(0.2, Math.min(3, p.scale + delta)) }));
    else if (selectedCharacter === 'lerato' && !lockLeratoPos)
      setLeratoPos((p) => ({ ...p, scale: Math.max(0.2, Math.min(3, p.scale + delta)) }));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    scaleCharacter(e.deltaY > 0 ? -0.05 : 0.05);
  };

  useEffect(() => {
    if ((kopanangTalking || leratoTalking) && !audioPlaying) {
      mouthTimerRef.current = setInterval(
        () => setMouthIndex((p) => (p + 1) % MOUTH_FRAMES.length),
        200
      );
    }
    return () => clearInterval(mouthTimerRef.current);
  }, [kopanangTalking, leratoTalking, audioPlaying]);

  const handleCharacterMouseDown = (e, character) => {
    if (selectMode !== 'character') return;
    if (character === 'kopanang' && lockKopanangPos) return;
    if (character === 'lerato' && lockLeratoPos) return;
    e.preventDefault(); e.stopPropagation();
    setDraggingCharacter(character);
    setSelectedCharacter(character);
    const r = stageRef.current.getBoundingClientRect();
    const pos = character === 'kopanang' ? kopanangPos : leratoPos;
    dragStartRef.current = { mouseX: e.clientX - r.left, mouseY: e.clientY - r.top, charX: pos.x, charY: pos.y };
  };

  const handleMouthMouseDown = (e, character) => {
    if (selectMode !== 'mouth') return;
    e.preventDefault(); e.stopPropagation();
    setDraggingMouth(character);
    setSelectedCharacter(character);
    const r = stageRef.current.getBoundingClientRect();
    const mp = character === 'kopanang' ? kopanangMouthPos : leratoMouthPos;
    dragStartRef.current = { mouseX: e.clientX - r.left, mouseY: e.clientY - r.top, mouthX: mp.x, mouthY: mp.y };
  };

  const handleStageMouseDown = (e) => {
    if (draggingCharacter || draggingMouth) return;
    if (selectMode !== 'character') return;
    const r = stageRef.current.getBoundingClientRect();
    cameraDragStartRef.current = { mouseX: e.clientX - r.left, mouseY: e.clientY - r.top, camX: camera.x, camY: camera.y };
    setDraggingCamera(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const r = stageRef.current.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      if (draggingCamera) {
        const dx = mx - cameraDragStartRef.current.mouseX;
        const dy = my - cameraDragStartRef.current.mouseY;
        setCamera((p) => ({ ...p, x: cameraDragStartRef.current.camX - dx, y: cameraDragStartRef.current.camY - dy }));
      }
      if (draggingCharacter) {
        const dx = (mx - dragStartRef.current.mouseX) / viewZoom;
        const dy = (my - dragStartRef.current.mouseY) / viewZoom;
        const nx = dragStartRef.current.charX + dx;
        const ny = dragStartRef.current.charY + dy;
        if (draggingCharacter === 'kopanang' && !lockKopanangPos) setKopanangPos((p) => ({ ...p, x: nx, y: ny }));
        else if (draggingCharacter === 'lerato' && !lockLeratoPos) setLeratoPos((p) => ({ ...p, x: nx, y: ny }));
      } else if (draggingMouth) {
        const dx = mx - dragStartRef.current.mouseX;
        const dy = my - dragStartRef.current.mouseY;
        const nx = dragStartRef.current.mouthX + dx;
        const ny = dragStartRef.current.mouthY + dy;
        if (draggingMouth === 'kopanang') setKopanangMouthPos({ x: nx, y: ny });
        else setLeratoMouthPos({ x: nx, y: ny });
      }
    };
    const handleMouseUp = () => { setDraggingCamera(false); setDraggingCharacter(null); setDraggingMouth(null); };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
  }, [draggingCamera, draggingCharacter, draggingMouth, lockKopanangPos, lockLeratoPos, viewZoom]);

  const handleStageClick = (e) => {
    if (draggingCharacter || draggingMouth || draggingCamera) return;
    const r = stageRef.current.getBoundingClientRect();
    const ox = e.clientX - r.left - r.width / 2;
    const oy = e.clientY - r.top - r.height / 2;
    if (selectMode === 'character') {
      const worldX = (ox - camX) / viewZoom;
      const worldY = (oy - camY) / viewZoom;
      if (selectedCharacter === 'kopanang' && !lockKopanangPos) setKopanangPos((p) => ({ ...p, x: worldX, y: worldY }));
      if (selectedCharacter === 'lerato' && !lockLeratoPos) setLeratoPos((p) => ({ ...p, x: worldX, y: worldY }));
    } else {
      if (selectedCharacter === 'kopanang') setKopanangMouthPos({ x: (ox - kopanangPos.x) / kopanangPos.scale, y: (oy - kopanangPos.y) / kopanangPos.scale });
      else setLeratoMouthPos({ x: (ox - leratoPos.x) / leratoPos.scale, y: (oy - leratoPos.y) / leratoPos.scale });
    }
  };

  const nudgeCharacter = (axis, direction) => {
    const amt = 10;
    if (selectMode !== 'character') return;
    if (selectedCharacter === 'kopanang' && !lockKopanangPos) setKopanangPos((p) => ({ ...p, [axis]: p[axis] + direction * amt }));
    else if (selectedCharacter === 'lerato' && !lockLeratoPos) setLeratoPos((p) => ({ ...p, [axis]: p[axis] + direction * amt }));
  };

  const nudgeScale = (dir) => scaleCharacter(dir * 0.1);

  const nudgeMouth = (character, axis, direction) => {
    const amt = 5;
    if (character === 'kopanang') setKopanangMouthPos((p) => ({ ...p, [axis]: p[axis] + direction * amt }));
    else setLeratoMouthPos((p) => ({ ...p, [axis]: p[axis] + direction * amt }));
  };

  const resetMouth = (character) => {
    const d = { x: 0, y: -180 };
    if (character === 'kopanang') setKopanangMouthPos(d);
    else setLeratoMouthPos(d);
  };

  const nudgeMouthScale = (character, direction) => {
    const amt = 0.1;
    if (character === 'kopanang') setKopanangMouthScale((p) => Math.max(0.2, Math.min(5, p + direction * amt)));
    else setLeratoMouthScale((p) => Math.max(0.2, Math.min(5, p + direction * amt)));
  };

  const resetKopanangPos = () => setKopanangPos({ x: -100, y: 50, scale: 1 });
  const resetLeratoPos = () => setLeratoPos({ x: 200, y: -50, scale: 1 });
  const resetCamera = () => setCamera({ x: 0, y: 0, forward: 0 });

  const nudgeCamera = (axis, direction) => setCamera((p) => ({ ...p, [axis]: p[axis] + direction * 20 }));
  const nudgeCameraForward = (direction) => setCamera((p) => ({ ...p, forward: Math.max(-500, Math.min(5000, p.forward + direction * 25)) }));

  const nudgeGrass = (axis, direction) => {
    setGrassPositions((prev) =>
      prev.map((g, i) => (i === selectedGrassIdx ? { ...g, [axis]: g[axis] + direction * 10 } : g))
    );
  };

  const nudgeGrassSize = (direction) => {
    setGrassPositions((prev) =>
      prev.map((g, i) =>
        i === selectedGrassIdx ? { ...g, size: Math.max(50, Math.min(500, g.size + direction * 10)) } : g
      )
    );
  };

  const resetGrassPositions = () => {
    setGrassPositions(GRASS_ASSETS.map((g) => ({ x: g.x, y: g.y, size: g.size })));
  };

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AC();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.5;
      dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);
    }
    if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
  };

  const handleAudioUpload = (e, character) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (character === 'kopanang') setKopanangAudioUrl(url);
    else setLeratoAudioUrl(url);
  };

  const playAudioForCharacter = async (character) => {
    const url = character === 'kopanang' ? kopanangAudioUrl : leratoAudioUrl;
    if (!url) return;
    try {
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      await audioRef.current.play();
      if (character === 'kopanang') setKopanangTalking(true);
      else setLeratoTalking(true);
      setAudioPlaying(true);
      initializeAudioContext();
      if (!audioSourceRef.current) {
        audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        audioSourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
      const updateAmplitude = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const v = (dataArrayRef.current[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        if (rms > 0.35) setMouthIndex(0);
        else if (rms > 0.18) setMouthIndex(3);
        else if (rms > 0.06) setMouthIndex(1);
        else setMouthIndex(4);
        animationFrameRef.current = requestAnimationFrame(updateAmplitude);
      };
      updateAmplitude();
    } catch (err) { console.error(err); }
  };

  const stopAudio = () => {
    if (audioRef.current) audioRef.current.pause();
    setKopanangTalking(false);
    setLeratoTalking(false);
    setAudioPlaying(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const addKeyframe = () => {
    const kf = {
      id: Date.now(), time: currentTime,
      camera: { ...camera }, kopanangPos: { ...kopanangPos }, leratoPos: { ...leratoPos },
      kopanangMouthPos: { ...kopanangMouthPos }, leratoMouthPos: { ...leratoMouthPos },
      selectedKopanangPose, selectedLeratoPose, kopanangTalking, leratoTalking, backgroundScale,
    };
    setTimelineKeyframes((p) => [...p, kf].sort((a, b) => a.time - b.time));
  };

  const deleteKeyframe = (id) => setTimelineKeyframes((p) => p.filter((k) => k.id !== id));

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
    let kf1 = sorted[0], kf2 = sorted[sorted.length - 1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (time >= sorted[i].time && time <= sorted[i + 1].time) { kf1 = sorted[i]; kf2 = sorted[i + 1]; break; }
    }
    if (time <= kf1.time) kf2 = kf1;
    if (time >= kf2.time) kf1 = kf2;
    const t = (time - kf1.time) / (kf2.time - kf1.time || 1);
    setCamera({ x: lerp(kf1.camera.x, kf2.camera.x, t), y: lerp(kf1.camera.y, kf2.camera.y, t), forward: lerp(kf1.camera.forward, kf2.camera.forward, t) });
    setKopanangPos({ x: lerp(kf1.kopanangPos.x, kf2.kopanangPos.x, t), y: lerp(kf1.kopanangPos.y, kf2.kopanangPos.y, t), scale: lerp(kf1.kopanangPos.scale, kf2.kopanangPos.scale, t) });
    setLeratoPos({ x: lerp(kf1.leratoPos.x, kf2.leratoPos.x, t), y: lerp(kf1.leratoPos.y, kf2.leratoPos.y, t), scale: lerp(kf1.leratoPos.scale, kf2.leratoPos.scale, t) });
    setKopanangMouthPos({ x: lerp(kf1.kopanangMouthPos.x, kf2.kopanangMouthPos.x, t), y: lerp(kf1.kopanangMouthPos.y, kf2.kopanangMouthPos.y, t) });
    setLeratoMouthPos({ x: lerp(kf1.leratoMouthPos.x, kf2.leratoMouthPos.x, t), y: lerp(kf1.leratoMouthPos.y, kf2.leratoMouthPos.y, t) });
    setBackgroundScale(lerp(kf1.backgroundScale, kf2.backgroundScale, t));
    setSelectedKopanangPose(t < 0.5 ? kf1.selectedKopanangPose : kf2.selectedKopanangPose);
    setSelectedLeratoPose(t < 0.5 ? kf1.selectedLeratoPose : kf2.selectedLeratoPose);
    setKopanangTalking(t < 0.5 ? kf1.kopanangTalking : kf2.kopanangTalking);
    setLeratoTalking(t < 0.5 ? kf1.leratoTalking : kf2.leratoTalking);
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

  const pause = () => { setIsPlaying(false); if (playbackFrameRef.current) cancelAnimationFrame(playbackFrameRef.current); };
  const stop = () => {
    setIsPlaying(false);
    if (playbackFrameRef.current) cancelAnimationFrame(playbackFrameRef.current);
    setCurrentTime(0);
    if (timelineKeyframes.length > 0) selectKeyframe(timelineKeyframes[0]);
  };

  useEffect(() => () => { if (playbackFrameRef.current) cancelAnimationFrame(playbackFrameRef.current); }, []);

  // Canvas draw loop
  useEffect(() => {
    let animId;
    const animate = () => {
      const canvas = canvasRef.current;
      if (canvas && imagesLoadedRef.current) {
        const ctx = canvas.getContext('2d');
        drawSceneToCanvas(canvas, ctx, {
          stageRef, imagesRef,
          backgroundImgRef, kopanangImgRef, leratoImgRef,
          kopanangMouthImgRef, leratoMouthImgRef,
          layerVisibility, selectedKopanangPose, selectedLeratoPose,
          kopanangTalking, leratoTalking, mouthIndex,
          grassEnabled, grassSway, grassPositions,
          butterflyEnabled, butterflies, MOUTH_FRAMES,
          viewZoom, camX, camY,
        });
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [
    layerVisibility, selectedKopanangPose, selectedLeratoPose,
    kopanangTalking, leratoTalking, mouthIndex,
    grassEnabled, grassSway, grassPositions,
    butterflyEnabled, butterflies,
    viewZoom, camX, camY,
  ]);

  const startRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: 'avc', width: canvas.width, height: canvas.height, firstTimestampBehavior: 'offset' },
      fastStart: 'in-memory',
    });
    muxerRef.current = muxer;
    const enc = new VideoEncoder({
      output: (c, m) => muxer.addVideoChunk(c, m),
      error: (e) => console.error('Encoder error:', e),
    });
    videoEncoderRef.current = enc;
    enc.configure({ codec: 'avc1.42001f', width: canvas.width, height: canvas.height, bitrate: 5_000_000, framerate: 15 });
    let fn = 0;
    const fi = 1000000 / 15;
    isRecordingRef.current = true;
    const loop = () => {
      if (!isRecordingRef.current) return;
      if (videoEncoderRef.current.encodeQueueSize > 2) { requestAnimationFrame(loop); return; }
      const frame = new VideoFrame(canvas, { timestamp: fn * fi });
      videoEncoderRef.current.encode(frame, { keyFrame: fn % 15 === 0 });
      frame.close();
      fn++;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
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
            {layerVisibility.background && (
              <div className="scene-layer" style={{ zIndex: 0, ...getBackgroundTransform() }}>
                <img ref={backgroundImgRef} src={backgroundImg} alt="Background" className="scene-layer-img" draggable={false} />
              </div>
            )}

            {layerVisibility.kopanang && (
              <div
                className="scene-layer draggable-character"
                style={{
                  zIndex: 10,
                  ...getCharacterTransform(kopanangPos),
                  cursor: selectMode === 'character' ? 'grab' : 'default',
                  outline: showSelectionOutline && selectedCharacter === 'kopanang' ? '2px solid #ffd700' : 'none',
                }}
                onMouseDown={(e) => handleCharacterMouseDown(e, 'kopanang')}
              >
                <img
                  ref={kopanangImgRef}
                  src={KOPANANG_SIT.find((p) => p.id === selectedKopanangPose).src}
                  alt="Kopanang"
                  className="scene-layer-img"
                  draggable={false}
                />
                {kopanangTalking && (
                  <div
                    style={{
                      position: 'absolute', left: '50%', top: '50%',
                      width: `${30 * kopanangMouthScale}px`,
                      height: `${30 * kopanangMouthScale}px`,
                      transform: `translate(-50%, -50%) translate(${kopanangMouthPos.x}px, ${kopanangMouthPos.y}px)`,
                      zIndex: 20,
                      cursor: selectMode === 'mouth' ? 'grab' : 'default',
                      outline: showMouthOutline && selectMode === 'mouth' ? '2px dashed #00ff00' : 'none',
                    }}
                    onMouseDown={(e) => handleMouthMouseDown(e, 'kopanang')}
                  >
                    <img ref={kopanangMouthImgRef} src={MOUTH_FRAMES[mouthIndex].src} alt="Mouth" style={{ width: '100%', height: '100%' }} />
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
                  cursor: selectMode === 'character' ? 'grab' : 'default',
                  outline: showSelectionOutline && selectedCharacter === 'lerato' ? '2px solid #ffd700' : 'none',
                }}
                onMouseDown={(e) => handleCharacterMouseDown(e, 'lerato')}
              >
                <img
                  ref={leratoImgRef}
                  src={LERATO_SIT.find((p) => p.id === selectedLeratoPose).src}
                  alt="Lerato"
                  className="scene-layer-img"
                  draggable={false}
                />
                {leratoTalking && (
                  <div
                    style={{
                      position: 'absolute', left: '50%', top: '50%',
                      width: `${30 * leratoMouthScale}px`,
                      height: `${30 * leratoMouthScale}px`,
                      transform: `translate(-50%, -50%) translate(${leratoMouthPos.x}px, ${leratoMouthPos.y}px)`,
                      zIndex: 20,
                      cursor: selectMode === 'mouth' ? 'grab' : 'default',
                      outline: showMouthOutline && selectMode === 'mouth' ? '2px dashed #00ff00' : 'none',
                    }}
                    onMouseDown={(e) => handleMouthMouseDown(e, 'lerato')}
                  >
                    <img ref={leratoMouthImgRef} src={MOUTH_FRAMES[mouthIndex].src} alt="Mouth" style={{ width: '100%', height: '100%' }} />
                  </div>
                )}
              </div>
            )}

            {grassEnabled && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                {grassPositions.map((g, idx) => {
                  const img = imagesRef.current[`grass_${idx}`];
                  if (!img) return null;
                  const w = g.size * viewZoom;
                  const h = img.width ? (img.height / img.width) * w : w;
                  return (
                    <img
                      key={idx}
                      src={GRASS_ASSETS[idx].src}
                      alt="grass"
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${g.x * viewZoom + camX}px)`,
                        top: `calc(50% + ${g.y * viewZoom + camY}px)`,
                        width: `${w}px`,
                        height: `${h}px`,
                        transform: `translate(-50%, -100%) rotate(${grassSway * (0.5 + idx * 0.15)}deg)`,
                        transformOrigin: 'bottom center',
                        outline: selectedGrassIdx === idx && grassEnabled ? '2px dashed #00ff00' : 'none',
                      }}
                    />
                  );
                })}
              </div>
            )}

            {butterflyEnabled &&
              butterflies.map((bf) => {
                const img = imagesRef.current[`butterfly_${bf.frame}`];
                if (!img) return null;
                const w = 60 * bf.scale * viewZoom;
                const h = img.width ? (img.height / img.width) * w : w;
                return (
                  <img
                    key={bf.id}
                    src={BUTTERFLY_FRAMES[bf.frame]}
                    alt={`butterfly-${bf.id}`}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${bf.x * viewZoom + camX}px)`,
                      top: `calc(50% + ${bf.y * viewZoom + camY}px)`,
                      width: `${w}px`,
                      height: `${h}px`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                      zIndex: 8,
                    }}
                  />
                );
              })}
          </div>

          <canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }} />
          {isRecording && <div className="recording-indicator"><span className="rec-dot"></span> REC</div>}
        </div>

        <Scene01Controls
          debugMode={debugMode} setDebugMode={setDebugMode}
          timelineKeyframes={timelineKeyframes} currentTime={currentTime}
          timelineDuration={timelineDuration} setTimelineDuration={setTimelineDuration}
          isPlaying={isPlaying}
          play={play} pause={pause} stop={stop}
          addKeyframe={addKeyframe} selectKeyframe={selectKeyframe} deleteKeyframe={deleteKeyframe}
          isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording}
          unlimitedMode={unlimitedMode} setUnlimitedMode={setUnlimitedMode}
          nudgeCamera={nudgeCamera} nudgeCameraForward={nudgeCameraForward} resetCamera={resetCamera}
          cameraSpeed={cameraSpeed} setCameraSpeed={setCameraSpeed}
          backgroundScale={backgroundScale} setBackgroundScale={setBackgroundScale}
          layerVisibility={layerVisibility} setLayerVisibility={setLayerVisibility}
          grassEnabled={grassEnabled} setGrassEnabled={setGrassEnabled}
          grassWindSpeed={grassWindSpeed} setGrassWindSpeed={setGrassWindSpeed}
          grassPositions={grassPositions} selectedGrassIdx={selectedGrassIdx} setSelectedGrassIdx={setSelectedGrassIdx}
          nudgeGrass={nudgeGrass} nudgeGrassSize={nudgeGrassSize} resetGrassPositions={resetGrassPositions}
          butterflyEnabled={butterflyEnabled} setButterflyEnabled={setButterflyEnabled}
          butterflyCount={butterflyCount} setButterflyCount={setButterflyCount}
          butterflySpeed={butterflySpeed} setButterflySpeed={setButterflySpeed}
          selectedCharacter={selectedCharacter} setSelectedCharacter={setSelectedCharacter}
          selectMode={selectMode} setSelectMode={setSelectMode}
          nudgeCharacter={nudgeCharacter} nudgeScale={nudgeScale} nudgeMouthScale={nudgeMouthScale}
          showSelectionOutline={showSelectionOutline} setShowSelectionOutline={setShowSelectionOutline}
          showMouthOutline={showMouthOutline} setShowMouthOutline={setShowMouthOutline}
          lockKopanangPos={lockKopanangPos} setLockKopanangPos={setLockKopanangPos}
          lockLeratoPos={lockLeratoPos} setLockLeratoPos={setLockLeratoPos}
          resetKopanangPos={resetKopanangPos} resetLeratoPos={resetLeratoPos}
          kopanangAudioUrl={kopanangAudioUrl} leratoAudioUrl={leratoAudioUrl}
          handleAudioUpload={handleAudioUpload} playAudioForCharacter={playAudioForCharacter} stopAudio={stopAudio}
          audioPlaying={audioPlaying}
          KOPANANG_SIT={KOPANANG_SIT} LERATO_SIT={LERATO_SIT}
          selectedKopanangPose={selectedKopanangPose} setSelectedKopanangPose={setSelectedKopanangPose}
          selectedLeratoPose={selectedLeratoPose} setSelectedLeratoPose={setSelectedLeratoPose}
          kopanangTalking={kopanangTalking} setKopanangTalking={setKopanangTalking}
          leratoTalking={leratoTalking} setLeratoTalking={setLeratoTalking}
          kopanangMouthPos={kopanangMouthPos} leratoMouthPos={leratoMouthPos}
          nudgeMouth={nudgeMouth} resetMouth={resetMouth}
        />
      </div>
    </div>
  );
}

export default Scene01CameraTest;