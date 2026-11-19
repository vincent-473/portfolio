"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { certifications, education, jobs, profile, sections, skillGroups } from "@/lib/data";

type Line = { id: number; node: ReactNode };

const HELP: [string, string][] = [
  ["whoami", "the short version"],
  ["experience", "work history"],
  ["skills [layer]", "the toolbox, optionally by layer"],
  ["certs", "certifications"],
  ["education", "where I studied"],
  ["contact", "how to reach me"],
  ["goto <section>", `jump to: ${sections.map((s) => s.id).join(", ")}`],
  ["curl /api/whoami", "this site has a real JSON endpoint"],
  ["clear", "clear the screen"],
];

const SUGGEST = ["whoami", "experience", "skills backend", "curl /api/whoami", "sudo hire darren"];

const Dim = ({ children }: { children: ReactNode }) => <span className="text-mute">{children}</span>;
const Hi = ({ children }: { children: ReactNode }) => <span className="text-go">{children}</span>;

export default function Terminal() {
  const idRef = useRef(1);
  const [lines, setLines] = useState<Line[]>([
    {
      id: 0,
      node: (
        <Dim>
          darren.sh v1.0 — type <Hi>help</Hi> to see what I respond to, or tap a suggestion below.
        </Dim>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const print = (...nodes: ReactNode[]) =>
    setLines((l) => [...l, ...nodes.map((node) => ({ id: idRef.current++, node }))]);

  const run = async (raw: string) => {
    const cmd = raw.trim();
    print(
      <span>
        <Hi>visitor@darren</Hi>
        <Dim>:~$</Dim> {cmd}
      </span>,
    );
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
    const [name, ...args] = cmd.toLowerCase().split(/\s+/);

    switch (name) {
      case "help":
        print(
          <div className="grid gap-x-6 gap-y-0.5 sm:grid-cols-[11rem_1fr]">
            {HELP.map(([c, d]) => (
              <div key={c} className="contents">
                <Hi>{c}</Hi>
                <Dim>{d}</Dim>
              </div>
            ))}
          </div>,
        );
        break;
      case "whoami":
        print(
          <span>
            {profile.name} — {profile.role}, {profile.location}
          </span>,
          <Dim>{profile.summary}</Dim>,
        );
        break;
      case "experience":
      case "ls":
        print(
          ...jobs.map((j) => (
            <span key={j.id}>
              <Hi>{j.start} → {j.end ?? "present"}</Hi> {j.company} <Dim>· {j.role}</Dim>
            </span>
          )),
        );
        break;
      case "skills": {
        const g = skillGroups.find((s) => s.id === args[0]);
        if (g) print(<span>{g.items.join(" · ")}</span>);
        else
          print(
            ...skillGroups.map((s) => (
              <span key={s.id}>
                <Hi>{s.id.padEnd(10, " ")}</Hi> <Dim>{s.items.slice(0, 5).join(", ")}…</Dim>
              </span>
            )),
            <Dim>try: skills backend</Dim>,
          );
        break;
      }
      case "certs":
        print(...certifications.map((c) => <span key={c.name}>✓ {c.name} <Dim>— {c.issuer}</Dim></span>));
        break;
      case "education":
        print(<span>{education.degree}, {education.school} <Dim>({education.period})</Dim></span>);
        break;
      case "contact":
      case "email":
        print(
          <span>
            email: <a className="text-go underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>
          </span>,
        );
        break;
      case "goto":
      case "cd": {
        const target = sections.find((s) => s.id === args[0]?.replace(/^[#/]+/, ""));
        if (target) {
          print(<Dim>→ {target.id}</Dim>);
          document.getElementById(target.id)?.scrollIntoView({ behavior: "smooth" });
        } else print(<span className="text-red">no such section. try: {sections.map((s) => s.id).join(", ")}</span>);
        break;
      }
      case "curl":
        try {
          const res = await fetch("/api/whoami");
          const json = await res.json();
          print(
            <Dim>HTTP {res.status} · application/json</Dim>,
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-fg/80">{JSON.stringify(json, null, 2)}</pre>,
          );
        } catch {
          print(<span className="text-red">curl: (7) failed to connect</span>);
        }
        break;
      case "sudo":
        print(
          <span className="text-green">[sudo] permission granted. Opening a channel…</span>,
          <span>
            <a className="text-go underline underline-offset-4" href={`mailto:${profile.email}?subject=Let's talk`}>
              {profile.email}
            </a>
          </span>,
        );
        break;
      case "clear":
        setLines([]);
        break;
      case "go":
        print(<Dim>go: all goroutines are asleep — just kidding. Scroll up to the playground.</Dim>);
        break;
      case "rm":
        print(<span className="text-red">nice try. This filesystem is read-only.</span>);
        break;
      default:
        print(
          <span className="text-red">
            command not found: {name}. <Dim>type</Dim> <Hi>help</Hi>
          </span>,
        );
    }
  };

  return (
    <div
      className="overflow-hidden rounded-2xl border border-line bg-ink text-left shadow-2xl shadow-black/60"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[11px] text-mute">visitor@darren: ~</span>
      </div>
      <div
        ref={scroller}
        className="h-80 space-y-1.5 overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed sm:p-5 sm:text-[13px]"
        aria-live="polite"
      >
        {lines.map((l) => (
          <div key={l.id} className="break-words">
            {l.node}
          </div>
        ))}
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput("");
          }}
        >
          <label htmlFor="term-input" className="shrink-0">
            <Hi>visitor@darren</Hi>
            <Dim>:~$</Dim>
          </label>
          <input
            id="term-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = Math.max(-1, Math.min(history.length - 1, hIdx + (e.key === "ArrowUp" ? 1 : -1)));
                setHIdx(next);
                setInput(next === -1 ? "" : history[next]);
              }
            }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal input"
            className="min-w-0 flex-1 bg-transparent text-fg caret-go outline-none"
          />
        </form>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {SUGGEST.map((s) => (
          <button
            key={s}
            onClick={(e) => {
              e.stopPropagation();
              run(s);
            }}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-mute transition-colors hover:border-go hover:text-go"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
