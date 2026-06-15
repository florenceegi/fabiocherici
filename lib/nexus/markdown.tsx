/**
 * @package fabiocherici.com — Nexus safe markdown subset
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Render di un SUBSET markdown delle risposte AI come ALBERO REACT —
 *          NIENTE dangerouslySetInnerHTML su output LLM non fidato (XSS CWE-79,
 *          design M-017 §6). React escapa di default i text node, quindi
 *          costruendo nodi (non HTML string) l'escaping è garantito dal runtime.
 *          Subset supportato: **bold**, *italic*, `code`, [link](url) con schema
 *          allow-list (http/https/mailto), blocchi ``` ``` e paragrafi/righe.
 *          Nessuna libreria nuova (Semplicità Potenziante, design §3).
 * @mission M-017
 */

import { Fragment, type ReactNode } from 'react';

const SAFE_LINK_SCHEMES = ['http:', 'https:', 'mailto:'];

/** Verifica che un href usi solo schemi sicuri (no javascript:, no data:). */
function isSafeHref(href: string): boolean {
  try {
    const url = new URL(href, 'https://fabiocherici.com');
    return SAFE_LINK_SCHEMES.includes(url.protocol);
  } catch {
    return false;
  }
}

/** Inline: **bold**, *italic*, `code`, [text](url). Restituisce nodi React. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokenRe =
    /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)|(\[[^\]]+\]\([^)\s]+\))/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(lastIndex, match.index)}</Fragment>);
      i += 1;
    }
    const tok = match[0];
    const key = `${keyPrefix}-m${i}`;
    if (tok.startsWith('**')) {
      nodes.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith('`')) {
      nodes.push(<code key={key}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
      if (linkMatch && isSafeHref(linkMatch[2])) {
        nodes.push(
          <a key={key} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>,
        );
      } else if (linkMatch) {
        // Schema non sicuro → mostra solo il testo, scarta l'href (no XSS).
        nodes.push(<Fragment key={key}>{linkMatch[1]}</Fragment>);
      } else {
        nodes.push(<Fragment key={key}>{tok}</Fragment>);
      }
    } else {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    lastIndex = match.index + tok.length;
    i += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

/**
 * Render del testo markdown-subset come albero React sicuro.
 * Gestisce blocchi di codice ``` ``` e paragrafi separati da riga vuota.
 */
export function renderSafeMarkdown(text: string): ReactNode {
  if (!text) return null;

  // Estrae i blocchi di codice ``` ``` preservandoli letterali.
  const segments = text.split(/(```[\s\S]*?```)/g);

  return segments.map((seg, si) => {
    if (seg.startsWith('```') && seg.endsWith('```')) {
      const body = seg.slice(3, -3).replace(/^\w*\n/, '').replace(/\n$/, '');
      return (
        <pre key={`pre-${si}`}>
          <code>{body}</code>
        </pre>
      );
    }
    const paragraphs = seg.split(/\n{2,}/).filter((p) => p.trim().length > 0);
    return paragraphs.map((para, pi) => {
      const lines = para.split('\n');
      return (
        <p key={`p-${si}-${pi}`}>
          {lines.map((line, li) => (
            <Fragment key={`l-${si}-${pi}-${li}`}>
              {renderInline(line, `${si}-${pi}-${li}`)}
              {li < lines.length - 1 ? <br /> : null}
            </Fragment>
          ))}
        </p>
      );
    });
  });
}
