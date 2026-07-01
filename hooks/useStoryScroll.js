import { useEffect, useRef, useState } from "react";

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

function getArticleStaticState(beatCount = 0) {
  return {
    dotProgress: 1,
    contentOffset: 0,
    activeBeat: Math.max(0, beatCount - 1),
    isStatic: true,
  };
}

function measureTrackProgress(track) {
  const trackTop = track.offsetTop;
  const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
  return storyClamp((window.scrollY - trackTop) / scrollable, 0, 1);
}

function measureActiveBeatFromTitles(viewport, titleRefs, threshold) {
  const titles = titleRefs?.current;
  if (!viewport || !titles?.length) return 0;

  const viewportRect = viewport.getBoundingClientRect();
  const thresholdY = viewportRect.top + viewportRect.height * threshold;

  let activeBeat = 0;
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    if (!title) continue;
    if (title.getBoundingClientRect().top <= thresholdY) {
      activeBeat = i;
    }
  }
  return activeBeat;
}

function useStoryTrackListeners(
  trackRef,
  onMeasureRef,
  contentRef = null,
  viewportRef = null,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let rafId = null;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layoutQuery = window.matchMedia(
      `(min-width: ${STORY_PINNED_MIN_WIDTH}px)`,
    );

    const runMeasure = () => {
      onMeasureRef.current(track, layoutQuery, motionQuery);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(runMeasure);
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(runMeasure)
        : null;

    if (resizeObserver) {
      resizeObserver.observe(track);
      if (contentRef?.current) resizeObserver.observe(contentRef.current);
      if (viewportRef?.current) resizeObserver.observe(viewportRef.current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", runMeasure);
    motionQuery.addEventListener("change", runMeasure);
    layoutQuery.addEventListener("change", runMeasure);
    runMeasure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", runMeasure);
      motionQuery.removeEventListener("change", runMeasure);
      layoutQuery.removeEventListener("change", runMeasure);
      resizeObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [trackRef, onMeasureRef, contentRef, viewportRef]);
}

export function useStoryScroll(trackRef, beatCount) {
  const [state, setState] = useState(() => getStoryStaticState(beatCount));
  const onMeasureRef = useRef(null);

  onMeasureRef.current = (track, layoutQuery, motionQuery) => {
    const pinned = layoutQuery.matches && !motionQuery.matches;

    if (!pinned || beatCount < 1) {
      setState(getStoryStaticState(beatCount));
      return;
    }

    const progress = measureTrackProgress(track);
    const activeBeat = Math.min(
      beatCount - 1,
      Math.floor(progress * beatCount),
    );
    const beatFraction = storyClamp(progress * beatCount - activeBeat, 0, 1);

    setState({
      activeBeat,
      dotProgress: progress,
      beatFraction,
      isStatic: false,
    });
  };

  useStoryTrackListeners(trackRef, onMeasureRef);

  return state;
}

export function useStoryArticleScroll(
  trackRef,
  contentRef,
  viewportRef,
  options = {},
) {
  const {
    titleRefs = null,
    activeThreshold = 0.75,
    beatCount = 0,
  } = options;
  const [state, setState] = useState(() => getArticleStaticState(beatCount));
  const onMeasureRef = useRef(null);

  onMeasureRef.current = (track, layoutQuery, motionQuery) => {
    const pinned = layoutQuery.matches && !motionQuery.matches;

    if (!pinned) {
      track.style.height = "";
      setState(getArticleStaticState(beatCount));
      return;
    }

    const content = contentRef.current;
    const viewport = viewportRef.current;
    if (!content || !viewport) return;

    const contentHeight = content.scrollHeight;
    const viewportHeight = viewport.clientHeight;
    const maxScroll = Math.max(contentHeight - viewportHeight, 0);
    const trackHeight = window.innerHeight + maxScroll;

    track.style.height = `${trackHeight}px`;

    const progress = measureTrackProgress(track);
    const activeBeat = titleRefs
      ? measureActiveBeatFromTitles(viewport, titleRefs, activeThreshold)
      : 0;

    setState({
      dotProgress: progress,
      contentOffset: progress * maxScroll,
      activeBeat,
      isStatic: false,
    });
  };

  useStoryTrackListeners(trackRef, onMeasureRef, contentRef, viewportRef);

  return state;
}
