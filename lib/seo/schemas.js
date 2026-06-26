import { SERVICES, SITE } from "./content";

const ORGANIZATION_ID = `${SITE.url}/#organization`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/assets/nextale-logo.png`,
    slogan: SITE.tagline,
    description: SITE.description,
    knowsAbout: [
      "Brand identity",
      "Social media marketing",
      "Video production",
      "Product photography",
      "Web development",
      "Mobile app development",
      "System development",
      "Automation and APIs",
    ],
    sameAs: [],
  };
}

function buildOfferCatalog(discipline) {
  return {
    "@type": "OfferCatalog",
    name: discipline.name,
    itemListElement: discipline.items.map((item) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item.title,
        description: item.description,
      },
    })),
  };
}

export function creativeServiceSchema() {
  return {
    "@type": "Service",
    "@id": `${SITE.url}/#creative-services`,
    name: "Creative Services",
    serviceType: "Creative Services",
    description: SERVICES.creative.descriptor,
    provider: { "@id": ORGANIZATION_ID },
    hasOfferCatalog: buildOfferCatalog(SERVICES.creative),
  };
}

export function technologyServiceSchema() {
  return {
    "@type": "Service",
    "@id": `${SITE.url}/#technology-services`,
    name: "Technology Services",
    serviceType: "Technology Services",
    description: SERVICES.technology.descriptor,
    provider: { "@id": ORGANIZATION_ID },
    hasOfferCatalog: buildOfferCatalog(SERVICES.technology),
  };
}

export function buildAgencySchemas() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      creativeServiceSchema(),
      technologyServiceSchema(),
    ],
  };
}
