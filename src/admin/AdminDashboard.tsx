import React, { useEffect, useState } from 'react';
import { AppIcon } from '../os/Icon';
import './admin.css';

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

interface PortfolioConfig {
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

type AdminSection = 'tabs' | 'projects' | 'icons' | 'appearance' | 'inbox';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('zakos_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
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
      fetch('/api/portfolio-data').then(r => r.json()),
      fetch('/api/messages').then(r => r.json()).catch(() => [])
    ]).then(([portfolioData, messagesData]) => {
      if (!portfolioData.config.appIcons) {
        portfolioData.config.appIcons = { macos: {}, ios: {}, android: {} };
      }
      setData(portfolioData);
      setMessages(messagesData);
      if (portfolioData.tabs && portfolioData.tabs.length > 0) {
        setSelectedProjectTab(portfolioData.tabs[0].name);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load admin data:', err);
      setLoading(false);
    });
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
      if (json.success || (usernameInput === 'Zakarya2003' && passwordInput === 'Oukil26072003@')) {
        try {
          sessionStorage.setItem('zakos_admin_auth', 'true');
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        triggerToast('✓ Welcome back, Zakarya. Admin workstation unlocked.');
      } else {
        setLoginError(json.error || 'Invalid credentials. Access denied.');
      }
    } catch {
      // Fallback client check
      if (usernameInput === 'Zakarya2003' && passwordInput === 'Oukil26072003@') {
        sessionStorage.setItem('zakos_admin_auth', 'true');
        setIsAuthenticated(true);
        triggerToast('✓ Welcome back, Zakarya.');
      } else {
        setLoginError('Invalid username or password. Access denied.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('zakos_admin_auth');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setLoginError(null);
  };

  const handleSaveData = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        triggerToast('✓ All changes saved and published to server!');
      } else {
        triggerToast('⚠️ Failed to save changes.');
      }
    } catch (e) {
      console.error(e);
      triggerToast('⚠️ Network error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void, contextId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(contextId);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64, data: base64 })
        });
        const json = await res.json();
        if (json.url) {
          onComplete(json.url);
          triggerToast('✓ Image uploaded successfully!');
        } else {
          triggerToast('⚠️ Image upload failed.');
        }
      } catch (err) {
        console.error(err);
        triggerToast('⚠️ Error uploading image.');
      } finally {
        setUploadingImage(null);
      }
    };
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
                  <div className="admin-project-item" key={proj.id}>
                    <div className="admin-project-header">
                      <div className="admin-project-title-preview">
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
