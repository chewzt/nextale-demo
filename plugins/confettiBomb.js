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

/** Approximate distance traveled before drag settles (tuned to stepParticles). */
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

/**
 * @typedef {"chip" | "ribbon"} ParticleKind
 * @typedef {{
 *   kind: ParticleKind;
 *   x: number;
 *   y: number;
 *   vx: number;
 *   vy: number;
 *   angle: number;
 *   spin: number;
 *   width: number;
 *   height: number;
 *   color: string;
 *   wave: number;
 *   settled: boolean;
 * }} Particle
 */

/**
 * @param {number} count
 * @param {number} originX
 * @param {number} originY
 * @param {string[]} [palette]
 * @param {{ width?: number; height?: number; jitter?: number }} [options]
 * @returns {Particle[]}
 */
export function createParticles(
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

/**
 * Radial burst with drag only — fast → slow → stop, no gravity.
 * @param {Particle[]} particles
 * @param {number} dt - frame multiplier (~1 at 60fps)
 */
export function stepParticles(particles, dt = 1) {
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

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Particle} p
 */
function drawChip(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
  ctx.restore();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Particle} p
 */
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

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Particle[]} particles
 */
export function drawParticles(ctx, particles) {
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  for (const p of particles) {
    if (p.kind === "chip") drawChip(ctx, p);
  }

  for (const p of particles) {
    if (p.kind === "ribbon") drawRibbon(ctx, p);
  }
}

export { DEFAULT_PALETTE };
