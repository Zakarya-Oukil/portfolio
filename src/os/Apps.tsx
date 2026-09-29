import React, { useEffect, useRef, useState } from 'react';
import { Icon, AppIcon } from './Icon';
import { apps, appNames, Mode, modeNames, Theme, useSaved, useSystemContext, Wallpaper } from './state';
import { PROJECTS } from './projects-data';

export function Settings() {
  const s = useSystemContext();
  const [github, setGithub] = useSaved('zak.github', '');
  const [username, setUsername] = useState(github);
  return <div className="settings-app app-scroll"><header className="app-heading"><div className="heading-icon"><Icon name="settings" size={27}/></div><div><h1>Make yourself at home.</h1><p>Your workspace, your way.</p></div></header>
    <section className="settings-section"><h3>Choose your experience</h3><p>Offensive and defensive cybersecurity platforms.</p>
      <div className="os-options">
        <button
          aria-pressed={s.mode === 'macos' || s.mode === 'desktop'}
          className={s.mode === 'macos' || s.mode === 'desktop' ? 'selected' : ''}
          onClick={() => s.setMode('macos')}
        >
          <Icon name="monitor" size={30}/>
          <strong>Kali Linux Workstation</strong>
          <small>Desktop Operator & Threat Hunting Terminal</small>
          {(s.mode === 'macos' || s.mode === 'desktop') && <i><Icon name="check" size={13}/></i>}
        </button>
        <button
          aria-pressed={s.mode === 'nethunter' || s.mode === 'ios' || s.mode === 'android'}
          className={s.mode === 'nethunter' || s.mode === 'ios' || s.mode === 'android' ? 'selected' : ''}
          onClick={() => s.setMode('nethunter')}
        >
          <Icon name="phone" size={30}/>
          <strong>Kali NetHunter</strong>
          <small>Tactical Handheld BadUSB & Wardriving Rig</small>
          {(s.mode === 'nethunter' || s.mode === 'ios' || s.mode === 'android') && <i><Icon name="check" size={13}/></i>}
        </button>
      </div>
    </section>
    <section className="settings-section"><h3>Appearance</h3><div className="appearance-options">{(['light', 'dark', 'oled'] as Theme[]).map(t => <button key={t} onClick={() => s.setTheme(t)} className={s.theme === t ? 'selected' : ''} aria-pressed={s.theme === t}><span className={`theme-preview preview-${t}`}><i/><i/><i/></span>{t === 'oled' ? 'OLED black' : `${t[0].toUpperCase()}${t.slice(1)}`}</button>)}</div></section>
    <section className="settings-section"><h3>Wallpaper</h3><div className="wallpaper-options">{(['sonoma', 'sequoia', 'neon', 'oled'] as Wallpaper[]).map(w => <button key={w} onClick={() => s.setWallpaper(w)} aria-pressed={s.wallpaper === w} className={s.wallpaper === w ? 'selected' : ''}><span className={`wallpaper-swatch wallpaper-${w}`}/>{({ sonoma: 'Sonoma', sequoia: 'Sequoia', neon: 'Cyberpunk', oled: 'Minimal' })[w]}</button>)}</div><p className="muted">Original landscape illustrations, with a palette that follows your wallpaper.</p></section>
    <section className="settings-section"><h3>GitHub activity</h3><p>Connect a public username to see recent public events on your desktop.</p><form className="inline-form" onSubmit={e => { e.preventDefault(); if (/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username.trim()) || !username) { setGithub(username.trim()); window.dispatchEvent(new CustomEvent('zak:github', { detail: username.trim() })); s.notify(username ? 'GitHub username saved' : 'GitHub disconnected'); } }}><input aria-label="GitHub username" placeholder="Your GitHub username" value={username} onChange={e => setUsername(e.target.value)} pattern="[a-zA-Z0-9][a-zA-Z0-9-]{0,38}"/><button className="primary-button" type="submit">Connect</button></form></section>
    <section className="settings-section about-setting"><span className="profile-monogram">z.</span><div><strong>Zakarya's Portfolio OS</strong><p>Security · Full stack · Systems · Cloud & AI</p><small>Version 1.0 · Interactive web simulation</small><p>Browser memory: {(performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) + " MB JS heap" : "not exposed by this browser"}</p></div></section>
  </div>;
}

export function Terminal() {
  const s = useSystemContext();
  const [lines, setLines] = useState<{ prompt?: boolean; text: string }[]>([
    { text: 'Kali GNU/Linux Rolling 2024.3 (x86_64) · Zsh 5.9\nLogged in as zakarya@kali (MSc Cybersecurity Candidate)\nType "help" for a list of cybersecurity and navigation commands.' }
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const cursor = useRef(0), output = useRef<HTMLDivElement>(null), autoScroll = useRef(true);
  useEffect(() => { if (autoScroll.current) output.current?.scrollTo({ top: output.current.scrollHeight }); }, [lines]);
  const run = (raw: string) => {
    const [command, ...args] = raw.trim().split(/\s+/); const argument = args[0]; let result = '';
    if (!command) return;
    setHistory(h => [...h, raw]); cursor.current = history.length + 1; setInput('');
    switch (command.toLowerCase()) {
      case 'help':
        result = 'Available Kali commands:\n\nwhoami        Operator dossier & credentials\ncerts         Verified credentials (eJPT, BTL1, Security+)\npentests      Offensive penetration test reports & CVSS audits\nsoc           SOC threat hunting & detection engineering\nresearch      Master’s thesis & kernel sandboxing folio\nnmap          Scan local target network & ports\nneofetch      Hardware, OS & kernel specifications\nskills        Offensive & defensive competencies\ntools         Arsenal & toolchain (Wireshark, Ghidra, Burp...)\nstance        Toggle Dual-Plex operator stance (red | blue)\nprojects      Browse featured security projects\nresume        View or download curriculum vitae\nos            Switch environment (desktop | nethunter)\ntheme         dark | light | oled\nclear         Clear terminal screen (or Ctrl+L)\n\n↑ / ↓ command history · Tab autocomplete · Ctrl+L clear';
        break;
      case 'whoami':
        result = 'Zakarya Oukil\nMSc Cybersecurity Candidate · eJPT Certified Penetration Tester · BTL1 SOC Analyst\nFocus: Zero-trust architecture, reverse engineering, defensive threat hunting.';
        break;
      case 'certs':
      case 'cert':
        s.open('credentials-sig');
        result = '[VERIFIED CREDENTIALS]\n• eJPT (eLearnSecurity Junior Penetration Tester) — Certified\n• BTL1 (Blue Team Level 1) — In Progress / Final Exam Phase\n• CompTIA Security+ (SY0-701) — In Progress\n• MSc Cybersecurity & Information Assurance — Candidate\nOpening Cryptographic Attestation Modal...';
        break;
      case 'pentests':
      case 'audits':
        s.open('pentest-reports');
        result = 'Opening Offensive Security Audit & CVE Vault...';
        break;
      case 'soc':
      case 'hunting':
        s.open('soc-hunting');
        result = 'Opening SOC Command & Threat Hunting Center...';
        break;
      case 'research':
      case 'thesis':
        s.open('masters-research');
        result = 'Opening Academic Research & Master’s Thesis Folio...';
        break;
      case 'ducky':
      case 'badusb':
        s.open('duckhunter');
        result = 'Opening NetHunter DuckHunter BadUSB Studio...';
        break;
      case 'stance':
        if (argument === 'red' || argument === 'blue') {
          s.setOperatorStance(argument);
          result = `Operator Stance set to [${argument.toUpperCase()}].`;
        } else {
          result = `Current stance: [${s.operatorStance.toUpperCase()}]. Usage: stance [red|blue]`;
        }
        break;
      case 'nmap':
        result = 'Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for zak-workstation.lab (10.10.14.22)\nHost is up (0.00042s latency).\n\nPORT      STATE SERVICE    VERSION\n22/tcp    open  ssh        OpenSSH 9.6p1 Debian\n80/tcp    open  http       Portfolio OS 2.0 (React/TypeScript)\n443/tcp   open  https      TLS 1.3 (ChaCha20-Poly1305)\n8080/tcp  open  http-proxy Kali Workstation Defense Gateway\n\nNmap done: 1 IP address (1 host up) scanned in 0.28 seconds';
        break;
      case 'resume':
      case 'cv':
      case 'cat':
        if (command.toLowerCase() === 'cat' && argument && argument.toLowerCase() !== 'resume.pdf') {
          result = `cat: ${argument}: No such file or directory`;
          break;
        }
        if (s.config?.recruiter?.resumeUrl) {
          window.open(s.config.recruiter.resumeUrl, '_blank');
          result = 'Opening CV / Resume document...';
        } else {
          s.notify('CV Download · Opening Credentials & Dossier');
          s.open('about');
          result = 'Redirecting to Operator Credentials & Dossier...';
        }
        break;
      case 'neofetch':
        result = `    ______     zakarya@kali\n   /_  __/     ---------------------\n    / /        OS: Kali GNU/Linux Rolling 2024.3 (x86_64)\n   / /__       Host: Offensive Security Lab Rig (Bare Metal)\n  /____/       Kernel: 6.8.0-kali-amd64\n               Uptime: 99.98% High Availability\n               Shell: zsh 5.9 (x86_64-debian-linux-gnu)\n               Cipher: ChaCha20-Poly1305 / TLS 1.3 Active\n               Display: ${window.innerWidth} × ${window.innerHeight}\n               Memory: ${(performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) + ' MB JS heap' : '32 GB DDR5 (8.2 GB Active)'}`;
        break;
      case 'skills':
        result = 'OFFENSIVE   eJPT Penetration Testing · Network Pivoting · Exploitation · Web Pentesting\nDEFENSIVE   BTL1 SOC Operations · Wireshark Packet Analysis · Splunk/ELK · Incident Response\nSYSTEMS     C / C++ · Rust · Go · Linux Kernel & eBPF · WebAssembly\nCLOUD & AI  Zero-Trust Architecture · Container Security · LLM Red-Teaming';
        break;
      case 'tools':
        result = 'Kali Linux · Ghidra · Wireshark · Burp Suite · Metasploit · Nmap · BloodHound\nDocker · Kubernetes · Python · Go · FastAPI · Snort · Suricata · Frida';
        break;
      case 'projects':
        result = s.projects.map((p, i) => `${String(i + 1).padStart(2, '0')}  ${p.title}`).join('\n');
        break;
      case 'os':
        if (['macos', 'desktop', 'nethunter', 'ios', 'android'].includes(argument)) {
          s.setMode(argument === 'desktop' ? 'macos' : argument as Mode);
          result = `Switched to ${argument}.`;
        } else {
          result = 'Usage: os [desktop|nethunter]';
        }
        break;
      case 'theme':
        if (['dark', 'light', 'oled'].includes(argument)) { s.setTheme(argument as Theme); result = `Appearance set to ${argument}.`; }
        else result = 'Usage: theme [dark|light|oled]';
        break;
      case 'clear':
        setLines([]);
        return;
      default:
        result = `Command not found: ${command}\nType help to see available Kali commands.`;
    }
    autoScroll.current = true;
    setLines(l => [...l, { prompt: true, text: raw }, { text: result }]);
  };
  return (
    <div className="terminal-app kali-terminal-app">
      <div className="terminal-meta">
        <span><i className="status-dot"/> tun0: 10.10.14.22 (Connected)</span>
        <span>zsh — zakarya@kali</span>
      </div>
      <div className="terminal-output" ref={output} onScroll={e => { const el = e.currentTarget; autoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40; }} role="log" aria-label="Terminal output">
        {lines.map((l, i) => (
          <pre key={i} className={l.prompt ? 'command kali-cmd-line' : ''}>
            {l.prompt && <span className="kali-prompt-text">┌──(zakarya㉿kali)-[~] └─$&nbsp;</span>}
            {l.text}
          </pre>
        ))}
      </div>
      <form className="terminal-input kali-term-input" onSubmit={e => { e.preventDefault(); run(input); }}>
        <label htmlFor="terminal-command" className="kali-prompt-text">┌──(zakarya㉿kali)-[~] └─$&nbsp;</label>
        <input
          id="terminal-command"
          aria-label="Terminal command"
          value={input}
          autoComplete="off"
          spellCheck={false}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              cursor.current = Math.max(0, cursor.current - 1);
              setInput(history[cursor.current] || '');
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              cursor.current = Math.min(history.length, cursor.current + 1);
              setInput(history[cursor.current] || '');
            }
            if (e.key === 'Tab') {
              e.preventDefault();
              const match = ['help', 'whoami', 'certs', 'nmap', 'soc', 'resume', 'neofetch', 'skills', 'tools', 'projects', 'os', 'theme', 'clear'].find(c => c.startsWith(input));
              if (match) setInput(match);
            }
            if (e.ctrlKey && e.key === 'l') {
              e.preventDefault();
              setLines([]);
            }
          }}
        />
        <button aria-label="Run command" type="submit">
          <Icon name="arrow" size={18}/>
        </button>
      </form>
    </div>
  );
}

export function Mail() {
  const s = useSystemContext();
  const [draft, setDraft] = useSaved('zak.mail', { name: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const errors = { name: draft.name.trim().length < 2 ? 'Please enter your name.' : '', email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) ? 'Enter a valid email address.' : '', subject: draft.subject.trim().length < 3 ? 'Add a subject with at least 3 characters.' : '', message: draft.message.trim().length < 10 ? 'Write a message with at least 10 characters.' : '' };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.values(errors).some(Boolean)) return;
    
    setSending(true);
    try {
      const res = await fetch('/api/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      if (res.ok) {
        setSent(true);
        s.notify('Inquiry saved to the portfolio inbox');
        setDraft({ name: '', email: '', subject: '', message: '' });
        setTouched({});
      } else {
        s.notify('Could not send message. Please try again.');
      }
    } catch {
      s.notify('Network error sending message.');
    } finally {
      setSending(false);
    }
  };

  const download = () => {
    const body = `Subject: ${draft.subject.replace(/[\r\n]/g, '')}\r\nX-Unsent: 1\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nFrom: ${draft.name} <${draft.email}>\r\n\r\n${draft.message}`;
    const url = URL.createObjectURL(new Blob([body], { type: 'message/rfc822' }));
    const a = document.createElement('a'); a.href = url; a.download = 'hello-zakarya.eml'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="mail-app app-scroll">
    <header className="app-heading"><div className="heading-icon"><Icon name="mail" size={28}/></div><div><h1>Good things start with hello.</h1><p>A project, an opportunity, or just a conversation.</p></div></header>
    
    <form onSubmit={handleSubmit} noValidate>
      {(['name', 'email', 'subject', 'message'] as const).map(key => (
        <div className="form-field" key={key}>
          <label htmlFor={`mail-${key}`}>{key === 'email' ? 'Your email' : key === 'name' ? 'Your name' : key[0].toUpperCase() + key.slice(1)}</label>
          {key === 'message' ? (
            <textarea id={`mail-${key}`} rows={6} placeholder="Tell me what you have in mind…" value={draft[key]} aria-invalid={!!(touched[key] && errors[key])} aria-describedby={`${key}-error`} onBlur={() => setTouched(t => ({ ...t, [key]: true }))} onChange={e => { setDraft(d => ({ ...d, [key]: e.target.value })); setSent(false); }}/>
          ) : (
            <input id={`mail-${key}`} type={key === 'email' ? 'email' : 'text'} autoComplete={key === 'email' || key === 'name' ? key : 'off'} value={draft[key]} placeholder={{ name: 'Alex Morgan', email: 'alex@example.com', subject: "Let's build something" }[key]} aria-invalid={!!(touched[key] && errors[key])} aria-describedby={`${key}-error`} onBlur={() => setTouched(t => ({ ...t, [key]: true }))} onChange={e => { setDraft(d => ({ ...d, [key]: e.target.value })); setSent(false); }}/>
          )}
          <span className="field-error" id={`${key}-error`}>{touched[key] && errors[key]}</span>
        </div>
      ))}
      <div className="mail-submit">
        <small>Inquiries are saved to this portfolio’s private inbox.</small>
        <button className="primary-button" type="submit" disabled={sending}>
          {sending ? 'Transmitting…' : 'Send message'} <Icon name="arrow" size={17}/>
        </button>
      </div>
    </form>

    {sent && (
      <div className="mail-success" role="status">
        <Icon name="check"/>
        <div>
          <strong>Message delivered to Zakarya!</strong>
          <p>Thank you for reaching out. Your message has been logged in my inbox and I will get back to you shortly.</p>
          <button onClick={download} style={{ cursor: 'pointer', background: 'none', border: 0, padding: 0 }}>Download backup EML copy ↗</button>
        </div>
      </div>
    )}
  </div>;
}

export function About() {
  const s = useSystemContext();
  return <div className="about-app app-scroll"><div className="about-avatar">z<span>.</span></div><div className="overline">THE PERSON BEHIND THE PIXELS</div><h1>Hi, I'm Zakarya.</h1><p className="about-lead">I like understanding how things work.<br/>Then making them work better.</p><p>My work lives at the intersection of security, thoughtful interfaces, and the systems underneath. From a memory allocator to an AI security tool, curiosity is the common thread.</p><div className="about-domains">{['Security & CTF', 'Full Stack', 'Systems & OS', 'Cloud & AI'].map((d, i) => <span key={d}><Icon name={['shield', 'code', 'chip', 'cloud'][i]}/>{d}</span>)}</div><div className="about-actions"><button className="primary-button" onClick={() => s.open('projects')}>Explore my work <Icon name="arrow" size={16}/></button><button className="secondary-button" onClick={() => s.open('mail')}>Say hello</button></div><footer>Built with React, TypeScript, and a healthy attention to detail.</footer></div>;
}
