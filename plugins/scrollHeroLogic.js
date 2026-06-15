import { useCallback, useEffect, useRef, useState } from "react";

const CIRCLE_START = 0.58;
const COMMIT_TRIGGER = 0.7;
const NAV_OFFSET = 72;
const PULL_MAX = 120;
const SPRING_MS = 420;
const PULL_ZONE_BELOW = 200;
const COMMIT_DURATION_MS = 1000;

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

export function useScrollHeroTransition(trackRef, section2Ref) {
  const [scale, setScale] = useState(1);
  const [circleScale, setCircleScale] = useState(0);
  const [circleOpacity, setCircleOpacity] = useState(1);
  const [section2Opacity, setSection2Opacity] = useState(0);
  const [section2Shift, setSection2Shift] = useState(28);
  const [phase, setPhase] = useState("idle");
  const [pullY, setPullY] = useState(0);
  const [isSpringing, setIsSpringing] = useState(false);
  const [heroCollapsed, setHeroCollapsed] = useState(false);

  const doneRef = useRef(false);
  const committingRef = useRef(false);
  const autoCommitStartedRef = useRef(false);
  const pullRef = useRef(0);
  const pullingRef = useRef(false);
  const rafRef = useRef(null);
  const commitRafRef = useRef(null);
  const circleAtCommitRef = useRef(0);

  const springBack = useCallback(() => {
    const section2 = section2Ref.current;
    if (!section2 || pullRef.current <= 0) return;

    setIsSpringing(true);
    pullRef.current = 0;
    setPullY(0);
    window.scrollTo({ top: getAnchorY(section2), behavior: "auto" });

    window.setTimeout(() => setIsSpringing(false), SPRING_MS);
  }, [section2Ref]);

  const finishCommit = useCallback(() => {
    const section2 = section2Ref.current;
    if (section2) {
      window.scrollTo({ top: getAnchorY(section2), behavior: "auto" });
    }

    document.body.style.overflow = "";
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
    setPhase("committing");
    document.body.style.overflow = "hidden";

    setHeroCollapsed(true);
    setSection2Opacity(0);
    setSection2Shift(24);

    const startScale = circleAtCommitRef.current;

    const startAnimation = () => {
      const anchorY = getAnchorY(section2);
      window.scrollTo({ top: anchorY, behavior: "auto" });

      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const raw = Math.min(1, elapsed / COMMIT_DURATION_MS);
        const t = easeInOutCubic(raw);

        setCircleScale(startScale + (1 - startScale) * Math.min(1, t * 1.4));

        if (t < 0.55) {
          setCircleOpacity(1);
          setSection2Opacity(0);
          setSection2Shift(24);
        } else {
          const fade = (t - 0.55) / 0.45;
          const easedFade = easeInOutCubic(fade);
          setCircleOpacity(1 - easedFade);
          setSection2Opacity(easedFade);
          setSection2Shift(24 * (1 - easedFade));
        }

        if (raw < 1) {
          commitRafRef.current = requestAnimationFrame(tick);
          return;
        }

        finishCommit();
      };

      commitRafRef.current = requestAnimationFrame(tick);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(startAnimation);
    });
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
      const textEased = easeOutQuart(progress);

      setScale(1 + textEased * 3.2);
      setPhase(progress > 0.02 ? "active" : "idle");

      const circleRaw =
        progress <= CIRCLE_START
          ? 0
          : (progress - CIRCLE_START) / (1 - CIRCLE_START);
      const circleEased = easeInOutCubic(circleRaw);

      setCircleScale(circleEased);
      setCircleOpacity(1);
      setSection2Opacity(0);
      setSection2Shift(28);
      circleAtCommitRef.current = circleEased;

      if (circleEased >= COMMIT_TRIGGER) {
        runAutoCommit();
      }
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", blockScrollDuringCommit, { passive: false });
    window.addEventListener("touchmove", blockScrollDuringCommit, { passive: false });
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", blockScrollDuringCommit);
      window.removeEventListener("touchmove", blockScrollDuringCommit);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (commitRafRef.current) cancelAnimationFrame(commitRafRef.current);
    };
  }, [trackRef, runAutoCommit]);

  useEffect(() => {
    if (phase !== "done") return undefined;

    const section2 = section2Ref.current;
    if (!section2) return undefined;

    const getAnchor = () => getAnchorY(section2);

    const isInPullZone = () => {
      const anchorY = getAnchor();
      const y = window.scrollY;
      return y >= anchorY - 2 && y <= anchorY + PULL_ZONE_BELOW;
    };

    const onScrollLock = () => {
      if (pullingRef.current || pullRef.current > 0) return;

      const anchorY = getAnchor();
      if (window.scrollY < anchorY) {
        window.scrollTo({ top: anchorY, behavior: "auto" });
      }
    };

    const onWheel = (event) => {
      if (!isInPullZone()) {
        if (pullRef.current > 0) springBack();
        return;
      }

      if (event.deltaY < 0) {
        event.preventDefault();
        pullingRef.current = true;
        setIsSpringing(false);
        const next = Math.min(
          PULL_MAX,
          pullRef.current + Math.min(28, Math.abs(event.deltaY) * 0.22)
        );
        pullRef.current = next;
        setPullY(next);
        return;
      }

      if (pullRef.current > 0) {
        pullingRef.current = false;
        springBack();
      }
    };

    let touchStartY = 0;
    let touchActive = false;

    const onTouchStart = (event) => {
      if (!isInPullZone()) return;
      touchStartY = event.touches[0].clientY;
      touchActive = true;
      pullingRef.current = true;
      setIsSpringing(false);
    };

    const onTouchMove = (event) => {
      if (!touchActive) return;

      if (!isInPullZone() && pullRef.current === 0) {
        touchActive = false;
        return;
      }

      const delta = event.touches[0].clientY - touchStartY;
      if (delta > 0) {
        event.preventDefault();
        const next = Math.min(PULL_MAX, delta * 0.52);
        pullRef.current = next;
        setPullY(next);
      } else if (pullRef.current > 0 && delta < -4) {
        pullingRef.current = false;
        touchActive = false;
        springBack();
      }
    };

    const onTouchEnd = () => {
      touchActive = false;
      pullingRef.current = false;
      if (pullRef.current > 0) {
        springBack();
      }
    };

    window.addEventListener("scroll", onScrollLock, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    onScrollLock();

    return () => {
      window.removeEventListener("scroll", onScrollLock);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [phase, section2Ref, springBack]);

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
    pullY,
    isSpringing,
    isCommitting: phase === "committing",
  };
}
