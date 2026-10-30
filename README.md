# cf-worker-test

cf-worker-test is an interaction-only Discord bot running on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/notSoti/cf-worker-test)

## Develop and deploy

Both development and production use real, separate Cloudflare Workers with separate D1 databases. There is no local Worker server, tunnel, or `.env` file. `npm run dev` runs the development environment remotely on Cloudflare, picking up uncommitted changes as you edit; it does not update the production Worker. Your changes remain local to your checkout until committed and pushed. Pushing to the configured production branch deploys the production Worker through Cloudflare Workers Builds.

Prerequisites: Node.js/npm, a Cloudflare account, and Discord applications/bots for both development and production. No privileged Gateway intents are needed.

1. Install dependencies with `npm ci`.
2. Click **Deploy to Cloudflare** above and connect the repository. Some fields will be pre-filled, leave those as is, then disable the **Preview builds** option.
3. Wrangler config declares two independent environments: production (`cf-worker-test` / `DB`) and development (`cf-worker-test-development` / `DB`). In the Cloudflare setup flow, provision a D1 database for each environment. If the setup UI provisions only the production D1, create the development database from your project terminal with `npx wrangler d1 create cf-worker-test-development --binding DB --env development --update-config`. Commit and push any Wrangler config changes it makes. Do not bind both Workers to the same database.
4. Configure Worker variables separately for each Worker. Set the production `DISCORD_PUBLIC_KEY`, `DISCORD_APPLICATION_ID`, and `DISCORD_BOT_TOKEN` in Cloudflare for `cf-worker-test`. Set the development app's separate values for the `development` environment (for example, use `npx wrangler secret put DISCORD_PUBLIC_KEY --env development`, and likewise for the other two secrets). Don't forget to **Encrypt** the sensitive variables.
5. In Discord Developer Portal, set each Discord application's **Interactions Endpoint URL** to its corresponding Worker URL. Use the development Discord application for development and the production application for production; an application can have only one configured endpoint.
6. Run `npm run dev` to start the development Worker remotely on Cloudflare. Apply new schema migrations to its separate development D1 with `npm run migrate:development` when needed. Visit the development Worker and test with the development Discord application. To persist a development deployment between sessions, run `npm run deploy:development`.
7. Register slash commands separately for each Discord application with `npm run sync-commands`, setting `DISCORD_APPLICATION_ID` and `DISCORD_BOT_TOKEN` in the shell to the matching app's values. Repeat when command definitions change.
8. When ready, commit and push to the production branch. Cloudflare Workers Builds runs `npm run deploy` against production, applying production migrations and deploying the production Worker. No preview deployments are used.

Cloudflare stores Worker runtime secrets; command registration reads the application ID and bot token from the invoking shell. No local secret file is required. `npm run dev` requires Cloudflare authentication and runs the development Worker remotely, using the development D1 binding rather than the production one.