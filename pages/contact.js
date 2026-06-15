import { useContactForm } from "../plugins/formLogic";

export default function ContactPage() {
  const form = useContactForm();

  return (
    <main className="page page--contact">
      <div className="contact-layout">
        <header className="contact-copy">
          <p className="page-header__eyebrow">Get in touch</p>
          <h1 className="page-header__title">Start a project</h1>
          <p className="page-header__lead">
            Tell us about your brand and what you want to build. We respond
            within two business days.
          </p>
        </header>

        <form className="contact-form" onSubmit={form.submit} noValidate>
          <div
            className={[
              "contact-form__field",
              form.errors.name ? "contact-form__field--error" : "",
            ].join(" ")}
          >
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.fields.name}
              onChange={form.handleChange}
            />
            {form.errors.name && (
              <p className="contact-form__error">{form.errors.name}</p>
            )}
          </div>

          <div
            className={[
              "contact-form__field",
              form.errors.email ? "contact-form__field--error" : "",
            ].join(" ")}
          >
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.fields.email}
              onChange={form.handleChange}
            />
            {form.errors.email && (
              <p className="contact-form__error">{form.errors.email}</p>
            )}
          </div>

          <div className="contact-form__field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              value={form.fields.company}
              onChange={form.handleChange}
            />
          </div>

          <div
            className={[
              "contact-form__field",
              form.errors.message ? "contact-form__field--error" : "",
            ].join(" ")}
          >
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.fields.message}
              onChange={form.handleChange}
            />
            {form.errors.message && (
              <p className="contact-form__error">{form.errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="contact-form__submit"
            disabled={form.isSubmitting}
          >
            <span>{form.isSubmitting ? "Sending…" : "Send message"}</span>
          </button>

          {form.isSuccess && (
            <p className="contact-form__success">
              Message sent — we&apos;ll be in touch soon.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
