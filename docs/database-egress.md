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


## Second efficiency pass: background polling and sleep

Network polling in the workshop, content module, HITL and CRA now pauses while the browser document is hidden or offline, refreshes on return and schedules the next read only after the preceding read settles. Topic editing polls at 10 seconds, only while its panel is visible and no edit is pending. HITL/CRA session controls poll only in Signals & participants. Admin participant-progress polling runs only in that panel. The embedded admin deck is mounted only in the Presentation panel; slide state is restored from the API on return. Demo control polling pauses when idle and hidden, but continues for active broadcasts so recorder leases are preserved. No short-lived auth cache was introduced: logout/revocation checks retain their immediate behavior.

`/api/live` checks the API process without touching PostgreSQL; `/api/health` still performs database readiness. After deploying the backend, set the existing Render service's Health Check Path to `/api/live` (render.yaml now declares this for managed/new services). This is necessary to stop routine platform probes from waking Neon. Startup still validates database connectivity and schema before the HTTP server starts. A liveness success alone intentionally does not claim database availability.

Deploy both Render and GitHub Pages for the second pass. Network lifecycle tests cover hidden/offline pauses, resume, request serialization and cleanup. Database integration tests assert liveness performs zero DB queries and readiness still performs a real query. Background tabs do not guarantee scale-to-zero: active broadcasts, foreground users, external monitors, or other clients can still keep the database awake.
