import React, { useContext, useEffect, useState } from 'react';
import { HOSTS, RULES } from './data';
import { MotionCtx, SheetLink } from '../v7/ctx';

export function Detection() {
  const [id, setId] = useState(RULES[0].id);
  const rule = RULES.find(item => item.id === id) || RULES[0];
  return <div>
    <p className="v7-lab-story">These are study samples: rule formats I am practising while I prepare for BTL1. They are learning material and not production rules, and the notes say where each one would produce false positives.</p>
    <div className="v7-tabs" role="tablist" aria-label="Rules">
      {RULES.map(item => <button key={item.id} type="button" role="tab" id={`tab-${item.id}`} aria-selected={id === item.id} aria-controls="v7-rule-panel" tabIndex={id === item.id ? 0 : -1} className="v7-tab" onClick={() => setId(item.id)}
        onKeyDown={event => { const i = RULES.findIndex(r => r.id === item.id); if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next = RULES[(i + (event.key === 'ArrowRight' ? 1 : RULES.length - 1)) % RULES.length]; setId(next.id); document.getElementById(`tab-${next.id}`)?.focus(); } }}>{item.format}: {item.title}</button>)}
    </div>
    <article id="v7-rule-panel" role="tabpanel" aria-labelledby={`tab-${rule.id}`} className="v7-report">
      <p className="v7-report-head"><b>{rule.format}</b> · MITRE ATT&amp;CK {rule.mitre}</p>
      <h3>{rule.title}</h3>
      <p>{rule.note}</p>
      <pre>{rule.syntax}</pre>
    </article>
  </div>;
}

export function Radar() {
  const { reduce } = useContext(MotionCtx);
  const [found, setFound] = useState(0);
  const [sweeping, setSweeping] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!sweeping) return;
    if (found >= HOSTS.length) { setSweeping(false); return; }
    const t = window.setTimeout(() => setFound(count => count + 1), reduce ? 0 : 650);
    return () => window.clearTimeout(t);
  }, [sweeping, found, reduce]);
  const points = [[130, 80], [250, 190], [380, 60], [470, 200]];
  return <div className="v7-lab-grid">
    <div>
      <div className="v7-lab-bar">
        <p className="v7-lab-target">Subnet <b>10.10.14.0/24</b> <span>fictional lab, simulated sweep</span></p>
        <button type="button" className="v7-btn" onClick={() => { setFound(0); setSweeping(true); }} disabled={sweeping}>{sweeping ? 'Sweeping' : found ? 'Sweep again' : 'Sweep the subnet'}</button>
      </div>
      <svg className="v7-net" viewBox="0 0 600 260" role="img" aria-label={`Simulated radar showing ${found} of ${HOSTS.length} hosts`}>
        <circle cx="300" cy="130" r="120" className="v7-net-ghost" fill="none" /><circle cx="300" cy="130" r="70" className="v7-net-ghost" fill="none" /><circle cx="300" cy="130" r="4" className="v7-net-node is-lit" />
        {sweeping && !reduce && <circle cx="300" cy="130" r="120" className="v7-radar-sweep" fill="none" />}
        {HOSTS.slice(0, found).map((host, i) => <g key={host.ip} onClick={() => setActive(i)} className="v7-radar-host">
          <line x1="300" y1="130" x2={points[i][0]} y2={points[i][1]} className="v7-net-log" />
          <rect x={points[i][0] - 7} y={points[i][1] - 7} width="14" height="14" className={active === i ? 'v7-net-node is-lit' : 'v7-net-node'} />
          <text x={points[i][0]} y={points[i][1] - 14} textAnchor="middle" className="v7-net-label">{host.name}</text>
        </g>)}
      </svg>
    </div>
    <aside className="v7-findings">
      <h2>Hosts <span>{found} of {HOSTS.length}</span></h2>
      {!found && <p className="v7-lab-empty">Nothing yet.</p>}
      <ul>{HOSTS.slice(0, found).map((host, i) => <li key={host.ip}>
        <button type="button" className={`v7-finding${active === i ? ' is-open' : ''}`} onClick={() => setActive(i)} aria-expanded={active === i}><b>{host.ip}</b><span>{host.name} · {host.os}</span></button>
      </li>)}</ul>
      {found > 0 && <p className="v7-report-note">Open ports on {HOSTS[active].name}: {HOSTS[active].ports.join(', ')}. These are invented values for a simulation. No real network is scanned.</p>}
    </aside>
  </div>;
}

export function Infrastructure() {
  return <div className="v7-infra">
    <p className="v7-lab-story">This site runs on my own VPS, inside Docker. I use Docker and Kubernetes for my own projects and I administer the server myself, so I care about how this site is served.</p>
    <dl className="v7-facts v7-facts-row">
      <div><dt>Host</dt><dd>My own VPS</dd></div>
      <div><dt>Packaging</dt><dd>Docker</dd></div>
      <div><dt>Server</dt><dd>A small Node server that serves the built site and sets its security headers in code</dd></div>
    </dl>
    <p>Do not take my word for the headers. The audit sheet reads what this server actually sent you and grades it.</p>
    <p><SheetLink className="v7-btn" to="/lab/audit">Audit this site</SheetLink></p>
    <p className="v7-report-note">This sheet states only what is true today. I add detail here as I document more of the setup.</p>
  </div>;
}
