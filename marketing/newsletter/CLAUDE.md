# Newsletter copy (`marketing/newsletter/`)

Shared with Codex, which reviews the Slovak copy (`@codex review` on a PR; rules in `marketing/newsletter/AGENTS.md`).
- Edit copy in `nastroje/build_emails.py`, then regenerate `sablony/` and `texty/` (see `marketing/newsletter/README.md`).
- Language rules: `marketing/newsletter/slovnik.md`. Review log: `marketing/newsletter/jazykova-kontrola.md`.
- After changing templates, keep the `orostone-newsletter` skill templates in sync.
- Email images live in `public/images/email/` (served at `https://orostone.sk/images/email/`); every image a template references must exist there.
