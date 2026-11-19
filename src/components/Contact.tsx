"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import Terminal from "./Terminal";
import { Reveal } from "./ui";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "LinkedIn", href: profile.linkedin },
    { label: "GitHub", href: profile.github },
  ].filter((l) => l.href);

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-go/12 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8 sm:pt-36">
        <div className="grid items-end gap-14 lg:grid-cols-[1fr_30rem]">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-mute">
              <span className="text-go">06</span>
              <span className="h-px w-10 bg-line-strong" />
              Contact
            </p>
            <h2 className="text-[clamp(2.6rem,7.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              Have a system that needs to{" "}
              <span className="font-serif font-normal italic tracking-[-0.01em] text-go">scale?</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
              I&apos;m always up for a conversation about Go, distributed systems, and hard backend problems.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex h-14 items-center gap-2 rounded-full bg-fg px-7 font-medium text-ink transition-colors hover:bg-go"
              >
                Start a conversation
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <button
                onClick={copy}
                className="inline-flex h-14 items-center gap-3 rounded-full border border-line-strong px-6 font-mono text-sm transition-colors hover:border-go hover:text-go"
              >
                <span className="max-[400px]:hidden">{profile.email}</span>
                <span className={`text-[11px] ${copied ? "text-green" : "text-mute"}`} aria-live="polite">
                  {copied ? "copied ✓" : "copy"}
                </span>
              </button>
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-14 items-center rounded-full border border-line-strong px-6 text-sm transition-colors hover:border-go hover:text-go"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mb-3 font-mono text-[11px] text-mute">…or just ask the shell</p>
            <Terminal />
          </Reveal>
        </div>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] text-dim">
          <span>
            © {profile.shortName} · {profile.location}
          </span>
          <span>built with Next.js · no trackers · all goroutines accounted for</span>
        </footer>
      </div>
    </section>
  );
}
