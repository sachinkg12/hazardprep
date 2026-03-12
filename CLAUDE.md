# MyHazardProfile

Multi-hazard personal risk assessment engine + web dashboard for any US address.

## Project Structure
- `packages/core/` — `@myhazardprofile/core` standalone npm library (scoring engine)
- `apps/web/` — Next.js web dashboard
- `TRACKER.md` — Project roadmap and progress tracker. **Always consult and update this file when completing tasks.**

## Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Core library**: TypeScript, tsup (CJS + ESM), vitest
- **Web app**: Next.js (App Router), Tailwind CSS, Leaflet
- **Data sources**: OpenFEMA, USGS, NOAA, NIFC — all free, no API keys

## Key Commands
```bash
pnpm install          # install deps
pnpm test             # run all tests
pnpm build            # build all packages
pnpm dev              # dev mode
```

## Architecture
- Core engine uses a **provider plugin pattern** — each data source implements `DataProvider` interface
- Providers run in parallel via `Promise.allSettled` (graceful degradation)
- Geocoding uses US Census Bureau API (free, no key)
- Composite scoring uses configurable weighted averages

## Git & Commit Rules (MANDATORY)
- **Author**: All commits must be authored by `Sachin Gupta`. Never use any other name.
- **No AI attribution**: Never include `Co-Authored-By` lines mentioning Claude, Anthropic, or any AI.
- **No laptop owner references**: Never reference the laptop owner's username or identity in commits, code, comments, or config. This is a borrowed laptop.
- **Commit messages**: Write clear, human-authored commit messages. No AI footprints.

## Conventions
- All code in TypeScript with strict mode
- Tests in `__tests__/` directories using vitest
- Providers extend `BaseProvider` (handles caching + error wrapping)
- Node 20+ required (brew install node@20)
