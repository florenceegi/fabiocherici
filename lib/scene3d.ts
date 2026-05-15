/**
 * @package fabiocherici.com — 3D Scene System
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose 3D scene selection — localStorage only (static export, no cookies). 6 scenes selected from CREATOR-STAGING.
 */

export type SceneId = 'aurora' | 'morph-sphere' | 'crystal' | 'noise-terrain' | 'smoke' | 'ribbon-flow' | 'none';

export const SCENE_NAMES: Record<SceneId, string> = {
  aurora: 'Aurora',
  'morph-sphere': 'Morphing Sphere',
  crystal: 'Crystal',
  'noise-terrain': 'Noise Terrain',
  smoke: 'Smoke',
  'ribbon-flow': 'Ribbon Flow',
  none: 'No 3D',
};

const VALID: Set<string> = new Set(Object.keys(SCENE_NAMES));
const STORAGE_KEY = 'fabio-scene3d';
const DEFAULT_SCENE: SceneId = 'aurora';

export function getStoredScene(): SceneId {
  if (typeof window === 'undefined') return DEFAULT_SCENE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && VALID.has(raw)) return raw as SceneId;
  } catch { /* noop */ }
  return DEFAULT_SCENE;
}

export function persistScene(id: SceneId): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEY, id); } catch { /* noop */ }
}
