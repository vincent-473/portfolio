"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { SectionHead, Reveal } from "./ui";

// A real (tiny) discrete simulation of a Go worker pool:
// producer -> buffered channel -> N workers, with non-blocking sends
// that drop when the buffer is full — the same shape as the code beside it.

const JOB_MS = 300; // mean job duration
const MAX_WORKERS = 16;
const MAX_BUFFER = 32;

type Running = { start: number; dur: number; enq: number } | null;

type Snapshot = {
  queue: number;
  progress: number[]; // per worker 0..1, -1 idle
  processed: number;
  dropped: number;
  throughput: number;
  latency: number;
  dropping: boolean;
};

const EMPTY: Snapshot = { queue: 0, progress: [], processed: 0, dropped: 0, throughput: 0, latency: 0, dropping: false };

export default function WorkerPool() {
  const [workers, setWorkers] = useState(4);
  const [buffer, setBuffer] = useState(12);
  const [rate, setRate] = useState(11);
  const [spike, setSpike] = useState(false);
  const [snap, setSnap] = useState<Snapshot>(EMPTY);

  const params = useRef({ workers, buffer, rate, spike });
  useEffect(() => {
    params.current = { workers, buffer, rate, spike };
  }, [workers, buffer, rate, spike]);

  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "100px" });

  useEffect(() => {
    if (!spike) return;
    const t = setTimeout(() => setSpike(false), 3000);
    return () => clearTimeout(t);
  }, [spike]);

  useEffect(() => {
    if (!inView) return;
    const queue: number[] = []; // enqueue timestamps
    const pool: Running[] = [];
    const done: number[] = []; // completion timestamps (2s window)
    let processed = 0, dropped = 0, lastDrop = -1e9, latency = 0;
    let acc = 0, last = performance.now(), lastPaint = 0, raf = 0;

    const start = (now: number, enq: number): Running => ({
      start: now,
      enq,
      dur: JOB_MS * (0.55 + Math.random() * 0.9),
    });

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const p = params.current;
      while (pool.length < p.workers) pool.push(null);
      // scale down: only retire idle workers so in-flight jobs finish
      while (pool.length > p.workers && pool[pool.length - 1] === null) pool.pop();

      // workers: finish + pick up next
      for (let i = 0; i < pool.length; i++) {
        const job = pool[i];
        if (job && now - job.start >= job.dur) {
          processed++;
          done.push(now);
          const l = now - job.enq;
          latency = latency ? latency * 0.92 + l * 0.08 : l;
          pool[i] = null;
        }
        if (!pool[i] && i < p.workers && queue.length) pool[i] = start(now, queue.shift()!);
      }

      // producer
      acc += dt * p.rate * (p.spike ? 4 : 1);
      while (acc >= 1) {
        acc--;
        const idle = queue.length === 0 ? pool.findIndex((j, i) => !j && i < p.workers) : -1;
        if (idle >= 0) pool[idle] = start(now, now);
        else if (queue.length < p.buffer) queue.push(now);
        else {
          dropped++;
          lastDrop = now;
        }
      }
      while (queue.length > p.buffer) queue.pop(); // buffer shrank

      while (done.length && now - done[0] > 2000) done.shift();

      if (now - lastPaint > 33) {
        lastPaint = now;
        setSnap({
          queue: queue.length,
          progress: pool.map((j) => (j ? Math.min(1, (now - j.start) / j.dur) : -1)),
          processed,
          dropped,
          throughput: done.length / 2,
          latency,
          dropping: now - lastDrop < 500,
        });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const capacity = workers / (JOB_MS / 1000);
  const effRate = rate * (spike ? 4 : 1);
  const status = snap.dropping
    ? { label: "shedding load", cls: "text-red border-red/40 bg-red/10" }
    : snap.queue > buffer * 0.6 && buffer > 0
      ? { label: "backpressure building", cls: "text-amber border-amber/40 bg-amber/10" }
      : { label: "healthy", cls: "text-green border-green/40 bg-green/10" };

  return (
    <section id="playground" className="relative border-y border-line bg-panel/60">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead
          index="02"
          kicker="Playground"
          title="Don't take my word for it."
          accent="Break my worker pool."
          note="This is the pattern behind most of what I ship in Go: a buffered channel feeding a pool of goroutines, shedding load instead of falling over. Tune it, then spike the traffic."
        />

        <Reveal>
          <div ref={wrap} className="grid overflow-hidden rounded-2xl border border-line bg-ink lg:grid-cols-[1.25fr_1fr]">
            {/* simulation */}
            <div className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] text-mute">
                <span>pool.sim</span>
                <span className={`rounded-full border px-2.5 py-0.5 transition-colors ${status.cls}`} role="status">
                  {status.label}
                </span>
              </div>

              <div className="grid gap-6 p-5 sm:p-7">
                <div>
                  <Label left="jobs <- job" right={`${snap.queue} / ${buffer} buffered`} />
                  <div className="flex min-h-7 flex-wrap gap-1">
                    {buffer === 0 && <span className="font-mono text-xs text-dim">unbuffered — direct handoff only</span>}
                    {Array.from({ length: buffer }, (_, i) => (
                      <span
                        key={i}
                        className={`h-7 w-3.5 rounded-[3px] transition-colors duration-150 sm:w-4 ${
                          i < snap.queue ? (snap.dropping ? "bg-red" : "bg-go") : "bg-white/6"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label left="goroutines" right={`${snap.progress.filter((p) => p >= 0).length} / ${workers} busy`} />
                  <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                    {Array.from({ length: Math.max(workers, snap.progress.length) }, (_, i) => {
                      const p = snap.progress[i] ?? -1;
                      return (
                        <div
                          key={i}
                          className={`relative h-12 overflow-hidden rounded-md border ${
                            i >= workers ? "border-dashed border-line opacity-50" : "border-line"
                          } bg-white/3`}
                        >
                          <div
                            className="absolute inset-x-0 bottom-0 bg-go/70"
                            style={{ height: p >= 0 ? `${p * 100}%` : 0 }}
                          />
                          <span className="absolute left-1.5 top-1 font-mono text-[9px] text-mute">w{i}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
                  <Metric label="throughput" value={snap.throughput.toFixed(1)} unit="/s" />
                  <Metric label="avg latency" value={Math.round(snap.latency).toString()} unit="ms" />
                  <Metric label="processed" value={snap.processed.toLocaleString("en-US")} />
                  <Metric label="dropped" value={snap.dropped.toLocaleString("en-US")} hot={snap.dropping} />
                </div>
              </div>

              <div className="mt-auto grid gap-5 border-t border-line p-5 sm:grid-cols-3 sm:p-7">
                <Slider label="workers" value={workers} min={1} max={MAX_WORKERS} onChange={setWorkers} />
                <Slider label="buffer" value={buffer} min={0} max={MAX_BUFFER} onChange={setBuffer} />
                <Slider label="arrivals / s" value={rate} min={1} max={60} onChange={setRate} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-7">
                <p className="font-mono text-[11px] text-mute">
                  load <span className={effRate > capacity ? "text-red" : "text-fg"}>{effRate}/s</span> · capacity ≈{" "}
                  <span className="text-fg">{capacity.toFixed(1)}/s</span>
                </p>
                <button
                  onClick={() => setSpike(true)}
                  disabled={spike}
                  className="h-10 rounded-full border border-amber/50 bg-amber/10 px-5 font-mono text-xs text-amber transition-colors hover:bg-amber hover:text-ink disabled:animate-pulse disabled:cursor-wait disabled:hover:bg-amber/10 disabled:hover:text-amber"
                >
                  {spike ? "4× traffic spike…" : "⚡ spike traffic 4×"}
                </button>
              </div>
            </div>

            {/* code */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3 font-mono text-[11px] text-mute">
                <span className="h-2 w-2 rounded-full bg-go" />
                pool.go
                <span className="ml-auto text-dim">synced to the sliders</span>
              </div>
              <pre className="no-scrollbar flex-1 overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.75] sm:p-7 sm:text-[13px]">
                <code>
                  <K>jobs</K> := <F>make</F>(<T>chan</T> Job, <V k={buffer}>{buffer}</V>){"\n"}
                  <T>var</T> wg sync.WaitGroup{"\n\n"}
                  <T>for</T> w := <N>0</N>; w {"<"} <V k={workers}>{workers}</V>; w++ {"{"}
                  {"\n"}
                  {"    "}wg.<F>Add</F>(<N>1</N>){"\n"}
                  {"    "}<T>go func</T>() {"{"}
                  {"\n"}
                  {"        "}<T>defer</T> wg.<F>Done</F>(){"\n"}
                  {"        "}<T>for</T> job := <T>range</T> <K>jobs</K> {"{"}
                  {"\n"}
                  {"            "}<F>process</F>(job){"\n"}
                  {"        "}{"}"}
                  {"\n"}
                  {"    "}{"}"}(){"\n"}
                  {"}"}
                  {"\n\n"}
                  <C>{"// producer: never block the hot path"}</C>
                  {"\n"}
                  <T>select</T> {"{"}
                  {"\n"}
                  <T>case</T> <K>jobs</K> {"<-"} job:{"\n"}
                  <T>default</T>:{"\n"}
                  {"    "}
                  <span className={`rounded px-1 transition-colors ${snap.dropping ? "bg-red/25 text-red" : ""}`}>
                    metrics.Dropped.<F>Inc</F>()
                  </span>
                  {"\n"}
                  {"}"}
                </code>
              </pre>
              <p className="border-t border-line px-5 py-4 text-xs leading-relaxed text-mute sm:px-7">
                Runs in your browser as a discrete simulation — each job takes ~{JOB_MS}ms. Nothing here is a
                production metric.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const T = ({ children }: { children: React.ReactNode }) => <span className="text-violet">{children}</span>;
const F = ({ children }: { children: React.ReactNode }) => <span className="text-go">{children}</span>;
const K = ({ children }: { children: React.ReactNode }) => <span className="text-fg">{children}</span>;
const N = ({ children }: { children: React.ReactNode }) => <span className="text-amber">{children}</span>;
const C = ({ children }: { children: React.ReactNode }) => <span className="text-dim">{children}</span>;
const V = ({ children, k }: { children: React.ReactNode; k: number }) => (
  <span key={k} className="rounded bg-amber/15 px-1 font-semibold text-amber">
    {children}
  </span>
);

function Label({ left, right }: { left: string; right: string }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between font-mono text-[11px]">
      <span className="text-fg">{left}</span>
      <span className="tabular-nums text-mute">{right}</span>
    </div>
  );
}

function Metric({ label, value, unit, hot }: { label: string; value: string; unit?: string; hot?: boolean }) {
  return (
    <div className="bg-ink px-4 py-3.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-mute">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight transition-colors ${hot ? "text-red" : ""}`}>
        {value}
        {unit && <span className="ml-0.5 text-sm font-normal text-mute">{unit}</span>}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between font-mono text-[11px] text-mute">
        {label}
        <span className="text-sm tabular-nums text-fg">{value}</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}
