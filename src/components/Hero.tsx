"use client";

import { useCallback, useRef } from "react";
import { motion } from "motion/react";
import Topology from "./Topology";
import { profile } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const countRef = useRef<HTMLSpanElement>(null);
  const onCount = useCallback((n: number) => {
    if (countRef.current) countRef.current.textContent = n.toLocaleString("en-US");
  }, []);

  const [first, ...rest] = profile.shortName.split(" ");

  return (
    <section id="top" className="relative flex min-h-svh cursor-crosshair flex-col overflow-hidden">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_72%)]" />
      <div className="absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full bg-go/10 blur-[140px]" />
      <Topology onCount={onCount} />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-10 pt-28 sm:px-8 lg:justify-center lg:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-mute"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          {profile.role}
        </motion.p>

        <h1 className="text-[clamp(3.4rem,11vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
            >
              {first}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              className="block font-serif font-normal italic tracking-[-0.02em] text-go"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.15 }}
            >
              {rest.join(" ")}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-mute sm:text-xl"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-ink transition-colors hover:bg-go"
          >
            Get in touch
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#playground"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong bg-ink/60 px-6 text-sm font-medium backdrop-blur transition-colors hover:border-go hover:text-go"
          >
            Run the worker pool
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative border-t border-line bg-ink/60 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-3.5 font-mono text-[11px] text-mute sm:px-8">
          <span>
            <span className="text-go">●</span> live simulation ·{" "}
            <span ref={countRef} className="tabular-nums text-fg">
              0
            </span>{" "}
            events routed this visit
          </span>
          <span className="hidden sm:inline">click anywhere to send traffic</span>
          <span className="hidden md:inline">
            <span className="text-dim">$</span> curl /api/whoami
          </span>
        </div>
      </motion.div>
    </section>
  );
}
