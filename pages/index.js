import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import desktopVideo from "../assets/landing-desktop-video.mp4";
import mobileVideo from "../assets/landing-mobile-video.mp4";
import logo170885 from "../assets/logolist/170885-1694172115.png";
import logoCkHome from "../assets/logolist/ckhome-2.jpg";
import logoRsvpClub from "../assets/logolist/cropped-RSVP-Club-Logo-2.png";
import logoHengjiKopitiam from "../assets/logolist/hengjikopitiam-1.jpg";
import logoHitotsu from "../assets/logolist/hitotsu-1.png";
import logoAhma from "../assets/logolist/logo_ahma.png";
import logoThongKee from "../assets/logolist/thongkeelogo-1-1.png";
import logoJoyChickenRice from "../assets/logolist/喜悦chickenrice-PhotoRoom-1.png-PhotoRoom-1.png";
import brandSchemeBg from "../assets/services/brand-identity/brandscheme2.png";
import technologyBg from "../assets/technology/technology-bg.png";
import techLogoCursor from "../assets/technology/logolist/cursor.png";
import techLogoDart from "../assets/technology/logolist/dart.png";
import techLogoDocker from "../assets/technology/logolist/docker.png";
import techLogoFirebase from "../assets/technology/logolist/firebase.png";
import techLogoGithub from "../assets/technology/logolist/github.png";
import techLogoJavascript from "../assets/technology/logolist/javascript.png";
import techLogoLaravel from "../assets/technology/logolist/laravel.png";
import techLogoPhp from "../assets/technology/logolist/php.png";
import techLogoPython from "../assets/technology/logolist/python.png";
import techLogoVscode from "../assets/technology/logolist/vscode.png";
import techLogoVue from "../assets/technology/logolist/vue.png";
import socialFacebookIcon from "../assets/services/socialmedia/facebook.svg";
import socialPhonePortrait from "../assets/services/socialmedia/social-phone-portrait.png";
import socialXiaohongshuIcon from "../assets/services/socialmedia/xiaohongshu.svg";
import socialYoutubeIcon from "../assets/services/socialmedia/youtube.svg";
import ConfettiBombCard from "@/components/ConfettiBombCard";
import GeoChunk from "@/components/seo/GeoChunk";
import JsonLd from "@/components/seo/JsonLd";
import { FAQ } from "@/lib/seo/content";
import { HOME_META } from "@/lib/seo/metadata";
import PageHead from "@/components/seo/PageHead";
import { buildAgencySchemas } from "@/lib/seo/schemas";
import { useStoryArticleScroll } from "@/hooks/useStoryScroll";

/* ─── Hero scroll transition ─────────────────────────────────── */

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

function useScrollHeroTransition(trackRef, section2Ref) {
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

/* ─── Service icons ──────────────────────────────────────────── */

const ICON_STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function ServiceIcon({ type }) {
  switch (type) {
    case "brand":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...ICON_STROKE} d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
          <path {...ICON_STROKE} d="m4 7 8 4 8-4M12 11v10" />
        </svg>
      );
    case "social":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...ICON_STROKE} cx="7" cy="12" r="3" />
          <circle {...ICON_STROKE} cx="17" cy="7" r="3" />
          <circle {...ICON_STROKE} cx="17" cy="17" r="3" />
          <path {...ICON_STROKE} d="M9.8 10.6 14.4 8.4M9.8 13.4l4.6 2.2" />
        </svg>
      );
    case "video":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...ICON_STROKE} x="3" y="6" width="14" height="12" rx="1.5" />
          <path {...ICON_STROKE} d="m17 10 4-2v8l-4-2" />
        </svg>
      );
    case "photo":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            {...ICON_STROKE}
            d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
          />
          <circle {...ICON_STROKE} cx="9" cy="10" r="1.5" />
          <path {...ICON_STROKE} d="m4 16 4.5-4.5L14 17l2.5-2.5L20 17" />
        </svg>
      );
    case "ui":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...ICON_STROKE} x="4" y="4" width="16" height="16" rx="2" />
          <path {...ICON_STROKE} d="M4 9h16M9 9v11" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...ICON_STROKE} x="3" y="5" width="18" height="14" rx="2" />
          <path {...ICON_STROKE} d="M3 9h18M7 13h4M7 16h6" />
        </svg>
      );
    case "mobile":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...ICON_STROKE} x="7" y="3" width="10" height="18" rx="2" />
          <path {...ICON_STROKE} d="M10 18h4" />
        </svg>
      );
    case "system":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...ICON_STROKE} x="4" y="4" width="7" height="7" rx="1" />
          <rect {...ICON_STROKE} x="13" y="4" width="7" height="7" rx="1" />
          <rect {...ICON_STROKE} x="4" y="13" width="7" height="7" rx="1" />
          <rect {...ICON_STROKE} x="13" y="13" width="7" height="7" rx="1" />
        </svg>
      );
    case "automation":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...ICON_STROKE} cx="6" cy="12" r="2.5" />
          <circle {...ICON_STROKE} cx="18" cy="6" r="2.5" />
          <circle {...ICON_STROKE} cx="18" cy="18" r="2.5" />
          <path {...ICON_STROKE} d="M8.4 11.2 15.2 7.2M8.4 12.8l6.8 4" />
        </svg>
      );
    default:
      return null;
  }
}

const BENTO_CHILD_SLOTS = ["child-a", "child-b", "child-c", "child-d"];

const DISCIPLINE_ORDER = ["creative", "technology"];

const BENTO_SWAP_EASE = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };

const BENTO_ANCHOR_SWAP = { duration: 0.2 };

const SOCIAL_INSTAGRAM_GRADIENT =
  "135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%";

const SOCIAL_PHONE_FLOATS = [
  {
    id: "youtube",
    src: socialYoutubeIcon,
    top: "-12%",
    right: "-8%",
    placement: "corner",
  },
  {
    id: "facebook",
    src: socialFacebookIcon,
    top: "25%",
    left: "-8%",
    placement: "left-edge",
  },
  {
    id: "xiaohongshu",
    src: socialXiaohongshuIcon,
    top: "75%",
    right: "-8%",
    placement: "right-edge",
  },
];

const TECH_LOGO_TILES = [
  { id: "cursor", src: techLogoCursor, alt: "Cursor", top: "3%", left: "2%", width: "4rem", rotate: -11, z: 2, dark: true },
  { id: "vue", src: techLogoVue, alt: "Vue", top: "9%", left: "33%", width: "4.35rem", rotate: 6, z: 4 },
  { id: "github", src: techLogoGithub, alt: "GitHub", top: "1%", right: "2%", width: "3.9rem", rotate: 14, z: 2 },
  { id: "php", src: techLogoPhp, alt: "PHP", top: "20%", left: "11%", width: "4.1rem", rotate: -8, z: 3, hideOnMobile: true },
  { id: "javascript", src: techLogoJavascript, alt: "JavaScript", top: "13%", left: "51%", width: "4.5rem", z: 5, variant: "js" },
  { id: "docker", src: techLogoDocker, alt: "Docker", top: "23%", right: "9%", width: "3.85rem", rotate: -13, z: 3, hideOnMobile: true },
  { id: "python", src: techLogoPython, alt: "Python", top: "32%", left: "5%", width: "4.2rem", rotate: 9, z: 2 },
  { id: "laravel", src: techLogoLaravel, alt: "Laravel", top: "27%", left: "39%", width: "3.95rem", rotate: -5, z: 4, hideOnMobile: true },
  { id: "firebase", src: techLogoFirebase, alt: "Firebase", top: "34%", right: "4%", width: "4.05rem", rotate: 11, z: 3, dark: true },
  { id: "dart", src: techLogoDart, alt: "Dart", top: "42%", left: "19%", width: "3.8rem", rotate: -9, z: 2 },
  { id: "vscode", src: techLogoVscode, alt: "VS Code", top: "37%", left: "59%", width: "4.25rem", rotate: 7, z: 4 },
];

function SocialPhoneMockup() {
  return (
    <div className="home-bento__social-phone" aria-hidden="true">
      <div className="home-bento__social-phone-device">
        <img
          src={socialPhonePortrait.src}
          alt=""
          width={socialPhonePortrait.width}
          height={socialPhonePortrait.height}
          className="home-bento__social-phone-image"
        />
        {SOCIAL_PHONE_FLOATS.map((item) => (
          <div
            key={item.id}
            className={[
              "home-bento__social-phone-float",
              `home-bento__social-phone-float--${item.id}`,
              item.placement === "corner"
                ? "home-bento__social-phone-float--corner"
                : `home-bento__social-phone-float--${item.placement}`,
            ].join(" ")}
            style={{
              top: item.top,
              ...(item.right ? { right: item.right } : {}),
              ...(item.left ? { left: item.left } : {}),
            }}
          >
            <img
              src={item.src}
              alt=""
              className={[
                "home-bento__social-phone-float-icon",
                `home-bento__social-phone-float-icon--${item.id}`,
              ].join(" ")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialBentoDeco() {
  return (
    <>
      <div
        className="home-bento__social-bg"
        style={{ "--social-gradient": SOCIAL_INSTAGRAM_GRADIENT }}
      />
      <SocialPhoneMockup />
    </>
  );
}

function TechnologyBentoDeco() {
  return (
    <div className="home-bento__technology-deco" aria-hidden="true">
      <div
        className="home-bento__technology-bg"
        style={{ backgroundImage: `url(${technologyBg.src})` }}
      />
      <div className="home-bento__technology-logos">
        {TECH_LOGO_TILES.map((tile, index) => {
          const floatVariant = ["a", "b", "c"][index % 3];

          return (
          <div
            key={tile.id}
            className={[
              "home-bento__technology-logo-card",
              `home-bento__technology-logo-card--float-${floatVariant}`,
              tile.dark ? "home-bento__technology-logo-card--dark" : "",
              tile.variant === "js"
                ? "home-bento__technology-logo-card--js"
                : "",
              tile.hideOnMobile
                ? "home-bento__technology-logo-card--mobile-hidden"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              top: tile.top,
              left: tile.left,
              right: tile.right,
              width: tile.width,
              zIndex: tile.z,
              "--tile-rotate": `${tile.rotate ?? 0}deg`,
              animationDelay: `${-(index * 0.55)}s`,
            }}
          >
            <img
              src={tile.src.src}
              alt=""
              width={tile.src.width}
              height={tile.src.height}
            />
          </div>
          );
        })}
      </div>
    </div>
  );
}

function ChevronIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="home-bento__nav-icon">
      {direction === "prev" ? (
        <path
          d="M14.5 6.5 9 12l5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 6.5 15 12l-5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function ServicesChildCard({ service, slot, accent, index }) {
  const reduceMotion = useReducedMotion();
  const isSocial = service.icon === "social";
  const isBrand = service.icon === "brand";
  const className = [
    "home-bento__cell",
    "home-bento__child",
    `home-bento__child--${slot}`,
    isSocial ? "home-bento__child--social" : "",
    isBrand ? "home-bento__child--brand" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = isSocial ? (
    <>
      <SocialBentoDeco />
      <div className="home-bento__child-copy home-bento__child-copy--on-gradient">
        <h4 className="home-bento__child-title">{service.title}</h4>
        <p className="home-bento__child-body">{service.body}</p>
      </div>
    </>
  ) : isBrand ? (
    <>
      <div
        className="home-bento__brand-bg"
        style={{ backgroundImage: `url(${brandSchemeBg.src})` }}
        aria-hidden="true"
      />
      <div className="home-bento__child-copy">
        <h4 className="home-bento__child-title">{service.title}</h4>
        <p className="home-bento__child-body">{service.body}</p>
      </div>
    </>
  ) : (
    <>
      <span
        className="home-bento__child-icon"
        style={{ "--bento-accent": accent }}
        aria-hidden="true"
      >
        <ServiceIcon type={service.icon} />
      </span>
      <div className="home-bento__child-copy">
        <h4 className="home-bento__child-title">{service.title}</h4>
        <p className="home-bento__child-body">{service.body}</p>
      </div>
    </>
  );

  if (reduceMotion) {
    return <article className={className}>{content}</article>;
  }

  return (
    <motion.article
      className={className}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ ...BENTO_SWAP_EASE, delay: index * 0.04 }}
    >
      {content}
    </motion.article>
  );
}

function ServicesAnchorCard({
  discipline,
  inactiveDiscipline,
  onPrev,
  onNext,
  creativeConfettiStateRef,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <article
      className={[
        "home-bento__cell",
        "home-bento__anchor",
        `home-bento__anchor--${discipline.id}`,
      ].join(" ")}
      style={{ "--bento-accent": discipline.accent }}
    >
      {discipline.id === "technology" ? <TechnologyBentoDeco /> : null}

      {reduceMotion ? (
        <>
          {discipline.id === "creative" ? (
            <ConfettiBombCard stateRef={creativeConfettiStateRef} />
          ) : null}
          <div className="home-bento__anchor-copy">
            <h3 className="home-bento__anchor-title">{discipline.name}</h3>
            {discipline.descriptor ? (
              <p className="home-bento__anchor-descriptor">{discipline.descriptor}</p>
            ) : null}
          </div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={discipline.id}
            className="home-bento__anchor-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={BENTO_ANCHOR_SWAP}
          >
            {discipline.id === "creative" ? (
              <ConfettiBombCard stateRef={creativeConfettiStateRef} />
            ) : null}
            <div className="home-bento__anchor-copy">
              <h3 className="home-bento__anchor-title">{discipline.name}</h3>
              {discipline.descriptor ? (
                <p className="home-bento__anchor-descriptor">
                  {discipline.descriptor}
                </p>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="home-bento__nav" aria-label="Discipline navigation">
        <button
          type="button"
          className="home-bento__nav-btn"
          onClick={onPrev}
          aria-label={`Previous: ${inactiveDiscipline.name}`}
        >
          <ChevronIcon direction="prev" />
        </button>
        <button
          type="button"
          className="home-bento__nav-btn"
          onClick={onNext}
          aria-label={`Next: ${inactiveDiscipline.name}`}
        >
          <ChevronIcon direction="next" />
        </button>
      </div>
    </article>
  );
}

function ServicesBentoGrid({
  activeDiscipline,
  categories,
  onPrev,
  onNext,
  creativeConfettiStateRef,
}) {
  const discipline = DISCIPLINE_BY_ID[activeDiscipline];
  const inactiveDiscipline = categories.find(
    (item) => item.id !== activeDiscipline,
  );
  const services = discipline?.services ?? [];

  if (!discipline || !inactiveDiscipline) {
    return null;
  }

  return (
    <div className="home-bento__grid" aria-label="Creative and technology services">
      <ServicesAnchorCard
        discipline={discipline}
        inactiveDiscipline={inactiveDiscipline}
        onPrev={onPrev}
        onNext={onNext}
        creativeConfettiStateRef={creativeConfettiStateRef}
      />

      <AnimatePresence mode="popLayout">
        {services.map((service, index) => (
          <ServicesChildCard
            key={`${activeDiscipline}-${service.icon}`}
            service={service}
            slot={BENTO_CHILD_SLOTS[index]}
            accent={discipline.accent}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page data ──────────────────────────────────────────────── */

const STORY_BEATS = [
  {
    id: "welcome",
    content: (
      <>
        Welcome to <strong>Nextale</strong>. If you&apos;re here, you&apos;ve
        probably seen our work on social or through{" "}
        <Link href="/work" className="home-story__inline-link">
          content
        </Link>{" "}
        we&apos;ve made for brands like yours. Either way — you&apos;re likely
        looking for a creative partner to help transform your brand&apos;s
        online presence. Luckily, that&apos;s us.
      </>
    ),
  },
  {
    id: "lead",
    content: (
      <>
        If you&apos;re here, you might find yourself in one of these
        situations:
      </>
    ),
  },
  {
    id: "item-1",
    num: "1",
    content:
      "Seeking a fresh and compelling social media brand identity — one that finally feels like yours online.",
  },
  {
    id: "item-2",
    num: "2",
    content:
      "Looking for innovative content ideas and consistent creation that keeps up with the feed.",
  },
  {
    id: "item-3",
    num: "3",
    content:
      "Wanting to delegate social media management, content creation, or video production to a team you can trust, so you can focus on what you do best.",
  },
  {
    id: "closing",
    content: (
      <>
        If any of that rings a bell, shoot us a{" "}
        <Link href="/contact" className="home-story__inline-link">
          message
        </Link>{" "}
        and let&apos;s explore how we might be able to help!
      </>
    ),
  },
  {
    id: "about",
    content: (
      <>
        At <strong>Nextale</strong>, we don&apos;t throw around corporate jargon
        that everyone says but nobody does. We&apos;re about making work
        we&apos;re proud of — from paper to pixel.
      </>
    ),
  },
];

const CAPABILITIES_DISCIPLINES = [
  {
    id: "creative",
    name: "Creative",
    accent: "#1b3fd8",
    descriptor: "Brand, content, and visual storytelling.",
    services: [
      {
        icon: "brand",
        title: "Brand & Identity",
        body: "Logos, naming, and visual systems that help SMEs look established from day one.",
      },
      {
        icon: "social",
        title: "Social Media Marketing",
        body: "Content and always-on campaigns that build a genuine, engaged following.",
      },
      {
        icon: "video",
        title: "Video Production",
        body: "Brand films, ads, and social video — shot, directed, and edited in-house.",
      },
      {
        icon: "photo",
        title: "Product Photography",
        body: "Studio-quality product and lifestyle imagery built to sell.",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    accent: "#0071e3",
    descriptor: "Websites, apps, and systems that scale.",
    services: [
      {
        icon: "web",
        title: "Web Development",
        body: "Fast, scalable websites and storefronts built to last.",
      },
      {
        icon: "mobile",
        title: "Mobile Apps",
        body: "iOS and Android apps from prototype through App Store launch.",
      },
      {
        icon: "system",
        title: "System Development",
        body: "Custom platforms that replace spreadsheets and manual workflows.",
      },
      {
        icon: "automation",
        title: "Automation & APIs",
        body: "Connect your stack and automate the busywork behind the scenes.",
      },
    ],
  },
];

const SERVICE_CATEGORIES = CAPABILITIES_DISCIPLINES;

const DISCIPLINE_BY_ID = Object.fromEntries(
  SERVICE_CATEGORIES.map((discipline) => [discipline.id, discipline]),
);

const CORPORATE_LOGOS = [
  { id: "hengji-kopitiam", image: logoHengjiKopitiam, alt: "Hengji Kopitiam" },
  { id: "rsvp-club", image: logoRsvpClub, alt: "RSVP Club" },
  { id: "hitotsu", image: logoHitotsu, alt: "Hitotsu" },
  { id: "thong-kee", image: logoThongKee, alt: "Thong Kee" },
  { id: "ahma", image: logoAhma, alt: "Ahma" },
  { id: "joy-chicken-rice", image: logoJoyChickenRice, alt: "喜悦 Chicken Rice" },
  { id: "ck-home", image: logoCkHome, alt: "CK Home" },
  { id: "partner-170885", image: logo170885, alt: "Partner brand logo" },
];

function CorporateLogoItems({ logos, keyPrefix = "" }) {
  return logos.map((logo) => (
    <li key={`${keyPrefix}${logo.id}`} className="home-capabilities__logo-slot">
      <img
        src={logo.image.src}
        alt={logo.alt}
        width={logo.image.width}
        height={logo.image.height}
        className="home-capabilities__logo"
        loading="lazy"
        decoding="async"
      />
    </li>
  ));
}

export default function HomePage() {
  const trackRef = useRef(null);
  const section2Ref = useRef(null);
  const storyTrackRef = useRef(null);
  const storySlidesViewportRef = useRef(null);
  const storySlidesContentRef = useRef(null);
  const creativeConfettiStateRef = useRef({
    fired: false,
    frozen: false,
    particles: [],
  });
  const [activeDiscipline, setActiveDiscipline] = useState("creative");

  const goNextDiscipline = useCallback(() => {
    setActiveDiscipline((prev) => {
      const index = DISCIPLINE_ORDER.indexOf(prev);
      return DISCIPLINE_ORDER[(index + 1) % DISCIPLINE_ORDER.length];
    });
  }, []);

  const goPrevDiscipline = useCallback(() => {
    setActiveDiscipline((prev) => {
      const index = DISCIPLINE_ORDER.indexOf(prev);
      return DISCIPLINE_ORDER[
        (index - 1 + DISCIPLINE_ORDER.length) % DISCIPLINE_ORDER.length
      ];
    });
  }, []);

  const {
    scale,
    circleScale,
    circleOpacity,
    section2Opacity,
    section2Shift,
    showCircle,
    phase,
    heroCollapsed,
    isCommitting,
  } = useScrollHeroTransition(trackRef, section2Ref);

  const { dotProgress, contentOffset, isStatic } = useStoryArticleScroll(
    storyTrackRef,
    storySlidesContentRef,
    storySlidesViewportRef,
  );

  return (
    <>
      <PageHead {...HOME_META} />
      <JsonLd data={buildAgencySchemas()} />

      <main className="home">
        <h1 className="sr-only">Nextale — Creative and Technology Agency</h1>

      {showCircle && (
        <div className="home-hero__circle-portal" aria-hidden="true">
          <span
            className="home-hero__circle"
            style={{
              transform: `scale(${circleScale})`,
              opacity: circleOpacity,
            }}
          />
        </div>
      )}

      <div
        className={[
          "home-scroll-track",
          heroCollapsed ? "home-scroll-track--collapsed" : "",
        ].join(" ")}
        ref={trackRef}
      >
        <section
          className={[
            "home-hero",
            phase === "active" ? "home-hero--active" : "",
          ].join(" ")}
          aria-label="Hero"
        >
          <div className="home-hero__media">
            <video
              className="home-hero__video home-hero__video--desktop"
              src={desktopVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <video
              className="home-hero__video home-hero__video--mobile"
              src={mobileVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="home-hero__scrim" />
          </div>

          <div className="home-hero__body">
            <div
              className="home-hero__slogan"
              style={{ "--hero-text-scale": scale }}
            >
              <p className="home-hero__lead">We are</p>
              <p className="home-hero__words">
                creators&nbsp;&nbsp;·&nbsp;&nbsp;makers&nbsp;&nbsp;·&nbsp;&nbsp;storytellers
              </p>
              <p className="home-hero__brand">Nextale</p>
              <p className="home-hero__tagline">from paper to pixel</p>
            </div>
          </div>

          <p className="home-hero__hint">Scroll</p>
        </section>
      </div>

      <section
        className={[
          "home-intro",
          heroCollapsed && isCommitting ? "home-intro--committing" : "",
          phase === "done" ? "home-intro--landed" : "",
        ].join(" ")}
        id="section-2"
        ref={section2Ref}
      >
        <div
          className="home-intro__inner"
          style={{
            opacity: section2Opacity,
            transform: `translateY(${section2Shift}px)`,
          }}
        >
          <h2 className="home-intro__headline">
            From paper to pixel
            <br />
            — we turn brand stories into content that moves across every
            screen.
          </h2>
          <div className="home-intro__footer">
            <p className="home-intro__body">
              Nextale is your partner for social-first production, campaigns,
              and video work built with intention and craft.
            </p>
            <div className="home-intro__actions">
              <Link href="/work" className="home-intro__link btn btn--dark home-intro__link--primary">
                View our work
              </Link>
              <Link href="/contact" className="home-intro__link btn btn--secondary home-intro__link--ghost">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className={[
          "home-story-track",
          "home-story-track--article",
          isStatic ? "home-story-track--static" : "",
        ].join(" ")}
        aria-label="Who we help"
        ref={storyTrackRef}
        style={{ "--story-beats": STORY_BEATS.length }}
      >
        <div className="home-story">
          <div className="home-story__layout">
            <div className="home-story__media">
              <video
                className="home-story__video home-story__video--desktop"
                src={desktopVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <video
                className="home-story__video home-story__video--mobile"
                src={mobileVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>

            <div className="home-story__rail" aria-hidden="true">
              <span className="home-story__line" />
              <span
                className="home-story__dot"
                style={{ top: `${dotProgress * 100}%` }}
              />
            </div>

            <div className="home-story__slides" ref={storySlidesViewportRef}>
              <div
                className="home-story__slides-inner"
                ref={storySlidesContentRef}
                style={
                  isStatic
                    ? undefined
                    : { transform: `translateY(-${contentOffset}px)` }
                }
              >
              {STORY_BEATS.map((beat) => (
                <article
                  key={beat.id}
                  className={[
                    "home-story__slide",
                    beat.num ? "home-story__slide--item" : "",
                    isStatic ? "home-story__slide--static" : "",
                  ].join(" ")}
                >
                  {beat.num ? (
                    <p className="home-story__item">
                      <span className="home-story__item-num">{beat.num}.</span>{" "}
                      {beat.content}
                    </p>
                  ) : (
                    <p className="home-story__copy">{beat.content}</p>
                  )}
                </article>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-capabilities" aria-label="Creative and technology services">
        <div className="home-capabilities__inner">
          <header className="home-capabilities__header">
            <h2 className="home-capabilities__headline">
            Nextale aligns creative and technology under shared standards.
            </h2>
          </header>

          <div className="home-bento">
            <ServicesBentoGrid
              activeDiscipline={activeDiscipline}
              categories={SERVICE_CATEGORIES}
              onPrev={goPrevDiscipline}
              onNext={goNextDiscipline}
              creativeConfettiStateRef={creativeConfettiStateRef}
            />
          </div>

          <div
            className="home-capabilities__marquee"
            aria-label="Companies in the Nextale group"
          >
            <div className="home-capabilities__marquee-track">
              <ul className="home-capabilities__marquee-group">
                <CorporateLogoItems logos={CORPORATE_LOGOS} />
              </ul>
              <ul
                className="home-capabilities__marquee-group"
                aria-hidden="true"
              >
                <CorporateLogoItems
                  logos={CORPORATE_LOGOS}
                  keyPrefix="dup-"
                />
              </ul>
            </div>
          </div>

          <Link
            href="/services"
            className="home-intro__link btn btn--secondary home-intro__link--ghost home-capabilities__cta"
          >
            Explore all services
          </Link>
        </div>
      </section>

      <GeoChunk hidden items={[FAQ[0], FAQ[3]]} />
    </main>
    </>
  );
}
