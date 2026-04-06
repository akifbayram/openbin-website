---
title: AI
---

# AI

::: tip User Guide
For a user-facing walkthrough, see [AI Features](/docs/guide/ai).
:::

AI provider configuration, photo analysis, text structuring, natural language commands, inventory queries, and server-side command execution.

---

### GET /api/ai/settings

Returns the authenticated user's configured AI provider. The API key is masked in the response. Returns null if no AI has been configured.

**Response (200)**

```json
{
  "id": "uuid",
  "provider": "openai",
  "apiKey": "sk-•••••••••",
  "model": "gpt-5-mini",
  "endpointUrl": null,
  "customPrompt": null,
  "commandPrompt": null,
  "queryPrompt": null,
  "structurePrompt": null,
  "reorganizationPrompt": null,
  "temperature": null,
  "maxTokens": null,
  "topP": null,
  "requestTimeout": null,
  "taskOverrides": {
    "vision": { "provider": "gemini", "model": "gemini-3-flash-preview", "endpointUrl": null, "source": "user" }
  },
  "taskOverridesEnvLocked": [],
  "source": "user",
  "providerConfigs": { /* per-provider cached credentials */ }
}
```

| Field | Type | Description |
|---|---|---|
| `taskOverrides` | object | Per-group overrides. Keys are `vision`, `quickText`, `deepText`. Each value has `provider`, `model`, `endpointUrl`, and `source` (`"user"` or `"env"`). Only groups with an active override are present. |
| `taskOverridesEnvLocked` | string[] | Task groups locked by server environment variables. These groups appear read-only in the UI. |

---

### PUT /api/ai/settings

Saves AI provider configuration. The API key is encrypted at rest when the `AI_ENCRYPTION_KEY` environment variable is set. Rate limited to 30 per hour.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | `"openai"`, `"anthropic"`, `"gemini"`, `"openai-compatible"` | Yes | |
| `apiKey` | string | Yes | Provider API key |
| `model` | string | Yes | Model identifier (e.g. `gpt-5-mini`) |
| `endpointUrl` | string | No | Required when `provider` is `"openai-compatible"` |
| `customPrompt` | string or null | No | Custom system prompt for image analysis. Max 10,000 characters. Use `{available_tags}` placeholder to inject existing tags. |
| `commandPrompt` | string or null | No | Custom system prompt for natural language commands. Max 10,000 characters. |
| `queryPrompt` | string or null | No | Custom system prompt for inventory queries. Max 10,000 characters. |
| `structurePrompt` | string or null | No | Custom system prompt for item extraction from text/voice. Max 10,000 characters. |
| `reorganizationPrompt` | string or null | No | Custom system prompt for reorganization. Max 10,000 characters. |
| `temperature` | number or null | No | Sampling temperature (0.0–2.0). |
| `maxTokens` | number or null | No | Maximum response tokens (100–16,000). |
| `topP` | number or null | No | Nucleus sampling probability (0.0–1.0). |
| `requestTimeout` | number or null | No | Request timeout in seconds (10–300). |

**Response (200)**: Saved `AiSettings` object.

---

### DELETE /api/ai/settings

Removes the authenticated user's AI provider configuration.

**Response (200)**: `{ "message": "AI settings deleted" }`

---

### PUT /api/ai/task-overrides/:taskGroup

Sets or updates the AI provider override for a specific task group. Each group can override the provider, model, and endpoint URL independently. Fields left empty inherit from the user's default AI configuration.

**Path parameters**

| Parameter | Description |
|---|---|
| `taskGroup` | One of `vision`, `quickText`, `deepText` |

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | `"openai"`, `"anthropic"`, `"gemini"`, `"openai-compatible"` | No | Override provider for this group |
| `model` | string | No | Override model for this group |
| `endpointUrl` | string | No | Override endpoint URL for this group |

**Response (200)**

```json
{
  "taskGroup": "vision",
  "provider": "gemini",
  "model": "gemini-3-flash-preview",
  "endpointUrl": null
}
```

**Errors**

| Status | Error | Cause |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Invalid task group or provider |
| 409 | `ENV_LOCKED` | Task group is configured by server environment variables and cannot be changed |

---

### DELETE /api/ai/task-overrides/:taskGroup

Removes the user's override for a specific task group. The group will revert to the user's default AI configuration.

**Path parameters**

| Parameter | Description |
|---|---|
| `taskGroup` | One of `vision`, `quickText`, `deepText` |

**Response (200)**: `{ "deleted": true }`

**Errors**

| Status | Error | Cause |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Invalid task group |
| 409 | `ENV_LOCKED` | Task group is configured by server environment variables and cannot be changed |

---

### POST /api/ai/analyze

Sends one or more stored photos (already uploaded to a bin) to the configured AI provider for analysis. Returns suggested bin name, items, tags, and notes. Maximum 5 photos per request. Rate limited to 30 per hour.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `photoId` | UUID | No | Single photo ID to analyze |
| `photoIds` | UUID[] | No | Multiple photo IDs (max 5). Takes precedence over `photoId`. |

**Response (200)**

```json
{
  "name": "Power Tools",
  "items": [
    { "name": "Cordless drill", "quantity": null },
    { "name": "Drill bits", "quantity": 12 },
    { "name": "Sander", "quantity": null }
  ],
  "tags": ["tools", "electric"],
  "notes": "Stored in the original cases"
}
```

Items are returned as objects with a `name` and optional `quantity`. When the AI can identify a countable quantity (e.g. "12 drill bits"), it includes it; otherwise `quantity` is `null`.

---

### POST /api/ai/analyze-image

Directly uploads images for AI analysis without storing them first. Used during onboarding. Accepts up to 5 images, 5MB each, via `multipart/form-data` with a `photos` file field. Rate limited to 30 per hour.

**Response (200)**: Same `AiSuggestions` shape as `/ai/analyze` (items include quantities when detectable).

---

### POST /api/ai/reanalyze

Re-analyzes stored photos using a previous analysis result as context, allowing the AI to refine its suggestions. Returns the same `AiSuggestions` shape as `/ai/analyze`. Maximum 5 photos per request. Rate limited to 30 per hour.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `photoIds` | UUID[] | Yes | Photo IDs to analyze (max 5) |
| `previousResult` | object | Yes | Previous AI suggestions to refine (see below) |

The `previousResult` object must include:

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Previously suggested bin name |
| `items` | array | Yes | Previously suggested items, each with `name` (string) and optional `quantity` (number) |

**Response (200)**

```json
{
  "name": "Power Tools",
  "items": [
    { "name": "Cordless drill", "quantity": null },
    { "name": "Drill bits", "quantity": 12 },
    { "name": "Orbital sander", "quantity": null }
  ],
  "tags": ["tools", "electric"],
  "notes": "Stored in the original cases. Sander previously misidentified."
}
```

**Errors**

| Status | Error | Cause |
|---|---|---|
| 422 | `VALIDATION_ERROR` | `photoIds` is empty or `previousResult` is missing required fields |
| 404 | `NOT_FOUND` | Photo not found or access denied |

---

### POST /api/ai/test

Validates that AI credentials work by making a test call to the provider.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | string | Yes | Provider name |
| `apiKey` | string | Yes | API key to test |
| `model` | string | Yes | Model to test |
| `endpointUrl` | string | No | Required for `openai-compatible` |

**Response (200)**: `{ "success": true, "message": "Connection successful" }`

---

### POST /api/ai/structure-text

Sends raw dictated or typed text to the AI provider, which extracts and normalizes it into a clean list of inventory items. Handles filler words, quantity normalization, and deduplication. Rate limited to 30 per hour.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | Raw text to structure. Max 5,000 characters. |
| `mode` | `"items"` | No | Structuring mode. Only `"items"` is currently supported. |
| `context.binName` | string | No | Name of the bin for context |
| `context.existingItems` | string[] | No | Items already in the bin (excluded from results) |

**Response (200)**

```json
{
  "items": [
    { "name": "Phillips screwdriver", "quantity": null },
    { "name": "Flat-head screwdriver", "quantity": 2 },
    { "name": "Allen key set", "quantity": null }
  ]
}
```

Items include `quantity` when the AI can extract a count from the dictated text (e.g. "two flat-head screwdrivers").

---

### POST /api/ai/command

Parses a natural language command into structured inventory actions for client-side preview and execution. The client is responsible for displaying the parsed actions to the user before executing them via existing mutation endpoints. Rate limited to 30 per hour.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | Natural language command. Max 5,000 characters. |
| `locationId` | string | Yes | Location ID to scope the command context |

**Response (200)**

```json
{
  "actions": [
    { "type": "add_items", "bin_id": "...", "items": [{ "name": "AAA batteries", "quantity": 4 }] },
    { "type": "add_tags", "bin_id": "...", "tags": ["consumables"] }
  ],
  "interpretation": "Add 4 AAA batteries to the Electronics bin and tag it as consumables"
}
```

Supported action types: `add_items`, `remove_items`, `modify_item`, `create_bin`, `delete_bin`, `add_tags`, `remove_tags`, `modify_tag`, `set_area`, `set_notes`, `set_icon`, `set_color`.

Items in `add_items` and `create_bin` actions may include quantities as `{ name, quantity }` objects.

---

### POST /api/ai/query

Read-only endpoint that answers natural language questions about the inventory. Returns a natural language answer plus structured matches with bin details. Ideal for smart home integrations.

Rate limits: 30/hour for JWT auth; 1,000/hour for API keys.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `question` | string | Yes | Natural language question. Max 5,000 characters. |
| `locationId` | UUID | Yes | Location to search within |

**Response (200)**

```json
{
  "answer": "AAA batteries are in the Electronics bin (Garage area).",
  "matches": [
    {
      "bin_id": "uuid",
      "name": "Electronics",
      "area_name": "Garage",
      "items": ["AAA batteries", "AA batteries"],
      "tags": ["consumables"],
      "relevance": "Contains the item you asked about"
    }
  ]
}
```

---

### POST /api/ai/execute

Headless fire-and-forget endpoint. Parses a natural language command and executes all resulting actions server-side in a single transaction. Unlike `/ai/command` (which returns actions for client-side preview), this endpoint performs the mutations directly. Ideal for smart home integrations and automation pipelines.

Rate limits: 30/hour for JWT auth; 1,000/hour for API keys.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | Natural language command. Max 5,000 characters. |
| `locationId` | UUID | Yes | Location to execute the command in |

**Response (200)**

```json
{
  "executed": [
    {
      "type": "add_items",
      "success": true,
      "details": "Added [AAA batteries] to Electronics",
      "bin_id": "uuid",
      "bin_name": "Electronics"
    }
  ],
  "interpretation": "Added AAA batteries to the Electronics bin",
  "errors": []
}
```
