# Third-party skills

Copied unchanged from their public repositories on 26 October 2026 (from the list in https://x.com/pato__project/status/2114095406393036818). Each folder keeps its upstream licence.

| Skill | Source | Licence |
|---|---|---|
| frontend-design | https://github.com/anthropics/skills/tree/main/skills/frontend-design | Apache 2.0 (LICENSE.txt) |
| webapp-testing | https://github.com/anthropics/skills/tree/main/skills/webapp-testing | Apache 2.0 (LICENSE.txt) |
| ui-ux-pro-max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (`.claude/skills/ui-ux-pro-max`) | MIT |
| impeccable | https://github.com/pbakaus/impeccable (`.claude/skills/impeccable`, subagents in `.claude/agents/impeccable-*.md`) | Apache 2.0 |
| emil-design-eng | https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng | MIT |
| review-animations | https://github.com/emilkowalski/skills/tree/main/skills/review-animations | MIT |
| mobile-native | https://github.com/emilkowalski/skills/tree/main/skills/mobile-native | MIT |
| break-ui | https://github.com/emilkowalski/skills/tree/main/skills/break-ui | MIT |
| create-design-md | https://github.com/ibelick/ui-skills/tree/main/skills/create-design-md | MIT |
| web-design-guidelines | https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines | no licence file upstream |
| modern-web-guidance | https://github.com/GoogleChrome/modern-web-guidance (`skills/modern-web-guidance`), added 15 November 2026 | Apache 2.0 |

Local changes:

- ui-ux-pro-max: script paths changed from `${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/` to `.claude/skills/ui-ux-pro-max/`, because here it is a project skill, not a plugin.
- impeccable: its Claude Code hooks (a check after every Edit/Write and a deep pass on Stop) are not installed; the skill runs only when asked. Its launcher downloads the Impeccable engine from GitHub releases on first use.

- modern-web-guidance: installed with its own installer (`npx modern-web-guidance@latest install`), unchanged. The files live in `.agents/skills/modern-web-guidance` (read by Codex and other agents) and `.claude/skills/modern-web-guidance` is a symlink to them; `skills-lock.json` records the source. The skill calls `npx -y modern-web-guidance@latest search/retrieve`, which needs network access and sends anonymous usage data to Google unless `DISABLE_TELEMETRY=1` is set. Update it with `npx modern-web-guidance@latest update`.

To update one of the others, copy the folder again from its source and keep the changes above.
