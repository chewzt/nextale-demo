const STEPS = [
  {
    title: "Discover",
    body: "We learn your brand, audience, and goals before anything is produced.",
  },
  {
    title: "Create",
    body: "Concept, shoot, edit — every deliverable built for the platform it lives on.",
  },
  {
    title: "Launch",
    body: "Content goes live with a rollout plan and clear performance benchmarks.",
  },
  {
    title: "Iterate",
    body: "We review results, refine the approach, and keep improving over time.",
  },
];

export default function ProcessPage() {
  return (
    <main className="page page--process">
      <header className="page-header">
        <p className="page-header__eyebrow">How we work</p>
        <h1 className="page-header__title">Process</h1>
        <p className="page-header__lead">
          A clear path from brief to delivery — no jargon, no guesswork.
        </p>
      </header>

      <section className="process-list">
        {STEPS.map((step, index) => (
          <article key={step.title} className="process-step">
            <span className="process-step__num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="process-step__title">{step.title}</h2>
            <p className="process-step__body">{step.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
