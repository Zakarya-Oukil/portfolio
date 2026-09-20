import fs from 'node:fs';
import { passwordHash } from '../server/portfolio-api.mjs';
const oldConfig = fs.readFileSync('vite.config.ts','utf8');
const username = oldConfig.match(/username === '([^']+)'/)?.[1];
const password = oldConfig.match(/password === '([^']+)'/)?.[1];
if (username && password && !fs.existsSync('server/auth.local.json')) fs.writeFileSync('server/auth.local.json', JSON.stringify({ username, passwordHash: passwordHash(password) }), { mode: 0o600 });
fs.writeFileSync('vite.config.ts', `import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createPortfolioApi } from './server/portfolio-api.mjs';
const apiPlugin = (): Plugin => ({ name: 'portfolio-api', configureServer(server) { server.middlewares.use(createPortfolioApi()); }, configurePreviewServer(server) { server.middlewares.use(createPortfolioApi()); } });
export default defineConfig({
  plugins: [react(), apiPlugin()],
  resolve: { alias: { 'react-native': 'react-native-web' }, extensions: ['.web.tsx','.web.ts','.web.jsx','.web.js','.tsx','.ts','.jsx','.js'] },
  define: { __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'), global: 'window' },
  server: { port: 3000, host: '127.0.0.1' }
});
`);
const packageData = JSON.parse(fs.readFileSync('package.json','utf8'));
packageData.scripts.start = 'node server/start.mjs';
packageData.scripts.test = 'node --test tests/*.test.cjs tests/*.test.mjs';
packageData.scripts['admin:setup'] = 'node scripts/setup-admin.mjs';
fs.writeFileSync('package.json', JSON.stringify(packageData, null, 2)+'\n');
let text = fs.readFileSync('src/admin/AdminDashboard.tsx','utf8');
text = text.replace("import './admin.css';", "import './admin.css';\nimport { cachePortfolio, cachedPortfolio, fetchPortfolio, DRAFT_KEY, validPortfolio } from '../os/portfolio-store';\nimport { CommandCenterAdmin, ProjectExtras } from './CommandCenterAdmin';");
text = text.replace('interface PortfolioConfig {', 'interface PortfolioConfig {\n  [key: string]: any;');
text = text.replace(/const \[isAuthenticated, setIsAuthenticated\] = useState<boolean>\(\(\) => \{[\s\S]*?\n  \}\);/, `const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [storageWarning, setStorageWarning] = useState('');
  useEffect(() => { fetch('/api/admin/session', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(result => setIsAuthenticated(result?.authenticated === true)).catch(() => {}); }, []);
  useEffect(() => { if (!data || !isAuthenticated) return; const timer = setTimeout(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); setStorageWarning(''); } catch { setStorageWarning('Browser storage is full or unavailable. Publish to the server to preserve these edits.'); } }, 250); return () => clearTimeout(timer); }, [data, isAuthenticated]);`);
const loadStart = text.indexOf('    Promise.all([');
const loadEnd = text.indexOf('\n  }, [isAuthenticated]);', loadStart);
text = text.slice(0,loadStart) + `    Promise.all([
      fetchPortfolio().catch(() => cachedPortfolio()),
      fetch('/api/messages').then(r => r.ok ? r.json() : []).catch(() => [])
    ]).then(([portfolioData, messagesData]) => {
      let draft; try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { /* No draft. */ }
      const next = validPortfolio(draft) ? draft : portfolioData;
      setData(next); setMessages(Array.isArray(messagesData) ? messagesData : []);
      setSelectedProjectTab(next.tabs[0]?.name || ''); setLoading(false);
      if (validPortfolio(draft)) setSaveStatus('Restored your browser draft. Publish when ready.');
    }).catch(() => { setData(cachedPortfolio()); setLoading(false); });` + text.slice(loadEnd);
const loginStart = text.indexOf('      const json = await res.json();');
const loginEnd = text.indexOf('    } finally {',loginStart);
text = text.slice(0,loginStart) + `      const json = await res.json();
      if (res.ok && json.success) { setPasswordInput(''); setIsAuthenticated(true); triggerToast('Welcome back. Your admin session is active.'); }
      else setLoginError(json.error || 'Invalid credentials.');
    } catch { setLoginError('The admin service is unavailable. Start the portfolio server to sign in.'); }
` + text.slice(loginEnd);
const logoutStart = text.indexOf('  const handleLogout = () => {');
const logoutEnd = text.indexOf('\n  const handleSaveData',logoutStart);
text = text.slice(0,logoutStart) + `  const handleLogout = async () => {
    try { const response = await fetch('/api/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); if (!response.ok) throw new Error(); setIsAuthenticated(false); setData(null); setUsernameInput(''); setPasswordInput(''); setLoginError(null); }
    catch { triggerToast('Could not end the server session. Reconnect and retry Lock.'); }
  };
` + text.slice(logoutEnd);
const saveStart = text.indexOf('  const handleSaveData = async () => {');
const saveEnd = text.indexOf('\n  const handleFileUpload',saveStart);
text = text.slice(0,saveStart) + `  const handleSaveData = async () => {
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
` + text.slice(saveEnd);
const uploadStart = text.indexOf('  const handleFileUpload = async');
const uploadEnd = text.indexOf('\n  const handleDeleteMessage',uploadStart);
text = text.slice(0,uploadStart) + `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void, contextId: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type) || file.size > 1500000) { triggerToast('Choose a PNG, JPEG, WebP, or GIF smaller than 1.5 MB.'); return; }
    setUploadingImage(contextId); const reader = new FileReader();
    reader.onload = () => { onComplete(reader.result as string); setUploadingImage(null); triggerToast('Image added to draft. Publish to share it.'); };
    reader.onerror = () => { setUploadingImage(null); triggerToast('Could not read image.'); };
    reader.readAsDataURL(file);
  };
` + text.slice(uploadEnd);
text = text.replace('{/* Main Container */}', `{/* Main Container */}
      <div className="admin-publish-status" role="status">{saveStatus || 'Edits autosave as a private browser draft. Save & Publish updates the portfolio.'}{storageWarning && <strong>{storageWarning}</strong>}</div>`);
text = text.replace('{/* SECTION: PROJECTS */}', '<CommandCenterAdmin data={data} setData={setData} section={activeSection}/>\n          {/* SECTION: PROJECTS */}');
text = text.replace('<div className="admin-project-title-preview">', '<div className="admin-project-title-preview"><button className="admin-secondary-btn" aria-label={`Move ${proj.title} up`} disabled={pIdx === 0} onClick={() => { const items = [...data.projects]; const a = items.findIndex(p => p.id === proj.id); const b = items.findIndex(p => p.id === currentTabProjects[pIdx - 1].id); [items[a], items[b]] = [items[b], items[a]]; setData({ ...data, projects: items }); }}>↑</button><button className="admin-secondary-btn" aria-label={`Move ${proj.title} down`} disabled={pIdx === currentTabProjects.length - 1} onClick={() => { const items = [...data.projects]; const a = items.findIndex(p => p.id === proj.id); const b = items.findIndex(p => p.id === currentTabProjects[pIdx + 1].id); [items[a], items[b]] = [items[b], items[a]]; setData({ ...data, projects: items }); }}>↓</button>');
text = text.replace('<div className="admin-project-item" key={proj.id}>', '<div className="admin-project-item" key={proj.id}><ProjectExtras project={proj} update={patch => setData({ ...data, projects: data.projects.map(p => p.id === proj.id ? { ...p, ...patch } : p) })}/>');
fs.writeFileSync('src/admin/AdminDashboard.tsx',text);
