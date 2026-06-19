import { AnimatedGroup } from "../plugins/AnimatedGroup";

const DEMO_ITEMS = ["Branding", "Social", "Video", "UI/UX", "Website", "Mobile"];

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
        </div>
      </main>
    </>
  );
}
