import Link from "next/link";
import { useRef } from "react";
import desktopVideo from "../assets/landing-desktop-video.mp4";
import mobileVideo from "../assets/landing-mobile-video.mp4";
import { useStoryScroll } from "../plugins/storyScrollLogic";
import { useScrollHeroTransition } from "../plugins/scrollHeroLogic";

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

const SERVICES_TEASER = [
  {
    num: "01",
    title: "Social Media Management",
    body: "Planning, publishing, and community — channels kept active and on-brand.",
  },
  {
    num: "02",
    title: "Content Creation",
    body: "Photography, reels, and copy tailored to how your audience scrolls.",
  },
  {
    num: "03",
    title: "Video Production",
    body: "Campaign films, product videos, and platform-native storytelling.",
  },
];

const WORK_TEASER = [
  {
    title: "Summer Brand Film",
    category: "Video Production",
    tone: "video",
    isVideo: true,
  },
  {
    title: "Social Launch Kit",
    category: "Content Creation",
    tone: "a",
    isVideo: false,
  },
  {
    title: "Campaign Visuals",
    category: "Social Media",
    tone: "b",
    isVideo: false,
  },
  {
    title: "Live Event Recap",
    category: "Video Production",
    tone: "video",
    isVideo: true,
  },
];

const PROCESS_TEASER = [
  {
    num: "01",
    title: "Discover",
    body: "We learn your brand, audience, and goals before anything is produced.",
  },
  {
    num: "02",
    title: "Create",
    body: "Concept, shoot, edit — built for the platform it lives on.",
  },
  {
    num: "03",
    title: "Launch",
    body: "Content goes live with a rollout plan and clear benchmarks.",
  },
];

export default function HomePage() {
  const trackRef = useRef(null);
  const section2Ref = useRef(null);
  const storyTrackRef = useRef(null);
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
              <Link href="/work" className="home-intro__link home-intro__link--primary">
                View our work
              </Link>
              <Link href="/contact" className="home-intro__link home-intro__link--ghost">
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

      <section className="home-services" aria-label="Services">
        <div className="home-services__inner">
          <header className="home-services__header">
            <p className="home-intro__eyebrow">What we do</p>
            <h2 className="home-services__title">
              Strategy, content, and production — built for brands that move
              fast.
            </h2>
          </header>

          <div className="home-services__grid">
            {SERVICES_TEASER.map((service) => (
              <Link
                key={service.num}
                href="/services"
                className="home-services__card"
              >
                <span className="home-services__num">{service.num}</span>
                <h3 className="home-services__card-title">{service.title}</h3>
                <p className="home-services__card-body">{service.body}</p>
                <span className="home-services__card-link">View service</span>
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            className="home-intro__link home-intro__link--ghost home-services__cta"
          >
            All services
          </Link>
        </div>
      </section>

      <section className="home-work" aria-label="Selected work">
        <div className="home-work__inner">
          <header className="home-work__header">
            <p className="home-intro__eyebrow">Selected work</p>
            <h2 className="home-work__title">
              A glimpse of what we&apos;ve been making.
            </h2>
          </header>

          <div className="home-work__grid">
            {WORK_TEASER.map((project) => (
              <Link
                key={project.title}
                href="/work"
                className="home-work__tile"
              >
                <div className="home-work__media">
                  <span
                    className={[
                      "home-work__thumb",
                      `home-work__thumb--${project.tone}`,
                    ].join(" ")}
                  />
                  {project.isVideo && (
                    <span className="home-work__play" aria-hidden="true" />
                  )}
                </div>
                <div className="home-work__meta">
                  <h3 className="home-work__name">{project.title}</h3>
                  <p className="home-work__category">{project.category}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/work"
            className="home-intro__link home-intro__link--primary home-work__cta"
          >
            See all work
          </Link>
        </div>
      </section>

      <section className="home-process" aria-label="How we work">
        <div className="home-process__inner">
          <header className="home-process__header">
            <p className="home-intro__eyebrow">How we work</p>
            <h2 className="home-process__title">
              A clear path from brief to delivery — no jargon, no guesswork.
            </h2>
          </header>

          <div className="home-process__grid">
            {PROCESS_TEASER.map((step) => (
              <article key={step.num} className="home-process__step">
                <span className="home-process__num">{step.num}</span>
                <h3 className="home-process__step-title">{step.title}</h3>
                <p className="home-process__step-body">{step.body}</p>
              </article>
            ))}
          </div>

          <Link
            href="/process"
            className="home-intro__link home-intro__link--ghost home-process__cta"
          >
            Our full process
          </Link>
        </div>
      </section>

      <section className="home-cta" aria-label="Get in touch">
        <div className="home-cta__inner">
          <h2 className="home-cta__title">
            Ready to go from paper to pixel?
          </h2>
          <p className="home-cta__body">
            Tell us about your brand and what you want to build — we respond
            within two business days.
          </p>
          <Link href="/contact" className="home-cta__link">
            Start a project
          </Link>
        </div>
      </section>

      <section className="home-brand-strip" aria-label="Nextale 2026">
        <div className="home-brand-strip__inner">
          <span className="home-brand-strip__name">NEXTALE</span>
          <span className="home-brand-strip__year" aria-hidden="true">
            <span>20</span>
            <span>26</span>
          </span>
        </div>
      </section>
    </main>
  );
}
