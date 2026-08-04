import React, { useEffect, useRef, useState } from 'react';
import './HoKalla.css';

// ---- SPRITE CONFIGURATION ----
const SPRITE_CONFIG = {
  khotso: {
    basePath: '/images/characters/khotso/',
    framesPerState: {
      idle: 1,
      walk: 5,
      // 🛠️ FIX: Land reuses the last walk frame to prevent 404s
      land: 5,   
      crouch: 7,
      jump: 7,
      attack: 3,
      block: 5,    
      hit: 6,      
    },
  },
  thabo: {
    basePath: '/images/characters/thabo/',
    framesPerState: {
      idle: 1,
      walk: 3,
      land: 3,
      crouch: 4,
      jump: 6,
      attack: 5,
      block: 7,    
      hit: 5,      
    },
    nameSuffix: '-removebg-preview',
  },
  animationSpeed: 10,
  // 🛠️ All PNGs will be scaled to this height automatically!
  targetHeight: 200, 
};

const ARENA_PATH = '/images/arenas/arena1.png';
const PLAYER_MAX_HEALTH = 100;
const ATTACK_DAMAGE = 10;           
const BLOCKED_DAMAGE = 2;          
const ATTACK_RANGE = 80;
const AI_AGGRO_RANGE = 300;
const AI_ATTACK_RANGE = 70;
const ROUND_INTRO_DURATION = 3000;
const HIT_STUN_DURATION = 400;     

// 🛠️ FIX: Placeholder sounds that will NOT crash the game
const createPlaceholderSound = () => {
  let audioCtx = null;
  return {
    play: () => {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Resume context if it's blocked
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        // Play a tiny silent beep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.value = 0.01; 
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        // Silently ignore audio errors so the game never crashes
      }
    },
  };
};

const SOUNDS = {
  punch: createPlaceholderSound(),
  block: createPlaceholderSound(),
  hit: createPlaceholderSound(),
  ko: createPlaceholderSound(),
};

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

    const getScaledDimensions = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return { width: 100, height: SPRITE_CONFIG.targetHeight };
      const ratio = SPRITE_CONFIG.targetHeight / img.naturalHeight;
      return {
        width: Math.floor(img.naturalWidth * ratio),
        height: SPRITE_CONFIG.targetHeight
      };
    };

    const loadKhotsoAttackFrames = () => {
      const arr = [];
      for (let i = 1; i <= SPRITE_CONFIG.khotso.framesPerState.attack; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.khotso.basePath}Kattack${i}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Khotso Kattack${i}.png`);
        arr.push(img);
      }
      return arr;
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

    const loadKhotsoDefenseFrames = () => {
      const filenames = ['blockhold', 'guardraise', 'highblock', 'lowblock', 'midblock'];
      const arr = [];
      filenames.forEach(name => {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.khotso.basePath}defense/${name}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Khotso defense/${name}.png`);
        arr.push(img);
      });
      return arr;
    };

    const loadKhotsoPainFrames = () => {
      const filenames = ['heavyimpact', 'hitstart', 'knockedback', 'offbalance', 'regainingposture', 'staggerback'];
      const arr = [];
      filenames.forEach(name => {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.khotso.basePath}pain/${name}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Khotso pain/${name}.png`);
        arr.push(img);
      });
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

    const loadThaboDefenseFrames = () => {
      const filenames = ['counterfollowthrough', 'guardraise', 'heavyblockimpact', 'highblock', 'lightblockimpact', 'recoverfromblock', 'returntoguard'];
      const arr = [];
      filenames.forEach(name => {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.thabo.basePath}defense/${name}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Thabo defense/${name}.png`);
        arr.push(img);
      });
      return arr;
    };

    const loadThaboPainFrames = () => {
      const filenames = ['heavyhit', 'hitstart', 'knockedback', 'lowhit', 'staggerback'];
      const arr = [];
      filenames.forEach(name => {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.thabo.basePath}pain/${name}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Thabo pain/${name}.png`);
        arr.push(img);
      });
      return arr;
    };

    const onFrameLoad = () => {
      loadedCount.current++;
      if (loadedCount.current >= totalFrames.current) {
        if (sprites.current.khotso.walk[0]?.complete) {
          const dims = getScaledDimensions(sprites.current.khotso.walk[0]);
          player.current.width = dims.width;
          player.current.height = dims.height;
        }
        if (sprites.current.thabo.walk[0]?.complete) {
          const dims = getScaledDimensions(sprites.current.thabo.walk[0]);
          opponent.current.width = dims.width;
          opponent.current.height = dims.height;
        }
      }
    };

    sprites.current.khotso.attack = loadKhotsoAttackFrames();
    sprites.current.khotso.walk   = loadKhotsoFrames('walk', 5);
    sprites.current.khotso.jump   = loadKhotsoFrames('jump', 7);
    sprites.current.khotso.land   = loadKhotsoFrames('walk', 5); // 🛠️ Uses walk frames to avoid 404
    sprites.current.khotso.crouch = loadKhotsoFrames('crouch', 7);
    sprites.current.khotso.block  = loadKhotsoDefenseFrames();
    sprites.current.khotso.hit    = loadKhotsoPainFrames();

    sprites.current.thabo.attack = loadThaboAttackFrames();
    sprites.current.thabo.walk   = loadThaboFrames('walk', 3);
    sprites.current.thabo.jump   = loadThaboFrames('jump', 6);
    sprites.current.thabo.land   = loadThaboFrames('walk', 3); // 🛠️ Uses walk frames to avoid 404
    sprites.current.thabo.crouch = loadThaboFrames('crouch', 4);
    sprites.current.thabo.block  = loadThaboDefenseFrames();
    sprites.current.thabo.hit    = loadThaboPainFrames();

    totalFrames.current =
      Object.values(SPRITE_CONFIG.khotso.framesPerState).reduce((a,b)=>a+b,0) +
      Object.values(SPRITE_CONFIG.thabo.framesPerState).reduce((a,b)=>a+b,0);

    const checkIdle = setInterval(() => {
      if (sprites.current.khotso.walk[0]?.complete) {
        sprites.current.khotso.idle = [sprites.current.khotso.walk[0]];
      }
      if (sprites.current.thabo.walk[0]?.complete) {
        sprites.current.thabo.idle = [sprites.current.thabo.walk[0]];
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

  const playSound = (sound) => {
    if (sound && sound.play) {
      try {
        sound.play();
      } catch (e) {
        // Prevents the game from crashing if audio fails
      }
    }
  };

  // ---------- Hit detection ----------
  const checkAttackHit = (attacker, defender) => {
    if (!attacker.hitActive) return;

    const distance = Math.abs(attacker.x - defender.x);
    if (distance < ATTACK_RANGE) {
      attacker.hitActive = false;
      
      const isBlocked = defender.blocking && 
        ((attacker.facingRight && defender.x > attacker.x) || 
         (!attacker.facingRight && defender.x < attacker.x));
      
      const damage = isBlocked ? BLOCKED_DAMAGE : ATTACK_DAMAGE;
      defender.health = Math.max(0, defender.health - damage);
      
      if (isBlocked) {
        playSound(SOUNDS.block);
      } else {
        playSound(SOUNDS.punch);
        playSound(SOUNDS.hit);
      }

      if (!isBlocked) {
        defender.hitStunTimer = HIT_STUN_DURATION;
        defender.state = 'hit';
        defender.frameTimer = 0;
      }

      if (defender.health <= 0) {
        winner.current = attacker === player.current ? 'Khotso' : 'Thabo';
        roundState.current = 'roundEnd';
        playSound(SOUNDS.ko);
      }
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
      const targetHeight = SPRITE_CONFIG.targetHeight;
      const targetWidth = (img.naturalWidth / img.naturalHeight) * targetHeight;
      ctx.drawImage(img, -targetWidth / 2, -targetHeight, targetWidth, targetHeight);
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
                  elapsed > ROUND_INTRO_DURATION - 500 ? 1 - (elapsed - (ROUND_INTRO_DURATION - 500)) / 500 :
                  1;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    ctx.fillText("Khotso: Arrows (Move), K (Block), J (Attack)", 20, canvas.height - 40);
    ctx.fillText("Thabo: AI Controlled", 20, canvas.height - 20);
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

    if (keys.current['r'] || keys.current['R']) {
      resetRound();
      return;
    }

    if (roundState.current === 'roundEnd') return;

    const p1 = player.current;
    const p2 = opponent.current;
    const groundY = canvas.height * groundFrac;

    if (p1.hitStunTimer > 0) p1.hitStunTimer -= deltaTime;
    if (p2.hitStunTimer > 0) p2.hitStunTimer -= deltaTime;

    const isStunned1 = p1.hitStunTimer > 0;
    const blockPressed1 = (keys.current['k'] || keys.current['K'] || touchBlock.current) && p1.grounded && !isStunned1;

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
        if (keys.current['ArrowLeft']) moveDirP1 -= 1;
        if (keys.current['ArrowRight']) moveDirP1 += 1;
      }
      p1.vx = p1.blocking ? 0 : moveDirP1 * p1.speed;

      if ((keys.current['ArrowUp']) && p1.grounded && !p1.blocking && p1.state !== 'attack') {
        p1.vy = p1.jumpForce;
        p1.grounded = false;
        p1.frameTimer = 0;
        p1.state = 'jump';
      }
    } else {
      p1.vx = 0;
      p1.blocking = false;
    }

    const isStunned2 = p2.hitStunTimer > 0;
    if (!isStunned2) {
      updateAI(deltaTime);
    } else {
      p2.vx = 0;
      p2.blocking = false;
    }

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

    checkAttackHit(p1, p2);
    checkAttackHit(p2, p1);

    if (p1.vx > 0) p1.facingRight = true;
    else if (p1.vx < 0) p1.facingRight = false;
    else if (p1.state === 'idle' || p1.state === 'attack' || p1.state === 'block') p1.facingRight = p1.x < p2.x;

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
          char.state = 'land';
          char.landTimer--;
        } else if (char.blocking) {
          char.state = 'block';
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
    const p1 = player.current;
    const p2 = opponent.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height * groundFrac;

    p1.x = 200; p1.y = groundY; p1.vx = 0; p1.vy = 0;
    p1.grounded = true; p1.state = 'idle'; p1.facingRight = true;
    p1.attackLock = false; p1.hitActive = false; p1.crouching = false;
    p1.blocking = false; p1.hitStunTimer = 0;
    p1.health = PLAYER_MAX_HEALTH; p1.frameTimer = 0; p1.currentFrame = 0;

    p2.x = 600; p2.y = groundY; p2.vx = 0; p2.vy = 0;
    p2.grounded = true; p2.state = 'idle'; p2.facingRight = false;
    p2.attackLock = false; p2.hitActive = false; p2.crouching = false;
    p2.blocking = false; p2.hitStunTimer = 0;
    p2.health = PLAYER_MAX_HEALTH; p2.frameTimer = 0; p2.currentFrame = 0;

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

    roundIntroStart.current = Date.now();
    roundState.current = 'intro';

    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ', 'j','J','k','K','r','R'].includes(e.key)) e.preventDefault();
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
            ▶ Move Right
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;