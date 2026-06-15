import Link from "next/link";
import { useRef } from "react";
import desktopVideo from "../assets/landing-desktop-video.mp4";
import mobileVideo from "../assets/landing-mobile-video.mp4";
import { useScrollHeroTransition } from "../plugins/scrollHeroLogic";

export default function HomePage() {
  const trackRef = useRef(null);
  const section2Ref = useRef(null);
  const {
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
    isCommitting,
  } = useScrollHeroTransition(trackRef, section2Ref);

  return (
    <main
      className={[
        "home",
        isSpringing ? "home--spring" : "",
        pullY > 0 ? "home--pulling" : "",
      ].join(" ")}
      style={pullY > 0 ? { transform: `translateY(${pullY}px)` } : undefined}
    >
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
              style={{ transform: `scale(${scale})` }}
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
          isCommitting ? "home-intro--committing" : "",
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
            From paper to pixel — we turn brand stories into content that
            moves across every screen.
          </h2>
          <p className="home-intro__body">
            Nextale is your partner for social-first production, campaigns, and
            video work built with intention and craft.
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
