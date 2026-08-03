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
const ATTACK_DAMAGE = 8;
const ATTACK_RANGE = 80;
const ROUND_INTRO_DURATION = 3000; // 3 seconds

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});

  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const touchAttack = useRef(false);

  const sprites = useRef({
    khotso: { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [] },
    thabo:  { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [] },
  });

  const arenaImage = useRef(null);
  const arenaLoaded = useRef(false);
  const loadedCount = useRef(0);
  const totalFrames = useRef(0);

  // Game state
  const roundState = useRef('intro'); // 'intro' | 'fighting' | 'roundEnd'
  const roundIntroStart = useRef(0);
  const roundNumber = useRef(1);
  const winner = useRef(null);

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
    hitActive: false,     // true during the active frames of attack
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
    hitActive: false,
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

    const loadThaboAttackFrames = () => {
      const arr = [];
      for (let i = 1; i <= SPRITE_CONFIG.thabo.framesPerState.attack; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.thabo.basePath}${i}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Thabo Attack ${i}.png`);
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

    sprites.current.khotso.attack = loadKhotsoFrames('Kattack', SPRITE_CONFIG.khotso.framesPerState.attack);
    sprites.current.khotso.walk   = loadKhotsoFrames('walk', SPRITE_CONFIG.khotso.framesPerState.walk);
    sprites.current.khotso.jump   = loadKhotsoFrames('jump', SPRITE_CONFIG.khotso.framesPerState.jump);
    sprites.current.khotso.land   = loadKhotsoFrames('land', SPRITE_CONFIG.khotso.framesPerState.land);
    sprites.current.khotso.crouch = loadKhotsoFrames('crouch', SPRITE_CONFIG.khotso.framesPerState.crouch);

    sprites.current.thabo.attack = loadThaboAttackFrames();
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

  // ---------- Hit detection ----------
  const checkAttackHit = (attacker, defender) => {
    if (!attacker.hitActive) return;

    const distance = Math.abs(attacker.x - defender.x);
    if (distance < ATTACK_RANGE) {
      // Only hit once per attack
      attacker.hitActive = false;
      defender.health = Math.max(0, defender.health - ATTACK_DAMAGE);

      // Check for KO
      if (defender.health <= 0) {
        winner.current = attacker === player.current ? 'Khotso' : 'Thabo';
        roundState.current = 'roundEnd';
      }
    }
  };

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
    let img = null;

    if (frames && frames.length > 0) {
      let idx = 0;
      if (char.state === 'idle') idx = 0;
      else idx = Math.floor(char.currentFrame) % frames.length;
      img = frames[idx];
    }

    if (img && img.complete && img.naturalWidth > 0) {
      let dw, dh;
      if (char.state === 'attack') {
        dw = img.naturalWidth;
        dh = img.naturalHeight;
      } else {
        dw = char.width;
        dh = char.height;
      }
      ctx.drawImage(img, -dw / 2, -dh, dw, dh);
    } else {
      ctx.fillStyle = char === player.current ? '#1565C0' : '#b71c1c';
      ctx.fillRect(-25, -50, 50, 80);
    }
    ctx.restore();
  };

  const drawHUD = (ctx, canvas, p, opponentChar) => {
    const barW = 200, barH = 20;

    // Khotso health (left)
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

    // Thabo health (right)
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

  const drawRoundIntro = (ctx, canvas) => {
    const elapsed = Date.now() - roundIntroStart.current;
    const alpha = elapsed < 500 ? elapsed / 500 :
                  elapsed > ROUND_INTRO_DURATION - 500 ? 1 - (elapsed - (ROUND_INTRO_DURATION - 500)) / 500 :
                  1;

    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Round text
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText(`Round ${roundNumber.current}`, canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '28px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Fight!', canvas.width / 2, canvas.height / 2 + 30);

    ctx.restore();
  };

  const drawRoundEnd = (ctx, canvas) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 56px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText(`${winner.current} Wins!`, canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 30);
    ctx.restore();
  };

  const drawControls = (ctx, canvas) => {
    ctx.save();
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.textAlign = 'left';
    ctx.fillText("Khotso: W (Jump), A/D (Move), J (Attack), S (Crouch)", 20, canvas.height - 60);
    ctx.fillText("Thabo:  ↑  (Jump), ←/→ (Move),  L  (Attack), ↓ (Crouch)", 20, canvas.height - 30);
    ctx.restore();
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
    // Handle round intro timer
    if (roundState.current === 'intro') {
      if (Date.now() - roundIntroStart.current > ROUND_INTRO_DURATION) {
        roundState.current = 'fighting';
      }
      return; // Don't update characters during intro
    }

    // Restart on R key
    if (keys.current['r'] || keys.current['R']) {
      resetRound();
      return;
    }

    if (roundState.current === 'roundEnd') return; // Freeze on round end

    const p1 = player.current;
    const p2 = opponent.current;
    const groundY = canvas.height * groundFrac;

    // --- PLAYER 1: KHOTSO CONTROLS ---
    const attackPressedP1 = keys.current['j'] || keys.current['J'] || touchAttack.current;
    if (attackPressedP1 && !p1.attackLock && p1.grounded) {
      p1.state = 'attack';
      p1.frameTimer = 0;
      p1.attackLock = true;
      p1.hitActive = true;
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
      p1.frameTimer = 0;
      p1.state = 'jump';
    }

    // --- PLAYER 2: THABO CONTROLS ---
    const attackPressedP2 = keys.current['l'] || keys.current['L'];
    if (attackPressedP2 && !p2.attackLock && p2.grounded) {
      p2.state = 'attack';
      p2.frameTimer = 0;
      p2.attackLock = true;
      p2.hitActive = true;
    }

    const crouchKeyP2 = keys.current['ArrowDown'];
    p2.crouching = crouchKeyP2 && p2.grounded && p2.state !== 'attack';

    let moveDirP2 = 0;
    if (!p2.crouching && p2.state !== 'attack') {
      if (keys.current['ArrowLeft']) moveDirP2 -= 1;
      if (keys.current['ArrowRight']) moveDirP2 += 1;
    }
    p2.vx = moveDirP2 * p2.speed;

    if (keys.current['ArrowUp'] && p2.grounded && !p2.crouching && p2.state !== 'attack') {
      p2.vy = p2.jumpForce;
      p2.grounded = false;
      p2.frameTimer = 0;
      p2.state = 'jump';
    }

    // --- APPLY PHYSICS ---
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

    // --- HIT DETECTION ---
    checkAttackHit(p1, p2);
    checkAttackHit(p2, p1);

    // --- FACING LOGIC ---
    if (moveDirP1 > 0) p1.facingRight = true;
    else if (moveDirP1 < 0) p1.facingRight = false;
    else if (p1.state === 'idle' || p1.state === 'attack') p1.facingRight = p1.x < p2.x;

    if (moveDirP2 > 0) p2.facingRight = true;
    else if (moveDirP2 < 0) p2.facingRight = false;
    else if (p2.state === 'idle' || p2.state === 'attack') p2.facingRight = p2.x < p1.x;

    // --- STATE SWITCHING ---
    const updateState = (char, maxAttackFrames) => {
      if (!char.grounded && char.state !== 'attack') {
        char.state = 'jump';
      } else if (char.state === 'attack') {
        if (Math.floor(char.frameTimer) >= maxAttackFrames) {
          char.attackLock = false;
          char.hitActive = false;
          char.state = char.grounded ? 'idle' : 'jump';
          char.frameTimer = 0;
        }
      } else {
        if (char.landTimer > 0) {
          char.state = 'land';
          char.landTimer--;
        } else if (char.crouching) {
          char.state = 'crouch';
          char.frameTimer = 0;
        } else if (Math.abs(char.vx) > 0.1) {
          char.state = 'walk';
        } else {
          char.state = 'idle';
        }
      }
    };

    updateState(p1, SPRITE_CONFIG.khotso.framesPerState.attack);
    updateState(p2, SPRITE_CONFIG.thabo.framesPerState.attack);

    // --- ANIMATION TIMERS ---
    const advanceTimer = (char, maxLandFrames) => {
      if (char.state === 'walk' || char.state === 'jump' || char.state === 'attack') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (char.state === 'crouch') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (char.state === 'land') {
        if (!char.landAnimFinished) {
          char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
          if (Math.floor(char.frameTimer) >= maxLandFrames) {
            char.frameTimer = maxLandFrames - 1;
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

    camera.current.x = 0;
  };

  // ---------- Reset round ----------
  const resetRound = () => {
    const p1 = player.current;
    const p2 = opponent.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height * groundFrac;

    p1.x = 200; p1.y = groundY; p1.vx = 0; p1.vy = 0;
    p1.grounded = true; p1.state = 'idle'; p1.facingRight = true;
    p1.attackLock = false; p1.hitActive = false;
    p1.health = PLAYER_MAX_HEALTH;

    p2.x = 600; p2.y = groundY; p2.vx = 0; p2.vy = 0;
    p2.grounded = true; p2.state = 'idle'; p2.facingRight = false;
    p2.attackLock = false; p2.hitActive = false;
    p2.health = PLAYER_MAX_HEALTH;

    winner.current = null;
    roundNumber.current = 1;
    roundState.current = 'intro';
    roundIntroStart.current = Date.now();
  };

  // ---------- Game loop ----------
  let lastTimestamp = 0;
  const gameLoop = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = Math.min(timestamp - lastTimestamp, 33); // cap at 30fps equivalent
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
    drawCharacter(ctx, opponent.current, sprites.current.thabo);
    drawCharacter(ctx, player.current, sprites.current.khotso);
    drawTitle(ctx, canvas);
    drawControls(ctx, canvas);
    drawFPS(ctx, canvas, fs.fps);
    drawHUD(ctx, canvas, player.current, opponent.current);

    // Draw round intro or end overlay
    if (roundState.current === 'intro') {
      drawRoundIntro(ctx, canvas);
    } else if (roundState.current === 'roundEnd') {
      drawRoundEnd(ctx, canvas);
    }

    animFrameId.current = requestAnimationFrame(gameLoop);
  };

  // ---------- Resize & setup ----------
  const handleResize = () => {
    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width; canvas.height = height;
    resetRound();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize round intro
    roundIntroStart.current = Date.now();
    roundState.current = 'intro';

    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ', 'w','W','a','A','s','S','d','D','j','J','l','L','r','R'].includes(e.key)) e.preventDefault();
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