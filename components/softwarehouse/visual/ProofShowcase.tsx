/**
 * @package fabiocherici.com — ProofShowcase
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Slot della vetrina opere REALI dentro la sezione "La prova" (oltre
 *          all'hero): porta ricchezza visiva verificabile nel bento prova
 *          (opere vere, cliccabili, dal marketplace live). Stesso gate env di
 *          AdvisorSlot: con NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT (o l'override
 *          NEXT_PUBLIC_EGI_SHOWCASE_ENDPOINT) rende EgiShowcase live; altrimenti
 *          NON renderizza nulla (il bento prova ha già i blocchi-fatto testuali
 *          + il link onesto a art.florenceegi.com), così la build resta verde
 *          senza env (static export) e non resta un buco. Server component.
 */

import EgiShowcase from '../nexus/EgiShowcase';

export interface ProofShowcaseProps {
  /** Label "apre in nuova scheda" (i18n footer), passata a EgiShowcase. */
  opensNewTabLabel: string;
}

/** Deriva l'endpoint showcase dallo stesso origin del chat (Nexus proxy). */
function resolveShowcaseEndpoint(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_EGI_SHOWCASE_ENDPOINT;
  if (explicit) return explicit;
  const chat = process.env.NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT;
  if (!chat) return undefined;
  const base = chat.replace(/\/$/, '');
  return base === '' ? '/showcase' : `${base}/showcase`;
}

export default function ProofShowcase({ opensNewTabLabel }: ProofShowcaseProps) {
  const endpoint = resolveShowcaseEndpoint();
  // Senza endpoint il bento prova ha già il blocco-fatto + link onesto: niente buco.
  if (!endpoint) return null;
  return <EgiShowcase endpoint={endpoint} opensNewTabLabel={opensNewTabLabel} />;
}
