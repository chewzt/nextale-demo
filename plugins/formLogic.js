import { useCallback, useState } from "react";

export const SERVICES_OPTIONS = [
  "Branding",
  "Social Media",
  "Video / Photo",
  "UI/UX Design",
  "Website",
  "Mobile App",
  "System Dev",
];

const INITIAL_FIELDS = {
  name: "",
  email: "",
  company: "",
  budget: "",
  services: [],
  message: "",
  username_hp: "",
};

function validate(fields) {
  const errors = {};

  if (!fields.name.trim()) {
    errors.name = "Name is required";
  }

  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email";
  }

  if (!fields.message.trim()) {
    errors.message = "Tell us about your project";
  } else if (fields.message.trim().length < 20) {
    errors.message = "Message should be at least 20 characters";
  }

  return errors;
}

export function useContactForm() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setStatus((prev) => (prev === "error" ? "idle" : prev));
  }, []);

  const handleServicesToggle = useCallback((value) => {
    setFields((prev) => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter((service) => service !== value)
        : [...prev.services, value],
    }));
    setStatus((prev) => (prev === "error" ? "idle" : prev));
  }, []);

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      const validationErrors = validate(fields);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
      setStatus("submitting");
      try {
        const response = await fetch("/api/mailer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        if (!response.ok) throw new Error("submit failed");
        setStatus("success");
        setFields({ ...INITIAL_FIELDS, services: [] });
      } catch {
        setStatus("error");
      }
    },
    [fields]
  );

  return {
    fields,
    errors,
    status,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    isError: status === "error",
    handleChange,
    handleServicesToggle,
    submit,
  };
}

function HoneypotInput({ form }) {
  return (
    <input
      type="text"
      name="username_hp"
      value={form.fields.username_hp}
      onChange={form.handleChange}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="form-honeypot"
    />
  );
}

function ContactFormPage({ form }) {
  return (
    <form className="contact-form" onSubmit={form.submit} noValidate>
      <HoneypotInput form={form} />

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

      {form.isError && (
        <p className="contact-form__error-banner">
          Something went wrong. Please try again.
        </p>
      )}

      {form.isSuccess && (
        <p className="contact-form__success">
          Message sent — we&apos;ll be in touch soon.
        </p>
      )}
    </form>
  );
}

function ContactFormHome({ form }) {
  return (
    <form className="home-contact__form" onSubmit={form.submit} noValidate>
      <HoneypotInput form={form} />

      <div className="home-contact__row">
        <div
          className={[
            "home-contact__field",
            form.errors.name ? "home-contact__field--error" : "",
          ].join(" ")}
        >
          <label htmlFor="home-name">Your name</label>
          <input
            id="home-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Tan"
            value={form.fields.name}
            onChange={form.handleChange}
          />
          {form.errors.name && (
            <p className="home-contact__error">{form.errors.name}</p>
          )}
        </div>

        <div
          className={[
            "home-contact__field",
            form.errors.email ? "home-contact__field--error" : "",
          ].join(" ")}
        >
          <label htmlFor="home-email">Email</label>
          <input
            id="home-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            value={form.fields.email}
            onChange={form.handleChange}
          />
          {form.errors.email && (
            <p className="home-contact__error">{form.errors.email}</p>
          )}
        </div>
      </div>

      <div className="home-contact__row">
        <div className="home-contact__field">
          <label htmlFor="home-company">Company</label>
          <input
            id="home-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            value={form.fields.company}
            onChange={form.handleChange}
          />
        </div>

        <div className="home-contact__field">
          <label htmlFor="home-budget">Budget range</label>
          <input
            id="home-budget"
            name="budget"
            type="text"
            placeholder="e.g. RM 20k – 50k"
            value={form.fields.budget}
            onChange={form.handleChange}
          />
        </div>
      </div>

      <fieldset className="home-contact__services">
        <legend className="home-contact__services-label">
          What can we help with?
        </legend>
        <div className="home-contact__services-list">
          {SERVICES_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={[
                "home-contact__service-btn",
                form.fields.services.includes(option)
                  ? "home-contact__service-btn--active"
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
          "home-contact__field",
          form.errors.message ? "home-contact__field--error" : "",
        ].join(" ")}
      >
        <label htmlFor="home-message">Your message</label>
        <textarea
          id="home-message"
          name="message"
          rows={5}
          placeholder="A few lines on what you're building and where you'd like help."
          value={form.fields.message}
          onChange={form.handleChange}
        />
        {form.errors.message && (
          <p className="home-contact__error">{form.errors.message}</p>
        )}
      </div>

      <div className="home-contact__submit-row">
        <button
          type="submit"
          className="home-contact__submit btn btn--primary"
          disabled={form.isSubmitting}
        >
          {form.isSubmitting ? "Sending…" : "Submit"}
        </button>
        <p className="home-contact__submit-note">
          We&apos;ll reply within one business day.
        </p>
      </div>

      {form.isError && (
        <p className="home-contact__error-banner">
          Something went wrong. Please try again.
        </p>
      )}

      {form.isSuccess && (
        <p className="home-contact__success">
          Message sent — we&apos;ll be in touch soon.
        </p>
      )}
    </form>
  );
}

export function ContactForm({ form, variant = "page" }) {
  if (variant === "home") {
    return <ContactFormHome form={form} />;
  }
  return <ContactFormPage form={form} />;
}
