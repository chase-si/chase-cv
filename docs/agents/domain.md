# Domain docs

This repository uses a single-context layout.

Agents should look for project context in `CONTEXT.md` at the repository root and architectural decisions in `docs/adr/`.

If those files or directories do not exist yet, agents should proceed from the repository source, README, and current user context, and avoid inventing domain terms that are not represented in the codebase or conversation.
