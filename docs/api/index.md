---
title: API Overview
---

# API Overview

OpenBin exposes a REST API under `/api`. The full OpenAPI 3.0 spec is at
[`server/openapi.yaml`](https://github.com/akifbayram/openbin/blob/main/server/openapi.yaml) in the repository.

## Base URL

| Environment | URL |
|---|---|
| Docker (default) | `http://localhost:1453/api` |
| Local development | `http://localhost:1453/api` |
| Production | `https://your-domain.com/api` |

## Authentication

Three authentication methods are supported. Use the one that fits your use case.

### 1. httpOnly Cookies (browser sessions)

This is the primary authentication method used by the OpenBin web app. On a successful login or registration, the server sets two httpOnly cookies:

- `openbin-access` — short-lived JWT access token (15-minute expiry)
- `openbin-refresh` — long-lived refresh token (7-day expiry)

Browsers automatically include these cookies on every same-origin request. Cross-origin requests must include `credentials: 'include'`. The refresh token is rotated automatically via `POST /api/auth/refresh`. If a revoked refresh token is replayed, the entire token family is invalidated as a security measure.

### 2. API Key

Long-lived API keys (format: `sk_openbin_<random>`) can be created via `POST /api/api-keys` and used in the standard Authorization header:

```http
Authorization: Bearer sk_openbin_...
```

API keys are per-user, not per-location. A single key works across all locations the user belongs to. They are intended for automation, scripts, and integrations such as smart home systems. They never expire unless explicitly revoked. See the [API Keys guide](/docs/guide/api-keys) for details on creating and managing keys.

API-key requests are exempt from CSRF (see below) and from interactive limiters; AI and batch endpoints have a separate, higher rate-limit bucket for API-key auth.

::: warning Cookie auth requires CSRF
For cookie-authenticated **mutating** requests (`POST`, `PUT`, `PATCH`, `DELETE`), the server enforces a double-submit CSRF token: every such request must include an `X-CSRF-Token` header whose value matches the `openbin-csrf` cookie. The web app's `apiFetch()` helper handles this automatically; integrators using cookies must read the cookie and echo it in the header. Bearer (`sk_openbin_…`) requests are exempt.

Mismatched or missing tokens return `403 CSRF_INVALID`.
:::

## Response Envelopes

### List responses

All list endpoints return a consistent envelope:

```json
{
  "results": [...],
  "count": 42
}
```

When pagination is used (i.e., a `limit` query parameter is provided), `count` reflects the **total number of matching rows** across all pages. Without pagination, `count` equals `results.length`.

### Error responses

All errors use a consistent envelope with a machine-readable code and a human-readable message:

```json
{
  "error": "NOT_FOUND",
  "message": "Bin not found"
}
```

| Error Code | HTTP Status | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Authentication required (no valid session, JWT, or API key) |
| `VALIDATION_ERROR` | 422 | Request body or parameters failed validation |
| `NOT_FOUND` | 404 | The requested resource does not exist |
| `FORBIDDEN` | 403 | Authenticated, but insufficient permissions for this resource |
| `CSRF_INVALID` | 403 | Mutating request from a cookie session is missing or has a mismatched `X-CSRF-Token` |
| `GONE` | 410 | Resource has been deleted |
| `CONFLICT` | 409 | Resource already exists (e.g. duplicate area name in same parent) |
| `RATE_LIMITED` | 429 | Too many requests — back off and retry |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Rate Limiting

Rate limiting is applied to sensitive endpoints to prevent abuse:

- **Registration** (`POST /auth/register`) — `registerLimiter`: 3 attempts per hour per IP.
- **Login** (`POST /auth/login`) — `authLimiter`: 5 attempts per 15 minutes per IP.
- **Sensitive auth** (password change, change-code, etc.) — `sensitiveAuthLimiter`: 10 attempts per 15 minutes per IP.
- **Join location and invite preview** (`POST /locations/join`, `GET /auth/invite-preview`) — `joinLimiter`: 10 attempts per 15 minutes per IP.
- **General API** — `apiLimiter`: 600 requests per minute per IP (covers everything not in another bucket, including refresh).
- **AI endpoints** — `aiRateLimiters`: configurable per-minute / per-hour / per-day caps via `AI_RATE_LIMIT_PER_MINUTE/_HOUR/_DAY` (defaults 15 / 100 / 200 per user).
- **Batch operations**: 60/hour for JWT; 600/hour for API keys.

::: tip Development
Set the `DISABLE_RATE_LIMIT=true` environment variable to disable all rate limiters during local development and testing.
:::

## API Groups

| Group | Description |
|---|---|
| **[Auth](/docs/api/auth)** | Registration, login, logout, profile management, avatar, token refresh, account deletion |
| **[Locations](/docs/api/locations)** | Location CRUD, membership management, and invite codes |
| **[Areas](/docs/api/areas)** | Named zones within a location for organizing bins |
| **[Bins](/docs/api/bins)** | Bin CRUD, soft deletes, restore, QR lookup, items, tags, pinning, and photo upload |
| **[Custom Fields](/docs/api/custom-fields)** | Location-scoped custom field definitions for bins |
| **[Photos](/docs/api/photos)** | Photo retrieval (file and thumbnail) and deletion |
| **[Tag Colors](/docs/api/tag-colors)** | Per-location color assignments for tags |
| **[Print Settings](/docs/api/print-settings)** | Per-user label format and custom print dimension settings |
| **[Export](/docs/api/export)** | Export location data as JSON, ZIP, or CSV; import V1/V2 format data |
| **[AI](/docs/api/ai)** | AI provider configuration, photo analysis, AI assistant, and inventory queries |
| **[Activity](/docs/api/activity)** | Paginated location activity log |
| **[API Keys](/docs/api/api-keys)** | API key creation, listing, and revocation for headless access |
| **[User Preferences](/docs/api/preferences)** | Arbitrary per-user application preference storage |
| **[Saved Views](/docs/api/saved-views)** | Per-user saved bin list filter and sort views |
| **[Scan History](/docs/api/scan-history)** | Per-user QR code scan history |
| **[Batch Operations](/docs/api/batch)** | Execute up to 50 bin operations in a single request (best-effort, not transactional) |
| **Shopping List** | `GET/POST /api/locations/{id}/shopping-list`, `POST /api/bins/{id}/shopping-list`, `POST /api/shopping-list/{id}/purchase`, `DELETE /api/shopping-list/{id}` — per-location shopping list driven by checkouts |

::: tip Getting Started with the API
To use the API programmatically, create an API key in the OpenBin UI. See the [API Keys guide](/docs/guide/api-keys) for setup instructions.
:::
