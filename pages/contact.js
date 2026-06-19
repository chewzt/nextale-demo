import {
  SERVICES_OPTIONS,
  useContactForm,
} from "../plugins/formLogic";

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

        <form className="contact-form" onSubmit={form.submit} noValidate>
          <div
            className={[
              "contact-form__field",
              form.errors.name ? "contact-form__field--error" : "",
            ].join(" ")}
          >
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Tan"
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
              placeholder="jane@company.com"
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
              placeholder="Optional"
              value={form.fields.company}
              onChange={form.handleChange}
            />
          </div>

          <div className="contact-form__field">
            <label htmlFor="budget">Budget range</label>
            <input
              id="budget"
              name="budget"
              type="text"
              placeholder="e.g. RM 20k – 50k"
              value={form.fields.budget}
              onChange={form.handleChange}
            />
          </div>

          <fieldset className="contact-form__services">
            <legend className="contact-form__services-label">
              What can we help with?
            </legend>
            <div className="contact-form__services-list">
              {SERVICES_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={[
                    "contact-form__service-btn btn btn--chip",
                    form.fields.services.includes(option)
                      ? "contact-form__service-btn--active"
                      : "",
                  ].join(" ")}
                  aria-pressed={form.fields.services.includes(option)}
                  onClick={() => form.handleServicesToggle(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div
            className={[
              "contact-form__field",
              form.errors.message ? "contact-form__field--error" : "",
            ].join(" ")}
          >
            <label htmlFor="message">Your message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="A few lines on what you're building and where you'd like help."
              value={form.fields.message}
              onChange={form.handleChange}
            />
            {form.errors.message && (
              <p className="contact-form__error">{form.errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="contact-form__submit btn btn--primary"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? "Sending…" : "Submit"}
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
