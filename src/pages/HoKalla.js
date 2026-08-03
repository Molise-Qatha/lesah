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
    },
    nameSuffix: '-removebg-preview',
  },
  animationSpeed: 10,
  // 🛠️ Adjust this number to make both characters bigger or smaller!
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
  const jumpRequested = useRef(false);

  // Sprites for both fighters
  const sprites = useRef({
    khotso: { idle: [], walk: [], jump: [], land: [], crouch: [] },
    thabo:  { idle: [], walk: [], jump: [], land: [], crouch: [] },
  });

  const arenaImage = useRef(null);
  const arenaLoaded = useRef(false);
  const loadedCount = useRef(0);
  const totalFrames = useRef(0);

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
    state: 'idle',
    landTimer: 0,
    currentFrame: 0,
    frameTimer: 0,
    landAnimFinished: false,
    crouching: false,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
  });

  // Opponent (Thabo)
  const opponent = useRef({
    x: 600,
    y: 0,
    width: 100,
    height: SPRITE_CONFIG.targetHeight,
    facingRight: false,
    state: 'idle',
    currentFrame: 0,
    frameTimer: 0,
    grounded: true,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
  });

  const camera = useRef({ x: 0, y: 0 });
  const fpsState = useRef({
    lastTime: 0, fps: 0, frameCount: 0, fpsUpdateTime: 0,
  });
  const groundFrac = 0.65;

  // ---------- Load sprites and arena ----------
  useEffect(() => {
    const arenaImg = new Image();
    arenaImg.src = ARENA_PATH;
    arenaImg.onload = () => { arenaImage.current = arenaImg; arenaLoaded.current = true; };
    arenaImg.onerror = () => console.warn('Arena image not found');

    const scaleSpriteToTargetHeight = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return { width: 100, height: SPRITE_CONFIG.targetHeight };
      const ratio = SPRITE_CONFIG.targetHeight / img.naturalHeight;
      return {
        width: Math.floor(img.naturalWidth * ratio),
        height: SPRITE_CONFIG.targetHeight
      };
    };

    const loadKhotsoFrames = (prefix, count) => {
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.khotso.basePath}${prefix}${i}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing ${prefix}${i}.png`);
        arr.push(img);
      }
      return arr;
    };

    const loadThaboFrames = (prefix, count) => {
      const arr = [];
      const suffix = SPRITE_CONFIG.thabo.nameSuffix;
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.thabo.basePath}${prefix}${i}${suffix}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing ${prefix}${i}${suffix}.png`);
        arr.push(img);
      }
      return arr;
    };

    const onFrameLoad = () => {
      loadedCount.current++;
      
      if (loadedCount.current >= totalFrames.current) {
        if (sprites.current.khotso.walk[0]?.complete) {
          const dims = scaleSpriteToTargetHeight(sprites.current.khotso.walk[0]);
          player.current.width = dims.width;
          player.current.height = dims.height;
        }
        if (sprites.current.thabo.walk[0]?.complete) {
          const dims = scaleSpriteToTargetHeight(sprites.current.thabo.walk[0]);
          opponent.current.width = dims.width;
          opponent.current.height = dims.height;
        }
      }
    };

    sprites.current.khotso.walk   = loadKhotsoFrames('walk', SPRITE_CONFIG.khotso.framesPerState.walk);
    sprites.current.khotso.jump   = loadKhotsoFrames('jump', SPRITE_CONFIG.khotso.framesPerState.jump);
    sprites.current.khotso.land   = loadKhotsoFrames('land', SPRITE_CONFIG.khotso.framesPerState.land);
    sprites.current.khotso.crouch = loadKhotsoFrames('crouch', SPRITE_CONFIG.khotso.framesPerState.crouch);

    sprites.current.thabo.walk   = loadThaboFrames('walk', SPRITE_CONFIG.thabo.framesPerState.walk);
    sprites.current.thabo.jump   = loadThaboFrames('jump', SPRITE_CONFIG.thabo.framesPerState.jump);
    sprites.current.thabo.land   = loadThaboFrames('land', SPRITE_CONFIG.thabo.framesPerState.land);
    sprites.current.thabo.crouch = loadThaboFrames('crouch', SPRITE_CONFIG.thabo.framesPerState.crouch);

    totalFrames.current =
      Object.values(SPRITE_CONFIG.khotso.framesPerState).reduce((a,b)=>a+b,0) +
      Object.values(SPRITE_CONFIG.thabo.framesPerState).reduce((a,b)=>a+b,0);

    const checkIdle = setInterval(() => {
      if (sprites.current.khotso.walk[0]?.complete) {
        sprites.current.khotso.idle = [sprites.current.khotso.walk[0]];
        if (player.current.width === 100) {
          const dims = scaleSpriteToTargetHeight(sprites.current.khotso.walk[0]);
          player.current.width = dims.width;
          player.current.height = dims.height;
        }
      }
      if (sprites.current.thabo.walk[0]?.complete) {
        sprites.current.thabo.idle = [sprites.current.thabo.walk[0]];
        if (opponent.current.width === 100) {
          const dims = scaleSpriteToTargetHeight(sprites.current.thabo.walk[0]);
          opponent.current.width = dims.width;
          opponent.current.height = dims.height;
        }
      }
      if (sprites.current.khotso.idle.length && sprites.current.thabo.idle.length) {
        clearInterval(checkIdle);
      }
    }, 50);
  }, []);

  // ---------- Touch handlers ----------
  const handleTouchLeftStart  = (e) => { e.preventDefault(); touchMoveLeft.current = true; };
  const handleTouchLeftEnd    = (e) => { e.preventDefault(); touchMoveLeft.current = false; };
  const handleTouchRightStart = (e) => { e.preventDefault(); touchMoveRight.current = true; };
  const handleTouchRightEnd   = (e) => { e.preventDefault(); touchMoveRight.current = false; };
  const handleTouchJumpStart  = (e) => { e.preventDefault(); touchJump.current = true; };
  const handleTouchJumpEnd    = (e) => { e.preventDefault(); touchJump.current = false; };

  // ---------- Drawing functions ----------
  const drawBackground = (ctx, canvas) => {
    if (arenaLoaded.current && arenaImage.current) {
      const img = arenaImage.current;
      const w = canvas.width, h = canvas.height;
      
      // 🛠️ FINAL FIX: Centered, stable camera with NO looping
      const camX = camera.current.x;
      ctx.drawImage(img, -camX, 0, w, h);
    } else {
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const drawCharacter = (ctx, char, spriteSet) => {
    ctx.save();
    const screenX = char.x - camera.current.x;
    ctx.translate(screenX, char.y);
    if (!char.facingRight) ctx.scale(-1, 1);

    const frames = spriteSet[char.state];
    if (frames && frames.length > 0) {
      let idx = 0;
      if (char.state === 'idle') idx = 0;
      else idx = Math.floor(char.currentFrame) % frames.length;
      const img = frames[idx];
      if (img?.complete) {
        // Draw using our fixed, equalized width/height
        const dw = char.width; 
        const dh = char.height;
        ctx.drawImage(img, -dw / 2, -dh, dw, dh);
      }
    }
    ctx.restore();
  };

  const drawHUD = (ctx, canvas, p, opponentChar) => {
    const barW = 200, barH = 20;

    const kx = 20, ky = 20;
    ctx.save();
    ctx.font = 'bold 18px Arial'; ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.fillText('Khotso', kx, ky - 5);
    ctx.restore();
    ctx.fillStyle = '#333'; ctx.fillRect(kx, ky, barW, barH);
    const kFill = barW * (p.health / p.maxHealth);
    const gradK = ctx.createLinearGradient(kx, ky, kx + barW, ky);
    gradK.addColorStop(0, '#4caf50'); gradK.addColorStop(0.6, '#ffeb3b'); gradK.addColorStop(1, '#f44336');
    ctx.fillStyle = gradK; ctx.fillRect(kx, ky, kFill, barH);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(kx, ky, barW, barH);

    const tx = canvas.width - barW - 20, ty = 20;
    ctx.save();
    ctx.font = 'bold 18px Arial'; ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.textAlign = 'right';
    ctx.fillText('Thabo', canvas.width - 20, ty - 5);
    ctx.restore();
    ctx.fillStyle = '#333'; ctx.fillRect(tx, ty, barW, barH);
    const tFill = barW * (opponentChar.health / opponentChar.maxHealth);
    const gradT = ctx.createLinearGradient(tx, ty, tx + barW, ty);
    gradT.addColorStop(0, '#4caf50'); gradT.addColorStop(0.6, '#ffeb3b'); gradT.addColorStop(1, '#f44336');
    ctx.fillStyle = gradT; ctx.fillRect(tx, ty, tFill, barH);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(tx, ty, barW, barH);
  };

  const drawTitle = (ctx, canvas) => {
    ctx.save();
    ctx.font = 'bold 36px Arial'; ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.fillText('Ho Kalla (Prototype)', canvas.width / 2, 80);
    ctx.restore();
  };

  const drawFPS = (ctx, canvas, fps) => {
    ctx.save();
    ctx.font = '16px monospace'; ctx.fillStyle = '#ff0';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 3;
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${fps}`, 10, canvas.height - 10);
    ctx.restore();
  };

  // ---------- Physics & input ----------
  const update = (canvas, deltaTime) => {
    const p = player.current;
    const groundY = canvas.height * groundFrac;

    const crouchKey = keys.current['ArrowDown'] || keys.current['s'] || keys.current['S'];
    p.crouching = crouchKey && p.grounded;

    let moveDir = 0;
    if (!p.crouching) {
      if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A'] || touchMoveLeft.current) moveDir -= 1;
      if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D'] || touchMoveRight.current) moveDir += 1;
    }
    p.vx = moveDir * p.speed;

    if (
      (keys.current[' '] || keys.current['Space'] ||
       keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'] ||
       touchJump.current)
    ) {
      if (p.grounded && !jumpRequested.current && !p.crouching) {
        p.vy = p.jumpForce;
        p.grounded = false;
        jumpRequested.current = true;
        p.frameTimer = 0;
        p.state = 'jump';
      }
    } else {
      jumpRequested.current = false;
    }

    p.vy += 0.6;
    p.x += p.vx;
    p.y += p.vy;

    // 🛠️ FINAL FIX: SOLID STAGE BOUNDARIES (No wrapping)
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
        p.landTimer = 15;
        p.state = 'land';
        p.frameTimer = 0;
        p.landAnimFinished = false;
      }
      p.grounded = true;
    } else {
      p.grounded = false;
    }

    // 🛠️ FINAL FIX: Locked camera (No movement, completely stable)
    camera.current.x = 0;

    if (moveDir > 0) p.facingRight = true;
    else if (moveDir < 0) p.facingRight = false;

    if (!p.grounded) {
      p.state = 'jump';
    } else {
      if (p.landTimer > 0) {
        p.state = 'land';
        p.landTimer--;
      } else if (p.crouching) {
        p.state = 'crouch';
        p.frameTimer = 0;
      } else if (moveDir !== 0) {
        p.state = 'walk';
      } else {
        p.state = 'idle';
      }
    }

    const cfg = SPRITE_CONFIG;
    if (p.state === 'walk' || p.state === 'jump') {
      p.frameTimer += (deltaTime / 1000) * cfg.animationSpeed;
    } else if (p.state === 'crouch') {
      p.frameTimer += (deltaTime / 1000) * cfg.animationSpeed;
    } else if (p.state === 'land') {
      if (!p.landAnimFinished) {
        p.frameTimer += (deltaTime / 1000) * cfg.animationSpeed;
        if (Math.floor(p.frameTimer) >= SPRITE_CONFIG.khotso.framesPerState.land) {
          p.frameTimer = SPRITE_CONFIG.khotso.framesPerState.land - 1;
          p.landAnimFinished = true;
        }
      }
    } else if (p.state === 'idle') {
      p.frameTimer = 0;
    }
    p.currentFrame = p.frameTimer;
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
      fs.frameCount = 0; fs.fpsUpdateTime = timestamp;
    }

    update(canvas, deltaTime);

    // Thabo idle animation
    opponent.current.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);
    drawCharacter(ctx, opponent.current, sprites.current.thabo);
    drawCharacter(ctx, player.current, sprites.current.khotso);
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
    const p = player.current;
    p.y = canvas.height * groundFrac;
    p.vy = 0; p.grounded = true;
    p.state = 'idle';
    p.landTimer = 0;
    p.landAnimFinished = false;
    p.frameTimer = 0;
    p.currentFrame = 0;
    p.crouching = false;

    const o = opponent.current;
    o.y = canvas.height * groundFrac;

    camera.current.x = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
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
          <button className="touch-btn left-btn"
            onTouchStart={handleTouchLeftStart} onTouchEnd={handleTouchLeftEnd} onTouchCancel={handleTouchLeftEnd}
            onMouseDown={handleTouchLeftStart} onMouseUp={handleTouchLeftEnd} onMouseLeave={handleTouchLeftEnd}>
            ◀ Move Left
          </button>
          <button className="touch-btn jump-btn"
            onTouchStart={handleTouchJumpStart} onTouchEnd={handleTouchJumpEnd} onTouchCancel={handleTouchJumpEnd}
            onMouseDown={handleTouchJumpStart} onMouseUp={handleTouchJumpEnd} onMouseLeave={handleTouchJumpEnd}>
            ▲ Jump
          </button>
          <button className="touch-btn right-btn"
            onTouchStart={handleTouchRightStart} onTouchEnd={handleTouchRightEnd} onTouchCancel={handleTouchRightEnd}
            onMouseDown={handleTouchRightStart} onMouseUp={handleTouchRightEnd} onMouseLeave={handleTouchRightEnd}>
            ▶ Move Right
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;