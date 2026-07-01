import {
  assertMailerConfig,
  sendContactNotification,
} from "@/lib/mailer";

const SUCCESS_MESSAGE = { message: "Message sent successfully." };

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const body = req.body ?? {};

  if (isNonEmptyString(body.username_hp)) {
    return res.status(200).json(SUCCESS_MESSAGE);
  }

  if (!isNonEmptyString(body.name) || !isNonEmptyString(body.email)) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    assertMailerConfig();
    await sendContactNotification(body);
    return res.status(200).json(SUCCESS_MESSAGE);
  } catch (error) {
    console.error("Mailer error:", error);
    return res.status(500).json({ message: "Unable to send message." });
  }
}
