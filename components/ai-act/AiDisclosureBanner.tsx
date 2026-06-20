/**
 * @package FlorenceEGI/kit-ai-act
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici (CEO) — M-DIM-003
 * @version 1.0.0 (FlorenceEGI — Kit AI-Act · disclosure Art. 50(1))
 * @date 2026-06-19
 * @purpose Banner CANONICO di disclosure AI Act Art. 50(1): informa l'utente di interagire con un
 *          sistema di IA, con link alle ulteriori informazioni (/ai-transparency). Framework-agnostico:
 *          SOLO `react` + un CSS Module CO-LOCATO (AiDisclosureBanner.module.css). ZERO dipendenza dal
 *          CSS framework dell'host: nessuna classe Tailwind, nessun token CSS dell'app (--l-… / --c-…)
 *          → componente copiabile IDENTICO in repo CON Tailwind (Sigillo/Vite) e SENZA (DIMOSTRALO).
 *          VIETATO next/link, next/*, next-intl, alias host (@/...), util host. Il file canonico vive
 *          qui (con il suo .module.css); le copie negli altri organi NON si modificano a mano (README).
 *
 *          A11Y: contenitore role="note" + aria-label localizzato (contenuto STATICO al render →
 *          NON role="status", NON aria-live; SC 4.1.2 Name, Role, Value, Level A). Link nativo <a>,
 *          sottolineato (non solo colore, SC 1.4.1 Use of Color, Level A) con focus-visible ring
 *          (SC 2.4.7 Focus Visible, Level AA). Dismiss = vero <button type="button"> con target
 *          ≥24×24px (SC 2.5.8 Target Size (Minimum), Level AA — WCAG 2.2). Contrasto ≥4.5:1 in tutte
 *          le varianti, dark inclusa (SC 1.4.3 Contrast (Minimum), Level AA).
 *          [da validare vs nextjs.org/testing-library: gap-corpus] — qui zero dipendenze Next, non rilevante.
 *
 *          STATO MINIMO: solo `dismissed`. i18n deriva in render (no useEffect — "You Might Not Need
 *          an Effect", react.dev). Nessuna animazione di default (anti-CLS).
 */
import { useState } from "react";

import styles from "./AiDisclosureBanner.module.css";
import {
  resolveAiDisclosureStrings,
  type AiDisclosureLocale,
} from "./ai-disclosure-i18n";

export type { AiDisclosureLocale } from "./ai-disclosure-i18n";

export type AiDisclosureVariant = "banner" | "inline" | "dark";

export interface AiDisclosureBannerProps {
  /** Lingua del kit ('it'|'en'|'de'|'es'|'fr'|'pt'); stringa libera → fallback 'en'. */
  readonly locale: AiDisclosureLocale | string;
  /** Preset estetico. Default 'banner'. */
  readonly variant?: AiDisclosureVariant;
  /** URL della pagina di trasparenza. Default '/ai-transparency'. */
  readonly transparencyUrl?: string;
  /** Classi additive sul contenitore (NON sostituiscono le classi base). */
  readonly className?: string;
  /**
   * Se fornito, rende un bottone di chiusura che chiama onDismiss e rimuove il banner dal DOM.
   * Se ASSENTE, il banner è persistente (nessun bottone).
   */
  readonly onDismiss?: () => void;
}

/**
 * Mappa variante → classe-contenitore del CSS Module. Le classi `link`/`dismiss` sono comuni
 * (lo styling per-variante è ereditato via cascata `.banner .link`, ecc. nel .module.css).
 * Contrasti verificati ≥4.5:1 in ogni variante (SC 1.4.3, Level AA) — vedi header del .module.css.
 */
const VARIANT_CONTAINER: Record<AiDisclosureVariant, string> = {
  banner: styles.banner ?? "",
  inline: styles.inline ?? "",
  dark: styles.dark ?? "",
};

/**
 * Banner di disclosure AI Act Art. 50(1). Server-renderizzabile (nessuna API browser al render);
 * lo stato `dismissed` è client-side, attivo solo quando `onDismiss` è fornito.
 */
export function AiDisclosureBanner({
  locale,
  variant = "banner",
  transparencyUrl = "/ai-transparency",
  className,
  onDismiss,
}: AiDisclosureBannerProps): React.JSX.Element | null {
  const [dismissed, setDismissed] = useState(false);
  const strings = resolveAiDisclosureStrings(locale);

  if (dismissed) {
    return null;
  }

  const containerClassName = [
    styles.container,
    VARIANT_CONTAINER[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  function handleDismiss(): void {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      // Attributo STABILE stack-independent (come la versione Blade): hook di test/E2E e
      // identificazione del banner indipendente dalle classi hash del CSS Module.
      data-ai-disclosure=""
      role="note"
      aria-label={strings.ariaLabel}
      className={containerClassName}
    >
      <p className={styles.text}>
        {strings.body}{" "}
        <a href={transparencyUrl} className={styles.link}>
          {strings.link}
        </a>
      </p>
      {onDismiss !== undefined ? (
        <button
          type="button"
          aria-label={strings.dismissLabel}
          onClick={handleDismiss}
          className={styles.dismiss}
        >
          {/* Glifo decorativo: l'etichetta accessibile è aria-label, l'icona è aria-hidden. */}
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}
