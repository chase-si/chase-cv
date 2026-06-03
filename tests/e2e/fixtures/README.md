# E2E Fixtures

Playwright writes per-test artifacts to `test-results`.

Use `test-results/downloads` as the stable inspection location for poster export download tests added in later slices. Tests should create that directory before triggering downloads and clean only the files they own.

Browser download fallback can be verified automatically. File System Access API directory picker writes remain a manual QA path because Playwright cannot complete the native directory picker dialog in a deterministic local run.
