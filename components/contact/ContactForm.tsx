/**
 * @package fabiocherici.com — Contact Form
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 4.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-22
 * @purpose Server-side contact form — sends email via AWS Lambda + SES, no data persistence.
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';

const CONTACT_ENDPOINT = 'https://fabiocherici-contact.lambda-url.eu-north-1.on.aws/';

interface FormData {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export function ContactForm() {
  const t = useTranslations('contatti');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-8 text-center" role="status">
        <p className="text-lg text-[var(--text-primary)] mb-2">{t('success')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-2 transition-colors"
        >
          {t('send_another')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <p className="text-sm text-[var(--text-muted)] italic leading-relaxed">
        {t('form_disclaimer')}
      </p>

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
          disabled={status === 'sending'}
          {...register('name', { required: true })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-50"
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
          disabled={status === 'sending'}
          {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-50"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-500 mt-1">
            {errors.email.type === 'pattern' ? t('error_email') : t('error_required')}
          </p>
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
          disabled={status === 'sending'}
          {...register('message', { required: true })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-y disabled:opacity-50"
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
          disabled={status === 'sending'}
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

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-500">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-[var(--accent)] px-8 py-3 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? t('sending') : t('send')}
      </button>
    </form>
  );
}
