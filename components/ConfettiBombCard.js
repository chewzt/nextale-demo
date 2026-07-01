import { useCallback, useEffect, useRef } from "react";

const DEFAULT_PALETTE = [
  "#1b3fd8",
  "#0071e3",
  "#ff2d55",
  "#ff9500",
  "#ffd60a",
  "#bf5af2",
  "#30d158",
  "#64d2ff",
];

const SETTLE_SPEED = 0.25;
const CHIP_DRAG = 0.955;
const RIBBON_DRAG = 0.962;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pickColor(palette) {
  return palette[Math.floor(Math.random() * palette.length)];
}

const CHIP_TRAVEL = 17.5;
const RIBBON_TRAVEL = 21;

function velocityToward(sx, sy, tx, ty, travelFactor) {
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.hypot(dx, dy);

  if (dist < 1) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(2, 5);
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  }

  const speed = (dist / travelFactor) * rand(0.9, 1.1);
  return {
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
  };
}

function randomTarget(width, height, margin) {
  return {
    tx: rand(margin, width - margin),
    ty: rand(margin, height - margin),
  };
}

function createParticles(
  count,
  originX,
  originY,
  palette = DEFAULT_PALETTE,
  options = {},
) {
  const { width = 400, height = 300, jitter = 10 } = options;
  const margin = Math.min(width, height) * 0.05;
  const particles = [];

  for (let i = 0; i < count; i += 1) {
    const isRibbon = Math.random() < 0.58;
    const { tx, ty } = randomTarget(width, height, margin);
    const x = originX + rand(-jitter, jitter);
    const y = originY + rand(-jitter, jitter);
    const { vx, vy } = velocityToward(
      x,
      y,
      tx,
      ty,
      isRibbon ? RIBBON_TRAVEL : CHIP_TRAVEL,
    );

    if (isRibbon) {
      particles.push({
        kind: "ribbon",
        x,
        y,
        vx,
        vy,
        angle: rand(0, Math.PI * 2),
        spin: rand(-0.05, 0.05),
        width: rand(28, 58),
        height: rand(3, 5.5),
        color: pickColor(palette),
        wave: rand(0.07, 0.18),
        settled: false,
      });
    } else {
      const size = rand(5, 11);
      particles.push({
        kind: "chip",
        x,
        y,
        vx,
        vy,
        angle: rand(0, Math.PI * 2),
        spin: rand(-0.12, 0.12),
        width: size,
        height: size * rand(0.55, 1),
        color: pickColor(palette),
        wave: 0,
        settled: false,
      });
    }
  }

  for (let i = particles.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [particles[i], particles[j]] = [particles[j], particles[i]];
  }

  return particles;
}

function stepParticles(particles, dt = 1) {
  let allSettled = true;

  for (const p of particles) {
    if (p.settled) continue;

    const drag = p.kind === "ribbon" ? RIBBON_DRAG : CHIP_DRAG;

    p.vx *= drag ** dt;
    p.vy *= drag ** dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.angle += p.spin * dt;

    const speed = Math.hypot(p.vx, p.vy);
    if (speed < SETTLE_SPEED) {
      p.vx = 0;
      p.vy = 0;
      p.settled = true;
    } else {
      allSettled = false;
    }
  }

  return allSettled;
}

function drawChip(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
  ctx.restore();
}

function drawRibbon(ctx, p) {
  const segments = 12;
  const halfLen = p.width / 2;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.strokeStyle = p.color;
  ctx.lineWidth = p.height;
  ctx.lineCap = "round";
  ctx.beginPath();

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = -halfLen + t * p.width;
    const y = Math.sin(t * Math.PI * 2 + p.angle * 2) * p.width * p.wave;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
  ctx.restore();
}

function drawParticles(ctx, particles) {
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  for (const p of particles) {
    if (p.kind === "chip") drawChip(ctx, p);
  }

  for (const p of particles) {
    if (p.kind === "ribbon") drawRibbon(ctx, p);
  }
}

const PARTICLE_COUNT = 180;
const MAX_DURATION_MS = 2200;
const SCROLL_THRESHOLD = 0.38;

function syncCanvasSize(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function isInView(root) {
  const rect = root.getBoundingClientRect();
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const visibleHeight =
    Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
  if (visibleHeight <= 0 || rect.height <= 0) return false;
  return visibleHeight / rect.height >= SCROLL_THRESHOLD;
}

export default function ConfettiBombCard({ stateRef }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastFrameRef = useRef(0);

  const cancelLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const redraw = useCallback(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || !stateRef.current.particles.length) return;

    const { width, height } = root.getBoundingClientRect();
    if (width < 1 || height < 1) return;

    syncCanvasSize(canvas, width, height);
    const ctx = canvas.getContext("2d");
    if (ctx) drawParticles(ctx, stateRef.current.particles);
  }, [stateRef]);

  const tick = useCallback(
    (now) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dt = lastFrameRef.current
        ? Math.min(2.5, (now - lastFrameRef.current) / 16.67)
        : 1;
      lastFrameRef.current = now;

      const elapsed = now - startTimeRef.current;
      const settled = stepParticles(stateRef.current.particles, dt);
      drawParticles(ctx, stateRef.current.particles);

      if (settled || elapsed >= MAX_DURATION_MS) {
        stateRef.current.frozen = true;
        cancelLoop();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelLoop, stateRef],
  );

  const fire = useCallback(() => {
    if (stateRef.current.fired) return;

    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const { width, height } = root.getBoundingClientRect();
    if (width < 1 || height < 1) return;

    stateRef.current.fired = true;
    syncCanvasSize(canvas, width, height);

    stateRef.current.particles = createParticles(
      PARTICLE_COUNT,
      width / 2,
      height / 2,
      undefined,
      {
        width,
        height,
        jitter: Math.min(width, height) * 0.04,
      },
    );
    stateRef.current.frozen = false;
    startTimeRef.current = performance.now();
    lastFrameRef.current = 0;

    cancelLoop();
    rafRef.current = requestAnimationFrame(tick);
  }, [cancelLoop, stateRef, tick]);

  const tryFire = useCallback(() => {
    if (stateRef.current.fired) return;
    const root = rootRef.current;
    if (!root || !isInView(root)) return;
    fire();
  }, [fire, stateRef]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || stateRef.current.fired) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= SCROLL_THRESHOLD
        ) {
          fire();
          observer.disconnect();
        }
      },
      { threshold: [0, SCROLL_THRESHOLD, 0.6, 1] },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [fire, stateRef]);

  useEffect(() => {
    if (stateRef.current.frozen) {
      redraw();
      return;
    }
    tryFire();
  }, [redraw, tryFire]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const onResize = () => {
      if (!stateRef.current.fired) return;
      redraw();
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);

    return () => {
      resizeObserver.disconnect();
      cancelLoop();
    };
  }, [cancelLoop, redraw, stateRef]);

  return (
    <div ref={rootRef} className="confetti-bomb-card" aria-hidden="true">
      <canvas ref={canvasRef} className="confetti-bomb-card__canvas" />
    </div>
  );
}
