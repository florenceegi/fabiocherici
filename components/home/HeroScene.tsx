/**
 * @package fabiocherici.com — HeroScene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-18
 * @purpose Wrapper for Scene3DSwitch that fills the homepage background. Client component boundary.
 */

'use client';

import { Scene3DSwitch } from '@/components/three/Scene3DSwitch';

export function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Scene3DSwitch />
    </div>
  );
}
