# Poster Maker QA

## E2E

Run `pnpm test:e2e` from the repository root. The Playwright config starts the Next development server on `127.0.0.1:3100` unless `PLAYWRIGHT_BASE_URL` points to an already running app.

The full poster maker journey test enters the workbench from navigation, selects a category and template, imports Markdown with replace and append, reorders pages, enables page labels and a footer, and verifies browser fallback PNG downloads in `test-results/downloads`.

## Manual Directory Picker QA

The File System Access API directory picker path remains manual QA. Automated e2e tests should cover browser download fallback behavior, while directory writes should be checked in a Chromium browser that supports `showDirectoryPicker`.

Manual directory picker pass for any build or browser path that enables `showDirectoryPicker`:

1. Open `/poster-maker` in a Chromium browser that supports the File System Access API.
2. Create at least two titled poster pages and select a template.
3. Enable page labels, add a global footer, and export.
4. If the native directory picker appears, choose a writable directory.
5. Confirm each poster page is written as a PNG with the expected page order, labels, footer, and template styling.
6. Repeat once after cancelling the picker, or with `showDirectoryPicker` unavailable, to confirm the browser download fallback still works.
