import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedGroup } from "../plugins/AnimatedGroup";

const DEMO_ITEMS = ["Branding", "Social", "Video", "UI/UX", "Website", "Mobile"];

const PROCESS_LAB_STEPS = [
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

const VARIANTS = [
  { id: "bento", label: "Bento" },
  { id: "deck", label: "Deck" },
  { id: "typography", label: "Typography" },
];

function ProcessStepFields({ step, numClassName = "svc-process__num" }) {
  return (
    <>
      <span className={numClassName}>({step.num})</span>
      <h3 className="svc-process__step-title">{step.title}</h3>
      <p className="svc-process__step-body">{step.body}</p>
      <ul className="svc-process__tags">
        {step.tags.map((tag) => (
          <li key={tag} className="svc-process__tag">
            {tag}
          </li>
        ))}
      </ul>
    </>
  );
}

function ProcessVariantSwitcher({ activeVariant, onChange }) {
  return (
    <div className="svc-process__variant-switcher" role="tablist" aria-label="Process card variant">
      {VARIANTS.map((variant) => (
        <button
          key={variant.id}
          type="button"
          role="tab"
          aria-selected={activeVariant === variant.id}
          className={[
            "svc-process__variant-tab",
            activeVariant === variant.id ? "svc-process__variant-tab--active" : "",
          ].join(" ")}
          onClick={() => onChange(variant.id)}
        >
          {variant.label}
        </button>
      ))}
    </div>
  );
}

function ProcessBentoVariant({ steps }) {
  return (
    <div className="svc-process__bento-grid">
      {steps.map((step) => (
        <article key={step.num} className="svc-process__bento-card">
          <ProcessStepFields step={step} numClassName="svc-process__num svc-process__num--bento" />
        </article>
      ))}
    </div>
  );
}

function ProcessDeckVariant({ steps }) {
  const [deckIndex, setDeckIndex] = useState(0);
  const deckRef = useRef(null);
  const lastIndex = steps.length - 1;

  const goTo = useCallback(
    (index) => {
      setDeckIndex(Math.min(lastIndex, Math.max(0, index)));
    },
    [lastIndex],
  );

  const goPrev = useCallback(() => goTo(deckIndex - 1), [deckIndex, goTo]);
  const goNext = useCallback(() => goTo(deckIndex + 1), [deckIndex, goTo]);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  return (
    <div
      ref={deckRef}
      className="svc-process__deck"
      role="region"
      aria-roledescription="carousel"
      aria-label="Process steps"
      tabIndex={0}
      style={{ "--deck-index": deckIndex }}
    >
      <div className="svc-process__deck-viewport">
        <div className="svc-process__deck-track">
          {steps.map((step, index) => (
            <article
              key={step.num}
              className={[
                "svc-process__deck-slide",
                index === deckIndex ? "svc-process__deck-slide--active" : "",
              ].join(" ")}
              aria-hidden={index !== deckIndex}
            >
              <ProcessStepFields step={step} />
            </article>
          ))}
        </div>
      </div>

      <nav className="svc-process__deck-nav" aria-label="Process step navigation">
        <button
          type="button"
          className="svc-process__deck-arrow"
          onClick={goPrev}
          disabled={deckIndex === 0}
          aria-label="Previous step"
        >
          Back
        </button>

        <div className="svc-process__deck-dots" role="tablist" aria-label="Steps">
          {steps.map((step, index) => (
            <button
              key={step.num}
              type="button"
              role="tab"
              className={[
                "svc-process__deck-dot",
                index === deckIndex ? "svc-process__deck-dot--active" : "",
              ].join(" ")}
              aria-label={`Step ${step.num}: ${step.title}`}
              aria-current={index === deckIndex ? "step" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="svc-process__deck-arrow"
          onClick={goNext}
          disabled={deckIndex === lastIndex}
          aria-label="Next step"
        >
          Next
        </button>
      </nav>
    </div>
  );
}

function useTypographyFocus(steps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;

    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
        });

        let bestIndex = 0;
        let bestRatio = -1;

        nodes.forEach((node, index) => {
          const ratio = ratios.get(node) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });

        setFocusedIndex(bestIndex);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-35% 0px -35% 0px",
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps]);

  const setStepRef = useCallback((index) => {
    return (node) => {
      stepRefs.current[index] = node;
    };
  }, []);

  return { focusedIndex, setStepRef };
}

function ProcessTypographyVariant({ steps }) {
  const { focusedIndex, setStepRef } = useTypographyFocus(steps);

  return (
    <div className="svc-process__typo-flow">
      {steps.map((step, index) => (
        <article
          key={step.num}
          ref={setStepRef(index)}
          className={[
            "svc-process__typo-step",
            index === focusedIndex ? "svc-process__typo-step--focused" : "",
          ].join(" ")}
          aria-current={index === focusedIndex ? "step" : undefined}
        >
          <ProcessStepFields step={step} numClassName="svc-process__num svc-process__num--typo" />
        </article>
      ))}
      <div className="svc-process__typo-spacer" aria-hidden="true" />
    </div>
  );
}

function ProcessVariantLab({ steps }) {
  const [activeVariant, setActiveVariant] = useState("bento");

  return (
    <section
      className={[
        "svc-process",
        `svc-process--${activeVariant}`,
        "testing-process-lab",
      ].join(" ")}
      aria-label="Process variant lab"
    >
      <ProcessVariantSwitcher activeVariant={activeVariant} onChange={setActiveVariant} />

      <div className="svc-process__inner">
        <div className="svc-process__card svc-process--visible">
          <h2 className="svc-process__title">Our process</h2>

          {activeVariant === "bento" ? <ProcessBentoVariant steps={steps} /> : null}
          {activeVariant === "deck" ? <ProcessDeckVariant steps={steps} /> : null}
          {activeVariant === "typography" ? <ProcessTypographyVariant steps={steps} /> : null}

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

export default function TestingPage() {
  return (
    <>
      <style jsx global>{`
        .testing-page {
          min-height: 100vh;
          padding: calc(var(--nav-h) + 2rem) 1.25rem 4rem;
        }
        .testing-page__inner {
          width: var(--container);
          margin: 0 auto;
        }
        .testing-page__title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: 0.5rem;
        }
        .testing-page__lead {
          color: var(--text-muted);
          margin-bottom: 3rem;
        }
        .testing-page__section {
          margin-bottom: 4rem;
        }
        .testing-page__section--process-lab {
          margin-bottom: 0;
        }
        .testing-page__section--process-lab .testing-page__lead {
          margin-bottom: 1.5rem;
        }
        .testing-page__label {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .testing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
        }
        .testing-card {
          padding: 1.25rem;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-family: var(--font-display);
          font-weight: 600;
        }
        .testing-process-lab.svc-process {
          border-top: none;
          padding-top: 0;
        }
        .ag-item--hidden {
          opacity: 0;
        }
        .ag-item {
          opacity: 0;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes ag-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes ag-slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ag-scale-in {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ag-blur-sm-in {
          from {
            opacity: 0;
            filter: blur(4px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes ag-blur-slide-in {
          from {
            opacity: 0;
            transform: translateY(16px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        .ag-fade {
          animation-name: ag-fade-in;
        }
        .ag-slide {
          animation-name: ag-slide-in;
        }
        .ag-scale {
          animation-name: ag-scale-in;
        }
        .ag-blur-sm {
          animation-name: ag-blur-sm-in;
        }
        .ag-blur-slide {
          animation-name: ag-blur-slide-in;
        }
        @media (prefers-reduced-motion: reduce) {
          .ag-item {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <main className="testing-page">
        <div className="testing-page__inner">
          <h1 className="testing-page__title">AnimatedGroup demo</h1>
          <p className="testing-page__lead">
            Scroll down — each row staggers in when it enters the viewport.
          </p>

          <section className="testing-page__section">
            <p className="testing-page__label">fade</p>
            <AnimatedGroup preset="fade" className="testing-grid">
              {DEMO_ITEMS.map((item) => (
                <div key={item} className="testing-card">
                  {item}
                </div>
              ))}
            </AnimatedGroup>
          </section>

          <section className="testing-page__section">
            <p className="testing-page__label">slide</p>
            <AnimatedGroup preset="slide" stagger={100} className="testing-grid">
              {DEMO_ITEMS.map((item) => (
                <div key={item} className="testing-card">
                  {item}
                </div>
              ))}
            </AnimatedGroup>
          </section>

          <section className="testing-page__section">
            <p className="testing-page__label">blur-slide</p>
            <AnimatedGroup preset="blur-slide" stagger={80} className="testing-grid">
              {DEMO_ITEMS.map((item) => (
                <div key={item} className="testing-card">
                  {item}
                </div>
              ))}
            </AnimatedGroup>
          </section>

          <section className="testing-page__section testing-page__section--process-lab">
            <p className="testing-page__label">Process variants</p>
            <h2 className="testing-page__title">Apple process card explorations</h2>
            <p className="testing-page__lead">
              Toggle variants below. Typography variant needs scroll.
            </p>
            <ProcessVariantLab steps={PROCESS_LAB_STEPS} />
          </section>
        </div>
      </main>
    </>
  );
}
