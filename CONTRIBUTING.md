# Contributing to Hazura

Thank you for your interest in contributing! This project aims to help people understand and prepare for natural hazard risks.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/sachinkg12/hazura.git
cd hazura

# Install dependencies
pnpm install

# Run tests
pnpm test

# Start development
pnpm dev
```

## Project Structure

- `packages/core/` — The scoring engine (standalone npm package)
- `apps/web/` — Next.js web dashboard

## Adding a New Data Provider

This is the most impactful way to contribute. Each provider fetches data from a government API and normalizes it into hazard scores.

1. Create a new file in `packages/core/src/providers/`
2. Extend `BaseProvider`
3. Implement the `assess()` method
4. Add tests in `packages/core/__tests__/providers/`
5. Export from `packages/core/src/providers/index.ts`

See existing providers (e.g., `fema.provider.ts`) for reference.

## Pull Request Process

1. Fork the repo and create a feature branch
2. Write tests for new functionality
3. Ensure `pnpm test` and `pnpm typecheck` pass
4. Submit a PR with a clear description

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).
