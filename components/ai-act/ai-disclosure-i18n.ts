/**
 * @package FlorenceEGI/kit-ai-act
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici (CEO) — M-DIM-003
 * @version 1.0.0 (FlorenceEGI — Kit AI-Act · disclosure Art. 50(1))
 * @date 2026-06-19
 * @purpose Dizionario self-contained del banner di disclosure AI Act Art. 50(1).
 *          Framework-agnostico: SOLO dato, zero dipendenze (no next-intl, no util host) così il
 *          componente canonico è copiabile identico in Next (DIMOSTRALO) e Vite (Sigillo).
 *          `body`/`link` sono testi legali VERBATIM (approvati). `ariaLabel`/`dismissLabel` sono
 *          UI chrome a11y (WCAG 2.1 SC 4.1.2 Name, Role, Value, Level A), tradotti coerentemente.
 *          i18n deriva in render dal locale (nessun useEffect): single source of truth qui.
 */

export type AiDisclosureLocale = "it" | "en" | "de" | "es" | "fr" | "pt";

export interface AiDisclosureStrings {
  /** Testo legale VERBATIM — informa l'utente di interagire con un'IA (Art. 50(1)). */
  readonly body: string;
  /** Etichetta del link alle ulteriori informazioni (/ai-transparency). */
  readonly link: string;
  /** aria-label del contenitore (role="note") — UI chrome a11y. */
  readonly ariaLabel: string;
  /** aria-label del bottone di chiusura — UI chrome a11y. */
  readonly dismissLabel: string;
}

/** Lingue supportate dal kit. L'ordine è quello canonico FlorenceEGI. */
export const AI_DISCLOSURE_LOCALES: readonly AiDisclosureLocale[] = [
  "it",
  "en",
  "de",
  "es",
  "fr",
  "pt",
] as const;

/** Lingua di fallback quando il locale richiesto non è nel kit. */
export const AI_DISCLOSURE_FALLBACK_LOCALE: AiDisclosureLocale = "en";

/**
 * Dizionario canonico. `body` e `link` sono VERBATIM (testi legali); non modificarli senza mandato.
 */
export const AI_DISCLOSURE_DICT: Readonly<
  Record<AiDisclosureLocale, AiDisclosureStrings>
> = {
  it: {
    body: "Stai interagendo con un assistente di intelligenza artificiale. Le risposte possono contenere errori.",
    link: "Ulteriori informazioni",
    ariaLabel: "Avviso intelligenza artificiale",
    dismissLabel: "Chiudi avviso",
  },
  en: {
    body: "You are interacting with an artificial intelligence assistant. Responses may contain errors.",
    link: "More information",
    ariaLabel: "Artificial intelligence notice",
    dismissLabel: "Dismiss notice",
  },
  de: {
    body: "Sie interagieren mit einem Assistenten mit künstlicher Intelligenz. Antworten können Fehler enthalten.",
    link: "Weitere Informationen",
    ariaLabel: "Hinweis zur künstlichen Intelligenz",
    dismissLabel: "Hinweis schließen",
  },
  es: {
    body: "Estás interactuando con un asistente de inteligencia artificial. Las respuestas pueden contener errores.",
    link: "Más información",
    ariaLabel: "Aviso de inteligencia artificial",
    dismissLabel: "Cerrar aviso",
  },
  fr: {
    body: "Vous interagissez avec un assistant d'intelligence artificielle. Les réponses peuvent contenir des erreurs.",
    link: "Plus d'informations",
    ariaLabel: "Avis d'intelligence artificielle",
    dismissLabel: "Fermer l'avis",
  },
  pt: {
    body: "Está a interagir com um assistente de inteligência artificial. As respostas podem conter erros.",
    link: "Mais informações",
    ariaLabel: "Aviso de inteligência artificial",
    dismissLabel: "Fechar aviso",
  },
} as const;

/**
 * Risolve il locale richiesto (anche stringa libera) verso una lingua del kit.
 * Mai throw, mai vuoto: locale ignoto → fallback ('en'). Deriva pura (usabile in render).
 */
export function resolveAiDisclosureStrings(
  locale: AiDisclosureLocale | string,
): AiDisclosureStrings {
  const normalized = locale.toLowerCase();
  const supported = AI_DISCLOSURE_LOCALES.find((l) => l === normalized);
  return AI_DISCLOSURE_DICT[supported ?? AI_DISCLOSURE_FALLBACK_LOCALE];
}
