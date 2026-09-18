export type OSMode = 'ios' | 'android' | 'desktop';

export type ThemeMode = 'dark' | 'light' | 'cyberpunk';

export type WallpaperId =
  | 'ios-abstract'
  | 'android-material'
  | 'macos-sonoma'
  | 'cyberpunk-neon';

export type AppId = 'projects' | 'terminal' | 'settings' | 'contact';

export type ProjectCategory =
  | 'Security & CTF'
  | 'Full Stack & Systems'
  | 'Mobile & Cloud'
  | 'AI & Labs';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectArchitecture {
  frontend?: string;
  backend?: string;
  security?: string;
  dataPipeline?: string;
  deployment?: string;
}

export interface Project {
  id: string;
  category: ProjectCategory;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  duration: string;
  complexity: string; // e.g. "ADVANCED", "CRITICAL", "L4 ENG"
  stars: number;
  views: number;
  likes: number;
  description: string;
  architectureNotes: string;
  architecture: ProjectArchitecture;
  techStack: string[];
  metrics: ProjectMetric[];
  githubUrl: string;
  liveUrl?: string;
}

export interface TerminalEntry {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
  timestamp: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0-100
  category: 'Security' | 'Languages' | 'Systems & Cloud' | 'Web & Frameworks';
  icon?: string;
}

export interface DeviceInfo {
  deviceType: 'ios' | 'android' | 'desktop';
  isRealMobile: boolean;
  userAgent: string;
  platform: string;
  screenDimensions: {
    width: number;
    height: number;
  };
}
