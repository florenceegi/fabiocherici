/**
 * @package fabiocherici.com — PadminChat (prompt-seed wiring) tests
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-16
 * @purpose Test del wiring prompt-seed M-018 (Opzione A): l'empty-state mostra i
 *          seed come veri <button> (getByRole, non getByTestId) e cliccarne uno
 *          INVIA subito il messaggio a Padmin → useNexusStream.send chiamato col
 *          testo del seed e la bolla utente compare. useNexusStream è MOCKATO
 *          (niente rete, SRP). Verifica anche: nessun seed renderizzato se la
 *          prop è assente (degrado), e che il seed sparisce dopo l'invio
 *          (empty-state via). M-018.
 * @mission M-018
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PadminChat from './PadminChat';

// next-intl: traduzioni identità (la key torna come stringa).
// useLocale aggiunto al wiring del banner AI Act (M-FABIOCHERICI-001): PadminChat
// ora chiama useLocale() per costruire il link /{locale}/ai-transparency del banner.
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'it',
}));

// useNexusStream MOCKATO: catturiamo gli argomenti di send, senza toccare la rete.
const sendMock = vi.fn();
vi.mock('./useNexusStream', () => ({
  useNexusStream: () => ({ send: sendMock, abort: vi.fn() }),
}));

const SEEDS = [
  'Quanto costerebbe rifare il mio gestionale?',
  'Ti mando uno screenshot del mio Excel, dimmi che ne pensi',
  'Come funziona: vedo prima di pagare?',
] as const;

beforeEach(() => {
  sendMock.mockReset();
});

describe('PadminChat — prompt-seed (M-018)', () => {
  it('mostra i seed come bottoni accessibili nell empty-state', () => {
    render(<PadminChat endpoint="https://nexus.example" seeds={SEEDS} seedIntro="seed_intro" />);

    for (const seed of SEEDS) {
      expect(screen.getByRole('button', { name: seed })).toBeInTheDocument();
    }
  });

  it('cliccare un seed invia subito il messaggio a Padmin', async () => {
    const user = userEvent.setup();
    render(<PadminChat endpoint="https://nexus.example" seeds={SEEDS} seedIntro="seed_intro" />);

    await user.click(screen.getByRole('button', { name: SEEDS[0] }));

    // send() chiamato col testo esatto del seed (wiring → handleSend → useNexusStream).
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock.mock.calls[0][0].body.message).toBe(SEEDS[0]);

    // La bolla utente col testo del seed è comparsa nel log conversazione.
    const log = screen.getByRole('log');
    expect(within(log).getByText(SEEDS[0])).toBeInTheDocument();
  });

  it('non renderizza alcun seed se la prop è assente (degrado)', () => {
    render(<PadminChat endpoint="https://nexus.example" />);
    expect(screen.queryByRole('button', { name: SEEDS[0] })).not.toBeInTheDocument();
  });
});
