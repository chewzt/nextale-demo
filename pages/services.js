import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import socialReel from "../assets/landing-mobile-video.mp4";
import desktopVideo from "../assets/landing-desktop-video.mp4";
import brandShot1 from "../assets/services/brand-identity/brand-01.png";
import brandShot2 from "../assets/services/brand-identity/brand-02.png";
import brandShot3 from "../assets/services/brand-identity/brand-03.png";
import photo01 from "../assets/services/productpicture/photo-01.jpg";
import photo02 from "../assets/services/productpicture/photo-02.jpg";
import photo03 from "../assets/services/productpicture/photo-03.jpg";
import photo04 from "../assets/services/productpicture/photo-04.jpg";
import photo05 from "../assets/services/productpicture/photo-05.jpg";
import photo06 from "../assets/services/productpicture/photo-06.jpg";
import photo07 from "../assets/services/productpicture/photo-07.jpg";
import photo08 from "../assets/services/productpicture/photo-08.jpg";
import photo09 from "../assets/services/productpicture/photo-09.jpg";
import photo10 from "../assets/services/productpicture/photo-10.jpg";
import photo11 from "../assets/services/productpicture/photo-11.jpg";
import photo12 from "../assets/services/productpicture/photo-12.jpg";
import photo13 from "../assets/services/productpicture/photo-13.jpg";
import photo14 from "../assets/services/productpicture/photo-14.jpg";
import photo15 from "../assets/services/productpicture/photo-15.png";
import { useStoryScroll } from "../plugins/useStoryScroll";

// TODO: swap to ../assets/services/web-development/web-01.png when asset is ready
const webShot = brandShot1;
// TODO: swap to ../assets/services/mobile-apps/mobile-01.png when asset is ready
const mobileShot = brandShot2;
// TODO: swap to ../assets/services/system-development/system-01.png when asset is ready
const systemShot = brandShot3;
// TODO: swap to ../assets/services/automation-apis/automation-01.png when asset is ready
const automationShot = photo10;

const CATEGORY_LABEL = "Creative";

const SERVICES_BEATS = [
  {
    id: "brand",
    folder: "brand-identity",
    num: "01",
    title: "Brand & Identity",
    body: "Names, visual identity, and brand systems that help businesses stand out from day one.",
    images: [
      {
        src: brandShot1,
        label: "Logo",
        slot: "tl",
        calloutSide: "left",
      },
      {
        src: brandShot2,
        label: "Color Scheme",
        slot: "bc",
        calloutSide: "top",
      },
      {
        src: brandShot3,
        label: "Business Card",
        slot: "tr",
        calloutSide: "right",
      },
    ],
  },
  {
    id: "social",
    type: "social",
    folder: "social-media",
    num: "02",
    title: "Social Media Marketing",
    body: "Strategy, always-on content, and community management that builds genuine followings.",
    reels: [
      { id: "reel-1", src: socialReel, label: "Reel 01" },
      { id: "reel-2", src: socialReel, label: "Reel 02" },
      { id: "reel-3", src: socialReel, label: "Reel 03" },
    ],
    images: [],
  },
  {
    id: "video",
    type: "video",
    folder: "video-production",
    num: "03",
    title: "Video Production",
    body: "Brief to final cut — brand films, product videos, platform-native storytelling, in-house.",
    videos: [
      { id: "v1", src: desktopVideo, label: "Brand Film" },
      { id: "v2", src: desktopVideo, label: "Product Video" },
      { id: "v3", src: desktopVideo, label: "Wedding Reel" },
    ],
    images: [],
  },
  {
    id: "photo",
    type: "photo",
    folder: "product-photography",
    num: "04",
    title: "Product Photography",
    body: "Studio-quality imagery and lifestyle shots built for e-commerce, social, and campaigns.",
    photos: [
      { id: "p01", src: photo01 },
      { id: "p02", src: photo02 },
      { id: "p03", src: photo03 },
      { id: "p04", src: photo04 },
      { id: "p05", src: photo05 },
      { id: "p06", src: photo06 },
      { id: "p07", src: photo07 },
      { id: "p08", src: photo08 },
      { id: "p09", src: photo09 },
      { id: "p10", src: photo10 },
      { id: "p11", src: photo11 },
      { id: "p12", src: photo12 },
      { id: "p13", src: photo13 },
      { id: "p14", src: photo14 },
      { id: "p15", src: photo15 },
    ],
    images: [],
  },
];

const PHOTO_BEAT_INDEX = SERVICES_BEATS.findIndex((beat) => beat.id === "photo");

const CREATIVE_PROCESS_STEPS = [
  {
    num: "01",
    title: "Listen & align",
    body: "We dig into your brand, who you're reaching, and what you're trying to achieve — then map out the work, timeline, and deliverables together.",
    tags: ["Brand review", "Audience", "KPIs", "Budget", "Kickoff"],
  },
  {
    num: "02",
    title: "Build & refine",
    body: "From first concepts to polished files — identity, content, photo, and video — shaped through feedback until every asset is ready to use.",
    tags: ["Concepts", "Shoots", "Edits", "Revisions", "Final files"],
  },
  {
    num: "03",
    title: "Ship & grow",
    body: "We roll out across your channels, watch what lands, and adjust the plan so each round of creative performs better than the last.",
    tags: ["Scheduling", "Channels", "Analytics", "Optimisation", "Ongoing support"],
  },
];

const TECHNOLOGY_LABEL = "Technology";

const TECHNOLOGY_BEATS = [
  {
    id: "web",
    type: "showcase",
    folder: "web-development",
    num: "01",
    title: "Web Development",
    body: "Fast, scalable websites and storefronts built to last.",
    image: webShot,
  },
  {
    id: "mobile",
    type: "showcase",
    folder: "mobile-apps",
    num: "02",
    title: "Mobile Apps",
    body: "iOS and Android apps from prototype through App Store launch.",
    image: mobileShot,
  },
  {
    id: "system",
    type: "showcase",
    folder: "system-development",
    num: "03",
    title: "System Development",
    body: "Custom platforms that replace spreadsheets and manual workflows.",
    image: systemShot,
  },
  {
    id: "automation",
    type: "showcase",
    folder: "automation-apis",
    num: "04",
    title: "Automation & APIs",
    body: "Connect your stack and automate the busywork behind the scenes.",
    image: automationShot,
  },
];

const TECHNOLOGY_PROCESS_STEPS = [
  {
    num: "01",
    title: "Scope & architect",
    body: "We review your stack, workflows, and goals — then define architecture, integrations, and a realistic build plan before a line of code is written.",
    tags: ["Tech audit", "Architecture", "Integrations", "Roadmap", "Estimates"],
  },
  {
    num: "02",
    title: "Build & test",
    body: "We develop in sprints with staging environments, code review, and QA so every feature ships stable and ready for your team to use.",
    tags: ["Sprints", "Staging", "Code review", "QA", "Documentation"],
  },
  {
    num: "03",
    title: "Launch & support",
    body: "We deploy, hand over cleanly, and stay on for monitoring, fixes, and the next round of improvements as your product grows.",
    tags: ["Deployment", "Handoff", "Monitoring", "Maintenance", "Iterations"],
  },
];

const SERVICES_FAQ = [
  {
    id: "creative-vs-tech",
    question:
      "What's the difference between your Creative and Technology services?",
    answer:
      "Creative covers brand identity, social content, photo, and video — everything your audience sees and engages with. Technology covers websites, mobile apps, custom systems, and automation — the tools that power your business behind the scenes. Many clients work with us on both so creative and tech stay aligned from day one.",
  },
  {
    id: "single-service",
    question:
      "Can we hire you for just one service, or do we need the full package?",
    answer:
      "You can start with a single deliverable — a logo refresh, a product shoot, or a landing page — without committing to a full engagement. We're equally happy to scope a combined creative and technology project when that's what you need.",
  },
  {
    id: "get-started",
    question: "How do we get started?",
    answer:
      "Fill out the contact form with a short brief and we'll reply within one business day. From there we schedule a discovery call, align on goals and scope, and send a clear proposal before any work begins.",
  },
  {
    id: "timeline",
    question: "What does a typical project timeline look like?",
    answer:
      "Timelines depend on scope. Branding projects often run two to four weeks; websites typically four to eight weeks; apps and custom systems vary based on complexity. We set realistic dates at kickoff and keep you updated at every milestone.",
  },
  {
    id: "who-we-work-with",
    question: "Do you work with startups and established brands?",
    answer:
      "Yes — we work with early-stage founders building their first identity and with established teams scaling content, campaigns, or internal tools. The process adjusts to your stage, but the standard of work stays the same.",
  },
  {
    id: "revisions",
    question: "How many revision rounds are included?",
    answer:
      "Revision rounds are agreed in your proposal based on the deliverable — typically two to three structured rounds per major milestone. We collect feedback in clear checkpoints so revisions stay focused and on schedule.",
  },
  {
    id: "ownership",
    question: "Who owns the final files and code?",
    answer:
      "You do. On final payment, all deliverables — design files, source code, and assets — are handed over for your full use. We don't retain rights to your work unless we agree otherwise in writing.",
  },
  {
    id: "pricing",
    question: "How is pricing structured?",
    answer:
      "Every project is quoted from scope — no hidden fees. We provide a transparent breakdown of what's included before you sign off, and flag any changes that would affect cost before proceeding.",
  },
];

const PORTFOLIO_HREF = "/work";

function SvcPortfolioStrip({ children }) {
  return (
    <div className="svc-portfolio-strip">
      <p className="svc-portfolio-strip__text">{children}</p>
    </div>
  );
}

function SvcStoryNumRoll({ beats, activeBeat }) {
  const focusedBeat = beats[activeBeat] ?? beats[0];

  return (
    <div className="svc-story__num-roll">
      <div className="svc-story__num-wrapper" aria-hidden="true">
        <div
          className="svc-story__num-inner"
          style={{ "--num-index": activeBeat }}
        >
          {beats.map((beat) => (
            <span
              key={beat.id}
              className={[
                "svc-story__num",
                `svc-story__num--${beat.id}`,
              ].join(" ")}
            >
              {beat.num}
            </span>
          ))}
        </div>
      </div>
      <span className="svc-story__num-sr">{focusedBeat.num}</span>
    </div>
  );
}

function ServiceSlideHeader({ beat, pinned }) {
  return (
    <div className="svc-story__header">
      {pinned ? (
        <div className="svc-story__num-spacer" aria-hidden="true" />
      ) : (
        <span className="svc-story__num">{beat.num}</span>
      )}
      <div className="svc-story__copy">
        <h2 className="svc-story__title">{beat.title}</h2>
        <p className="svc-story__body">{beat.body}</p>
      </div>
    </div>
  );
}

function hasMosaicLayout(images) {
  return (
    images.length === 3 &&
    images.every((item) => item.src && item.slot && item.calloutSide)
  );
}

const ARROW_VIEWBOX = "0 0 375.01 375.01";

const ARROW_BODY_PATH =
  "M330.254,210.966c-56.916,1.224-110.16,25.704-167.076,28.764c-16.524,0.612-33.048-1.224-45.9-8.568c23.256-4.283,45.288-12.239,61.812-27.54c17.749-15.911,19.584-45.287,8.568-66.095c-10.404-19.584-36.72-20.196-55.08-15.3C89.125,132.63,59.75,184.65,84.229,221.369c-26.928,1.836-53.856,0-80.172,1.225c-5.508,0.611-5.508,8.567,0.612,8.567c26.928,1.836,59.364,4.284,91.188,2.448c1.836,1.225,3.672,3.061,5.508,4.284c64.872,45.288,159.732-11.628,229.5-13.464C338.821,223.817,338.821,210.354,330.254,210.966z M89.737,196.277c-6.732-25.091,15.3-46.511,35.496-56.916c20.196-10.404,48.96-10.404,55.692,15.912c7.956,30.6-18.36,48.959-43.452,56.916c-11.628,3.672-22.644,6.12-34.272,7.344C96.47,213.413,92.186,206.069,89.737,196.277z";

const ARROW_HEAD_PATH =
  "M371.869,211.577c-8.567-5.508-16.523-11.016-24.479-16.523c-6.732-4.896-13.464-10.404-21.42-12.24c-6.12-1.836-12.24,7.344-6.732,11.627c6.732,4.896,14.076,9.18,20.809,13.464c4.896,3.061,9.792,6.732,14.075,9.792c-4.896,2.448-9.792,4.284-14.688,6.732c-3.672,1.836-7.956,3.672-11.628,5.508c-1.224,0.612-2.448,1.836-3.061,3.06c-1.836,2.448-0.611,1.225,0,0.612c-2.447,1.836-2.447,7.956,1.837,7.344l0,0c1.224,0.612,2.447,0.612,4.283,0.612c4.284-1.224,9.181-3.06,13.464-4.896c9.181-3.673,18.36-7.345,26.929-12.24C376.153,220.758,376.153,214.025,371.869,211.577z";

function ServiceCalloutArrow({ side }) {
  return (
    <svg
      className={`svc-story__callout-arrow svc-story__callout-arrow--${side}`}
      viewBox={ARROW_VIEWBOX}
      aria-hidden="true"
    >
      <path className="svc-story__callout-arrow-body" d={ARROW_BODY_PATH} />
      <path className="svc-story__callout-arrow-head" d={ARROW_HEAD_PATH} />
    </svg>
  );
}

function SocialReelStrip({ beat, isActive }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    if (!isActive) {
      videoRefs.current.forEach((video) => video?.pause());
      setActiveIndex(null);
    } else {
      setActiveIndex(0);
      videoRefs.current[0]?.play().catch(() => {});
    }
  }, [isActive]);

  const expand = (index) => {
    if (!isActive) return;

    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) video.pause();
    });
    setActiveIndex(index);
    videoRefs.current[index]?.play().catch(() => {});
  };

  const collapse = (index) => {
    const video = videoRefs.current[index];
    if (video) video.pause();
    setActiveIndex(null);
  };

  const toggle = (index) => {
    if (activeIndex === index) collapse(index);
    else expand(index);
  };

  return (
    <div
      className={[
        "svc-reels",
        activeIndex !== null ? "svc-reels--expanded" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      {beat.reels.map((reel, index) => (
        <article
          key={reel.id}
          className={[
            "svc-reels__item",
            activeIndex === index ? "svc-reels__item--active" : "",
          ].join(" ")}
          onMouseEnter={() => expand(index)}
          onClick={() => toggle(index)}
        >
          <video
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            className="svc-reels__video"
            src={reel.src}
            muted
            loop
            playsInline
            preload="metadata"
          />
        </article>
      ))}
    </div>
  );
}

function VideoCarousel({ beat, isActive }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef([]);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const isScrubbing = useRef(false);

  const count = beat.videos.length;

  useLayoutEffect(() => {
    const centerActiveSlide = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const slide = track.children[activeIdx];
      if (!slide) return;

      const offset =
        slide.offsetLeft + slide.offsetWidth / 2 - viewport.clientWidth / 2;
      track.style.transform = `translateX(-${offset}px)`;
    };

    centerActiveSlide();
    window.addEventListener("resize", centerActiveSlide);
    return () => window.removeEventListener("resize", centerActiveSlide);
  }, [activeIdx]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (!isActive || index !== activeIdx) {
        video.pause();
      }
    });

    if (!isActive) {
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    const video = videoRefs.current[activeIdx];
    if (!video) return;

    video.currentTime = 0;
    setProgress(0);
    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [isActive, activeIdx]);

  const handleTimeUpdate = () => {
    if (isScrubbing.current) return;
    const video = videoRefs.current[activeIdx];
    if (video?.duration) setProgress(video.currentTime / video.duration);
  };

  const handleSeek = (event) => {
    const value = parseFloat(event.target.value);
    setProgress(value);
    const video = videoRefs.current[activeIdx];
    if (video?.duration) video.currentTime = value * video.duration;
  };

  const togglePlay = () => {
    const video = videoRefs.current[activeIdx];
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const goPrev = () => {
    setActiveIdx((index) => (index - 1 + count) % count);
  };

  const goNext = () => {
    setActiveIdx((index) => (index + 1) % count);
  };

  return (
    <div className="svc-video-carousel" aria-hidden="true">
      <div className="svc-video-carousel__viewport" ref={viewportRef}>
        <div className="svc-video-carousel__track" ref={trackRef}>
          {beat.videos.map((video, index) => (
            <article
              key={video.id}
              className={[
                "svc-video-carousel__slide",
                index === activeIdx ? "svc-video-carousel__slide--active" : "",
              ].join(" ")}
            >
              <div className="svc-video-carousel__frame">
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  className="svc-video-carousel__video"
                  src={video.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onTimeUpdate={
                    index === activeIdx ? handleTimeUpdate : undefined
                  }
                  onPlay={
                    index === activeIdx ? () => setIsPlaying(true) : undefined
                  }
                  onPause={
                    index === activeIdx ? () => setIsPlaying(false) : undefined
                  }
                  onClick={index === activeIdx ? togglePlay : undefined}
                />

                {index === activeIdx && !isPlaying ? (
                  <button
                    type="button"
                    className="svc-video-carousel__play"
                    onClick={togglePlay}
                    aria-label="Play video"
                  />
                ) : null}

                {index === activeIdx ? (
                  <div className="svc-video-carousel__timeline-wrap">
                    <input
                      type="range"
                      className="svc-video-carousel__timeline"
                      min={0}
                      max={1}
                      step={0.001}
                      value={progress}
                      onChange={handleSeek}
                      onPointerDown={() => {
                        isScrubbing.current = true;
                      }}
                      onPointerUp={() => {
                        isScrubbing.current = false;
                      }}
                      aria-label="Video timeline"
                    />
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="svc-video-carousel__arrow svc-video-carousel__arrow--prev"
          onClick={goPrev}
          aria-label="Previous video"
        >
          ‹
        </button>
        <button
          type="button"
          className="svc-video-carousel__arrow svc-video-carousel__arrow--next"
          onClick={goNext}
          aria-label="Next video"
        >
          ›
        </button>
      </div>

      <div className="svc-video-carousel__dots">
        {beat.videos.map((video, index) => (
          <button
            key={video.id}
            type="button"
            className={[
              "svc-video-carousel__dot",
              index === activeIdx ? "svc-video-carousel__dot--active" : "",
            ].join(" ")}
            onClick={() => setActiveIdx(index)}
            aria-label={`Show ${video.label ?? `video ${index + 1}`}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProductPhotoGrid({ photos }) {
  return (
    <div className="svc-photo-grid" aria-hidden="true">
      {photos.map((photo) => (
        <figure key={photo.id} className="svc-photo-grid__item">
          <div className="svc-photo-grid__expand">
            <Image
              src={photo.src}
              alt=""
              className="svc-photo-grid__img"
              fill
              sizes="20vw"
              onLoadingComplete={(img) => {
                img
                  .closest(".svc-photo-grid__item")
                  ?.style.setProperty(
                    "--ar",
                    img.naturalWidth / img.naturalHeight,
                  );
              }}
            />
          </div>
        </figure>
      ))}
    </div>
  );
}

function TechShowcase({ src }) {
  return (
    <figure className="svc-tech-showcase" aria-hidden="true">
      <Image
        src={src}
        alt=""
        className="svc-tech-showcase__img"
        sizes="(max-width: 900px) 100vw, 52rem"
      />
    </figure>
  );
}

function useProcessVisibility() {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { cardRef, visible };
}

function ServiceProcessCard({ steps, cardRef, visible, ariaLabel }) {
  return (
    <section className="svc-process" aria-label={ariaLabel}>
      <div className="svc-process__inner">
        <div
          ref={cardRef}
          className={[
            "svc-process__card",
            visible ? "svc-process--visible" : "",
          ].join(" ")}
        >
          <h2 className="svc-process__title">Our process</h2>

          <div className="svc-process__grid">
            {steps.map((step, index) => (
              <article
                key={step.num}
                className="svc-process__step"
                style={{ "--stagger-delay": `${index * 0.15}s` }}
              >
                <span className="svc-process__num">({step.num})</span>
                <h3 className="svc-process__step-title">{step.title}</h3>
                <p className="svc-process__step-body">{step.body}</p>
                <ul className="svc-process__tags">
                  {step.tags.map((tag) => (
                    <li key={tag} className="svc-process__tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="svc-process__cta">
            <Link href="/contact" className="btn btn--dark">
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesFaq() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="svc-faq" aria-label="Frequently asked questions">
      <div className="svc-faq__inner">
        <div className="svc-faq__heading">
          <h2 className="svc-faq__title">Frequently asked questions</h2>
          <div className="svc-faq__aside">
            <p className="svc-faq__aside-text">
              Interested? See our work before you kick off.
            </p>
            <Link href={PORTFOLIO_HREF} className="btn btn--dark svc-faq__aside-cta">
              View portfolio
            </Link>
          </div>
        </div>

        <div className="svc-faq__list">
          {SERVICES_FAQ.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={[
                  "svc-faq__item",
                  isOpen ? "svc-faq__item--open" : "",
                ].join(" ")}
              >
                <button
                  type="button"
                  className="svc-faq__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                >
                  <span className="svc-faq__question">{item.question}</span>
                  <span className="svc-faq__icon" aria-hidden="true" />
                </button>

                <div
                  id={panelId}
                  className="svc-faq__panel"
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <div className="svc-faq__panel-inner">
                    <p className="svc-faq__answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  const trackRef = useRef(null);
  const techTrackRef = useRef(null);
  const creativeProcess = useProcessVisibility();
  const techProcess = useProcessVisibility();
  const { activeBeat, dotProgress, isStatic } = useStoryScroll(
    trackRef,
    SERVICES_BEATS.length,
  );
  const {
    activeBeat: techActiveBeat,
    dotProgress: techDotProgress,
    isStatic: techIsStatic,
  } = useStoryScroll(techTrackRef, TECHNOLOGY_BEATS.length);
  const [portfolioCtaShown, setPortfolioCtaShown] = useState(false);

  useEffect(() => {
    if (isStatic || activeBeat >= PHOTO_BEAT_INDEX) {
      setPortfolioCtaShown(true);
    }
  }, [activeBeat, isStatic]);

  return (
    <main className="page-services">
      <section className="home-intro" aria-label="Services introduction">
        <div className="home-intro__inner">
          <p className="home-intro__eyebrow">Our services</p>
          <h1 className="home-intro__headline">
            Everything your brand needs, under one roof.
          </h1>
          <p className="home-intro__body">
            From strategy and identity to content, code, and campaigns — Nextale
            runs creative and technology together so nothing gets lost in
            translation.
          </p>
        </div>
      </section>

      <section
        className={[
          "svc-story-track",
          isStatic ? "svc-story-track--static" : "",
        ].join(" ")}
        aria-label="Creative services"
        ref={trackRef}
        style={{ "--story-beats": SERVICES_BEATS.length }}
      >
        <div className="svc-story">
          <div className="svc-story__layout">
            <div className="svc-story__category-col">
              <p className="svc-story__category-label">{CATEGORY_LABEL}</p>
              <p
                className={[
                  "svc-story__portfolio-cta",
                  portfolioCtaShown ? "svc-story__portfolio-cta--visible" : "",
                ].join(" ")}
                aria-hidden={!portfolioCtaShown && !isStatic}
              >
                Curious what we&apos;ve made?{" "}
                <Link href={PORTFOLIO_HREF} className="home-story__inline-link">
                  See our work
                </Link>
              </p>
            </div>

            <div className="home-story__rail svc-story__rail" aria-hidden="true">
              <span className="home-story__line" />
              <span
                className="home-story__dot"
                style={{ top: `${dotProgress * 100}%` }}
              />
            </div>

            <div
              className={[
                "svc-story__slides",
                !isStatic ? "svc-story__slides--pinned" : "",
              ].join(" ")}
            >
              {!isStatic ? (
                <SvcStoryNumRoll
                  beats={SERVICES_BEATS}
                  activeBeat={activeBeat}
                />
              ) : null}

              {SERVICES_BEATS.map((beat, index) => (
                <article
                  key={beat.id}
                  className={[
                    "svc-story__slide",
                    `svc-story__slide--${beat.id}`,
                    !isStatic && activeBeat === index
                      ? "svc-story__slide--active"
                      : "",
                    isStatic ? "svc-story__slide--static" : "",
                  ].join(" ")}
                >
                  <ServiceSlideHeader beat={beat} pinned={!isStatic} />

                  {beat.type === "social" ? (
                    <SocialReelStrip
                      beat={beat}
                      isActive={!isStatic && activeBeat === index}
                    />
                  ) : null}

                  {beat.type === "video" ? (
                    <VideoCarousel
                      beat={beat}
                      isActive={!isStatic && activeBeat === index}
                    />
                  ) : null}

                  {beat.type === "photo" ? (
                    <ProductPhotoGrid photos={beat.photos} />
                  ) : null}

                  {beat.images?.length > 0 ? (
                    <div
                      className={[
                        "svc-story__visuals",
                        hasMosaicLayout(beat.images)
                          ? "svc-story__visuals--mosaic"
                          : "",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {beat.images.map((item, imageIndex) => (
                        <figure
                          key={imageIndex}
                          className={[
                            "svc-story__visual-item",
                            item.slot
                              ? `svc-story__visual-item--${item.slot}`
                              : "",
                          ].join(" ")}
                          style={{
                            "--shot-delay": `${imageIndex * 0.12}s`,
                          }}
                        >
                          {item.label ? (
                            <figcaption
                              className={[
                                "svc-story__callout",
                                item.calloutSide
                                  ? `svc-story__callout--${item.calloutSide}`
                                  : "",
                              ].join(" ")}
                            >
                              <span className="svc-story__callout-label">
                                {item.label}
                              </span>
                              {item.calloutSide ? (
                                <ServiceCalloutArrow side={item.calloutSide} />
                              ) : null}
                            </figcaption>
                          ) : null}
                          <Image
                            src={item.src ?? item}
                            alt=""
                            className="svc-story__shot"
                            sizes="(max-width: 900px) 45vw, 280px"
                          />
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceProcessCard
        steps={CREATIVE_PROCESS_STEPS}
        cardRef={creativeProcess.cardRef}
        visible={creativeProcess.visible}
        ariaLabel="Creative process"
      />

      <section
        className={[
          "svc-story-track",
          "svc-story-track--technology",
          techIsStatic ? "svc-story-track--static" : "",
        ].join(" ")}
        aria-label="Technology services"
        ref={techTrackRef}
        style={{ "--story-beats": TECHNOLOGY_BEATS.length }}
      >
        <div className="svc-story">
          <div className="svc-story__layout svc-story__layout--mirror">
            <p className="svc-story__category-label">{TECHNOLOGY_LABEL}</p>

            <div className="home-story__rail svc-story__rail" aria-hidden="true">
              <span className="home-story__line" />
              <span
                className="home-story__dot"
                style={{ top: `${techDotProgress * 100}%` }}
              />
            </div>

            <div
              className={[
                "svc-story__slides",
                !techIsStatic ? "svc-story__slides--pinned" : "",
              ].join(" ")}
            >
              {!techIsStatic ? (
                <SvcStoryNumRoll
                  beats={TECHNOLOGY_BEATS}
                  activeBeat={techActiveBeat}
                />
              ) : null}

              {TECHNOLOGY_BEATS.map((beat, index) => (
                <article
                  key={beat.id}
                  className={[
                    "svc-story__slide",
                    `svc-story__slide--${beat.id}`,
                    !techIsStatic && techActiveBeat === index
                      ? "svc-story__slide--active"
                      : "",
                    techIsStatic ? "svc-story__slide--static" : "",
                  ].join(" ")}
                >
                  <ServiceSlideHeader beat={beat} pinned={!techIsStatic} />

                  {beat.type === "showcase" ? (
                    <TechShowcase src={beat.image} />
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SvcPortfolioStrip>
        Want to see it in practice?{" "}
        <Link href={PORTFOLIO_HREF} className="home-story__inline-link">
          Browse our portfolio
        </Link>
      </SvcPortfolioStrip>

      <ServiceProcessCard
        steps={TECHNOLOGY_PROCESS_STEPS}
        cardRef={techProcess.cardRef}
        visible={techProcess.visible}
        ariaLabel="Technology process"
      />

      <ServicesFaq />
    </main>
  );
}
