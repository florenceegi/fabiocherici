# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Test del proxy vetrina (showcase) con fake (nessuna rete reale):
         upstream ok -> egis passati through (solo campi vetrina); upstream
         500/timeout/JSON invalido -> {egis: []} graceful; cache TTL: seconda
         chiamata entro 300s NON rifa' il fetch (clock e fetcher iniettati).
"""

from __future__ import annotations

import httpx

from app.showcase import ShowcaseService, ShowcaseUpstreamError


class FakeClock:
    """Clock fittizio iniettabile (sostituisce time.monotonic nei test). Permette
    di far scorrere il tempo in modo deterministico per testare il TTL."""

    def __init__(self, start: float = 0.0) -> None:
        self.now = start

    def __call__(self) -> float:
        return self.now

    def advance(self, seconds: float) -> None:
        self.now += seconds


class FakeFetcher:
    """Fetcher fake che soddisfa la porta Fetcher (DIP). Conta le chiamate per
    verificare il comportamento di cache, e puo' essere programmato per
    restituire un payload o sollevare un errore upstream."""

    def __init__(
        self,
        *,
        payload: dict[str, object] | None = None,
        raise_error: ShowcaseUpstreamError | None = None,
    ) -> None:
        self.payload = payload if payload is not None else {"egis": []}
        self.raise_error = raise_error
        self.calls = 0

    def fetch_json(self, url: str, *, timeout: float) -> dict[str, object]:
        self.calls += 1
        if self.raise_error is not None:
            raise self.raise_error
        return self.payload


_UPSTREAM = "https://art.florenceegi.com/free-ai/hyper-egis"


def _payload_with_one_egi() -> dict[str, object]:
    return {
        "egis": [
            {
                "id": 42,
                "title": "Opera Uno",
                "image_url": "https://cdn.example/1.jpg",
                "share_url": "https://art.florenceegi.com/egi/1",
                "creator_name": "Alice",
                "extra_field_ignored": "boom",
            }
        ]
    }


def _service(fetcher: FakeFetcher, clock: FakeClock) -> ShowcaseService:
    return ShowcaseService(
        upstream_url=_UPSTREAM,
        fetcher=fetcher,
        clock=clock,
        ttl_seconds=300.0,
        timeout_seconds=8.0,
    )


def test_upstream_ok_passes_through_showcase_fields() -> None:
    fetcher = FakeFetcher(payload=_payload_with_one_egi())
    svc = _service(fetcher, FakeClock())

    result = svc.get_showcase()

    assert list(result.keys()) == ["egis"]
    egis = result["egis"]
    assert isinstance(egis, list)
    assert len(egis) == 1
    egi = egis[0]
    # Solo i campi vetrina, nell'ordine atteso; id e campi extra scartati.
    assert egi == {
        "title": "Opera Uno",
        "image_url": "https://cdn.example/1.jpg",
        "share_url": "https://art.florenceegi.com/egi/1",
        "creator_name": "Alice",
    }


def test_upstream_error_returns_empty_egis() -> None:
    fetcher = FakeFetcher(raise_error=ShowcaseUpstreamError("upstream 500"))
    svc = _service(fetcher, FakeClock())

    assert svc.get_showcase() == {"egis": []}


def test_invalid_json_shape_returns_empty_egis() -> None:
    # 'egis' non e' una lista -> shape invalida -> graceful empty.
    fetcher = FakeFetcher(payload={"egis": "not-a-list"})
    svc = _service(fetcher, FakeClock())

    assert svc.get_showcase() == {"egis": []}


def test_missing_egis_key_returns_empty_egis() -> None:
    fetcher = FakeFetcher(payload={"unexpected": 1})
    svc = _service(fetcher, FakeClock())

    assert svc.get_showcase() == {"egis": []}


def test_malformed_egi_entries_are_skipped() -> None:
    fetcher = FakeFetcher(
        payload={
            "egis": [
                {"title": "Buona", "image_url": "u", "share_url": "s", "creator_name": "c"},
                "non-dict",  # entry malformata
                {"image_url": "no-title"},  # manca title -> scartata
            ]
        }
    )
    svc = _service(fetcher, FakeClock())

    egis = svc.get_showcase()["egis"]
    assert isinstance(egis, list)
    assert len(egis) == 1
    assert egis[0]["title"] == "Buona"


def test_cache_within_ttl_does_not_refetch() -> None:
    fetcher = FakeFetcher(payload=_payload_with_one_egi())
    clock = FakeClock()
    svc = _service(fetcher, clock)

    first = svc.get_showcase()
    clock.advance(299.0)  # entro il TTL di 300s
    second = svc.get_showcase()

    assert fetcher.calls == 1  # una sola fetch reale
    assert first == second


def test_cache_expiry_refetches_after_ttl() -> None:
    fetcher = FakeFetcher(payload=_payload_with_one_egi())
    clock = FakeClock()
    svc = _service(fetcher, clock)

    svc.get_showcase()
    clock.advance(301.0)  # oltre il TTL
    svc.get_showcase()

    assert fetcher.calls == 2


def test_failed_fetch_is_not_cached_so_next_call_retries() -> None:
    # Un upstream fallito non deve "congelare" la cache vuota per 5 minuti:
    # la richiesta successiva deve ritentare.
    fetcher = FakeFetcher(raise_error=ShowcaseUpstreamError("boom"))
    clock = FakeClock()
    svc = _service(fetcher, clock)

    assert svc.get_showcase() == {"egis": []}
    assert svc.get_showcase() == {"egis": []}
    assert fetcher.calls == 2  # nessun caching dell'errore


def test_httpx_fetcher_maps_non_200_to_upstream_error() -> None:
    # Il fetcher di default (httpx) deve mappare non-200 in ShowcaseUpstreamError,
    # cosi' il service lo traduce in {egis: []}. Mock transport: niente rete.
    from app.showcase import HttpxFetcher

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(500, json={"error": "boom"})

    transport = httpx.MockTransport(handler)
    fetcher = HttpxFetcher(transport=transport)

    try:
        fetcher.fetch_json(_UPSTREAM, timeout=8.0)
    except ShowcaseUpstreamError:
        pass
    else:
        raise AssertionError("non-200 deve sollevare ShowcaseUpstreamError")


def test_httpx_fetcher_returns_json_on_200() -> None:
    from app.showcase import HttpxFetcher

    def handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["accept"] == "application/json"
        return httpx.Response(200, json={"egis": []})

    transport = httpx.MockTransport(handler)
    fetcher = HttpxFetcher(transport=transport)

    assert fetcher.fetch_json(_UPSTREAM, timeout=8.0) == {"egis": []}
