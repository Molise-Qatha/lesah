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
      block: 5,    // defense folder: 5 named files
      hit: 6,      // pain folder: 6 named files
    },
    // Named files for block (defense folder)
    blockFiles: [
      'defense/guard-raise.png',
      'defense/block-hold.png',
      'defense/high-block.png',
      'defense/mid-block.png',
      'defense/low-block.png',
    ],
    // Named files for hit (pain folder)
    hitFiles: [
      'pain/hit-start.png',
      'pain/stagger-back.png',
      'pain/off-balance.png',
      'pain/heavy-impact.png',
      'pain/knocked-back.png',
      'pain/regaining-posture.png',
    ],
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
      block: 7,    // defense folder: 7 named files
      hit: 5,      // pain folder: 5 named files
    },
    nameSuffix: '-removebg-preview',
    // Named files for block (defense folder)
    blockFiles: [
      'defense/guard-raise-removebg-preview.png',
      'defense/heavy-block-impact-removebg-preview.png',
      'defense/high-block-removebg-preview.png',
      'defense/light-block-impact-removebg-preview.png',
      'defense/recover-from-block-removebg-preview.png',
      'defense/return-to-guard-removebg-preview.png',
      'defense/counter-follow-through-removebg-preview.png',
    ],
    // Named files for hit (pain folder)
    hitFiles: [
      'pain/hit-start-removebg-preview.png',
      'pain/heavy-hit-removebg-preview.png',
      'pain/stagger-back-removebg-preview.png',
      'pain/knocked-back-removebg-preview.png',
      'pain/low-hit-removebg-preview.png',
    ],
  },
  animationSpeed: 10,
  targetHeight: 180,
};

const ARENA_PATH = '/images/arenas/arena1.png';
const PLAYER_MAX_HEALTH = 100;
const ATTACK_DAMAGE = 10;
const BLOCKED_DAMAGE = 2;
const ATTACK_RANGE = 85;
const AI_AGGRO_RANGE = 350;
const AI_ATTACK_RANGE = 75;
const ROUND_INTRO_DURATION = 3000;
const HIT_STUN_DURATION = 500;

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});

  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const touchAttack = useRef(false);
  const touchBlock = useRef(false);

  const sprites = useRef({
    khotso: { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [], block: [], hit: [] },
    thabo:  { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [], block: [], hit: [] },
  });

  const arenaImage = useRef(null);
  const arenaLoaded = useRef(false);
  const loadedCount = useRef(0);
  const totalFrames = useRef(0);

  const roundState = useRef('intro');
  const roundIntroStart = useRef(0);
  const roundNumber = useRef(1);
  const winner = useRef(null);

  const aiDecisionTimer = useRef(0);
  const aiCurrentAction = useRef('idle');

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
    blocking: false,
    attackLock: false,
    hitStunTimer: 0,
    hitActive: false,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
  });

  const opponent = useRef({
    x: 600,
    y: 0,
    width: 100,
    height: SPRITE_CONFIG.targetHeight,
    vx: 0,
    vy: 0,
    speed: 2.5,
    jumpForce: -9,
    facingRight: false,
    grounded: false,
    state: 'idle',
    landTimer: 0,
    currentFrame: 0,
    frameTimer: 0,
    landAnimFinished: false,
    crouching: false,
    blocking: false,
    attackLock: false,
    hitStunTimer: 0,
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
      return { width: Math.floor(img.naturalWidth * ratio), height: SPRITE_CONFIG.targetHeight };
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

    // Load numbered frames (walk, jump, land, crouch, attack)
    const loadNumberedFrames = (basePath, prefix, count) => {
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${basePath}${prefix}${i}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing ${basePath}${prefix}${i}.png`);
        arr.push(img);
      }
      return arr;
    };

    // Load Thabo attack frames (special case)
    const loadThaboAttackFrames = () => {
      const arr = [];
      for (let i = 1; i <= SPRITE_CONFIG.thabo.framesPerState.attack; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.thabo.basePath}${i}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Thabo attack ${i}.png`);
        arr.push(img);
      }
      return arr;
    };

    // Load named files (defense and pain)
    const loadNamedFrames = (basePath, fileList) => {
      const arr = [];
      fileList.forEach(fileName => {
        const img = new Image();
        img.src = `${basePath}${fileName}`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing ${basePath}${fileName}`);
        arr.push(img);
      });
      return arr;
    };

    // --- KHOTSO ---
    const khotsoBase = SPRITE_CONFIG.khotso.basePath;
    sprites.current.khotso.attack = loadNumberedFrames(khotsoBase, 'Kattack', SPRITE_CONFIG.khotso.framesPerState.attack);
    sprites.current.khotso.walk   = loadNumberedFrames(khotsoBase, 'walk', SPRITE_CONFIG.khotso.framesPerState.walk);
    sprites.current.khotso.jump   = loadNumberedFrames(khotsoBase, 'jump', SPRITE_CONFIG.khotso.framesPerState.jump);
    sprites.current.khotso.land   = loadNumberedFrames(khotsoBase, 'land', SPRITE_CONFIG.khotso.framesPerState.land);
    sprites.current.khotso.crouch = loadNumberedFrames(khotsoBase, 'crouch', SPRITE_CONFIG.khotso.framesPerState.crouch);
    // Named frames for block and hit
    sprites.current.khotso.block  = loadNamedFrames(khotsoBase, SPRITE_CONFIG.khotso.blockFiles);
    sprites.current.khotso.hit    = loadNamedFrames(khotsoBase, SPRITE_CONFIG.khotso.hitFiles);

    // --- THABO ---
    const thaboBase = SPRITE_CONFIG.thabo.basePath;
    const thaboSuffix = SPRITE_CONFIG.thabo.nameSuffix;
    sprites.current.thabo.attack = loadThaboAttackFrames();
    sprites.current.thabo.walk   = loadNumberedFrames(thaboBase, `walk`, SPRITE_CONFIG.thabo.framesPerState.walk);
    sprites.current.thabo.jump   = loadNumberedFrames(thaboBase, `jump`, SPRITE_CONFIG.thabo.framesPerState.jump);
    sprites.current.thabo.land   = loadNumberedFrames(thaboBase, `land`, SPRITE_CONFIG.thabo.framesPerState.land);
    sprites.current.thabo.crouch = loadNumberedFrames(thaboBase, `crouch`, SPRITE_CONFIG.thabo.framesPerState.crouch);
    // Named frames for block and hit
    sprites.current.thabo.block  = loadNamedFrames(thaboBase, SPRITE_CONFIG.thabo.blockFiles);
    sprites.current.thabo.hit    = loadNamedFrames(thaboBase, SPRITE_CONFIG.thabo.hitFiles);

    totalFrames.current =
      Object.values(SPRITE_CONFIG.khotso.framesPerState).reduce((a,b)=>a+b,0) +
      Object.values(SPRITE_CONFIG.thabo.framesPerState).reduce((a,b)=>a+b,0);

    // Set idle frames
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
  const handleTouchBlockStart  = (e) => { e.preventDefault(); touchBlock.current = true; };
  const handleTouchBlockEnd    = (e) => { e.preventDefault(); touchBlock.current = false; };

  // ---------- Hit detection ----------
  const applyDamage = (attacker, defender, isBlocked) => {
    const damage = isBlocked ? BLOCKED_DAMAGE : ATTACK_DAMAGE;
    defender.health = Math.max(0, defender.health - damage);
    
    defender.hitStunTimer = HIT_STUN_DURATION;
    if (!isBlocked) {
      defender.state = 'hit';
      defender.frameTimer = 0;
    }

    if (defender.health <= 0) {
      winner.current = attacker === player.current ? 'Khotso' : 'Thabo';
      roundState.current = 'roundEnd';
    }
  };

  const checkAttackHit = (attacker, defender) => {
    if (!attacker.hitActive) return;
    const distance = Math.abs(attacker.x - defender.x);
    if (distance < ATTACK_RANGE) {
      attacker.hitActive = false;
      const isBlocked = defender.blocking && 
        ((attacker.facingRight && defender.x > attacker.x) || 
         (!attacker.facingRight && defender.x < attacker.x));
      applyDamage(attacker, defender, isBlocked);
    }
  };

  // ---------- AI Logic ----------
  const updateAI = (deltaTime) => {
    const p1 = player.current;
    const p2 = opponent.current;

    if (p2.hitStunTimer > 0 || p2.state === 'attack' || p2.state === 'land') return;

    aiDecisionTimer.current -= deltaTime;

    if (aiDecisionTimer.current <= 0 && p2.grounded && p2.state !== 'attack') {
      const distance = Math.abs(p1.x - p2.x);

      if (distance < AI_ATTACK_RANGE) {
        const r = Math.random();
        if (r < 0.45) aiCurrentAction.current = 'attack';
        else if (r < 0.75) aiCurrentAction.current = 'block';
        else if (r < 0.9) aiCurrentAction.current = 'jump';
        else aiCurrentAction.current = 'idle';
      } else if (distance < AI_AGGRO_RANGE) {
        const r = Math.random();
        if (r < 0.5) aiCurrentAction.current = 'chase';
        else if (r < 0.7) aiCurrentAction.current = 'block';
        else if (r < 0.9) aiCurrentAction.current = 'jump';
        else aiCurrentAction.current = 'idle';
      } else {
        aiCurrentAction.current = 'chase';
      }

      aiDecisionTimer.current = 400 + Math.random() * 400;
    }

    if (p2.grounded && p2.state !== 'attack' && p2.state !== 'land' && p2.hitStunTimer <= 0) {
      const moveDir = p1.x < p2.x ? -1 : 1;

      switch (aiCurrentAction.current) {
        case 'chase':
          p2.vx = moveDir * p2.speed;
          p2.blocking = false;
          p2.state = 'walk';
          break;
        case 'attack':
          p2.vx = 0;
          p2.blocking = false;
          if (!p2.attackLock) {
            p2.state = 'attack';
            p2.frameTimer = 0;
            p2.attackLock = true;
            p2.hitActive = true;
          }
          break;
        case 'block':
          p2.vx = 0;
          p2.blocking = true;
          p2.state = 'block';
          break;
        case 'jump':
          p2.vx = moveDir * p2.speed * 0.5;
          p2.vy = p2.jumpForce;
          p2.grounded = false;
          p2.blocking = false;
          p2.state = 'jump';
          p2.frameTimer = 0;
          aiCurrentAction.current = 'idle';
          break;
        default:
          p2.vx = 0;
          p2.blocking = false;
          p2.state = 'idle';
          break;
      }
    }

    p2.facingRight = p2.x < p1.x;
  };

  // ---------- Drawing functions ----------
  const drawBackground = (ctx, canvas) => {
    if (arenaLoaded.current && arenaImage.current) {
      ctx.drawImage(arenaImage.current, 0, 0, canvas.width, canvas.height);
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
      let dw = char.width;
      let dh = char.height;
      if (char.state === 'attack' || char.state === 'hit') {
        dw = img.naturalWidth;
        dh = img.naturalHeight;
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

    const kx = 20, ky = 20;
    ctx.save();
    ctx.font = 'bold 18px Arial'; ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.fillText('Khotso (You)', kx, ky - 5);
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
    ctx.fillText('Thabo (AI)', canvas.width - 20, ty - 5);
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
                  elapsed > ROUND_INTRO_DURATION - 500 ? 1 - (elapsed - (ROUND_INTRO_DURATION - 500)) / 500 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 64px Arial'; ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText(`Round ${roundNumber.current}`, canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '28px Arial'; ctx.fillStyle = '#fff';
    ctx.fillText('Fight!', canvas.width / 2, canvas.height / 2 + 30);
    ctx.restore();
  };

  const drawRoundEnd = (ctx, canvas) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 56px Arial'; ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText(`${winner.current} Wins!`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '24px Arial'; ctx.fillStyle = '#fff';
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 30);
    ctx.restore();
  };

  const drawControls = (ctx, canvas) => {
    ctx.save();
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.textAlign = 'left';
    ctx.fillText('Khotso: W (Jump) | A/D (Move) | S (Block) | J (Attack)', 20, canvas.height - 40);
    ctx.fillText('Thabo: AI Controlled', 20, canvas.height - 20);
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
    if (roundState.current === 'intro') {
      if (Date.now() - roundIntroStart.current > ROUND_INTRO_DURATION) {
        roundState.current = 'fighting';
      }
      return;
    }

    if (keys.current['r'] || keys.current['R']) { resetRound(); return; }
    if (roundState.current === 'roundEnd') return;

    const p1 = player.current;
    const p2 = opponent.current;
    const groundY = canvas.height * groundFrac;

    if (p1.hitStunTimer > 0) p1.hitStunTimer -= deltaTime;
    if (p2.hitStunTimer > 0) p2.hitStunTimer -= deltaTime;

    // --- PLAYER 1: KHOTSO ---
    const isStunned1 = p1.hitStunTimer > 0;
    const blockPressed1 = (keys.current['s'] || keys.current['S'] || touchBlock.current) && p1.grounded && !isStunned1;

    if (!isStunned1) {
      p1.blocking = blockPressed1;

      const attackPressedP1 = keys.current['j'] || keys.current['J'] || touchAttack.current;
      if (attackPressedP1 && !p1.attackLock && p1.grounded && !p1.blocking) {
        p1.state = 'attack';
        p1.frameTimer = 0;
        p1.attackLock = true;
        p1.hitActive = true;
      }

      let moveDirP1 = 0;
      if (!p1.blocking && p1.state !== 'attack') {
        if (keys.current['a'] || keys.current['A'] || touchMoveLeft.current) moveDirP1 -= 1;
        if (keys.current['d'] || keys.current['D'] || touchMoveRight.current) moveDirP1 += 1;
      }
      p1.vx = p1.blocking ? 0 : moveDirP1 * p1.speed;

      if ((keys.current['w'] || keys.current['W'] || touchJump.current) && p1.grounded && !p1.blocking && p1.state !== 'attack') {
        p1.vy = p1.jumpForce;
        p1.grounded = false;
        p1.frameTimer = 0;
        p1.state = 'jump';
      }
    } else {
      p1.vx = 0;
      p1.blocking = false;
    }

    // --- PLAYER 2: THABO (AI) ---
    const isStunned2 = p2.hitStunTimer > 0;
    if (!isStunned2) {
      updateAI(deltaTime);
    } else {
      p2.vx = 0;
      p2.blocking = false;
    }

    // --- APPLY PHYSICS ---
    const applyPhysics = (char) => {
      char.vy += 0.6;
      char.x += char.vx;
      char.y += char.vy;

      const boundaryBuffer = 50;
      if (char.x < boundaryBuffer) char.x = boundaryBuffer;
      if (char.x > canvas.width - boundaryBuffer - char.width) char.x = canvas.width - boundaryBuffer - char.width;

      if (char.y > groundY) {
        char.y = groundY;
        char.vy = 0;
        if (!char.grounded) {
          char.landTimer = 15;
          if (char.hitStunTimer <= 0) char.state = 'land';
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

    // --- FACING ---
    if (p1.vx > 0) p1.facingRight = true;
    else if (p1.vx < 0) p1.facingRight = false;
    else if (p1.state === 'idle' || p1.state === 'attack' || p1.state === 'block') p1.facingRight = p1.x < p2.x;

    // --- STATE SWITCHING ---
    const updateState = (char, maxAttackFrames) => {
      if (char.hitStunTimer > 0) {
        if (char.state !== 'hit') { char.state = 'hit'; char.frameTimer = 0; }
      } else if (char.state === 'hit') {
        char.state = char.grounded ? 'idle' : 'jump';
        char.frameTimer = 0;
      } else if (!char.grounded && char.state !== 'attack') {
        char.state = 'jump';
      } else if (char.state === 'attack') {
        if (Math.floor(char.frameTimer) >= maxAttackFrames) {
          char.attackLock = false;
          char.hitActive = false;
          char.state = char.grounded ? 'idle' : 'jump';
          char.frameTimer = 0;
        }
      } else if (char.state === 'block') {
        if (!char.blocking) {
          char.state = 'idle';
          char.frameTimer = 0;
        }
      } else if (char.grounded) {
        if (char.landTimer > 0) {
          char.state = 'land'; char.landTimer--;
        } else if (char.blocking) {
          char.state = 'block'; char.frameTimer = 0;
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
      if (char.state === 'walk' || char.state === 'jump' || char.state === 'attack' || char.state === 'hit') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (char.state === 'block') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed * 0.3;
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height * groundFrac;

    const reset = (char, x, facingRight) => {
      char.x = x; char.y = groundY; char.vx = 0; char.vy = 0;
      char.grounded = true; char.state = 'idle'; char.facingRight = facingRight;
      char.attackLock = false; char.hitActive = false; char.blocking = false;
      char.hitStunTimer = 0; char.health = PLAYER_MAX_HEALTH;
      char.frameTimer = 0; char.currentFrame = 0;
      char.landTimer = 0; char.landAnimFinished = false;
    };

    reset(player.current, 200, true);
    reset(opponent.current, 600, false);

    aiDecisionTimer.current = 500;
    aiCurrentAction.current = 'idle';
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
    const deltaTime = Math.min(timestamp - lastTimestamp, 33);
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

    if (roundState.current === 'intro') drawRoundIntro(ctx, canvas);
    else if (roundState.current === 'roundEnd') drawRoundEnd(ctx, canvas);

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
    roundIntroStart.current = Date.now();
    roundState.current = 'intro';

    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ', 'w','W','a','A','s','S','d','D','j','J','r','R'].includes(e.key)) e.preventDefault();
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
            ◀ Move
          </button>
          <button className="touch-btn jump-btn"
            onTouchStart={handleTouchJumpStart} onTouchEnd={handleTouchJumpEnd} onTouchCancel={handleTouchJumpEnd}
            onMouseDown={handleTouchJumpStart} onMouseUp={handleTouchJumpEnd} onMouseLeave={handleTouchJumpEnd}>
            ▲ Jump
          </button>
          <button className="touch-btn atk-btn"
            onTouchStart={handleTouchAttackStart} onTouchEnd={handleTouchAttackEnd} onTouchCancel={handleTouchAttackEnd}
            onMouseDown={handleTouchAttackStart} onMouseUp={handleTouchAttackEnd} onMouseLeave={handleTouchAttackEnd}
            style={{background: '#d32f2f', color: 'white', border: '2px solid #fff'}}>
            ⚔️ Attack
          </button>
          <button className="touch-btn"
            onTouchStart={handleTouchBlockStart} onTouchEnd={handleTouchBlockEnd} onTouchCancel={handleTouchBlockEnd}
            onMouseDown={handleTouchBlockStart} onMouseUp={handleTouchBlockEnd} onMouseLeave={handleTouchBlockEnd}
            style={{background: '#1565C0', color: 'white', border: '2px solid #fff'}}>
            🛡️ Block
          </button>
          <button className="touch-btn right-btn"
            onTouchStart={handleTouchRightStart} onTouchEnd={handleTouchRightEnd} onTouchCancel={handleTouchRightEnd}
            onMouseDown={handleTouchRightStart} onMouseUp={handleTouchRightEnd} onMouseLeave={handleTouchRightEnd}>
            ▶ Move
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;