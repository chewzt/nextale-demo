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

export const TOTAL_WIZARD_STEPS = 6;

const INITIAL_FIELDS = {
  name: "",
  email: "",
  company: "",
  services: [],
  username_hp: "",
};

function validateStep(step, fields) {
  const errors = {};

  if (step === 1 && !fields.name.trim()) {
    errors.name = "Name is required";
  }

  if (step === 2) {
    if (!fields.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = "Enter a valid email";
    }
  }

  if (step === 4 && fields.services.length === 0) {
    errors.services = "Select at least one service";
  }

  return errors;
}

function validateAll(fields) {
  return {
    ...validateStep(1, fields),
    ...validateStep(2, fields),
    ...validateStep(4, fields),
  };
}

export function useContactForm() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [step, setStep] = useState(0);

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
    setErrors((prev) => {
      if (!prev.services) return prev;
      const next = { ...prev };
      delete next.services;
      return next;
    });
    setStatus((prev) => (prev === "error" ? "idle" : prev));
  }, []);

  const goBack = useCallback(() => {
    setStep((current) => Math.max(0, current - 1));
    setErrors({});
    setStatus((prev) => (prev === "error" ? "idle" : prev));
  }, []);

  const restart = useCallback(() => {
    setFields({ ...INITIAL_FIELDS, services: [] });
    setErrors({});
    setStatus("idle");
    setStep(0);
  }, []);

  const submit = useCallback(async () => {
    const validationErrors = validateAll(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
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
      setStep(5);
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }, [fields]);

  const goNext = useCallback(async () => {
    if (step === 0) {
      setStep(1);
      return;
    }

    if (step === 4) {
      await submit();
      return;
    }

    const validationErrors = validateStep(step, fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStep((current) => current + 1);
  }, [step, fields, submit]);

  return {
    fields,
    errors,
    status,
    step,
    totalSteps: TOTAL_WIZARD_STEPS,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    isError: status === "error",
    handleChange,
    handleServicesToggle,
    goNext,
    goBack,
    restart,
  };
}
