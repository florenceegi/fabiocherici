/**
 * @package fabiocherici.com — Animation Preset System
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Animation presets — localStorage only (static export). Ported from CREATOR-STAGING.
 */

export type AnimationId = 'minimal' | 'cinematic' | 'energetic' | 'editorial' | 'fluid' | 'none';

export const ANIMATION_NAMES: Record<AnimationId, string> = {
  minimal: 'Minimal',
  cinematic: 'Cinematic',
  energetic: 'Energetic',
  editorial: 'Editorial',
  fluid: 'Fluid',
  none: 'No Animation',
};

export const ANIMATION_DESCRIPTIONS: Record<AnimationId, string> = {
  minimal: 'Subtle fades, clean entrances',
  cinematic: 'Slow reveals, parallax, curtain effects',
  energetic: 'Bouncy, fast stagger, scale pops',
  editorial: 'Clip-path reveals, text masks, geometric',
  fluid: 'Smooth morphs, wave staggers, soft easing',
  none: 'Zero animations, instant display',
};

const VALID: Set<string> = new Set(Object.keys(ANIMATION_NAMES));
const STORAGE_KEY = 'fabio-animation';
const DEFAULT_ANIM: AnimationId = 'cinematic';

export function getStoredAnimation(): AnimationId {
  if (typeof window === 'undefined') return DEFAULT_ANIM;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && VALID.has(raw)) return raw as AnimationId;
  } catch { /* noop */ }
  return DEFAULT_ANIM;
}

export function persistAnimation(id: AnimationId): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEY, id); } catch { /* noop */ }
}
