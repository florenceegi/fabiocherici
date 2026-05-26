# BOOTSTRAP_DRIFT_LOG

## Proposte

### M-001 — 2026-05-26 [retrofit post-mortem] — bootstrap / fabiocherici.com

**Severity**: minor | **Stato**: pending
**always_loaded esclusi**: 3 file

**loaded_unused** (pre-allocati mai consultati):
- `docs/lso/SSOT_REGISTRY.json`

**used_unloaded** (consultati ma non pre-allocati):
- (nessuno)

**Proposta**:
- `by_mission_type.bootstrap`: consider removing 1 file

**Reasoning**: drift empirico rilevato su M-001 (bootstrap/fabiocherici.com). Singola osservazione — CEO valuta se pattern ricorrente o specifico di questa mission.

