/**
 * @package fabiocherici.com — Accessibility Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose A11y settings — font-size / contrast / reduced-motion / dyslexia-font with localStorage persistence. Ported from CREATOR-STAGING.
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

export type A11yFontSize = 'normal' | 'large' | 'xlarge';
export type A11yContrast = 'normal' | 'high';
export type A11yReducedMotion = 'system' | 'on' | 'off';
export type A11yDyslexiaFont = 'off' | 'on';

export interface A11ySettings {
  fontSize: A11yFontSize;
  contrast: A11yContrast;
  reducedMotion: A11yReducedMotion;
  dyslexiaFont: A11yDyslexiaFont;
}

export interface A11yContextValue extends A11ySettings {
  setFontSize: (v: A11yFontSize) => void;
  setContrast: (v: A11yContrast) => void;
  setReducedMotion: (v: A11yReducedMotion) => void;
  setDyslexiaFont: (v: A11yDyslexiaFont) => void;
  reset: () => void;
}

const STORAGE_KEYS = {
  fontSize: 'fabio-a11y-font-size',
  contrast: 'fabio-a11y-contrast',
  reducedMotion: 'fabio-a11y-reduced-motion',
  dyslexiaFont: 'fabio-a11y-dyslexia-font',
} as const;

const DEFAULTS: A11ySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  reducedMotion: 'system',
  dyslexiaFont: 'off',
};

const VALID = {
  fontSize: ['normal', 'large', 'xlarge'] as const,
  contrast: ['normal', 'high'] as const,
  reducedMotion: ['system', 'on', 'off'] as const,
  dyslexiaFont: ['off', 'on'] as const,
};

function readStored<K extends keyof A11ySettings>(key: K): A11ySettings[K] {
  if (typeof window === 'undefined') return DEFAULTS[key];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS[key]);
    const allowed = VALID[key] as readonly string[];
    if (raw && allowed.includes(raw)) return raw as A11ySettings[K];
  } catch { /* noop */ }
  return DEFAULTS[key];
}

function persist<K extends keyof A11ySettings>(key: K, value: A11ySettings[K]): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEYS[key], value); } catch { /* noop */ }
}

const CLASS_MAP: Record<string, string> = {
  'font-large': 'a11y-font-large',
  'font-xlarge': 'a11y-font-xlarge',
  'contrast-high': 'a11y-high-contrast',
  'dyslexia-on': 'a11y-dyslexia',
};

function applyClasses(settings: A11ySettings) {
  if (typeof document === 'undefined') return;
  const cl = document.documentElement.classList;
  Object.values(CLASS_MAP).forEach((c) => cl.remove(c));
  if (settings.fontSize === 'large') cl.add(CLASS_MAP['font-large']);
  if (settings.fontSize === 'xlarge') cl.add(CLASS_MAP['font-xlarge']);
  if (settings.contrast === 'high') cl.add(CLASS_MAP['contrast-high']);
  if (settings.dyslexiaFont === 'on') cl.add(CLASS_MAP['dyslexia-on']);
}

const A11yContext = createContext<A11yContextValue>({
  ...DEFAULTS,
  setFontSize: () => {},
  setContrast: () => {},
  setReducedMotion: () => {},
  setDyslexiaFont: () => {},
  reset: () => {},
});

export function A11yProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<A11yFontSize>(DEFAULTS.fontSize);
  const [contrast, setContrastState] = useState<A11yContrast>(DEFAULTS.contrast);
  const [reducedMotion, setReducedMotionState] = useState<A11yReducedMotion>(DEFAULTS.reducedMotion);
  const [dyslexiaFont, setDyslexiaFontState] = useState<A11yDyslexiaFont>(DEFAULTS.dyslexiaFont);

  useEffect(() => {
    setFontSizeState(readStored('fontSize'));
    setContrastState(readStored('contrast'));
    setReducedMotionState(readStored('reducedMotion'));
    setDyslexiaFontState(readStored('dyslexiaFont'));
  }, []);

  const settings = useMemo<A11ySettings>(
    () => ({ fontSize, contrast, reducedMotion, dyslexiaFont }),
    [fontSize, contrast, reducedMotion, dyslexiaFont],
  );

  useEffect(() => { applyClasses(settings); }, [settings]);

  const makeSetter = <K extends keyof A11ySettings>(key: K, setState: (v: A11ySettings[K]) => void) =>
    (v: A11ySettings[K]) => { setState(v); persist(key, v); };

  const setFontSize = useCallback(makeSetter('fontSize', setFontSizeState), []);
  const setContrast = useCallback(makeSetter('contrast', setContrastState), []);
  const setReducedMotion = useCallback(makeSetter('reducedMotion', setReducedMotionState), []);
  const setDyslexiaFont = useCallback(makeSetter('dyslexiaFont', setDyslexiaFontState), []);

  const reset = useCallback(() => {
    Object.entries(DEFAULTS).forEach(([k, v]) => {
      persist(k as keyof A11ySettings, v);
    });
    setFontSizeState(DEFAULTS.fontSize);
    setContrastState(DEFAULTS.contrast);
    setReducedMotionState(DEFAULTS.reducedMotion);
    setDyslexiaFontState(DEFAULTS.dyslexiaFont);
  }, []);

  const value = useMemo<A11yContextValue>(
    () => ({ ...settings, setFontSize, setContrast, setReducedMotion, setDyslexiaFont, reset }),
    [settings, setFontSize, setContrast, setReducedMotion, setDyslexiaFont, reset],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  return useContext(A11yContext);
}
