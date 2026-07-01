import Head from "next/head";
import { SITE } from "@/lib/seo/content";

export default function PageHead({ title, description, path }) {
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
