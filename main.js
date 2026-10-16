/**
 * STUDIO VØR // JÖRMUN — ARCHIVE 04
 * Exact Architecture: Pizza Samurai Frogs Style
 * 
 * Rules:
 *  1. FREEZE SERPENT MESH: Rigid, grounded, crisp graphic illustration.
 *     Subtle element floating hover: translateY(-8px to +8px) over 5s with power1.inOut.
 *     Zero internal body bending or vertex displacement.
 *  2. ISOLATED MICRO-ANIMATIONS:
 *     - Breathing cyan rune & eye glow pulse via CSS filter drop-shadow.
 *     - Water Current Particles: Slow-rising bubbles & drifting marine snow.
 *     - Caustic Light Ray Sweep: Soft angled sunlight rays sweeping horizontally.
 *  3. TYPOGRAPHY INTEGRITY:
 *     - "J Ö R M U N" centered as ONE coherent, connected headline.
 *     - Sits cleanly behind the head/body coil in one unified typographic line.
 *  4. CLEAN CAMERA DIVE TRANSITION:
 *     - Rapid depth descent (-3,480m to -9,820m).
 *     - Headline tracks out and disperses; serpent plunges past camera into abyss.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. STATE & REFERENCES
  // -------------------------------------------------------------
  const state = {
    view: 'cover', // 'cover' | 'transitioning' | 'dossier'
    audioActive: false,
    sonarMuted: true, // Muted by default to prevent repetitive beeping
    depth: -3480,
    sonarFrequency: '14.2 Hz',
    sonarPingCount: 0,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  };

  // DOM Elements
  const coverView = document.getElementById('cover-view');
  const dossierView = document.getElementById('dossier-view');
  const layer0Back = document.getElementById('layer-0-back');
  const layerBackSerpent = document.getElementById('layer-back-serpent');
  const backSerpentCanvas = document.getElementById('back-serpent-canvas');
  const layer1Typography = document.getElementById('layer-1-typography');
  const layer2Serpent = document.getElementById('layer-2-serpent');
  const frontSerpentCanvas = document.getElementById('front-serpent-canvas');
  const serpentHeadImg = document.getElementById('serpent-head-img');
  const coverHeadline = document.getElementById('cover-headline');
  const depthDisplayCover = document.getElementById('depth-display-cover');
  const depthDisplayDossier = document.getElementById('depth-display-dossier');
  const diveBtn = document.getElementById('dive-btn');
  const ascendBtn = document.getElementById('ascend-btn');
  const ascendBtnSidebar = document.getElementById('ascend-btn-sidebar');
  const audioToggle = document.getElementById('audio-toggle');
  const audioTogglePill = document.getElementById('audio-toggle-pill');
  const audioBars = document.querySelectorAll('.audio-bar');

  // Custom Cursor
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  // Canvas
  const particleCanvas = document.getElementById('particle-canvas');
  let pCtx = particleCanvas ? particleCanvas.getContext('2d') : null;

  const sonarCanvas = document.getElementById('sonar-canvas');
  let sCtx = sonarCanvas ? sonarCanvas.getContext('2d') : null;

  // -------------------------------------------------------------
  // 2. ATOMIC SINGLE-CANVAS SERPENT ENGINE (ZERO-DETACHMENT & CADENCE-PULSED)
  // Unified GPU rasterization pipeline:
  // - Head and Body rendered inside the same canvas context (0.0px drift, zero DOM mismatch)
  // - Swimming Cadence: harmonic velocity modulation v(t) = v0 * (1 + beta * cos(omega * t))
  // - Zero gaps: high segment density (24 back / 22 front) enters deep off-screen (-0.24W, 1.28H)
  // - Frenet-Serret Head Alignment: head drawn directly at dynamic collar socket
  // -------------------------------------------------------------
  class CrawlingSerpentEngine {
    constructor(backCanvas, frontCanvas, headImg, layer2Container) {
      this.backCanvas = backCanvas;
      this.frontCanvas = frontCanvas;
      this.headImg = headImg;
      this.layer2 = layer2Container;
      this.bCtx = backCanvas ? backCanvas.getContext('2d') : null;
      this.fCtx = frontCanvas ? frontCanvas.getContext('2d') : null;

      // Modular body scale segment (100% canonical 2.5D ivory diamond scales directly from dragon neck, zero horns, zero cyan ribs)
      this.segmentImg = new Image();
      this.segmentLoaded = false;
      this.segmentImg.onload = () => {
        this.segmentLoaded = true;
      };
      this.segmentImg.src = 'assets/dragon_body_canonical_2.5d_unit.png?v=26';

      // 1. Pristine dragon head - Closed mouth state
      this.headSpriteClosed = new Image();
      this.headClosedLoaded = false;
      this.headSpriteClosed.onload = () => {
        this.headClosedLoaded = true;
      };
      this.headSpriteClosed.src = 'assets/jormun_head_clean_v3.png?v=21';

      // 2. Pristine dragon head - Open mouth roaring state (100% pixel lockstep on horns/cranium/neck)
      this.headSpriteOpen = new Image();
      this.headOpenLoaded = false;
      this.headSpriteOpen.onload = () => {
        this.headOpenLoaded = true;
      };
      this.headSpriteOpen.src = 'assets/jormun_head_open_clean.png?v=21';

      // Mouth opening kinematics state (0.0 = closed, 1.0 = fully open roar)
      this.mouthOpenAmount = 0.0;
      this.roarTimer = 0.0;

      // Streamlined high-performance segment configuration (60 FPS hardware accelerated)
      this.numBackSegments = 38;
      this.backBaseSpeed = 0.020;

      this.numFrontSegments = 42;
      this.frontBaseSpeed = 0.026;

      // Respiration & swimming kinematics frequency (rad/s)
      this.breathOmega = 0.90;

      // Cached local layout metrics (computed strictly in resize())
      this.metrics = {
        w: window.innerWidth,
        h: window.innerHeight,
        baseScale: 1.0,
        headLocalX: 0,
        headLocalY: 0,
        headW: 0,
        headH: 0
      };

      this.resize();
    }

    triggerRoar(duration = 2.0) {
      this.roarTimer = duration;
    }

    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.metrics.w = w;
      this.metrics.h = h;
      this.metrics.baseScale = Math.min(Math.max(w / 1440, 0.70), 1.30);

      // Head metrics: anchor firmly offscreen to the right so neck extends out of frame
      const headW = Math.min(Math.max(w * 0.38, 340), 520);
      const headH = headW;
      // Anchor snout at ~0.72w, pushing the rear neck past w completely offscreen
      const headLocalX = w - headW * 0.72;
      const headLocalY = h * 0.08;

      this.metrics.headW = headW;
      this.metrics.headH = headH;
      this.metrics.headLocalX = headLocalX;
      this.metrics.headLocalY = headLocalY;

      // Anatomical neck collar socket on pristine head:
      // Positioned deep inside throat/neck socket: 60% width, 65% height
      this.metrics.collarLocalX = headLocalX + headW * 0.60;
      this.metrics.collarLocalY = headLocalY + headH * 0.65;
      this.metrics.tuckDepth = Math.max(150, headW * 0.42);

      if (this.backCanvas && this.bCtx) {
        this.backCanvas.width = w * dpr;
        this.backCanvas.height = h * dpr;
        this.bCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.bCtx.scale(dpr, dpr);
      }

      if (this.frontCanvas && this.fCtx) {
        this.frontCanvas.width = w * dpr;
        this.frontCanvas.height = h * dpr;
        this.fCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.fCtx.scale(dpr, dpr);
      }
    }

    bezier(t, p0, p1, p2, p3) {
      const it = 1 - t;
      const it2 = it * it;
      const it3 = it2 * it;
      const t2 = t * t;
      const t3 = t2 * t;
      return {
        x: it3 * p0.x + 3 * it2 * t * p1.x + 3 * it * t2 * p2.x + t3 * p3.x,
        y: it3 * p0.y + 3 * it2 * t * p1.y + 3 * it * t2 * p2.y + t3 * p3.y
      };
    }

    tangent(t, p0, p1, p2, p3) {
      const it = 1 - t;
      const it2 = it * it;
      const t2 = t * t;
      return {
        x: 3 * it2 * (p1.x - p0.x) + 6 * it * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x),
        y: 3 * it2 * (p1.y - p0.y) + 6 * it * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y)
      };
    }

    smoothstep(edge0, edge1, x) {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    drawBody(ctx, curve, count, phaseOffset, scaleMult, globalAlphaMult = 1.0, isForeground = false) {
      if (!ctx || !this.segmentLoaded) return;
      const spr = this.segmentImg;
      const sprW = spr.width;
      const sprH = spr.height;

      // Distribute segments with strict periodicity and swimming cadence
      const uList = [];
      for (let i = 0; i < count; i++) {
        let u = ((i / count) + phaseOffset) % 1.0;
        if (u < 0) u += 1.0;
        uList.push(u);
      }
      // Descending order for seamless scale shingle overlapping
      uList.sort((a, b) => b - a);

      for (let u of uList) {
        const pt = this.bezier(u, curve.p0, curve.p1, curve.p2, curve.p3);
        const tan = this.tangent(u, curve.p0, curve.p1, curve.p2, curve.p3);
        const angle = Math.atan2(tan.y, tan.x);

        // Scales enter completely off-screen, so all scales are 100% solid on screen
        const alpha = Math.max(0, Math.min(1, globalAlphaMult));
        if (alpha <= 0.001) continue;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle);
        ctx.scale(scaleMult, scaleMult);
        ctx.globalAlpha = alpha;
        // Blazing 60fps native hardware blit: Color grading & contrast pre-baked directly into sprite
        ctx.drawImage(spr, -sprW / 2, -sprH / 2, sprW, sprH);
        ctx.restore();
      }
    }

    updateAndDraw(time) {
      if (state.view === 'dossier') return;

      const { w, h, baseScale } = this.metrics;

      // Harmonic swimming cadence & respiration kinematics
      const respirationPhase = time * this.breathOmega;
      const spineBreath = Math.sin(respirationPhase) * (h * 0.016);

      // SWIMMING FORWARD TO THE LEFT: Negative phase accumulation so segments glide naturally to the left!
      const backPhase = (-(this.backBaseSpeed * time + (this.backBaseSpeed * 0.22 / this.breathOmega) * Math.sin(respirationPhase))) % 1.0;
      const frontPhase = (-(this.frontBaseSpeed * time + (this.frontBaseSpeed * 0.22 / this.breathOmega) * Math.sin(respirationPhase))) % 1.0;

      // -----------------------------------------------------------
      // BIOLOGICAL ROAR STATE MACHINE & TIMING:
      // Cycle: Triggers every 14.0 seconds (or immediately on user click)
      // Phase 1 (0.00s - 0.28s): Inhale / Tension (Snout tilts up, jaws closed)
      // Phase 2 (0.28s - 1.85s): Roar Unleashed (Jaws open wide, cyan abyss flares, body pulses)
      // Phase 3 (1.85s - 2.20s): Authoritative Snap Shut (Jaws close, head settles)
      // -----------------------------------------------------------
      const cycleLength = 14.0;
      const cycleTime = (time % cycleLength);
      let isRoaring = false;
      let roarProgress = 0.0;

      if (cycleTime >= 9.0 && cycleTime < 11.2) {
        isRoaring = true;
        roarProgress = (cycleTime - 9.0) / 2.2;
      }
      if (this.roarTimer > 0) {
        isRoaring = true;
        const totalDur = 2.2;
        roarProgress = Math.max(0.0, Math.min(1.0, 1.0 - (this.roarTimer / totalDur)));
        this.roarTimer -= 0.016;
      }

      let isMouthOpen = false;
      let roarSurgeY = 0.0;
      let roarPitch = 0.0;
      let roarGlow = 0.0;

      if (isRoaring) {
        if (roarProgress < 0.13) {
          // Phase 1: Inhale anticipation
          const tAnt = roarProgress / 0.13;
          roarPitch = -1.5 * tAnt;
          roarSurgeY = 3.0 * tAnt;
          isMouthOpen = false;
          roarGlow = 0.25 * tAnt;
        } else if (roarProgress < 0.84) {
          // Phase 2: Active roar display
          const roarVibe = Math.sin(time * 35.0) * 0.6;
          roarPitch = -4.2 + roarVibe;
          roarSurgeY = -12.0;
          isMouthOpen = true; // Exclusively open mouth
          roarGlow = 1.0;
        } else {
          // Phase 3: Snap shut
          const tClose = (roarProgress - 0.84) / 0.16;
          roarPitch = -4.2 * (1.0 - tClose);
          roarSurgeY = -12.0 * (1.0 - tClose);
          isMouthOpen = false; // Closed mouth
          roarGlow = 1.0 - tClose;
        }
      }

      // Dynamic head kinematics reacting to swimming breath & roar
      const headPitch = Math.sin(respirationPhase - 0.55) * 1.2 + roarPitch;
      const headBreathY = Math.sin(respirationPhase - 0.35) * 8.0 + roarSurgeY;

      // 1. BACK BODY ARCH (Pushed back, deeper in trench haze behind typography)
      // 1. BACK BODY ARCH (Receding gracefully in deep trench haze behind typography)
      // ENTERS OFF-SCREEN LEFT -> ARCHES THROUGH MID-DEPTH -> EXITS OFF-SCREEN BOTTOM
      const backCurve = {
        p0: { x: -w * 0.22, y: h * 0.95 },
        p1: { x:  w * 0.08, y: h * 0.22 + spineBreath },
        p2: { x:  w * 0.38, y: h * 0.20 - spineBreath },
        p3: { x:  w * 0.65, y: h * 1.25 }
      };

      if (this.bCtx && this.backCanvas) {
        this.bCtx.clearRect(0, 0, w, h);
        this.drawBody(
          this.bCtx,
          backCurve,
          this.numBackSegments,
          backPhase,
          baseScale * 0.26,
          0.70,
          false
        );
      }

      // 2. FRONT BODY ARCH (True serpentine mass: ~1.20x neck girth, leaving generous editorial breathing room)
      // Enters bottom-left, crests across lower third below "J Ö R M U N", exits bottom-right
      const frontCurve = {
        p0: { x: -w * 0.18, y: h * 1.15 },
        p1: { x:  w * 0.22, y: h * 0.80 - spineBreath },
        p2: { x:  w * 0.60, y: h * 0.82 + spineBreath },
        p3: { x:  w * 1.12, y: h * 1.10 }
      };

      if (this.fCtx && this.frontCanvas) {
        this.fCtx.clearRect(0, 0, w, h);

        // A. Draw front body scale shingle stream (100% canonical 2.5D ivory diamond scales, anatomically proportional to neck)
        this.drawBody(
          this.fCtx,
          frontCurve,
          this.numFrontSegments,
          frontPhase,
          baseScale * 0.38,
          1.0,
          true
        );

        // B. Draw head ATOMICALLY on the same canvas pass (100% mutually exclusive, zero ghosting)
        if (this.headClosedLoaded) {
          const headW = this.metrics.headW;
          const headH = this.metrics.headH;
          const headX = this.metrics.headLocalX;
          const headY = this.metrics.headLocalY + headBreathY;

          this.fCtx.save();
          this.fCtx.translate(headX + headW * 0.60, headY + headH * 0.65);
          this.fCtx.rotate(headPitch * Math.PI / 180);

          // Ambient cyan photophore glow intensifies during roar
          const glowAlpha = 0.35 + roarGlow * 0.55;
          this.fCtx.shadowColor = `rgba(46, 230, 202, ${glowAlpha})`;
          this.fCtx.shadowBlur = (20 + roarGlow * 35) * baseScale;

          // MUTUALLY EXCLUSIVE SPRITE DRAW:
          // When mouth is open: ONLY headSpriteOpen is drawn!
          // When mouth is closed: ONLY headSpriteClosed is drawn!
          // Since cranium/horns/neck share 100% exact pixels, there is ZERO ghosting or jumping.
          if (isMouthOpen && this.headOpenLoaded) {
            this.fCtx.drawImage(this.headSpriteOpen, -headW * 0.60, -headH * 0.65, headW, headH);
          } else {
            this.fCtx.drawImage(this.headSpriteClosed, -headW * 0.60, -headH * 0.65, headW, headH);
          }

          this.fCtx.restore();
        }
      }
    }
  }

  const crawlingSerpentEngine = (backSerpentCanvas && frontSerpentCanvas) 
    ? new CrawlingSerpentEngine(backSerpentCanvas, frontSerpentCanvas, serpentHeadImg, layer2Serpent) 
    : null;
  window.crawlingSerpentEngine = crawlingSerpentEngine;

  // Interactive Leviathan Roar: clicking canvas triggers an immediate intimidation roar
  if (frontSerpentCanvas) {
    frontSerpentCanvas.style.pointerEvents = 'auto';
    frontSerpentCanvas.addEventListener('click', (e) => {
      if (crawlingSerpentEngine) {
        crawlingSerpentEngine.triggerRoar(2.5);
      }
    });
  }

  // -------------------------------------------------------------
  // 3. RULE 2: WATER CURRENT PARTICLES (SLOW BUBBLES & MARINE SNOW)
  // -------------------------------------------------------------
  class WaterCurrentEngine {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.marineSnow = [];
      this.bubbles = [];
      this.init();
    }

    init() {
      this.resize();
      this.marineSnow = [];
      this.bubbles = [];

      // 45 slow marine snow specks
      for (let i = 0; i < 45; i++) {
        this.marineSnow.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 1.6 + 0.5,
          speedY: -(Math.random() * 0.35 + 0.12),
          speedX: (Math.random() - 0.5) * 0.18,
          alpha: Math.random() * 0.45 + 0.15,
          wobbleAngle: Math.random() * Math.PI * 2
        });
      }

      // 18 slow-rising translucent water bubbles
      for (let i = 0; i < 18; i++) {
        this.bubbles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 4.0 + 1.8,
          speedY: -(Math.random() * 0.75 + 0.35),
          wobbleSpeed: Math.random() * 0.03 + 0.015,
          wobbleAngle: Math.random() * Math.PI * 2,
          wobbleAmp: Math.random() * 0.6 + 0.3,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    updateAndDraw() {
      if (!this.ctx || state.view === 'dossier') return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw marine snow
      for (let p of this.marineSnow) {
        p.y += p.speedY;
        p.wobbleAngle += 0.012;
        p.x += Math.sin(p.wobbleAngle) * 0.25 + p.speedX;

        if (p.y < -10) {
          p.y = this.canvas.height + 10;
          p.x = Math.random() * this.canvas.width;
        }
        if (p.x < -10) p.x = this.canvas.width + 10;
        if (p.x > this.canvas.width + 10) p.x = -10;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(234, 234, 234, ${p.alpha})`;
        this.ctx.fill();
      }

      // Draw rising bubbles with subtle cyan refraction
      for (let b of this.bubbles) {
        b.y += b.speedY;
        b.wobbleAngle += b.wobbleSpeed;
        b.x += Math.sin(b.wobbleAngle) * b.wobbleAmp;

        if (b.y < -20) {
          b.y = this.canvas.height + 20;
          b.x = Math.random() * this.canvas.width;
        }

        // Bubble body
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(46, 230, 202, ${b.alpha * 0.75})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Subtle bubble highlight reflection
        this.ctx.beginPath();
        this.ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.8})`;
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }

  const particleEngine = particleCanvas ? new WaterCurrentEngine(particleCanvas, pCtx) : null;

  // -------------------------------------------------------------
  // 4. CLEAN CINEMATIC STAGE (MOUSE PERSPECTIVE SHIFT DISABLED)
  // Per UX critique: The scene remains 100% grounded and stable.
  // Layers do not tilt, shift, or shear on mouse move, keeping the composition
  // perfectly stable and eliminating any visible seam or perspective jitter.
  // -------------------------------------------------------------
  window.addEventListener('mousemove', (e) => {
    state.mouse.targetX = (e.clientX / state.windowWidth - 0.5) * 2;
    state.mouse.targetY = (e.clientY / state.windowHeight - 0.5) * 2;
  });

  gsap.ticker.add(() => {
    if (state.view !== 'cover') return;

    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.07;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.07;
    // Rock-solid editorial camera: zero layer translation on mousemove
  });

  // -------------------------------------------------------------
  // 5. WEB AUDIO SYNTHESIZER ENGINE
  // -------------------------------------------------------------
  class AbyssAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.droneOsc = null;
      this.droneSubOsc = null;
      this.filter = null;
      this.noiseNode = null;
      this.noiseGain = null;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(4, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(42, this.ctx.currentTime);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.droneOsc.connect(droneGain);
      droneGain.connect(this.filter);
      this.droneOsc.start();

      this.droneSubOsc = this.ctx.createOscillator();
      this.droneSubOsc.type = 'triangle';
      this.droneSubOsc.frequency.setValueAtTime(84, this.ctx.currentTime);
      this.droneSubOsc.detune.setValueAtTime(4, this.ctx.currentTime);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.droneSubOsc.connect(subGain);
      subGain.connect(this.filter);
      this.droneSubOsc.start();

      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseNode.start();

      this.initialized = true;
    }

    start() {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.35, now + 1.2);
    }

    stop() {
      if (!this.initialized) return;
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.6);
    }

    playSonarPing(freq = 220) {
      if (!this.initialized || !state.audioActive || state.sonarMuted) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const pingOsc = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      const pingFilter = this.ctx.createBiquadFilter();

      // Deep, soft sub-benthic hydrophone timbre (warm low sine, gentle pitch slide)
      const baseFreq = Math.min(320, Math.max(140, freq));
      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(baseFreq, now);
      pingOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, now + 0.25);

      // Lowpass warmth to eliminate any harsh high frequencies
      pingFilter.type = 'lowpass';
      pingFilter.frequency.setValueAtTime(380, now);
      pingFilter.Q.setValueAtTime(1.0, now);

      // Gentle, subtle volume that will NEVER hurt the ear
      pingGain.gain.setValueAtTime(0.0001, now);
      pingGain.gain.linearRampToValueAtTime(0.05, now + 0.05);
      pingGain.gain.exponentialRampToValueAtTime(0.00001, now + 1.2);

      pingOsc.connect(pingFilter);
      pingFilter.connect(pingGain);
      pingGain.connect(this.ctx.destination);

      pingOsc.start(now);
      pingOsc.stop(now + 1.3);
    }

    playDiveSound() {
      if (!this.initialized || !state.audioActive) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    }

    playAscendSound() {
      if (!this.initialized || !state.audioActive) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 1.3);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.10, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.4);
    }

    playAudioLog(logIndex) {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (logIndex === 1) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 1.1);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      } else if (logIndex === 2) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(490, now);
        osc.frequency.linearRampToValueAtTime(580, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(245, now + 1.0);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(44, now);
        osc.frequency.linearRampToValueAtTime(24, now + 1.0);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(95, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.6);
    }

    playSpecimenAcoustic(specimenId) {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (specimenId === 1) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(370, now + 1.2);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
      } else if (specimenId === 2) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.8);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.7);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    }
  }

  const audio = new AbyssAudioEngine();

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      state.audioActive = !state.audioActive;
      const audioToggleStatus = document.getElementById('audio-toggle-status');
      if (state.audioActive) {
        audio.start();
        audioTogglePill.classList.remove('translate-x-0', 'bg-zinc-600');
        audioTogglePill.classList.add('translate-x-5', 'bg-[#2EE6CA]');
        audioBars.forEach(b => b.classList.add('animate-pulse'));
        if (audioToggleStatus) {
          audioToggleStatus.textContent = 'AUDIO: ON';
          audioToggleStatus.classList.remove('text-zinc-400');
          audioToggleStatus.classList.add('text-[#2EE6CA]');
        }
      } else {
        audio.stop();
        audioTogglePill.classList.remove('translate-x-5', 'bg-[#2EE6CA]');
        audioTogglePill.classList.add('translate-x-0', 'bg-zinc-600');
        audioBars.forEach(b => b.classList.remove('animate-pulse'));
        if (audioToggleStatus) {
          audioToggleStatus.textContent = 'AUDIO: OFF';
          audioToggleStatus.classList.remove('text-[#2EE6CA]');
          audioToggleStatus.classList.add('text-zinc-400');
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 6. CUSTOM TRAILING CURSOR
  // -------------------------------------------------------------
  if (cursorDot && cursorRing) {
    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    gsap.ticker.add(() => {
      ringPos.x += (mousePos.x - ringPos.x) * 0.18;
      ringPos.y += (mousePos.y - ringPos.y) * 0.18;
      cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    });

    const interactives = document.querySelectorAll('button, a, .specimen-card, .interactive, input');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
      el.addEventListener('mousedown', () => cursorRing.classList.add('cursor-active'));
      el.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-active'));
    });
  }

  // -------------------------------------------------------------
  // 7. CINEMATIC CAMERA TRANSITION (COVER <-> TRENCH FLOOR DOSSIER)
  // -------------------------------------------------------------
  function updateDepthDisplay(val) {
    const formatted = Math.round(val).toLocaleString();
    if (depthDisplayCover) depthDisplayCover.textContent = `DEPTH: ${formatted}M // SECTOR: ABYSSAL`;
    if (depthDisplayDossier) depthDisplayDossier.textContent = `${formatted}M`;
  }

  function diveBelow() {
    if (state.view !== 'cover') return;
    state.view = 'transitioning';
    audio.playDiveSound();
    if (crawlingSerpentEngine) crawlingSerpentEngine.triggerRoar(2.5);

    if (diveBtn) diveBtn.style.pointerEvents = 'none';

    // Prepare dossier view
    dossierView.classList.remove('hidden');
    dossierView.style.display = 'block';
    gsap.set(dossierView, { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        state.view = 'dossier';
        coverView.style.display = 'none';
        coverView.style.pointerEvents = 'none';
        window.scrollTo(0, 0);
        if (typeof window.emitSonarPing === 'function') {
          window.emitSonarPing(true);
        }
      }
    });

    // 1. Depth Counter rapid descent
    const depthObj = { val: state.depth };
    tl.to(depthObj, {
      val: -9820,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        state.depth = depthObj.val;
        updateDepthDisplay(depthObj.val);
      }
    }, 0);

    // 2. Headline tracks out wider and disperses upward
    tl.to(coverHeadline, {
      letterSpacing: '0.65em',
      y: -140,
      opacity: 0,
      filter: 'blur(16px)',
      duration: 1.0,
      ease: 'power2.out'
    }, 0.1);

    // 3a. Mid-Back serpent body plunges into abyss
    if (layerBackSerpent) {
      tl.to(layerBackSerpent, {
        scale: 1.4,
        y: 200,
        opacity: 0,
        filter: 'brightness(0.3) blur(8px)',
        duration: 1.1,
        ease: 'power2.in'
      }, 0.1);
    }

    // 3b. Foreground serpent plunges forward toward camera into abyss
    tl.to(layer2Serpent, {
      scale: 2.2,
      y: 380,
      opacity: 0,
      filter: 'brightness(0.3) blur(10px)',
      duration: 1.2,
      ease: 'power2.in'
    }, 0.1);

    // 4. Background ruins fade into dark trench floor
    tl.to(layer0Back, {
      scale: 1.25,
      y: -80,
      filter: 'brightness(0.15) blur(6px)',
      opacity: 0.2,
      duration: 1.2
    }, 0.1);

    // 5. Cover View Fades Out
    tl.to(coverView, {
      opacity: 0,
      duration: 0.5
    }, 0.7);

    // 6. Dossier View Enters Smoothly
    tl.to(dossierView, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.8);
  }

  function ascendToSurface() {
    if (state.view !== 'dossier') return;
    state.view = 'transitioning';
    audio.playAscendSound();

    coverView.style.display = 'flex';
    coverView.style.pointerEvents = 'auto';
    gsap.set(coverView, { opacity: 0 });
    window.scrollTo(0, 0);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        state.view = 'cover';
        dossierView.style.display = 'none';
        dossierView.classList.add('hidden');
        if (diveBtn) diveBtn.style.pointerEvents = 'auto';
      }
    });

    // 1. Depth Counter climbs back up
    const depthObj = { val: state.depth };
    tl.to(depthObj, {
      val: -3480,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        state.depth = depthObj.val;
        updateDepthDisplay(depthObj.val);
      }
    }, 0);

    // 2. Dossier Fades Out and slides down
    tl.to(dossierView, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power2.in'
    }, 0);

    // 3. Cover View Restores
    tl.to(coverView, {
      opacity: 1,
      duration: 0.7
    }, 0.3);

    // 4. Background ruins return
    tl.to(layer0Back, {
      scale: 1.05,
      y: 0,
      filter: 'brightness(1) blur(0px)',
      opacity: 1,
      duration: 1.1,
      ease: 'power2.out'
    }, 0.3);

    // 5. Headline tracks back together
    tl.to(coverHeadline, {
      letterSpacing: '0.28em',
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'power2.out'
    }, 0.35);

    // 6a. Mid-Back serpent returns into position
    if (layerBackSerpent) {
      tl.to(layerBackSerpent, {
        scale: 1.0,
        y: 0,
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
        duration: 1.1,
        ease: 'power2.out'
      }, 0.35);
    }

    // 6b. Foreground serpent returns into position
    tl.to(layer2Serpent, {
      scale: 1.0,
      y: 0,
      opacity: 1,
      filter: 'brightness(1) blur(0px)',
      duration: 1.1,
      ease: 'power2.out'
    }, 0.35);
  }

  // Event Listeners for Dive & Ascend
  if (diveBtn) diveBtn.addEventListener('click', diveBelow);
  if (ascendBtn) ascendBtn.addEventListener('click', ascendToSurface);
  if (ascendBtnSidebar) ascendBtnSidebar.addEventListener('click', ascendToSurface);

  // Wheel / Touchpad Scroll Dive Trigger
  let wheelAccumulator = 0;
  window.addEventListener('wheel', (e) => {
    if (state.view === 'cover') {
      wheelAccumulator += e.deltaY;
      if (wheelAccumulator > 70) {
        diveBelow();
        wheelAccumulator = 0;
      }
    } else if (state.view === 'dossier') {
      if (window.scrollY <= 0 && e.deltaY < -90) {
        ascendToSurface();
      }
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (state.view === 'cover') {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        diveBelow();
      }
    } else if (state.view === 'dossier') {
      const modal = document.getElementById('specimen-modal');
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
          closeSpecimenModal();
          return;
        }
      }
      if (e.key === 'Escape' || (e.key === 'ArrowUp' && window.scrollY <= 10)) {
        ascendToSurface();
      }
    }
    if (e.key === 'm' || e.key === 'M') {
      if (audioToggle) audioToggle.click();
    }
  });

  // -------------------------------------------------------------
  // 8. INTERACTIVE ACOUSTIC SONAR VISUALIZER CANVAS
  // -------------------------------------------------------------
  class SonarRadar {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.sweepAngle = 0;
      this.sweepSpeed = 0.022;
      this.ripples = [];
      this.targets = [
        {
          id: 'T-01',
          name: 'JÖRMUN PRIMARY MASS',
          angle: 0.65,
          distance: 0.42,
          bearing: '037°',
          rangeKm: '1.42 KM',
          threat: 'OMEGA',
          lastSeen: 0,
          pingAlert: false
        },
        {
          id: 'T-02',
          name: 'SUNKEN TEMPLE ARCH',
          angle: 3.75,
          distance: 0.72,
          bearing: '215°',
          rangeKm: '4.86 KM',
          threat: 'INERT',
          lastSeen: 0,
          pingAlert: false
        },
        {
          id: 'T-03',
          name: 'BENTHIC THERMAL PLUME',
          angle: 2.35,
          distance: 0.85,
          bearing: '135°',
          rangeKm: '7.10 KM',
          threat: 'LOW',
          lastSeen: 0,
          pingAlert: false
        }
      ];

      this.initEvents();
    }

    initEvents() {
      if (!this.canvas) return;
      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        this.addRipple(clickX, clickY);
        if (state.audioActive && !state.sonarMuted) {
          audio.playSonarPing(220);
        }
      });
    }

    addRipple(x, y) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      this.ripples.push({
        x: x || centerX,
        y: y || centerY,
        radius: 5,
        maxRadius: Math.max(this.canvas.width, this.canvas.height) * 0.7,
        alpha: 1.0
      });
      state.sonarPingCount++;
      const pingStat = document.getElementById('sonar-ping-stat');
      if (pingStat) pingStat.textContent = `PINGS: ${state.sonarPingCount}`;
    }

    draw() {
      if (!this.ctx || !this.canvas) return;

      const width = this.canvas.width;
      const height = this.canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxR = Math.min(centerX, centerY) - 15;

      this.ctx.fillStyle = 'rgba(4, 8, 15, 0.12)';
      this.ctx.fillRect(0, 0, width, height);

      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(46, 230, 202, 0.18)';
      this.ctx.lineWidth = 1;

      const ringDistances = [0.25, 0.5, 0.75, 1.0];
      const ringLabels = ['2.5 KM', '5.0 KM', '7.5 KM', '10.0 KM'];

      ringDistances.forEach((fraction, idx) => {
        const r = maxR * fraction;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = 'rgba(46, 230, 202, 0.45)';
        this.ctx.font = '9px "JetBrains Mono", monospace';
        this.ctx.fillText(ringLabels[idx], centerX + 6, centerY - r + 12);
      });

      this.ctx.strokeStyle = 'rgba(46, 230, 202, 0.12)';
      this.ctx.beginPath();
      this.ctx.moveTo(centerX - maxR, centerY);
      this.ctx.lineTo(centerX + maxR, centerY);
      this.ctx.moveTo(centerX, centerY - maxR);
      this.ctx.lineTo(centerX, centerY + maxR);
      this.ctx.stroke();

      const cardinalTicks = [
        { label: '000° [N]', angle: -Math.PI / 2 },
        { label: '090° [E]', angle: 0 },
        { label: '180° [S]', angle: Math.PI / 2 },
        { label: '270° [W]', angle: Math.PI }
      ];
      this.ctx.fillStyle = 'rgba(46, 230, 202, 0.6)';
      this.ctx.font = '10px "JetBrains Mono", monospace';
      cardinalTicks.forEach(t => {
        const tx = centerX + Math.cos(t.angle) * (maxR - 22);
        const ty = centerY + Math.sin(t.angle) * (maxR - 22) + 3;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(t.label, tx, ty);
      });

      this.sweepAngle += this.sweepSpeed;
      if (this.sweepAngle > Math.PI * 2) this.sweepAngle -= Math.PI * 2;

      const fanAngle = 0.35;
      const fanGradient = this.ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxR);
      fanGradient.addColorStop(0, 'rgba(46, 230, 202, 0.25)');
      fanGradient.addColorStop(1, 'rgba(46, 230, 202, 0.0)');

      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, maxR, this.sweepAngle - fanAngle, this.sweepAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = fanGradient;
      this.ctx.fill();

      const beamX = centerX + Math.cos(this.sweepAngle) * maxR;
      const beamY = centerY + Math.sin(this.sweepAngle) * maxR;
      this.ctx.strokeStyle = '#2EE6CA';
      this.ctx.lineWidth = 1.5;
      this.ctx.shadowColor = '#2EE6CA';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(beamX, beamY);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      this.targets.forEach((target) => {
        const tx = centerX + Math.cos(target.angle) * (maxR * target.distance);
        const ty = centerY + Math.sin(target.angle) * (maxR * target.distance);

        const diff = Math.abs(this.sweepAngle - target.angle);
        if (diff < 0.05 || Math.abs(diff - Math.PI * 2) < 0.05) {
          target.lastSeen = 1.0;
          if (!target.pingAlert) {
            target.pingAlert = true;
            if (target.id === 'T-01') {
              if (state.audioActive && !state.sonarMuted) {
                audio.playSonarPing(220);
              }
              const contactTelemetry = document.getElementById('sonar-active-contact');
              if (contactTelemetry) {
                contactTelemetry.innerHTML = `
                  <span class="text-[#2EE6CA] font-bold">CONTACT 01 ACQUIRED:</span> JÖRMUN PRIMARY MASS<br/>
                  BEARING: ${target.bearing} // RANGE: ${target.rangeKm} // SIGNAL: 98.4dB // THREAT: OMEGA
                `;
              }
            }
          }
        } else if (diff > 0.4) {
          target.pingAlert = false;
        }

        if (target.lastSeen > 0.02) {
          this.ctx.save();
          this.ctx.shadowBlur = 14 * target.lastSeen;
          this.ctx.shadowColor = target.id === 'T-01' ? '#2EE6CA' : '#ffffff';

          this.ctx.strokeStyle = target.id === 'T-01' 
            ? `rgba(46, 230, 202, ${target.lastSeen})` 
            : `rgba(234, 234, 234, ${target.lastSeen * 0.7})`;
          this.ctx.beginPath();
          this.ctx.arc(tx, ty, 6 + (1 - target.lastSeen) * 10, 0, Math.PI * 2);
          this.ctx.stroke();

          this.ctx.fillStyle = target.id === 'T-01' 
            ? `rgba(46, 230, 202, ${target.lastSeen})` 
            : `rgba(234, 234, 234, ${target.lastSeen * 0.8})`;
          this.ctx.beginPath();
          this.ctx.arc(tx, ty, 3, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.font = '9px "JetBrains Mono", monospace';
          this.ctx.fillStyle = `rgba(46, 230, 202, ${target.lastSeen * 0.85})`;
          this.ctx.fillText(`${target.id} [${target.rangeKm}]`, tx + 9, ty + 3);

          this.ctx.restore();
          target.lastSeen -= 0.007;
        }
      });

      for (let j = this.ripples.length - 1; j >= 0; j--) {
        const rip = this.ripples[j];
        rip.radius += 4.5;
        rip.alpha -= 0.016;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          this.ripples.splice(j, 1);
        } else {
          this.ctx.save();
          this.ctx.strokeStyle = `rgba(46, 230, 202, ${rip.alpha * 0.75})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.shadowColor = '#2EE6CA';
          this.ctx.shadowBlur = 8;
          this.ctx.beginPath();
          this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }

      this.ctx.restore();
    }
  }

  const sonar = sonarCanvas ? new SonarRadar(sonarCanvas, sCtx) : null;

  // Dedicated Sonar Acoustic Audio Toggle Button
  const sonarAudioBtn = document.getElementById('sonar-audio-toggle-btn');
  const sonarAudioIndicator = document.getElementById('sonar-audio-indicator');
  const sonarAudioText = document.getElementById('sonar-audio-text');

  if (sonarAudioBtn) {
    sonarAudioBtn.addEventListener('click', () => {
      state.sonarMuted = !state.sonarMuted;
      if (!state.sonarMuted) {
        state.audioActive = true;
        audio.init();
        if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
        sonarAudioBtn.classList.remove('border-zinc-750', 'text-zinc-400');
        sonarAudioBtn.classList.add('border-[#2EE6CA]', 'text-[#2EE6CA]', 'bg-[#2EE6CA]/15');
        if (sonarAudioIndicator) {
          sonarAudioIndicator.classList.remove('bg-zinc-600');
          sonarAudioIndicator.classList.add('bg-[#2EE6CA]', 'animate-pulse');
        }
        if (sonarAudioText) sonarAudioText.textContent = 'ACOUSTIC PING: ACTIVE';
        // Play one gentle, soft hydrophone confirmation tone
        audio.playSonarPing(220);
      } else {
        sonarAudioBtn.classList.remove('border-[#2EE6CA]', 'text-[#2EE6CA]', 'bg-[#2EE6CA]/15');
        sonarAudioBtn.classList.add('border-zinc-750', 'text-zinc-400');
        if (sonarAudioIndicator) {
          sonarAudioIndicator.classList.remove('bg-[#2EE6CA]', 'animate-pulse');
          sonarAudioIndicator.classList.add('bg-zinc-600');
        }
        if (sonarAudioText) sonarAudioText.textContent = 'ACOUSTIC PING: MUTED';
      }
    });
  }

  window.emitSonarPing = (silent = false) => {
    if (sonar) sonar.addRipple();
    if (!silent && state.audioActive && !state.sonarMuted) {
      audio.playSonarPing(220);
    }
  };
  const sonarPingBtn = document.getElementById('emit-ping-btn');
  if (sonarPingBtn) {
    sonarPingBtn.addEventListener('click', () => emitSonarPing(false));
  }

  const freqButtons = document.querySelectorAll('.freq-btn');
  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => b.classList.remove('bg-[#2EE6CA]/20', 'text-[#2EE6CA]', 'border-[#2EE6CA]'));
      btn.classList.add('bg-[#2EE6CA]/20', 'text-[#2EE6CA]', 'border-[#2EE6CA]');
      const fVal = btn.dataset.freq;
      state.sonarFrequency = fVal;
      const freqDisplay = document.getElementById('sonar-active-freq');
      if (freqDisplay) freqDisplay.textContent = `ACOUSTIC FREQ: ${fVal}`;
      if (state.audioActive && !state.sonarMuted) {
        audio.playSonarPing(200);
      }
    });
  });

  // -------------------------------------------------------------
  // 9. ANIMATION LOOP DISPATCHER
  // -------------------------------------------------------------
  function mainLoop(timestamp) {
    const time = (timestamp || performance.now()) * 0.001;
    if (crawlingSerpentEngine && state.view !== 'dossier') {
      crawlingSerpentEngine.updateAndDraw(time);
    }
    if (particleEngine) particleEngine.updateAndDraw();
    if (sonar && state.view === 'dossier') sonar.draw();
    requestAnimationFrame(mainLoop);
  }
  requestAnimationFrame(mainLoop);

  window.addEventListener('resize', () => {
    state.windowWidth = window.innerWidth;
    state.windowHeight = window.innerHeight;
    if (particleEngine) particleEngine.resize();
    if (crawlingSerpentEngine) crawlingSerpentEngine.resize();
  });

  // Live Telemetry Timecode Ticker
  const timecodeEl = document.getElementById('live-timecode');
  if (timecodeEl) {
    let seconds = 0;
    setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      const ms = Math.floor(Math.random() * 99).toString().padStart(2, '0');
      timecodeEl.textContent = `T+ 04:${mins}:${secs}.${ms}`;
    }, 100);
  }

  // -------------------------------------------------------------
  // 10. SPECIMEN INSPECTION MODAL & INTERACTIVE CONTROLLERS
  // -------------------------------------------------------------
  const specimenData = {
    1: {
      tag: 'PLATE 01 // CRANIAL APEX',
      title: 'Cranial Photophores & Optic Ganglia',
      img: 'assets/specimen_cranial.jpg',
      desc: 'The cranial crest of Jörmungandr exhibits dual compound optic structures adapted for absolute zero lux. Photophore ridges emit synchronized 490nm cyan bioluminescent wavelengths that illuminate benthic trenches and act as deep-abyss communicative signaling.',
      stat1Val: '490nm (CYAN)',
      stat2Val: '0.0001 LUX'
    },
    2: {
      tag: 'PLATE 02 // DERMAL LATTICE',
      title: 'Crystalline Dermal Scutum Lattice',
      img: 'assets/specimen_scales.jpg',
      desc: 'Tri-layered biomineralized ivory and obsidian dermal plates. The microscopic interlocking scale matrix deflects hadal pressures up to 1,120 atmospheres while providing laminar boundary-layer drag reduction during deep oceanic swimming.',
      stat1Val: '1,120 BAR (ATM)',
      stat2Val: '12.4 GPa TENSILE'
    },
    3: {
      tag: 'PLATE 03 // MANDIBULAR APPARATUS',
      title: 'Mandibular Venom Ducts & Prey Ingestion',
      img: 'assets/specimen_fangs.jpg',
      desc: 'Retractable recurved mandibular fangs with pressurized neurotoxic channels. The venom exhibits intense phosphorescent luminescence upon exposure to sea water, paralyzing prey via instantaneous synaptic inhibition.',
      stat1Val: '88,000 N (BITE FORCE)',
      stat2Val: 'TETRODOTOXIN-VØR'
    }
  };

  let currentModalSpecimenId = 1;

  window.openSpecimenModal = (id) => {
    const data = specimenData[id] || specimenData[1];
    currentModalSpecimenId = id;

    const modal = document.getElementById('specimen-modal');
    const modalImg = document.getElementById('modal-img');
    const modalPlateTag = document.getElementById('modal-plate-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalStat1 = document.getElementById('modal-stat-1');
    const modalStat2 = document.getElementById('modal-stat-2');

    if (modalImg) modalImg.src = data.img;
    if (modalPlateTag) modalPlateTag.textContent = data.tag;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalStat1) modalStat1.textContent = data.stat1Val;
    if (modalStat2) modalStat2.textContent = data.stat2Val;

    if (modal) {
      modal.classList.remove('hidden');
      if (modal.firstElementChild) {
        gsap.fromTo(modal.firstElementChild, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    }

  };

  window.closeSpecimenModal = () => {
    const modal = document.getElementById('specimen-modal');
    if (modal) {
      if (modal.firstElementChild) {
        gsap.to(modal.firstElementChild, {
          scale: 0.94,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            modal.classList.add('hidden');
          }
        });
      } else {
        modal.classList.add('hidden');
      }
    }
  };

  window.playModalAcoustic = () => {
    if (audio) {
      audio.playSpecimenAcoustic(currentModalSpecimenId);
    }
  };

  window.playAudioTransmission = (logIndex) => {
    if (audio) {
      audio.playAudioLog(logIndex);
    }
  };

  window.setBpmRate = (mode) => {
    const readout = document.getElementById('bpm-readout');
    const ekgLine = document.getElementById('ekg-line');
    const anim = ekgLine ? ekgLine.querySelector('animate') : null;
    const buttons = document.querySelectorAll('.bpm-btn');

    buttons.forEach(b => {
      b.classList.remove('bg-[#2EE6CA]/20', 'text-[#2EE6CA]', 'border-[#2EE6CA]/40', 'bg-rose-500/20', 'text-rose-400', 'border-rose-500/40');
      b.classList.add('text-zinc-400', 'border-zinc-700');
    });

    if (mode === 'surge') {
      if (readout) {
        readout.textContent = '24.6 BPM // AGITATION ALERT';
        readout.className = 'text-[9px] text-rose-400 font-bold font-mono animate-pulse';
      }
      if (anim) anim.setAttribute('dur', '1.0s');
      if (buttons[1]) {
        buttons[1].classList.add('bg-rose-500/20', 'text-rose-400', 'border-rose-500/40');
        buttons[1].classList.remove('text-zinc-400', 'border-zinc-700');
      }
    } else {
      if (readout) {
        readout.textContent = '8.2 BPM // STEADY';
        readout.className = 'text-[9px] text-[#2EE6CA] font-bold font-mono';
      }
      if (anim) anim.setAttribute('dur', '2.8s');
      if (buttons[0]) {
        buttons[0].classList.add('bg-[#2EE6CA]/20', 'text-[#2EE6CA]', 'border-[#2EE6CA]/40');
        buttons[0].classList.remove('text-zinc-400', 'border-zinc-700');
      }
    }
  };

  // -------------------------------------------------------------
  // 11. PURPOSEFUL SECTION NAVIGATION ROUTER
  // -------------------------------------------------------------
  window.navigateToSection = (sectionId) => {
    if (state.view === 'cover') {
      diveBelow();
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 950);
    } else if (state.view === 'dossier') {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  console.log('ARCHIVE 04 // JÖRMUN Engine Architecture Active.');
});
