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
      attack: 3, // Khotso has 3 attack frames
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
      attack: 5, // Thabo has 5 attack frames
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

  // Sprite containers
  const sprites = useRef({
    khotso: { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [] },
    thabo: { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [] },
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
    attackLock: false,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
  });

  // Opponent (Thabo)
  const opponent = useRef({
    x: 750, // Starts on the right side
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
        height: SPRITE_CONFIG.targetHeight,
      };
    };

    const loadKhotsoFrames = (prefix, count) => {
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.khotso.basePath}${prefix}${i}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Khotso ${prefix}${i}.png`);
        arr.push(img);
      }
      return arr;
    };

    const loadThaboFrames = (prefix, count) => {
      const arr = [];
      const suffix = SPRITE_CONFIG.thabo.nameSuffix;
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        // 🛠️ FIX: If it's "attack", look for Tattack1.png. Otherwise look for e.g walk1-removebg-preview.png
        const src = prefix === 'attack'
          ? `${SPRITE_CONFIG.thabo.basePath}${prefix}${i}.png`
          : `${SPRITE_CONFIG.thabo.basePath}${prefix}${i}${suffix}.png`;

        img.src = src;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Thabo ${prefix}${i}.png`);
        arr.push(img);
      }
      return arr;
    };

    const onFrameLoad = () => {
      loadedCount.current++;
      if (loadedCount.current >= totalFrames.current) {
        // Set sizes
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
        // Set idle animations explicitly (Use the first walk frame as idle)
        sprites.current.khotso.idle = [sprites.current.khotso.walk[0]];
        sprites.current.thabo.idle = [sprites.current.thabo.walk[0]];
      }
    };

    // Load Khotso
    sprites.current.khotso.attack = loadKhotsoFrames('Kattack', SPRITE_CONFIG.khotso.framesPerState.attack);
    sprites.current.khotso.walk = loadKhotsoFrames('walk', SPRITE_CONFIG.khotso.framesPerState.walk);
    sprites.current.khotso.jump = loadKhotsoFrames('jump', SPRITE_CONFIG.khotso.framesPerState.jump);
    sprites.current.khotso.land = loadKhotsoFrames('land', SPRITE_CONFIG.khotso.framesPerState.land);
    sprites.current.khotso.crouch = loadKhotsoFrames('crouch', SPRITE_CONFIG.khotso.framesPerState.crouch);

    // Load Thabo
    sprites.current.thabo.attack = loadThaboFrames('Tattack', SPRITE_CONFIG.thabo.framesPerState.attack);
    sprites.current.thabo.walk = loadThaboFrames('walk', SPRITE_CONFIG.thabo.framesPerState.walk);
    sprites.current.thabo.jump = loadThaboFrames('jump', SPRITE_CONFIG.thabo.framesPerState.jump);
    sprites.current.thabo.land = loadThaboFrames('land', SPRITE_CONFIG.thabo.framesPerState.land);
    sprites.current.thabo.crouch = loadThaboFrames('crouch', SPRITE_CONFIG.thabo.framesPerState.crouch);

    totalFrames.current =
      Object.values(SPRITE_CONFIG.khotso.framesPerState).reduce((a, b) => a + b, 0) +
      Object.values(SPRITE_CONFIG.thabo.framesPerState).reduce((a, b) => a + b, 0);
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

  const drawCharacter = (ctx, char, spriteSet) => {
    ctx.save();
    ctx.translate(char.x, char.y);
    if (!char.facingRight) ctx.scale(-1, 1);

    // 🛠️ FIX: Find which frame to use
    let img = null;
    const frames = spriteSet[char.state];

    if (frames && frames.length > 0) {
      let idx = 0;
      if (char.state === 'idle') idx = 0;
      else idx = Math.floor(char.currentFrame) % frames.length;
      img = frames[idx];
    }

    // 🛠️ FIX: If the image isn't loaded yet, draw a temporary block so he NEVER disappears
    if (!img || !img.complete || img.naturalWidth === 0) {
      ctx.fillStyle = char === player.current ? '#1565C0' : '#b71c1c'; // Blue for Khotso, Red for Thabo
      ctx.fillRect(-char.width / 2, -char.height, char.width, char.height);
    } else {
      const dw = char.width;
      const dh = char.height;
      ctx.drawImage(img, -dw / 2, -dh, dw, dh);
    }

    ctx.restore();
  };

  const drawHUD = (ctx, canvas, p, o) => {
    const barW = 200, barH = 20;

    // Khotso Health
    ctx.fillStyle = '#333';
    ctx.fillRect(20, 20, barW, barH);
    const kFill = barW * (p.health / p.maxHealth);
    const gradK = ctx.createLinearGradient(20, 20, 20 + barW, 20);
    gradK.addColorStop(0, '#4caf50');
    gradK.addColorStop(0.6, '#ffeb3b');
    gradK.addColorStop(1, '#f44336');
    ctx.fillStyle = gradK;
    ctx.fillRect(20, 20, kFill, barH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, barW, barH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Khotso', 20, 15);

    // Thabo Health
    const tx = canvas.width - barW - 20;
    ctx.fillStyle = '#333';
    ctx.fillRect(tx, 20, barW, barH);
    const tFill = barW * (o.health / o.maxHealth);
    const gradT = ctx.createLinearGradient(tx, 20, tx + barW, 20);
    gradT.addColorStop(0, '#4caf50');
    gradT.addColorStop(0.6, '#ffeb3b');
    gradT.addColorStop(1, '#f44336');
    ctx.fillStyle = gradT;
    ctx.fillRect(tx, 20, tFill, barH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx, 20, barW, barH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Thabo', canvas.width - 20, 15);
    ctx.textAlign = 'start';
  };

  const drawTitle = (ctx, canvas) => {
    ctx.save();
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.fillText('Ho Kalla (Prototype)', canvas.width / 2, 80);
    ctx.restore();
  };

  const drawFPS = (ctx, canvas, fps) => {
    ctx.save();
    ctx.font = '16px monospace';
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 3;
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${fps}`, 10, canvas.height - 10);
    ctx.restore();
  };

  // ---------- Physics & input ----------
  const update = (canvas, deltaTime) => {
    const p = player.current;
    const o = opponent.current;
    const groundY = canvas.height * groundFrac;

    // 1. Khotso Controls
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

    if ((keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'] || touchJump.current) && p.grounded && !p.crouching && p.state !== 'attack') {
      p.vy = p.jumpForce;
      p.grounded = false;
      jumpRequested.current = true;
      p.frameTimer = 0;
      p.state = 'jump';
    } else {
      jumpRequested.current = false;
    }

    // 2. Thabo AI
    if (sprites.current.thabo.idle.length > 0) {
      if (!o.attackLock && o.grounded && o.state !== 'attack') {
        if (Math.random() < 0.015) {
          o.state = 'attack';
          o.frameTimer = 0;
          o.attackLock = true;
        }
      }

      if (o.state === 'attack') {
        const maxFrames = SPRITE_CONFIG.thabo.framesPerState.attack;
        o.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
        if (Math.floor(o.frameTimer) >= maxFrames) {
          o.attackLock = false;
          o.state = 'idle';
          o.frameTimer = 0;
        }
      }
    }

    // 3. Physics
    const applyPhysics = (char) => {
      char.vy += 0.6;
      char.x += char.vx || 0;
      char.y += char.vy;

      const boundaryBuffer = 50;
      const stageLeft = boundaryBuffer;
      const stageRight = canvas.width - boundaryBuffer - char.width;
      if (char.x < stageLeft) char.x = stageLeft;
      if (char.x > stageRight) char.x = stageRight;

      if (char.y > groundY) {
        char.y = groundY;
        char.vy = 0;
        if (!char.grounded) {
          char.landTimer = 10;
          char.state = 'land';
          char.frameTimer = 0;
          char.landAnimFinished = false;
        }
        char.grounded = true;
      } else {
        char.grounded = false;
      }
    };

    applyPhysics(p);
    applyPhysics(o);

    // 4. States & Animations
    if (moveDir > 0) p.facingRight = true;
    else if (moveDir < 0) p.facingRight = false;

    // Face opponent
    if (sprites.current.thabo.idle.length > 0) {
      o.facingRight = o.x < p.x;
    }

    const updateGameState = (char, isPlayer) => {
      if (char.state === 'attack') return;
      if (!char.grounded) {
        char.state = 'jump';
      } else {
        if (char.landTimer > 0) {
          char.state = 'land';
          char.landTimer--;
        } else if (char.crouching) {
          char.state = 'crouch';
        } else if ((char.vx && Math.abs(char.vx) > 0.1)) {
          char.state = 'walk';
        } else {
          char.state = 'idle';
        }
      }
    };

    updateGameState(p);
    if (sprites.current.thabo.idle.length > 0) updateGameState(o);

    // Attack timer for Khotso
    if (p.state === 'attack') {
      p.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      if (Math.floor(p.frameTimer) >= SPRITE_CONFIG.khotso.framesPerState.attack) {
        p.attackLock = false;
        p.state = 'idle';
        p.frameTimer = 0;
      }
    } else if (p.state === 'walk' || p.state === 'jump') {
      p.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
    } else if (p.state === 'land') {
      if (!p.landAnimFinished) {
        p.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
        if (Math.floor(p.frameTimer) >= SPRITE_CONFIG.khotso.framesPerState.land) {
          p.landAnimFinished = true;
        }
      }
    } else if (p.state === 'crouch') {
      p.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
    } else {
      p.frameTimer = 0;
    }
    p.currentFrame = p.frameTimer;

    // Thabo Animations
    if (sprites.current.thabo.idle.length > 0) {
      if (o.state === 'walk' || o.state === 'jump') {
        o.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (o.state === 'land') {
        if (!o.landAnimFinished) {
          o.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
          if (Math.floor(o.frameTimer) >= SPRITE_CONFIG.thabo.framesPerState.land) {
            o.landAnimFinished = true;
          }
        }
      } else if (o.state === 'crouch') {
        o.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (o.state !== 'attack') {
        o.frameTimer = 0;
      }
      o.currentFrame = o.frameTimer;
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
    drawCharacter(ctx, opponent.current, sprites.current.thabo);
    drawCharacter(ctx, player.current, sprites.current.khotso);
    drawTitle(ctx, canvas);
    drawFPS(ctx, canvas, fs.fps);
    drawHUD(ctx, canvas, player.current, opponent.current);

    animFrameId.current = requestAnimationFrame(gameLoop);
  };

  // ---------- Resize & setup ----------
  const handleResize = () => {
    const canvas = canvasRef.current,
      container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

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