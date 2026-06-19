import { useEffect, useState } from "react";

export const STORY_PINNED_MIN_WIDTH = 901;

function storyClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getStoryStaticState(beatCount) {
  return {
    activeBeat: Math.max(0, beatCount - 1),
    dotProgress: 1,
    beatFraction: 1,
    isStatic: true,
  };
}

export function useStoryScroll(trackRef, beatCount) {
  const [state, setState] = useState(() => getStoryStaticState(beatCount));

  useEffect(() => {
    const track = trackRef.current;
    if (!track || beatCount < 1) return undefined;

    let rafId = null;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layoutQuery = window.matchMedia(
      `(min-width: ${STORY_PINNED_MIN_WIDTH}px)`,
    );

    const measure = () => {
      const pinned = layoutQuery.matches && !motionQuery.matches;

      if (!pinned) {
        setState(getStoryStaticState(beatCount));
        return;
      }

      const trackTop = track.offsetTop;
      const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
      const progress = storyClamp(
        (window.scrollY - trackTop) / scrollable,
        0,
        1,
      );
      const activeBeat = Math.min(
        beatCount - 1,
        Math.floor(progress * beatCount),
      );
      const dotProgress = beatCount <= 1 ? 0 : activeBeat / (beatCount - 1);
      const beatFraction = storyClamp(progress * beatCount - activeBeat, 0, 1);

      setState({
        activeBeat,
        dotProgress,
        beatFraction,
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
