/**
 * @package fabiocherici.com — Contact Form
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-22
 * @purpose Client-side contact form — mailto with GDPR consent checkbox, autoComplete, aria.
 */

'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';

const CONTACT_EMAIL = 'fabiocherici@gmail.com';

interface FormData {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export function ContactForm() {
  const t = useTranslations('contatti');
  const locale = useLocale();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const subject = encodeURIComponent(`${t('mail_subject')} ${data.name}`);
    const body = encodeURIComponent(`${t('name')}: ${data.name}\n${t('email')}: ${data.email}\n\n${data.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm text-[var(--text-muted)] mb-1.5">
          {t('name')}
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name', { required: true })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-red-500 mt-1">{t('error_required')}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-[var(--text-muted)] mb-1.5">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email', { required: true })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-500 mt-1">{t('error_required')}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-[var(--text-muted)] mb-1.5">
          {t('message')}
        </label>
        <textarea
          id="message"
          rows={6}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message', { required: true })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-y"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-sm text-red-500 mt-1">{t('error_required')}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          aria-required="true"
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
          {...register('consent', { required: true })}
          className="mt-1 h-4 w-4 shrink-0 rounded border border-[var(--border)] bg-[var(--bg-card)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
        />
        <label htmlFor="consent" className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('consent_label')}{' '}
          <a
            href={`/${locale}/privacy`}
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-2 transition-colors"
          >
            {t('consent_link')}
          </a>
        </label>
      </div>
      {errors.consent && (
        <p id="consent-error" role="alert" className="text-sm text-red-500 -mt-4">{t('error_consent')}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[var(--accent)] px-8 py-3 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
      >
        {t('send')}
      </button>
    </form>
  );
}
