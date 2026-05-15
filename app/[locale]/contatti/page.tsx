/**
 * @package fabiocherici.com — Contact Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Contact form — react-hook-form + zod. Static site = mailto fallback (no API routes with output:export).
 */

'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContattiPage() {
  const t = useTranslations('contatti');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const subject = encodeURIComponent(`Contatto da ${data.name}`);
    const body = encodeURIComponent(`Nome: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
    window.location.href = `mailto:fabiocherici@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-12">
            {t('title')}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm text-[var(--text-muted)] mb-1.5">
                {t('name')}
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: true })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-[var(--text-muted)] mb-1.5">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { required: true })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-[var(--text-muted)] mb-1.5">
                {t('message')}
              </label>
              <textarea
                id="message"
                rows={6}
                {...register('message', { required: true })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[var(--accent)] px-8 py-3 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
            >
              {t('send')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
