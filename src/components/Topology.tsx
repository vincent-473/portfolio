"use client";

import { useEffect, useRef } from "react";

// A live, interactive event-driven system drawn on canvas.
// Requests spawn at the client nodes, get routed through services,
// fan out via Kafka, and land in consumers. Click to send a burst.

type Node = { id: string; label: string; short?: string; x: number; y: number; pulse: number; tone?: "amber" };

const NODE_DEFS: Omit<Node, "pulse">[] = [
  { id: "mobile", label: "mobile", x: 0, y: 0.2 },
  { id: "web", label: "web", x: 0, y: 0.5 },
  { id: "atm", label: "atm", x: 0, y: 0.8 },
  { id: "gateway", label: "api gateway", short: "gateway", x: 0.25, y: 0.5 },
  { id: "auth", label: "auth", x: 0.5, y: 0.16 },
  { id: "txn", label: "txn service", short: "txn", x: 0.5, y: 0.5 },
  { id: "fraud", label: "fraud", x: 0.5, y: 0.84, tone: "amber" },
  { id: "redis", label: "redis", x: 0.76, y: 0.1 },
  { id: "kafka", label: "kafka", x: 0.76, y: 0.62 },
  { id: "postgres", label: "postgres", x: 1, y: 0.3 },
  { id: "ledger", label: "ledger", x: 1, y: 0.52 },
  { id: "notify", label: "notify", x: 1, y: 0.74 },
  { id: "analytics", label: "analytics", x: 1, y: 0.96 },
];

const EDGES: [string, string][] = [
  ["mobile", "gateway"], ["web", "gateway"], ["atm", "gateway"],
  ["gateway", "auth"], ["gateway", "txn"], ["gateway", "fraud"],
  ["auth", "redis"], ["txn", "redis"], ["txn", "postgres"],
  ["txn", "kafka"], ["fraud", "kafka"],
  ["kafka", "ledger"], ["kafka", "notify"], ["kafka", "analytics"],
];

const CLIENTS = ["mobile", "web", "atm"];
const GO = "63, 213, 247";
const AMBER = "255, 181, 71";

type Particle = { path: string[]; seg: number; t: number; speed: number; amber: boolean };

export default function Topology({
  onCount,
}: {
  onCount?: (n: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCountRef = useRef(onCount);
  useEffect(() => {
    onCountRef.current = onCount;
  }, [onCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host = canvas.parentElement as HTMLElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nodes: Node[] = NODE_DEFS.map((n) => ({ ...n, pulse: 0 }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const out = new Map<string, string[]>();
    for (const [a, b] of EDGES) out.set(a, [...(out.get(a) ?? []), b]);

    let w = 0, h = 0, dpr = 1;
    let region = { x: 0, y: 0, w: 0, h: 0 };
    let compact = false;
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let count = 0;
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;
    let visible = true;

    const px = (n: Node) => ({ x: region.x + n.x * region.w, y: region.y + n.y * region.h });

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      compact = w < 900;
      region = compact
        ? { x: w * 0.1, y: h * 0.11, w: w * 0.8, h: h * 0.36 }
        : { x: w * 0.47, y: h * 0.17, w: w * 0.45, h: h * 0.62 };
      if (reduced) draw(0);
    };

    const bez = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => {
      const mx = (a.x + b.x) / 2;
      const u = 1 - t;
      const x = u * u * u * a.x + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * b.x;
      const y = u * u * u * a.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t * t * t * b.y;
      return { x, y };
    };

    const route = (from?: string): string[] => {
      const path = [from ?? CLIENTS[(Math.random() * CLIENTS.length) | 0]];
      for (;;) {
        const next = out.get(path[path.length - 1]);
        if (!next) break;
        path.push(next[(Math.random() * next.length) | 0]);
      }
      return path;
    };

    const spawn = (from?: string) => {
      if (particles.length > 260) return;
      const path = route(from);
      particles.push({
        path,
        seg: 0,
        t: 0,
        speed: 0.75 + Math.random() * 0.6,
        amber: path.includes("fraud"),
      });
      byId.get(path[0])!.pulse = 1;
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const fade = compact ? 0.75 : 1;

      // edges
      ctx.lineWidth = 1;
      for (const [a, b] of EDGES) {
        const p = px(byId.get(a)!), q = px(byId.get(b)!);
        const mx = (p.x + q.x) / 2;
        ctx.strokeStyle = `rgba(255,255,255,${0.09 * fade})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.bezierCurveTo(mx, p.y, mx, q.y, q.x, q.y);
        ctx.stroke();
      }

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const a = px(byId.get(p.path[p.seg])!), b = px(byId.get(p.path[p.seg + 1])!);
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        p.t += (dt * 230 * p.speed) / len;
        if (p.t >= 1) {
          p.seg++;
          p.t = 0;
          const hit = byId.get(p.path[p.seg])!;
          hit.pulse = 1;
          if (p.seg >= p.path.length - 1) {
            particles.splice(i, 1);
            count++;
            continue;
          }
          continue;
        }
        const rgb = p.amber ? AMBER : GO;
        const head = bez(a, b, p.t);
        const tail = bez(a, b, Math.max(0, p.t - 26 / len));
        const g = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        g.addColorStop(0, `rgba(${rgb},0)`);
        g.addColorStop(1, `rgba(${rgb},${0.9 * fade})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${rgb},${fade})`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes
      const fs = compact ? 9.5 : 11;
      ctx.font = `500 ${fs}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const n of nodes) {
        const p = px(n);
        const near = Math.max(0, 1 - Math.hypot(mouse.x - p.x, mouse.y - p.y) / 170);
        const glow = Math.max(n.pulse, near * 0.8);
        const rgb = n.tone === "amber" ? AMBER : GO;
        const label = compact ? (n.short ?? n.label) : n.label;
        const tw = ctx.measureText(label).width;
        const bw = tw + (compact ? 14 : 22), bh = compact ? 20 : 26;
        if (glow > 0.02) {
          ctx.shadowColor = `rgba(${rgb},${0.55 * glow})`;
          ctx.shadowBlur = 22;
        }
        ctx.fillStyle = "rgba(9,12,16,0.94)";
        ctx.strokeStyle = `rgba(${glow > 0.05 ? rgb : "255,255,255"},${0.16 + glow * 0.75})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(p.x - bw / 2, p.y - bh / 2, bw, bh, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(233,237,242,${(0.55 + glow * 0.45) * fade})`;
        ctx.fillText(label, p.x, p.y + 0.5);
        n.pulse = Math.max(0, n.pulse - dt * 2.2);
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      spawnAcc += dt * (compact ? 5 : 8);
      while (spawnAcc > 1) {
        spawn();
        spawnAcc--;
      }
      const before = count;
      draw(dt);
      if (count !== before) onCountRef.current?.(count);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      // burst from the client closest to the click
      let best = CLIENTS[0], bd = Infinity;
      for (const id of CLIENTS) {
        const d = Math.abs(px(byId.get(id)!).y - y);
        if (d < bd) {
          bd = d;
          best = id;
        }
      }
      for (let i = 0; i < 14; i++) setTimeout(() => spawn(best), i * 35);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    resize();
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    if (!reduced) {
      host.addEventListener("click", onClick);
      raf = requestAnimationFrame(tick);
    }
    document.fonts?.ready.then(() => {
      if (reduced) draw(0);
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full font-mono"
    />
  );
}
