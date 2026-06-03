# Poster Maker QA

## E2E

Run `pnpm test:e2e` from the repository root. The Playwright config starts the Next development server on `127.0.0.1:3100` unless `PLAYWRIGHT_BASE_URL` points to an already running app.

Later export tests should use `test-results/downloads` as the stable download inspection directory.

## Manual Directory Picker QA

The File System Access API directory picker path remains manual QA. Automated e2e tests should cover browser download fallback behavior, while directory writes should be checked in a Chromium browser that supports `showDirectoryPicker`.
