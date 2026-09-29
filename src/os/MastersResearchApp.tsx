import React, { useState } from 'react';
import { useSystemContext, MastersResearchData } from './state';
import { BespokeResearchIcon, Icon } from './Icon';

export const DEFAULT_MASTERS_RESEARCH: MastersResearchData = {
  thesisTitle: 'Adversarial Machine Learning & Kernel-Level Sandboxing in Zero-Trust Runtimes',
  institution: 'Faculty of Computer Science & Cybersecurity Engineering',
  degreeName: 'Master of Science (MSc) in Cybersecurity & Distributed Systems',
  year: '2024 — 2025',
  defenseStatus: 'Thesis in Final Review & Publication Phase',
  abstract: 'Modern intrusion detection systems increasingly rely on deep neural networks to flag malicious telemetry. However, adversarial perturbation attacks (FGSM, Carlini-Wagner, and packet timing jitter) can systematically blind these models without disrupting malicious payload delivery. This research introduces a dual defense framework: an adversarial manifold projection pipeline that neutralizes evasion attacks on neural NIDS, coupled with an eBPF Linux Security Module (LSM) kernel sandbox that enforces hardware-backed syscall policies at sub-microsecond latency, preventing post-exploitation privilege escalation even if the neural detector fails.',
  pillars: [
    {
      title: '01. Adversarial Evasion & Perturbation Defense',
      summary: 'Investigating evasion vulnerabilities in deep packet inspection classifiers under gradient-based and black-box payload jitter.',
      findings: 'Developed an invariant feature embedding mechanism reducing adversarial evasion success rate from 84.6% down to 8.2% across benchmark datasets (CIC-IDS2017, NSL-KDD).'
    },
    {
      title: '02. eBPF Linux Security Module (LSM) Sandboxing',
      summary: 'Architecting in-kernel security enclaves that inspect syscall arguments before execution without context switches to userspace.',
      findings: 'Achieved 0.12 µs hook latency overhead (over 30x faster than ptrace-based interceptors), completely blocking unprivileged namespace escapes and container breakouts.'
    },
    {
      title: '03. Zero-Trust Hardware-Attested Workload Identity',
      summary: 'Binding ephemeral microservice tokens to kernel execution contexts and TPM 2.0 measurements to eliminate static bearer tokens.',
      findings: 'Eliminated replay and token theft attack surfaces by verifying cryptographically signed eBPF ring-buffer telemetry in real time.'
    }
  ],
  metrics: [
    { label: 'Hook Latency Overhead', value: '0.12 µs' },
    { label: 'Evasion Resilience', value: '91.8%' },
    { label: 'Container Breakout Defense', value: '100%' },
    { label: 'Kernel Throughput', value: '4.2 Mpps' }
  ],
  citationsCount: 14,
  paperUrl: ''
};

export function MastersResearchApp() {
  const s = useSystemContext();
  const research: MastersResearchData = s.config?.mastersResearch || DEFAULT_MASTERS_RESEARCH;
  const [copiedBib, setCopiedBib] = useState(false);
  const [activeBenchmark, setActiveBenchmark] = useState<'latency' | 'evasion'>('latency');

  const bibtex = `@thesis{oukil2025adversarial,
  author    = {Zakarya Oukil},
  title     = {Adversarial Machine Learning and Kernel-Level Sandboxing in Zero-Trust Runtimes},
  school    = {Faculty of Computer Science and Cybersecurity},
  year      = {2025},
  type      = {Master's Thesis},
  note      = {Specialization in Offensive/Defensive Cyber Operations, eBPF Systems, and Robust ML}
}`;

  const handleCopyBib = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBib(true);
    s.notify('BibTeX citation copied to clipboard');
    setTimeout(() => setCopiedBib(false), 2000);
  };

  const handleDownloadPaper = () => {
    s.notify('Downloading Master’s Thesis Executive Abstract');
    const blob = new Blob([
      `# ${research.thesisTitle}\n\n**Candidate:** Zakarya Oukil\n**Degree:** ${research.degreeName}\n**Institution:** ${research.institution} (${research.year})\n**Status:** ${research.defenseStatus}\n\n## ABSTRACT\n${research.abstract}\n\n## KEY RESEARCH PILLARS\n${research.pillars.map(p => `### ${p.title}\n${p.summary}\n\n*Key Findings:* ${p.findings}\n`).join('\n')}\n\n## PERFORMANCE BENCHMARKS\n${research.metrics.map(m => `- **${m.label}:** ${m.value}`).join('\n')}\n\n## BIBTEX CITATION\n\`\`\`bibtex\n${bibtex}\n\`\`\``
    ], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'masters_thesis_abstract_zakarya_oukil.md';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="masters-app-stage app-scroll">
      {/* Top Header */}
      <header className="masters-header">
        <div className="masters-title-wrap">
          <div className="masters-icon-badge">
            <BespokeResearchIcon size={32} />
          </div>
          <div>
            <h1>Academic Research & Master's Thesis Folio</h1>
            <p>{research.institution} · {research.degreeName}</p>
          </div>
        </div>

        <div className="masters-actions">
          <button className="tactical-pill-btn" onClick={handleCopyBib}>
            <Icon name="code" size={15} />
            <span>{copiedBib ? 'BibTeX Copied!' : 'Copy BibTeX'}</span>
          </button>

          <button className="tactical-pill-btn primary" onClick={handleDownloadPaper}>
            <Icon name="arrow" size={15} />
            <span>Download Thesis Abstract</span>
          </button>
        </div>
      </header>

      {/* Main Thesis Overview Card */}
      <article className="thesis-hero-card">
        <div className="thesis-status-badge">
          <span className="status-indicator-dot" />
          <span>{research.defenseStatus}</span>
          <span className="thesis-year">({research.year})</span>
        </div>

        <h2>{research.thesisTitle}</h2>

        <div className="abstract-box">
          <h4>Executive Abstract</h4>
          <p>{research.abstract}</p>
        </div>

        {/* Highlight Benchmark Grid */}
        <div className="research-metric-cards">
          {research.metrics.map((m, idx) => (
            <div className="metric-box" key={idx}>
              <strong className="metric-number">{m.value}</strong>
              <span className="metric-title">{m.label}</span>
            </div>
          ))}
        </div>
      </article>

      {/* Interactive Benchmarks Visualizer */}
      <section className="benchmarks-section">
        <div className="benchmark-header">
          <div>
            <h3>Empirical Benchmarks & Experimental Results</h3>
            <p>Measured latency overhead and adversarial evasion defense tests</p>
          </div>

          <div className="benchmark-toggle-pills">
            <button
              className={activeBenchmark === 'latency' ? 'active' : ''}
              onClick={() => setActiveBenchmark('latency')}
            >
              Syscall Intercept Latency
            </button>
            <button
              className={activeBenchmark === 'evasion' ? 'active' : ''}
              onClick={() => setActiveBenchmark('evasion')}
            >
              Adversarial Evasion Rate
            </button>
          </div>
        </div>

        {activeBenchmark === 'latency' ? (
          <div className="benchmark-chart-card">
            <h4>Syscall Interception & Sandboxing Overhead (Lower is Better)</h4>
            <div className="chart-bar-row">
              <span className="bar-label">ptrace Userspace Sandbox</span>
              <div className="bar-track">
                <div className="bar-fill ptrace" style={{ width: '92%' }}>
                  <span>4.82 µs (High Overhead)</span>
                </div>
              </div>
            </div>

            <div className="chart-bar-row">
              <span className="bar-label">seccomp-bpf System Calls</span>
              <div className="bar-track">
                <div className="bar-fill seccomp" style={{ width: '28%' }}>
                  <span>0.38 µs</span>
                </div>
              </div>
            </div>

            <div className="chart-bar-row">
              <span className="bar-label">Zakarya eBPF LSM Sandbox (Thesis)</span>
              <div className="bar-track">
                <div className="bar-fill ebpf" style={{ width: '8%' }}>
                  <span>0.12 µs (Optimal In-Kernel)</span>
                </div>
              </div>
            </div>
            <small className="chart-note">Benchmarked on Linux Kernel 6.8.0-kali-amd64 via wrk and micro-benchmarks over 1,000,000 syscall iterations.</small>
          </div>
        ) : (
          <div className="benchmark-chart-card">
            <h4>Adversarial Attack Evasion Success against Neural NIDS (Lower is Better)</h4>
            <div className="chart-bar-row">
              <span className="bar-label">Standard Deep Neural NIDS (Baseline)</span>
              <div className="bar-track">
                <div className="bar-fill baseline" style={{ width: '85%' }}>
                  <span>84.6% Evasion Vulnerability</span>
                </div>
              </div>
            </div>

            <div className="chart-bar-row">
              <span className="bar-label">Adversarial Training Alone</span>
              <div className="bar-track">
                <div className="bar-fill adv-train" style={{ width: '42%' }}>
                  <span>41.3% Evasion Rate</span>
                </div>
              </div>
            </div>

            <div className="chart-bar-row">
              <span className="bar-label">Zakarya Invariant Manifold Defense (Thesis)</span>
              <div className="bar-track">
                <div className="bar-fill our-defense" style={{ width: '9%' }}>
                  <span>8.2% Robust Invariance (91.8% Blocked)</span>
                </div>
              </div>
            </div>
            <small className="chart-note">Evaluated under Carlini-Wagner L2 and FGSM gradient perturbation attacks against CIC-IDS2017 packet flow data.</small>
          </div>
        )}
      </section>

      {/* Research Pillars Breakdown */}
      <section className="research-pillars-section">
        <h3>Core Research Pillars & Contributions</h3>
        <div className="pillars-grid">
          {research.pillars.map((p, idx) => (
            <div className="pillar-card" key={idx}>
              <h4>{p.title}</h4>
              <p className="pillar-summary">{p.summary}</p>
              <div className="findings-callout">
                <strong>Key Findings:</strong>
                <span>{p.findings}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
