import React, { useContext, useEffect, useRef, useState } from 'react';
import { DECOY, FINDINGS, RUN_STEPS } from './data';
import { MotionCtx } from '../v7/ctx';

/** Replays the reconnaissance steps Zak's Spider performs against a fictional decoy. No network requests are made. */
export function SpiderRun() {
  const { reduce } = useContext(MotionCtx);
  const [shown, setShown] = useState(0);            // number of steps revealed
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const done = shown >= RUN_STEPS.length;
  const found = RUN_STEPS.slice(0, shown).map(step => step.finding).filter(Boolean) as string[];

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!running) return;
    if (shown >= RUN_STEPS.length) { setRunning(false); return; }
    timer.current = window.setTimeout(() => setShown(count => count + 1), reduce ? 0 : 1150);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [running, shown, reduce]);

  const start = () => { setOpen(null); setShown(0); setRunning(true); };
  const finding = FINDINGS.find(item => item.id === open);

  return <div className="v7-lab-grid">
    <div>
      <div className="v7-lab-bar">
        <p className="v7-lab-target">Target <b>{DECOY}</b> <span>decoy, fictional</span></p>
        <button type="button" className="v7-btn" onClick={start} disabled={running}>{done ? 'Run again' : running ? 'Running' : 'Run the scan'}</button>
      </div>
      <ol className="v7-run" aria-live="polite">
        {RUN_STEPS.slice(0, shown).map((step, index) => <li key={step.id}>
          <h3>{step.title}</h3>
          <pre>{step.lines.join('\n')}</pre>
          {step.finding && <p className="v7-run-hit">Finding {step.finding} recorded</p>}
          {index === shown - 1 && !done && running && <i className="v7-run-cursor" aria-hidden="true" />}
        </li>)}
        {!shown && <li className="v7-run-idle">Press “Run the scan”. The steps below match what Zak’s Spider does: DNS and certificate inspection, subdomain discovery from certificate transparency logs, robots.txt parsing and security-header grading.</li>}
      </ol>
    </div>

    <aside className="v7-findings" aria-label="Findings">
      <h2>Findings <span>{found.length} of {FINDINGS.length}</span></h2>
      {!found.length && <p className="v7-lab-empty">Nothing yet.</p>}
      <ul>{FINDINGS.filter(item => found.includes(item.id)).map(item => <li key={item.id}>
        <button type="button" className={`v7-finding${open === item.id ? ' is-open' : ''}`} onClick={() => setOpen(open === item.id ? null : item.id)} aria-expanded={open === item.id}>
          <b className={`v7-sev v7-sev-${item.severity.toLowerCase()}`}>{item.severity}</b>
          <span>{item.title}</span>
        </button>
      </li>)}</ul>
      {finding && <article className="v7-report" aria-label={`Report entry ${finding.id}`}>
        <p className="v7-report-head"><b>{finding.id}</b> · {finding.severity} · found by {finding.found}</p>
        <h3>{finding.title}</h3>
        <p className="v7-report-where">{finding.where}</p>
        <h4>Evidence</h4><pre>{finding.evidence}</pre>
        <h4>Impact</h4><p>{finding.impact}</p>
        <h4>Remediation</h4><ul>{finding.fix.map(line => <li key={line}>{line}</li>)}</ul>
        <h4>References</h4><ul>{finding.refs.map(ref => <li key={ref.url}><a className="v7-link" href={ref.url} target="_blank" rel="noreferrer noopener">{ref.label}</a></li>)}</ul>
        <p className="v7-report-note">Sample report entry on a decoy target. It shows the format I write findings in.</p>
      </article>}
    </aside>
  </div>;
}
