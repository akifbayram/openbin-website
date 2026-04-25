# Configuration Reference

No configuration is required to get started. All variables have safe defaults. Create a `.env` file in the project root to override any of them.

```bash
cp .env.example .env
```

Uncomment only the lines you need to change. The file is loaded automatically by Docker Compose and by the Express server at startup.

---

### Docker

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST_PORT` | `1453` | Externally-exposed port that maps to the container's internal port. Change this to run OpenBin on a different host port. |

---

### Server

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `1453` | Internal Express server port. Rarely needs changing unless you have a port conflict inside the container. |

---

### Database

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `./data/openbin.db` | Path to the SQLite database file. In Docker, set to `/data/openbin.db`. Also determines the directory for `.jwt_secret` and backup files. |
| `DATABASE_URL` | _(unset)_ | PostgreSQL connection string (e.g. `postgres://user:password@localhost:5432/openbin`). When set, OpenBin uses PostgreSQL instead of SQLite. The engine choice is permanent and cannot be changed after initial setup. |

::: warning
Set `DATABASE_URL` for PostgreSQL **or** use `DATABASE_PATH` for SQLite — not both. The database engine is locked after first initialization and cannot be switched later.
:::

---

### Authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | _(auto-generated)_ | JWT signing secret. Auto-generated on first run and persisted to `/data/.jwt_secret` if unset. Set explicitly to keep sessions valid across container rebuilds. |
| `REGISTRATION_MODE` | `open` | Registration policy. `open` — anyone can register. `invite` — new users must enter a location invite code during sign-up. `closed` — no new registrations; existing users can still log in. |

---

### Initial Admin

On first startup, OpenBin can seed an initial admin account. If `ADMIN_PASSWORD` (or `ADMIN_PASSWORD_FILE`) is unset, a random password is generated and printed to the server logs **once** — capture it before restarting.

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_EMAIL` | _(unset)_ | Email address for the seeded admin account. If unset, an admin is still created with a generated email; check the logs. |
| `ADMIN_PASSWORD` | _(auto-generated)_ | Password for the seeded admin. If unset, a random password is generated and logged on first startup. |
| `ADMIN_PASSWORD_FILE` | _(unset)_ | Path to a file containing the admin password. Useful with Docker secrets. Takes precedence over `ADMIN_PASSWORD` when both are set. |
| `ADMIN_PASSWORD_RESET` | `false` | When `true`, resets the seeded admin's password from `ADMIN_PASSWORD`/`ADMIN_PASSWORD_FILE` on next startup. Use to recover a locked-out instance. |
| `ADMIN_RESEED` | `false` | When `true`, re-creates the seeded admin account on next startup (e.g. after the original was deleted). |

::: tip Recovering a locked-out instance
If you lose the admin password, set `ADMIN_PASSWORD=<new-password>` and `ADMIN_PASSWORD_RESET=true`, restart, then unset `ADMIN_PASSWORD_RESET`. The new password is now active.
:::

---

### Storage

| Variable | Default | Description |
|----------|---------|-------------|
| `PHOTO_STORAGE_PATH` | `./uploads` | Local directory for photo files. Ignored when `STORAGE_BACKEND=s3`. |
| `STORAGE_BACKEND` | `local` | Storage engine. `local` — files on disk. `s3` — S3-compatible object storage. |
| `S3_BUCKET` | _(unset)_ | S3 bucket name. Required when `STORAGE_BACKEND=s3`. |
| `S3_REGION` | `us-east-1` | AWS region. |
| `S3_ENDPOINT` | _(unset)_ | Custom endpoint for MinIO, Cloudflare R2, or other S3-compatible services. |
| `S3_ACCESS_KEY_ID` | _(unset)_ | S3 access key. Required when `STORAGE_BACKEND=s3`. |
| `S3_SECRET_ACCESS_KEY` | _(unset)_ | S3 secret key. Required when `STORAGE_BACKEND=s3`. |
| `S3_FORCE_PATH_STYLE` | `false` | Set to `true` for MinIO and other path-style S3-compatible services. |

---

### Upload Limits

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_PHOTO_SIZE_MB` | `5` | Maximum size per photo upload in megabytes. Accepted range: 1–50. |
| `MAX_PHOTOS_PER_BIN` | `1` | Maximum photos per bin. Accepted range: 1–100. The default is 1 — raise this to allow multiple photos per bin. |
| `ATTACHMENTS_ENABLED` | `true` | Enables non-image file attachments (PDFs, spreadsheets, etc.). Set to `false` to hide the Attachments UI and 404 the related endpoints. |
| `BULK_MAX_SELECTION` | `200` | Maximum number of bins that can be operated on in a single bulk action or batch API request. Accepted range: 1–1000. |

---

### AI Provider (server-wide fallback)

When set, all users get AI features without needing to configure their own API keys. Individual users can still override with their own settings in their profile.

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | _(unset)_ | AI provider to use. Accepted values: `openai`, `anthropic`, `gemini`, `openai-compatible`. |
| `AI_API_KEY` | _(unset)_ | API key for the configured provider. |
| `AI_MODEL` | _(unset)_ | Model name to use. Examples: `gpt-5-mini`, `claude-sonnet-4-6`, `gemini-3-flash-preview`. |
| `AI_ENDPOINT_URL` | _(unset)_ | Custom endpoint URL. Required only when `AI_PROVIDER=openai-compatible` (e.g. `http://localhost:11434/v1` for Ollama). |

::: info Supported providers
OpenBin supports OpenAI, Anthropic (Claude), Google Gemini, and any OpenAI-compatible API such as Ollama or LM Studio. Each user can also configure their own key independently via their profile settings.
:::

---

### AI Task Routing

Override the provider, API key, model, and endpoint URL for specific task groups. Any field left unset inherits from the default `AI_*` values above. When any variable is set for a group, that group becomes **env-locked** — users cannot change it in the UI.

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_VISION_PROVIDER` | _(inherit)_ | Override provider for photo analysis. |
| `AI_VISION_API_KEY` | _(inherit)_ | Override API key for photo analysis. |
| `AI_VISION_MODEL` | _(inherit)_ | Override model for photo analysis. |
| `AI_VISION_ENDPOINT_URL` | _(inherit)_ | Override endpoint URL for photo analysis. |
| `AI_QUICK_TEXT_PROVIDER` | _(inherit)_ | Override provider for commands, execute, and text extraction. |
| `AI_QUICK_TEXT_API_KEY` | _(inherit)_ | Override API key for commands, execute, and text extraction. |
| `AI_QUICK_TEXT_MODEL` | _(inherit)_ | Override model for commands, execute, and text extraction. |
| `AI_QUICK_TEXT_ENDPOINT_URL` | _(inherit)_ | Override endpoint URL for commands, execute, and text extraction. |
| `AI_DEEP_TEXT_PROVIDER` | _(inherit)_ | Override provider for queries and reorganization. |
| `AI_DEEP_TEXT_API_KEY` | _(inherit)_ | Override API key for queries and reorganization. |
| `AI_DEEP_TEXT_MODEL` | _(inherit)_ | Override model for queries and reorganization. |
| `AI_DEEP_TEXT_ENDPOINT_URL` | _(inherit)_ | Override endpoint URL for queries and reorganization. |

::: tip
Set only the fields you want to override. For example, to use a different model for photo analysis while keeping the same provider and API key, set only `AI_VISION_MODEL`.
:::

---

### AI Encryption

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_ENCRYPTION_KEY` | _(unset)_ | Encrypts user AI API keys at rest using AES-256-GCM. Generate a key with `openssl rand -base64 32`. If unset, API keys are stored in plaintext. |

::: tip Generating an encryption key
```bash
openssl rand -base64 32
```
Copy the output into your `.env` file as `AI_ENCRYPTION_KEY=<value>`. Do not change this value after users have saved API keys, or the existing keys will become unreadable.
:::

---

### Backups

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKUP_ENABLED` | `false` | Set to `true` to enable automatic database backups. |
| `BACKUP_INTERVAL` | `daily` | Backup schedule. See [Backup Schedule Formats](#backup-schedule-formats) below. |
| `BACKUP_RETENTION` | `7` | Number of backup files to keep. When a new backup is created, the oldest archives beyond this count are deleted. Accepted range: 1–365. |
| `BACKUP_WEBHOOK_URL` | _(unset)_ | Optional URL that receives a POST request on backup failure. Payload: `{ event, error, timestamp }`. |

Backup files are written to a `backups/` directory next to the database (e.g. `/data/backups/` in Docker).

---

### Rate Limiting

| Variable | Default | Description |
|----------|---------|-------------|
| `DISABLE_RATE_LIMIT` | `false` | Set to `true` to disable all rate limiters. Useful in development or automated test environments. Do not disable in production. |
| `AI_RATE_LIMIT_PER_MINUTE` | `15` | Maximum AI requests per user per minute. Accepted range: 1–1000. |
| `AI_RATE_LIMIT_PER_HOUR` | `100` | Maximum AI requests per user per hour. Accepted range: 1–10000. |
| `AI_RATE_LIMIT_PER_DAY` | `200` | Maximum AI requests per user per day. Accepted range: 1–100000. |

---

### Demo

| Variable | Default | Description |
|----------|---------|-------------|
| `DEMO_MODE` | `false` | When `true`, visitors are auto-logged in with pre-populated sample data. The database resets on every container restart. Intended for public demos. |
| `AI_MOCK` | `false` | Returns fake AI responses without calling a real provider. Useful for testing the AI flow without an API key. |

---

### QR Code Payload

Controls what data is encoded in printed QR labels.

| Variable | Default | Description |
|----------|---------|-------------|
| `QR_PAYLOAD_MODE` | `app` | QR encoding mode. `app` — encodes `openbin://bin/CODE` (domain-independent, requires in-app scanner). `url` — encodes `{BASE_URL}/bin/CODE` (works with any phone camera, requires a stable domain). |
| `BASE_URL` | _(unset)_ | The full URL of your OpenBin instance (e.g. `https://inventory.example.com`). Required when `QR_PAYLOAD_MODE=url`. Trailing slashes are stripped automatically. Must start with `http://` or `https://`. |

::: tip Choosing a mode
Use `app` (default) if you don't have a stable domain or want QR labels to survive domain changes. Use `url` if you want anyone to scan labels with their phone camera without installing anything. The in-app scanner recognizes both formats, so labels printed in one mode continue to work after switching.
:::

---

### Advanced

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `info` | Server log verbosity. Accepted values: `debug`, `info`, `warn`, `error`. |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin for API requests. **Set this to your production URL** (e.g. `https://inventory.example.com`) for any non-localhost deployment — otherwise the dev origin leaks into the `Access-Control-Allow-Origin` header in production. |
| `FRAME_ANCESTORS` | _(unset)_ | Comma-separated list of origins allowed to embed OpenBin in an iframe (sets the `frame-ancestors` CSP directive). Leave unset to deny all iframe embedding (the default, which protects against clickjacking). |
| `TRUST_PROXY` | `false` | Set to `true` when running behind a reverse proxy such as Nginx or Caddy. Required for correct IP detection in rate limiting and for the `Secure` cookie flag to work over HTTPS. |

---

## Backup Schedule Formats

The `BACKUP_INTERVAL` variable accepts the following values:

| Value | Behavior |
|-------|----------|
| `hourly` | Runs a backup every hour |
| `daily` | Runs a backup once per day at 2:00 AM |
| `weekly` | Runs a backup once per week on Sunday at 2:00 AM |
| Custom cron expression | Any valid 5-field cron expression |

**Custom cron examples:**

```
0 3 * * *       # Every day at 3:00 AM
0 */6 * * *     # Every 6 hours
0 2 * * 0       # Every Sunday at 2:00 AM
```

::: tip
Use a tool like [crontab.guru](https://crontab.guru/) to build and verify cron expressions.
:::
