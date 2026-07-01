import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GOOGLE_SMTP_USER,
        pass: process.env.GOOGLE_SMTP_PASS,
      },
    });
  }
  return transporter;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatServices(services) {
  if (Array.isArray(services) && services.length > 0) {
    return services.join(", ");
  }
  return "—";
}

function buildEmailContent({ name, email, company, services }) {
  const servicesText = formatServices(services);
  const companyText = company?.trim() || "—";

  const text = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${companyText}`,
    `Services: ${servicesText}`,
  ].join("\n");

  const html = `
    <h2>New contact form submission</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Company</strong></td><td>${escapeHtml(companyText)}</td></tr>
      <tr><td><strong>Services</strong></td><td>${escapeHtml(servicesText)}</td></tr>
    </table>
  `;

  return { text, html };
}

function buildFromAddress() {
  const displayName = process.env.EMAIL_FROM_NAME?.trim() || "Studio Bot";
  return `${displayName} <${process.env.GOOGLE_SMTP_USER}>`;
}

function buildSubject() {
  return process.env.EMAIL_SUBJECT?.trim() || "New Project Inquiry";
}

function buildCc() {
  const cc = process.env.EMAIL_CC?.trim();
  return cc || undefined;
}

export function assertMailerConfig() {
  const missing = [];
  if (!process.env.GOOGLE_SMTP_USER) missing.push("GOOGLE_SMTP_USER");
  if (!process.env.GOOGLE_SMTP_PASS) missing.push("GOOGLE_SMTP_PASS");
  if (!process.env.NOTIFICATION_RECEIVER) missing.push("NOTIFICATION_RECEIVER");
  if (missing.length > 0) {
    throw new Error(`Missing mailer env: ${missing.join(", ")}`);
  }
}

export async function sendContactNotification({
  name,
  email,
  company,
  services,
}) {
  assertMailerConfig();

  const { text, html } = buildEmailContent({
    name,
    email,
    company,
    services,
  });

  const mailOptions = {
    from: buildFromAddress(),
    to: process.env.NOTIFICATION_RECEIVER,
    replyTo: email,
    subject: buildSubject(),
    text,
    html,
  };

  const cc = buildCc();
  if (cc) {
    mailOptions.cc = cc;
  }

  await getTransporter().sendMail(mailOptions);
}
