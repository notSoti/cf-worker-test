# AGENTS.md

## Project Overview
cf-worker-test is an interaction-only Discord bot that offers various utilities to the server's staff team.


## Tech Stack
- discord-interactions
- JavaScript (ES modules)
- Cloudflare's D1 database
- Cloudflare Workers

## Code Structure
```text
cf-worker-test/
├── src/
│   ├── index.js
│   ├── config.js
│   ├── constants.js
│   ├── database.js
│   ├── commandHandler.js
│   ├── interactionHandler.js
│   ├── utils.js
│   ├── commands/
│   ├── interactions/
│   ├── commands/
│   │   ├── ping.js
│   │   ├── lockdown.js
│   │   ├── whois.js
│   │   ├── status.js
│   │   ├── automod.js
│   │   ├── issue.js
│   │   ├── activity.js
│   │   ├── mute.js
│   │   ├── translate.js
│   ├── models/
├── database/migrations/
├── package.json
└── README.md
```

## Adding Commands and Interactions
- Commands are one default-exported object per file in `src/commands/`. Export the registered command list and definitions from `src/commands/index.js`; keep command behavior separate and reuse shared helpers.
- Interaction files in `interactions/` may export named functions prefixed with `handle`. Interaction handlers are responsible for validating interaction type, custom ID, authorization (only the user that used the interaction should be able to use any components that are a part of it).
- Add database changes as new sequential migrations under `database/migrations/`; never modify a migration that may already have run in a deployed database. Migrations should be created/modified/ran through the appropriate "d1 migrations" commands, not manually.

## Code Style and Validation
- Follow `eslint.config.js`.
- Lint changed files with `npx eslint`; use `npx eslint --fix` when appropriate. Avoid repository-wide autofix without reviewing its scope.

## Implementation Guidance
- Given this bot will run via Cloudflare Workers, performance is important so let's not overcomplicate things.
- When handling interactions, always defer them first to ensure the worker will always have time to fully process and respond to the interaction.
- All slash commands/context menu commands should have the Manage Server permission as the required one to see the commands.
- Keep each command separate; consolidate interaction logic where it improves clarity.
- Reuse shared helpers in module utilities or `src/core/utils.js` where appropriate.
- Avoid unnecessary `try/catch` wrappers and overengineering.
