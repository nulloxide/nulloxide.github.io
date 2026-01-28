// ================================
// nulloxide
// ================================

/**
 * @fileoverview Personal portfolio website for nulloxide
 * Features kinetic typography, particle animations, and interactive elements
 */

const BIRTHDAY = new Date(1981, 0, 1);

/**
 * Global cleanup registry for intervals, timeouts, and abort controllers
 * @type {{intervals: Set<number>, timeouts: Set<number>, abortControllers: Set<AbortController>}}
 */
const cleanupRegistry = {
  intervals: new Set(),
  timeouts: new Set(),
  abortControllers: new Set(),
};

/**
 * Register an interval for cleanup
 * @param {number} id - The interval ID
 * @returns {number} The same interval ID
 */
function registerInterval(id) {
  cleanupRegistry.intervals.add(id);
  return id;
}

/**
 * Register a timeout for cleanup with auto-removal after execution
 * @param {Function} callback - The callback function
 * @param {number} delay - Delay in milliseconds
 * @returns {number} The timeout ID
 */
function registerTimeout(callback, delay) {
  const id = setTimeout(() => {
    cleanupRegistry.timeouts.delete(id);
    callback();
  }, delay);
  cleanupRegistry.timeouts.add(id);
  return id;
}

/**
 * Create and register an AbortController
 * @returns {AbortController} The registered AbortController
 */
function createAbortController() {
  const controller = new AbortController();
  cleanupRegistry.abortControllers.add(controller);
  return controller;
}

/**
 * Clean up all registered intervals, timeouts, and abort controllers
 */
function cleanupAll() {
  cleanupRegistry.intervals.forEach((id) => clearInterval(id));
  cleanupRegistry.intervals.clear();

  cleanupRegistry.timeouts.forEach((id) => clearTimeout(id));
  cleanupRegistry.timeouts.clear();

  cleanupRegistry.abortControllers.forEach((controller) => controller.abort());
  cleanupRegistry.abortControllers.clear();
}

// Clean up on page unload
window.addEventListener("beforeunload", cleanupAll);

/** @type {Lenis|null} */
let lenis = null;

/**
 * Cached CSS values that change with theme
 * Updated by initThemeToggle on theme change
 */
const themeCache = {
  canvasFade: "rgba(8, 8, 10, 0.12)",
  waveColor: "0, 255, 157",
};

/**
 * Update cached theme values from CSS custom properties
 */
function updateThemeCache() {
  const style = getComputedStyle(document.documentElement);
  themeCache.canvasFade =
    style.getPropertyValue("--canvas-fade").trim() || "rgba(8, 8, 10, 0.12)";
  themeCache.waveColor =
    style.getPropertyValue("--wave-color").trim() || "0, 255, 157";
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch (e) {
    console.warn("GSAP or ScrollTrigger not available:", e);
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Critical path - run immediately for LCP
  initThemeToggle();
  initVisitorStatus();
  calculateAge();

  // Defer ScrollTrigger and heavy animations to avoid blocking LCP
  // Use requestIdleCallback if available, otherwise setTimeout
  const deferInit = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

  deferInit(() => {
    initLenis();
    initKineticTypography();
    initTerminalJourney();
    initScrollProgress();
    initScrollToTop();

    if (!prefersReducedMotion) {
      initWaveVisualization();
      initVoidCanvas();
    }

    initScrollAnimations();
    initMagnetic();
    initMatrixLocation();
    initNicknameInput();
    initButtonSpotlight();
    initRotatingPlaceholder();
    initEmailReveal();
    initEndSection();
    initKonamiCode();
  });
});

// ================================
// Theme Toggle
// ================================

/**
 * Initialize theme toggle functionality
 * Handles light/dark mode switching with localStorage persistence
 */
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const controller = createAbortController();

  // Initialize theme cache on load
  updateThemeCache();

  /**
   * Get the current effective theme
   * @returns {'light' | 'dark'} The current theme
   */
  function getCurrentTheme() {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;

    // Check system preference
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  /**
   * Set the theme and persist to localStorage
   * @param {'light' | 'dark'} theme - The theme to set
   */
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    // Update cached CSS values after theme change
    requestAnimationFrame(updateThemeCache);
  }

  // Toggle on click
  toggle.addEventListener(
    "click",
    () => {
      const current = getCurrentTheme();
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
    },
    { signal: controller.signal },
  );

  // Listen for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  mediaQuery.addEventListener(
    "change",
    (e) => {
      // Only update if user hasn't set a manual preference
      const stored = localStorage.getItem("theme");
      if (!stored) {
        document.documentElement.removeAttribute("data-theme");
        requestAnimationFrame(updateThemeCache);
      }
    },
    { signal: controller.signal },
  );
}

// ================================
// Kinetic Typography - Combined Effects
// ================================

/**
 * Initialize kinetic typography with scramble, hover, and gradient effects
 */
function initKineticTypography() {
  const words = document.querySelectorAll(".word");
  if (!words.length) return;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const controller = createAbortController();

  words.forEach((word, wordIndex) => {
    const text = word.textContent || "";
    const originalChars = text.split("");
    word.textContent = "";

    originalChars.forEach((char) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.dataset.original = char;
      span.textContent = char;
      word.appendChild(span);
    });

    const letters = word.querySelectorAll(".letter");

    // Initial scramble animation
    const scrambleDelay = wordIndex * 400;
    registerTimeout(() => {
      letters.forEach((letter, i) => {
        letter.classList.add("scrambling");
        let iterations = 0;
        const maxIterations = 8 + Math.random() * 6;
        const interval = setInterval(
          () => {
            if (iterations < maxIterations) {
              letter.textContent =
                chars[Math.floor(Math.random() * chars.length)];
              iterations++;
            } else {
              letter.textContent = letter.dataset.original || "";
              letter.classList.remove("scrambling");
              clearInterval(interval);
              cleanupRegistry.intervals.delete(interval);
            }
          },
          40 + i * 10,
        );
        registerInterval(interval);
      });
    }, 300 + scrambleDelay);

    // Letter hover effects
    letters.forEach((letter) => {
      letter.addEventListener(
        "mouseenter",
        () => {
          letter.classList.add("active");
          registerTimeout(() => {
            letter.classList.remove("active");
          }, 400);
        },
        { signal: controller.signal },
      );
    });

    // Word 3D tilt effect - cache rect and update on resize
    let wordRect = word.getBoundingClientRect();

    window.addEventListener(
      "resize",
      () => {
        wordRect = word.getBoundingClientRect();
      },
      { signal: controller.signal },
    );

    word.addEventListener(
      "mouseenter",
      () => {
        wordRect = word.getBoundingClientRect();
      },
      { signal: controller.signal },
    );

    word.addEventListener(
      "mousemove",
      (e) => {
        const x = (e.clientX - wordRect.left) / wordRect.width - 0.5;
        const y = (e.clientY - wordRect.top) / wordRect.height - 0.5;
        word.style.transform = `perspective(500px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      },
      { signal: controller.signal },
    );

    word.addEventListener(
      "mouseleave",
      () => {
        word.style.transform = "";
        letters.forEach((letter) => letter.classList.remove("active"));
      },
      { signal: controller.signal },
    );

    // Gradient flow effect
    function triggerGradientFlow() {
      letters.forEach((letter, i) => {
        registerTimeout(() => {
          letter.classList.add("gradient-flow");
          registerTimeout(() => letter.classList.remove("gradient-flow"), 600);
        }, i * 80);
      });
    }

    registerTimeout(
      () => {
        triggerGradientFlow();
        registerInterval(
          setInterval(triggerGradientFlow, 5000 + wordIndex * 1000),
        );
      },
      2000 + wordIndex * 500,
    );

    // Random glitch effect
    function triggerRandomGlitch() {
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      if (randomLetter) {
        randomLetter.classList.add("glitch");
        registerTimeout(() => randomLetter.classList.remove("glitch"), 150);
      }
    }

    registerInterval(
      setInterval(() => {
        if (Math.random() > 0.7) {
          triggerRandomGlitch();
        }
      }, 3000),
    );
  });
}

// ================================
// Button Spotlight Effect
// ================================

/**
 * Initialize button spotlight effect that follows mouse position
 */
function initButtonSpotlight() {
  const buttons = document.querySelectorAll(".sesame-btn, .link-work");
  if (!buttons.length) return;

  const controller = createAbortController();

  buttons.forEach((btn) => {
    // Cache rect and update on mouseenter for accuracy
    let btnRect = btn.getBoundingClientRect();

    btn.addEventListener(
      "mouseenter",
      () => {
        btnRect = btn.getBoundingClientRect();
      },
      { signal: controller.signal },
    );

    btn.addEventListener(
      "mousemove",
      (e) => {
        const x = ((e.clientX - btnRect.left) / btnRect.width) * 100;
        const y = ((e.clientY - btnRect.top) / btnRect.height) * 100;
        btn.style.setProperty("--mouse-x", `${x}%`);
        btn.style.setProperty("--mouse-y", `${y}%`);
      },
      { signal: controller.signal },
    );
  });
}

// ================================
// Visitor Status Detection
// ================================

/**
 * Initialize visitor status in terminal status bar
 * Shows platform and time-based info in compact format
 */
function initVisitorStatus() {
  const visitorEl = document.getElementById("status-visitor");
  if (!visitorEl) return;

  const platform = navigator.platform || "";
  const hour = new Date().getHours();

  // Combine platform + time into single short quip
  // Format: "mac@3am" style - compact and terminal-like
  let os = "???";
  if (/Mac|iPhone|iPad|iPod/.test(platform)) {
    os = "mac";
  } else if (/Win/.test(platform)) {
    os = "win";
  } else if (/Linux/.test(platform)) {
    os = "nix";
  } else if (/Android/.test(navigator.userAgent)) {
    os = "droid";
  }

  // Time as short label
  let time = "";
  if (hour >= 0 && hour < 5) {
    time = "late";
  } else if (hour >= 5 && hour < 8) {
    time = "early";
  } else if (hour >= 8 && hour < 12) {
    time = "am";
  } else if (hour >= 12 && hour < 17) {
    time = "pm";
  } else if (hour >= 17 && hour < 21) {
    time = "eve";
  } else {
    time = "night";
  }

  visitorEl.textContent = `${os}@${time}`;
}

// ================================
// Lenis Smooth Scroll
// ================================

/**
 * Initialize Lenis smooth scrolling library
 */
function initLenis() {
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      if (lenis) lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    console.warn("Lenis initialization failed:", e);
  }
}

// ================================
// Age Calculator with Jokes
// ================================

/**
 * Calculate and display age with humorous commentary
 */
function calculateAge() {
  const yearsEl = document.getElementById("years");
  const jokeEl = document.getElementById("age-joke");
  const uptimeEl = document.getElementById("status-uptime");

  const now = new Date();
  let years = now.getFullYear() - BIRTHDAY.getFullYear();
  const monthDiff = now.getMonth() - BIRTHDAY.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < BIRTHDAY.getDate())
  ) {
    years--;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((now.getTime() - BIRTHDAY.getTime()) / msPerDay);
  const daysThisYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / msPerDay,
  );

  if (yearsEl) {
    yearsEl.textContent = String(years);
  }

  // Update terminal status bar uptime
  if (uptimeEl) {
    uptimeEl.textContent = `${years}y ${daysThisYear}d`;
  }

  if (jokeEl) {
    const jokes = [
      `That's ${totalDays.toLocaleString()} days of "it works on my machine."`,
      `Or ${Math.floor(totalDays / 7).toLocaleString()} weeks of forgetting semicolons.`,
      `${years} years. Still googling error messages.`,
      `Old enough to remember floppy disks. Young enough to mass deploy.`,
      `In hex, that's 0x${years.toString(16).toUpperCase()}. Still debugging.`,
      `${years} in decimal. ${years.toString(2)} in binary nostalgia.`,
      `${Math.floor(years * 365.25 * 24).toLocaleString()} hours of screen time. Give or take.`,
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    jokeEl.textContent = randomJoke;
  }
}

// ================================
// Terminal Journey - Visual Code Evolution
// ================================

/**
 * Initialize the terminal journey animation showing code evolution
 */
function initTerminalJourney() {
  const terminal = document.getElementById("terminal");
  if (!terminal) return;

  const journeyLines = [
    { type: "cmd", text: '10 PRINT "HELLO WORLD"' },
    { type: "cmd", text: "20 GOTO 10" },
    { type: "output", text: "; first program. first addiction." },
    { type: "empty" },
    { type: "comment", text: "; Amiga days - cracktros were art galleries" },
    { type: "code", text: "; 64KB intro, 4-channel MOD, infinite scrolltext" },
    { type: "code", text: "GREETINGS TO: everyone who swapped disks with me" },
    { type: "empty" },
    { type: "comment", text: "; Assembly - where every byte was sacred" },
    { type: "code", text: "LDA #$00" },
    {
      type: "code",
      text: "STA $D020       ; changed border color. felt like god.",
    },
    { type: "empty" },
    {
      type: "comment",
      text: "// C era - pointers pointing to pointers to pain",
    },
    { type: "code", text: "void* life = malloc(sizeof(confusion));" },
    { type: "code", text: "free(life);     // segfault. as expected." },
    { type: "empty" },
    { type: "comment", text: "/* BBS era - where ASCII became art */" },
    { type: "code", text: "/p null wanna trade 14.4k modem for sound card?" },
    { type: "output", text: "; social media for geeks. 14400 baud." },
    { type: "output", text: "NO CARRIER              ; mom picked up. again." },
    { type: "empty" },
    {
      type: "comment",
      text: "# FreeBSD - where real hackers compiled kernels",
    },
    { type: "code", text: "make buildworld && make installworld" },
    { type: "code", text: '# 6 hours later: "oh a typo in rc.conf"' },
    { type: "empty" },
    {
      type: "comment",
      text: '# Render farms & grids - 1000 machines was "cute"',
    },
    { type: "code", text: "for i in $(seq 1 1000); do" },
    { type: "code", text: '    ssh node$i "nice -n 19 render frame_$i" &' },
    { type: "code", text: "done" },
    {
      type: "code",
      text: "# works. until one node sneezes. electricity bill: yes.",
    },
    { type: "empty" },
    { type: "comment", text: "# Finance - a new chapter" },
    {
      type: "code",
      text: "# ever since I was young I dreamed of transforming",
    },
    {
      type: "code",
      text: "# unstructured data into actionable business insights",
    },
    { type: "code", text: "import pandas as pd" },
    { type: "code", text: 'pd.read_csv("my_life_now.csv")  # this is fine.' },
    { type: "empty" },
    { type: "output highlight", text: "> Still building. Still curious." },
  ];

  terminal.textContent = "";

  journeyLines.forEach((line, i) => {
    const div = document.createElement("div");
    div.className = "terminal-line";
    div.style.transitionDelay = `${i * 0.08}s`;

    if (line.type === "empty") {
      div.innerHTML = "&nbsp;";
    } else {
      const content = escapeHtml(line.text);
      if (line.type === "cmd") {
        div.innerHTML = `<span class="prompt">></span><span class="cmd">${content}</span>`;
      } else if (line.type === "output") {
        div.innerHTML = `<span class="output">${content}</span>`;
      } else if (line.type === "output highlight") {
        div.innerHTML = `<span class="output highlight">${content}</span>`;
      } else if (line.type === "comment") {
        div.innerHTML = `<span class="comment">${content}</span>`;
      } else if (line.type === "code") {
        div.innerHTML = `<span class="cmd">${content}</span>`;
      }
    }

    terminal.appendChild(div);
  });

  ScrollTrigger.create({
    trigger: ".section--journey",
    start: "top 70%",
    onEnter: () => {
      const terminalWindow = document.querySelector(".terminal-window");
      if (terminalWindow) {
        terminalWindow.classList.add("visible");
      }

      const lines = terminal.querySelectorAll(".terminal-line");
      lines.forEach((line, i) => {
        registerTimeout(() => {
          line.classList.add("typed");
        }, i * 120);
      });
    },
    once: true,
  });
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} Escaped text safe for innerHTML
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ================================
// Wave Visualization
// ================================

/**
 * Initialize interactive wave canvas visualization
 */
function initWaveVisualization() {
  const canvas = document.getElementById("wave");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const container = canvas.parentElement;
  if (!container) return;

  const controller = createAbortController();
  let mouse = { x: null, y: null };
  let targetMouse = { x: null, y: null };
  let animationId = null;

  function resize() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  resize();
  window.addEventListener("resize", resize, { signal: controller.signal });

  container.addEventListener(
    "mousemove",
    (e) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = e.clientY - rect.top;
    },
    { signal: controller.signal },
  );

  container.addEventListener(
    "mouseleave",
    () => {
      targetMouse.x = null;
      targetMouse.y = null;
    },
    { signal: controller.signal },
  );

  let time = 0;
  let isVisible = false;
  let animationStarted = false;

  function draw() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, w, h);

    if (targetMouse.x !== null) {
      mouse.x =
        mouse.x === null
          ? targetMouse.x
          : mouse.x + (targetMouse.x - mouse.x) * 0.1;
      mouse.y =
        mouse.y === null
          ? targetMouse.y
          : mouse.y + (targetMouse.y - mouse.y) * 0.1;
    } else {
      mouse.x = null;
      mouse.y = null;
    }

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();

      const baseAmplitude = 20 + layer * 10;
      const frequency = 0.02 - layer * 0.005;
      const speed = 0.03 + layer * 0.01;
      const alpha = 0.3 - layer * 0.08;

      for (let x = 0; x <= w; x += 2) {
        let amplitude = baseAmplitude;
        if (mouse.x !== null) {
          const distFromMouse = Math.abs(x - mouse.x);
          const influenceRadius = 150;
          if (distFromMouse < influenceRadius) {
            const influence = 1 - distFromMouse / influenceRadius;
            amplitude += influence * 25;
          }
        }

        const y =
          h / 2 +
          Math.sin(x * frequency + time * speed) * amplitude +
          Math.sin(x * frequency * 2 + time * speed * 1.5) * amplitude * 0.5;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = `rgba(${themeCache.waveColor}, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    time += 1;
    animationId = requestAnimationFrame(draw);
  }

  // Don't start animation until section is visible
  ScrollTrigger.create({
    trigger: ".section--philosophy",
    start: "top 80%",
    onEnter: () => {
      isVisible = true;
      if (!animationStarted) {
        animationStarted = true;
        draw();
      }
    },
    once: true,
  });

  // Cleanup on abort
  controller.signal.addEventListener("abort", () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
}

// ================================
// Void Canvas - Particle System
// ================================

/**
 * Initialize the void canvas particle animation
 */
function initVoidCanvas() {
  const canvas = document.getElementById("void");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const controller = createAbortController();
  let width = 0;
  let height = 0;
  let particleLayers = [[], [], []];
  let mouse = { x: null, y: null };
  let time = 0;
  let animationId = null;

  const colors = [
    { r: 0, g: 255, b: 157 },
    { r: 0, g: 212, b: 255 },
    { r: 120, g: 100, b: 255 },
  ];

  /**
   * Shift color based on offset for smooth transitions
   * @param {{r: number, g: number, b: number}} color - Base color
   * @param {number} offset - Offset value for shifting
   * @returns {{r: number, g: number, b: number}} Shifted color
   */
  function shiftColor(color, offset) {
    const shift = Math.sin(offset) * 0.5 + 0.5;
    const colorIndex = colors.indexOf(color);
    const nextColor = colors[(colorIndex + 1) % colors.length];
    return {
      r: Math.round(color.r + (nextColor.r - color.r) * shift * 0.3),
      g: Math.round(color.g + (nextColor.g - color.g) * shift * 0.3),
      b: Math.round(color.b + (nextColor.b - color.b) * shift * 0.3),
    };
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor(layer = 0) {
      this.layer = layer;
      this.x = 0;
      this.y = 0;
      this.baseSize = 0;
      this.size = 0;
      this.vx = 0;
      this.vy = 0;
      this.baseAlpha = 0;
      this.alpha = 0;
      this.colorIndex = 0;
      this.pulseOffset = 0;
      this.pulseSpeed = 0;
      // Pre-computed color strings to avoid string creation in draw loop
      this.fillColor = "";
      this.glowColor = "";
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      const layerFactor = 1 - this.layer * 0.3;
      this.baseSize = (Math.random() * 1.5 + 0.5) * layerFactor;
      this.size = this.baseSize;
      this.vx = (Math.random() - 0.5) * 0.2 * layerFactor;
      this.vy = (Math.random() - 0.5) * 0.2 * layerFactor;
      this.baseAlpha = (Math.random() * 0.3 + 0.1) * layerFactor;
      this.alpha = this.baseAlpha;
      this.colorIndex = Math.floor(Math.random() * colors.length);
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }

    update() {
      const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset);
      this.size = this.baseSize * (1 + pulse * 0.3);
      this.alpha = this.baseAlpha * (1 + pulse * 0.2);

      this.x += this.vx;
      this.y += this.vy;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120 * (1 - this.layer * 0.2);
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const layerForce = 0.015 * (1 - this.layer * 0.3);
          this.vx -= (dx / dist) * force * layerForce;
          this.vy -= (dy / dist) * force * layerForce;
        }
      }

      this.vx *= 0.99;
      this.vy *= 0.99;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Pre-compute color strings once per update instead of twice per draw
      const color = colors[this.colorIndex];
      const shifted = shiftColor(color, time * 0.001 + this.x * 0.001);
      this.fillColor = `rgba(${shifted.r},${shifted.g},${shifted.b},${this.alpha})`;
      this.glowColor = `rgba(${shifted.r},${shifted.g},${shifted.b},${this.alpha * 0.3})`;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = this.fillColor;
      ctx.fill();

      // Add glow effect with larger, more transparent circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.glowColor;
      ctx.fill();
    }
  }

  function initParticles() {
    particleLayers = [[], [], []];
    const baseCount = Math.min(80, Math.floor((width * height) / 25000));
    for (let layer = 0; layer < 3; layer++) {
      const count = Math.floor(baseCount * (1 - layer * 0.3));
      for (let i = 0; i < count; i++) {
        particleLayers[layer].push(new Particle(layer));
      }
    }
  }

  /**
   * Draw connections between nearby particles in the front layer
   * Optimized: Only check particles within grid cells
   */
  function drawConnections() {
    const front = particleLayers[0];
    const connectionDistance = 100;
    const connectionDistSq = connectionDistance * connectionDistance;

    // Simple optimization: limit checks for smaller particle counts
    const len = front.length;
    for (let i = 0; i < len; i++) {
      const p1 = front[i];
      // Only check particles that come after to avoid duplicate lines
      for (let j = i + 1; j < len; j++) {
        const p2 = front[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < connectionDistSq) {
          const dist = Math.sqrt(distSq);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 157, ${(1 - dist / connectionDistance) * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    // Use cached theme value instead of getComputedStyle every frame
    ctx.fillStyle = themeCache.canvasFade;
    ctx.fillRect(0, 0, width, height);

    time++;

    // Draw back to front
    for (let layer = 2; layer >= 0; layer--) {
      for (const p of particleLayers[layer]) {
        p.update();
        p.draw();
      }
    }

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Event listeners with cleanup
  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { signal: controller.signal },
  );

  window.addEventListener(
    "mouseleave",
    () => {
      mouse.x = null;
      mouse.y = null;
    },
    { signal: controller.signal },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    },
    { passive: true, signal: controller.signal },
  );

  window.addEventListener(
    "touchend",
    () => {
      mouse.x = null;
      mouse.y = null;
    },
    { passive: true, signal: controller.signal },
  );

  window.addEventListener("resize", resize, { signal: controller.signal });

  // Cleanup on abort
  controller.signal.addEventListener("abort", () => {
    if (animationId) cancelAnimationFrame(animationId);
  });

  resize();
  animate();
}

// ================================
// Scroll Animations
// ================================

/**
 * Initialize GSAP scroll-triggered animations
 */
function initScrollAnimations() {
  // Philosophy section
  ScrollTrigger.create({
    trigger: ".section--philosophy",
    start: "top 60%",
    onEnter: () => {
      // Depth layers animate in
      gsap.to(".layer-1", {
        opacity: 0.1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(".layer-2", {
        opacity: 0.2,
        scale: 1,
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out",
      });
      gsap.to(".layer-3", {
        opacity: 0.4,
        scale: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      });
      gsap.to(".layer-4", {
        opacity: 0.8,
        scale: 1,
        duration: 0.8,
        delay: 0.45,
        ease: "power2.out",
      });

      // Depth text - word-by-word reveal
      const words = document.querySelectorAll(".reveal-word");
      words.forEach((word, i) => {
        registerTimeout(
          () => {
            word.classList.add("visible");
          },
          600 + i * 150,
        );
      });

      // Balance text
      gsap.to(".balance-text", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      });
    },
    once: true,
  });

  gsap.set(".layer", { scale: 0.8 });
  gsap.set(".balance-text", { opacity: 0, y: 20 });

  // Parallax effect on depth circles
  gsap.to(".layer-1", {
    y: -30,
    scrollTrigger: {
      trigger: ".section--philosophy",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  gsap.to(".layer-2", {
    y: -20,
    scrollTrigger: {
      trigger: ".section--philosophy",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  gsap.to(".layer-3", {
    y: -10,
    scrollTrigger: {
      trigger: ".section--philosophy",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  gsap.to(".layer-4", {
    y: 5,
    scrollTrigger: {
      trigger: ".section--philosophy",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  // Meta section - typewriter effect
  ScrollTrigger.create({
    trigger: ".section--meta",
    start: "top 80%",
    onEnter: () => {
      const lines = document.querySelectorAll(".comment-line");
      let delay = 0;

      lines.forEach((line) => {
        let text = line.dataset.text || "";
        // Replace placeholders
        text = text.replace("{year}", String(new Date().getFullYear()));
        text = text.replace("{accent}", '<span class="accent">');
        text = text.replace("{/accent}", "</span>");

        registerTimeout(() => {
          typeCommentLine(line, text);
        }, delay);

        delay += text.length * 30 + 500;
      });
    },
    once: true,
  });

  // Work section - staggered button entrance
  gsap.set(".work-intro", { opacity: 0, y: 20 });
  gsap.set(".link-work", { opacity: 0, y: 30 });
  gsap.set(".email-display", { opacity: 0 });

  ScrollTrigger.create({
    trigger: ".section--work",
    start: "top 70%",
    onEnter: () => {
      gsap.to(".work-intro", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(".link-work", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.2,
        ease: "power2.out",
      });
    },
    once: true,
  });

  // Find section
  ScrollTrigger.create({
    trigger: ".section--find",
    start: "top 60%",
    onEnter: () => {
      gsap.to(".find-intro, .find-handle, .find-note", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    },
    once: true,
  });

  gsap.set(".find-intro, .find-handle, .find-note", { opacity: 0, y: 20 });
}

// ================================
// Magnetic Effect
// ================================

/**
 * Initialize magnetic hover effect on elements with data-magnetic attribute
 */
function initMagnetic() {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const elements = document.querySelectorAll("[data-magnetic]");
  if (!elements.length) return;

  const controller = createAbortController();

  elements.forEach((el) => {
    if (!isTouchDevice) {
      // Cache rect and update on mouseenter
      let elRect = el.getBoundingClientRect();

      el.addEventListener(
        "mouseenter",
        () => {
          elRect = el.getBoundingClientRect();
        },
        { signal: controller.signal },
      );

      el.addEventListener(
        "mousemove",
        (e) => {
          const x = e.clientX - elRect.left - elRect.width / 2;
          const y = e.clientY - elRect.top - elRect.height / 2;
          gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out",
          });
        },
        { signal: controller.signal },
      );

      el.addEventListener(
        "mouseleave",
        () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          });
        },
        { signal: controller.signal },
      );
    } else {
      el.addEventListener(
        "touchstart",
        () => {
          gsap.to(el, { scale: 0.95, duration: 0.1, ease: "power2.out" });
        },
        { passive: true, signal: controller.signal },
      );

      el.addEventListener(
        "touchend",
        () => {
          gsap.to(el, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
        },
        { passive: true, signal: controller.signal },
      );
    }
  });
}

// ================================
// Location
// ================================

/**
 * Initialize the location section with random responses
 */
function initMatrixLocation() {
  const locationResponse = document.querySelector(".location-response");
  const locationCoords = document.getElementById("location-coords");

  if (!locationResponse || !locationCoords) return;

  const pairs = [
    {
      response: "There's no place like 127.0.0.1",
      subtitle: "localhost, sweet localhost",
    },
    { response: "Successfully invisible", subtitle: "VPN detected. Nice try." },
    {
      response: "ping reality: Request timed out",
      subtitle: "packet loss: 100%",
    },
    { response: "/dev/null", subtitle: "where all locations go to rest" },
    { response: "Location: undefined", subtitle: "Mental state: caffeinated" },
    {
      response: "Result: NULL",
      subtitle: 'db.locations.find({entity: "nulloxide"}) → [ ]',
    },
    {
      response: "Somewhere between 0 and 1",
      subtitle: "lat: NaN, long: undefined",
    },
    {
      response: "404: Physical location not found",
      subtitle: "coordinates: [consciousness, caffeine]",
    },
  ];

  ScrollTrigger.create({
    trigger: ".section--location",
    start: "top 70%",
    onEnter: () => {
      gsap.to(".location-prompt", { opacity: 1, duration: 0.5 });

      registerTimeout(() => {
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        typeText(locationResponse, pair.response, 50, () => {
          registerTimeout(() => {
            locationCoords.textContent = pair.subtitle;
            gsap.to(locationCoords, { opacity: 1, duration: 0.5 });
          }, 500);
        });
      }, 800);
    },
    once: true,
  });
}

/**
 * Type text character by character with cursor effect
 * @param {Element} element - Target element
 * @param {string} text - Text to type
 * @param {number} speed - Delay between characters in ms
 * @param {Function} [callback] - Callback when complete
 */
function typeText(element, text, speed, callback) {
  element.textContent = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      // Build content with cursor
      const cursor = document.createElement("span");
      cursor.className = "cursor-blink";
      cursor.textContent = "_";

      element.textContent = text.substring(0, i + 1);
      element.appendChild(cursor);
      i++;
      registerTimeout(type, speed);
    } else {
      element.textContent = text;
      if (callback) callback();
    }
  }
  type();
}

/**
 * Type a comment line with HTML support
 * @param {Element} element - Target element
 * @param {string} html - HTML content to type
 */
function typeCommentLine(element, html) {
  element.textContent = "";
  element.classList.add("visible");

  // Convert HTML to plain text for typing
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const plainText = temp.textContent || "";

  let i = 0;
  function type() {
    if (i < plainText.length) {
      // Build the HTML up to current position
      let currentHtml = "";
      let plainIndex = 0;
      let inTag = false;
      let tagBuffer = "";

      for (let j = 0; j < html.length && plainIndex <= i; j++) {
        if (html[j] === "<") {
          inTag = true;
          tagBuffer = "<";
        } else if (html[j] === ">") {
          inTag = false;
          tagBuffer += ">";
          currentHtml += tagBuffer;
          tagBuffer = "";
        } else if (inTag) {
          tagBuffer += html[j];
        } else {
          if (plainIndex <= i) {
            currentHtml += html[j];
          }
          plainIndex++;
        }
      }

      element.innerHTML = currentHtml + '<span class="cursor-blink">_</span>';
      i++;
      registerTimeout(type, 25 + Math.random() * 15);
    } else {
      element.innerHTML = html;
    }
  }
  type();
}

// ================================
// Nickname Input - Sesame Gate
// ================================

/**
 * Initialize the nickname input "sesame gate" feature
 */
function initNicknameInput() {
  const input = document.getElementById("nickname-input");
  const response = document.getElementById("nickname-response");
  const btn = document.getElementById("sesame-btn");

  if (!input || !response || !btn) return;

  const controller = createAbortController();

  const eraResponses = {
    mohsen: { era: "The formal era. Parents? Teachers? Government forms?" },
    ramez: { era: "High school! You survived those years with me." },
    null: { era: "End of high school. BBS days. You saw the origin." },
    linux: { era: "University era. Compiling kernels and idealism." },
    dotcom: { era: "Uni days. When we thought the web would save us all." },
    mosi: { era: "The 30s. You knew me when I had opinions about wine." },
    mojen: { era: "The 30s variant. Close enough to formal, far from it." },
    moe: { era: "Finance era. You know me in a suit. Somehow." },
    nulloxide: { era: "Internet age. You found me in the void." },
  };

  const defaultResponses = [
    "Hmm, don't recognize that one. But I'll trust you.",
    "Interesting. You had a unique name for me.",
    "Can't place the era, but you seem legit.",
    "Memory fuzzy. Too many kernel panics.",
  ];

  function processNickname() {
    const nickname = input.value.trim().toLowerCase();

    if (!nickname) {
      response.textContent = "Type something. I don't bite. Much.";
      response.classList.add("visible");
      return;
    }

    const match = eraResponses[nickname];

    if (match) {
      response.textContent = match.era;
    } else {
      response.textContent =
        defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    response.classList.add("visible");

    // Transform button to personal email link
    registerTimeout(() => {
      btn.classList.add("revealed");
      const personalEmail = ["nulloxide", "@", "gmail", ".", "com"].join("");
      const encodedName = encodeURIComponent(input.value);

      // Create the link element properly
      const link = document.createElement("a");
      link.href = `mailto:${personalEmail}?subject=Hey, it's ${encodedName}`;
      link.style.cssText = "color: inherit; text-decoration: none;";
      link.textContent = "Gates open. Click to email.";

      btn.textContent = "";
      btn.appendChild(link);
    }, 1000);
  }

  btn.addEventListener(
    "click",
    (e) => {
      if (!btn.classList.contains("revealed")) {
        e.preventDefault();
        processNickname();
      }
    },
    { signal: controller.signal },
  );

  input.addEventListener(
    "keypress",
    (e) => {
      if (e.key === "Enter") {
        processNickname();
      }
    },
    { signal: controller.signal },
  );
}

// ================================
// Scroll Progress Indicator
// ================================

/**
 * Initialize the scroll progress bar at the top of the page
 * Uses rAF throttling for better performance
 */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  const controller = createAbortController();
  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true, signal: controller.signal },
  );
}

// ================================
// Scroll to Top
// ================================

/**
 * Initialize the scroll-to-top button
 */
function initScrollToTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;

  const controller = createAbortController();

  btn.addEventListener(
    "click",
    () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    { signal: controller.signal },
  );
}

// ================================
// Rotating Placeholder
// ================================

/**
 * Initialize rotating placeholder text for the nickname input
 */
function initRotatingPlaceholder() {
  const input = document.getElementById("nickname-input");
  if (!input) return;

  const placeholders = [
    "mohsen? moe? that kid?",
    "the 3am debugger?",
    "null? linux? dotcom?",
    "ramez from high school?",
    "the FreeBSD guy?",
    "too many monitors guy?",
  ];

  let currentIndex = 0;

  registerInterval(
    setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      input.placeholder = placeholders[currentIndex];
    }, 4000),
  );
}

// ================================
// Console Easter Egg
// ================================
console.log(
  "%c∅→ nulloxide",
  "font-size: 20px; font-weight: bold; color: #00ff9d;",
);
console.log(
  "%c" +
    `
    ╔══════════════════════════════════════╗
    ║  You found the console.              ║
    ║  Respect.                            ║
    ║                                      ║
    ║  Type 'nulloxide.help()' for more.   ║
    ╚══════════════════════════════════════╝
`,
  "color: #4a4a58; font-family: monospace;",
);

window.nulloxide = {
  help: () => {
    console.log("%cAvailable commands:", "color: #00ff9d; font-weight: bold;");
    console.log("  nulloxide.age()     - Calculate exact age");
    console.log("  nulloxide.stack()   - Tech stack over the years");
    console.log("  nulloxide.contact() - Get in touch");
    console.log("  nulloxide.source()  - View source code");
  },
  age: () => {
    const now = new Date();
    const diff = now.getTime() - BIRTHDAY.getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const days = Math.floor(
      (diff % (365.25 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000),
    );
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    console.log(
      `%c${years} years, ${days} days, ${hours} hours`,
      "color: #00ff9d;",
    );
    console.log("%cand counting...", "color: #4a4a58;");
  },
  stack: () => {
    console.log("%cThe Evolution:", "color: #ff6b35; font-weight: bold;");
    console.log("  1980s: BASIC, Assembly, Amiga");
    console.log("  1990s: C, Pascal, BBS, FreeBSD");
    console.log("  2000s: Linux, Perl, PHP, MySQL");
    console.log("  2010s: Python, Docker, K8s, Cloud");
    console.log("  2020s: Finance, Data, Scale");
    console.log("%cStill learning.", "color: #00ff9d;");
  },
  contact: () => {
    console.log("%cReach out:", "color: #00ff9d; font-weight: bold;");
    console.log("  Work: sudo@nulloxide.com");
    console.log("  Friends: nulloxide@gmail.com");
    console.log("  LinkedIn: /in/nulloxide");
    console.log("  Handle: @nulloxide (everywhere)");
  },
  source: () => {
    console.log("%cView source: Ctrl+U or Cmd+Option+U", "color: #00ff9d;");
    console.log(
      "%cOr just scroll up and read the code comments.",
      "color: #4a4a58;",
    );
  },
};

// ================================
// Email Reveal
// ================================

/**
 * Initialize the email reveal button functionality
 */
function initEmailReveal() {
  const btn = document.getElementById("reveal-email");
  const display = document.getElementById("email-display");

  if (!btn || !display) return;

  const controller = createAbortController();

  btn.addEventListener(
    "click",
    () => {
      // Obfuscated email - assembled at runtime
      const parts = ["sudo", "@", "null", "oxide", ".", "com"];
      const email = parts.join("");

      // Type it out
      display.textContent = "";
      display.classList.add("visible");

      let i = 0;
      function typeEmail() {
        if (i < email.length) {
          display.textContent += email[i];
          i++;
          registerTimeout(typeEmail, 50);
        } else {
          // Make it clickable
          const link = document.createElement("a");
          link.href = `mailto:${email}`;
          link.style.cssText = "color: var(--accent); text-decoration: none;";
          link.textContent = email;
          display.textContent = "";
          display.appendChild(link);
        }
      }
      typeEmail();

      // Update button
      const buttonText = btn.querySelector("span:not(.link-icon)");
      const emailHint = btn.querySelector(".email-hint");

      if (buttonText) buttonText.textContent = "Copied vibes";
      if (emailHint) emailHint.style.display = "none";

      registerTimeout(() => {
        if (buttonText) buttonText.textContent = "Email";
      }, 2000);
    },
    { signal: controller.signal },
  );
}

// ================================
// End Section
// ================================

/**
 * Initialize the end section with timestamp and glitch effects
 */
function initEndSection() {
  const timestampEl = document.getElementById("end-timestamp");
  const sigEl = document.getElementById("end-sig");

  if (timestampEl) {
    const now = new Date();
    const timestamps = [
      `Last refresh: ${now.toLocaleTimeString()}`,
      `Rendered at: ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`,
      `Session started: ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      `Time is an illusion (${now.toLocaleTimeString()})`,
    ];
    timestampEl.textContent =
      timestamps[Math.floor(Math.random() * timestamps.length)];
  }

  // Random glitch on signature
  if (sigEl) {
    registerInterval(
      setInterval(() => {
        if (Math.random() < 0.1) {
          sigEl.classList.add("glitching");
          registerTimeout(() => sigEl.classList.remove("glitching"), 200);
        }
      }, 5000),
    );
  }
}

// ================================
// Konami Code Easter Egg
// ================================

/**
 * Initialize Konami code detection (↑↑↓↓←→←→BA)
 */
function initKonamiCode() {
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  let konamiIndex = 0;
  let isAnimating = false;

  const controller = createAbortController();

  document.addEventListener(
    "keydown",
    (e) => {
      if (isAnimating) return;

      const key = e.code;

      if (key === konamiSequence[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          isAnimating = true;
          triggerKonamiEasterEgg(() => {
            isAnimating = false;
          });
        }
      } else {
        konamiIndex = 0;
        // Check if first key matches to start fresh
        if (key === konamiSequence[0]) {
          konamiIndex = 1;
        }
      }
    },
    { signal: controller.signal },
  );
}

/**
 * Trigger the Konami code easter egg effects
 * @param {Function} onComplete - Callback when animation completes
 */
function triggerKonamiEasterEgg(onComplete) {
  // Show secret message
  const message = document.createElement("div");
  message.className = "konami-message";
  message.innerHTML = `
    <div class="konami-message-content">
      <span class="konami-symbol">⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️</span>
      <span class="konami-text">// YOU FOUND IT</span>
      <span class="konami-subtext">30 extra lives unlocked. Just kidding.</span>
      <span class="konami-subtext">But you clearly know your classics.</span>
    </div>
  `;
  document.body.appendChild(message);

  // Fade in message
  requestAnimationFrame(() => {
    message.classList.add("visible");
  });

  // Console message
  console.log(
    "%c🎮 KONAMI CODE ACTIVATED! 🎮",
    "font-size: 24px; color: #00ff9d; font-weight: bold;",
  );
  console.log("%c↑ ↑ ↓ ↓ ← → ← → B A", "font-size: 16px; color: #cba6f7;");
  console.log(
    "%cYou found the easter egg. Respect.",
    "font-size: 14px; color: #89b4fa;",
  );

  // Hide message after a bit
  registerTimeout(() => {
    message.classList.remove("visible");
    registerTimeout(() => {
      message.remove();
      if (onComplete) onComplete();
    }, 500);
  }, 4000);
}
