"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { profile, sections } from "@/lib/data";

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-go"
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#top"
          className="flex h-10 items-center gap-2 rounded-full border border-line bg-ink/70 px-4 font-mono text-sm backdrop-blur-md"
          aria-label="Back to top"
        >
          <span className="text-go">~/</span>
          {profile.initials}
        </a>

        <nav
          aria-label="Sections"
          className={`hidden items-center rounded-full border px-1.5 backdrop-blur-md transition-colors duration-300 md:flex ${
            scrolled ? "border-line bg-ink/70" : "border-transparent"
          }`}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative px-3.5 py-2.5 text-[13px] transition-colors ${
                active === s.id ? "text-fg" : "text-mute hover:text-fg"
              }`}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-1 inset-y-1.5 rounded-full bg-white/8"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </a>
          ))}
        </nav>

        <a
          href={`mailto:${profile.email}`}
          className="flex h-10 items-center rounded-full border border-line bg-ink/70 px-4 text-[13px] backdrop-blur-md transition-colors hover:border-go hover:text-go"
        >
          Email me
        </a>
      </div>
    </header>
  );
}
