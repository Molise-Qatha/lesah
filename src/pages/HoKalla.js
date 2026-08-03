import React, { useEffect, useRef, useState } from 'react';
import './HoKalla.css';

// ---- SPRITE CONFIGURATION ----
const SPRITE_CONFIG = {
  khotso: {
    basePath: '/images/characters/khotso/',
    framesPerState: {
      idle: 1,
      walk: 5,
      jump: 7,
      land: 7,
      crouch: 7,
      attack: 3,
    },
  },
  thabo: {
    basePath: '/images/characters/thabo/',
    framesPerState: {
      idle: 1,
      walk: 3,
      jump: 6,
      land: 3,
      crouch: 4,
      attack: 5,
    },
    nameSuffix: '-removebg-preview',
  },
  animationSpeed: 10,
  targetHeight: 180,
};

const ARENA_PATH = '/images/arenas/arena1.png';
const PLAYER_MAX_HEALTH = 100;

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});
  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const touchAttack = useRef(false);
  const jumpRequested = useRef(false);

  // Player (Khotso)
  const player = useRef({
    x: 200,
    y: 0,
    width: 100,
    height: SPRITE_CONFIG.targetHeight,
    vx: 0,
    vy: 0,
    speed: 3.5,
    jumpForce: -9,
    facingRight: true,
    grounded: false,
    state: 'idle', // Starts in idle
    landTimer: 0,
    currentFrame: 0,
    frameTimer: 0,
    landAnimFinished: false,
    crouching: false,
    attackLock: false,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
  });

  // Opponent (Thabo)
  const opponent = useRef({
    x: 750, 
    y: 0,
    width: 100,
    height: SPRITE_CONFIG.targetHeight,
    vx: 0,
    vy: 0,
    speed: 0, 
    facingRight: false,
    state: 'idle',
    currentFrame: 0,
    frameTimer: 0,
    grounded: true,
    attackLock: false,
    landTimer: 0,
    landAnimFinished: false,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
  });

  const camera = useRef({ x: 0, y: 0 });
  const fpsState = useRef({
    lastTime: 0, fps: 0, frameCount: 0, fpsUpdateTime: 0,
  });
  const groundFrac = 0.65;

  // ⚠️ TEMPORARY TEST IMAGES - Replace these if you know the exact names!
  // If your 'idle' frame is the first walk frame, this will work perfectly.
  const khotsoIdleImg = useRef(null);
  const thaboIdleImg = useRef(null);
  const arenaImage = useRef(null);
  const arenaLoaded = useRef(false);

  // ---------- Load sprites (SIMPLIFIED FOR TESTING) ----------
  useEffect(() => {
    // Load Arena
    const arenaImg = new Image();
    arenaImg.src = ARENA_PATH;
    arenaImg.onload = () => { arenaImage.current = arenaImg; arenaLoaded.current = true; };

    // 🛠️ FORCE LOAD KHOTSO IDLE
    khotsoIdleImg.current = new Image();
    khotsoIdleImg.current.src = `${SPRITE_CONFIG.khotso.basePath}walk1.png`;
    khotsoIdleImg.current.onload = () => {
      console.log("Khotso Idle Loaded!");
      // Set his actual size based on the real image
      player.current.width = khotsoIdleImg.current.naturalWidth;
      player.current.height = khotsoIdleImg.current.naturalHeight;
    };

    // 🛠️ FORCE LOAD THABO IDLE
    thaboIdleImg.current = new Image();
    thaboIdleImg.current.src = `${SPRITE_CONFIG.thabo.basePath}walk1-removebg-preview.png`;
    thaboIdleImg.current.onload = () => {
      console.log("Thabo Idle Loaded!");
      opponent.current.width = thaboIdleImg.current.naturalWidth;
      opponent.current.height = thaboIdleImg.current.naturalHeight;
    };

  }, []);

  // ---------- Touch handlers ----------
  const handleTouchLeftStart = (e) => { e.preventDefault(); touchMoveLeft.current = true; };
  const handleTouchLeftEnd = (e) => { e.preventDefault(); touchMoveLeft.current = false; };
  const handleTouchRightStart = (e) => { e.preventDefault(); touchMoveRight.current = true; };
  const handleTouchRightEnd = (e) => { e.preventDefault(); touchMoveRight.current = false; };
  const handleTouchJumpStart = (e) => { e.preventDefault(); touchJump.current = true; };
  const handleTouchJumpEnd = (e) => { e.preventDefault(); touchJump.current = false; };
  const handleTouchAttackStart = (e) => { e.preventDefault(); touchAttack.current = true; };
  const handleTouchAttackEnd = (e) => { e.preventDefault(); touchAttack.current = false; };

  // ---------- Drawing functions ----------
  const drawBackground = (ctx, canvas) => {
    if (arenaLoaded.current && arenaImage.current) {
      const img = arenaImage.current;
      const w = canvas.width, h = canvas.height;
      ctx.drawImage(img, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const drawCharacter = (ctx, char, defaultImg) => {
    ctx.save();
    ctx.translate(char.x, char.y);
    if (!char.facingRight) ctx.scale(-1, 1);

    // 🛠️ PRIORITY 1: Use the forced idle image if available
    let imgToDraw = defaultImg.current;

    // 🛠️ PRIORITY 2: If this is a fallback block, replace with default image
    if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
      const dw = char.width || imgToDraw.naturalWidth;
      const dh = char.height || imgToDraw.naturalHeight;
      ctx.drawImage(imgToDraw, -dw / 2, -dh, dw, dh);
    } else {
      // If STILL not loaded, keep using the colored block so he never disappears
      ctx.fillStyle = char === player.current ? '#1565C0' : '#b71c1c';
      ctx.fillRect(-char.width / 2, -char.height, char.width, char.height);
    }

    ctx.restore();
  };

  const drawHUD = (ctx, canvas, p, o) => {
    const barW = 200, barH = 20;

    const kx = 20, ky = 20;
    ctx.fillStyle = '#333'; ctx.fillRect(kx, ky, barW, barH);
    const kFill = barW * (p.health / p.maxHealth);
    const gradK = ctx.createLinearGradient(kx, ky, kx + barW, ky);
    gradK.addColorStop(0, '#4caf50'); gradK.addColorStop(0.6, '#ffeb3b'); gradK.addColorStop(1, '#f44336');
    ctx.fillStyle = gradK; ctx.fillRect(kx, ky, kFill, barH);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(kx, ky, barW, barH);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.fillText('Khotso', kx, ky - 5);

    const tx = canvas.width - barW - 20, ty = 20;
    ctx.fillStyle = '#333'; ctx.fillRect(tx, ty, barW, barH);
    const tFill = barW * (o.health / o.maxHealth);
    const gradT = ctx.createLinearGradient(tx, ty, tx + barW, ty);
    gradT.addColorStop(0, '#4caf50'); gradT.addColorStop(0.6, '#ffeb3b'); gradT.addColorStop(1, '#f44336');
    ctx.fillStyle = gradT; ctx.fillRect(tx, ty, tFill, barH);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(tx, ty, barW, barH);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'right'; ctx.fillText('Thabo', canvas.width - 20, ty - 5);
    ctx.textAlign = 'start';
  };

  const drawTitle = (ctx, canvas) => {
    ctx.save();
    ctx.font = 'bold 36px Arial'; ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.fillText('Ho Kalla (Prototype)', canvas.width / 2, 80);
    ctx.restore();
  };

  const drawFPS = (ctx, canvas, fps) => {
    ctx.save();
    ctx.font = '16px monospace'; ctx.fillStyle = '#ffff00';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 3;
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${fps}`, 10, canvas.height - 10);
    ctx.restore();
  };

  // ---------- Physics & input ----------
  const update = (canvas, deltaTime) => {
    const p = player.current;
    const o = opponent.current;
    const groundY = canvas.height * groundFrac;

    const attackPressed = keys.current['j'] || keys.current['J'] || keys.current[' '] || touchAttack.current;
    if (attackPressed && !p.attackLock && p.grounded) {
      p.state = 'attack';
      p.frameTimer = 0;
      p.attackLock = true;
    }

    const crouchKey = keys.current['ArrowDown'] || keys.current['s'] || keys.current['S'];
    p.crouching = crouchKey && p.grounded && p.state !== 'attack';

    let moveDir = 0;
    if (!p.crouching && p.state !== 'attack') {
      if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A'] || touchMoveLeft.current) moveDir -= 1;
      if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D'] || touchMoveRight.current) moveDir += 1;
    }
    p.vx = moveDir * p.speed;

    // Player Jump
    if ((keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'] || touchJump.current) && p.grounded && !p.crouching && p.state !== 'attack') {
      p.vy = p.jumpForce;
      p.grounded = false;
      jumpRequested.current = true;
      p.frameTimer = 0;
      p.state = 'jump';
    } else {
      jumpRequested.current = false;
    }

    p.vy += 0.6;
    p.x += p.vx;
    p.y += p.vy;

    // Boundaries
    const boundaryBuffer = 50;
    const stageLeft = boundaryBuffer;
    const stageRight = canvas.width - boundaryBuffer - p.width;
    if (p.x < stageLeft) p.x = stageLeft;
    if (p.x > stageRight) p.x = stageRight;

    // Floor collision
    if (p.y > groundY) {
      p.y = groundY;
      p.vy = 0;
      if (!p.grounded) {
        p.landTimer = 10;
        p.state = 'land';
        p.frameTimer = 0;
        p.landAnimFinished = false;
      }
      p.grounded = true;
    } else {
      p.grounded = false;
    }

    // Face opponent
    o.facingRight = o.x < p.x;

    // Animation Timers
    if (p.state === 'attack') {
      p.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      if (Math.floor(p.frameTimer) >= SPRITE_CONFIG.khotso.framesPerState.attack) {
        p.attackLock = false;
        p.state = 'idle';
        p.frameTimer = 0;
      }
    } else if (p.state === 'walk' || p.state === 'jump') {
      p.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
    } else {
      p.frameTimer = 0;
    }
    p.currentFrame = p.frameTimer;

    // Khotso state handling
    if (p.state !== 'attack') {
      if (!p.grounded) {
        p.state = 'jump';
      } else {
        if (p.landTimer > 0) {
          p.state = 'land';
          p.landTimer--;
        } else if (p.crouching) {
          p.state = 'crouch';
        } else if (moveDir !== 0) {
          p.state = 'walk';
        } else {
          p.state = 'idle';
        }
      }
    }
  };

  // ---------- Game loop ----------
  let lastTimestamp = 0;
  const gameLoop = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const fs = fpsState.current;
    if (!fs.lastTime) fs.lastTime = timestamp;
    fs.frameCount++;
    if (timestamp - fs.fpsUpdateTime >= 1000) {
      fs.fps = Math.round((fs.frameCount * 1000) / (timestamp - fs.fpsUpdateTime));
      fs.frameCount = 0;
      fs.fpsUpdateTime = timestamp;
    }

    update(canvas, deltaTime);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);
    
    // 🛠️ DRAW CHARACTERS WITH THEIR FORCED IDLE IMAGES
    drawCharacter(ctx, opponent.current, thaboIdleImg);
    drawCharacter(ctx, player.current, khotsoIdleImg);
    
    drawTitle(ctx, canvas);
    drawFPS(ctx, canvas, fs.fps);
    drawHUD(ctx, canvas, player.current, opponent.current);

    animFrameId.current = requestAnimationFrame(gameLoop);
  };

  // ---------- Resize & setup ----------
  const handleResize = () => {
    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width; canvas.height = height;

    const groundY = canvas.height * groundFrac;
    player.current.y = groundY;
    player.current.grounded = true;
    opponent.current.y = groundY;
    opponent.current.grounded = true;
    camera.current.x = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'j', 'J'].includes(e.key)) e.preventDefault();
    };
    const keyUp = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    animFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const isTouchDevice = 'ontouchstart' in window;

  return (
    <div className="ho-kalla-container" ref={containerRef}>
      <canvas ref={canvasRef} className="ho-kalla-canvas" />
      {isTouchDevice && (
        <div className="touch-controls">
          <button className="touch-btn left-btn" onTouchStart={handleTouchLeftStart} onTouchEnd={handleTouchLeftEnd} onTouchCancel={handleTouchLeftEnd} onMouseDown={handleTouchLeftStart} onMouseUp={handleTouchLeftEnd} onMouseLeave={handleTouchLeftEnd}>
            ◀ Move Left
          </button>
          <button className="touch-btn jump-btn" onTouchStart={handleTouchJumpStart} onTouchEnd={handleTouchJumpEnd} onTouchCancel={handleTouchJumpEnd} onMouseDown={handleTouchJumpStart} onMouseUp={handleTouchJumpEnd} onMouseLeave={handleTouchJumpEnd}>
            ▲ Jump
          </button>
          <button className="touch-btn atk-btn" onTouchStart={handleTouchAttackStart} onTouchEnd={handleTouchAttackEnd} onTouchCancel={handleTouchAttackEnd} onMouseDown={handleTouchAttackStart} onMouseUp={handleTouchAttackEnd} onMouseLeave={handleTouchAttackEnd} style={{ background: '#d32f2f', color: 'white', border: '2px solid #fff' }}>
            ⚔️ Attack
          </button>
          <button className="touch-btn right-btn" onTouchStart={handleTouchRightStart} onTouchEnd={handleTouchRightEnd} onTouchCancel={handleTouchRightEnd} onMouseDown={handleTouchRightStart} onMouseUp={handleTouchRightEnd} onMouseLeave={handleTouchRightEnd}>
            ▶ Move Right
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;