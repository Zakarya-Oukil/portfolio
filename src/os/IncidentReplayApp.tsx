import React, { useEffect, useState } from 'react';
import { REPLAY_STAGES } from './recruitment-data';
import { useSystemContext } from './state';

export function IncidentReplayApp() {
  const s = useSystemContext();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stage = REPLAY_STAGES[index];
  const visible = s.active === 'incident-replay' && !s.windows.find(w => w.id === 'incident-replay')?.minimized;
  useEffect(() => {
    if (!visible) setPlaying(false);
  }, [visible]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (index === REPLAY_STAGES.length - 1) setPlaying(false);
      else setIndex(i => i + 1);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [playing, index]);
  useEffect(() => {
    const pause = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  const select = (next: number) => { setPlaying(false); setIndex(next); };
  return <div className="replay-app app-scroll">
    <header className="replay-header">
      <div><span className="funnel-eyebrow">DUAL-HAT CAMPAIGN / INTERACTIVE LAB</span><h1>Red vs. Blue Incident Replay</h1><p>From Kerberos exposure to Linux kernel containment.</p></div>
      <span className="simulation-label">SIMULATED · NO COMMANDS EXECUTED</span>
      <div className="replay-controls" role="group" aria-label="Replay playback">
        <button disabled={index === 0} onClick={() => select(index - 1)}>⏮ Prev</button>
        <button aria-pressed={playing} onClick={() => { if (!playing && index === REPLAY_STAGES.length - 1) setIndex(0); setPlaying(!playing); }}>{playing ? '⏸ Pause' : index === REPLAY_STAGES.length - 1 ? '▶ Replay' : '▶ Play'}</button>
        <button disabled={index === REPLAY_STAGES.length - 1} onClick={() => select(index + 1)}>Next Step ⏭</button>
      </div>
    </header>
    <nav className="replay-markers" aria-label="Campaign stages">{REPLAY_STAGES.map((item, i) => <button key={item.id} aria-current={index === i ? 'step' : undefined} onClick={() => select(i)}><span>0{i + 1}</span>{item.title}</button>)}</nav>
    <main className="replay-detail">
      <p className="funnel-eyebrow" role="status">STAGE {index + 1} / {REPLAY_STAGES.length} · {playing ? 'PLAYING · 6.5s per stage' : 'PAUSED'} · {stage.mitre}</p>
      <h2>{stage.title}</h2><p>{stage.summary}</p>
      <div className="replay-dual">
        <section className="replay-red"><h3>⚔ Red team / attack trace</h3><pre><code>{stage.redLog}</code></pre><h4>Lab command / payload</h4><pre><code>{stage.exploitSyntax}</code></pre></section>
        <section className="replay-blue"><h3>🛡 Blue team / detection trace</h3><pre><code>{stage.blueLog}</code></pre><h4>Detection / containment logic</h4><pre><code>{stage.detectionRule}</code></pre></section>
      </div>
      <section className="packet-inspector"><h3>Packet &amp; event flow inspector</h3><div className="packet-table-wrap"><table><thead><tr><th>Source</th><th>Destination</th><th>Transport</th><th>Observation</th></tr></thead><tbody>{stage.packetFlow.map((flow, i) => <tr key={i}><td>{flow.source}</td><td>{flow.destination}</td><td>{flow.protocol}</td><td>{flow.observation}</td></tr>)}</tbody></table></div></section>
      <section className="replay-outcome"><h3>Containment decision</h3><p>{stage.outcome}</p><a href={stage.sourceUrl} target="_blank" rel="noreferrer">Read the technical reference ↗</a></section>
      <button className="tactical-pill-btn" onClick={() => s.setFastPassOpen(true)}>⚡ Match this work to your role</button>
    </main>
  </div>;
}
