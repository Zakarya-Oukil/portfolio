import React, { useEffect, useState } from 'react';
import { AppIcon, KaliDragonIcon } from '../os/Icon';
import './admin.css';
import { cachePortfolio, cachedPortfolio, fetchPortfolio, DRAFT_KEY, validPortfolio } from '../os/portfolio-store';
import { CommandCenterAdmin, ProjectExtras } from './CommandCenterAdmin';
import { CyberAppsAdmin } from './CyberAppsAdmin';
import { MissionHudConfig, MissionHudBadge, MissionHudAction, MissionHudTelemetry, MissionHudResearch, MissionHudStackGroup } from '../os/state';

interface TabItem {
  id: string;
  name: string;
  slogan: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface ProjectItem {
  id: string;
  country: string;
  title: string;
  subtitle: string;
  location: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  duration: string;
  distance: string;
  likes: number;
  saves: number;
  views: number;
  description: string;
}

interface CustomWallpaper {
  id: string;
  name: string;
  url: string;
}

interface WidgetVisibility {
  about: boolean;
  certs: boolean;
  github: boolean;
  neofetch: boolean;
  telemetry: boolean;
  clock: boolean;
  notes: boolean;
}

interface AboutWidgetData {
  avatar?: string;
  name: string;
  role: string;
  statusText: string;
  statusType: 'available' | 'busy' | 'open';
  location: string;
  specialties: string[];
  bio: string;
  resumeUrl?: string;
}

interface CertItem {
  id: string;
  title: string;
  badge: string;
  issuer: string;
  date: string;
  verifyUrl?: string;
  accent?: string;
}

interface NeofetchData {
  os: string;
  host: string;
  kernel: string;
  shell: string;
  uptime: string;
  cipher: string;
  memory: string;
}

interface WidgetsConfig {
  visibility: WidgetVisibility;
  about: AboutWidgetData;
  certs: CertItem[];
  neofetch: NeofetchData;
}

interface PortfolioConfig {
  [key: string]: any;
  defaultTheme: 'light' | 'dark' | 'oled';
  defaultWallpaper: 'sonoma' | 'sequoia' | 'neon' | 'oled';
  githubUsername?: string;
  customWallpapers: CustomWallpaper[];
  bio: {
    name: string;
    title: string;
    greeting: string;
    slogan: string;
  };
  appIcons?: {
    macos?: Record<string, string>;
    ios?: Record<string, string>;
    android?: Record<string, string>;
  };
  widgets?: WidgetsConfig;
  missionHud?: MissionHudConfig;
}

interface PortfolioData {
  tabs: TabItem[];
  projects: ProjectItem[];
  config: PortfolioConfig;
  lastUpdated?: string;
}

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

type AdminSection =
  | 'tabs'
  | 'projects'
  | 'icons'
  | 'appearance'
  | 'widgets'
  | 'missionHud'
  | 'pentestReports'
  | 'socRules'
  | 'mastersResearch'
  | 'netHunter'
  | 'recruiterFastPass'
  | 'inbox';

const SYSTEM_APPS = [
  { id: 'projects', name: 'Projects', desc: 'Central showcase of engineering systems and CTF work' },
  { id: 'terminal', name: 'Terminal', desc: 'Interactive developer & cybersecurity CLI environment' },
  { id: 'settings', name: 'Settings', desc: 'System customizer, appearance switcher, and telemetry' },
  { id: 'mail', name: 'Mail', desc: 'Direct visitor inquiry transmission and correspondence' },
  { id: 'about', name: 'About me', desc: 'Developer backstory, identity, and discipline overview' }
];

export function AdminDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeSection, setActiveSection] = useState<AdminSection>('tabs');
  const [selectedProjectTab, setSelectedProjectTab] = useState<string>('');
  const [selectedIconOS, setSelectedIconOS] = useState<'macos' | 'ios' | 'android'>('macos');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [storageWarning, setStorageWarning] = useState('');
  useEffect(() => { fetch('/api/admin/session', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(result => setIsAuthenticated(result?.authenticated === true)).catch(() => {}); }, []);
  useEffect(() => { if (!data || !isAuthenticated) return; const timer = setTimeout(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); setStorageWarning(''); } catch { setStorageWarning('Browser storage is full or unavailable. Publish to the server to preserve these edits.'); } }, 250); return () => clearTimeout(timer); }, [data, isAuthenticated]);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetchPortfolio().catch(() => cachedPortfolio()),
      fetch('/api/messages').then(r => r.ok ? r.json() : []).catch(() => [])
    ]).then(([portfolioData, messagesData]) => {
      let draft; try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { /* No draft. */ }
      const next = validPortfolio(draft) ? draft : portfolioData;
      setData(next); setMessages(Array.isArray(messagesData) ? messagesData : []);
      setSelectedProjectTab(next.tabs[0]?.name || ''); setLoading(false);
      if (validPortfolio(draft)) setSaveStatus('Restored your browser draft. Publish when ready.');
    }).catch(() => { setData(cachedPortfolio()); setLoading(false); });
  }, [isAuthenticated]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      const json = await res.json();
      if (res.ok && json.success) { setPasswordInput(''); setIsAuthenticated(true); triggerToast('Welcome back. Your admin session is active.'); }
      else setLoginError(json.error || 'Invalid credentials.');
    } catch { setLoginError('The admin service is unavailable. Start the portfolio server to sign in.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try { const response = await fetch('/api/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); if (!response.ok) throw new Error(); setIsAuthenticated(false); setData(null); setUsernameInput(''); setPasswordInput(''); setLoginError(null); }
    catch { triggerToast('Could not end the server session. Reconnect and retry Lock.'); }
  };

  const handleSaveData = async () => {
    if (!data) return; setSaving(true);
    try {
      const res = await fetch('/api/portfolio-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.status === 401) { setIsAuthenticated(false); setLoginError('Session expired. Sign in again; your draft is preserved.'); return; }
      if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || 'Publishing service unavailable'); }
      const result = await res.json(); cachePortfolio(result.data); setData(result.data);
      setSaveStatus('Published to all visitors. Open portfolio tabs refresh automatically.'); triggerToast('Portfolio published.');
    } catch (error) {
      const stored = cachePortfolio({ ...data, _localOnly: true });
      setSaveStatus((error instanceof Error ? error.message + '. ' : '') + (stored ? 'Saved in this browser only. Retry Publish to update other visitors.' : 'Storage unavailable. Keep this page open and retry Publish.'));
    } finally { setSaving(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void, contextId: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type) || file.size > 1500000) { triggerToast('Choose a PNG, JPEG, WebP, or GIF smaller than 1.5 MB.'); return; }
    setUploadingImage(contextId); const reader = new FileReader();
    reader.onload = () => { onComplete(reader.result as string); setUploadingImage(null); triggerToast('Image added to draft. Publish to share it.'); };
    reader.onerror = () => { setUploadingImage(null); triggerToast('Could not read image.'); };
    reader.readAsDataURL(file);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch('/api/messages/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setMessages(m => m.filter(msg => msg.id !== id));
        triggerToast('Message deleted.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- TAB MODIFIERS ---
  const handleUpdateTab = (index: number, field: keyof TabItem, value: string) => {
    if (!data) return;
    const updatedTabs = [...data.tabs];
    const oldName = updatedTabs[index].name;
    updatedTabs[index] = { ...updatedTabs[index], [field]: value };
    
    let updatedProjects = data.projects;
    if (field === 'name' && oldName !== value) {
      updatedProjects = updatedProjects.map(p => p.country === oldName ? { ...p, country: value } : p);
      if (selectedProjectTab === oldName) setSelectedProjectTab(value);
    }

    setData({ ...data, tabs: updatedTabs, projects: updatedProjects });
  };

  const handleAddTab = () => {
    if (!data) return;
    const newTabName = `New Category ${data.tabs.length + 1}`;
    const newTab: TabItem = {
      id: newTabName,
      name: newTabName,
      slogan: 'NEW DISCIPLINE & INNOVATION',
      title: newTabName,
      subtitle: 'Exploration and architecture in modern technology',
      icon: 'code'
    };
    setData({
      ...data,
      tabs: [...data.tabs, newTab]
    });
    setSelectedProjectTab(newTabName);
    triggerToast(`Added "${newTabName}" tab.`);
  };

  const handleDeleteTab = (index: number) => {
    if (!data) return;
    const tabToDelete = data.tabs[index];
    if (!confirm(`Delete "${tabToDelete.name}" tab and associated projects?`)) return;
    
    const updatedTabs = data.tabs.filter((_, i) => i !== index);
    const updatedProjects = data.projects.filter(p => p.country !== tabToDelete.name);
    
    setData({
      ...data,
      tabs: updatedTabs,
      projects: updatedProjects
    });
    if (selectedProjectTab === tabToDelete.name) {
      setSelectedProjectTab(updatedTabs[0]?.name || '');
    }
    triggerToast(`Removed "${tabToDelete.name}".`);
  };

  // --- PROJECT MODIFIERS ---
  const handleUpdateProject = (id: string, field: keyof ProjectItem, value: any) => {
    if (!data) return;
    const updatedProjects = data.projects.map(p => {
      if (p.id !== id) return p;
      return { ...p, [field]: value };
    });
    setData({ ...data, projects: updatedProjects });
  };

  const handleAddProject = (tabName: string) => {
    if (!data) return;
    const newId = `project-${Date.now()}`;
    const newProject: ProjectItem = {
      id: newId,
      country: tabName,
      title: 'New Innovation Project',
      subtitle: 'Core Architecture & Implementation',
      location: 'TypeScript / Node.js / Linux',
      tags: ['Innovation', 'Architecture', 'TypeScript'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=90',
      imageAlt: 'Project preview thumbnail',
      duration: 'PRODUCTION',
      distance: '0.1ms LAT',
      likes: 120,
      saves: 34,
      views: 560,
      description: 'Engineered a high-performance system addressing modern performance and security constraints.'
    };
    setData({
      ...data,
      projects: [newProject, ...data.projects]
    });
    triggerToast(`Added new project to "${tabName}".`);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (!confirm(`Delete project "${title}"?`)) return;
    if (!data) return;
    setData({
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    });
    triggerToast(`Deleted "${title}".`);
  };

  // --- APP ICON MODIFIERS ---
  const handleUpdateAppIcon = (os: 'macos' | 'ios' | 'android', appId: string, url: string) => {
    if (!data) return;
    const currentIcons = data.config.appIcons || { macos: {}, ios: {}, android: {} };
    const osIcons = { ...(currentIcons[os] || {}) };
    osIcons[appId] = url;
    setData({
      ...data,
      config: {
        ...data.config,
        appIcons: {
          ...currentIcons,
          [os]: osIcons
        }
      }
    });
  };

  const handleResetAppIcon = (os: 'macos' | 'ios' | 'android', appId: string) => {
    handleUpdateAppIcon(os, appId, '');
    triggerToast(`Reset ${appId} icon on ${os.toUpperCase()} to default authentic SVG.`);
  };

  const handleCopyIconsToAll = (sourceOS: 'macos' | 'ios' | 'android') => {
    if (!data) return;
    const currentIcons = data.config.appIcons || { macos: {}, ios: {}, android: {} };
    const sourceMap = currentIcons[sourceOS] || {};
    setData({
      ...data,
      config: {
        ...data.config,
        appIcons: {
          macos: { ...sourceMap },
          ios: { ...sourceMap },
          android: { ...sourceMap }
        }
      }
    });
    triggerToast(`Copied ${sourceOS.toUpperCase()} icons to all operating systems!`);
  };

  // --- CONFIG MODIFIERS ---
  const handleUpdateConfig = (field: keyof PortfolioConfig['bio'], value: string) => {
    if (!data) return;
    setData({
      ...data,
      config: {
        ...data.config,
        bio: {
          ...data.config.bio,
          [field]: value
        }
      }
    });
  };

  const handleUpdateAppearance = (field: 'defaultTheme' | 'defaultWallpaper', value: any) => {
    if (!data) return;
    setData({
      ...data,
      config: {
        ...data.config,
        [field]: value
      }
    });
  };

  // --- WIDGET MODIFIERS ---
  const handleToggleWidget = (key: keyof WidgetVisibility) => {
    if (!data) return;
    const currentWidgets = data.config.widgets || {
      visibility: { about: true, certs: true, github: true, neofetch: true, telemetry: false, clock: false, notes: false },
      about: { name: 'Zakarya Oukil', role: 'Security Researcher & Systems Architect', statusText: 'Available for Hire', statusType: 'available', location: 'Algiers / Remote', specialties: ['Zero-Trust', 'Reverse Eng', 'High-Concurrency', 'Kernel'], bio: '', resumeUrl: '', avatar: '' },
      certs: [],
      neofetch: { os: '', host: '', kernel: '', shell: '', uptime: '', cipher: '', memory: '' }
    };
    const nextVis = {
      ...currentWidgets.visibility,
      [key]: !currentWidgets.visibility[key]
    };
    setData({
      ...data,
      config: {
        ...data.config,
        widgets: {
          ...currentWidgets,
          visibility: nextVis
        }
      }
    });
    triggerToast(`Desktop Widget "${key}" set to ${nextVis[key] ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  const handleUpdateAbout = (field: keyof AboutWidgetData, value: any) => {
    if (!data) return;
    const currentWidgets = data.config.widgets || {
      visibility: { about: true, certs: true, github: true, neofetch: true, telemetry: false, clock: false, notes: false },
      about: { name: 'Zakarya Oukil', role: 'Security Researcher & Systems Architect', statusText: 'Available for Hire', statusType: 'available', location: 'Algiers / Remote', specialties: ['Zero-Trust', 'Reverse Eng', 'High-Concurrency', 'Kernel'], bio: '', resumeUrl: '', avatar: '' },
      certs: [],
      neofetch: { os: '', host: '', kernel: '', shell: '', uptime: '', cipher: '', memory: '' }
    };
    setData({
      ...data,
      config: {
        ...data.config,
        widgets: {
          ...currentWidgets,
          about: {
            ...currentWidgets.about,
            [field]: value
          }
        }
      }
    });
  };

  const handleUpdateCert = (id: string, field: keyof CertItem, value: string) => {
    if (!data) return;
    const currentWidgets = data.config.widgets || {
      visibility: { about: true, certs: true, github: true, neofetch: true, telemetry: false, clock: false, notes: false },
      about: { name: 'Zakarya Oukil', role: 'Security Researcher & Systems Architect', statusText: 'Available for Hire', statusType: 'available', location: 'Algiers / Remote', specialties: ['Zero-Trust', 'Reverse Eng', 'High-Concurrency', 'Kernel'], bio: '', resumeUrl: '', avatar: '' },
      certs: [],
      neofetch: { os: '', host: '', kernel: '', shell: '', uptime: '', cipher: '', memory: '' }
    };
    setData({
      ...data,
      config: {
        ...data.config,
        widgets: {
          ...currentWidgets,
          certs: currentWidgets.certs.map(c => c.id === id ? { ...c, [field]: value } : c)
        }
      }
    });
  };

  const handleAddCert = () => {
    if (!data) return;
    const currentWidgets = data.config.widgets || {
      visibility: { about: true, certs: true, github: true, neofetch: true, telemetry: false, clock: false, notes: false },
      about: { name: 'Zakarya Oukil', role: 'Security Researcher & Systems Architect', statusText: 'Available for Hire', statusType: 'available', location: 'Algiers / Remote', specialties: ['Zero-Trust', 'Reverse Eng', 'High-Concurrency', 'Kernel'], bio: '', resumeUrl: '', avatar: '' },
      certs: [],
      neofetch: { os: '', host: '', kernel: '', shell: '', uptime: '', cipher: '', memory: '' }
    };
    const newCert: CertItem = {
      id: `cert-${Date.now()}`,
      title: 'New Credential',
      badge: 'Certified',
      issuer: 'Security Authority',
      date: '2024',
      verifyUrl: '',
      accent: '#38bdf8'
    };
    setData({
      ...data,
      config: {
        ...data.config,
        widgets: {
          ...currentWidgets,
          certs: [...currentWidgets.certs, newCert]
        }
      }
    });
    triggerToast('Added new certification trophy slot.');
  };

  const handleDeleteCert = (id: string) => {
    if (!data) return;
    const currentWidgets = data.config.widgets || {
      visibility: { about: true, certs: true, github: true, neofetch: true, telemetry: false, clock: false, notes: false },
      about: { name: 'Zakarya Oukil', role: 'Security Researcher & Systems Architect', statusText: 'Available for Hire', statusType: 'available', location: 'Algiers / Remote', specialties: ['Zero-Trust', 'Reverse Eng', 'High-Concurrency', 'Kernel'], bio: '', resumeUrl: '', avatar: '' },
      certs: [],
      neofetch: { os: '', host: '', kernel: '', shell: '', uptime: '', cipher: '', memory: '' }
    };
    setData({
      ...data,
      config: {
        ...data.config,
        widgets: {
          ...currentWidgets,
          certs: currentWidgets.certs.filter(c => c.id !== id)
        }
      }
    });
    triggerToast('Deleted certification trophy.');
  };

  const handleUpdateNeofetch = (field: keyof NeofetchData, value: string) => {
    if (!data) return;
    const currentWidgets = data.config.widgets || {
      visibility: { about: true, certs: true, github: true, neofetch: true, telemetry: false, clock: false, notes: false },
      about: { name: 'Zakarya Oukil', role: 'Security Researcher & Systems Architect', statusText: 'Available for Hire', statusType: 'available', location: 'Algiers / Remote', specialties: ['Zero-Trust', 'Reverse Eng', 'High-Concurrency', 'Kernel'], bio: '', resumeUrl: '', avatar: '' },
      certs: [],
      neofetch: { os: '', host: '', kernel: '', shell: '', uptime: '', cipher: '', memory: '' }
    };
    setData({
      ...data,
      config: {
        ...data.config,
        widgets: {
          ...currentWidgets,
          neofetch: {
            ...currentWidgets.neofetch,
            [field]: value
          }
        }
      }
    });
  };

  // --- KALI WORKSTATION & MISSION HUD MODIFIERS ---
  const getHudConfig = (): MissionHudConfig => {
    return data?.config?.missionHud || {
      title: 'ZAKARYA OUKIL',
      tagline: 'Master’s Degree Candidate in Cybersecurity · eJPT Certified · BTL1 SOC Analyst',
      promptLead: '┌──(zakarya㉿kali)-[~/portfolio]',
      promptCmd: '└─$ whoami --verbose',
      showDragon: true,
      telemetry: {
        status: 'OPERATIONAL 🟢',
        clearance: 'L3 SECOPS',
        tun0: '10.10.14.22',
        certs: 'eJPT · BTL1 · Security+'
      },
      terminalOutput: [
        'uid=1000(zakarya) gid=1000(kali) groups=1000(kali),27(sudo),1337(redteam,blueteam)',
        '[+] OPERATOR    : Zakarya Oukil (Security Researcher & Systems Architect)',
        '[+] ACADEMIC    : Master\'s Degree Candidate in Cybersecurity (Zero-Trust Specialization)',
        '[+] CREDENTIALS : eJPT Verified · BTL1 SOC Analyst · CompTIA Security+',
        '[+] CAPABILITIES: Adversarial ML · Threat Hunting · Kernel Sandboxing · Exploit Chaining',
        '[+] AVAILABILITY: Open to Red Team, Blue Team, & Systems Engineering Roles'
      ],
      stackGroups: [
        {
          domain: 'Offensive & Red Team',
          tools: ['Ghidra', 'Burp Suite Pro', 'Metasploit', 'Nmap', 'BloodHound', 'Impacket', 'SQLmap', 'Hashcat']
        },
        {
          domain: 'Defensive & Blue Team (BTL1)',
          tools: ['Wireshark', 'Suricata / Snort', 'Splunk SIEM', 'Elastic Security', 'Volatility 3', 'Autopsy', 'Zeek']
        },
        {
          domain: 'Systems & Engineering',
          tools: ['Python (Scapy, AsyncIO)', 'C / C++', 'Linux Kernel 6.x', 'Docker Container Enclaves', 'Kubernetes', 'Git']
        }
      ],
      research: {
        title: 'Adversarial ML & Kernel Sandboxing in Zero-Trust Runtimes',
        subtitle: "Master's Degree Research Project & Thesis",
        abstract: 'Investigating adversarial evasion against neural intrusion detection systems and developing hardware-isolated eBPF runtime sandboxing to prevent post-exploitation privilege escalation in Linux production environments.',
        metrics: [
          { label: 'Security Repositories', value: '16+' },
          { label: 'Audited Pentest Engagements', value: '2' },
          { label: 'Hands-on Lab Scenarios', value: '100%' },
          { label: 'Uptime / Stability', value: '99.98%' }
        ]
      },
      badges: [
        { id: 'b1', label: 'eJPT Certified', type: 'certified' },
        { id: 'b2', label: 'BTL1 SOC Analyst', type: 'in-progress' },
        { id: 'b3', label: 'CompTIA Security+', type: 'in-progress' },
        { id: 'b4', label: 'MSc Cybersecurity', type: 'degree' }
      ],
      actions: [
        { id: 'a1', label: '60-Second Recruiter Brief', icon: 'quickstart', appId: 'quickstart' },
        { id: 'a2', label: 'SOC Incident Simulator', icon: 'defense', appId: 'defense' },
        { id: 'a3', label: 'Kali Zsh Shell', icon: 'terminal', appId: 'terminal' },
        { id: 'a4', label: 'Resume / CV', icon: 'about', appId: 'about' }
      ]
    };
  };

  const handleUpdateMissionHud = (field: keyof MissionHudConfig, value: any) => {
    if (!data) return;
    const currentHud = getHudConfig();
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          [field]: value
        }
      }
    });
  };

  const handleAddHudBadge = () => {
    if (!data) return;
    const currentHud = getHudConfig();
    const newBadge: MissionHudBadge = {
      id: `b_${Date.now()}`,
      label: 'New Verified Credential',
      type: 'certified'
    };
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          badges: [...currentHud.badges, newBadge]
        }
      }
    });
    triggerToast('Added new credential badge to Kali HUD.');
  };

  const handleRemoveHudBadge = (id: string) => {
    if (!data) return;
    const currentHud = getHudConfig();
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          badges: currentHud.badges.filter(b => b.id !== id)
        }
      }
    });
    triggerToast('Removed badge from Kali HUD.');
  };

  const handleUpdateHudBadge = (id: string, field: keyof MissionHudBadge, value: any) => {
    if (!data) return;
    const currentHud = getHudConfig();
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          badges: currentHud.badges.map(b => b.id === id ? { ...b, [field]: value } : b)
        }
      }
    });
  };

  const handleAddHudAction = () => {
    if (!data) return;
    const currentHud = getHudConfig();
    const newAction: MissionHudAction = {
      id: `a_${Date.now()}`,
      label: 'New Action',
      icon: '🚀',
      appId: 'projects'
    };
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          actions: [...currentHud.actions, newAction]
        }
      }
    });
    triggerToast('Added action button to Kali HUD.');
  };

  const handleRemoveHudAction = (id: string) => {
    if (!data) return;
    const currentHud = getHudConfig();
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          actions: currentHud.actions.filter(a => a.id !== id)
        }
      }
    });
    triggerToast('Removed action from Kali HUD.');
  };

  const handleUpdateHudAction = (id: string, field: keyof MissionHudAction, value: any) => {
    if (!data) return;
    const currentHud = getHudConfig();
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          actions: currentHud.actions.map(a => a.id === id ? { ...a, [field]: value } : a)
        }
      }
    });
  };

  const handleUpdateHudTelemetry = (field: keyof MissionHudTelemetry, value: string) => {
    if (!data) return;
    const currentHud = getHudConfig();
    const currentTelemetry = currentHud.telemetry || {
      status: 'OPERATIONAL 🟢',
      clearance: 'L3 SECOPS',
      tun0: '10.10.14.22',
      certs: 'eJPT · BTL1 · Security+'
    };
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          telemetry: {
            ...currentTelemetry,
            [field]: value
          }
        }
      }
    });
  };

  const handleUpdateHudTerminalOutput = (text: string) => {
    if (!data) return;
    const currentHud = getHudConfig();
    const lines = text.split('\n');
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          terminalOutput: lines
        }
      }
    });
  };

  const handleUpdateHudResearch = (field: keyof MissionHudResearch, value: any) => {
    if (!data) return;
    const currentHud = getHudConfig();
    const currentResearch = currentHud.research || {
      title: 'Adversarial ML & Kernel Sandboxing in Zero-Trust Runtimes',
      subtitle: "Master's Degree Research Project & Thesis",
      abstract: 'Investigating adversarial evasion against neural intrusion detection systems and developing hardware-isolated eBPF runtime sandboxing to prevent post-exploitation privilege escalation in Linux production environments.',
      metrics: [
        { label: 'Security Repositories', value: '16+' },
        { label: 'Audited Pentest Engagements', value: '2' },
        { label: 'Hands-on Lab Scenarios', value: '100%' },
        { label: 'Uptime / Stability', value: '99.98%' }
      ]
    };
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          research: {
            ...currentResearch,
            [field]: value
          }
        }
      }
    });
  };

  const handleUpdateHudResearchMetric = (index: number, field: 'label' | 'value', val: string) => {
    if (!data) return;
    const currentHud = getHudConfig();
    const currentResearch = currentHud.research || {
      title: 'Adversarial ML & Kernel Sandboxing in Zero-Trust Runtimes',
      subtitle: "Master's Degree Research Project & Thesis",
      abstract: 'Investigating adversarial evasion against neural intrusion detection systems and developing hardware-isolated eBPF runtime sandboxing to prevent post-exploitation privilege escalation in Linux production environments.',
      metrics: [
        { label: 'Security Repositories', value: '16+' },
        { label: 'Audited Pentest Engagements', value: '2' },
        { label: 'Hands-on Lab Scenarios', value: '100%' },
        { label: 'Uptime / Stability', value: '99.98%' }
      ]
    };
    const newMetrics = [...(currentResearch.metrics || [])];
    if (newMetrics[index]) {
      newMetrics[index] = { ...newMetrics[index], [field]: val };
    }
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          ...currentHud,
          research: {
            ...currentResearch,
            metrics: newMetrics
          }
        }
      }
    });
  };

  const handleResetMissionHud = () => {
    if (!data) return;
    setData({
      ...data,
      config: {
        ...data.config,
        missionHud: {
          title: 'ZAKARYA OUKIL',
          tagline: 'Master’s Degree Candidate in Cybersecurity · eJPT Certified · BTL1 SOC Analyst',
          promptLead: '┌──(zakarya㉿kali)-[~/portfolio]',
          promptCmd: '└─$ whoami --verbose',
          showDragon: true,
          telemetry: {
            status: 'OPERATIONAL 🟢',
            clearance: 'L3 SECOPS',
            tun0: '10.10.14.22',
            certs: 'eJPT · BTL1 · Security+'
          },
          terminalOutput: [
            'uid=1000(zakarya) gid=1000(kali) groups=1000(kali),27(sudo),1337(redteam,blueteam)',
            '[+] OPERATOR    : Zakarya Oukil (Security Researcher & Systems Architect)',
            '[+] ACADEMIC    : Master\'s Degree Candidate in Cybersecurity (Zero-Trust Specialization)',
            '[+] CREDENTIALS : eJPT Verified · BTL1 SOC Analyst · CompTIA Security+',
            '[+] CAPABILITIES: Adversarial ML · Threat Hunting · Kernel Sandboxing · Exploit Chaining',
            '[+] AVAILABILITY: Open to Red Team, Blue Team, & Systems Engineering Roles'
          ],
          stackGroups: [
            {
              domain: 'Offensive & Red Team',
              tools: ['Ghidra', 'Burp Suite Pro', 'Metasploit', 'Nmap', 'BloodHound', 'Impacket', 'SQLmap', 'Hashcat']
            },
            {
              domain: 'Defensive & Blue Team (BTL1)',
              tools: ['Wireshark', 'Suricata / Snort', 'Splunk SIEM', 'Elastic Security', 'Volatility 3', 'Autopsy', 'Zeek']
            },
            {
              domain: 'Systems & Engineering',
              tools: ['Python (Scapy, AsyncIO)', 'C / C++', 'Linux Kernel 6.x', 'Docker Container Enclaves', 'Kubernetes', 'Git']
            }
          ],
          research: {
            title: 'Adversarial ML & Kernel Sandboxing in Zero-Trust Runtimes',
            subtitle: "Master's Degree Research Project & Thesis",
            abstract: 'Investigating adversarial evasion against neural intrusion detection systems and developing hardware-isolated eBPF runtime sandboxing to prevent post-exploitation privilege escalation in Linux production environments.',
            metrics: [
              { label: 'Security Repositories', value: '16+' },
              { label: 'Audited Pentest Engagements', value: '2' },
              { label: 'Hands-on Lab Scenarios', value: '100%' },
              { label: 'Uptime / Stability', value: '99.98%' }
            ]
          },
          badges: [
            { id: 'b1', label: 'eJPT Certified', type: 'certified' },
            { id: 'b2', label: 'BTL1 SOC Analyst', type: 'in-progress' },
            { id: 'b3', label: 'CompTIA Security+', type: 'in-progress' },
            { id: 'b4', label: 'MSc Cybersecurity', type: 'degree' }
          ],
          actions: [
            { id: 'a1', label: '60-Second Recruiter Brief', icon: 'quickstart', appId: 'quickstart' },
            { id: 'a2', label: 'SOC Incident Simulator', icon: 'defense', appId: 'defense' },
            { id: 'a3', label: 'Kali Zsh Shell', icon: 'terminal', appId: 'terminal' },
            { id: 'a4', label: 'Resume / CV', icon: 'about', appId: 'about' }
          ]
        }
      }
    });
    triggerToast('Reset Mission HUD to default Kali Linux configurations.');
  };

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-login-stage">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-logo">z.</div>
            <h2>ZakOS Admin Authenticator</h2>
            <p>Enter your master security credentials to access the portfolio studio.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleLogin}>
            {loginError && (
              <div className="admin-login-error">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <div className="admin-field">
              <label>Username</label>
              <input
                type="text"
                className="admin-input"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-field">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  style={{ width: '100%', paddingRight: 40 }}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 0,
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loggingIn}
            >
              {loggingIn ? 'Authenticating…' : 'Unlock Admin Workstation ⇥'}
            </button>
          </form>

          <div className="admin-login-footer">
            <span>Portfolio OS security partition</span>
            <a href="/">← Return to Public System</a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-portal" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="admin-logo-monogram" style={{ margin: '0 auto 16px' }}>z.</div>
          <h2>Loading ZakOS Admin Studio…</h2>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-portal" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Failed to connect to ZakOS server.</p>
      </div>
    );
  }

  const currentTabProjects = data.projects.filter(p => p.country === selectedProjectTab);

  return (
    <div className="admin-portal">
      {/* Top Navigation */}
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo-monogram">z.</div>
          <div className="admin-title-group">
            <h1>
              ZakOS Admin Studio
              <span className="admin-badge">LIVE CMS</span>
            </h1>
          </div>
        </div>

        <div className="admin-header-actions">
          <a href="/" className="admin-site-link">
            <span>←</span> View Portfolio
          </a>
          <button
            className="admin-save-btn"
            onClick={handleSaveData}
            disabled={saving}
          >
            {saving ? 'Saving to Server…' : '💾 Save & Publish'}
          </button>
          <button
            className="admin-site-link"
            onClick={handleLogout}
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.25)', cursor: 'pointer' }}
            title="Log out and lock Admin Studio"
          >
            🔒 Lock
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-publish-status" role="status">{saveStatus || 'Edits autosave as a private browser draft. Save & Publish updates the portfolio.'}{storageWarning && <strong>{storageWarning}</strong>}</div>
      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <button
            className={`admin-nav-item ${activeSection === 'tabs' ? 'active' : ''}`}
            onClick={() => setActiveSection('tabs')}
          >
            <span>📑</span> Tabs & Disciplines
            <span className="admin-nav-badge">{data.tabs.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveSection('projects')}
          >
            <span>💻</span> Projects Manager
            <span className="admin-nav-badge">{data.projects.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'icons' ? 'active' : ''}`}
            onClick={() => setActiveSection('icons')}
          >
            <span>📱</span> App Icons (Per OS)
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveSection('appearance')}
          >
            <span>🎨</span> Themes & Profile
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'widgets' ? 'active' : ''}`}
            onClick={() => setActiveSection('widgets')}
          >
            <span>🎛️</span> Desktop Widgets
            <span className="admin-nav-badge" style={{ background: '#10b981', color: '#fff' }}>Live</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'missionHud' ? 'active' : ''}`}
            onClick={() => setActiveSection('missionHud')}
          >
            <span>🐉</span> Kali Workstation & HUD
            <span className="admin-nav-badge" style={{ background: '#0284c7', color: '#fff' }}>Kali</span>
          </button>

          <button className={`admin-nav-item ${activeSection === 'recruiterFastPass' ? 'active' : ''}`} onClick={() => setActiveSection('recruiterFastPass')}><span>⚡</span> Recruiter Fast-Pass</button>

          <button
            className={`admin-nav-item ${activeSection === 'pentestReports' ? 'active' : ''}`}
            onClick={() => setActiveSection('pentestReports')}
          >
            <span>🎯</span> Pentest Audits CMS
            <span className="admin-nav-badge" style={{ background: '#ef4444', color: '#fff' }}>Red</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'socRules' ? 'active' : ''}`}
            onClick={() => setActiveSection('socRules')}
          >
            <span>🛡️</span> SOC Threat Hunting
            <span className="admin-nav-badge" style={{ background: '#10b981', color: '#fff' }}>Blue</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'mastersResearch' ? 'active' : ''}`}
            onClick={() => setActiveSection('mastersResearch')}
          >
            <span>🎓</span> Master's Research Hub
            <span className="admin-nav-badge" style={{ background: '#8b5cf6', color: '#fff' }}>Thesis</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'netHunter' ? 'active' : ''}`}
            onClick={() => setActiveSection('netHunter')}
          >
            <span>📱</span> NetHunter Mobile Deck
            <span className="admin-nav-badge" style={{ background: '#06b6d4', color: '#fff' }}>Mobile</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveSection('inbox')}
          >
            <span>📬</span> Inquiries Inbox
            {messages.length > 0 && (
              <span className="admin-nav-badge" style={{ background: '#0284c7', color: '#fff' }}>
                {messages.length}
              </span>
            )}
          </button>
        </aside>

        {/* Content Area */}
        <main className="admin-main">
          {/* SECTION: TABS */}
          {activeSection === 'tabs' && (
            <div>
              <div className="admin-view-header">
                <div>
                  <h2>Tabs & Disciplines</h2>
                  <p>Configure navigation tabs, section titles, headers, slogans, and icons displayed across desktop & mobile.</p>
                </div>
                <button className="admin-primary-btn" onClick={handleAddTab}>
                  <span>+</span> Add New Tab
                </button>
              </div>

              {data.tabs.map((tab, idx) => (
                <div className="admin-card" key={tab.id || idx}>
                  <div className="admin-card-header">
                    <h3>
                      <span>#{idx + 1}</span> {tab.name}
                    </h3>
                    {data.tabs.length > 1 && (
                      <button
                        className="admin-danger-btn"
                        onClick={() => handleDeleteTab(idx)}
                      >
                        Delete Tab
                      </button>
                    )}
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label>Tab Label / Name</label>
                      <input
                        className="admin-input"
                        value={tab.name}
                        onChange={e => handleUpdateTab(idx, 'name', e.target.value)}
                        placeholder="e.g. Security & CTF"
                      />
                    </div>

                    <div className="admin-field">
                      <label>Icon Identifier</label>
                      <select
                        className="admin-select"
                        value={tab.icon}
                        onChange={e => handleUpdateTab(idx, 'icon', e.target.value)}
                      >
                        <option value="shield">Shield (Security)</option>
                        <option value="code">Code Brackets (Full Stack)</option>
                        <option value="chip">Microchip (Systems & OS)</option>
                        <option value="cloud">Cloud (Cloud & AI)</option>
                        <option value="terminal">Terminal</option>
                      </select>
                    </div>

                    <div className="admin-field full-width">
                      <label>Discipline Slogan (Overline Badge)</label>
                      <input
                        className="admin-input"
                        value={tab.slogan}
                        onChange={e => handleUpdateTab(idx, 'slogan', e.target.value)}
                        placeholder="e.g. ZERO-TRUST & REVERSE ENGINEERING"
                      />
                    </div>

                    <div className="admin-field">
                      <label>Section Title</label>
                      <input
                        className="admin-input"
                        value={tab.title}
                        onChange={e => handleUpdateTab(idx, 'title', e.target.value)}
                        placeholder="e.g. Security & CTF"
                      />
                    </div>

                    <div className="admin-field">
                      <label>Section Subtitle / Subheading</label>
                      <input
                        className="admin-input"
                        value={tab.subtitle}
                        onChange={e => handleUpdateTab(idx, 'subtitle', e.target.value)}
                        placeholder="Subheading description…"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <CommandCenterAdmin data={data} setData={setData} section={activeSection}/>
          {/* SECTION: PROJECTS */}
          {activeSection === 'projects' && (
            <div>
              <div className="admin-view-header">
                <div>
                  <h2>Project Portfolio Manager</h2>
                  <p>Inline edit project cards, descriptions, stack tags, metrics, and upload high-res imagery.</p>
                </div>
                <button
                  className="admin-primary-btn"
                  onClick={() => handleAddProject(selectedProjectTab || data.tabs[0]?.name)}
                >
                  <span>+</span> Add Project to {selectedProjectTab}
                </button>
              </div>

              {/* Tab Category Selector Bar */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {data.tabs.map(t => (
                  <button
                    key={t.name}
                    className={`admin-nav-item ${selectedProjectTab === t.name ? 'active' : ''}`}
                    style={{ width: 'auto', padding: '8px 16px' }}
                    onClick={() => setSelectedProjectTab(t.name)}
                  >
                    {t.name} ({data.projects.filter(p => p.country === t.name).length})
                  </button>
                ))}
              </div>

              {currentTabProjects.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: '#94a3b8' }}>No projects yet in "{selectedProjectTab}".</p>
                  <button
                    className="admin-primary-btn"
                    style={{ marginTop: 14 }}
                    onClick={() => handleAddProject(selectedProjectTab)}
                  >
                    Create First Project
                  </button>
                </div>
              ) : (
                currentTabProjects.map((proj, pIdx) => (
                  <div className="admin-project-item" key={proj.id}><ProjectExtras project={proj} update={patch => setData({ ...data, projects: data.projects.map(p => p.id === proj.id ? { ...p, ...patch } : p) })}/>
                    <div className="admin-project-header">
                      <div className="admin-project-title-preview"><button className="admin-secondary-btn" aria-label={`Move ${proj.title} up`} disabled={pIdx === 0} onClick={() => { const items = [...data.projects]; const a = items.findIndex(p => p.id === proj.id); const b = items.findIndex(p => p.id === currentTabProjects[pIdx - 1].id); [items[a], items[b]] = [items[b], items[a]]; setData({ ...data, projects: items }); }}>↑</button><button className="admin-secondary-btn" aria-label={`Move ${proj.title} down`} disabled={pIdx === currentTabProjects.length - 1} onClick={() => { const items = [...data.projects]; const a = items.findIndex(p => p.id === proj.id); const b = items.findIndex(p => p.id === currentTabProjects[pIdx + 1].id); [items[a], items[b]] = [items[b], items[a]]; setData({ ...data, projects: items }); }}>↓</button>
                        <span className="admin-project-num">#{pIdx + 1}</span>
                        <strong style={{ fontSize: 16 }}>{proj.title || 'Untitled Project'}</strong>
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>— {proj.subtitle}</span>
                      </div>
                      <button
                        className="admin-danger-btn"
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                      >
                        Delete Project
                      </button>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-field">
                        <label>Project Title</label>
                        <input
                          className="admin-input"
                          value={proj.title}
                          onChange={e => handleUpdateProject(proj.id, 'title', e.target.value)}
                        />
                      </div>

                      <div className="admin-field">
                        <label>Subtitle / Architecture Headline</label>
                        <input
                          className="admin-input"
                          value={proj.subtitle}
                          onChange={e => handleUpdateProject(proj.id, 'subtitle', e.target.value)}
                        />
                      </div>

                      <div className="admin-field">
                        <label>Category / Tab Assignment</label>
                        <select
                          className="admin-select"
                          value={proj.country}
                          onChange={e => handleUpdateProject(proj.id, 'country', e.target.value)}
                        >
                          {data.tabs.map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-field">
                        <label>Tools & Stack (Split by " / ")</label>
                        <input
                          className="admin-input"
                          value={proj.location}
                          onChange={e => handleUpdateProject(proj.id, 'location', e.target.value)}
                          placeholder="e.g. Python / Scikit-Learn / Docker"
                        />
                      </div>

                      <div className="admin-field full-width">
                        <label>Project Description</label>
                        <textarea
                          className="admin-textarea"
                          value={proj.description}
                          onChange={e => handleUpdateProject(proj.id, 'description', e.target.value)}
                          placeholder="Detailed engineering overview of the system…"
                        />
                      </div>

                      <div className="admin-field">
                        <label>Metric 1 / Accuracy / Duration Badge</label>
                        <input
                          className="admin-input"
                          value={proj.duration}
                          onChange={e => handleUpdateProject(proj.id, 'duration', e.target.value)}
                          placeholder="e.g. 99.4% ACC or 4 WEEKS"
                        />
                      </div>

                      <div className="admin-field">
                        <label>Metric 2 / Latency / Distance Badge</label>
                        <input
                          className="admin-input"
                          value={proj.distance}
                          onChange={e => handleUpdateProject(proj.id, 'distance', e.target.value)}
                          placeholder="e.g. 0.4ms LAT or CLOUD MESH"
                        />
                      </div>

                      <div className="admin-field full-width">
                        <label>Tags (Comma separated)</label>
                        <input
                          className="admin-input"
                          value={proj.tags.join(', ')}
                          onChange={e =>
                            handleUpdateProject(
                              proj.id,
                              'tags',
                              e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                            )
                          }
                          placeholder="Machine Learning, Anomaly Detection, Streamlit"
                        />
                      </div>

                      {/* Image Manager with Link & File Upload */}
                      <div className="admin-field full-width">
                        <label>Project Cover Image (Link or File Upload)</label>
                        <div className="admin-image-manager">
                          <div className="admin-image-thumb">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          </div>
                          <div className="admin-image-inputs">
                            <input
                              className="admin-input"
                              value={proj.image}
                              onChange={e => handleUpdateProject(proj.id, 'image', e.target.value)}
                              placeholder="Image URL (https://...)"
                            />
                            <div>
                              <label className="admin-file-upload-btn">
                                <span>📁</span>
                                {uploadingImage === proj.id ? 'Uploading…' : 'Upload Image File'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingImage === proj.id}
                                  onChange={e =>
                                    handleFileUpload(
                                      e,
                                      url => handleUpdateProject(proj.id, 'image', url),
                                      proj.id
                                    )
                                  }
                                />
                              </label>
                            </div>
                            <small style={{ color: '#64748b' }}>
                              Paste any direct image URL or upload a JPG/PNG/SVG directly from your device.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SECTION: APP ICONS (PER OS) */}
          {activeSection === 'icons' && (
            <div>
              <div className="admin-view-header">
                <div>
                  <h2>Operating System App Icons</h2>
                  <p>Customize icons independently for macOS 27, iPhone 16 Pro Max, and Android 15. Upload custom PNG/SVG graphics or reset to default authentic SVGs.</p>
                </div>
                <button
                  className="admin-primary-btn"
                  onClick={() => handleCopyIconsToAll(selectedIconOS)}
                >
                  <span>📋</span> Copy {selectedIconOS.toUpperCase()} to All OS
                </button>
              </div>

              {/* OS Selector Tabs */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 26, flexWrap: 'wrap' }}>
                {[
                  { id: 'macos', label: '🖥️ macOS 27 (Liquid Glass Desktop Squircle)' },
                  { id: 'ios', label: '📱 iPhone 16 Pro Max (iOS 18 Squircle)' },
                  { id: 'android', label: '🤖 Android 15 (Material You Adaptive Circle)' }
                ].map(osTab => (
                  <button
                    key={osTab.id}
                    className={`admin-nav-item ${selectedIconOS === osTab.id ? 'active' : ''}`}
                    style={{ width: 'auto', padding: '10px 20px', fontSize: 13 }}
                    onClick={() => setSelectedIconOS(osTab.id as any)}
                  >
                    {osTab.label}
                  </button>
                ))}
              </div>

              {/* App Cards Grid */}
              <div className="admin-icon-grid">
                {SYSTEM_APPS.map(app => {
                  const customUrl = data.config.appIcons?.[selectedIconOS]?.[app.id] || '';
                  const isCustom = customUrl.trim().length > 0;
                  const contextKey = `icon-${selectedIconOS}-${app.id}`;

                  return (
                    <div className="admin-icon-card" key={app.id}>
                      <div className="admin-icon-top">
                        <div className="admin-icon-title">
                          <h4>{app.name}</h4>
                          <span style={{ fontSize: 11, color: '#64748b' }}>({app.id})</span>
                        </div>
                        <span className={isCustom ? 'admin-icon-badge-custom' : 'admin-icon-badge-default'}>
                          {isCustom ? 'Custom Image Active' : 'Default Authentic SVG'}
                        </span>
                      </div>

                      {/* OS-Accurate Live Preview */}
                      <div className={`admin-icon-preview-stage preview-${selectedIconOS}`}>
                        <AppIcon
                          id={app.id}
                          modeOverride={selectedIconOS}
                          customUrl={customUrl}
                        />
                      </div>

                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                        {app.desc}
                      </p>

                      <div className="admin-field">
                        <label>Icon Image URL</label>
                        <input
                          className="admin-input"
                          value={customUrl}
                          onChange={e => handleUpdateAppIcon(selectedIconOS, app.id, e.target.value)}
                          placeholder="Image URL (https://... or /uploads/...)"
                        />
                      </div>

                      <div className="admin-icon-actions">
                        <label className="admin-file-upload-btn" style={{ margin: 0 }}>
                          <span>📁</span>
                          {uploadingImage === contextKey ? 'Uploading…' : 'Upload Icon File'}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage === contextKey}
                            onChange={e =>
                              handleFileUpload(
                                e,
                                url => handleUpdateAppIcon(selectedIconOS, app.id, url),
                                contextKey
                              )
                            }
                          />
                        </label>

                        {isCustom && (
                          <button
                            className="admin-danger-btn"
                            onClick={() => handleResetAppIcon(selectedIconOS, app.id)}
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: APPEARANCE & BIO */}
          {activeSection === 'appearance' && (
            <div>
              <div className="admin-view-header">
                <div>
                  <h2>Themes, Wallpapers & Profile</h2>
                  <p>Customize default visitor appearances, desktop wallpapers, GitHub activity, and developer bio metadata.</p>
                </div>
              </div>

              {/* GitHub Activity Integration */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🐙 GitHub Activity Integration</h3>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field full-width">
                    <label>Admin GitHub Username (Powers Desktop Heatmap)</label>
                    <input
                      className="admin-input"
                      value={data.config.githubUsername || ''}
                      onChange={e =>
                        setData({
                          ...data,
                          config: {
                            ...data.config,
                            githubUsername: e.target.value.trim()
                          }
                        })
                      }
                      placeholder="e.g. Zakarya-Oukil"
                    />
                    <small style={{ color: '#94a3b8', marginTop: 4 }}>
                      Public activity and commit telemetry from this profile automatically render in the macOS Desktop GitHub widget for all visitors.
                    </small>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🎨 System Appearance Defaults</h3>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Default OS Theme</label>
                    <select
                      className="admin-select"
                      value={data.config.defaultTheme}
                      onChange={e => handleUpdateAppearance('defaultTheme', e.target.value)}
                    >
                      <option value="dark">Dark Mode (Default)</option>
                      <option value="light">Light Mode</option>
                      <option value="oled">Obsidian OLED Mode</option>
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Default Wallpaper</label>
                    <select
                      className="admin-select"
                      value={data.config.defaultWallpaper}
                      onChange={e => handleUpdateAppearance('defaultWallpaper', e.target.value)}
                    >
                      <option value="sonoma">macOS Sonoma Horizon</option>
                      <option value="sequoia">macOS Sequoia Dusk</option>
                      <option value="neon">Cyberpunk Aurora</option>
                      <option value="oled">Minimal OLED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>👤 Developer Identity & Bio</h3>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Developer Full Name</label>
                    <input
                      className="admin-input"
                      value={data.config.bio.name}
                      onChange={e => handleUpdateConfig('name', e.target.value)}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Professional Title</label>
                    <input
                      className="admin-input"
                      value={data.config.bio.title}
                      onChange={e => handleUpdateConfig('title', e.target.value)}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Greeting Headline</label>
                    <input
                      className="admin-input"
                      value={data.config.bio.greeting}
                      onChange={e => handleUpdateConfig('greeting', e.target.value)}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Bio Slogan</label>
                    <input
                      className="admin-input"
                      value={data.config.bio.slogan}
                      onChange={e => handleUpdateConfig('slogan', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: DESKTOP WIDGETS */}
          {activeSection === 'widgets' && (
            <div>
              <div className="admin-view-header">
                <div>
                  <h2>Desktop Widgets Control Center</h2>
                  <p>Manage high-impact bento widgets pinned to the macOS desktop for recruiters, CTOs, and visitors.</p>
                </div>
              </div>

              {/* 1. VISIBILITY SWITCHBOARD */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🎚️ Widget Visibility Switchboard</h3>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Toggle widgets visible on the public desktop</span>
                </div>
                <div className="admin-widgets-grid">
                  {[
                    { key: 'about', title: 'Executive About Me & CV', desc: 'Face, title, availability badge, specialties & 1-click resume CTA' },
                    { key: 'certs', title: 'CTF & Certifications Bento', desc: 'HackTheBox rank, TryHackMe, eJPTv2, CVE hall of fame' },
                    { key: 'github', title: 'Live GitHub Heatmap', desc: 'Real-time public commit activity stream for @' + (data.config.githubUsername || 'Zakarya-Oukil') },
                    { key: 'neofetch', title: 'Hardened Neofetch / Specs', desc: 'Unix systems spec sheet, architecture, uptime, and AES-256 cipher' },
                    { key: 'clock', title: 'Digital & Analog Clock', desc: 'Real-time dual time dials with timezone indicators' },
                    { key: 'telemetry', title: 'System Telemetry Monitor', desc: 'Live browser memory telemetry and animated network meters' },
                    { key: 'notes', title: 'Sticky Notes to Self', desc: 'Local interactive notepad for visitors' },
                  ].map(w => {
                    const isVisible = data.config.widgets?.visibility?.[w.key as keyof WidgetVisibility] ?? false;
                    return (
                      <div className={`admin-widget-toggle-card ${isVisible ? 'active' : ''}`} key={w.key}>
                        <div className="admin-widget-toggle-info">
                          <strong>{w.title}</strong>
                          <p>{w.desc}</p>
                        </div>
                        <button
                          type="button"
                          className={`admin-toggle-switch ${isVisible ? 'on' : 'off'}`}
                          onClick={() => handleToggleWidget(w.key as keyof WidgetVisibility)}
                        >
                          <span className="switch-handle" />
                          <span className="switch-label">{isVisible ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. EXECUTIVE ABOUT ME WIDGET EDITOR */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>👤 Executive About Me Card</h3>
                  <span style={{ fontSize: 11, color: '#10b981' }}>Top conversion widget for recruiters</span>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field" style={{ gridColumn: 'span 2' }}>
                    <label>Profile Avatar</label>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div className="about-avatar-preview">
                        {data.config.widgets?.about?.avatar ? (
                          <img src={data.config.widgets.about.avatar} alt="Avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }} />
                        ) : (
                          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>ZO</div>
                        )}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Image URL (e.g. https://... or /avatar.jpg)"
                          value={data.config.widgets?.about?.avatar || ''}
                          onChange={e => handleUpdateAbout('avatar', e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <label className="admin-upload-btn" style={{ fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>
                            <span>📁 Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                  handleUpdateAbout('avatar', reader.result as string);
                                  triggerToast('Avatar image loaded successfully.');
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          {data.config.widgets?.about?.avatar && (
                            <button
                              type="button"
                              className="admin-danger-btn"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              onClick={() => handleUpdateAbout('avatar', '')}
                            >
                              Remove Avatar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Full Name</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.about?.name || ''}
                      onChange={e => handleUpdateAbout('name', e.target.value)}
                      placeholder="Zakarya Oukil"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Role / Professional Title</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.about?.role || ''}
                      onChange={e => handleUpdateAbout('role', e.target.value)}
                      placeholder="Security Researcher & Systems Architect"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Availability Badge Text</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.about?.statusText || ''}
                      onChange={e => handleUpdateAbout('statusText', e.target.value)}
                      placeholder="Available for Hire"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Availability Status Type</label>
                    <select
                      className="admin-select"
                      value={data.config.widgets?.about?.statusType || 'available'}
                      onChange={e => handleUpdateAbout('statusType', e.target.value as any)}
                    >
                      <option value="available">🟢 Available (Green Radar Glow)</option>
                      <option value="open">🔵 Open to Offers / Contracts (Cyan Glow)</option>
                      <option value="busy">🟡 In High Demand / Limited (Amber Glow)</option>
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Location / Mobility</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.about?.location || ''}
                      onChange={e => handleUpdateAbout('location', e.target.value)}
                      placeholder="Algiers / Remote (Open to Relocation)"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Resume / CV Link or Path</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.about?.resumeUrl || ''}
                      onChange={e => handleUpdateAbout('resumeUrl', e.target.value)}
                      placeholder="e.g. /resume.pdf or Google Drive / LinkedIn link"
                    />
                  </div>

                  <div className="admin-field" style={{ gridColumn: 'span 2' }}>
                    <label>Core Specialty Chips (Comma-separated)</label>
                    <input
                      className="admin-input"
                      value={(data.config.widgets?.about?.specialties || []).join(', ')}
                      onChange={e => handleUpdateAbout('specialties', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="Zero-Trust Architecture, Reverse Engineering, High-Concurrency, Kernel"
                    />
                  </div>

                  <div className="admin-field" style={{ gridColumn: 'span 2' }}>
                    <label>Short Elevator Bio</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={data.config.widgets?.about?.bio || ''}
                      onChange={e => handleUpdateAbout('bio', e.target.value)}
                      placeholder="Brief 2-line summary..."
                    />
                  </div>
                </div>
              </div>

              {/* 3. CERTIFICATIONS & CTF BENTO MANAGER */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3>🏆 CTF & Certifications Bento</h3>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Verifiable security credentials and competition ranks displayed on the desktop</p>
                  </div>
                  <button type="button" className="admin-primary-btn" onClick={handleAddCert} style={{ padding: '6px 12px', fontSize: 12 }}>
                    + Add Credential
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(data.config.widgets?.certs || []).map((cert, index) => (
                    <div key={cert.id || index} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: cert.accent || '#38bdf8' }} />
                          <strong style={{ fontSize: 13, color: '#f8fafc' }}>{cert.title || 'Untitled Credential'}</strong>
                          <span style={{ fontSize: 9.5, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.08)', color: cert.accent || '#38bdf8', border: `1px solid ${cert.accent || '#38bdf8'}` }}>
                            {cert.badge}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="admin-danger-btn"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => handleDeleteCert(cert.id)}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        <div className="admin-field">
                          <label>Title / Organization</label>
                          <input
                            className="admin-input"
                            value={cert.title}
                            onChange={e => handleUpdateCert(cert.id, 'title', e.target.value)}
                            placeholder="HackTheBox / TryHackMe / INE"
                          />
                        </div>

                        <div className="admin-field">
                          <label>Badge Tag / Level</label>
                          <input
                            className="admin-input"
                            value={cert.badge}
                            onChange={e => handleUpdateCert(cert.id, 'badge', e.target.value)}
                            placeholder="Pro Hacker / Top 1% / Certified"
                          />
                        </div>

                        <div className="admin-field">
                          <label>Issuer Authority</label>
                          <input
                            className="admin-input"
                            value={cert.issuer}
                            onChange={e => handleUpdateCert(cert.id, 'issuer', e.target.value)}
                            placeholder="HackTheBox Labs / INE"
                          />
                        </div>

                        <div className="admin-field">
                          <label>Date / Status</label>
                          <input
                            className="admin-input"
                            value={cert.date}
                            onChange={e => handleUpdateCert(cert.id, 'date', e.target.value)}
                            placeholder="2024 / Active"
                          />
                        </div>

                        <div className="admin-field">
                          <label>Accent Color</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input
                              type="color"
                              value={cert.accent || '#38bdf8'}
                              onChange={e => handleUpdateCert(cert.id, 'accent', e.target.value)}
                              style={{ width: 34, height: 34, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                            />
                            <input
                              className="admin-input"
                              value={cert.accent || '#38bdf8'}
                              onChange={e => handleUpdateCert(cert.id, 'accent', e.target.value)}
                              placeholder="#38bdf8"
                              style={{ flex: 1 }}
                            />
                          </div>
                        </div>

                        <div className="admin-field">
                          <label>Verification URL</label>
                          <input
                            className="admin-input"
                            value={cert.verifyUrl || ''}
                            onChange={e => handleUpdateCert(cert.id, 'verifyUrl', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. HARDENED NEOFETCH SPECS EDITOR */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🖥️ Hardened Neofetch / Systems Specs</h3>
                  <span style={{ fontSize: 11, color: '#38bdf8' }}>Terminal-inspired liquid glass bento card</span>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Operating System String</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.neofetch?.os || ''}
                      onChange={e => handleUpdateNeofetch('os', e.target.value)}
                      placeholder="ZakOS 27 (macOS Sequoia / Hardened Linux)"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Kernel / Protocol</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.neofetch?.kernel || ''}
                      onChange={e => handleUpdateNeofetch('kernel', e.target.value)}
                      placeholder="Linux 6.8.0-Hardened / POSIX"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Virtual Host Rig</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.neofetch?.host || ''}
                      onChange={e => handleUpdateNeofetch('host', e.target.value)}
                      placeholder="Apple M-Series / Virtual Systems Rig"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Shell Environment</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.neofetch?.shell || ''}
                      onChange={e => handleUpdateNeofetch('shell', e.target.value)}
                      placeholder="zsh 5.9 (x86_64-darwin22.0)"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Encryption Cipher Active</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.neofetch?.cipher || ''}
                      onChange={e => handleUpdateNeofetch('cipher', e.target.value)}
                      placeholder="AES-256-GCM / TLS 1.3 Active"
                    />
                  </div>

                  <div className="admin-field">
                    <label>System Uptime</label>
                    <input
                      className="admin-input"
                      value={data.config.widgets?.neofetch?.uptime || ''}
                      onChange={e => handleUpdateNeofetch('uptime', e.target.value)}
                      placeholder="99.98% High Availability"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: KALI WORKSTATION & MISSION HUD */}
          {activeSection === 'missionHud' && (
            <div>
              <div className="admin-view-header">
                <div>
                  <h2>🐉 Kali Workstation &amp; Mission Command HUD</h2>
                  <p>Full control over the center interactive whoami HUD: identity, live Zsh prompt, credentials badges, and quick-action launcher buttons.</p>
                </div>
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={handleResetMissionHud}
                  style={{ fontSize: 12 }}
                >
                  🔄 Reset to Kali Defaults
                </button>
              </div>

              {/* CARD 1: OPERATOR IDENTITY & DRAGON HOLOGRAM */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>
                    <KaliDragonIcon size={20} color="#38bdf8" /> Operator Identity &amp; Hologram
                  </h3>
                  <span style={{ fontSize: 11, color: '#38bdf8' }}>Center Mission HUD Hero Banner</span>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Operator Name / Call-sign</label>
                    <input
                      className="admin-input"
                      value={getHudConfig().title || ''}
                      onChange={e => handleUpdateMissionHud('title', e.target.value)}
                      placeholder="e.g. ZAKARYA OUKIL"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Holographic Kali Dragon Badge</label>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 12 }}>
                      <button
                        type="button"
                        className={`admin-toggle-switch ${getHudConfig().showDragon !== false ? 'on' : 'off'}`}
                        onClick={() => handleUpdateMissionHud('showDragon', getHudConfig().showDragon === false ? true : false)}
                      >
                        <span className="switch-handle" />
                        <span className="switch-label">{getHudConfig().showDragon !== false ? 'VISIBLE' : 'HIDDEN'}</span>
                      </button>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        Display Kali dragon cyber sigil next to operator name
                      </span>
                    </div>
                  </div>

                  <div className="admin-field full-width">
                    <label>Operator Subtitle / Mission Tagline</label>
                    <input
                      className="admin-input"
                      value={getHudConfig().tagline || ''}
                      onChange={e => handleUpdateMissionHud('tagline', e.target.value)}
                      placeholder="Master’s Degree Candidate in Cybersecurity · eJPT Certified · BTL1 SOC Analyst"
                    />
                  </div>
                </div>
              </div>

              {/* CARD: TACTICAL TELEMETRY STATUS RIBBON */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🛰️ Tactical Telemetry Ribbon</h3>
                  <span style={{ fontSize: 11, color: '#10b981' }}>Status bar on top of the Mission HUD</span>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>System Operational Status</label>
                    <input
                      className="admin-input"
                      value={getHudConfig().telemetry?.status || ''}
                      onChange={e => handleUpdateHudTelemetry('status', e.target.value)}
                      placeholder="OPERATIONAL 🟢"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Security Clearance Level</label>
                    <input
                      className="admin-input"
                      value={getHudConfig().telemetry?.clearance || ''}
                      onChange={e => handleUpdateHudTelemetry('clearance', e.target.value)}
                      placeholder="L3 SECOPS"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Active TUN0 VPN IP</label>
                    <input
                      className="admin-input"
                      style={{ fontFamily: 'monospace' }}
                      value={getHudConfig().telemetry?.tun0 || ''}
                      onChange={e => handleUpdateHudTelemetry('tun0', e.target.value)}
                      placeholder="10.10.14.22"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Certifications Ribbon Summary</label>
                    <input
                      className="admin-input"
                      value={getHudConfig().telemetry?.certs || ''}
                      onChange={e => handleUpdateHudTelemetry('certs', e.target.value)}
                      placeholder="eJPT · BTL1 · Security+"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: INTERACTIVE ZSH PROMPT LEAD & COMMAND */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>💻 Kali Zsh Terminal Header &amp; Verbose Output</h3>
                  <span style={{ fontSize: 11, color: '#10b981' }}>Live interactive terminal shell prompt &amp; whoami output</span>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Prompt Lead (Line 1)</label>
                    <input
                      className="admin-input"
                      style={{ fontFamily: 'monospace' }}
                      value={getHudConfig().promptLead || ''}
                      onChange={e => handleUpdateMissionHud('promptLead', e.target.value)}
                      placeholder="┌──(zakarya㉿kali)-[~/portfolio]"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Shell Command (Line 2)</label>
                    <input
                      className="admin-input"
                      style={{ fontFamily: 'monospace' }}
                      value={getHudConfig().promptCmd || ''}
                      onChange={e => handleUpdateMissionHud('promptCmd', e.target.value)}
                      placeholder="└─$ whoami --verbose"
                    />
                  </div>

                  <div className="admin-field full-width">
                    <label>Terminal Execution Output (1 line per entry)</label>
                    <textarea
                      className="admin-textarea"
                      rows={6}
                      style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 }}
                      value={(getHudConfig().terminalOutput || []).join('\n')}
                      onChange={e => handleUpdateHudTerminalOutput(e.target.value)}
                      placeholder="uid=1000(zakarya) gid=1000(kali)&#10;[+] OPERATOR: Zakarya Oukil"
                    />
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Lines displayed inside the live Zsh terminal execution container.</span>
                  </div>
                </div>
              </div>

              {/* CARD: MASTER'S RESEARCH & LABS SPOTLIGHT */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🔬 Master's Thesis &amp; Advanced Research (Tab 03)</h3>
                  <span style={{ fontSize: 11, color: '#a855f7' }}>Specialized academic &amp; lab spotlight</span>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field full-width">
                    <label>Research / Thesis Title</label>
                    <input
                      className="admin-input"
                      value={getHudConfig().research?.title || ''}
                      onChange={e => handleUpdateHudResearch('title', e.target.value)}
                      placeholder="Adversarial ML & Kernel Sandboxing in Zero-Trust Runtimes"
                    />
                  </div>

                  <div className="admin-field full-width">
                    <label>Research Subtitle / Track</label>
                    <input
                      className="admin-input"
                      value={getHudConfig().research?.subtitle || ''}
                      onChange={e => handleUpdateHudResearch('subtitle', e.target.value)}
                      placeholder="Master's Degree Research Project & Thesis"
                    />
                  </div>

                  <div className="admin-field full-width">
                    <label>Abstract / Research Focus</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={getHudConfig().research?.abstract || ''}
                      onChange={e => handleUpdateHudResearch('abstract', e.target.value)}
                      placeholder="Investigating adversarial evasion against neural intrusion detection systems..."
                    />
                  </div>

                  <div className="admin-field full-width">
                    <label>Key Research &amp; Lab Metrics</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                      {(getHudConfig().research?.metrics || []).map((m, idx) => (
                        <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <label style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>Metric {idx + 1} Label</label>
                          <input
                            className="admin-input"
                            style={{ marginBottom: 6, fontSize: 12 }}
                            value={m.label}
                            onChange={e => handleUpdateHudResearchMetric(idx, 'label', e.target.value)}
                          />
                          <label style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>Metric {idx + 1} Value</label>
                          <input
                            className="admin-input"
                            style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}
                            value={m.value}
                            onChange={e => handleUpdateHudResearchMetric(idx, 'value', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: CREDENTIAL & SPECIALIZATION BADGES */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🛡️ Credential &amp; Specialization Badges</h3>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={handleAddHudBadge}
                  >
                    <span>+</span> Add Badge
                  </button>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
                  Highlighted badges rendered inside the HUD with corresponding status glows (Green = Certified, Amber = In Progress, Cyan = Academic Degree).
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {getHudConfig().badges.map((b, idx) => (
                    <div
                      key={b.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 180px 40px',
                        gap: 12,
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <input
                        className="admin-input"
                        value={b.label}
                        onChange={e => handleUpdateHudBadge(b.id, 'label', e.target.value)}
                        placeholder="Badge label (e.g. eJPT Certified)"
                      />
                      <select
                        className="admin-select"
                        value={b.type}
                        onChange={e => handleUpdateHudBadge(b.id, 'type', e.target.value as any)}
                      >
                        <option value="certified">🟢 Certified (Emerald)</option>
                        <option value="in-progress">🟡 In Progress (Amber)</option>
                        <option value="degree">🔵 Academic (Cyan)</option>
                      </select>
                      <button
                        type="button"
                        className="admin-danger-btn"
                        style={{ padding: '6px 0', textAlign: 'center' }}
                        onClick={() => handleRemoveHudBadge(b.id)}
                        title="Delete Badge"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: QUICK ACTION LAUNCH BUTTONS */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>⚡ Quick Action Launcher Buttons</h3>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={handleAddHudAction}
                  >
                    <span>+</span> Add Action
                  </button>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
                  Rapid conversion launch buttons on the bottom of the HUD triggering applications or workflows directly.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {getHudConfig().actions.map((a, idx) => (
                    <div
                      key={a.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 180px 40px',
                        gap: 12,
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <input
                        className="admin-input"
                        style={{ textAlign: 'center' }}
                        value={a.icon}
                        onChange={e => handleUpdateHudAction(a.id, 'icon', e.target.value)}
                        placeholder="⚡"
                        title="Emoji or Icon Glyph"
                      />
                      <input
                        className="admin-input"
                        value={a.label}
                        onChange={e => handleUpdateHudAction(a.id, 'label', e.target.value)}
                        placeholder="Action Label (e.g. 60-Second Brief)"
                      />
                      <select
                        className="admin-select"
                        value={a.appId}
                        onChange={e => handleUpdateHudAction(a.id, 'appId', e.target.value)}
                      >
                        <option value="quickstart">⚡ Recruiter Brief (60s)</option>
                        <option value="defense">🛡️ SOC Incident Simulator</option>
                        <option value="terminal">💻 Kali Zsh Terminal</option>
                        <option value="about">📄 Dossier &amp; Resume (CV)</option>
                        <option value="projects">📂 Projects &amp; Pentests</option>
                        <option value="settings">⚙️ Settings &amp; OS Switch</option>
                        <option value="mail">✉️ Direct Inquiry Mail</option>
                      </select>
                      <button
                        type="button"
                        className="admin-danger-btn"
                        style={{ padding: '6px 0', textAlign: 'center' }}
                        onClick={() => handleRemoveHudAction(a.id)}
                        title="Delete Action"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTIONS: CYBER APPS (PENTEST AUDITS, SOC RULES, MASTERS RESEARCH, NETHUNTER) */}
          {(activeSection === 'pentestReports' ||
            activeSection === 'recruiterFastPass' ||
            activeSection === 'socRules' ||
            activeSection === 'mastersResearch' ||
            activeSection === 'netHunter') && (
            <CyberAppsAdmin
              data={data}
              setData={setData}
              section={activeSection}
              triggerToast={triggerToast}
            />
          )}

          {/* SECTION: INBOX */}
          {activeSection === 'inbox' && (
            <div>
              <div className="admin-view-header">
                <div>
                  <h2>Visitor Inquiries & Mailbox</h2>
                  <p>Real inquiries sent through the Portfolio Mail application, recorded in real time.</p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: '#94a3b8' }}>Your inbox is currently clear. No incoming inquiries.</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div className="admin-inbox-item" key={msg.id}>
                    <div className="admin-inbox-header">
                      <div className="admin-inbox-sender">
                        <strong>{msg.name}</strong>
                        <span>&lt;{msg.email}&gt;</span>
                      </div>
                      <div className="admin-inbox-date">
                        {new Date(msg.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="admin-inbox-subject">{msg.subject}</div>
                    <div className="admin-inbox-body">{msg.message}</div>

                    <div className="admin-inbox-actions">
                      <a
                        href={`mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent('Re: ' + msg.subject)}`}
                        className="admin-primary-btn"
                        style={{ textDecoration: 'none' }}
                      >
                        ✉️ Reply via Email
                      </a>
                      <button
                        className="admin-danger-btn"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        Delete Message
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Live Toast Notification */}
      {toast && (
        <div className="admin-toast">
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
