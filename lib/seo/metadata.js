import Head from "next/head";
import { SITE } from "./content";

export const HOME_META = {
  title: "Nextale — Creative & Technology Agency",
  description: SITE.description,
  path: "/",
};

export const SERVICES_META = {
  title: "Services — Nextale",
  description:
    "From strategy and identity to content, code, and campaigns — Nextale runs creative and technology together so nothing gets lost in translation.",
  path: "/services",
};

export function PageHead({ title, description, path }) {
  const canonicalUrl = `${SITE.url}${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="llms" href="/llms.txt" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
    </Head>
  );
}
