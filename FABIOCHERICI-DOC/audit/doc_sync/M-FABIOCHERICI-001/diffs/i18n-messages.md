diff --git a/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md b/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md
index 2552db5..ebbf077 100644
--- a/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md
+++ b/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md
@@ -29,7 +29,7 @@ Chiavi atomiche, gerarchiche per pagina/component.
 ## Namespace principali
 
 Top-level keys per pagina/area (ordine alfabetico):
-`ainous`, `contatti`, `creazioni`, `ecosistema`, `egi`, `epp` (incluso sub-namespace `epp.widgets` — M-009, esteso con `epp.widgets.fiscalita_epp` in M-011),
+`ainous`, `aiTransparency` (M-FABIOCHERICI-001 — pagina /ai-transparency + kit AI-Act), `contatti`, `creazioni`, `ecosistema`, `egi`, `epp` (incluso sub-namespace `epp.widgets` — M-009, esteso con `epp.widgets.fiscalita_epp` in M-011),
 `footer`, `home`, `meta`, `nav`, `navbar_quotes`, `nexus` (M-017 — widget operatore AI Padmin),
 `not_found`, `numeri`, `oracode`, `preferences`, `privacy`, `prove`, `softwarehouse`,
 `under_construction`.
@@ -91,6 +91,26 @@ sola generazione della risposta — contenuti non usati per training). Modifica
 dati su server propri" resta vero per il sito statico; l'operatore è un servizio
 separato dichiarato). 7 lingue, 6(1)(f) presente in tutti i locali.
 
+### Namespace `aiTransparency` (M-FABIOCHERICI-001 — pagina trasparenza AI-Act)
+
+Introdotto in M-FABIOCHERICI-001 per la nuova pagina pubblica `/ai-transparency`
+(`app/[locale]/ai-transparency/page.tsx`) richiesta dalla propagazione del **kit
+AI-Act** (banner di disclosure Art. 50(1) AI Act sulla chat Padmin + pagina di
+trasparenza dedicata). 10 chiavi/locale: `title`, `intro` (preserva il claim
+"risposte fondate sui documenti del progetto" — coerente con `commercial-claims`
+§5.2), `modelsHeading`, `modelsBody`, `advisoryHeading`, `advisoryBody`,
+`reportHeading`, `reportBody`, `contactHeading`, `contactBody`. **7 lingue, parità
+strutturale verificata** (it en de es fr pt zh; zh presente).
+
+Nota kit AI-Act: il **testo del banner** non vive in `messages/*.json` ma nel kit
+canonico `components/ai-act/ai-disclosure-i18n.ts` (copia verbatim md5-identica da
+M-DIM-003, canonico 6 lingue — `zh` cade in fallback `en`). `PadminChat.tsx` ora
+monta `<AiDisclosureBanner variant="inline" locale={useLocale()}
+transparencyUrl="/{locale}/ai-transparency">` al posto della disclosure ad-hoc
+(Strategia Delta — la vecchia stringa disclosure del namespace `nexus` resta nei
+messages ma non è più montata dal banner). Strato additivo rispetto al namespace
+`privacy` di M-017 (GDPR): qui = **trasparenza AI Art. 50(1)**, lì = trattamento dati.
+
 ### Sub-namespace `epp.widgets` (cronologia)
 
 - **M-009**: introdotto `epp.widgets` con 6 sezioni accordion: `ragion_essere`, `apr`, `arf`, `bpe`, `fiscalita_individuali`, `fiscalita_aziende`.
