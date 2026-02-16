/**
 * Code Surfer - Ride through legacy code
 * by nulloxide
 *
 * A snowboard-style endless runner through a codebase
 * Collect: Good practices, clean code, tests
 * Avoid: Anti-patterns, code smells, tech debt
 */

// ============================================
// Theme Configurations
// ============================================
const THEMES = {
  dark: {
    sky: ["#0a0612", "#12081f", "#1a0f2e", "#22143d", "#2a1a4c"],
    ground: ["#0a0510", "#100818", "#160c20", "#1c1028"],
    mountains: ["#12082a", "#1a1040", "#221850", "#2a2060"],
    accent: "#00ffaa",
    accentSecondary: "#ff5588",
    text: "#f0e8ff",
    particles: ["#00ffaa", "#40ffcc", "#80ffdd", "#bfffee"],
    obstacleColor: "#ff5588",
    goodBg: "#00382a",
    badBg: "#380020",
    treeColor: "#1a3040",
    treeTrunk: "#2a1a10",
  },
  light: {
    sky: ["#f5f0e8", "#ede5db", "#e5dace", "#ddd0c1", "#d5c5b4"],
    ground: ["#ede5d8", "#e5dccf", "#ddd3c6", "#d5cabd"],
    mountains: ["#ddd5c5", "#d0c8b8", "#c3bbab", "#b6ae9e"],
    accent: "#00aa77",
    accentSecondary: "#dd3366",
    text: "#1a1020",
    particles: ["#00aa77", "#20bb88", "#40cc99", "#60ddaa"],
    obstacleColor: "#dd3366",
    goodBg: "#cceedd",
    badBg: "#ffccdd",
    treeColor: "#8aa868",
    treeTrunk: "#705838",
  },
};

// ============================================
// Good Practices (Collectibles) - Real programming best practices
// ============================================
const GOOD_PRACTICES = [
  {
    text: "Unit Test",
    label: "✓ Tests",
    points: 15,
    desc: "Testing is caring",
  },
  {
    text: "Code Review",
    label: "👀 Review",
    points: 20,
    desc: "Fresh eyes find bugs",
  },
  { text: "Clean Code", label: "✨ Clean", points: 12, desc: "Readable code" },
  { text: "SOLID", label: "🏗️ SOLID", points: 25, desc: "Principles matter" },
  { text: "DRY", label: "🌵 DRY", points: 15, desc: "Don't Repeat Yourself" },
  { text: "Git Commit", label: "📝 Commit", points: 10, desc: "Small commits" },
  { text: "Type Hints", label: "🏷️ Types", points: 12, desc: "Type safety" },
  { text: "Docs", label: "📚 Docs", points: 18, desc: "Documentation" },
  {
    text: "Refactor",
    label: "♻️ Refactor",
    points: 20,
    desc: "Improve structure",
  },
  { text: "Lint", label: "🧹 Lint", points: 8, desc: "Clean formatting" },
  { text: "CI/CD", label: "🚀 CI/CD", points: 22, desc: "Automation!" },
  { text: "Logging", label: "📋 Logs", points: 10, desc: "Observability" },
];

// ============================================
// Bad Practices (Obstacles) - Famous anti-patterns & code smells
// ============================================
const BAD_PRACTICES = [
  {
    text: "Spaghetti",
    label: "🍝 Spaghetti Code",
    damage: 20,
    desc: "Tangled mess!",
  },
  {
    text: "God Object",
    label: "👑 God Object",
    damage: 30,
    desc: "Does everything poorly",
  },
  {
    text: "Cargo Cult",
    label: "✈️ Cargo Cult",
    damage: 25,
    desc: "Copied blindly",
  },
  {
    text: "Magic Number",
    label: "🔮 Magic 42",
    damage: 15,
    desc: "What does it mean?!",
  },
  {
    text: "Callback Hell",
    label: "🔥 Callback Hell",
    damage: 25,
    desc: "))))))))",
  },
  {
    text: "Copy Pasta",
    label: "📋 Copy Pasta",
    damage: 18,
    desc: "Duplicated bugs",
  },
  {
    text: "Dead Code",
    label: "💀 Dead Code",
    damage: 12,
    desc: "Zombie functions",
  },
  { text: "var", label: "😱 var x = 1", damage: 15, desc: "Scope issues!" },
  { text: "TODO:", label: "📌 // TODO:", damage: 10, desc: "Never done" },
  {
    text: "try{}catch{}",
    label: "🙈 Empty Catch",
    damage: 22,
    desc: "Silenced errors",
  },
  { text: "Hardcoded", label: "🔒 Hardcoded", damage: 15, desc: "No config" },
  {
    text: "1000 Lines",
    label: "📜 1000+ Lines",
    damage: 28,
    desc: "Function too big!",
  },
];

// ============================================
// Audio System
// ============================================
class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn("Audio not available");
    }
  }

  playCollect(pitch = 1) {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500 * pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      1000 * pitch,
      this.ctx.currentTime + 0.08,
    );
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playHit() {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playJump() {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      480,
      this.ctx.currentTime + 0.12,
    );
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playCombo(level) {
    if (!this.initialized) return;
    const baseNotes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const notes = baseNotes.slice(0, Math.min(level, 4));
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          this.ctx.currentTime + 0.18,
        );
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
      }, i * 70);
    });
  }
}

const audio = new AudioManager();

// ============================================
// Main Game Scene
// ============================================
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.player = null;
    this.isHolding = false;
    this.velocity = 0;
    this.gameStarted = false;
    this.gameOver = false;

    this.score = 0;
    this.combo = 0;
    this.lastCollectTime = 0;

    this.scrollSpeed = 2.5;
    this.baseScrollSpeed = 2.5;
    this.maxScrollSpeed = 7;

    this.layers = [];
    this.collectibles = [];
    this.obstacles = [];
    this.trees = [];
    this.particles = [];
    this.trailParticles = [];

    this.isDarkMode = true;
    this.currentTheme = THEMES.dark;

    this.spawnTimer = 0;
    this.obstacleTimer = 0;
    this.treeTimer = 0;

    // Magnetic attraction range
    this.magnetRange = 80;
    this.magnetStrength = 150;
  }

  create() {
    const { width, height } = this.scale;

    // Load high score
    this.highScore = parseInt(
      localStorage.getItem("codeSurferHighScore") || "0",
    );
    document.getElementById("best-score").textContent = this.highScore;

    // Check system theme preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      this.setTheme(false);
    }

    // Create visual layers
    this.createBackground();
    this.createMountains();
    this.createGround();
    this.createPlayer();
    this.createParticlePool();

    // Setup input
    this.setupInput();

    // Setup theme toggle
    this.setupThemeToggle();

    // Setup restart button
    document.querySelector(".restart-btn")?.addEventListener("click", () => {
      this.restartGame();
    });

    // Camera
    this.cameras.main.fadeIn(800);
  }

  createBackground() {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();

    this.skyGradient = graphics;
    this.redrawSky();
    graphics.setDepth(-100);
  }

  redrawSky() {
    const { width, height } = this.scale;
    const colors = this.currentTheme.sky;

    this.skyGradient.clear();

    const segmentHeight = height / (colors.length - 1);
    for (let i = 0; i < colors.length - 1; i++) {
      const c1 = Phaser.Display.Color.HexStringToColor(colors[i]);
      const c2 = Phaser.Display.Color.HexStringToColor(colors[i + 1]);

      for (let y = 0; y < segmentHeight; y++) {
        const ratio = y / segmentHeight;
        const r = Math.floor(c1.red + (c2.red - c1.red) * ratio);
        const g = Math.floor(c1.green + (c2.green - c1.green) * ratio);
        const b = Math.floor(c1.blue + (c2.blue - c1.blue) * ratio);
        this.skyGradient.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
        this.skyGradient.fillRect(0, i * segmentHeight + y, width, 1);
      }
    }
  }

  createMountains() {
    const { width, height } = this.scale;

    // Create 3 mountain layers with parallax
    const configs = [
      { y: height * 0.5, speedMult: 0.15, heightMult: 0.32 },
      { y: height * 0.6, speedMult: 0.35, heightMult: 0.26 },
      { y: height * 0.7, speedMult: 0.55, heightMult: 0.2 },
    ];

    configs.forEach((config, index) => {
      const layer = this.createMountainLayer(config, index);
      this.layers.push(layer);
    });
  }

  createMountainLayer(config, index) {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();

    const color = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.mountains[index],
    );
    graphics.fillStyle(color.color, 0.9);

    // Generate mountain shape
    graphics.beginPath();
    graphics.moveTo(-50, height);

    const segments = 30;
    const segWidth = (width * 2) / segments;

    for (let i = 0; i <= segments; i++) {
      const x = i * segWidth - 50;
      const baseY = config.y;
      const mountainHeight = height * config.heightMult;
      const y =
        baseY -
        Math.abs(Math.sin(i * 0.5 + index) * mountainHeight * 0.8) -
        Math.abs(Math.sin(i * 0.3 + index * 2) * mountainHeight * 0.4) -
        Math.random() * mountainHeight * 0.1;
      graphics.lineTo(x, y);
    }

    graphics.lineTo(width * 2, height);
    graphics.closePath();
    graphics.fill();

    graphics.setDepth(-50 + index);

    return {
      graphics,
      speedMult: config.speedMult,
      offset: 0,
      width: width * 2,
    };
  }

  createGround() {
    const { width, height } = this.scale;

    // Ground line
    this.groundY = height * 0.85;

    const ground = this.add.graphics();
    this.groundGraphics = ground;
    this.redrawGround();
    ground.setDepth(0);
  }

  redrawGround() {
    const { width, height } = this.scale;
    const colors = this.currentTheme.ground;

    this.groundGraphics.clear();

    // Gradient ground
    const groundHeight = height - this.groundY;
    const segmentHeight = groundHeight / colors.length;

    colors.forEach((colorHex, i) => {
      const color = Phaser.Display.Color.HexStringToColor(colorHex);
      this.groundGraphics.fillStyle(color.color);
      this.groundGraphics.fillRect(
        0,
        this.groundY + i * segmentHeight,
        width,
        segmentHeight + 1,
      );
    });

    // Ground line with glow effect
    const accentColor = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.accent,
    );
    this.groundGraphics.lineStyle(3, accentColor.color, 0.7);
    this.groundGraphics.lineBetween(0, this.groundY, width, this.groundY);
  }

  createPlayer() {
    const { width, height } = this.scale;

    this.player = this.add.container(width * 0.2, this.groundY - 35);

    // Create modern vector-style character
    const character = this.add.graphics();

    // Snowboard - rounded, sleek design
    character.fillStyle(0x3366ff, 1);
    character.fillRoundedRect(-28, 14, 56, 10, 5);
    // Board highlight
    character.fillStyle(0x5588ff, 1);
    character.fillRoundedRect(-24, 15, 48, 3, 2);

    // Shadow under board
    character.fillStyle(0x000000, 0.2);
    character.fillEllipse(0, 26, 50, 8);

    // Legs - dynamic pose
    character.fillStyle(0x2244aa, 1);
    character.beginPath();
    character.moveTo(-10, 14);
    character.lineTo(-14, -2);
    character.lineTo(-6, -2);
    character.lineTo(-4, 14);
    character.closePath();
    character.fill();

    character.beginPath();
    character.moveTo(4, 14);
    character.lineTo(6, -2);
    character.lineTo(14, -2);
    character.lineTo(10, 14);
    character.closePath();
    character.fill();

    // Body/Torso - jacket
    character.fillStyle(0x4466dd, 1);
    character.fillRoundedRect(-14, -28, 28, 28, 6);
    // Jacket detail
    character.fillStyle(0x5577ee, 1);
    character.fillRoundedRect(-10, -24, 20, 8, 3);

    // Arms - reaching forward pose
    character.fillStyle(0x4466dd, 1);
    // Back arm
    character.fillRoundedRect(-22, -22, 10, 6, 3);
    // Front arm
    character.fillRoundedRect(12, -18, 14, 6, 3);

    // Head
    character.fillStyle(0xffcc99, 1);
    character.fillCircle(0, -38, 12);

    // Helmet
    character.fillStyle(0x2a2a4a, 1);
    character.beginPath();
    character.arc(0, -40, 12, Math.PI, 0, false);
    character.lineTo(12, -38);
    character.lineTo(-12, -38);
    character.closePath();
    character.fill();

    // Goggles - signature look
    character.fillStyle(0x00ffcc, 0.9);
    character.fillRoundedRect(-10, -42, 20, 7, 3);
    // Goggle reflection
    character.fillStyle(0x80ffee, 0.6);
    character.fillRoundedRect(-8, -41, 6, 3, 1);

    // Trail effect container
    this.playerTrail = [];

    this.player.add([character]);
    this.player.setDepth(10);

    // Physics properties
    this.player.velocityY = 0;
    this.player.isOnGround = true;
    this.player.rotation = 0;
    this.player.scaleX = 1;
    this.player.scaleY = 1;
    this.player.targetScaleX = 1;
    this.player.targetScaleY = 1;
  }

  createParticlePool() {
    // Pre-create particle pool for performance
    this.particlePool = [];
    for (let i = 0; i < 50; i++) {
      const p = this.add.graphics();
      p.setVisible(false);
      p.setDepth(15);
      this.particlePool.push({
        graphics: p,
        active: false,
        life: 0,
        type: "circle",
      });
    }
  }

  setupInput() {
    const intro = document.getElementById("intro");

    const startGame = () => {
      if (this.gameStarted) return;
      this.gameStarted = true;
      intro.style.pointerEvents = "none";
      intro.classList.add("hidden");
      document.getElementById("score-display").classList.add("visible");
      audio.init();
    };

    // Intro click handlers
    intro?.addEventListener("mousedown", () => {
      startGame();
      this.isHolding = true;
    });
    intro?.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        startGame();
        this.isHolding = true;
      },
      { passive: false },
    );

    // Game input
    this.input.on("pointerdown", () => {
      if (!this.gameStarted) startGame();
      if (this.gameOver) return;
      this.isHolding = true;
      if (this.player.isOnGround) {
        this.jump();
      }
    });

    this.input.on("pointerup", () => {
      this.isHolding = false;
    });

    // Keyboard
    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.gameStarted) startGame();
      if (this.gameOver) return;
      this.isHolding = true;
      if (this.player.isOnGround) {
        this.jump();
      }
    });

    this.input.keyboard.on("keyup-SPACE", () => {
      this.isHolding = false;
    });

    ["W", "UP"].forEach((key) => {
      this.input.keyboard.on(`keydown-${key}`, () => {
        if (!this.gameStarted) startGame();
        if (this.gameOver) return;
        this.isHolding = true;
        if (this.player.isOnGround) this.jump();
      });
      this.input.keyboard.on(`keyup-${key}`, () => {
        this.isHolding = false;
      });
    });
  }

  setupThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    toggle?.addEventListener("click", () => {
      this.setTheme(!this.isDarkMode);
    });
  }

  setTheme(isDark) {
    this.isDarkMode = isDark;
    this.currentTheme = isDark ? THEMES.dark : THEMES.light;

    document.body.classList.toggle("light-mode", !isDark);
    document.getElementById("theme-toggle").textContent = isDark ? "🌙" : "☀️";

    // Redraw elements
    this.redrawSky();
    this.redrawGround();
  }

  jump() {
    if (!this.player.isOnGround) return;

    this.player.velocityY = -380;
    this.player.isOnGround = false;

    // Squash effect on jump
    this.player.targetScaleX = 0.8;
    this.player.targetScaleY = 1.3;

    audio.playJump();

    // Jump particles - burst effect
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI / 6 + (Math.random() * Math.PI * 2) / 3;
      this.emitParticle(
        this.player.x + Math.cos(angle) * 10,
        this.groundY - 5,
        this.currentTheme.accent,
        { vx: Math.cos(angle) * 80, vy: -Math.abs(Math.sin(angle)) * 120 },
      );
    }
  }

  update(time, delta) {
    if (!this.gameStarted || this.gameOver) return;

    const dt = delta / 1000;

    // Increase speed over time
    this.scrollSpeed = Math.min(
      this.maxScrollSpeed,
      this.baseScrollSpeed + this.score * 0.0015,
    );

    this.updatePlayer(dt);
    this.updateLayers(dt);
    this.updateSpawning(dt);
    this.updateCollectibles(dt);
    this.updateObstacles(dt);
    this.updateTrees(dt);
    this.updateParticles(dt);
    this.updateTrail(dt);
    this.checkCollisions();
  }

  updatePlayer(dt) {
    const gravity = 1100;
    const maxFallSpeed = 550;

    // Apply gravity
    if (!this.player.isOnGround) {
      this.player.velocityY += gravity * dt;
      this.player.velocityY = Math.min(this.player.velocityY, maxFallSpeed);
    }

    // Float longer if holding
    if (this.isHolding && this.player.velocityY > 0) {
      this.player.velocityY *= 0.94;
    }

    // Apply velocity
    this.player.y += this.player.velocityY * dt;

    // Ground collision with squash
    if (this.player.y >= this.groundY - 35) {
      this.player.y = this.groundY - 35;

      // Landing squash effect
      if (!this.player.isOnGround && Math.abs(this.player.velocityY) > 50) {
        this.player.targetScaleX = 1.2;
        this.player.targetScaleY = 0.7;
        // Landing particles
        this.emitParticles(
          this.player.x,
          this.groundY,
          4,
          this.currentTheme.accent,
        );
      }

      this.player.velocityY = 0;
      this.player.isOnGround = true;
    }

    // Smooth squash/stretch recovery
    this.player.scaleX +=
      (this.player.targetScaleX - this.player.scaleX) * 0.15;
    this.player.scaleY +=
      (this.player.targetScaleY - this.player.scaleY) * 0.15;
    this.player.targetScaleX += (1 - this.player.targetScaleX) * 0.1;
    this.player.targetScaleY += (1 - this.player.targetScaleY) * 0.1;
    this.player.setScale(this.player.scaleX, this.player.scaleY);

    // Rotation based on velocity
    const targetRotation = this.player.velocityY * 0.0004;
    this.player.rotation += (targetRotation - this.player.rotation) * 0.08;

    // Ceiling
    if (this.player.y < 60) {
      this.player.y = 60;
      this.player.velocityY = 0;
    }
  }

  updateLayers(dt) {
    const { width } = this.scale;

    this.layers.forEach((layer) => {
      layer.offset += this.scrollSpeed * layer.speedMult * 60 * dt;
      layer.graphics.x = -layer.offset % width;
    });
  }

  updateSpawning(dt) {
    // Spawn collectibles (good practices)
    this.spawnTimer += dt;
    const collectibleInterval = Math.max(0.8, 1.8 - this.scrollSpeed * 0.12);
    if (this.spawnTimer > collectibleInterval) {
      this.spawnTimer = 0;
      if (Math.random() < 0.75) {
        this.spawnCollectible();
      }
    }

    // Spawn obstacles (bad practices)
    this.obstacleTimer += dt;
    const obstacleInterval = Math.max(1.2, 2.8 - this.scrollSpeed * 0.15);
    if (this.obstacleTimer > obstacleInterval) {
      this.obstacleTimer = 0;
      if (Math.random() < 0.55) {
        this.spawnObstacle();
      }
    }

    // Spawn trees
    this.treeTimer += dt;
    if (this.treeTimer > 1.2) {
      this.treeTimer = 0;
      if (Math.random() < 0.35) {
        this.spawnTree();
      }
    }
  }

  spawnCollectible() {
    const { width, height } = this.scale;
    const type = Phaser.Utils.Array.GetRandom(GOOD_PRACTICES);

    const y = this.groundY - 60 - Math.random() * (height * 0.35);

    const container = this.add.container(width + 80, y);

    // Card background - rounded rectangle
    const card = this.add.graphics();
    const bgColor = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.goodBg,
    );
    const accentColor = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.accent,
    );

    // Glow
    card.fillStyle(accentColor.color, 0.15);
    card.fillRoundedRect(-55, -28, 110, 56, 12);

    // Card body
    card.fillStyle(bgColor.color, 0.9);
    card.fillRoundedRect(-50, -24, 100, 48, 10);

    // Border
    card.lineStyle(2, accentColor.color, 0.8);
    card.strokeRoundedRect(-50, -24, 100, 48, 10);

    // Main text - large and readable
    const mainText = this.add.text(0, -6, type.text, {
      fontSize: "18px",
      fontFamily: "JetBrains Mono, monospace",
      fontStyle: "bold",
      color: this.currentTheme.accent,
    });
    mainText.setOrigin(0.5);

    // Points indicator
    const pointsText = this.add.text(0, 14, `+${type.points}`, {
      fontSize: "14px",
      fontFamily: "JetBrains Mono, monospace",
      color: this.isDarkMode ? "#80ffd4" : "#008866",
    });
    pointsText.setOrigin(0.5);

    container.add([card, mainText, pointsText]);
    container.setDepth(8);

    container.collectibleData = {
      type,
      card,
      collected: false,
      phase: Math.random() * Math.PI * 2,
      baseY: y,
    };

    this.collectibles.push(container);
  }

  spawnObstacle() {
    const { width } = this.scale;
    const type = Phaser.Utils.Array.GetRandom(BAD_PRACTICES);

    // Obstacles on or near ground
    const y = this.groundY - 35;

    const container = this.add.container(width + 80, y);

    // Warning card background
    const card = this.add.graphics();
    const bgColor = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.badBg,
    );
    const dangerColor = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.obstacleColor,
    );

    // Danger glow
    card.fillStyle(dangerColor.color, 0.15);
    card.fillRoundedRect(-55, -28, 110, 56, 12);

    // Card body
    card.fillStyle(bgColor.color, 0.9);
    card.fillRoundedRect(-50, -24, 100, 48, 10);

    // Border - pulsing will be animated
    card.lineStyle(3, dangerColor.color, 0.9);
    card.strokeRoundedRect(-50, -24, 100, 48, 10);

    // Warning icon/text
    const mainText = this.add.text(0, -6, type.text, {
      fontSize: "16px",
      fontFamily: "JetBrains Mono, monospace",
      fontStyle: "bold",
      color: this.currentTheme.obstacleColor,
    });
    mainText.setOrigin(0.5);

    // Damage indicator
    const damageText = this.add.text(0, 14, `-${type.damage}`, {
      fontSize: "14px",
      fontFamily: "JetBrains Mono, monospace",
      color: this.isDarkMode ? "#ff8899" : "#cc3355",
    });
    damageText.setOrigin(0.5);

    container.add([card, mainText, damageText]);
    container.setDepth(8);

    container.obstacleData = {
      type,
      card,
      hit: false,
      phase: Math.random() * Math.PI * 2,
    };

    this.obstacles.push(container);
  }

  spawnTree() {
    const { width, height } = this.scale;

    // Trees in background
    const y = this.groundY;
    const scale = 0.4 + Math.random() * 0.5;
    const depth = Math.random() < 0.5 ? -10 : 2;

    const tree = this.add.container(width + 100, y);

    // Trunk
    const trunk = this.add.graphics();
    const trunkColor = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.treeTrunk,
    );
    trunk.fillStyle(trunkColor.color);
    trunk.fillRect(-8 * scale, -60 * scale, 16 * scale, 60 * scale);

    // Foliage (triangle tree)
    const foliage = this.add.graphics();
    const treeColor = Phaser.Display.Color.HexStringToColor(
      this.currentTheme.treeColor,
    );
    foliage.fillStyle(treeColor.color);
    foliage.fillTriangle(
      0,
      -140 * scale,
      -40 * scale,
      -60 * scale,
      40 * scale,
      -60 * scale,
    );
    foliage.fillTriangle(
      0,
      -110 * scale,
      -35 * scale,
      -40 * scale,
      35 * scale,
      -40 * scale,
    );

    tree.add([trunk, foliage]);
    tree.setDepth(depth);

    tree.treeData = {
      scale,
      speedMult: depth < 0 ? 0.4 : 0.85,
    };

    this.trees.push(tree);
  }

  updateCollectibles(dt) {
    const speed = this.scrollSpeed * 60 * dt;

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      c.x -= speed;

      // Gentle floating animation
      c.collectibleData.phase += 0.03;
      c.y = c.collectibleData.baseY + Math.sin(c.collectibleData.phase) * 6;

      // Subtle scale pulse
      const pulse = 1 + Math.sin(c.collectibleData.phase * 1.5) * 0.03;
      c.setScale(pulse);

      // Magnetic attraction when player is close
      if (!c.collectibleData.collected) {
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          c.x,
          c.y,
        );
        if (dist < this.magnetRange) {
          const angle = Math.atan2(this.player.y - c.y, this.player.x - c.x);
          const strength =
            (1 - dist / this.magnetRange) * this.magnetStrength * dt;
          c.x += Math.cos(angle) * strength;
          c.y += Math.sin(angle) * strength;
        }
      }

      // Remove if off screen
      if (c.x < -120) {
        c.destroy();
        this.collectibles.splice(i, 1);
      }
    }
  }

  updateObstacles(dt) {
    const speed = this.scrollSpeed * 60 * dt;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i];
      o.x -= speed;

      // Warning shake animation
      o.obstacleData.phase += 0.12;
      o.y = this.groundY - 35 + Math.sin(o.obstacleData.phase * 4) * 2;

      // Pulsing danger effect
      const danger = 1 + Math.sin(o.obstacleData.phase * 2) * 0.05;
      o.setScale(danger);

      if (o.x < -120) {
        o.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  updateTrees(dt) {
    for (let i = this.trees.length - 1; i >= 0; i--) {
      const t = this.trees[i];
      t.x -= this.scrollSpeed * t.treeData.speedMult * 60 * dt;

      if (t.x < -150) {
        t.destroy();
        this.trees.splice(i, 1);
      }
    }
  }

  updateParticles(dt) {
    this.particlePool.forEach((p) => {
      if (p.active) {
        p.life -= dt;
        p.graphics.x += p.vx * dt;
        p.graphics.y += p.vy * dt;
        p.vy += 180 * dt; // gravity
        p.vx *= 0.99; // drag

        const lifeRatio = p.life / p.maxLife;
        p.graphics.setAlpha(lifeRatio);
        p.graphics.setScale(lifeRatio * p.startScale);

        if (p.life <= 0) {
          p.active = false;
          p.graphics.setVisible(false);
        }
      }
    });
  }

  updateTrail(dt) {
    // Emit trail particles when airborne
    if (!this.player.isOnGround) {
      if (Math.random() < 0.4) {
        this.emitParticle(
          this.player.x - 15 + Math.random() * 10,
          this.player.y + 20 + Math.random() * 5,
          this.currentTheme.accent,
          {
            vx: -30 - Math.random() * 20,
            vy: 10 + Math.random() * 20,
            size: 2 + Math.random() * 2,
          },
        );
      }
    }
  }

  emitParticle(x, y, colorHex, options = {}) {
    const color = Phaser.Display.Color.HexStringToColor(colorHex);
    const p = this.particlePool.find((p) => !p.active);

    if (p) {
      const size = options.size || 3 + Math.random() * 4;
      p.graphics.clear();
      p.graphics.fillStyle(color.color, 0.9);
      p.graphics.fillCircle(0, 0, size);
      p.graphics.setPosition(x, y);
      p.graphics.setVisible(true);
      p.graphics.setAlpha(1);
      p.graphics.setScale(1);
      p.startScale = 1;
      p.vx = options.vx !== undefined ? options.vx : (Math.random() - 0.5) * 80;
      p.vy = options.vy !== undefined ? options.vy : -40 - Math.random() * 80;
      p.life = 0.4 + Math.random() * 0.3;
      p.maxLife = p.life;
      p.active = true;
    }
  }

  emitParticles(x, y, count, colorHex) {
    for (let i = 0; i < count; i++) {
      this.emitParticle(x + (Math.random() - 0.5) * 20, y, colorHex);
    }
  }

  checkCollisions() {
    // Check collectibles
    this.collectibles.forEach((c) => {
      if (c.collectibleData.collected) return;

      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        c.x,
        c.y,
      );

      if (dist < 55) {
        this.collectItem(c);
      }
    });

    // Check obstacles
    this.obstacles.forEach((o) => {
      if (o.obstacleData.hit) return;

      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        o.x,
        o.y,
      );

      if (dist < 45) {
        this.hitObstacle(o);
      }
    });
  }

  collectItem(collectible) {
    const data = collectible.collectibleData;
    data.collected = true;

    const points = data.type.points;

    // Combo system
    const now = this.time.now;
    if (now - this.lastCollectTime < 2000) {
      this.combo++;
    } else {
      this.combo = 1;
    }
    this.lastCollectTime = now;

    const multiplier = Math.min(this.combo, 5);
    const totalPoints = points * multiplier;

    this.score += totalPoints;
    this.updateScoreDisplay();

    // Audio with pitch based on combo
    audio.playCollect(0.8 + this.combo * 0.15);

    // Show combo
    if (this.combo >= 2) {
      this.showCombo(multiplier);
      if (this.combo >= 3) audio.playCombo(this.combo);
    }

    // Collection animation - expand and fade
    this.tweens.add({
      targets: collectible,
      y: collectible.y - 40,
      alpha: 0,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 250,
      ease: "Back.easeOut",
      onComplete: () => collectible.destroy(),
    });

    // Burst of particles
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      this.emitParticle(
        collectible.x,
        collectible.y,
        this.currentTheme.accent,
        {
          vx: Math.cos(angle) * 100,
          vy: Math.sin(angle) * 100 - 30,
          size: 4,
        },
      );
    }

    // Player celebrate - slight stretch
    this.player.targetScaleX = 0.9;
    this.player.targetScaleY = 1.15;
  }

  hitObstacle(obstacle) {
    const data = obstacle.obstacleData;
    data.hit = true;

    const damage = data.type.damage;
    this.score = Math.max(0, this.score - damage);
    this.combo = 0;
    this.updateScoreDisplay();

    audio.playHit();

    // Screen shake - intensity based on damage
    this.cameras.main.shake(180, 0.008 + damage * 0.0003);

    // Flash red tint on camera
    this.cameras.main.flash(100, 255, 50, 80, false);

    // Player recoil
    this.player.targetScaleX = 1.3;
    this.player.targetScaleY = 0.7;

    // Flash player
    this.tweens.add({
      targets: this.player,
      alpha: 0.3,
      duration: 80,
      yoyo: true,
      repeat: 3,
    });

    // Obstacle explode animation
    this.tweens.add({
      targets: obstacle,
      scaleX: 1.6,
      scaleY: 1.6,
      alpha: 0,
      angle: (Math.random() - 0.5) * 30,
      duration: 200,
      ease: "Power2",
      onComplete: () => obstacle.destroy(),
    });

    // Red particles burst
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.emitParticle(
        obstacle.x,
        obstacle.y,
        this.currentTheme.obstacleColor,
        {
          vx: Math.cos(angle) * (60 + Math.random() * 80),
          vy: Math.sin(angle) * (60 + Math.random() * 80) - 40,
          size: 3 + Math.random() * 3,
        },
      );
    }
  }

  showCombo(multiplier) {
    const comboDisplay = document.getElementById("combo-display");
    const comboTexts = ["", "", "NICE!", "GREAT!", "AWESOME!", "LEGENDARY!"];
    comboDisplay.textContent = `${multiplier}x ${comboTexts[Math.min(multiplier, 5)]}`;
    comboDisplay.classList.remove("visible");
    void comboDisplay.offsetWidth; // Trigger reflow
    comboDisplay.classList.add("visible");
  }

  updateScoreDisplay() {
    document.getElementById("score").textContent = this.score;
  }

  triggerGameOver() {
    this.gameOver = true;

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("codeSurferHighScore", this.highScore.toString());
    }

    // Show game over screen
    document.getElementById("final-score").textContent = this.score;
    document.getElementById("final-best").textContent = this.highScore;
    document.getElementById("game-over").classList.add("visible");
  }

  restartGame() {
    document.getElementById("game-over").classList.remove("visible");

    // Reset state
    this.score = 0;
    this.combo = 0;
    this.scrollSpeed = this.baseScrollSpeed;
    this.gameOver = false;
    this.updateScoreDisplay();

    // Clear objects
    this.collectibles.forEach((c) => c.destroy());
    this.collectibles = [];
    this.obstacles.forEach((o) => o.destroy());
    this.obstacles = [];
    this.trees.forEach((t) => t.destroy());
    this.trees = [];

    // Reset player
    this.player.y = this.groundY - 35;
    this.player.velocityY = 0;
    this.player.isOnGround = true;
    this.player.alpha = 1;
    this.player.setScale(1, 1);
    this.player.targetScaleX = 1;
    this.player.targetScaleY = 1;
  }
}

// ============================================
// Game Configuration
// ============================================
const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#0a0612",
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: "100%",
    height: "100%",
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
  render: {
    antialias: true,
    pixelArt: false,
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
