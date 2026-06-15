import { useState } from "react";

const TABS = [
  "Videos",
  "Fashion",
  "Socials",
  "Events",
  "Design",
  "Food",
  "Livestreams",
];

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const pages = 5;

  return (
    <main className="page page--work">
      <header className="portfolio-header">
        <h1 className="portfolio-header__title">Portfolio</h1>
        <nav className="portfolio-tabs" aria-label="Portfolio categories">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={[
                "portfolio-tabs__item",
                index === activeTab ? "portfolio-tabs__item--active" : "",
              ].join(" ")}
              onClick={() => {
                setActiveTab(index);
                setPage(0);
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <section className="portfolio-grid" aria-label={`${TABS[activeTab]} portfolio`}>
        <div className="portfolio-grid__cell portfolio-grid__cell--video">
          <div className="portfolio-grid__media portfolio-grid__media--video" />
          <span className="portfolio-grid__play" aria-hidden="true" />
        </div>
        <div className="portfolio-grid__cell">
          <div className="portfolio-grid__media portfolio-grid__media--a" />
        </div>
        <div className="portfolio-grid__cell">
          <div className="portfolio-grid__media portfolio-grid__media--b" />
        </div>
      </section>

      <footer className="portfolio-footer">
        <p className="portfolio-footer__label">{TABS[activeTab]} Portfolio</p>
        <div className="portfolio-footer__dots" aria-label="Portfolio pages">
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Page ${index + 1}`}
              className={[
                "portfolio-footer__dot",
                index === page ? "portfolio-footer__dot--active" : "",
              ].join(" ")}
              onClick={() => setPage(index)}
            />
          ))}
        </div>
      </footer>
    </main>
  );
}
