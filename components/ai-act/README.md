# Kit AI-Act — `<AiDisclosureBanner>` (canonico)

**Versione:** 1.0.0 · Mission M-DIM-003 · disclosure AI Act **Art. 50(1)**

> ⚠️ **Questo è il file CANONICO.** Modifica QUI, non le copie negli altri organi.
> Quando un organo (Sigillo/Vite, EGI, …) usa il banner, ne copia `AiDisclosureBanner.tsx` +
> `AiDisclosureBanner.module.css` + `ai-disclosure-i18n.ts` **identici** (i tre file viaggiano
> insieme). Un fix o un cambio di testo legale si applica al canonico e si ri-propaga; **non** si
> patcha la copia locale (divergerebbe dal testo approvato).

## Cosa fa

Informa l'utente di interagire con un sistema di IA, con un link alle ulteriori informazioni
(`/ai-transparency`). Obbligo di trasparenza AI Act Art. 50(1).

## Caratteristiche

- **Framework-agnostico + stylesheet-self-contained:** solo `react` + un **CSS Module co-locato**
  (`AiDisclosureBanner.module.css`). **NON dipende da Tailwind** né da alcun token CSS dell'host: gli
  stili (colori, contrasti, focus ring, target dismiss) viaggiano col componente. Funziona **identico**
  in repo **con** Tailwind (Sigillo/Vite) e **senza** (DIMOSTRALO). Nessun `next/*`, `next-intl`, alias
  host (`@/...`), util host → copiabile identico in Next e Vite.
- **i18n self-contained:** 6 lingue (`it en de es fr pt`) nel DICT (`ai-disclosure-i18n.ts`). I testi
  `body`/`link` sono **VERBATIM** (legali). Locale ignoto → fallback `en`. Mai vuoto, mai throw.
- **A11y:** `role="note"` + `aria-label` localizzato (contenuto statico → **niente** `aria-live`).
  Link `<a>` nativo **sottolineato** (non solo colore, SC 1.4.1 A) con `:focus-visible` ring (SC 2.4.7
  AA). Dismiss = vero `<button>` con target **≥24×24px** (SC 2.5.8 AA) e `aria-label`. Contrasto testo
  **≥4.5:1** in tutte le varianti, **dark inclusa** (SC 1.4.3 AA — valori verificati nel `.module.css`).
- **Hook stabile:** il contenitore radice porta `data-ai-disclosure` (stack-independent, come la
  versione Blade) per test/E2E e identificazione, indipendente dalle classi hash del CSS Module.
- **Override host-side:** la prop `className` resta **additiva** sul contenitore (non sostituisce le
  classi base) → l'host può sovrascrivere/estendere lo styling senza forkare il canonico.
- **Stato minimo:** solo `dismissed` (attivo solo se passi `onDismiss`). i18n deriva in render
  (nessun `useEffect`).
- **Anti-CLS:** nessuna animazione di default.

## API

```ts
type AiDisclosureLocale = 'it'|'en'|'de'|'es'|'fr'|'pt';
type AiDisclosureVariant = 'banner'|'inline'|'dark';

interface AiDisclosureBannerProps {
  locale: AiDisclosureLocale | string;     // ignoto → 'en'
  variant?: AiDisclosureVariant;            // default 'banner'
  transparencyUrl?: string;                 // default '/ai-transparency'
  className?: string;                       // additivo sul contenitore
  onDismiss?: () => void;                   // se assente → banner persistente, nessun bottone
}
```

## Uso

```tsx
// banner persistente (nessun dismiss)
<AiDisclosureBanner locale="it" />

// dark, con dismiss e URL per-locale
<AiDisclosureBanner locale="en" variant="dark"
  transparencyUrl="/en/ai-transparency" onDismiss={() => persistDismissed()} />
```

## Note d'ambiente

- Lo styling è **self-contained in `AiDisclosureBanner.module.css`** (CSS Module): viaggia col
  componente e NON dipende dal CSS framework dell'host. In repo **con** Tailwind e **senza** (es.
  DIMOSTRALO, che usa CSS custom-properties) il banner appare **identico** — niente classi Tailwind
  inerti, niente styling da fornire a parte.
- Requisiti d'ambiente: un bundler che gestisca i CSS Module. **Next** (App Router) li supporta
  nativamente (incl. la type-declaration `*.module.css`); **Vite** li supporta nativamente. Per altri
  setup, assicurarsi che `import styles from './*.module.css'` sia risolto dal bundler.

## Test

`AiDisclosureBanner.test.tsx` (Vitest + Testing Library, `getByRole`-first). Esegui:

```bash
npx vitest run src/components/ai-act/
```
