import React, { useContext, useEffect, useRef, useState } from 'react';
import { CHAIN_STAGES } from './data';
import { MotionCtx } from '../v7/ctx';

/** Nodes of the lab network. Fictional addresses. */
const NODES = {
  att: { x: 90, y: 150, label: 'Operator', ip: '10.10.14.22' },
  dc: { x: 430, y: 70, label: 'DC01', ip: '10.10.10.5' },
  win: { x: 430, y: 230, label: 'WIN-02', ip: '10.10.10.12' },
  siem: { x: 700, y: 150, label: 'SIEM', ip: '10.10.10.30' }
} as const;
type Key = keyof typeof NODES;
const EDGES: { from: Key; to: Key; stage: number; kind: 'attack' | 'log'; at: number }[] = [
  { from: 'att', to: 'dc', stage: 0, kind: 'attack', at: 0 },
  { from: 'dc', to: 'siem', stage: 0, kind: 'log', at: 0.5 },
  { from: 'att', to: 'win', stage: 1, kind: 'attack', at: 0 },
  { from: 'win', to: 'siem', stage: 1, kind: 'log', at: 0.5 }
];

export function Chain() {
  const { reduce } = useContext(MotionCtx);
  const [value, setValue] = useState(0);            // 0..200
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const stageIndex = Math.min(CHAIN_STAGES.length - 1, Math.floor(value / 100));
  const local = value >= 200 ? 1 : (value % 100) / 100;
  const stage = CHAIN_STAGES[stageIndex];
  const redLines = stage.red.slice(0, Math.ceil(local * stage.red.length - 0.001) || (local > 0 ? 1 : 0));
  const blueLines = stage.blue.slice(0, Math.ceil(Math.max(0, local - 0.15) / 0.85 * stage.blue.length - 0.001));

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      let ended = false;
      setValue(current => { const next = current + dt * 12; if (next >= 200) { ended = true; return 200; } return next; });
      if (ended) setPlaying(false); else raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing]);

  const edgeAmount = (edge: typeof EDGES[number]) => {
    if (edge.stage < stageIndex) return 1;
    if (edge.stage > stageIndex) return 0;
    return Math.max(0, Math.min(1, (local - edge.at) / 0.45));
  };

  return <div>
    <div className="v7-lab-bar">
      <p className="v7-lab-target">Stage {stageIndex + 1} of {CHAIN_STAGES.length} <b>{stage.title}</b> <span>{stage.mitre}</span></p>
      <button type="button" className="v7-btn" onClick={() => { if (value >= 200) setValue(0); setPlaying(p => !p); }}>{playing ? 'Pause' : value >= 200 ? 'Replay' : 'Play'}</button>
    </div>
    <label className="v7-scrub"><span className="v7-sr">Scrub through the intrusion</span>
      <input type="range" min={0} max={200} step={1} value={Math.round(value)} onChange={event => { setPlaying(false); setValue(Number(event.target.value)); }} aria-valuetext={`Stage ${stageIndex + 1}, ${Math.round(local * 100)} percent`} />
      <span className="v7-scrub-ticks" aria-hidden="true">{CHAIN_STAGES.map(item => <i key={item.id}>{item.title}</i>)}</span>
    </label>

    <svg className="v7-net" viewBox="0 0 800 300" role="img" aria-label={`Lab network. ${stage.title}: ${stage.summary}`}>
      {EDGES.map((edge, i) => {
        const a = NODES[edge.from], b = NODES[edge.to], k = edgeAmount(edge);
        return <g key={i}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="v7-net-ghost" />
          <line x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * k} y2={a.y + (b.y - a.y) * k} className={edge.kind === 'attack' ? 'v7-net-attack' : 'v7-net-log'} />
        </g>;
      })}
      {(Object.keys(NODES) as Key[]).map(key => {
        const n = NODES[key];
        const lit = EDGES.some(e => (e.from === key || e.to === key) && e.stage <= stageIndex && edgeAmount(e) >= 1);
        return <g key={key}>
          <rect x={n.x - 8} y={n.y - 8} width="16" height="16" className={lit ? 'v7-net-node is-lit' : 'v7-net-node'} />
          <text x={n.x} y={n.y - 20} textAnchor="middle" className="v7-net-label">{n.label}</text>
          <text x={n.x} y={n.y + 30} textAnchor="middle" className="v7-net-ip">{n.ip}</text>
        </g>;
      })}
    </svg>
    <p className="v7-net-key" aria-hidden="true"><i className="v7-key-attack" /> attack path <i className="v7-key-log" /> log forwarding</p>

    <p className="v7-chain-sum">{stage.summary}</p>
    <div className="v7-dual">
      <section><h3>Attack trace</h3><pre>{redLines.join('\n') || ' '}</pre><h4>Lab command</h4><pre>{stage.command}</pre></section>
      <section><h3>Detection trace</h3><pre>{blueLines.join('\n') || ' '}</pre><h4>Detection logic</h4><pre>{stage.rule}</pre></section>
    </div>
    <div className="v7-table-wrap"><table className="v7-table"><caption>Traffic and events</caption><thead><tr><th>Source</th><th>Destination</th><th>Protocol</th><th>Observation</th></tr></thead>
      <tbody>{stage.packets.map(p => <tr key={p.protocol}><td>{p.source}</td><td>{p.destination}</td><td>{p.protocol}</td><td>{p.observation}</td></tr>)}</tbody></table></div>
    <p className="v7-chain-out"><b>Containment.</b> {stage.outcome} <a className="v7-link" href={stage.sourceUrl} target="_blank" rel="noreferrer noopener">Technical reference</a></p>
  </div>;
}
