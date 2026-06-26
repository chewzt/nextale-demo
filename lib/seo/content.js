const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nextale-demo.vercel.app"
).replace(/\/$/, "");

export const SITE = {
  name: "Nextale",
  tagline: "From Paper to Pixel",
  url: SITE_URL,
  description:
    "Nextale is a creative and technology agency helping SMEs build brand identity, social-first content, and scalable digital products — from logos and campaigns to websites, apps, and automation.",
  contactPath: "/contact",
  disciplines: ["Creative", "Technology"],
};

export const SERVICES = {
  creative: {
    name: "Creative",
    descriptor: "Brand, content, and visual storytelling.",
    items: [
      {
        title: "Brand & Identity",
        description:
          "Logos, naming, and visual systems that help SMEs look established from day one.",
      },
      {
        title: "Social Media Marketing",
        description:
          "Content and always-on campaigns that build a genuine, engaged following.",
      },
      {
        title: "Video Production",
        description:
          "Brand films, ads, and social video — shot, directed, and edited in-house.",
      },
      {
        title: "Product Photography",
        description:
          "Studio-quality product and lifestyle imagery built to sell.",
      },
    ],
  },
  technology: {
    name: "Technology",
    descriptor: "Websites, apps, and systems that scale.",
    items: [
      {
        title: "Web Development",
        description:
          "Fast, scalable websites and storefronts built to last.",
      },
      {
        title: "Mobile Apps",
        description:
          "iOS and Android apps from prototype through App Store launch.",
      },
      {
        title: "System Development",
        description:
          "Custom platforms that replace spreadsheets and manual workflows.",
      },
      {
        title: "Automation & APIs",
        description:
          "Connect your stack and automate the busywork behind the scenes.",
      },
    ],
  },
};

export const FAQ = [
  {
    question: "What does Nextale do?",
    answer:
      "Nextale is a creative and technology agency that partners with SMEs to build brand identity, social-first content, and scalable digital products. We operate across two disciplines — Creative (branding, social media, video, photography) and Technology (websites, mobile apps, custom systems, automation) — under shared standards, from paper to pixel.",
  },
  {
    question: "What creative services does Nextale offer?",
    answer:
      "Nextale offers Brand & Identity (logos, naming, visual systems), Social Media Marketing (strategy, content, community management), Video Production (brand films, product videos, platform-native storytelling), and Product Photography (studio and lifestyle imagery for e-commerce and campaigns). All creative work is produced in-house.",
  },
  {
    question: "What technology services does Nextale offer?",
    answer:
      "Nextale offers Web Development (fast, scalable websites and storefronts), Mobile Apps (iOS and Android from prototype to App Store launch), System Development (custom platforms replacing manual workflows), and Automation & APIs (connecting your stack and automating repetitive tasks behind the scenes).",
  },
  {
    question: "What services does Nextale offer?",
    answer:
      "Nextale offers eight core services across Creative and Technology: Brand & Identity, Social Media Marketing, Video Production, Product Photography, Web Development, Mobile Apps, System Development, and Automation & APIs. Creative covers brand, content, and visual storytelling; Technology covers websites, apps, systems, and automation.",
  },
  {
    question: "How do I start a project with Nextale?",
    answer:
      "Visit the contact page at /contact and tell us about your brand and what you want to build. The Nextale team replies within one business day to explore scope, timeline, and how creative and technology services can help.",
  },
];

function formatServiceList(items) {
  return items
    .map((item) => `- ${item.title} — ${item.description}`)
    .join("\n");
}

export function buildLlmsTxt() {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.tagline} — creative and technology agency.`,
    "",
    "## About",
    SITE.description,
    "",
    "## Disciplines",
    "",
    `### ${SERVICES.creative.name}`,
    SERVICES.creative.descriptor,
    formatServiceList(SERVICES.creative.items),
    "",
    `### ${SERVICES.technology.name}`,
    SERVICES.technology.descriptor,
    formatServiceList(SERVICES.technology.items),
    "",
    "## Common questions",
    "",
    ...FAQ.flatMap((item) => [
      `### ${item.question}`,
      item.answer,
      "",
    ]),
    "## Links",
    `- Website: ${SITE.url}`,
    `- Services: ${SITE.url}/services`,
    `- Work: ${SITE.url}/work`,
    `- Contact: ${SITE.url}${SITE.contactPath}`,
    "",
    "## Entity",
    `- Name: ${SITE.name}`,
    "- Type: Creative and technology agency",
    `- Tagline: ${SITE.tagline}`,
  ];

  return lines.join("\n");
}
