/**
 * @package fabiocherici.com — Scene Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Shared 3D scene state via React Context — replaces per-component useState so PreferencesPanel and Scene3DSwitch stay in sync.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getStoredScene, persistScene, type SceneId } from '@/lib/scene3d';

interface SceneContextValue {
  sceneId: SceneId;
  setScene: (id: SceneId) => void;
}

const SceneContext = createContext<SceneContextValue>({
  sceneId: 'aurora',
  setScene: () => {},
});

export function SceneProvider({ children }: { children: ReactNode }) {
  const [sceneId, setSceneState] = useState<SceneId>('aurora');

  useEffect(() => {
    setSceneState(getStoredScene());
  }, []);

  const setScene = useCallback((id: SceneId) => {
    setSceneState(id);
    persistScene(id);
  }, []);

  return (
    <SceneContext.Provider value={{ sceneId, setScene }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene(): [SceneId, (id: SceneId) => void] {
  const { sceneId, setScene } = useContext(SceneContext);
  return [sceneId, setScene];
}

export type { SceneId } from '@/lib/scene3d';
