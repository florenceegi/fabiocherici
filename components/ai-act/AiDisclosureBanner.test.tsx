/**
 * @package FlorenceEGI/kit-ai-act
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici (CEO) — M-DIM-003
 * @version 1.0.0 (FlorenceEGI — Kit AI-Act · disclosure Art. 50(1))
 * @date 2026-06-19
 * @purpose Test del banner canonico AI Act Art. 50(1). Import STATICO (il modulo ora esiste).
 *          getByRole-first (Testing Library), no getByTestId. Copre: 6 lingue + verbatim it/en,
 *          fallback locale ignoto → en, role="note" senza aria-live, aria-label localizzato, link
 *          nativo <a> con href default/custom + testo localizzato, dismiss solo con onDismiss,
 *          click dismiss → callback 1× e note fuori dal DOM, varianti dark/inline. className additivo:
 *          ora asserisce l'attributo STABILE data-ai-disclosure + classe custom + classi base del CSS
 *          Module (M-DIM-003 refactor: lo styling è un CSS Module co-locato, non più Tailwind).
 *          [da validare vs testing-library.com / vitest.dev: gap-corpus].
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { AiDisclosureBanner } from "./AiDisclosureBanner";

describe("AiDisclosureBanner", () => {
  it("rende il body legale corretto per tutte e 6 le lingue (it/en verbatim)", () => {
    const locales = ["it", "en", "de", "es", "fr", "pt"] as const;
    const expected: Record<(typeof locales)[number], RegExp> = {
      it: /^Stai interagendo con un assistente di intelligenza artificiale\. Le risposte possono contenere errori\./,
      en: /^You are interacting with an artificial intelligence assistant\. Responses may contain errors\./,
      de: /künstlicher Intelligenz/,
      es: /inteligencia artificial/,
      fr: /intelligence artificielle/,
      pt: /inteligência artificial/,
    };
    for (const locale of locales) {
      const { unmount } = render(<AiDisclosureBanner locale={locale} />);
      const note = screen.getByRole("note");
      expect((note.textContent ?? "").trim().length).toBeGreaterThan(0);
      expect(note.textContent).toMatch(expected[locale]);
      unmount();
    }
  });

  it("verbatim it/en (stringa esatta del testo legale, link escluso)", () => {
    const { unmount } = render(<AiDisclosureBanner locale="it" />);
    expect(
      screen.getByText(
        "Stai interagendo con un assistente di intelligenza artificiale. Le risposte possono contenere errori.",
        { exact: false },
      ),
    ).toBeInTheDocument();
    unmount();
    render(<AiDisclosureBanner locale="en" />);
    expect(
      screen.getByText(
        "You are interacting with an artificial intelligence assistant. Responses may contain errors.",
        { exact: false },
      ),
    ).toBeInTheDocument();
  });

  it("fallback: locale ignoto → en, mai vuoto", () => {
    render(<AiDisclosureBanner locale="zz-ZZ" />);
    const note = screen.getByRole("note");
    expect((note.textContent ?? "").trim().length).toBeGreaterThan(0);
    expect(note.textContent).toMatch(/artificial intelligence assistant/);
  });

  it("contenitore role=note presente e SENZA aria-live (contenuto statico)", () => {
    render(<AiDisclosureBanner locale="it" />);
    const note = screen.getByRole("note");
    expect(note).toBeInTheDocument();
    expect(note).not.toHaveAttribute("aria-live");
    // Non deve essere uno status/alert region.
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("aria-label del contenitore è localizzato", () => {
    const { unmount } = render(<AiDisclosureBanner locale="it" />);
    expect(screen.getByRole("note")).toHaveAttribute(
      "aria-label",
      "Avviso intelligenza artificiale",
    );
    unmount();
    render(<AiDisclosureBanner locale="en" />);
    expect(screen.getByRole("note")).toHaveAttribute(
      "aria-label",
      "Artificial intelligence notice",
    );
  });

  it("link: <a> con role link, href default /ai-transparency e testo localizzato", () => {
    render(<AiDisclosureBanner locale="it" />);
    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/ai-transparency");
    expect(link.textContent).toBe("Ulteriori informazioni");
  });

  it("link: transparencyUrl custom rispettata", () => {
    render(<AiDisclosureBanner locale="en" transparencyUrl="/en/ai-transparency" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en/ai-transparency");
    expect(link.textContent).toBe("More information");
  });

  it("dismiss: assente senza onDismiss", () => {
    render(<AiDisclosureBanner locale="it" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("dismiss: presente con onDismiss e aria-label localizzato", () => {
    render(<AiDisclosureBanner locale="it" onDismiss={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Chiudi avviso" }),
    ).toBeInTheDocument();
  });

  it("click dismiss → onDismiss chiamato 1 volta e note rimossa dal DOM", () => {
    const onDismiss = vi.fn();
    render(<AiDisclosureBanner locale="it" onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "Chiudi avviso" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("variant dark: rende body + link", () => {
    render(<AiDisclosureBanner locale="it" variant="dark" />);
    expect(screen.getByRole("note").textContent).toMatch(
      /intelligenza artificiale/,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/ai-transparency");
  });

  it("variant inline: rende body + link", () => {
    render(<AiDisclosureBanner locale="en" variant="inline" />);
    expect(screen.getByRole("note").textContent).toMatch(
      /artificial intelligence/,
    );
    expect(screen.getByRole("link").textContent).toBe("More information");
  });

  it("className è additivo (non sostituisce le classi base del CSS Module)", () => {
    render(<AiDisclosureBanner locale="it" className="my-custom-class" />);
    const note = screen.getByRole("note");
    // (a) attributo STABILE stack-independent presente.
    expect(note).toHaveAttribute("data-ai-disclosure");
    // (b) la classe custom passata via prop è presente.
    expect(note.className).toContain("my-custom-class");
    // (c) ci sono ANCHE le classi base del CSS Module (container + variante): la className
    //     additiva non sostituisce le basi → la stringa è più lunga della sola classe custom.
    expect(note.className.length).toBeGreaterThan("my-custom-class".length);
    expect(note.className.trim().split(/\s+/).length).toBeGreaterThan(1);
  });
});
