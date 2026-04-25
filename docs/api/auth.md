---
title: Auth
---

# Auth

::: tip User Guide
For account and profile management, see [Account & Profile](/docs/guide/profile).
:::

Registration, login, profile management, avatar upload, token refresh, and account deletion.

---

### GET /api/auth/status

Returns server configuration flags relevant to the auth UI. No authentication required.

**Response**

```json
{
  "registrationEnabled": true,
  "registrationMode": "open",
  "demoMode": false,
  "qrPayloadMode": "app",
  "selfHosted": true,
  "attachmentsEnabled": true,
  "oauthProviders": []
}
```

| Field | Type | Description |
|---|---|---|
| `registrationEnabled` | boolean | `true` unless mode is `"closed"` (kept for backward compatibility) |
| `registrationMode` | string | One of `"open"`, `"invite"`, or `"closed"` |
| `demoMode` | boolean | Whether demo mode is enabled |
| `qrPayloadMode` | string | QR code encoding mode: `"app"` (openbin:// URI) or `"url"` (full web URL) |
| `selfHosted` | boolean | `true` on self-hosted instances, `false` on the cloud product |
| `attachmentsEnabled` | boolean | Whether the attachments feature is enabled on the server |
| `oauthProviders` | array | List of enabled OAuth providers (e.g. `["google", "apple"]`) |
| `baseUrl` | string? | Present only when `qrPayloadMode` is `"url"`. The base URL used in QR payloads. |
| `announcement` | object? | Present when the server has an active announcement banner (`{ id, text, type, dismissible }`). |
| `maintenance` | object? | Present when the server is in maintenance mode (`{ enabled: true, message }`). |

---

### POST /api/auth/demo-login

Logs in as the demo user. Only works when `DEMO_MODE=true` — otherwise returns 403. Sets auth cookies and returns the user plus the active location.

**Response (200)**: `{ "user": { ... }, "activeLocationId": "uuid-or-null" }`

---

### GET /api/auth/invite-preview

Looks up a location by invite code. **Authentication required** (prevents anonymous enumeration of invite codes). Rate-limited by the `joinLimiter` (10 requests per 15 minutes per IP).

**Query parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | The invite code to look up |

**Response (200)**

```json
{
  "name": "My Workshop",
  "memberCount": 5
}
```

**Error responses**

| Status | Code | Description |
|---|---|---|
| 401 | `UNAUTHORIZED` | No valid session — log in first |
| 404 | `NOT_FOUND` | Invalid invite code |
| 422 | `VALIDATION_ERROR` | Missing or empty `code` parameter |

---

### POST /api/auth/register

Creates a new user account. Rate-limited by the `registerLimiter` (3 per hour per IP). Returns 403 if registration is disabled via `REGISTRATION_MODE=closed`. When `REGISTRATION_MODE=invite`, `inviteCode` is required.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string (email) | Yes | Used for login and password recovery |
| `password` | string | Yes | Min 8 characters; must contain uppercase, lowercase, and a digit |
| `displayName` | string | Yes | 1–100 characters |
| `inviteCode` | string | Conditional | Required when `REGISTRATION_MODE=invite`. Optional otherwise — when present, the new user is auto-added to the matching location. |

**Response (201)**

```json
{
  "user": {
    "id": "uuid",
    "displayName": "Alice",
    "email": "alice@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

Auth happens entirely via `openbin-access` and `openbin-refresh` httpOnly cookies — the JWT is **not** returned in the response body.

---

### POST /api/auth/login

Authenticates with email and password. Rate-limited by the `authLimiter` (5 per 15 minutes per IP).

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string (email) | Yes | |
| `password` | string | Yes | |

**Response (200)**

```json
{
  "user": {
    "id": "uuid",
    "displayName": "Alice",
    "email": "alice@example.com",
    "avatarUrl": null
  },
  "activeLocationId": "uuid-or-null"
}
```

Sets `openbin-access` and `openbin-refresh` httpOnly cookies.

---

### POST /api/auth/refresh

Rotates the refresh token. Reads the `openbin-refresh` httpOnly cookie, validates and revokes the old token, and issues a new access + refresh token pair as cookies. No Authorization header required (the access token may be expired).

::: warning Replay protection
If a previously-revoked refresh token is presented, the entire token family is revoked and all sessions for the user are terminated.
:::

**Response (200)**: `{ "message": "Token refreshed" }` with new cookies set.

---

### POST /api/auth/logout

Revokes the current refresh token from the `openbin-refresh` cookie and clears auth cookies. No authentication required.

**Response (200)**: `{ "message": "Logged out" }`

---

### POST /api/auth/logout-all

Revokes all refresh tokens for the authenticated user, logging out every device simultaneously.

**Response (200)**: `{ "message": "All sessions logged out" }`

---

### GET /api/auth/me

Returns the authenticated user's profile plus the persisted active location selection.

**Response (200)**

```json
{
  "id": "uuid",
  "displayName": "Alice",
  "email": "alice@example.com",
  "avatarUrl": null,
  "activeLocationId": "uuid-or-null",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "hasPassword": true,
  "isAdmin": false,
  "plan": "free",
  "subscriptionStatus": "inactive"
}
```

---

### PUT /api/auth/active-location

Persists the user's active location selection. The location is validated for membership.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `locationId` | string (UUID) or null | Yes | Location to set as active, or null to clear |

**Response (200)**: `{ "activeLocationId": "uuid-or-null" }`

---

### PUT /api/auth/profile

Updates the authenticated user's display name and/or email.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `displayName` | string | No | Max 100 characters |
| `email` | string (email) | No | |

**Response (200)**: Updated `User` object.

---

### PUT /api/auth/password

Changes the authenticated user's password. Rate-limited by the `sensitiveAuthLimiter` (10 per 15 minutes per IP).

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `currentPassword` | string | Yes | |
| `newPassword` | string | Yes | Min 8 characters; must contain uppercase, lowercase, and a digit |

**Response (200)**: `{ "message": "Password updated successfully" }`

---

### POST /api/auth/forgot-password

Initiates a password reset. Sends a reset email if the address corresponds to a known user. The response is the same regardless of whether the email exists — no account enumeration.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string (email) | Yes | |

**Response (200)**: `{ "message": "If the email exists, a reset link has been sent" }`

---

### POST /api/auth/reset-password

Completes a password reset using a token from the reset email.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | Yes | The one-time token from the reset email |
| `newPassword` | string | Yes | Min 8 characters; must contain uppercase, lowercase, and a digit |

**Response (200)**: `{ "message": "Password reset successfully" }`

---

### POST /api/auth/avatar

Uploads an avatar image. Accepts JPEG, PNG, or WebP up to 2MB. Uses `multipart/form-data` with a `avatar` file field.

**Response (200)**: `{ "avatarUrl": "/api/auth/avatar/<userId>" }`

---

### DELETE /api/auth/avatar

Removes the authenticated user's avatar.

**Response (200)**: `{ "message": "Avatar removed" }`

---

### GET /api/auth/avatar/`{userId}`

Serves an avatar image file. Returns the binary image with appropriate content-type.

**Path parameters**

| Parameter | Type | Description |
|---|---|---|
| `userId` | UUID | |

**Response (200)**: Binary image (`image/*`).

---

### DELETE /api/auth/account

Permanently deletes the authenticated user's account. Requires password confirmation **unless** the account is OAuth-only (`hasPassword: false`). Cascades to sole-owned locations (and their bins, photos, tag colors). Shared locations are preserved.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `password` | string | Conditional | Required when `hasPassword: true`. Omit for OAuth-only accounts. |

**Response (200)**: `{ "message": "Account deleted" }`

---

## OAuth

OAuth providers are configured server-side. The list of enabled providers is available from `GET /api/auth/status` (`oauthProviders` field).

### GET /api/auth/oauth/`{provider}`

Initiates an OAuth flow. Redirects the browser to the provider's authorization page. `provider` is one of `google` or `apple`.

### GET /api/auth/oauth/`{provider}`/callback (Google)

Handles the OAuth redirect from the provider, completes the token exchange, creates or links the user, and sets auth cookies. For Google this is `GET`. For Apple this is `POST` (Apple POSTs the result back to the registered redirect URL).

### POST /api/auth/oauth/apple/callback

Apple-specific callback (`form_post` response mode). Same effect as the Google callback above.

### GET /api/auth/oauth/links

**Authenticated.** Returns the OAuth providers linked to the current account.

**Response (200)**

```json
{
  "links": [
    { "provider": "google", "linkedAt": "2024-01-01T00:00:00Z" }
  ]
}
```

### DELETE /api/auth/oauth/link/`{provider}`

**Authenticated.** Disconnects an OAuth provider from the current account. Returns 422 if the provider is the user's only sign-in method (set a password first).

**Response (200)**: `{ "message": "Provider unlinked" }`
