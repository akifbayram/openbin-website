# API Keys

Long-lived tokens for scripts, automation, and headless API access. API keys are tied to your user account, not to a specific location. A single key works across all locations you belong to.

::: info Plan requirement
On the cloud product, API keys require a **Pro plan**. Self-hosted instances have no such restriction. If the API Keys section shows an upgrade prompt instead of a key list, your account doesn't currently have access.
:::

## Creating a Key

1. Go to **Settings → Account → API Keys**.
2. Click **Create Key**.
3. Enter a descriptive name (e.g. "Home automation script", "Backup script").
4. Click **Create**.
5. **Copy the key immediately** — it is shown only once and cannot be retrieved again.

The key list shows a "Last used" timestamp for each key, refreshed each time the key authenticates a request — useful for spotting unused or compromised keys.

## Key Format

All API keys follow this format:

```
sk_openbin_<random>
```

## Using a Key

Include the key in the `Authorization` header on any API request:

```http
GET /api/bins HTTP/1.1
Host: your-openbin-instance.example.com
Authorization: Bearer sk_openbin_abc123...
```

API keys work with all endpoints that support JWT authentication. The server identifies the request as coming from an API key (not a browser session) and records `auth_method: api_key` in the activity log.

### Example with curl

```bash
curl -H "Authorization: Bearer sk_openbin_abc123..." \
     https://your-openbin-instance.example.com/api/bins
```

### Example with fetch

```js
const res = await fetch('/api/bins', {
  headers: {
    'Authorization': 'Bearer sk_openbin_abc123...'
  }
});
const data = await res.json();
```

## Revoking a Key

1. Go to **Settings → Account → API Keys**.
2. Find the key you want to disable.
3. Click **Revoke**.

Revoked keys stop working immediately. Revocation cannot be undone — if you need access again, create a new key.

## Key vs. JWT Token

| | JWT Token | API Key |
|---|---|---|
| Lifetime | Short-lived (access token) + refresh cycle | Until revoked |
| Use case | Browser sessions | Scripts, automation, integrations |
| Format | `eyJ...` (JWT) | `sk_openbin_...` |
| Created by | Login flow | Settings → API Keys |
| Stored in | HttpOnly cookie | Your environment / secret manager |

::: warning Security Best Practices
- Store API keys in environment variables or a secret manager — never in source code.
- Never commit API keys to version control.
- Use a separate key per application or script so you can revoke one without affecting others.
- Revoke compromised keys immediately.
- API keys are long-lived by design — rotate them periodically for sensitive automations.
:::
