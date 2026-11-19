"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { jobs, PRESENT, type Job } from "@/lib/data";
import { SectionHead, Reveal } from "./ui";

// Career rendered as a distributed trace: one root span, one child span per role.

const AXIS_START = 2017;
const AXIS_END = 2027;
const YEARS = Array.from({ length: AXIS_END - AXIS_START + 1 }, (_, i) => AXIS_START + i);

const toYear = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y + (m - 1) / 12;
};
const pct = (ym: string) => ((toYear(ym) - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
const months = (a: string, b: string) => Math.round((toYear(b) - toYear(a)) * 12);
const fmtDur = (m: number) => `${Math.floor(m / 12)}y ${m % 12}m`.replace(/^0y /, "").replace(/ 0m$/, "");
const fmtDate = (ym: string | null) => {
  if (!ym) return "Present";
  const [y, m] = ym.split("-");
  return `${m}/${y}`;
};

const COLORS: Record<string, string> = {
  fanatics: "bg-go",
  tebra: "bg-amber",
  luxoft: "bg-violet",
};

const ordered = [...jobs].reverse(); // chronological, like a real waterfall
const rootStart = ordered[0].start;

export default function Trace() {
  const [selected, setSelected] = useState<Job>(jobs[0]);

  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-36">
      <SectionHead
        index="03"
        kicker="Experience"
        title="Nine years,"
        accent="one trace."
        note="I spend my days reading distributed traces, so here's my career as one. Select a span to inspect it."
      />

      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-line bg-panel">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-line px-5 py-3 font-mono text-[11px] text-mute sm:px-6">
            <span>
              trace <span className="text-fg">career-7f3a9c</span>
            </span>
            <span>
              duration <span className="text-fg">{fmtDur(months(rootStart, PRESENT))}</span>
            </span>
            <span>
              spans <span className="text-fg">{jobs.length + 1}</span>
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-green">
              <span className="h-1.5 w-1.5 rounded-full bg-green" /> 0 errors
            </span>
          </div>

          <div className="px-5 pb-5 pt-4 sm:px-6">
            {/* axis */}
            <div className="lg:pl-64">
              <div className="relative h-6 font-mono text-[10px] text-dim">
                {YEARS.map((y, i) => (
                  <span
                    key={y}
                    className={`absolute top-0 ${i === 0 ? "" : "-translate-x-1/2"} ${i % 2 ? "hidden sm:inline" : ""} ${i === YEARS.length - 1 ? "hidden" : ""}`}
                    style={{ left: `${(i / (YEARS.length - 1)) * 100}%` }}
                  >
                    {y}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* gridlines */}
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 lg:left-64">
                {YEARS.map((y, i) => (
                  <span
                    key={y}
                    className="absolute inset-y-0 w-px bg-line"
                    style={{ left: `${(i / (YEARS.length - 1)) * 100}%` }}
                  />
                ))}
              </div>

              <Row label="career.backend-engineering" depth={0}>
                <Bar start={rootStart} end={PRESENT} className="bg-white/25" delay={0} />
              </Row>

              {ordered.map((job, i) => {
                const active = selected.id === job.id;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelected(job)}
                    aria-pressed={active}
                    className={`group relative block w-full rounded-lg text-left transition-colors ${
                      active ? "bg-white/5" : "hover:bg-white/3"
                    }`}
                  >
                    <Row label={job.service} depth={1} active={active}>
                      <Bar
                        start={job.start}
                        end={job.end ?? PRESENT}
                        className={`${COLORS[job.id]} ${active ? "opacity-100" : "opacity-55 group-hover:opacity-90"}`}
                        delay={0.15 + i * 0.15}
                        label={fmtDur(months(job.start, job.end ?? PRESENT))}
                        live={!job.end}
                      />
                    </Row>
                  </button>
                );
              })}
            </div>
          </div>

          {/* span detail */}
          <div className="border-t border-line">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[18rem_1fr] lg:gap-12"
              >
                <div>
                  <span className={`mb-4 block h-1 w-10 rounded-full ${COLORS[selected.id]}`} />
                  <h3 className="text-3xl font-semibold tracking-tight">{selected.company}</h3>
                  <p className="mt-1 text-mute">{selected.role}</p>
                  <dl className="mt-6 space-y-2 font-mono text-[11px]">
                    <Attr k="span.start" v={fmtDate(selected.start)} />
                    <Attr k="span.end" v={fmtDate(selected.end)} />
                    <Attr k="location" v={selected.location} />
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {selected.stack.map((s) => (
                      <span key={s} className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-mute">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-lg leading-relaxed text-fg sm:text-xl">{selected.blurb}</p>
                  <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
                    {selected.highlights.map((h) => (
                      <li key={h} className="relative pl-5 text-sm leading-relaxed text-mute">
                        <span className="absolute left-0 top-[0.6em] h-px w-2.5 bg-go" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Row({
  label,
  depth,
  active,
  children,
}: {
  label: string;
  depth: number;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid items-center gap-x-0 gap-y-1 px-2 py-2.5 lg:grid-cols-[15.5rem_1fr] lg:py-2">
      <span
        className={`truncate font-mono text-xs ${active ? "text-fg" : "text-mute"}`}
        style={{ paddingLeft: depth * 16 }}
      >
        {depth > 0 && <span className="mr-2 text-dim">└</span>}
        {label}
      </span>
      <div className="relative h-7">{children}</div>
    </div>
  );
}

function Bar({
  start,
  end,
  className,
  delay,
  label,
  live,
}: {
  start: string;
  end: string;
  className: string;
  delay: number;
  label?: string;
  live?: boolean;
}) {
  const left = pct(start);
  const width = pct(end) - left;
  return (
    <motion.div
      className="absolute inset-y-1 origin-left"
      style={{ left: `${left}%`, width: `${width}%` }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <div className={`h-full rounded-[4px] transition-opacity ${className}`} />
      {live && <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 animate-ping rounded-full bg-go" />}
      {label && (
        <span
          className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] ${
            live ? "right-3 font-semibold text-ink" : "left-full ml-3 text-mute"
          }`}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
}

function Attr({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2">
      <dt className="text-dim">{k}</dt>
      <dd className="text-fg">{v}</dd>
    </div>
  );
}
