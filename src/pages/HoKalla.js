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
  
  // Touch refs for Player 1 (Khotso)
  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const touchAttack = useRef(false);

  const jumpRequestedP1 = useRef(false);
  const jumpRequestedP2 = useRef(false);

  // Sprites for both fighters
  const sprites = useRef({
    khotso: { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [] },
    thabo:  { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [] },
  });

  const arenaImage = useRef(null);
  const arenaLoaded = useRef(false);
  const loadedCount = useRef(0);
  const totalFrames = useRef(0);

  // Player 1 (Khotso)
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

  // Player 2 (Thabo)
  const opponent = useRef({
    x: 600,
    y: 0,
    width: 100,
    height: SPRITE_CONFIG.targetHeight,
    vx: 0,
    vy: 0,
    speed: 3.5,
    jumpForce: -9,
    facingRight: false,
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

    // Load Khotso Frames
    sprites.current.khotso.attack = loadKhotsoFrames('Kattack', SPRITE_CONFIG.khotso.framesPerState.attack);
    sprites.current.khotso.walk   = loadKhotsoFrames('walk', SPRITE_CONFIG.khotso.framesPerState.walk);
    sprites.current.khotso.jump   = loadKhotsoFrames('jump', SPRITE_CONFIG.khotso.framesPerState.jump);
    sprites.current.khotso.land   = loadKhotsoFrames('land', SPRITE_CONFIG.khotso.framesPerState.land);
    sprites.current.khotso.crouch = loadKhotsoFrames('crouch', SPRITE_CONFIG.khotso.framesPerState.crouch);

    // Load Thabo Frames
    sprites.current.thabo.attack = loadThaboFrames('Tattack', SPRITE_CONFIG.thabo.framesPerState.attack);
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
  const handleTouchAttackStart = (e) => { e.preventDefault(); touchAttack.current = true; };
  const handleTouchAttackEnd   = (e) => { e.preventDefault(); touchAttack.current = false; };

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

    const frames = spriteSet[char.state];
    
    // 🛠️ FIXED: Handle missing attack frames by falling back to idle
    let img = null;
    let fallbackImg = null;

    // Try to grab the idle frame just in case
    if (spriteSet.idle && spriteSet.idle.length > 0) {
      fallbackImg = spriteSet.idle[0];
    }

    if (frames && frames.length > 0) {
      let idx = 0;
      if (char.state === 'idle') idx = 0;
      else idx = Math.floor(char.currentFrame) % frames.length;
      img = frames[idx];
    }

    // 🛠️ SAFETY: If the frame isn't downloaded yet, use the idle frame instead
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = fallbackImg;
    }

    // Draw it
    if (img && img.complete && img.naturalWidth > 0) {
      const dw = char.width; 
      const dh = char.height;
      ctx.drawImage(img, -dw / 2, -dh, dw, dh);
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
    const p1 = player.current;   // Khotso
    const p2 = opponent.current; // Thabo
    const groundY = canvas.height * groundFrac;

    // --- PLAYER 1: KHOTSO CONTROLS ---
    const attackPressedP1 = keys.current['j'] || keys.current['J'] || touchAttack.current;
    if (attackPressedP1 && !p1.attackLock && p1.grounded) {
      p1.state = 'attack';
      p1.frameTimer = 0;
      p1.attackLock = true;
    }

    const crouchKeyP1 = keys.current['s'] || keys.current['S'];
    p1.crouching = crouchKeyP1 && p1.grounded && p1.state !== 'attack';

    let moveDirP1 = 0;
    if (!p1.crouching && p1.state !== 'attack') {
      if (keys.current['a'] || keys.current['A'] || touchMoveLeft.current) moveDirP1 -= 1;
      if (keys.current['d'] || keys.current['D'] || touchMoveRight.current) moveDirP1 += 1;
    }
    p1.vx = moveDirP1 * p1.speed;

    if ((keys.current['w'] || keys.current['W'] || touchJump.current) && p1.grounded && !p1.crouching && p1.state !== 'attack') {
      p1.vy = p1.jumpForce;
      p1.grounded = false;
      jumpRequestedP1.current = true;
      p1.frameTimer = 0;
      p1.state = 'jump';
    } else {
      jumpRequestedP1.current = false;
    }

    // --- PLAYER 2: THABO CONTROLS ---
    const attackPressedP2 = keys.current[' '] || keys.current['Space']; 
    if (attackPressedP2 && !p2.attackLock && p2.grounded) {
      p2.state = 'attack';
      p2.frameTimer = 0;
      p2.attackLock = true;
    }

    const crouchKeyP2 = keys.current['ArrowDown'];
    p2.crouching = crouchKeyP2 && p2.grounded && p2.state !== 'attack';

    let moveDirP2 = 0;
    if (!p2.crouching && p2.state !== 'attack') {
      if (keys.current['ArrowLeft']) moveDirP2 -= 1;
      if (keys.current['ArrowRight']) moveDirP2 += 1;
    }
    p2.vx = moveDirP2 * p2.speed;

    if ((keys.current['ArrowUp']) && p2.grounded && !p2.crouching && p2.state !== 'attack') {
      p2.vy = p2.jumpForce;
      p2.grounded = false;
      jumpRequestedP2.current = true;
      p2.frameTimer = 0;
      p2.state = 'jump';
    } else {
      jumpRequestedP2.current = false;
    }

    // --- UNIVERSAL PHYSICS LOOP ---
    const applyPhysics = (char) => {
      char.vy += 0.6;
      char.x += char.vx;
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
          char.landTimer = 15;
          char.state = 'land';
          char.frameTimer = 0;
          char.landAnimFinished = false;
        }
        char.grounded = true;
      } else {
        char.grounded = false;
      }
    };

    applyPhysics(p1);
    applyPhysics(p2);

    camera.current.x = 0;

    // --- FACING LOGIC ---
    if (moveDirP1 > 0) p1.facingRight = true;
    else if (moveDirP1 < 0) p1.facingRight = false;

    if (moveDirP2 > 0) p2.facingRight = true;
    else if (moveDirP2 < 0) p2.facingRight = false;

    // Force them to face each other when idle
    if (p1.state === 'idle') p1.facingRight = p1.x < p2.x;
    if (p2.state === 'idle') p2.facingRight = p2.x < p1.x;

    // --- KHOTSO STATE SWITCHING ---
    if (!p1.grounded && p1.state !== 'attack') {
      p1.state = 'jump';
    } else if (p1.state === 'attack') {
      const attackTotalFrames = SPRITE_CONFIG.khotso.framesPerState.attack;
      if (Math.floor(p1.frameTimer) >= attackTotalFrames) {
        p1.attackLock = false;
        if (p1.grounded) p1.state = 'idle';
        p1.frameTimer = 0;
      }
    } else {
      if (p1.landTimer > 0) {
        p1.state = 'land';
        p1.landTimer--;
      } else if (p1.crouching) {
        p1.state = 'crouch';
        p1.frameTimer = 0;
      } else if (moveDirP1 !== 0) {
        p1.state = 'walk';
      } else {
        p1.state = 'idle';
      }
    }

    // --- THABO STATE SWITCHING ---
    if (!p2.grounded && p2.state !== 'attack') {
      p2.state = 'jump';
    } else if (p2.state === 'attack') {
      const attackTotalFrames = SPRITE_CONFIG.thabo.framesPerState.attack;
      if (Math.floor(p2.frameTimer) >= attackTotalFrames) {
        p2.attackLock = false;
        if (p2.grounded) p2.state = 'idle';
        p2.frameTimer = 0;
      }
    } else {
      if (p2.landTimer > 0) {
        p2.state = 'land';
        p2.landTimer--;
      } else if (p2.crouching) {
        p2.state = 'crouch';
        p2.frameTimer = 0;
      } else if (moveDirP2 !== 0) {
        p2.state = 'walk';
      } else {
        p2.state = 'idle';
      }
    }

    // --- ANIMATION TIMERS ---
    const advanceTimer = (char, maxFrames) => {
      if (char.state === 'walk' || char.state === 'jump' || char.state === 'attack') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (char.state === 'crouch') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (char.state === 'land') {
        if (!char.landAnimFinished) {
          char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
          if (Math.floor(char.frameTimer) >= maxFrames) {
            char.frameTimer = maxFrames - 1;
            char.landAnimFinished = true;
          }
        }
      } else if (char.state === 'idle') {
        char.frameTimer = 0;
      }
      char.currentFrame = char.frameTimer;
    };

    advanceTimer(p1, SPRITE_CONFIG.khotso.framesPerState.land);
    advanceTimer(p2, SPRITE_CONFIG.thabo.framesPerState.land);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);
    
    // Draw both characters
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
    p.attackLock = false;

    const o = opponent.current;
    o.y = canvas.height * groundFrac;
    o.vy = 0; o.grounded = true;

    camera.current.x = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const keyDown = (e) => {
      keys.current[e.key] = true;
      // Prevent default scrolling for all game keys
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D', 'j', 'J'].includes(e.key)) e.preventDefault();
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
            ◀ P1 Left
          </button>
          <button className="touch-btn jump-btn"
            onTouchStart={handleTouchJumpStart} onTouchEnd={handleTouchJumpEnd} onTouchCancel={handleTouchJumpEnd}
            onMouseDown={handleTouchJumpStart} onMouseUp={handleTouchJumpEnd} onMouseLeave={handleTouchJumpEnd}>
            ▲ P1 Jump
          </button>
          <button className="touch-btn atk-btn"
            onTouchStart={handleTouchAttackStart} onTouchEnd={handleTouchAttackEnd} onTouchCancel={handleTouchAttackEnd}
            onMouseDown={handleTouchAttackStart} onMouseUp={handleTouchAttackEnd} onMouseLeave={handleTouchAttackEnd}
            style={{background: '#d32f2f', color: 'white', border: '2px solid #fff'}}>
            ⚔️ P1 Atk
          </button>
          <button className="touch-btn right-btn"
            onTouchStart={handleTouchRightStart} onTouchEnd={handleTouchRightEnd} onTouchCancel={handleTouchRightEnd}
            onMouseDown={handleTouchRightStart} onMouseUp={handleTouchRightEnd} onMouseLeave={handleTouchRightEnd}>
            ▶ P1 Right
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;