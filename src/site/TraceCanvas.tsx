import React, { useEffect, useRef } from 'react';

interface Node { x: number; y: number; vx: number; vy: number; hot: number }
interface Packet { from: number; to: number; t: number; speed: number }

/**
 * Decorative network trace. Purely visual: no data is implied. It draws one static frame under
 * reduced motion, pauses while off-screen or when the tab is hidden, and never touches React state.
 */
export function TraceCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const style = getComputedStyle(canvas);
    const accent = style.getPropertyValue('--trace-accent').trim() || '#8ff0b8';
    const line = style.getPropertyValue('--trace-line').trim() || 'rgba(143,240,184,0.16)';

    let width = 0, height = 0, nodes: Node[] = [], packets: Packet[] = [], edges: [number, number][] = [];
    let raf = 0, visible = true, last = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(16, Math.min(44, Math.round((width * height) / 26000)));
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12, hot: 0 }));
      edges = [];
      nodes.forEach((a, i) => {
        nodes.map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
          .filter(o => o.j !== i).sort((p, q) => p.d - q.d).slice(0, 2)
          .forEach(o => { if (!edges.some(([m, n]) => (m === i && n === o.j) || (m === o.j && n === i))) edges.push([i, o.j]); });
      });
      packets = [];
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1; ctx.strokeStyle = line;
      ctx.beginPath();
      edges.forEach(([a, b]) => { ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); });
      ctx.stroke();
      nodes.forEach(n => {
        ctx.globalAlpha = 0.35 + n.hot * 0.65; ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.6 + n.hot * 2.4, 0, Math.PI * 2); ctx.fill();
      });
      packets.forEach(p => {
        const a = nodes[p.from], b = nodes[p.to];
        ctx.globalAlpha = 0.9; ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 2.2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const step = (time: number) => {
      const dt = Math.min(48, time - (last || time)); last = time;
      nodes.forEach(n => {
        n.x += n.vx * dt * 0.06; n.y += n.vy * dt * 0.06; n.hot = Math.max(0, n.hot - dt * 0.0012);
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });
      if (packets.length < 7 && edges.length && Math.random() < dt * 0.0035) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)];
        packets.push(Math.random() < 0.5 ? { from: a, to: b, t: 0, speed: 0.0004 + Math.random() * 0.0004 } : { from: b, to: a, t: 0, speed: 0.0004 + Math.random() * 0.0004 });
      }
      packets = packets.filter(p => { p.t += p.speed * dt; if (p.t >= 1) { nodes[p.to].hot = 1; return false; } return true; });
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => { if (raf || media.matches || !visible || document.hidden) return; last = 0; raf = requestAnimationFrame(step); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const sync = () => { stop(); build(); draw(); start(); };

    const resize = new ResizeObserver(sync);
    resize.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', sync);
    sync();

    return () => { stop(); resize.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVisibility); media.removeEventListener('change', sync); };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
