# Sherif Issue #131 — Minimal Reproduction (Minimized)

This repository reproduces the bug described in https://github.com/QuiiBz/sherif/issues/131: with the Shell executor it FAILS (unordered-dependencies), while with the Docker executor it PASSES.

## Structure (minimal)
```
.
├─ .gitlab-ci.yml
├─ package.json          # single workspace pointing to packages/api
└─ packages/
   └─ api/package.json   # intentionally unsorted devDependencies to trigger the rule
```

## Prerequisites
- Docker installed and running
- Node.js/pnpm locally (optional, for Shell executor). Tested with Node 24, pnpm 11.5.0
- gitlab-ci-local (will be invoked via `pnpm dlx`)

## Quick start
1) List available jobs:
```
pnpm dlx gitlab-ci-local --file .gitlab-ci.yml --list
```

2) Run with Shell executor (expected to FAIL with unordered-dependencies):
```
pnpm dlx gitlab-ci-local --file .gitlab-ci.yml --force-shell-executor check_sherif
```

3) Run with Docker executor (expected to PASS):
```
pnpm dlx gitlab-ci-local --file .gitlab-ci.yml check_sherif
```

## Notes
- CI image: `node:24-alpine`
- Steps: print Node/pnpm versions, show the problematic package.json, run `pnpm dlx sherif@1.6.1`
- No installs required — everything runs via `pnpm dlx`.
