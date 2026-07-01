import { useEffect, useRef } from "react";
import { SERVICES_OPTIONS } from "@/hooks/useContactForm";

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

function WelcomeStep() {
  return (
    <div className="contact-wizard__panel">
      <p className="contact-wizard__eyebrow">Before we begin…</p>
      <h1 className="contact-wizard__title">Start a project</h1>
      <p className="contact-wizard__lead">
        Tell us a little about yourself and what you&apos;re building. We&apos;ll
        reply within one business day.
      </p>
    </div>
  );
}

function NameStep({ form, inputRef }) {
  return (
    <div className="contact-wizard__panel">
      <h2 className="contact-wizard__question">What&apos;s your name?</h2>
      <div
        className={[
          "contact-wizard__field",
          form.errors.name ? "contact-wizard__field--error" : "",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Full name"
          value={form.fields.name}
          onChange={form.handleChange}
          aria-invalid={Boolean(form.errors.name)}
          aria-describedby={form.errors.name ? "contact-name-error" : undefined}
        />
        {form.errors.name && (
          <p id="contact-name-error" className="contact-wizard__error">
            {form.errors.name}
          </p>
        )}
      </div>
    </div>
  );
}

function EmailStep({ form, inputRef }) {
  return (
    <div className="contact-wizard__panel">
      <h2 className="contact-wizard__question">How can we reach you?</h2>
      <div
        className={[
          "contact-wizard__field",
          form.errors.email ? "contact-wizard__field--error" : "",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.fields.email}
          onChange={form.handleChange}
          aria-invalid={Boolean(form.errors.email)}
          aria-describedby={
            form.errors.email ? "contact-email-error" : undefined
          }
        />
        {form.errors.email && (
          <p id="contact-email-error" className="contact-wizard__error">
            {form.errors.email}
          </p>
        )}
      </div>
    </div>
  );
}

function CompanyStep({ form, inputRef }) {
  return (
    <div className="contact-wizard__panel">
      <h2 className="contact-wizard__question">What company is this for?</h2>
      <div className="contact-wizard__field">
        <input
          ref={inputRef}
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Optional"
          value={form.fields.company}
          onChange={form.handleChange}
        />
      </div>
    </div>
  );
}

function ServicesStep({ form }) {
  return (
    <div className="contact-wizard__panel">
      <h2 className="contact-wizard__question">How can we help?</h2>
      <fieldset className="contact-wizard__services">
        <legend className="sr-only">Select services</legend>
        <div className="contact-wizard__services-list">
          {SERVICES_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={[
                "contact-wizard__service-btn btn btn--chip",
                form.fields.services.includes(option)
                  ? "contact-wizard__service-btn--active"
                  : "",
              ].join(" ")}
              aria-pressed={form.fields.services.includes(option)}
              onClick={() => form.handleServicesToggle(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {form.errors.services && (
          <p className="contact-wizard__error">{form.errors.services}</p>
        )}
      </fieldset>
    </div>
  );
}

function ThankYouStep() {
  return (
    <div className="contact-wizard__panel contact-wizard__panel--thanks">
      <h2 className="contact-wizard__title">Thank you</h2>
      <p className="contact-wizard__lead">
        Message sent — we&apos;ll be in touch within one business day.
      </p>
    </div>
  );
}

const STEP_INPUT_STEPS = new Set([1, 2, 3]);

export function ContactWizard({ form }) {
  const inputRef = useRef(null);
  const isThanks = form.step === 5;
  const isWelcome = form.step === 0;
  const isServices = form.step === 4;
  const showBack = form.step > 0 && !isThanks;

  useEffect(() => {
    if (!STEP_INPUT_STEPS.has(form.step)) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [form.step]);

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" || isThanks || isServices) return;
    if (event.target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    form.goNext();
  };

  const primaryLabel = isWelcome
    ? "Start"
    : isServices
      ? form.isSubmitting
        ? "Sending…"
        : "Submit"
      : "Next";

  return (
    <div className="contact-wizard" onKeyDown={handleKeyDown}>
      <div className="contact-wizard__inner">
        <p className="contact-wizard__progress" aria-live="polite">
          Page {form.step + 1} of {form.totalSteps}
        </p>

        <div className="contact-wizard__stage" aria-live="polite">
          {form.step === 0 && <WelcomeStep />}
          {form.step === 1 && <NameStep form={form} inputRef={inputRef} />}
          {form.step === 2 && <EmailStep form={form} inputRef={inputRef} />}
          {form.step === 3 && <CompanyStep form={form} inputRef={inputRef} />}
          {form.step === 4 && <ServicesStep form={form} />}
          {form.step === 5 && <ThankYouStep />}
        </div>

        {!isThanks && (
          <div className="contact-wizard__nav">
            {showBack && (
              <button
                type="button"
                className="contact-wizard__back btn btn--ghost"
                onClick={form.goBack}
                disabled={form.isSubmitting}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className="contact-wizard__next btn btn--primary"
              onClick={form.goNext}
              disabled={form.isSubmitting}
            >
              {primaryLabel}
            </button>
          </div>
        )}

        {form.isError && (
          <p className="contact-wizard__error-banner">
            Something went wrong. Please try again.
          </p>
        )}

        {isThanks && (
          <button
            type="button"
            className="contact-wizard__restart btn btn--ghost"
            onClick={form.restart}
          >
            Send another message
          </button>
        )}

        <HoneypotInput form={form} />
      </div>
    </div>
  );
}
