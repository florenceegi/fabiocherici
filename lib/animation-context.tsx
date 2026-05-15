/**
 * @package fabiocherici.com — Animation Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Shared animation preset state via React Context. PRESETS defined in animation.ts (single source of truth).
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
import {
  PRESETS,
  getStoredAnimation,
  persistAnimation,
  type AnimationId,
  type AnimationPreset,
} from '@/lib/animation';

interface AnimationContextValue {
  animId: AnimationId;
  preset: AnimationPreset;
  setAnimation: (id: AnimationId) => void;
}

const AnimationContext = createContext<AnimationContextValue>({
  animId: 'cinematic',
  preset: PRESETS.cinematic,
  setAnimation: () => {},
});

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [animId, setAnimState] = useState<AnimationId>('cinematic');

  useEffect(() => {
    setAnimState(getStoredAnimation());
  }, []);

  const setAnimation = useCallback((id: AnimationId) => {
    setAnimState(id);
    persistAnimation(id);
  }, []);

  const preset = useMemo(() => PRESETS[animId], [animId]);

  return (
    <AnimationContext.Provider value={{ animId, preset, setAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation(): AnimationPreset {
  return useContext(AnimationContext).preset;
}

export function useAnimationId(): [AnimationId, (id: AnimationId) => void] {
  const { animId, setAnimation } = useContext(AnimationContext);
  return [animId, setAnimation];
}
