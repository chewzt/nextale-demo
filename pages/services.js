export default function ServicesPage() {
  return (
    <main className="page page--services">
      <header className="page-header">
        <p className="page-header__eyebrow">What we do</p>
        <h1 className="page-header__title">Services</h1>
        <p className="page-header__lead">
          Strategy, content, and production — built for brands that need to move
          fast without sacrificing craft.
        </p>
      </header>

      <section className="services-grid">
        <article className="services-card">
          <span className="services-card__num">01</span>
          <h2 className="services-card__title">Social Media Management</h2>
          <p className="services-card__body">
            Planning, publishing, and community — we keep your channels active
            and on-brand.
          </p>
        </article>
        <article className="services-card">
          <span className="services-card__num">02</span>
          <h2 className="services-card__title">Content Creation</h2>
          <p className="services-card__body">
            Photography, reels, and copy tailored to how your audience actually
            scrolls.
          </p>
        </article>
        <article className="services-card">
          <span className="services-card__num">03</span>
          <h2 className="services-card__title">Video Production</h2>
          <p className="services-card__body">
            Concept through final cut — campaign films, product videos, and
            platform-native storytelling.
          </p>
        </article>
      </section>
    </main>
  );
}
