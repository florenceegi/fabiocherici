# DOC-SYNC Diff — i18n-messages.md (M-010)

## SSOT
`FABIOCHERICI-DOC/docs/ssot/i18n-messages.md`

## Mode
`additive` (applied)

## Justification
Mission M-010 ha rinominato 3 chiavi i18n (`epp.widgets.{apr,arf,bpe}.status_value` → `status_text`)
in 7 file locale + 3 callsite in `app/[locale]/epp/page.tsx`.

La doc esistente non descrive la convenzione naming chiavi (anti-trigger regex linguistici DE)
ne il protocollo di rename atomico. Aggiunte 2 nuove CICATRICI M-010 in "Trappole note":

1. Convenzione naming: evitare suffissi contenenti digrammi linguistici sensibili
   (`value` → `ue` matcha regex DE I-2 `\b\w*ue\w*\b`)
2. Protocollo rename i18n: 7 file + grep esaustivo callsite + test + quality gate ri-eseguito

Aggiunto anche `last_verified_mission: M-010` nel frontmatter.

## Tipo modifica
ADDITIVE (lessons learned aggiunte, nessuna sezione esistente rimossa o modificata semanticamente).

## Hash file
- Pre-edit:  `ed85988dc17642600c126e408e0ba2ffdec2ad829b6af580be72ce21148c69f2`
- Post-edit: (ricalcolato in Step 5b)
