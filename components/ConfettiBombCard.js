import { useCallback, useEffect, useRef } from "react";
import {
  createParticles,
  drawParticles,
  stepParticles,
} from "../plugins/confettiBomb";

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
