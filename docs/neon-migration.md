# SIGNAL migration to Neon

The runtime supports the existing Supabase deployment and Neon direct PostgreSQL with certificate verification. Root `.env.local` is loaded for local work without overriding injected environment variables; `DOTENV_CONFIG_PATH` remains an explicit override. Neon automatically uses schema `signal`, requires the restricted `signal_app` role even for local startup, and never auto-creates cloud tables. Existing `pg` driver, auth and tenant policies are retained. A pooled Neon URL is rejected because the runtime sets session-level `search_path`; `DATABASE_URL_UNPOOLED` is preferred when available.

`node app/scripts/migrate-neon.mjs` copies only the four SIGNAL tables from a repeatable-read, read-only Supabase snapshot. It refuses to overwrite existing target schema/role. It creates a restricted role and RLS, copies all records in one destination transaction, and compares canonical row checksums before commit. Backups, credentials and the verification report are stored only in ignored `app/.local/` files. Source schema and data are never changed. Do not rerun against an existing target.

Local `.env.local` retains `SOURCE_DATABASE_URL` and `NEON_OWNER_DATABASE_URL` for migration only; runtime `DATABASE_URL` and `DATABASE_URL_UNPOOLED` use the restricted application role. Never upload the owner or source credential to Render or Git.

## Cutover

1. Stop presenter changes and participant activity on the old API for the cutover window.
2. Run `node app/scripts/verify-neon.mjs`. All four tables must match and `readyForCutover` must be true. If not, do not switch until the newer source data has been reconciled.
3. In Render environment settings copy the matching values from ignored `app/.local/neon-app.env`: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `DATABASE_SCHEMA=signal`, `DB_POOL_MAX=1`. Preserve existing admin password hash and frontend origin settings.
4. Deploy the backend commit containing this migration support. Verify `/api/health`, the active deck, admin login, a new isolated participant, and HITL session controls. Pages does not need a deployment for this database-only change.
5. Supabase is retained for recovery. Do not run both databases as independently writable production backends. Rolling back after Neon accepts writes needs reconciliation to avoid losing newer participant work.

The initial copy is a snapshot, not live replication. Re-run the read-only verification immediately before switching Render. A successful local API check alone does not mean the hosted backend has been cut over.
