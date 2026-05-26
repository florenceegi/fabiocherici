@/home/fabio/fabiocherici.com/CLAUDE.md

# FABIOCHERICI-DOC — Boot Context Istanza LSO

> Dir contenente registry + SSOT + audit per LSO mono-organo fabiocherici.com.
> Il CLAUDE.md primario vive in root progetto (`/home/fabio/fabiocherici.com/CLAUDE.md`)
> per servire sia il codice Next.js sia il DOC.
>
> Pattern istanza: NESTED — DOC è sub-directory del progetto, non istanza standalone.
> Vedi FINDING-MOA-4 (M-ORACODE-001 BACKLOG): supportare formalmente pattern nested
> nella convenzione `instance_root` di doc-sync-v2 v2.2.

## Convenzione paths per agenti

| Componente | Path assoluto |
|---|---|
| instance_root agent input | `/home/fabio/fabiocherici.com/FABIOCHERICI-DOC` |
| Project root (codice) | `/home/fabio/fabiocherici.com` |
| SSOT Registry | `docs/lso/SSOT_REGISTRY.json` |
| Mission Registry | `docs/missions/MISSION_REGISTRY.json` |
| Audit DOC-SYNC | `audit/doc_sync/<mission_id>/` |
| Source code watchato | `../lib/`, `../app/`, `../messages/`, `../components/` |
