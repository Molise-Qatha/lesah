import React, { useEffect, useRef, useState } from 'react';
import './HoKalla.css';

// ---- SPRITE CONFIGURATION ----
const SPRITE_CONFIG = {
  khotso: {
    basePath: '/images/characters/khotso/',
    framesPerState: {
      idle: 1, walk: 5, land: 5, crouch: 7, jump: 7, 
      attack: 6,     // Reads from /attacks/horizontal_swing/
      kick: 6,       // Reads from /kicks/jumping_kick/
      power: 8,      // Reads from /powers/rivers_flow/
      ultimate: 5,   // Reads from /powers/ancestors_wrath/
      block: 5, hit: 6,
    },
  },
  thabo: {
    basePath: '/images/characters/thabo/',
    framesPerState: {
      idle: 1, walk: 3, land: 3, crouch: 4, jump: 6, 
      attack: 5,     // Reads from Tattack1.png etc
      block: 1,      // 🛠️ Temporarily set to 1 to stop 404s
      hit: 1,        // 🛠️ Temporarily set to 1 to stop 404s
    },
    nameSuffix: '-removebg-preview',
  },
  animationSpeed: 10,
  targetHeight: 200, 
};

const ARENA_PATH = '/images/arenas/arena1.png';
const PLAYER_MAX_HEALTH = 100;
const ATTACK_DAMAGE = 10;           
const KICK_DAMAGE = 12;
const POWER_DAMAGE = 30;
const ULTIMATE_DAMAGE = 50;
const ATTACK_RANGE = 90; // 🛠️ Increased range
const KICK_RANGE = 100;
const POWER_RANGE = 150;
const AI_AGGRO_RANGE = 300;
const ROUND_INTRO_DURATION = 3000;
const HIT_STUN_DURATION = 400;     

const createPlaceholderSound = () => {
  let audioCtx = null;
  return { play: () => { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); gain.gain.value = 0.01; osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.05); } catch (e) {} } };
};
const SOUNDS = { punch: createPlaceholderSound(), block: createPlaceholderSound(), hit: createPlaceholderSound(), ko: createPlaceholderSound() };

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});
  
  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const touchAttack = useRef(false);
  const touchKick = useRef(false);

  const khotsoHealthRef = useRef(PLAYER_MAX_HEALTH);
  const thaboHealthRef = useRef(PLAYER_MAX_HEALTH);
  const powerMeterRef = useRef(0); 
  const [, forceUpdate] = useState(0);

  const sprites = useRef({
    khotso: { idle: [], walk: [], jump: [], land: [], crouch: [], attack: [], kick: [], power: [], ultimate: [], block: [], hit: [] },
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
    x: 200, y: 0, width: 100, height: SPRITE_CONFIG.targetHeight, vx: 0, vy: 0, speed: 3.5, jumpForce: -9,
    facingRight: true, grounded: false, state: 'idle', landTimer: 0, currentFrame: 0, frameTimer: 0,
    landAnimFinished: false, crouching: false, blocking: false, attackLock: false, hitStunTimer: 0,
    hitActive: false, health: PLAYER_MAX_HEALTH, maxHealth: PLAYER_MAX_HEALTH,
  });

  const opponent = useRef({
    x: 600, y: 0, width: 100, height: SPRITE_CONFIG.targetHeight, vx: 0, vy: 0, speed: 2.5, jumpForce: -9,
    facingRight: false, grounded: false, state: 'idle', landTimer: 0, currentFrame: 0, frameTimer: 0,
    landAnimFinished: false, crouching: false, blocking: false, attackLock: false, hitStunTimer: 0,
    hitActive: false, health: PLAYER_MAX_HEALTH, maxHealth: PLAYER_MAX_HEALTH,
  });

  const camera = useRef({ x: 0, y: 0 });
  const fpsState = useRef({ lastTime: 0, fps: 0, frameCount: 0, fpsUpdateTime: 0 });
  const groundFrac = 0.65;

  // ---------- Load sprites and arena ----------
  useEffect(() => {
    const arenaImg = new Image();
    arenaImg.src = ARENA_PATH;
    arenaImg.onload = () => { arenaImage.current = arenaImg; arenaLoaded.current = true; };

    const getScaledDimensions = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return { width: 100, height: SPRITE_CONFIG.targetHeight };
      const ratio = SPRITE_CONFIG.targetHeight / img.naturalHeight;
      return { width: Math.floor(img.naturalWidth * ratio), height: SPRITE_CONFIG.targetHeight };
    };

    // ------------- KHOTSO LOADERS -------------
    const loadKhotsoSubFolderFrames = (subfolder, count) => {
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.khotso.basePath}${subfolder}/${i}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Khotso ${subfolder}/${i}.png`);
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

    // ------------- THABO LOADERS (Fixed for 404s) -------------
    const loadThaboFrames = (prefix, count) => {
      const arr = [];
      const suffix = SPRITE_CONFIG.thabo.nameSuffix;
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.thabo.basePath}${prefix}${i}${suffix}.png`;
        img.onload = onFrameLoad;
        img.onerror = () => console.warn(`Missing Thabo ${prefix}${i}${suffix}.png`);
        arr.push(img);
      }
      return arr;
    };

    const loadThaboAttackFrames = () => {
      const arr = [];
      for (let i = 1; i <= SPRITE_CONFIG.thabo.framesPerState.attack; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.thabo.basePath}Tattack${i}.png`;
        img.onload = onFrameLoad;
        arr.push(img);
      }
      return arr;
    };

    const onFrameLoad = () => {
      loadedCount.current++;
      if (loadedCount.current >= totalFrames.current) {
        if (sprites.current.khotso.walk[0]?.complete) {
          const dims = getScaledDimensions(sprites.current.khotso.walk[0]);
          player.current.width = dims.width; player.current.height = dims.height;
        }
        if (sprites.current.thabo.walk[0]?.complete) {
          const dims = getScaledDimensions(sprites.current.thabo.walk[0]);
          opponent.current.width = dims.width; opponent.current.height = dims.height;
        }
      }
    };

    // --- LOAD KHOTSO FRAMES ---
    sprites.current.khotso.walk   = loadKhotsoFrames('walk', 5);
    sprites.current.khotso.jump   = loadKhotsoFrames('jump', 7);
    sprites.current.khotso.land   = loadKhotsoFrames('walk', 5);
    sprites.current.khotso.crouch = loadKhotsoFrames('crouch', 7);
    sprites.current.khotso.block  = loadKhotsoDefenseFrames(); 
    sprites.current.khotso.hit    = loadKhotsoPainFrames();      
    sprites.current.khotso.attack = loadKhotsoSubFolderFrames('attacks/horizontal_swing', 6);
    sprites.current.khotso.kick   = loadKhotsoSubFolderFrames('kicks/jumping_kick', 6);
    sprites.current.khotso.power  = loadKhotsoSubFolderFrames('powers/rivers_flow', 8);
    sprites.current.khotso.ultimate = loadKhotsoSubFolderFrames('powers/ancestors_wrath', 5);

    // --- LOAD THABO FRAMES ---
    sprites.current.thabo.walk   = loadThaboFrames('walk', 3);
    sprites.current.thabo.jump   = loadThaboFrames('jump', 6);
    sprites.current.thabo.land   = loadThaboFrames('walk', 3);
    sprites.current.thabo.crouch = loadThaboFrames('crouch', 4);
    sprites.current.thabo.attack = loadThaboAttackFrames();
    sprites.current.thabo.block  = loadThaboFrames('block', SPRITE_CONFIG.thabo.framesPerState.block);
    sprites.current.thabo.hit    = loadThaboFrames('hit', SPRITE_CONFIG.thabo.framesPerState.hit);

    totalFrames.current =
      Object.values(SPRITE_CONFIG.khotso.framesPerState).reduce((a,b)=>a+b,0) +
      Object.values(SPRITE_CONFIG.thabo.framesPerState).reduce((a,b)=>a+b,0);

    const checkIdle = setInterval(() => {
      if (sprites.current.khotso.walk[0]?.complete) sprites.current.khotso.idle = [sprites.current.khotso.walk[0]];
      if (sprites.current.thabo.walk[0]?.complete) sprites.current.thabo.idle = [sprites.current.thabo.walk[0]];
      if (sprites.current.khotso.idle.length && sprites.current.thabo.idle.length) clearInterval(checkIdle);
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
  const handleTouchKickStart   = (e) => { e.preventDefault(); touchKick.current = true; };
  const handleTouchKickEnd     = (e) => { e.preventDefault(); touchKick.current = false; };

  const playSound = (sound) => { if (sound && sound.play) { try { sound.play(); } catch (e) {} } };

  // 🛠️ FIXED HITBOX: ACTIVE FOR LONGER, WORKS ON GROUND
  const checkAttackHit = (attacker, defender, damageVal, range) => {
    if (!attacker.hitActive) return;
    const distance = Math.abs(attacker.x - defender.x);
    const halfWidth = attacker.width / 2;
    if (distance > halfWidth && distance < range) {
      attacker.hitActive = false;
      const isBlocked = defender.blocking && ((attacker.facingRight && defender.x > attacker.x) || (!attacker.facingRight && defender.x < attacker.x));
      const damage = isBlocked ? 2 : damageVal;
      defender.health = Math.max(0, defender.health - damage);

      if (!isBlocked) {
        if (defender === opponent.current) powerMeterRef.current = Math.min(100, powerMeterRef.current + 15);
        if (defender === player.current) powerMeterRef.current = Math.max(0, powerMeterRef.current - 10);
      }

      if (defender === player.current) khotsoHealthRef.current = defender.health;
      else thaboHealthRef.current = defender.health;
      forceUpdate(prev => prev + 1);
      
      if (isBlocked) { playSound(SOUNDS.block); } 
      else { playSound(SOUNDS.punch); playSound(SOUNDS.hit); }

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

  const updateAI = (deltaTime) => {
    const p1 = player.current, p2 = opponent.current;
    if (p2.hitStunTimer > 0 || p2.state === 'attack' || p2.state === 'land') return;
    aiDecisionTimer.current -= deltaTime;
    if (aiDecisionTimer.current <= 0 && p2.grounded && p2.state !== 'attack') {
      const distance = Math.abs(p1.x - p2.x);
      if (distance < AI_AGGRO_RANGE) {
        const r = Math.random();
        if (r < 0.45) aiCurrentAction.current = 'attack';
        else if (r < 0.75) aiCurrentAction.current = 'block';
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
        case 'chase': p2.vx = moveDir * p2.speed; p2.blocking = false; p2.state = 'walk'; break;
        case 'attack': p2.vx = 0; p2.blocking = false; if (!p2.attackLock) { p2.state = 'attack'; p2.frameTimer = 0; p2.attackLock = true; p2.hitActive = true; } break;
        case 'block': p2.vx = 0; p2.blocking = true; p2.state = 'block'; break;
        case 'jump': p2.vx = moveDir * p2.speed * 0.5; p2.vy = p2.jumpForce; p2.grounded = false; p2.blocking = false; p2.state = 'jump'; p2.frameTimer = 0; aiCurrentAction.current = 'idle'; break;
        default: p2.vx = 0; p2.blocking = false; p2.state = 'idle'; break;
      }
    }
    p2.facingRight = p2.x < p1.x;
  };

  const drawBackground = (ctx, canvas) => {
    if (arenaLoaded.current && arenaImage.current) {
      const img = arenaImage.current;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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

  const drawTitle = (ctx, canvas) => {
    ctx.save();
    ctx.font = 'bold 42px Georgia, serif'; ctx.fillStyle = '#dcb350';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText('HO KALLA', canvas.width / 2, 75);
    ctx.restore();
  };

  const drawFPS = (ctx, canvas, fps) => {
    ctx.save();
    ctx.font = '16px monospace'; ctx.fillStyle = '#ff0';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 3; ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${fps}`, 10, canvas.height - 10);
    ctx.restore();
  };

  const drawRoundIntro = (ctx, canvas) => {
    const elapsed = Date.now() - roundIntroStart.current;
    if (elapsed > ROUND_INTRO_DURATION) { roundState.current = 'fighting'; return; }
    const alpha = elapsed < 500 ? elapsed / 500 : elapsed > ROUND_INTRO_DURATION - 500 ? 1 - (elapsed - (ROUND_INTRO_DURATION - 500)) / 500 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 64px Georgia, serif'; ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 10; ctx.textAlign = 'center';
    ctx.fillText(`ROUND ${roundNumber.current}`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '28px Arial'; ctx.fillStyle = '#fff'; ctx.fillText('Fight!', canvas.width / 2, canvas.height / 2 + 40);
    ctx.restore();
  };

  const drawRoundEnd = (ctx, canvas) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 56px Georgia, serif'; ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 10; ctx.textAlign = 'center';
    ctx.fillText(`${winner.current} Wins!`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '24px Arial'; ctx.fillStyle = '#fff'; ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 30);
    ctx.restore();
  };

  const update = (canvas, deltaTime) => {
    if (roundState.current === 'intro') {
      if (Date.now() - roundIntroStart.current > ROUND_INTRO_DURATION) roundState.current = 'fighting';
      return;
    }
    if (keys.current['r'] || keys.current['R']) { resetRound(); return; }
    if (roundState.current === 'roundEnd') return;

    const p1 = player.current, p2 = opponent.current, groundY = canvas.height * groundFrac;
    if (p1.hitStunTimer > 0) p1.hitStunTimer -= deltaTime;
    if (p2.hitStunTimer > 0) p2.hitStunTimer -= deltaTime;

    const isStunned1 = p1.hitStunTimer > 0;
    const blockPressed1 = (keys.current['k'] || keys.current['K'] || touchKick.current) && p1.grounded && !isStunned1;
    
    if (!isStunned1) {
      p1.blocking = blockPressed1;

      // 🛠️ FIXED: Crouching now works with Down Arrow
      const crouchPressed = keys.current['ArrowDown'];
      p1.crouching = crouchPressed && p1.grounded && p1.state !== 'attack' && p1.state !== 'kick' && p1.state !== 'power';

      if (p1.grounded && !p1.crouching) {
        if ((keys.current['j'] || keys.current['J'] || touchAttack.current) && !p1.attackLock && !p1.blocking) {
          p1.state = 'attack'; p1.frameTimer = 0; p1.attackLock = true; p1.hitActive = true;
        }
        if ((keys.current['u'] || keys.current['U']) && !p1.attackLock && !p1.blocking && powerMeterRef.current >= 100) {
          powerMeterRef.current = 0; 
          p1.state = 'power'; p1.frameTimer = 0; p1.attackLock = true; p1.hitActive = true;
        }
      } else if (!p1.grounded) {
        if ((keys.current['k'] || keys.current['K'] || touchKick.current) && !p1.attackLock) {
          p1.state = 'kick'; p1.frameTimer = 0; p1.attackLock = true; p1.hitActive = true;
        }
      }

      let moveDirP1 = 0;
      if (!p1.crouching && !p1.blocking && p1.state !== 'attack' && p1.state !== 'kick' && p1.state !== 'power') {
        if (keys.current['ArrowLeft']) moveDirP1 -= 1;
        if (keys.current['ArrowRight']) moveDirP1 += 1;
      }
      p1.vx = (p1.crouching || p1.blocking) ? 0 : moveDirP1 * p1.speed;
      
      if (keys.current['ArrowUp'] && p1.grounded && !p1.crouching && !p1.blocking && p1.state !== 'attack' && p1.state !== 'kick' && p1.state !== 'power') {
        p1.vy = p1.jumpForce; p1.grounded = false; p1.frameTimer = 0; p1.state = 'jump';
      }
    } else { p1.vx = 0; p1.blocking = false; p1.crouching = false; }

    const isStunned2 = p2.hitStunTimer > 0;
    if (!isStunned2) updateAI(deltaTime);
    else { p2.vx = 0; p2.blocking = false; }

    const applyPhysicsAndCollision = (char1, char2) => {
      char1.vy += 0.6; char1.x += char1.vx; char1.y += char1.vy;
      const boundaryBuffer = 50;
      const stageLeft = boundaryBuffer, stageRight = canvas.width - boundaryBuffer - char1.width;
      if (char1.x < stageLeft) char1.x = stageLeft;
      if (char1.x > stageRight) char1.x = stageRight;

      const dist = Math.abs(char1.x - char2.x);
      const minDist = (char1.width / 2) + (char2.width / 2);
      if (dist < minDist && char1.grounded && char2.grounded) {
        const overlap = minDist - dist;
        if (char1.x < char2.x) { char1.x -= overlap / 2; char2.x += overlap / 2; } 
        else { char1.x += overlap / 2; char2.x -= overlap / 2; }
      }
      if (char1.y > groundY) {
        char1.y = groundY; char1.vy = 0;
        if (!char1.grounded) { char1.landTimer = 15; if (char1.hitStunTimer <= 0) char1.state = 'land'; char1.frameTimer = 0; char1.landAnimFinished = false; }
        char1.grounded = true;
      } else { char1.grounded = false; }
    };

    applyPhysicsAndCollision(p1, p2);
    applyPhysicsAndCollision(p2, p1);

    // 🛠️ FIXED: Passes RANGE argument properly
    if (p1.state === 'power') checkAttackHit(p1, p2, POWER_DAMAGE, POWER_RANGE);
    else if (p1.state === 'kick') checkAttackHit(p1, p2, KICK_DAMAGE, KICK_RANGE);
    else checkAttackHit(p1, p2, ATTACK_DAMAGE, ATTACK_RANGE);
    
    checkAttackHit(p2, p1, ATTACK_DAMAGE, ATTACK_RANGE);

    if (p1.vx > 0) p1.facingRight = true;
    else if (p1.vx < 0) p1.facingRight = false;
    else if (p1.state === 'idle' || p1.state === 'attack' || p1.state === 'kick' || p1.state === 'block' || p1.state === 'power' || p1.state === 'crouch') p1.facingRight = p1.x < p2.x;

    const updateState = (char, maxAttackFrames, maxKickFrames, maxPowerFrames) => {
      if (char.hitStunTimer > 0) {
        if (char.state !== 'hit') { char.state = 'hit'; char.frameTimer = 0; }
      } else if (char.state === 'hit') {
        char.state = char.grounded ? 'idle' : 'jump'; char.frameTimer = 0;
      } else if (!char.grounded && char.state !== 'attack' && char.state !== 'kick' && char.state !== 'power') {
        char.state = 'jump';
      } else if (char.state === 'attack') {
        if (Math.floor(char.frameTimer) >= maxAttackFrames) {
          char.attackLock = false; char.hitActive = false;
          char.state = char.grounded ? 'idle' : 'jump'; char.frameTimer = 0;
        }
      } else if (char.state === 'kick') {
        if (Math.floor(char.frameTimer) >= maxKickFrames) {
          char.attackLock = false; char.hitActive = false;
          char.state = char.grounded ? 'idle' : 'jump'; char.frameTimer = 0;
        }
      } else if (char.state === 'power') {
        if (Math.floor(char.frameTimer) >= maxPowerFrames) {
          char.attackLock = false; char.hitActive = false;
          char.state = char.grounded ? 'idle' : 'jump'; char.frameTimer = 0;
        }
      } else if (char.state === 'block') {
        if (!char.blocking) { char.state = 'idle'; char.frameTimer = 0; }
      } else if (char.grounded) {
        if (char.landTimer > 0) {
          char.state = 'land'; char.landTimer--;
        } else if (char.crouching) {
          char.state = 'crouch';
        } else if (char.blocking) {
          char.state = 'block'; char.frameTimer = 0;
        } else if (Math.abs(char.vx) > 0.1) {
          char.state = 'walk';
        } else {
          char.state = 'idle';
        }
      }
    };

    updateState(p1, SPRITE_CONFIG.khotso.framesPerState.attack, SPRITE_CONFIG.khotso.framesPerState.kick, SPRITE_CONFIG.khotso.framesPerState.power);
    updateState(p2, SPRITE_CONFIG.thabo.framesPerState.attack, SPRITE_CONFIG.thabo.framesPerState.kick, SPRITE_CONFIG.thabo.framesPerState.power);

    const advanceTimer = (char, maxLandFrames) => {
      if (char.state === 'walk' || char.state === 'jump' || char.state === 'attack' || char.state === 'kick' || char.state === 'power' || char.state === 'hit') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
      } else if (char.state === 'block') {
        char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed * 0.3;
      } else if (char.state === 'land') {
        if (!char.landAnimFinished) {
          char.frameTimer += (deltaTime / 1000) * SPRITE_CONFIG.animationSpeed;
          if (Math.floor(char.frameTimer) >= maxLandFrames) { char.frameTimer = maxLandFrames - 1; char.landAnimFinished = true; }
        }
      } else if (char.state === 'idle' || char.state === 'crouch') {
        char.frameTimer = 0;
      }
      char.currentFrame = char.frameTimer;
    };

    advanceTimer(p1, SPRITE_CONFIG.khotso.framesPerState.land);
    advanceTimer(p2, SPRITE_CONFIG.thabo.framesPerState.land);
    camera.current.x = 0;
  };

  const resetRound = () => {
    const p1 = player.current, p2 = opponent.current, canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height * groundFrac;
    p1.x = 200; p1.y = groundY; p1.vx = 0; p1.vy = 0; p1.grounded = true; p1.state = 'idle'; p1.facingRight = true;
    p1.attackLock = false; p1.hitActive = false; p1.crouching = false; p1.blocking = false; p1.hitStunTimer = 0;
    p1.health = PLAYER_MAX_HEALTH; p1.frameTimer = 0; p1.currentFrame = 0;
    p2.x = 600; p2.y = groundY; p2.vx = 0; p2.vy = 0; p2.grounded = true; p2.state = 'idle'; p2.facingRight = false;
    p2.attackLock = false; p2.hitActive = false; p2.crouching = false; p2.blocking = false; p2.hitStunTimer = 0;
    p2.health = PLAYER_MAX_HEALTH; p2.frameTimer = 0; p2.currentFrame = 0;

    khotsoHealthRef.current = PLAYER_MAX_HEALTH;
    thaboHealthRef.current = PLAYER_MAX_HEALTH;
    powerMeterRef.current = 0;
    forceUpdate(prev => prev + 1);

    aiDecisionTimer.current = 500; aiCurrentAction.current = 'idle'; winner.current = null;
    roundNumber.current = 1; roundState.current = 'intro'; roundIntroStart.current = Date.now();
  };

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
    drawFPS(ctx, canvas, fs.fps);
    
    if (roundState.current === 'intro') drawRoundIntro(ctx, canvas);
    else if (roundState.current === 'roundEnd') drawRoundEnd(ctx, canvas);

    animFrameId.current = requestAnimationFrame(gameLoop);
  };

  const handleResize = () => {
    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth; canvas.height = container.clientHeight;
    resetRound();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    roundIntroStart.current = Date.now(); roundState.current = 'intro';
    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ', 'j','J','k','K','u','U','r','R'].includes(e.key)) e.preventDefault();
    };
    const keyUp = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp);
    handleResize(); window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    animFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp);
      window.removeEventListener('resize', handleResize); resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []); 

  const isTouchDevice = 'ontouchstart' in window;

  return (
    <div className="ho-kalla-container" ref={containerRef}>
      <canvas ref={canvasRef} className="ho-kalla-canvas" />
      
      <div className="hud-overlay">
        <div className="timer-container">
          <div className="timer-circle">99</div>
          <div className="round-label">ROUND 1</div>
        </div>

        <div className="player-hud left">
          <div className="portrait-frame">
            <img src="/images/ui/khotso-portrait.png" alt="Khotso" />
          </div>
          <div className="player-info">
            <div className="player-name">KHOTSO</div>
            <div className="health-bar-container">
              <div 
                className="health-bar-fill" 
                id="khotso-health" 
                style={{width: `${(khotsoHealthRef.current / PLAYER_MAX_HEALTH) * 100}%`}}
              ></div>
            </div>
            <div className="super-meter">
              <div className={`super-dot ${powerMeterRef.current >= 33 ? 'filled' : ''}`}></div>
              <div className={`super-dot ${powerMeterRef.current >= 66 ? 'filled' : ''}`}></div>
              <div className={`super-dot ${powerMeterRef.current >= 100 ? 'filled' : ''}`}></div>
            </div>
          </div>
        </div>

        <div className="player-hud right">
          <div className="portrait-frame">
            <img src="/images/ui/thabo-portrait.png" alt="Thabo" />
          </div>
          <div className="player-info">
            <div className="player-name">THABO</div>
            <div className="health-bar-container">
              <div 
                className="health-bar-fill" 
                id="thabo-health" 
                style={{width: `${(thaboHealthRef.current / PLAYER_MAX_HEALTH) * 100}%`}}
              ></div>
            </div>
            <div className="super-meter">
              <div className="super-dot filled"></div>
              <div className="super-dot filled"></div>
              <div className="super-dot"></div>
            </div>
          </div>
        </div>
      </div>

      {isTouchDevice && (
        <div className="touch-controls">
          <button className="touch-btn left-btn" onTouchStart={handleTouchLeftStart} onTouchEnd={handleTouchLeftEnd} onTouchCancel={handleTouchLeftEnd} onMouseDown={handleTouchLeftStart} onMouseUp={handleTouchLeftEnd} onMouseLeave={handleTouchLeftEnd}>◀</button>
          <button className="touch-btn jump-btn" onTouchStart={handleTouchJumpStart} onTouchEnd={handleTouchJumpEnd} onTouchCancel={handleTouchJumpEnd} onMouseDown={handleTouchJumpStart} onMouseUp={handleTouchJumpEnd} onMouseLeave={handleTouchJumpEnd}>▲</button>
          <button className="touch-btn atk-btn" onTouchStart={handleTouchAttackStart} onTouchEnd={handleTouchAttackEnd} onTouchCancel={handleTouchAttackEnd} onMouseDown={handleTouchAttackStart} onMouseUp={handleTouchAttackEnd} onMouseLeave={handleTouchAttackEnd} style={{background: '#d32f2f', color: 'white', border: '2px solid #fff'}}>⚔️</button>
          <button className="touch-btn" onTouchStart={handleTouchKickStart} onTouchEnd={handleTouchKickEnd} onTouchCancel={handleTouchKickEnd} onMouseDown={handleTouchKickStart} onMouseUp={handleTouchKickEnd} onMouseLeave={handleTouchKickEnd} style={{background: '#ff9800', color: 'white', border: '2px solid #fff'}}>🦶 Kick</button>
          <button className="touch-btn right-btn" onTouchStart={handleTouchRightStart} onTouchEnd={handleTouchRightEnd} onTouchCancel={handleTouchRightEnd} onMouseDown={handleTouchRightStart} onMouseUp={handleTouchRightEnd} onMouseLeave={handleTouchRightEnd}>▶</button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;
