/**
 * @package fabiocherici.com — Preferences Panel
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Visitor preferences — theme, animation, 3D scene, a11y. The killer feature: no other personal site offers this.
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme, type ThemeMode } from '@/lib/theme-context';
import { useA11y, type A11yFontSize, type A11yContrast, type A11yReducedMotion, type A11yDyslexiaFont } from '@/lib/a11y-context';
import { useScene, type SceneId } from '@/lib/hooks/useScene';
import { SCENE_NAMES } from '@/lib/scene3d';
import { ANIMATION_NAMES, ANIMATION_DESCRIPTIONS, type AnimationId, getStoredAnimation, persistAnimation } from '@/lib/animation';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import { localeNames, locales, type Locale } from '@/lib/i18n/config';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  locale: string;
}

export function PreferencesPanel({ open, onClose, locale }: Props) {
  const t = useTranslations('preferences');
  const panelRef = useRef<HTMLDivElement>(null);
  const { mode, setMode, ambientSlot, isAmbientActive } = useTheme();
  const a11y = useA11y();
  const [sceneId, setScene] = useScene();
  const [animId, setAnimId] = useState<AnimationId>(() => getStoredAnimation());
  const pathname = usePathname();
  const router = useRouter();

  const handleAnimChange = useCallback((id: AnimationId) => {
    setAnimId(id);
    persistAnimation(id);
  }, []);

  const handleLocaleChange = useCallback((newLocale: string) => {
    router.replace(pathname, { locale: newLocale as Locale });
  }, [router, pathname]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const themes: { id: ThemeMode; label: string }[] = [
    { id: 'dark', label: t('theme_dark') },
    { id: 'light', label: t('theme_light') },
    { id: 'ambient', label: t('theme_ambient') },
  ];

  const sceneOptions = Object.entries(SCENE_NAMES) as [SceneId, string][];
  const animOptions = Object.entries(ANIMATION_NAMES) as [AnimationId, string][];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        tabIndex={-1}
        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm overflow-y-auto bg-[var(--bg-elevated)] border-l border-[var(--border)] shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
            {t('title')}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label={t('close')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Theme */}
          <Section title={t('theme')}>
            <div className="flex gap-2">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setMode(th.id)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm border transition-all ${
                    mode === th.id
                      ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
            {isAmbientActive && (
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                {t('current_slot')}: {ambientSlot}
              </p>
            )}
          </Section>

          {/* Language */}
          <Section title={t('language')}>
            <div className="grid grid-cols-2 gap-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                    locale === loc
                      ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
                  }`}
                >
                  {localeNames[loc]}
                </button>
              ))}
            </div>
          </Section>

          {/* Animation */}
          <Section title={t('animation')}>
            <div className="space-y-2">
              {animOptions.map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => handleAnimChange(id)}
                  className={`w-full text-left rounded-lg px-3 py-2 border transition-all ${
                    animId === id
                      ? 'border-[var(--accent)] bg-[var(--accent-muted)]'
                      : 'border-[var(--border)] hover:border-[var(--border-accent)]'
                  }`}
                >
                  <span className={`text-sm ${animId === id ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                    {name}
                  </span>
                  <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                    {ANIMATION_DESCRIPTIONS[id]}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {/* 3D Scene */}
          <Section title={t('scene3d')}>
            <div className="grid grid-cols-2 gap-2">
              {sceneOptions.map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => setScene(id)}
                  className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                    sceneId === id
                      ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </Section>

          {/* Accessibility */}
          <Section title={t('accessibility')}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">{t('font_size')}</label>
                <div className="flex gap-2">
                  {(['normal', 'large', 'xlarge'] as A11yFontSize[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => a11y.setFontSize(v)}
                      className={`flex-1 rounded-lg px-2 py-1.5 text-sm border transition-all ${
                        a11y.fontSize === v ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {v === 'normal' ? 'A' : v === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              <Toggle
                label={t('high_contrast')}
                checked={a11y.contrast === 'high'}
                onChange={(on) => a11y.setContrast(on ? 'high' : 'normal')}
              />
              <Toggle
                label={t('dyslexia_font')}
                checked={a11y.dyslexiaFont === 'on'}
                onChange={(on) => a11y.setDyslexiaFont(on ? 'on' : 'off')}
              />
              <Toggle
                label={t('reduced_motion')}
                checked={a11y.reducedMotion === 'on'}
                onChange={(on) => a11y.setReducedMotion(on ? 'on' : 'system')}
              />

              <button
                onClick={a11y.reset}
                className="w-full mt-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors underline underline-offset-2"
              >
                {t('reset_a11y')}
              </button>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)] mb-3">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--border-accent)]'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}
