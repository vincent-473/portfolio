"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { systems, type System } from "@/lib/data";
import { SectionHead } from "./ui";

const TONE: Record<System["tone"], { rgb: string; text: string; bg: string }> = {
  go: { rgb: "63,213,247", text: "text-go", bg: "bg-go" },
  amber: { rgb: "255,181,71", text: "text-amber", bg: "bg-amber" },
  green: { rgb: "91,228,155", text: "text-green", bg: "bg-green" },
  violet: { rgb: "169,155,255", text: "text-violet", bg: "bg-violet" },
};

export default function Systems() {
  return (
    <section id="systems" className="border-y border-line bg-panel/60">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-36">
        <SectionHead
          index="04"
          kicker="Selected systems"
          title="Things I've built that"
          accent="stay up."
          note="Four systems from the last nine years — payments, fraud, risk, and the platform underneath them."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {systems.map((s, i) => (
            <Card key={s.id} system={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ system, index }: { system: System; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const tone = TONE[system.tone];
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(${tone.rgb},0.13), transparent 70%)`;
  const ring = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(${tone.rgb},0.7), transparent 70%)`;

  return (
    <motion.article
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-400);
        my.set(-400);
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.1 }}
      className="group relative rounded-2xl bg-line p-px"
    >
      {/* cursor-following border highlight */}
      <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: ring }} />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-ink">
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

        <Pipeline steps={system.pipeline} rgb={tone.rgb} />

        <div className="relative flex flex-1 flex-col p-6 sm:p-8">
          <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${tone.text}`}>{system.company}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{system.title}</h3>
          <p className="mt-3 leading-relaxed text-mute">{system.summary}</p>
          <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
            {system.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-fg/85">
                <span className={`mt-[0.55em] h-1 w-1 shrink-0 rounded-full ${tone.bg}`} />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-7">
            {system.tags.map((t) => (
              <span key={t} className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-mute">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Animated data-flow strip: labelled stages with a dashed line "flowing" between them.
function Pipeline({ steps, rgb }: { steps: string[]; rgb: string }) {
  return (
    <div className="grid-bg relative border-b border-line px-4 py-7 sm:px-6">
      <svg className="absolute inset-x-0 top-1/2 h-px w-full overflow-visible" aria-hidden>
        <line
          x1="0"
          x2="100%"
          y1="0"
          y2="0"
          stroke={`rgba(${rgb},0.55)`}
          strokeWidth="1"
          strokeDasharray="4 8"
          className="animate-flow"
        />
      </svg>
      <ol className="relative flex items-center justify-between gap-1">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`whitespace-nowrap rounded-md border border-line-strong bg-ink px-2 py-1.5 font-mono text-[10px] text-fg/90 sm:px-2.5 sm:text-[11px] ${
              i === 1 || i === 3 ? "max-[420px]:hidden" : ""
            }`}
          >
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
