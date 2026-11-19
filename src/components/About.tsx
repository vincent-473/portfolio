"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { profile, stats } from "@/lib/data";
import { Reveal } from "./ui";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {children}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.5"] });
  const words = profile.summary.split(" ");

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-mute">
        <span className="text-go">01</span>
        <span className="h-px w-10 bg-line-strong" />
        About
      </p>

      <p
        ref={ref}
        className="max-w-5xl text-[clamp(1.5rem,3.3vw,2.75rem)] font-medium leading-[1.22] tracking-[-0.025em]"
      >
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 4) / words.length)]}>
            {w}
          </Word>
        ))}
      </p>

      <div className="mt-20 grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-b border-line py-8 pr-6 lg:border-b-0">
            <div className="font-serif text-6xl italic leading-none text-fg sm:text-7xl">{s.value}</div>
            <div className="mt-3 max-w-[14rem] text-sm leading-snug text-mute">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
