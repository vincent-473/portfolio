"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  index,
  kicker,
  title,
  accent,
  note,
}: {
  index: string;
  kicker: string;
  title: string;
  accent?: string;
  note?: string;
}) {
  return (
    <Reveal className="mb-12 sm:mb-16">
      <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-mute">
        <span className="text-go">{index}</span>
        <span className="h-px w-10 bg-line-strong" />
        {kicker}
      </p>
      <h2 className="max-w-4xl text-[clamp(2.1rem,5.4vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
        {title}{" "}
        {accent && <span className="font-serif font-normal italic tracking-[-0.01em] text-go">{accent}</span>}
      </h2>
      {note && <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">{note}</p>}
    </Reveal>
  );
}
