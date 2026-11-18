# Database egress and polling

## Diagnosed paths

Deck polling previously loaded the entire shared seminar JSON every 200 ms per server snapshot. Content polling loaded the same JSON on every request. HITL polling fetched the whole shared room, then fetched it again in a locking transaction. Pool checkout repeated search_path/role setup for each request. CRA state polling fetched full session JSON and unconditionally rewrote unchanged participant state.

Production pg_stat_statements was unavailable (42P01). No extension or statistics reset was performed. Code inspection covered unused fields, unbounded reads, repeated static reads, aggregation and JOIN duplication. Presenter progress still reads participant records to materialize domain-specific counters; auth still checks each request against the database for immediate revocation. Those remain follow-up opportunities, not measured savings in this change.

## Changes

* Deck and content share a coalesced 2-second server cache. SQL fetches only the active published topic, presentation and release metadata, excluding drafts, other topics, participant quiz state and unrelated session data. Writes to presentation/topics/content/reset invalidate it after commit. Separate backend instances converge within the TTL; same-instance writes invalidate immediately.
* HITL GET uses a coalesced 1-second read cache, fetches only the hitl JSON key, and uses no write transaction or row lock. Mutations still lock, validate and commit atomically, then invalidate the cache. Responses are derived per requesting workspace after cache lookup, preserving private participant identity and answer-key hiding.
* Direct PostgreSQL clients initialize search_path and restricted-role checks once per physical connection rather than once per checkout. Tenant identity remains transaction-local on every tenant transaction. Connection failures create new physical clients and repeat initialization.
* CRA reads only epoch/release fields; unchanged state is not written back. Missing participant records are inserted only when needed. Release writes invalidate the public cache.

## Validation

54 backend tests passed with a disposable local database and one connection in the pool. Integration tests prove 20 concurrent deck viewers share one projected DB read, repeated quiz reads reuse the cache, identities do not leak across participants, and mutations still become visible. Cache tests cover simultaneous readers, invalidation during an in-flight read, expiry and recovery after failure.

A read-only size query against the current Neon SIGNAL row measured 160506 bytes for the old full JSON, 41288 bytes for the published deck projection, and 205 bytes for current HITL state. These are JSON payload sizes, not wire-level or monthly billing estimates. Growth of quiz participation changes its payload. Authentication and transaction overhead remain. No application data or cloud schema was changed for this measurement.

Backend-only release: deploy the corresponding commit on Render. Pages does not require redeployment. Continue checking Neon usage after a representative audience session; this change does not guarantee free-plan limits will never be reached.
