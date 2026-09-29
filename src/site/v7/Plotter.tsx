import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Attack-path plotter: a faint network drawn like a pen plotter, with an occasional red pulse walking a path
 * through it. Canvas 2D, capped pixel ratio, paused when off-screen or hidden. Static for reduced motion and touch.
 */
interface Node { x: number; y: number; hot: number }
interface Edge { a: number; b: number; len: number }

const BONE = '236, 230, 216', RED = '226, 69, 46';

/** Deterministic pseudo-random so the network is the same on every load. */
const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

function buildGraph(w: number, h: number) {
  const rand = rng(20260929);
  const cols = w < 700 ? 5 : 9, rows = w < 700 ? 6 : 6;
  const nodes: Node[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    nodes.push({ x: ((c + 0.5 + (rand() - 0.5) * 0.9) / cols) * w, y: ((r + 0.5 + (rand() - 0.5) * 0.9) / rows) * h, hot: 0 });
  }
  const edges: Edge[] = [], seen = new Set<string>();
  nodes.forEach((n, i) => {
    const near = nodes.map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) })).filter(o => o.j !== i).sort((p, q) => p.d - q.d).slice(0, 2);
    near.forEach(o => { const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`; if (!seen.has(key)) { seen.add(key); edges.push({ a: i, b: o.j, len: o.d }); } });
  });
  const adj: number[][] = nodes.map(() => []);
  edges.forEach(e => { adj[e.a].push(e.b); adj[e.b].push(e.a); });
  return { nodes, edges, adj };
}

export function Plotter({ reduce, fine }: { reduce: boolean; fine: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const context = el.getContext('2d');
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;
    const animated = !reduce && fine;
    let w = 0, h = 0, dpr = 1, graph = buildGraph(1, 1);
    let drawn = animated ? 0 : 1;           // 0..1: how much of the plot the pen has drawn
    let pulse: { path: number[]; t: number } | null = null;
    let nextPulse = 2.4;
    let mouse = { x: -999, y: -999 };
    let visible = true;

    const resize = () => {
      const box = el.getBoundingClientRect();
      w = Math.max(1, box.width); h = Math.max(1, box.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      graph = buildGraph(w, h);
      render();
    };

    const startPulse = () => {
      const { adj } = graph;
      let cur = Math.floor(Math.random() * adj.length);
      const path = [cur];
      for (let i = 0; i < 6; i++) {
        const options = adj[cur].filter(n => !path.includes(n));
        if (!options.length) break;
        cur = options[Math.floor(Math.random() * options.length)];
        path.push(cur);
      }
      if (path.length > 2) pulse = { path, t: 0 };
    };

    function render() {
      ctx.clearRect(0, 0, w, h);
      const { nodes, edges } = graph;
      const total = edges.reduce((sum, e) => sum + e.len, 0);
      let budget = drawn * total;
      ctx.lineWidth = 1;
      edges.forEach(e => {
        if (budget <= 0) return;
        const part = Math.min(1, budget / e.len); budget -= e.len;
        const a = nodes[e.a], b = nodes[e.b];
        ctx.strokeStyle = `rgba(${BONE}, .13)`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + (b.x - a.x) * part, a.y + (b.y - a.y) * part); ctx.stroke();
      });
      nodes.forEach(n => {
        const near = fine ? Math.max(0, 1 - Math.hypot(n.x - mouse.x, n.y - mouse.y) / 170) : 0;
        const alpha = drawn < 1 ? 0.12 * drawn : 0.26 + near * 0.5;
        ctx.fillStyle = n.hot > 0.02 ? `rgba(${RED}, ${Math.min(1, 0.35 + n.hot * 0.6)})` : `rgba(${BONE}, ${alpha})`;
        const s = n.hot > 0.02 ? 6 : 4 + near * 3;
        ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
      });
      if (pulse) {
        const { path, t } = pulse;
        const seg = Math.min(path.length - 2, Math.floor(t));
        const f = Math.min(1, t - seg);
        const a = nodes[path[seg]], b = nodes[path[seg + 1]];
        // trail: the path already walked, fading toward its start
        for (let i = 0; i <= seg; i++) {
          const from = nodes[path[i]], to = i === seg ? { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f } : nodes[path[i + 1]];
          ctx.strokeStyle = `rgba(${RED}, ${0.25 + 0.6 * ((i + 1) / (seg + 1))})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${RED}, 1)`;
        ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 3.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(0.05, (deltaMs || 16) / 1000);
      if (!visible || document.hidden) return;
      if (drawn < 1) drawn = Math.min(1, drawn + dt / 3.2);
      else {
        nextPulse -= dt;
        if (!pulse && nextPulse <= 0) { startPulse(); nextPulse = 4.5 + Math.random() * 3; }
      }
      if (pulse) {
        pulse.t += dt * 1.9;
        const seg = Math.min(pulse.path.length - 1, Math.floor(pulse.t));
        for (let i = 0; i <= seg; i++) graph.nodes[pulse.path[i]].hot = 1;
        if (pulse.t > pulse.path.length - 1 + 1.4) pulse = null;
      }
      graph.nodes.forEach(n => { if (n.hot > 0 && !pulse) n.hot = Math.max(0, n.hot - dt * 0.7); });
      render();
    };

    const onMove = (event: PointerEvent) => { const box = el.getBoundingClientRect(); mouse = { x: event.clientX - box.left, y: event.clientY - box.top }; };
    const onLeave = () => { mouse = { x: -999, y: -999 }; };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const io = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; }, { threshold: 0 });
    io.observe(el);
    if (animated) { gsap.ticker.add(tick); window.addEventListener('pointermove', onMove); window.addEventListener('blur', onLeave); }
    resize();
    return () => { gsap.ticker.remove(tick); observer.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); window.removeEventListener('blur', onLeave); };
  }, [reduce, fine]);

  return <canvas ref={canvas} className="v7-plotter" aria-hidden="true" />;
}
