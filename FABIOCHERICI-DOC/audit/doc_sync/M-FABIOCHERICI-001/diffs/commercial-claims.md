diff --git a/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md b/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
index a15a471..61d8dfb 100644
--- a/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
+++ b/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
@@ -4,10 +4,10 @@ ssot_id: commercial-claims
 slug: commercial-claims
 organ: fabiocherici.com
 doc_type: content-ssot
-version: 1.2.0
+version: 1.4.0
 status: current
 date: '2026-06-11'
-last_sync: '2026-06-13'
+last_sync: '2026-06-20'
 author: Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 scope:
 - fabiocherici.com
@@ -211,6 +211,32 @@ viable product" non è comprensibile alle PMI. La proiezione pubblica
 versione funzionante"; questo documento e i suoi razionali interni continuano a
 usare "MVP" come nome tecnico del concetto.
 
+## 12. Trasparenza AI Art. 50(1) AI Act (M-FABIOCHERICI-001 — 2026-06-20)
+
+Propagazione del **kit AI-Act** sull'operatore Padmin: la chat ora dichiara
+esplicitamente all'utente di interagire con un'intelligenza artificiale (obbligo
+di trasparenza Art. 50(1) Regolamento UE 2024/1689 — AI Act), tramite un **banner
+di disclosure** canonico, e una **pagina pubblica di trasparenza** `/ai-transparency`.
+
+| Elemento | Stato |
+|---|---|
+| Banner disclosure Art. 50(1) sulla chat Padmin | LIVE — `components/ai-act/AiDisclosureBanner.tsx` (kit canonico da M-DIM-003, verbatim), montato in `PadminChat.tsx` `variant="inline"` con link alla pagina trasparenza; **sostituisce** la disclosure ad-hoc precedente (Strategia Delta) |
+| Pagina pubblica `/ai-transparency` | LIVE — `app/[locale]/ai-transparency/page.tsx`, 7 locale, SSG + JSON-LD, in sitemap; namespace i18n `aiTransparency` |
+| Claim preservato | la pagina ribadisce che le risposte di Padmin sono **"fondate sui documenti del progetto"** (coerente con §5.2 e con il frame del claim §3 "mente interrogabile") e possono contenere errori (no over-claim) |
+
+Relazione con il layer **privacy/GDPR** (§10, M-017): complementare, non
+sostitutivo. M-017 ha coperto il **trattamento dati** (IP pseudonimizzato, OpenAI
+sub-processor, base giuridica 6(1)(f)); M-FABIOCHERICI-001 copre la **trasparenza
+AI** (l'utente sa di parlare con un'AI). Nessun claim commerciale §3/§4 modificato;
+nessun prezzo o razionale interno toccato. Strato di compliance additivo.
+
+> Gap registrato (DOC-SYNC M-FABIOCHERICI-001): **non esiste** in FABIOCHERICI-DOC
+> uno SSOT dedicato alla compliance AI / al kit AI-Act dell'organo. Il layer è oggi
+> tracciato qui (§12) + in `i18n-messages.md` (namespace `aiTransparency`) +
+> `seo.md` (rotta). Se il kit AI-Act si estenderà (es. logging trasparenza, marcatura
+> contenuti generati Art. 50(2), GPAI), valutare uno SSOT `ai-act-compliance.md`
+> dedicato. NON creato in questa mission (REGOLA ZERO — non si inventa uno SSOT).
+
 ## Changelog
 
 | Versione | Data | Mission | Cambiamento |
@@ -219,3 +245,4 @@ usare "MVP" come nome tecnico del concetto.
 | 1.1.0 | 2026-06-12 | M-015 (DOC-SYNC) | Stato endpoint EGI-STAT §3 (costruito), note di stato §7 (stats attive, chat slot-only), sezione 9 stato attuazione |
 | 1.2.0 | 2026-06-13 | M-017 (DOC-SYNC) | Chat advisor §3/§7/§9 da slot-predisposto → operatore "Padmin" LIVE (RAG dedicato, microservizio nexus-operator, widget in cima a /softwarehouse + nexus.fabiocherici.com); nuova §10 stato operatore AI; 2 nuovi SSOT figli registrati (commercial-claims-public, discovery-questions); privacy IP-pseudonimizzato/OpenAI/6(1)(f) |
 | 1.3.0 | 2026-06-16 | M-018 (DOC-SYNC) | Nuova §11 stato attuazione attention-first: hero split (Padmin sopra la piega), prompt-seed, **3D rimosso da /softwarehouse**, una sola CTA primaria. Regola jargon §1 rafforzata: "MVP" de-gergoizzato nella copy cliente (56 stringhe i18n + commercial-claims-public v1.1.0) → "prima versione funzionante"; **termine interno MVP INVARIATO** in questo doc per decisione CEO. |
+| 1.4.0 | 2026-06-20 | M-FABIOCHERICI-001 (DOC-SYNC) | Nuova §12 trasparenza AI Art. 50(1) AI Act: banner disclosure canonico (kit AI-Act) sulla chat Padmin + pagina pubblica `/ai-transparency` (7 locale, SSG, namespace i18n `aiTransparency`). Layer additivo complementare al privacy/GDPR di M-017. Gap registrato: nessuno SSOT compliance-AI dedicato (non creato — REGOLA ZERO). (Nota: front-matter version riallineato da 1.2.0→1.4.0, drift pregresso col changelog 1.3.0.) |
