import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import logo from "../assets/nextale-logo.png";
import "../styles/globals.css";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Nextale — Creative Agency</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
        <div className="site-nav__inner">
          <Link href="/" className="site-nav__brand" aria-label="Nextale home">
            <Image
              src={logo}
              alt="Nextale"
              className="site-nav__logo"
              priority
            />
          </Link>

          <nav className="site-nav__links" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`site-nav__link ${
                  router.pathname === link.href ? "site-nav__link--active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="site-nav__cta">
              <span>Start a project</span>
            </Link>
          </nav>

          <button
            type="button"
            className="site-nav__burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={menuOpen ? "site-nav__burger-line--top" : ""} />
            <span className={menuOpen ? "site-nav__burger-line--mid" : ""} />
            <span className={menuOpen ? "site-nav__burger-line--bot" : ""} />
          </button>
        </div>

        <nav
          className={`site-nav__mobile ${menuOpen ? "site-nav__mobile--open" : ""}`}
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`site-nav__link ${
                router.pathname === link.href ? "site-nav__link--active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="site-nav__cta">
            <span>Start a project</span>
          </Link>
        </nav>
      </header>

      <Component {...pageProps} />

      <footer className="site-footer">
        <div className="site-footer__inner">
          <Link href="/" className="site-footer__brand">
            NEXTALE
          </Link>

          <nav className="site-footer__links" aria-label="Footer navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="site-footer__link">
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="site-footer__link">
              Contact
            </Link>
          </nav>

          <p className="site-footer__copy">
            © {new Date().getFullYear()} Nextale. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
