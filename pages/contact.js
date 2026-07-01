import { ContactWizard } from "@/components/contact/ContactWizard";
import { useContactForm } from "@/hooks/useContactForm";

export default function ContactPage() {
  const form = useContactForm();

  return (
    <main className="page page--contact-wizard">
      <ContactWizard form={form} />
    </main>
  );
}
