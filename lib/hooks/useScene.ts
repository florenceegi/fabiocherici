/**
 * @package fabiocherici.com — useScene Hook
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Client-side 3D scene detection from localStorage. Adapted from CREATOR-STAGING for static export.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStoredScene, persistScene, type SceneId } from '@/lib/scene3d';

export type { SceneId } from '@/lib/scene3d';

export function useScene(): [SceneId, (id: SceneId) => void] {
  const [scene, setSceneState] = useState<SceneId>('aurora');

  useEffect(() => {
    setSceneState(getStoredScene());
  }, []);

  const setScene = useCallback((id: SceneId) => {
    setSceneState(id);
    persistScene(id);
  }, []);

  return [scene, setScene];
}
