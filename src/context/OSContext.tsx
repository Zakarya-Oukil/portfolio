import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { AppId, OSMode, ThemeMode, WallpaperId } from '../types';
import { checkIsRealMobile, detectInitialOS } from '../utils/deviceDetection';

interface OSContextType {
  osMode: OSMode;
  setOSMode: (mode: OSMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  wallpaper: WallpaperId;
  setWallpaper: (wallpaper: WallpaperId) => void;
  activeApp: AppId | null;
  setActiveApp: (app: AppId | null) => void;
  openApp: (app: AppId) => void;
  closeApp: () => void;
  isRealMobile: boolean;
  currentTime: string;
  currentDateString: string;
  batteryLevel: number;
  isCharging: boolean;
  wifiConnected: boolean;
  cellularBars: number;
  windowState: {
    isMaximized: boolean;
    isMinimized: boolean;
  };
  toggleMaximize: () => void;
  toggleMinimize: () => void;
  activeProjectDetailId: string | null;
  setActiveProjectDetailId: (id: string | null) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initial OS detection from user-agent and viewport
  const [osMode, setOSModeState] = useState<OSMode>(() => detectInitialOS());
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [wallpaper, setWallpaper] = useState<WallpaperId>(() => {
    const initial = detectInitialOS();
    if (initial === 'android') return 'android-material';
    if (initial === 'desktop') return 'macos-sonoma';
    return 'ios-abstract';
  });
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [activeProjectDetailId, setActiveProjectDetailId] = useState<string | null>(null);
  const [isRealMobile, setIsRealMobile] = useState<boolean>(() => checkIsRealMobile());

  const [windowState, setWindowState] = useState({
    isMaximized: false,
    isMinimized: false,
  });

  // Dynamic time
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [currentDateString, setCurrentDateString] = useState<string>('Saturday, Sep 19');
  const [batteryLevel] = useState<number>(88);
  const [isCharging] = useState<boolean>(false);
  const [wifiConnected] = useState<boolean>(true);
  const [cellularBars] = useState<number>(4);

  // Synchronize OS Mode with custom wallpaper default if not modified
  const setOSMode = useCallback((mode: OSMode) => {
    setOSModeState(mode);
    if (mode === 'ios') {
      setWallpaper('ios-abstract');
    } else if (mode === 'android') {
      setWallpaper('android-material');
    } else {
      setWallpaper('macos-sonoma');
    }
  }, []);

  const openApp = useCallback((app: AppId) => {
    setActiveApp(app);
    setWindowState((prev) => ({ ...prev, isMinimized: false }));
  }, []);

  const closeApp = useCallback(() => {
    setActiveApp(null);
    setActiveProjectDetailId(null);
  }, []);

  const toggleMaximize = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isMaximized: !prev.isMaximized }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  // Update clock & listen to window resize
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };
      setCurrentDateString(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);

    const handleResize = () => {
      setIsRealMobile(checkIsRealMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <OSContext.Provider
      value={{
        osMode,
        setOSMode,
        theme,
        setTheme,
        wallpaper,
        setWallpaper,
        activeApp,
        setActiveApp,
        openApp,
        closeApp,
        isRealMobile,
        currentTime,
        currentDateString,
        batteryLevel,
        isCharging,
        wifiConnected,
        cellularBars,
        windowState,
        toggleMaximize,
        toggleMinimize,
        activeProjectDetailId,
        setActiveProjectDetailId,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export function useOS(): OSContextType {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
}
