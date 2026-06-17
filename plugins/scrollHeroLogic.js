import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const CIRCLE_START = 0.58;
const MIN_DOT_SCALE = 0.018;
const NAV_OFFSET = 72;
const COMMIT_DURATION_MS = 1000;
const TEXT_SCALE_RANGE = 3.2;
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

function lockInteraction() {
  document.body.style.overflow = "hidden";
  document.body.classList.add("is-interaction-locked");
}

function unlockInteraction() {
  document.body.style.overflow = "";
  document.body.classList.remove("is-interaction-locked");
}

function easeOutQuart(value) {
  return 1 - (1 - value) ** 4;
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - (-2 * value + 2) ** 3 / 2;
}

function getAnchorY(section2El) {
  return Math.max(0, section2El.offsetTop - NAV_OFFSET);
}

function getTextScaleFromProgress(progress) {
  const clamped = Math.min(1, Math.max(0, progress));
  return 1 + easeOutQuart(clamped) * TEXT_SCALE_RANGE;
}

export function useScrollHeroTransition(trackRef, section2Ref) {
  const [scale, setScale] = useState(1);
  const [circleScale, setCircleScale] = useState(0);
  const [circleOpacity, setCircleOpacity] = useState(1);
  const [section2Opacity, setSection2Opacity] = useState(0);
  const [section2Shift, setSection2Shift] = useState(28);
  const [phase, setPhase] = useState("idle");
  const [heroCollapsed, setHeroCollapsed] = useState(false);

  const doneRef = useRef(false);
  const committingRef = useRef(false);
  const autoCommitStartedRef = useRef(false);
  const rafRef = useRef(null);
  const commitRafRef = useRef(null);
  const circleAtCommitRef = useRef(0);
  const progressAtCommitRef = useRef(0);
  const backgroundSwappedRef = useRef(false);

  const EXPAND_RATIO = 0.55;

  const finishCommit = useCallback(() => {
    const section2 = section2Ref.current;
    if (section2) {
      window.scrollTo({ top: getAnchorY(section2), behavior: "auto" });
    }

    unlockInteraction();
    setCircleScale(0);
    setCircleOpacity(0);
    setSection2Opacity(1);
    setSection2Shift(0);
    doneRef.current = true;
    setPhase("done");
    committingRef.current = false;
    autoCommitStartedRef.current = false;
  }, [section2Ref]);

  const runAutoCommit = useCallback(() => {
    const section2 = section2Ref.current;
    const track = trackRef.current;
    if (!section2 || !track || autoCommitStartedRef.current) return;

    autoCommitStartedRef.current = true;
    committingRef.current = true;
    backgroundSwappedRef.current = false;
    lockInteraction();

    const startScale = Math.max(circleAtCommitRef.current, MIN_DOT_SCALE);

    flushSync(() => {
      setPhase("committing");
      setCircleScale(startScale);
      setCircleOpacity(1);
      setSection2Opacity(0);
      setSection2Shift(24);
    });

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const raw = Math.min(1, elapsed / COMMIT_DURATION_MS);
      const animProgress = easeInOutCubic(raw);
      const virtualProgress =
        progressAtCommitRef.current +
        (1 - progressAtCommitRef.current) * animProgress;

      setScale(getTextScaleFromProgress(virtualProgress));

      if (!backgroundSwappedRef.current) {
        const expandProgress = Math.min(1, raw / EXPAND_RATIO);
        const expandT = easeInOutCubic(expandProgress);

        setCircleScale(startScale + (1 - startScale) * expandT);
        setCircleOpacity(1);
        setSection2Opacity(0);
        setSection2Shift(24);

        if (expandProgress >= 1) {
          backgroundSwappedRef.current = true;
          flushSync(() => {
            setHeroCollapsed(true);
            setCircleScale(1);
            setCircleOpacity(1);
          });
          window.scrollTo({
            top: getAnchorY(section2),
            behavior: "auto",
          });
        }
      } else {
        const revealRaw = (raw - EXPAND_RATIO) / (1 - EXPAND_RATIO);
        const revealT = easeInOutCubic(Math.min(1, Math.max(0, revealRaw)));

        setCircleScale(1);
        setCircleOpacity(1 - revealT);
        setSection2Opacity(revealT);
        setSection2Shift(24 * (1 - revealT));
      }

      if (raw < 1) {
        commitRafRef.current = requestAnimationFrame(tick);
        return;
      }

      finishCommit();
    };

    commitRafRef.current = requestAnimationFrame(tick);
  }, [section2Ref, trackRef, finishCommit]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => {
      if (doneRef.current || committingRef.current) return;

      const trackTop = track.offsetTop;
      const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
      const raw = (window.scrollY - trackTop) / scrollable;
      const progress = Math.min(1, Math.max(0, raw));

      setScale(getTextScaleFromProgress(progress));
      setPhase(progress > 0.02 ? "active" : "idle");

      const circleRaw =
        progress <= CIRCLE_START
          ? 0
          : (progress - CIRCLE_START) / (1 - CIRCLE_START);

      if (circleRaw > 0) {
        const circleEased = easeInOutCubic(circleRaw);
        circleAtCommitRef.current = circleEased;
        progressAtCommitRef.current = progress;
        runAutoCommit();
        return;
      }

      setCircleScale(0);
      setCircleOpacity(1);
      setSection2Opacity(0);
      setSection2Shift(28);
    };

    const onScroll = () => {
      if (committingRef.current || doneRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    const blockScrollDuringCommit = (event) => {
      if (!committingRef.current) return;
      event.preventDefault();
    };

    const blockKeysDuringCommit = (event) => {
      if (!committingRef.current) return;
      if (SCROLL_KEYS.has(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", blockScrollDuringCommit, { passive: false });
    window.addEventListener("touchmove", blockScrollDuringCommit, { passive: false });
    window.addEventListener("keydown", blockKeysDuringCommit);
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", blockScrollDuringCommit);
      window.removeEventListener("touchmove", blockScrollDuringCommit);
      window.removeEventListener("keydown", blockKeysDuringCommit);
      unlockInteraction();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (commitRafRef.current) cancelAnimationFrame(commitRafRef.current);
    };
  }, [trackRef, runAutoCommit]);

  useEffect(() => {
    if (phase !== "done") return undefined;

    const section2 = section2Ref.current;
    if (!section2) return undefined;

    const onScrollLock = () => {
      const anchorY = getAnchorY(section2);
      if (window.scrollY < anchorY) {
        window.scrollTo({ top: anchorY, behavior: "auto" });
      }
    };

    window.addEventListener("scroll", onScrollLock, { passive: true });
    onScrollLock();

    return () => window.removeEventListener("scroll", onScrollLock);
  }, [phase, section2Ref]);

  const showCircle =
    (circleScale > 0.001 && !heroCollapsed) || phase === "committing";

  return {
    scale,
    circleScale,
    circleOpacity,
    section2Opacity,
    section2Shift,
    showCircle,
    phase,
    heroCollapsed,
    isCommitting: phase === "committing",
  };
}
