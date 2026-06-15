# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017
@purpose Configurazione del microservizio. Legge segreti SOLO da env vars /
         env file fuori-repo (CWE-798: nessun segreto in codice). Espone una
         dataclass immutabile (value object) come Single Source of Truth della
         config a runtime. Logga lunghezze, mai valori.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


def load_env_file(env_path: Path) -> dict[str, str]:
    """Parsa un file .env in dict. Stessa logica di os3-matrix/bin/rag_query.py
    (load_env_file): righe `KEY=VALUE`, ignora commenti e vuote, strippa quote.
    Non solleva se il file non esiste: ritorna dict vuoto (l'env reale puo'
    arrivare interamente da os.environ)."""
    env_vars: dict[str, str] = {}
    if not env_path.exists():
        return env_vars
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            env_vars[key.strip()] = val.strip().strip('"').strip("'")
    return env_vars


def _resolve_env_path() -> Path | None:
    """Risolve il path del file env. Default: /etc/nexus/operator.env (come da
    spec CEO), override via NEXUS_ENV_PATH. Coerente con resolve_env_path() di
    rag_query.py (override via env var)."""
    override = os.environ.get("NEXUS_ENV_PATH")
    if override:
        return Path(override)
    default = Path("/etc/nexus/operator.env")
    return default if default.exists() else None


@dataclass(frozen=True)
class Config:
    """Value object immutabile di configurazione (PEP 557 dataclasses, frozen
    per hashability + niente mutazioni accidentali a runtime). Tutti i campi
    sono richiesti tranne i default espliciti."""

    db_host: str
    db_port: int
    db_database: str
    db_username: str
    db_password: str
    openai_api_key: str
    rag_schema: str
    chat_model: str
    embedding_model: str
    rag_threshold: float
    rag_limit: int
    guest_daily_limit: int
    max_message_length: int
    max_history: int
    showcase_upstream: str
    # Segreto per la pseudonimizzazione dell'IP nel rate-limit (GDPR B2). NON e'
    # nei segreti "minimi" richiesti perche' ha un default operativo; ma in
    # produzione DEVE essere fornito via NEXUS_RATELIMIT_SALT (vedi load_config).
    ratelimit_salt: str
    # Cap sui token di OUTPUT della chat completion (LLM04 cost/DoS).
    max_output_tokens: int
    # Durata massima (secondi) dello stream LLM lato connessione (LLM04 watchdog).
    stream_timeout_seconds: float
    # Budget totale caratteri della conversation_history (LLM04 cost cap input).
    max_history_total_chars: int
    # CORS allow-list e TrustedHost allow-list (A05): origini/host CSV.
    cors_origins: tuple[str, ...]
    allowed_hosts: tuple[str, ...]

    @property
    def has_secrets(self) -> bool:
        """True se i segreti minimi sono presenti. Usato da /health senza mai
        esporre i valori."""
        return bool(self.openai_api_key and self.db_password and self.db_host)


def load_config() -> Config:
    """Costruisce Config da env vars + env file (env var ha priorita', come
    rag_query.py: os.environ OR env_vars). Solleva ValueError elencando SOLO i
    NOMI delle chiavi mancanti, mai i valori (no leak in log/eccezioni)."""
    env_path = _resolve_env_path()
    file_vars = load_env_file(env_path) if env_path else {}

    def cfg(key: str, default: str = "") -> str:
        return os.environ.get(key) or file_vars.get(key) or default

    def cfg_csv(key: str, default: str) -> tuple[str, ...]:
        """Legge una env CSV in tupla immutabile (allow-list), strippando spazi e
        scartando voci vuote. Default applicato se l'env e' assente/vuota."""
        raw = cfg(key, default)
        return tuple(item.strip() for item in raw.split(",") if item.strip())

    db_host = cfg("DB_HOST")
    db_database = cfg("DB_DATABASE")
    db_username = cfg("DB_USERNAME")
    db_password = cfg("DB_PASSWORD")
    openai_api_key = cfg("OPENAI_API_KEY")

    required = {
        "DB_HOST": db_host,
        "DB_DATABASE": db_database,
        "DB_USERNAME": db_username,
        "DB_PASSWORD": db_password,
        "OPENAI_API_KEY": openai_api_key,
    }
    missing = [name for name, value in required.items() if not value]
    if missing:
        raise ValueError(
            "Config mancante (nomi, non valori): " + ", ".join(missing)
        )

    return Config(
        db_host=db_host,
        db_port=int(cfg("DB_PORT", "5432")),
        db_database=db_database,
        db_username=db_username,
        db_password=db_password,
        openai_api_key=openai_api_key,
        rag_schema=cfg("ORACODE_RAG_SCHEMA", "rag_nexus"),
        # Default allineato al runtime reale (gpt-4o, non -mini): il box gira
        # gpt-4o via env; il default del codice ora coincide (M-017 punto 5).
        chat_model=cfg("NEXUS_CHAT_MODEL", "gpt-4o"),
        embedding_model=cfg("NEXUS_EMBEDDING_MODEL", "text-embedding-3-small"),
        rag_threshold=float(cfg("NEXUS_RAG_THRESHOLD", "0.35")),
        rag_limit=int(cfg("NEXUS_RAG_LIMIT", "6")),
        guest_daily_limit=int(cfg("NEXUS_GUEST_DAILY_LIMIT", "50")),
        max_message_length=int(cfg("NEXUS_MAX_MESSAGE_LENGTH", "2000")),
        max_history=int(cfg("NEXUS_MAX_HISTORY", "20")),
        showcase_upstream=cfg(
            "NEXUS_SHOWCASE_UPSTREAM",
            "https://art.florenceegi.com/free-ai/hyper-egis",
        ),
        # GDPR B2: in PRODUZIONE fornire NEXUS_RATELIMIT_SALT (segreto). Il
        # default e' un fallback documentato che mantiene la pseudonimizzazione
        # funzionante, ma un salt segreto e' preferibile (vedi .env.example).
        ratelimit_salt=cfg(
            "NEXUS_RATELIMIT_SALT", "nexus-default-ratelimit-salt-change-me"
        ),
        max_output_tokens=int(cfg("NEXUS_MAX_OUTPUT_TOKENS", "1024")),
        stream_timeout_seconds=float(cfg("NEXUS_STREAM_TIMEOUT_SECONDS", "60")),
        max_history_total_chars=int(
            cfg("NEXUS_MAX_HISTORY_TOTAL_CHARS", "24000")
        ),
        cors_origins=cfg_csv(
            "NEXUS_CORS_ORIGINS",
            "https://fabiocherici.com,https://www.fabiocherici.com",
        ),
        allowed_hosts=cfg_csv(
            "NEXUS_ALLOWED_HOSTS",
            "nexus.fabiocherici.com,localhost,127.0.0.1",
        ),
    )
