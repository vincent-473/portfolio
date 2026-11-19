"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { certifications, education, marquee, skillGroups } from "@/lib/data";
import { SectionHead, Reveal } from "./ui";

export default function Skills() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === active)!;

  return (
    <section id="skills" className="overflow-hidden py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead index="05" kicker="Toolbox" title="The stack I reach for," accent="by layer." />
      </div>

      {/* marquee */}
      <div className="relative mb-16 border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <ul key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center">
              {marquee.map((m, i) => (
                <li key={m} className="flex items-center whitespace-nowrap">
                  <span
                    className={`px-6 text-4xl tracking-tight sm:text-6xl ${
                      i % 3 === 1 ? "font-serif italic text-go" : "font-semibold text-fg/90"
                    }`}
                  >
                    {m}
                  </span>
                  <span className="text-xl text-dim">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-16">
            <div
              role="tablist"
              aria-label="Skill categories"
              className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:px-0"
            >
              {skillGroups.map((g, i) => {
                const on = g.id === active;
                return (
                  <button
                    key={g.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(g.id)}
                    className={`relative flex shrink-0 items-center gap-4 whitespace-nowrap rounded-full border px-4 py-2.5 text-left text-sm transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-4 lg:text-lg ${
                      on ? "border-go text-fg" : "border-line text-mute hover:text-fg"
                    }`}
                  >
                    <span className={`hidden font-mono text-[11px] lg:inline ${on ? "text-go" : "text-dim"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {g.label}
                    <span className="ml-auto hidden font-mono text-[11px] text-dim lg:inline">{g.items.length}</span>
                    {on && (
                      <motion.span
                        layoutId="skill-underline"
                        className="absolute inset-x-0 -bottom-px hidden h-px bg-go lg:block"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div role="tabpanel" className="lg:sticky lg:top-28 lg:min-h-[17rem] lg:self-start lg:pt-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={group.id}
                  className="flex flex-wrap gap-2.5"
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  variants={{ show: { transition: { staggerChildren: 0.025 } } }}
                >
                  {group.items.map((item) => (
                    <motion.li
                      key={item}
                      variants={{
                        hidden: { opacity: 0, y: 14, scale: 0.96 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                      }}
                      className="rounded-xl border border-line bg-panel px-4 py-2.5 text-base transition-colors hover:border-go hover:text-go sm:px-5 sm:py-3 sm:text-xl"
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* certifications + education */}
        <div className="mt-28 grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mute">Education</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">{education.school}</h3>
            <p className="mt-1 text-mute">{education.degree}</p>
            <p className="mt-3 font-mono text-xs text-dim">
              {education.place} · {education.period}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mute">
              Certifications <span className="text-dim">({certifications.length})</span>
            </p>
            <ul className="mt-4 grid sm:grid-cols-2 sm:gap-x-10">
              {certifications.map((c) => (
                <li
                  key={c.name}
                  className="group flex items-baseline justify-between gap-4 border-b border-line py-3.5 transition-colors hover:border-go"
                >
                  <span className="text-[15px] transition-colors group-hover:text-go">{c.name}</span>
                  <span className="shrink-0 text-right font-mono text-[11px] text-dim">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
