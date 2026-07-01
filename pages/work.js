import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import desktopVideo from "../assets/landing-desktop-video.mp4";
import demoStillA from "../assets/services/productpicture/photo-13.jpg";
import demoStillC from "../assets/services/productpicture/photo-01.jpg";

function demoHeroDuoMedia(prefix) {
  return [
    { id: `${prefix}-hero`, type: "video", slot: "hero", src: desktopVideo },
    { id: `${prefix}-stack-a`, type: "image", slot: "stack-a", src: demoStillA },
    { id: `${prefix}-stack-b`, type: "image", slot: "stack-b", src: demoStillC },
  ];
}

const WORK_PROJECTS = [
  {
    id: "meridian-coffee",
    title: "Meridian Coffee",
    tags: ["Brand & Identity", "Product Photography"],
    description:
      "Placeholder — brand identity and product imagery for a specialty coffee launch.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("meridian"),
  },
  {
    id: "brightwave-health",
    title: "Brightwave Health",
    tags: ["Video Production", "Web Development"],
    description:
      "Placeholder — brand film and marketing site for a digital health platform.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("brightwave"),
  },
  {
    id: "heimdall-labs",
    title: "Heimdall Labs",
    tags: ["System Development", "Automation & APIs"],
    description:
      "Placeholder — custom operations platform replacing manual workflows.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("heimdall"),
  },
  {
    id: "rainfall-ventures",
    title: "Rainfall Ventures",
    tags: ["Brand & Identity", "Social Media Marketing"],
    description:
      "Placeholder — visual identity and always-on social for a venture fund.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("rainfall"),
  },
  {
    id: "space-capital",
    title: "Space Capital",
    tags: ["Web Development", "Mobile Apps"],
    description:
      "Placeholder — responsive web experience and companion mobile app.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("space"),
  },
  {
    id: "goodroots-homes",
    title: "GoodRoots Homes",
    tags: ["Brand & Identity", "Web Development"],
    description:
      "Placeholder — rebrand and storefront for a shared-equity housing startup.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("goodroots"),
  },
  {
    id: "cula-carbon",
    title: "Cula Carbon",
    tags: ["Product Photography", "Video Production"],
    description:
      "Placeholder — product visuals and explainer video for a climate tech company.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("cula"),
  },
  {
    id: "analog-way",
    title: "Analog Way",
    tags: ["Social Media Marketing", "Video Production", "Mobile Apps"],
    description:
      "Placeholder — social campaigns, short-form video, and app launch content.",
    mediaLayout: "hero-duo",
    media: demoHeroDuoMedia("analog"),
  },
];

function WorkHero() {
  return (
    <section className="home-intro" aria-label="Portfolio introduction">
      <div className="home-intro__inner">
        <h1 className="home-intro__headline">
          Everything from identity to launch — selected work from the Nextale
          studio.
        </h1>
        <p className="home-intro__body">
          Creative and technology projects built with intention, craft, and a
          clear point of view.
        </p>
      </div>
    </section>
  );
}

function WorkMediaTile({ item, isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || item.type !== "video") return undefined;

    let timeoutId = null;

    if (isActive) {
      video.play().catch(() => {});
    } else {
      timeoutId = setTimeout(() => {
        video.pause();
        video.currentTime = 0;
      }, 550);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isActive, item.type]);

  if (item.type === "video") {
    return (
      <video
        ref={videoRef}
        className="work-gallery__video"
        src={item.src}
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    );
  }

  if (item.type === "image") {
    return (
      <Image
        src={item.src}
        alt=""
        className="work-gallery__img"
        fill
        sizes="(max-width: 900px) 100vw, 42vw"
        placeholder="blur"
        priority={isActive}
      />
    );
  }

  return <div className="work-gallery__placeholder" aria-hidden="true" />;
}

function WorkProjectGallery({ layout, media, isActive }) {
  const hero = media.find((item) => item.slot === "hero");
  const stacks = media.filter((item) => item.slot?.startsWith("stack"));

  return (
    <div className={["work-gallery", `work-gallery--${layout}`].join(" ")}>
      <div className="work-gallery__hero">
        {hero ? <WorkMediaTile item={hero} isActive={isActive} /> : null}
      </div>
      <div className="work-gallery__stacks">
        {stacks.map((item) => (
          <div
            key={item.id}
            className={[
              "work-gallery__stack",
              item.slot ? `work-gallery__stack--${item.slot}` : "",
            ].join(" ")}
          >
            <WorkMediaTile item={item} isActive={isActive} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkRow({ project, isActive, onToggleTouch }) {
  const handleClick = () => {
    onToggleTouch(project.id);
  };

  return (
    <article
      className={["work-row", isActive ? "work-row--active" : ""].join(" ")}
      onClick={handleClick}
      aria-expanded={isActive}
    >
      <div className="work-row__meta">
        <h2 className="work-row__title">{project.title}</h2>
        <p className="work-row__desc">{project.description}</p>
        <ul className="work-row__tags">
          {project.tags.map((tag) => (
            <li key={tag} className="work-row__tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="work-row__reveal" aria-hidden={!isActive}>
        <div className="work-row__reveal-inner">
          <WorkProjectGallery
            layout={project.mediaLayout}
            media={project.media}
            isActive={isActive}
          />
        </div>
      </div>
    </article>
  );
}

function WorkCta() {
  return (
    <section className="work-cta" aria-label="Collaborate with Nextale">
      <div className="work-cta__inner">
        <h2 className="work-cta__headline">Ready to collaborate with us?</h2>
        <Link href="/contact" className="btn btn--dark work-cta__btn">
          Let&apos;s do it
          <span className="work-cta__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function WorkPage() {
  const [activeId, setActiveId] = useState(WORK_PROJECTS[0]?.id ?? null);

  const handleToggleTouch = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="page-work">
      <WorkHero />

      <section className="work-accordion" aria-label="Portfolio projects">
        {WORK_PROJECTS.map((project) => (
          <WorkRow
            key={project.id}
            project={project}
            isActive={activeId === project.id}
            onToggleTouch={handleToggleTouch}
          />
        ))}
      </section>

      <WorkCta />
    </main>
  );
}
