import { ContactForm, useContactForm } from "../plugins/formLogic";

export default function ContactPage() {
  const form = useContactForm();

  return (
    <main className="page page--contact">
      <div className="contact-layout">
        <header className="contact-copy">
          <p className="page-header__eyebrow">Contact</p>
          <h1 className="page-header__title">Start a project</h1>
          <p className="page-header__lead">
            Tell us about your brand and what you want to build. We&apos;ll
            reply within one business day.
          </p>
        </header>

        <ContactForm form={form} variant="page" />
      </div>
    </main>
  );
}
