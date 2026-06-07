# Drop — ricezione file da clienti (strumento di fabiocherici.com)

> I clienti aprono un link, trascinano i file (immagini, anche pesanti) → vanno **direttamente**
> su S3. In pagina: **anteprima JPEG** + **scarica originale**. Ogni cliente vede solo i suoi file.
>
> **SSOT autorevole** (architettura, valori reali, runbook, roadmap):
> `EGI-DOC/docs/fabiocherici/10_DROP_RICEZIONE_FILE_SSOT.md`
> Questo README è solo una guida rapida d'uso.

Live: `https://fabiocherici.com/drop/index.html?k=<token>` · Mission: M-DROP-001

---

## Uso quotidiano (CLI clienti)

```bash
cd /home/fabio/fabiocherici.com/drop
AWS_PROFILE=fabiocherici-deploy bin/drop-client.sh create  <slug> "Nome Cliente"   # nuovo link
AWS_PROFILE=fabiocherici-deploy bin/drop-client.sh reissue <slug> [Nome]           # nuovo link, STESSI file
AWS_PROFILE=fabiocherici-deploy bin/drop-client.sh list                             # elenco clienti
AWS_PROFILE=fabiocherici-deploy bin/drop-client.sh revoke  <slug>                   # disattiva i link
```

- `slug` = identità stabile del cliente (es. `stefania-capasso`). I file stanno in `incoming/{slug}/` — legati allo **slug**, non al token.
- `create`/`reissue` stampano il **link da inviare** (token mostrato una sola volta).
- Ciclo: `create` → mandi il link → il cliente trascina → apri lo stesso link → tab **Galleria** → anteprima + scarica.

## Struttura del repo

```
drop/
├── lambda/            firma multipart S3 + auth token (drop-signer)  — index.mjs, lib.mjs
├── frontend/          versione standalone della pagina (storica)
├── tiles-service/     servizio anteprime JPEG su EC2 (server.py)
├── bin/drop-client.sh CLI gestione clienti (create/reissue/list/revoke)
├── infra/             setup.sh (provisioning), policy JSON, acceptance-test.sh
├── tests/             unit test logica pura (node --test)
└── config.env         SSOT dei valori (bucket, region, api, ...)
```
> La pagina realmente in produzione è l'app combinata in `/home/fabio/fabiocherici.com/public/drop/`,
> deployata su `s3://fabiocherici.com/drop/` e servita da CloudFront. Vedi SSOT §4.1.

## Runbook essenziale

- **Test logica**: `node --test tests/`
- **Acceptance e2e**: `AWS_PROFILE=fabiocherici-deploy bash infra/acceptance-test.sh <token>`
- **Restart servizio anteprime** (via SSM): vedi SSOT §7.
- **Update pagina / Lambda / provisioning**: vedi SSOT §7.

## Limiti & roadmap
Ricezione/download: illimitati (S3). Anteprima: istantanea ≤~100 MB, più lenta sui file enormi.
Fase B (storage Pinata via EGI) e subdomain dedicato: vedi SSOT §8.
