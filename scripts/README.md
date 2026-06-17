# scripts

## setup-access.mjs

Idempotent [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/)
setup for this Worker. Replaces the manual "one-click Access" dashboard flow:
it find-or-creates the Access policy + application, reads the application's
`aud`, and sets the `POLICY_AUD` and `TEAM_DOMAIN` Worker secrets the app needs
to validate the Access JWT. Safe to re-run.

### Prerequisites

- You've deployed the Worker (`npm run deploy`) so its `workers.dev` hostname exists.
- A `wrangler` OAuth login (`wrangler login`) — used to write the Worker secrets.
- A **Cloudflare API token** with:
  - `Access: Apps and Policies` = **Edit**
  - `Access: Organizations, Identity Providers, and Groups` = **Read**

  Create one at <https://dash.cloudflare.com/profile/api-tokens>. The token is
  read from the environment only; nothing secret is committed.

### Usage

```bash
CLOUDFLARE_ACCOUNT_ID=<account-id> \
CLOUDFLARE_API_TOKEN=<access-scoped-token> \
ACCESS_EMAILS="you@example.com" \
npm run setup:access
```

Then redeploy if the secrets weren't already live: `npm run deploy`.

### Configuration (env vars)

| Var | Required | Description |
| --- | --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | yes | Target account. |
| `CLOUDFLARE_API_TOKEN` | yes | Access-scoped token (see above). |
| `ACCESS_EMAILS` | one of these | Comma-separated emails to allow. |
| `ACCESS_EMAIL_DOMAIN` | one of these | Allow an entire email domain, e.g. `example.com`. |
| `WORKER_NAME` | no | Defaults to `name` in `wrangler.jsonc`. |
| `WORKER_HOSTNAME` | no | Override the auto-detected `*.workers.dev` hostname. |
| `TEAM_NAME` | no | Only used if no Zero Trust org exists yet; becomes `<TEAM_NAME>.cloudflareaccess.com`. |
| `POLICY_NAME` | no | Reusable policy name (default `agentic-inbox-access`). |
| `APP_NAME` | no | Access application name (default `Agentic Inbox`). |
| `SESSION_DURATION` | no | Access session length (default `24h`). |
| `DRY_RUN=1` | no | Print actions without changing anything. |
| `SKIP_SECRETS=1` | no | Do everything except writing the Worker secrets. |

### Why two credentials?

The Access API token (`CLOUDFLARE_API_TOKEN`) can manage Access apps/policies but
not write Worker secrets. The script therefore strips that token from the
environment before invoking `wrangler secret put`, so the secret write falls
back to your `wrangler` OAuth login (which has Workers Scripts edit).
