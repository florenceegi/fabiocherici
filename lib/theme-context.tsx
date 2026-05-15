/**
 * @package fabiocherici.com — Theme Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Theme mode state + ambient slot auto-calc + localStorage persistence. Ported from CREATOR-STAGING, adapted for static export.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'dark' | 'light' | 'ambient';
export type AmbientSlot =
  | 'dawn'
  | 'morning'
  | 'day'
  | 'golden'
  | 'sunset'
  | 'evening'
  | 'night';

export interface ThemeContextValue {
  mode: ThemeMode;
  ambientSlot: AmbientSlot;
  resolvedTheme: string;
  setMode: (m: ThemeMode) => void;
  isAmbientActive: boolean;
}

const STORAGE_KEY = 'fabio-theme-mode';
const AMBIENT_RECALC_MS = 5 * 60 * 1000;
const DEFAULT_MODE: ThemeMode = 'dark';
const VALID_MODES: readonly ThemeMode[] = ['dark', 'light', 'ambient'];

export function getAmbientSlot(date: Date = new Date()): AmbientSlot {
  const h = date.getHours();
  if (h >= 5 && h < 7) return 'dawn';
  if (h >= 7 && h < 11) return 'morning';
  if (h >= 11 && h < 16) return 'day';
  if (h >= 16 && h < 18) return 'golden';
  if (h >= 18 && h < 20) return 'sunset';
  if (h >= 20 && h < 23) return 'evening';
  return 'night';
}

function computeResolvedTheme(mode: ThemeMode, slot: AmbientSlot): string {
  if (mode === 'ambient') return `ambient-${slot}`;
  if (mode === 'light') return 'light';
  return 'dark';
}

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && (VALID_MODES as readonly string[]).includes(raw)) {
      return raw as ThemeMode;
    }
  } catch { /* localStorage disabled */ }
  return DEFAULT_MODE;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: DEFAULT_MODE,
  ambientSlot: 'night',
  resolvedTheme: 'dark',
  setMode: () => {},
  isAmbientActive: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [ambientSlot, setAmbientSlot] = useState<AmbientSlot>(getAmbientSlot);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setModeState(readStoredMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setAmbientSlot(getAmbientSlot()), AMBIENT_RECALC_MS);
    return () => clearInterval(id);
  }, [mounted]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try { window.localStorage.setItem(STORAGE_KEY, m); } catch { /* noop */ }
  }, []);

  const resolvedTheme = useMemo(
    () => computeResolvedTheme(mode, ambientSlot),
    [mode, ambientSlot],
  );

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme, mounted]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, ambientSlot, resolvedTheme, setMode, isAmbientActive: mode === 'ambient' }),
    [mode, ambientSlot, resolvedTheme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
