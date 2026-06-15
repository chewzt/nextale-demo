import { useCallback, useState } from "react";

const INITIAL_FIELDS = {
  name: "",
  email: "",
  company: "",
  message: "",
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
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setStatus("success");
      setFields(INITIAL_FIELDS);
    },
    [fields]
  );

  return {
    fields,
    errors,
    status,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    handleChange,
    submit,
  };
}
