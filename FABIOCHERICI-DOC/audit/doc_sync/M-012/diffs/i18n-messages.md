# Diff — i18n-messages SSOT (M-012)

## Modifica 1: frontmatter

```diff
- last_sync: 2026-05-28
- last_verified_mission: M-011
+ last_sync: 2026-05-29
+ last_verified_mission: M-012
```

## Modifica 2: Trappole note — nuova CICATRICE M-012

```diff
+ - [CICATRICE M-012] Rename label porta home: `home.door_egi` da `"EGI"` → `"Florence EGI"`
+   su tutti i 7 locale (1 sostituzione x file, trigger 2 substitutive). Valore IDENTICO in
+   tutte le 7 lingue (brand non tradotto). Pattern per rename brand label:
+   (1) grep esaustivo della key per identificare tutte le occorrenze (deve essere 1 sola per file: la definizione),
+   (2) sed/Edit atomico su tutti i 7 file con stesso valore,
+   (3) verifica callsite di `door_egi` in componenti Home (non richiede modifica codice — solo payload i18n cambia).
+   Brand names non traducibili: stesso valore in tutte le lingue, evitare localizzazione "creativa".
```

## Razionale

Mission M-012 modifica 1 chiave i18n (`home.door_egi`) su 7 file locale con valore identico
("Florence EGI"). Trigger Matrix tipo 2 (comportamentale: label UI visibile cambia, ma nessuna
struttura/API tocca). DOC-SYNC produce due effetti sul SSOT:

1. **Substitutive metadata**: bump frontmatter (last_sync + last_verified_mission)
2. **Additive narrativo**: nuova CICATRICE M-012 che documenta il pattern di rename brand label per missioni future

Modalita LSO ridotto: RAG skip. Verification mode: registry_only.
