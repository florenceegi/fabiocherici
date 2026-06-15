diff --git a/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md b/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md
index 4e81ff4..8368854 100644
--- a/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md
+++ b/FABIOCHERICI-DOC/docs/ssot/i18n-messages.md
@@ -3,8 +3,8 @@ ssot_id: i18n-messages
 title: i18n Messages — Stringhe localizzate 7 lingue
 organ: fabiocherici.com
 source: messages/*.json
-last_sync: 2026-06-12
-last_verified_mission: M-015
+last_sync: 2026-06-13
+last_verified_mission: M-017
 ---
 
 # i18n Messages SSOT
@@ -30,8 +30,9 @@ Chiavi atomiche, gerarchiche per pagina/component.
 
 Top-level keys per pagina/area (ordine alfabetico):
 `ainous`, `contatti`, `creazioni`, `ecosistema`, `egi`, `epp` (incluso sub-namespace `epp.widgets` — M-009, esteso con `epp.widgets.fiscalita_epp` in M-011),
-`footer`, `home`, `meta`, `nav`, `navbar_quotes`, `not_found`, `numeri`, `oracode`,
-`preferences`, `privacy`, `prove`, `softwarehouse`, `under_construction`.
+`footer`, `home`, `meta`, `nav`, `navbar_quotes`, `nexus` (M-017 — widget operatore AI Padmin),
+`not_found`, `numeri`, `oracode`, `preferences`, `privacy`, `prove`, `softwarehouse`,
+`under_construction`.
 
 ### Namespace `softwarehouse` (cronologia)
 
@@ -44,6 +45,35 @@ Top-level keys per pagina/area (ordine alfabetico):
   Aggiornate anche `meta.softwarehouse_title` ("Softwarehouse — Vedi prima,
   decidi dopo") e `meta.softwarehouse_description` nei 7 locali (≤160 chars
   verificato: max 145, DE). Parità strutturale 7 lingue mantenuta.
+- **M-017**: namespace `softwarehouse` esteso con le 4 chiavi del richiamo al
+  widget operatore AI: `padmin_section_label`, `padmin_section_title`,
+  `padmin_section_intro`, `lso_talk_above` (richiamo "Parla con Padmin qui
+  sopra ↑" dalla sezione LSO verso il widget spostato in cima). 7 lingue.
+
+### Namespace `nexus` (M-017)
+
+Introdotto in M-017 — tutte le stringhe del **widget operatore AI "Padmin"**
+(chat in cima a /softwarehouse + nexus.fabiocherici.com): nome/ruolo/disclosure
+AI, label avatar, log conversazione, input/send/typing/status, contatore e
+messaggio rate-limit, errori generici, allega/rimuovi immagine + errori immagine
+(tipo/dimensione/lettura), vetrina opere `showcase_*` (titolo, by, aria, empty +
+CTA FlorenceEGI), ticker `wisdom_*` (label + 7 massime dal paradigma Oracode).
+**36 chiavi/locale, parità strutturale 7 lingue verificata** (it en de es fr pt zh).
+Consumato da `components/softwarehouse/nexus/*` via `useTranslations('nexus')`.
+
+### Namespace `privacy` (M-017 — trattamento dati operatore AI)
+
+M-017 ha esteso 5 chiavi `privacy.*` perché il sito ora **tratta dati personali**
+quando l'utente usa l'operatore AI (prima la privacy dichiarava "non raccoglie
+dati"): `data_collected_body` (IP pseudonimizzato via hash non reversibile +
+elaborazione messaggio/immagine), `legal_basis_body` (aggiunto legittimo
+interesse **Art. 6(1)(f) GDPR** per l'anti-abuso, accanto al consenso 6(1)(a)
+del form), `storage_body` (identificativo pseudonimizzato conservato max 30
+giorni poi cancellato), `third_party_body` (**OpenAI, USA** sub-processor per la
+sola generazione della risposta — contenuti non usati per training). Modifica
+**sostitutiva nel testo** ma additiva nel significato (il claim "non raccoglie
+dati su server propri" resta vero per il sito statico; l'operatore è un servizio
+separato dichiarato). 7 lingue, 6(1)(f) presente in tutti i locali.
 
 ### Sub-namespace `epp.widgets` (cronologia)
 
