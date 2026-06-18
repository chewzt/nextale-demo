import { useEffect, useState } from "react";

const BEAT_COUNT = 4;
const PINNED_MIN_WIDTH = 901;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getActiveStep(progress, itemCount) {
  const beatSize = 1 / BEAT_COUNT;
  if (progress >= (BEAT_COUNT - 1) * beatSize) {
    return itemCount;
  }
  return Math.min(itemCount - 1, Math.floor(progress / beatSize));
}

function getStaticStyles(itemCount) {
  return {
    lineFill: 1,
    activeStep: itemCount,
    isStatic: true,
  };
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isPinnedLayout() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(min-width: ${PINNED_MIN_WIDTH}px)`).matches;
}

export function useAudienceTimeline(trackRef, itemCount) {
  const [state, setState] = useState(() => getStaticStyles(itemCount));

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let rafId = null;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layoutQuery = window.matchMedia(`(min-width: ${PINNED_MIN_WIDTH}px)`);

    const measure = () => {
      if (!isPinnedLayout() || prefersReducedMotion()) {
        setState(getStaticStyles(itemCount));
        return;
      }

      const trackTop = track.offsetTop;
      const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
      const progress = clamp(
        (window.scrollY - trackTop) / scrollable,
        0,
        1,
      );

      setState({
        lineFill: progress,
        activeStep: getActiveStep(progress, itemCount),
        isStatic: false,
      });
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    const onPreferenceChange = () => measure();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure())
        : null;

    if (resizeObserver) {
      resizeObserver.observe(track);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onPreferenceChange);
    motionQuery.addEventListener("change", onPreferenceChange);
    layoutQuery.addEventListener("change", onPreferenceChange);
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onPreferenceChange);
      motionQuery.removeEventListener("change", onPreferenceChange);
      layoutQuery.removeEventListener("change", onPreferenceChange);
      resizeObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [trackRef, itemCount]);

  return state;
}
