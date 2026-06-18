import { useEffect, useState } from "react";

const PINNED_MIN_WIDTH = 901;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getStaticState(beatCount) {
  return {
    activeBeat: Math.max(0, beatCount - 1),
    dotProgress: 1,
    isStatic: true,
  };
}

export function useStoryScroll(trackRef, beatCount) {
  const [state, setState] = useState(() => getStaticState(beatCount));

  useEffect(() => {
    const track = trackRef.current;
    if (!track || beatCount < 1) return undefined;

    let rafId = null;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layoutQuery = window.matchMedia(`(min-width: ${PINNED_MIN_WIDTH}px)`);

    const measure = () => {
      const pinned = layoutQuery.matches && !motionQuery.matches;

      if (!pinned) {
        setState(getStaticState(beatCount));
        return;
      }

      const trackTop = track.offsetTop;
      const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
      const progress = clamp((window.scrollY - trackTop) / scrollable, 0, 1);
      const activeBeat = Math.min(
        beatCount - 1,
        Math.floor(progress * beatCount),
      );
      const dotProgress = beatCount <= 1 ? 0 : activeBeat / (beatCount - 1);

      setState({
        activeBeat,
        dotProgress,
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
  }, [trackRef, beatCount]);

  return state;
}
