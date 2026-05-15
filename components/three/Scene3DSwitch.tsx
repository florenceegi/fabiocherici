/**
 * @package fabiocherici.com — Scene3DSwitch
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Dynamic loader for active 3D scene — lazy loaded per scene type. 6 scenes from CREATOR-STAGING.
 */

'use client';

import dynamic from 'next/dynamic';
import { useScene, type SceneId } from '@/lib/hooks/useScene';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

function Placeholder() {
  return <div className="absolute inset-0 bg-[var(--bg)]" />;
}

const scenes: Record<Exclude<SceneId, 'none'>, ReturnType<typeof dynamic>> = {
  aurora: dynamic(() => import('@/components/three/scenes/Aurora'), { ssr: false, loading: () => <Placeholder /> }),
  'morph-sphere': dynamic(() => import('@/components/three/scenes/MorphSphere'), { ssr: false, loading: () => <Placeholder /> }),
  crystal: dynamic(() => import('@/components/three/scenes/Crystal'), { ssr: false, loading: () => <Placeholder /> }),
  'noise-terrain': dynamic(() => import('@/components/three/scenes/NoiseTerrain'), { ssr: false, loading: () => <Placeholder /> }),
  smoke: dynamic(() => import('@/components/three/scenes/Smoke'), { ssr: false, loading: () => <Placeholder /> }),
  'ribbon-flow': dynamic(() => import('@/components/three/scenes/RibbonFlow'), { ssr: false, loading: () => <Placeholder /> }),
};

export function Scene3DSwitch() {
  const [sceneId] = useScene();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || sceneId === 'none') {
    return <Placeholder />;
  }

  const SceneComponent = scenes[sceneId];
  if (!SceneComponent) return <Placeholder />;

  return <SceneComponent />;
}
