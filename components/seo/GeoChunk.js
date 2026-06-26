export default function GeoChunk({ items, hidden = false }) {
  const Tag = hidden ? "aside" : "section";

  return (
    <Tag
      className={hidden ? "sr-only" : undefined}
      aria-label="About Nextale"
    >
      {items.map(({ question, answer }) => (
        <section key={question}>
          <h2>{question}</h2>
          <p>{answer}</p>
        </section>
      ))}
    </Tag>
  );
}
