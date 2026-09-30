# FLIPD

Tvoja roba. Tvoja marža.

FLIPD je novi monorepo za upravljanje zalihom, prodajama i kupcima resellera. `frontend/` je React + TypeScript + Vite aplikacija na hrvatskom jeziku, a `worker/` je Cloudflare Worker REST API s D1 bazom.

## Lokalno pokretanje

1. `npm install`
2. Kopiraj `worker/.dev.vars.example` u `worker/.dev.vars` i postavi lokalne tajne.
3. U `worker/` pokreni `npx wrangler d1 migrations apply flipd-production --local`.
4. U jednom terminalu pokreni `npm run dev:worker`, a u drugom `VITE_API_URL=http://localhost:8787 npm run dev:frontend`.

## Arhitektura i sigurnost

- Bearer token autentifikacija s hashiranim sesijama u D1; nema third-party cookie ovisnosti.
- Lozinke su PBKDF2-SHA-256 s 120.000 iteracija i jedinstvenim saltom.
- Svaki poslovni upit filtrira `user_id`; prodaja i brisanje prodaje su transakcijske operacije.
- D1 migracije su u `worker/migrations/`; tajne se postavljaju kroz `.dev.vars` lokalno i `wrangler secret put` u produkciji.
- CORS koristi samo `ALLOWED_ORIGINS` iz konfiguracije.
- Read-only status nakon isteka pristupa provjerava se na backendu, ne samo u sučelju.

## Produkcijski deploy

Nakon `wrangler d1 create flipd-production`, upiši dobiveni ID u `worker/wrangler.jsonc`, postavi tajne (`SESSION_SECRET`, `ADMIN_BOOTSTRAP_SECRET`), pokreni `npx wrangler d1 migrations apply flipd-production --remote` i `npm run deploy --workspace worker`. Za Pages GitHub varijabla `VITE_API_URL` treba sadržavati Worker URL; workflow je u `.github/workflows/deploy-pages.yml`.

Po prvom deployu jednokratno pozovi `POST /admin/bootstrap` s `ADMIN_BOOTSTRAP_SECRET`, imenom, e-mailom i lozinkom admina. Tajna i lozinka nikad nisu u repozitoriju.
