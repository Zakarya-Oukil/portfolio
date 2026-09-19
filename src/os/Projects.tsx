import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, Pressable } from 'react-native';
import { Icon } from './Icon';
import { PortfolioProject, useSaved, useSystemContext } from './state';

type Project = PortfolioProject;
const categoryIcons = ['shield', 'code', 'chip', 'cloud', 'terminal'];
const categoryColors = ['#3c8b87', '#5879ac', '#856bb7', '#4b8c5d', '#d97706', '#0284c7'];
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function ProjectImage({ project, className = '' }: { project: Project; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [project.image]);
  const hash = Math.abs(project.country.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const bgGrad = categoryColors[hash % categoryColors.length];
  const icon = categoryIcons[hash % categoryIcons.length];

  return (
    <div
      className={`project-image ${className}`}
      style={{ background: `radial-gradient(at 70% 20%, ${bgGrad}, #111c23)` }}
    >
      {!failed && <img src={project.image} alt={project.title || ''} loading="lazy" draggable={false} onError={() => setFailed(true)} />}
      <div className="image-shade" />
      {failed && <Icon name={icon} size={64} />}
    </div>
  );
}

function MobileCarousel({ projects, open, saved, toggleSave }: { projects: Project[]; open: (p: Project) => void; saved: string[]; toggleSave: (id: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 380, height: 490 });
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<any>(null);
  const currentScrollOffset = useRef(0), dragStartOffset = useRef(0), dragStartTimestamp = useRef(0), dragDistance = useRef(0), didDragRef = useRef(false);
  const unlock = useRef<ReturnType<typeof setTimeout>>();
  const pointerStart = useRef({ x: 0, y: 0, down: false });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); clearTimeout(unlock.current); };
  }, []);

  const cardWidth = clamp(size.width * .77, 230, 336), spacing = 16, cardHeight = Math.max(260, size.height - 28);
  const snapInterval = cardWidth + spacing, maxScrollOffset = Math.max(0, (projects.length - 1) * snapInterval), sideInset = (size.width - cardWidth) / 2;

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    currentScrollOffset.current = 0;
    scrollX.setValue(0);
  }, [projects, scrollX]);

  const releaseLock = () => {
    clearTimeout(unlock.current);
    unlock.current = setTimeout(() => { didDragRef.current = false; }, 150);
  };

  const desktopDragHandlers = useMemo(() => {
    if (Platform.OS !== 'web') return {};
    const shouldStartDragging = (_: any, g: any) => Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy);
    const finishDragging = (_: any, g: any) => {
      dragDistance.current = Math.max(dragDistance.current, Math.abs(g.dx));
      if (dragDistance.current > 6 || (Date.now() - dragStartTimestamp.current < 180 && Math.abs(g.vx) > .15)) didDragRef.current = true;
      const projected = clamp(dragStartOffset.current - g.dx - g.vx * 150, 0, maxScrollOffset);
      listRef.current?.scrollToOffset({ offset: clamp(Math.round(projected / snapInterval) * snapInterval, 0, maxScrollOffset), animated: true });
      releaseLock();
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: shouldStartDragging,
      onMoveShouldSetPanResponderCapture: shouldStartDragging,
      onPanResponderGrant: () => { dragStartOffset.current = currentScrollOffset.current; clearTimeout(unlock.current); didDragRef.current = true; },
      onPanResponderMove: (_: any, g: any) => {
        dragDistance.current = Math.max(dragDistance.current, Math.abs(g.dx));
        if (dragDistance.current > 6) didDragRef.current = true;
        listRef.current?.scrollToOffset({ offset: clamp(dragStartOffset.current - g.dx, 0, maxScrollOffset), animated: false });
      },
      onPanResponderRelease: finishDragging,
      onPanResponderTerminate: finishDragging,
      onPanResponderTerminationRequest: () => false
    }).panHandlers;
  }, [maxScrollOffset, snapInterval]);

  return (
    <div
      className="mobile-carousel"
      ref={host}
      onPointerDownCapture={e => {
        pointerStart.current = { x: e.clientX, y: e.clientY, down: true };
        dragStartTimestamp.current = Date.now();
        dragDistance.current = 0;
      }}
      onPointerMoveCapture={e => {
        if (!pointerStart.current.down) return;
        dragDistance.current = Math.max(dragDistance.current, Math.abs(e.clientX - pointerStart.current.x));
        if (dragDistance.current > 6) {
          clearTimeout(unlock.current);
          didDragRef.current = true;
        }
      }}
      onPointerUpCapture={() => { pointerStart.current.down = false; releaseLock(); }}
      onPointerCancel={() => { pointerStart.current.down = false; releaseLock(); }}
    >
      <Animated.FlatList
        ref={listRef}
        {...desktopDragHandlers}
        horizontal
        data={projects}
        keyExtractor={(p: Project) => p.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingLeft: sideInset, paddingRight: sideInset - spacing, alignItems: 'center' }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
          listener: (e: any) => { currentScrollOffset.current = e.nativeEvent.contentOffset.x; }
        })}
        renderItem={({ item, index }: { item: Project; index: number }) => {
          const inputRange = [(index - 1) * snapInterval, index * snapInterval, (index + 1) * snapInterval];
          const scale = scrollX.interpolate({ inputRange, outputRange: [0.88, 1, 0.88], extrapolate: 'clamp' });
          const translateY = scrollX.interpolate({ inputRange, outputRange: [18, 0, 18], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.72, 1, 0.72], extrapolate: 'clamp' });
          const shadowOpacity = scrollX.interpolate({ inputRange, outputRange: [0.08, 0.25, 0.08], extrapolate: 'clamp' });

          return (
            <Animated.View style={{ width: cardWidth, height: cardHeight, marginRight: spacing, opacity, transform: [{ scale }, { translateY }], shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, shadowOpacity }}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.title}`} onPress={() => { if (didDragRef.current) return; open(item); }} style={{ flex: 1, borderRadius: 27, overflow: 'hidden', backgroundColor: '#152c28' }}>
                <ProjectImage project={item}/>
                <div className="carousel-card-content">
                  <span className="overline">{item.country}</span>
                  <h2>{item.title}</h2>
                  <p>{item.location}</p>
                  <div className="carousel-metrics">
                    <span>{item.duration}</span>
                    <span>{item.distance}</span>
                  </div>
                  <span className="round-arrow"><Icon name="arrow"/></span>
                </div>
              </Pressable>
              <button className={`save-card ${saved.includes(item.id) ? 'selected' : ''}`} aria-label={`Save ${item.title}`} onClick={() => { if (didDragRef.current) return; toggleSave(item.id); }}>
                <Icon name="bookmark" size={17}/>
              </button>
            </Animated.View>
          );
        }}
      />
    </div>
  );
}

export function Projects() {
  const { mode, active, projects, tabs } = useSystemContext();
  const [category, setCategory] = useState('All projects');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const [outgoing, setOutgoing] = useState<Project | null>(null);
  const [saved, setSaved] = useSaved<string[]>('zak.saved', []);
  const [architecture, setArchitecture] = useState(false);
  const currentSelection = useRef(selected);
  currentSelection.current = selected;

  const categories = useMemo(() => tabs.map(t => t.name), [tabs]);
  const [mobileFilter, setMobileFilter] = useState(categories[0] || 'Security & CTF');

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(mobileFilter)) {
      setMobileFilter(categories[0]);
    }
  }, [categories, mobileFilter]);

  const detailTimer = useRef<ReturnType<typeof setTimeout>>();
  const switching = useRef(false);
  const relatedDrag = useRef({ x: 0, start: 0, time: 0, distance: 0, down: false, didDrag: false });
  const relatedTimer = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(true);
  const mobile = mode !== 'macos';

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchCat = mobile
        ? p.country === mobileFilter
        : category === 'All projects' || (category === 'Saved projects' ? saved.includes(p.id) : p.country === category);
      const matchQuery = `${p.title} ${p.location} ${p.subtitle || ''}`.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [category, query, saved, mobile, mobileFilter, projects]);

  useEffect(() => {
    const back = (e: Event) => {
      if (active !== 'projects') return;
      if (architecture) { e.preventDefault(); setArchitecture(false); }
      else if (selected) { e.preventDefault(); setSelected(null); }
    };
    const home = () => { setSelected(null); setArchitecture(false); };
    const openProject = (e: Event) => {
      const project = projects.find(p => p.id === (e as CustomEvent).detail);
      if (project) { setSelected(project); setArchitecture(false); }
    };
    window.addEventListener('zak:back', back);
    window.addEventListener('zak:home', home);
    window.addEventListener('zak:project', openProject);
    return () => {
      window.removeEventListener('zak:back', back);
      window.removeEventListener('zak:home', home);
      window.removeEventListener('zak:project', openProject);
    };
  }, [selected, architecture, active, projects]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(detailTimer.current);
      clearTimeout(relatedTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    projects.filter(p => p.country === selected.country).forEach(p => {
      const image = new window.Image();
      image.src = p.image;
    });
  }, [selected?.country, projects]);

  const toggleSave = (id: string) => setSaved(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);

  const switchProject = async (p: Project) => {
    if (relatedDrag.current.didDrag || switching.current || p.id === selected?.id) return;
    switching.current = true;
    const previousId = selected?.id;
    await new Promise<void>(resolve => {
      const image = new window.Image();
      const timer = setTimeout(resolve, 2500);
      image.onload = image.onerror = () => { clearTimeout(timer); resolve(); };
      image.src = p.image;
    });
    if (!mounted.current || currentSelection.current?.id !== previousId) {
      switching.current = false;
      return;
    }
    setOutgoing(selected);
    setSelected(p);
    setArchitecture(false);
    detailTimer.current = setTimeout(() => {
      setOutgoing(null);
      switching.current = false;
    }, 500);
  };

  const activeTabMeta = tabs.find(t => t.name === (mobile ? mobileFilter : category));

  if (selected) {
    return (
      <div className="project-detail">
        <div className="detail-hero">
          <ProjectImage key={selected.id} project={selected} className="incoming"/>
          {outgoing && <ProjectImage project={outgoing} className="outgoing"/>}
          <button className="detail-back glass-button" onClick={() => { setSelected(null); setArchitecture(false); }}>
            <span>←</span> All projects
          </button>
          <button className="detail-save glass-button" aria-label="Save project" onClick={() => toggleSave(selected.id)}>
            <Icon name={saved.includes(selected.id) ? 'check' : 'bookmark'}/>
          </button>
          <div className="detail-copy" key={`copy-${selected.id}`}>
            <span className="overline">{selected.country}</span>
            <h1>{selected.title}</h1>
            <p>{selected.subtitle}</p>
          </div>
        </div>
        <div className="detail-body">
          <div className="detail-chips">
            <span>{selected.duration}</span>
            <span>{selected.distance}</span>
          </div>
          <span className="metric-note">Project-reported telemetry · ZakOS verified</span>
          <h3>Built to solve real problems.</h3>
          <p>{selected.description}</p>
          <h4>THE STACK</h4>
          <div className="tech-list">
            {selected.location.split(' / ').map(t => <span key={t}>{t}</span>)}
          </div>
          <button className="primary-button" onClick={() => setArchitecture(!architecture)}>
            {architecture ? 'Hide technical overview' : 'Explore technical overview'} <Icon name="arrow" size={17}/>
          </button>
          {architecture && (
            <div className="architecture">
              <h3>{selected.subtitle}</h3>
              <p>{selected.description}</p>
              <div className="architecture-flow">
                {selected.location.split(' / ').map((t, i) => <span key={t}>{i > 0 && '→ '}{t}</span>)}
              </div>
              <p className="muted">Detailed technical architecture and stack overview.</p>
            </div>
          )}
          <h4>MORE IN {selected.country.toUpperCase()}</h4>
          <div
            className="related-projects"
            onPointerDown={e => {
              relatedDrag.current = { x: e.clientX, start: e.currentTarget.scrollLeft, time: Date.now(), distance: 0, down: true, didDrag: false };
              clearTimeout(relatedTimer.current);
            }}
            onPointerMove={e => {
              const g = relatedDrag.current;
              if (!g.down) return;
              g.distance = Math.max(g.distance, Math.abs(e.clientX - g.x));
              if (g.distance > 6) {
                g.didDrag = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                e.currentTarget.scrollLeft = g.start - (e.clientX - g.x);
              }
            }}
            onPointerUp={() => {
              relatedDrag.current.down = false;
              relatedTimer.current = setTimeout(() => { relatedDrag.current.didDrag = false; }, 150);
            }}
            onPointerCancel={() => {
              relatedDrag.current.down = false;
              relatedTimer.current = setTimeout(() => { relatedDrag.current.didDrag = false; }, 150);
            }}
          >
            {projects.filter(p => p.country === selected.country).map(p => (
              <button
                className={p.id === selected.id ? 'current' : ''}
                key={p.id}
                onClick={() => {
                  if (relatedDrag.current.didDrag) return;
                  switchProject(p);
                }}
              >
                <ProjectImage project={p}/>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`projects-app ${mobile ? 'projects-mobile' : ''}`}>
      {!mobile && (
        <aside className="project-sidebar">
          <div className="sidebar-profile">
            <span className="profile-monogram">z.</span>
            <div><strong>Zakarya</strong><small>Security & Systems Architect</small></div>
          </div>
          <div className="sidebar-label">WORKSPACE</div>
          <button className={category === 'All projects' ? 'active' : ''} onClick={() => setCategory('All projects')}>
            <Icon name="grid" size={17}/>All projects<span>{projects.length}</span>
          </button>
          <button className={category === 'Saved projects' ? 'active' : ''} onClick={() => setCategory('Saved projects')}>
            <Icon name="bookmark" size={17}/>Saved projects<span>{saved.length}</span>
          </button>
          <div className="sidebar-label">DISCIPLINES</div>
          {tabs.map((tab, i) => (
            <button key={tab.name} className={category === tab.name ? 'active' : ''} onClick={() => setCategory(tab.name)}>
              <Icon name={tab.icon || categoryIcons[i % categoryIcons.length]} size={17}/>
              {tab.name}
              <span>{projects.filter(p => p.country === tab.name).length}</span>
            </button>
          ))}
          <div className="sidebar-bottom">
            <i className="status-dot"/>
            <span>Open to opportunities<small>Let's build something great.</small></span>
          </div>
        </aside>
      )}

      <main className="projects-main">
        <div className="explorer-toolbar">
          <span>
            <Icon name="projects" size={15}/> Portfolio <span className="muted">/</span>{' '}
            <span className="muted">{mobile ? 'Discover' : category}</span>
          </span>
          <label className="project-search">
            <Icon name="search" size={15}/>
            <input aria-label="Search projects" placeholder="Search projects" value={query} onChange={e => setQuery(e.target.value)}/>
            <kbd>⌘ K</kbd>
          </label>
        </div>

        <header className="project-intro">
          <div className="overline">
            {activeTabMeta?.slogan || 'A LITTLE CURIOSITY. A LOT OF BUILDING.'}
          </div>
          <h1>
            {mobile
              ? 'Discover my work.'
              : category === 'All projects'
              ? 'Ideas, engineered.'
              : activeTabMeta?.title || category}
          </h1>
          <p>
            {activeTabMeta?.subtitle || "From the kernel to the cloud. A collection of things I've built, broken, and made better."}
          </p>
          <div className="intro-meta">
            <span><i className="status-dot"/>{projects.length} projects</span>
            <span>{tabs.length} disciplines</span>
            <span>Always exploring <span className="tiny-spark">✧</span></span>
          </div>
        </header>

        {mobile ? (
          <>
            <div className="mobile-filters">
              {categories.map(c => (
                <button
                  key={c}
                  className={mobileFilter === c ? 'active' : ''}
                  onClick={() => setMobileFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {filtered.length ? (
              <MobileCarousel
                projects={filtered}
                open={setSelected}
                saved={saved}
                toggleSave={toggleSave}
              />
            ) : (
              <div className="empty-state">No projects match your search.</div>
            )}
            <div className="carousel-hint">← &nbsp; Drag to discover &nbsp; →</div>
          </>
        ) : (
          <div className="project-scroll">
            <div className="section-heading">
              <h3>
                {category === 'All projects' ? 'Selected work' : category}
                <span>{filtered.length.toString().padStart(2, '0')}</span>
              </h3>
              <span><Icon name="grid" size={15}/> Gallery view</span>
            </div>
            <div className="project-grid">
              {filtered.map((p, index) => (
                <article className="project-tile" key={p.id}>
                  <button className="tile-open" aria-label={`Open ${p.title}`} onClick={() => setSelected(p)}>
                    <div className="tile-picture">
                      <ProjectImage project={p}/>
                      <span className="tile-category">
                        <Icon name={tabs.find(t => t.name === p.country)?.icon || 'code'} size={12}/>
                        {p.country}
                      </span>
                      <span className="tile-arrow"><Icon name="arrow" size={16}/></span>
                      {index === 0 && category === 'All projects' && <span className="featured-tag">FEATURED</span>}
                    </div>
                    <div className="tile-copy">
                      <h3>{p.title}</h3>
                      <p>{p.location}</p>
                      <div className="tile-metrics">
                        <span>{p.duration}</span>
                        <span>{p.distance}</span>
                      </div>
                    </div>
                  </button>
                  <button
                    className={`tile-bookmark ${saved.includes(p.id) ? 'selected' : ''}`}
                    aria-label={`Save ${p.title}`}
                    onClick={() => toggleSave(p.id)}
                  >
                    <Icon name="bookmark" size={15}/>
                  </button>
                </article>
              ))}
            </div>
            {!filtered.length && (
              <div className="empty-state">
                {category === 'Saved projects'
                  ? 'Your next inspiration goes here. Save a project to keep it close.'
                  : 'No projects match your search.'}
              </div>
            )}
            <footer className="explorer-footer">
              Thoughtfully built. Endlessly curious.
              <span>Zakarya © {new Date().getFullYear()}</span>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
