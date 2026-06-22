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
import { SERVICES_OPTIONS, useContactForm } from "../plugins/formLogic";
import { useStoryScroll } from "../plugins/useStoryScroll";

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

function CapabilityServiceItem({ service }) {
  return (
    <div className="home-capabilities__item">
      <span className="home-capabilities__item-icon" aria-hidden="true">
        <ServiceIcon type={service.icon} />
      </span>
      <div className="home-capabilities__item-copy">
        <div className="home-capabilities__item-head">
          <h4 className="home-capabilities__item-title">{service.title}</h4>
        </div>
        <p className="home-capabilities__item-body">{service.body}</p>
      </div>
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

const CAPABILITY_ROW_COUNT = Math.max(
  ...CAPABILITIES_DISCIPLINES.map((discipline) => discipline.services.length),
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
  const form = useContactForm();
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

  const { activeBeat, dotProgress, isStatic } = useStoryScroll(
    storyTrackRef,
    STORY_BEATS.length,
  );

  return (
    <main className="home">
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
          <p className="home-intro__eyebrow">Creative agency</p>
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

            <div className="home-story__slides">
              {STORY_BEATS.map((beat, index) => (
                <article
                  key={beat.id}
                  className={[
                    "home-story__slide",
                    beat.num ? "home-story__slide--item" : "",
                    !isStatic && activeBeat === index
                      ? "home-story__slide--active"
                      : "",
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
      </section>

      <section className="home-capabilities" aria-label="What we do">
        <div className="home-capabilities__inner">
          <header className="home-capabilities__header">
            <p className="home-capabilities__eyebrow">What we do</p>
            <h2 className="home-capabilities__headline">
              Two disciplines.
              <br />
              One team.
            </h2>
            <p className="home-capabilities__lead">
              Most studios pick a lane. Nextale runs both — so your brand and the
              technology behind it are built by people who actually talk to each
              other.
            </p>
          </header>

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

          <div className="home-capabilities__pillars">
            <div className="home-capabilities__pillar-headers">
              {CAPABILITIES_DISCIPLINES.map((discipline) => (
                <header
                  key={discipline.id}
                  className={[
                    "home-capabilities__pillar-head",
                    `home-capabilities__pillar-head--${discipline.id}`,
                  ].join(" ")}
                >
                  <h3 className="home-capabilities__pillar-name">
                    {discipline.name}
                  </h3>
                </header>
              ))}
            </div>

            <ul className="home-capabilities__rows">
              {Array.from({ length: CAPABILITY_ROW_COUNT }, (_, rowIndex) => {
                const creativeService =
                  CAPABILITIES_DISCIPLINES[0].services[rowIndex];
                const technologyService =
                  CAPABILITIES_DISCIPLINES[1].services[rowIndex];

                return (
                  <li key={rowIndex} className="home-capabilities__row">
                    {creativeService ? (
                      <CapabilityServiceItem service={creativeService} />
                    ) : null}
                    {technologyService ? (
                      <CapabilityServiceItem service={technologyService} />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="home-capabilities__corporate-head">
            <p className="home-capabilities__corporate-eyebrow">Under one roof</p>
            <p className="home-capabilities__corporate-lead">
              Creative and technology, aligned under Nextale — one group, two
              disciplines, shared standards.
            </p>
          </div>

          <Link
            href="/services"
            className="home-intro__link btn btn--secondary home-intro__link--ghost home-capabilities__cta"
          >
            Explore all services
          </Link>
        </div>
      </section>

      <section className="home-contact" aria-label="Start a project">
        <div className="home-contact__inner">
          <div className="home-contact__sticky">
            <p className="home-contact__tagline">
              From Paper
              <br />
              to Pixel.
            </p>
          </div>

          <div className="home-contact__form-wrap">
            <form
              className="home-contact__form"
              onSubmit={form.submit}
              noValidate
            >
              <div className="home-contact__row">
                <div
                  className={[
                    "home-contact__field",
                    form.errors.name ? "home-contact__field--error" : "",
                  ].join(" ")}
                >
                  <label htmlFor="home-name">Your name</label>
                  <input
                    id="home-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Tan"
                    value={form.fields.name}
                    onChange={form.handleChange}
                  />
                  {form.errors.name && (
                    <p className="home-contact__error">{form.errors.name}</p>
                  )}
                </div>

                <div
                  className={[
                    "home-contact__field",
                    form.errors.email ? "home-contact__field--error" : "",
                  ].join(" ")}
                >
                  <label htmlFor="home-email">Email</label>
                  <input
                    id="home-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    value={form.fields.email}
                    onChange={form.handleChange}
                  />
                  {form.errors.email && (
                    <p className="home-contact__error">{form.errors.email}</p>
                  )}
                </div>
              </div>

              <div className="home-contact__row">
                <div className="home-contact__field">
                  <label htmlFor="home-company">Company</label>
                  <input
                    id="home-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Optional"
                    value={form.fields.company}
                    onChange={form.handleChange}
                  />
                </div>

                <div className="home-contact__field">
                  <label htmlFor="home-budget">Budget range</label>
                  <input
                    id="home-budget"
                    name="budget"
                    type="text"
                    placeholder="e.g. RM 20k – 50k"
                    value={form.fields.budget}
                    onChange={form.handleChange}
                  />
                </div>
              </div>

              <fieldset className="home-contact__services">
                <legend className="home-contact__services-label">
                  What can we help with?
                </legend>
                <div className="home-contact__services-list">
                  {SERVICES_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={[
                        "home-contact__service-btn",
                        form.fields.services.includes(option)
                          ? "home-contact__service-btn--active"
                          : "",
                      ].join(" ")}
                      aria-pressed={form.fields.services.includes(option)}
                      onClick={() => form.handleServicesToggle(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div
                className={[
                  "home-contact__field",
                  form.errors.message ? "home-contact__field--error" : "",
                ].join(" ")}
              >
                <label htmlFor="home-message">Your message</label>
                <textarea
                  id="home-message"
                  name="message"
                  rows={5}
                  placeholder="A few lines on what you're building and where you'd like help."
                  value={form.fields.message}
                  onChange={form.handleChange}
                />
                {form.errors.message && (
                  <p className="home-contact__error">{form.errors.message}</p>
                )}
              </div>

              <div className="home-contact__submit-row">
                <button
                  type="submit"
                  className="home-contact__submit btn btn--primary"
                  disabled={form.isSubmitting}
                >
                  {form.isSubmitting ? "Sending…" : "Submit"}
                </button>
                <p className="home-contact__submit-note">
                  We&apos;ll reply within one business day.
                </p>
              </div>

              {form.isSuccess && (
                <p className="home-contact__success">
                  Message sent — we&apos;ll be in touch soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
