---
title: AI
---

# AI

::: tip User Guide
For a user-facing walkthrough, see [AI Overview](/docs/guide/ai/).
:::

AI provider configuration, photo analysis, transcription, the AI assistant, inventory queries, and bulk reorganization. All inference endpoints stream via Server-Sent Events.

::: warning Streaming and CSRF
- Inference endpoints stream over Server-Sent Events (`Content-Type: text/event-stream`). Use a streaming HTTP client; do not buffer the response. See [Streaming protocol](#streaming-protocol) below.
- Cookie-authenticated requests must include the CSRF token (`X-CSRF-Token` header matching the `openbin-csrf` cookie). API-key (`Bearer sk_openbin_…`) requests are exempt.
:::

---

## Settings

### GET /api/ai/settings

Returns the authenticated user's configured AI provider. The API key is masked. Returns `null` if no AI has been configured.

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
  "tagSuggestionPrompt": null,
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
| `source` | `"user"` or `"env"` | When `"env"`, the credentials come from server environment variables and the form is read-only in the UI. |

---

### PUT /api/ai/settings

Saves AI provider configuration. The API key is encrypted at rest when `AI_ENCRYPTION_KEY` is set.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | `"openai"`, `"anthropic"`, `"gemini"`, `"openai-compatible"` | Yes | |
| `apiKey` | string | Yes | Provider API key |
| `model` | string | Yes | Model identifier (e.g. `gpt-5-mini`) |
| `endpointUrl` | string | No | Required when `provider` is `"openai-compatible"` |
| `customPrompt` | string or null | No | Custom prompt for photo analysis. Max 10,000 characters. Use `{available_tags}` to inject existing tags. |
| `commandPrompt` | string or null | No | Custom prompt for the AI assistant (commands). Max 10,000 characters. |
| `queryPrompt` | string or null | No | Custom prompt for inventory queries. Max 10,000 characters. |
| `structurePrompt` | string or null | No | Custom prompt for structuring dictated/pasted text into items. Max 10,000 characters. |
| `reorganizationPrompt` | string or null | No | Custom prompt for bulk reorganization. Max 10,000 characters. |
| `tagSuggestionPrompt` | string or null | No | Custom prompt for AI tag suggestions. Max 10,000 characters. |
| `temperature` | number or null | No | Sampling temperature (0.0–2.0). |
| `maxTokens` | number or null | No | Maximum response tokens (100–16,000). |
| `topP` | number or null | No | Nucleus sampling probability (0.0–1.0). |
| `requestTimeout` | number or null | No | Request timeout in seconds (10–300). |

**Response (200)**: Saved `AiSettings` object.

---

### DELETE /api/ai/settings

Removes the authenticated user's AI provider configuration.

**Response (200)**: `{ "deleted": true }`

---

### PUT /api/ai/task-overrides/`{taskGroup}`

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

### DELETE /api/ai/task-overrides/`{taskGroup}`

Removes the user's override for a specific task group.

**Response (200)**: `{ "deleted": true }`

---

### POST /api/ai/test

Validates that AI credentials work by making a small test call to the provider.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | string | Yes | Provider name |
| `apiKey` | string | Yes | API key to test |
| `model` | string | Yes | Model to test |
| `endpointUrl` | string | No | Required for `openai-compatible` |

**Response (200)**: `{ "success": true, "message": "Connection successful" }`

---

### GET /api/ai/default-prompts

Returns the built-in default prompts for each task group, so the UI can show the user what they would inherit when leaving a custom prompt blank. **Public — no authentication required.**

**Response (200)**: `{ analysis: string, command: string, query: string, structure: string, reorganization: string, tagSuggestion: string }`

---

## Streaming protocol

All inference endpoints (everything ending in `/stream`) write Server-Sent Events. Each event is a JSON payload on a single `data:` line; the stream ends when the server closes the connection.

| Event `type` | Payload | Meaning |
|---|---|---|
| `delta` | `{ type, text }` | A chunk of incremental text. Concatenate `text` across deltas. |
| `done` | `{ type, text }` | Final accumulated text. The stream then closes. |
| `error` | `{ type, message }` | Provider or server error. The stream closes. |
| `retry` | `{ type, attempt }` | Provider transient error; the server is retrying. |

For endpoints that return JSON (photo analysis, queries, reorganization), the concatenated text is the JSON document — parse it on `done` (or progressively, if your client supports it).

The client may abort by closing the request; the server cancels the upstream provider call.

::: info AI credits and plan gating
- All AI endpoints check the user's plan and remaining credits via `requireAiAccess` + `checkAiCredits(weight)`. Credits are debited per request and refunded automatically when a stream errors before producing a result.
- Flat per-unit cost: quick-text endpoints (`ask`, `command`, `query`, `structure-text`, `correct`) cost **1 credit**, vision endpoints (`analyze-image`, `analyze`, `reanalyze`, `reanalyze-image`) cost **5 × imageCount** credits, and reorganize endpoints (`reorganize`, `reorganize-tags`) cost **2 × binCount** credits. See [Task Routing → Cloud AI credits](/docs/guide/ai/task-routing#cloud-ai-credits) for headline budgets.
- Photo analysis and reorganize endpoints additionally require the Plus or higher plan on the cloud product.
- Self-hosted instances are not credit-limited.
:::

::: info SSRF guard
Provider calls go through DNS-pinning to prevent access to private network ranges. Self-hosted mode relaxes this so local endpoints (e.g. Ollama on `http://localhost:11434/v1`) work. Demo users cannot configure custom endpoints.
:::

### Conversation history

The unified ask, query, and command endpoints accept an optional `history` array of prior turns to maintain context. The server trims history to the most recent 10 turns before sending it to the model.

```json
{
  "history": [
    { "role": "user", "content": "Where are the holiday decorations?" },
    { "role": "assistant", "content": "In the Holiday Decorations bin in the Garage." }
  ]
}
```

---

## Inference endpoints

### POST /api/ai/ask/stream

Unified entrypoint for the AI assistant. The server classifies the user's message as a **command** (mutation intent) or **query** (read-only question) and streams the appropriate response.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | The user's message. Max 5,000 characters. |
| `locationId` | UUID | Yes | Location to scope the request to. |
| `binIds` | UUID[] | No | If provided, scopes the model's context to just these bins. |
| `history` | array | No | Prior conversation turns (capped at 10 server-side). |

**Stream**: emits a parsed-action plan for commands, or a query response for reads. The `done` event contains the final structured payload. See `/command/stream` and `/query/stream` for the per-mode shapes.

---

### POST /api/ai/command/stream

Parses an AI-assistant instruction into structured inventory actions for client-side preview and confirmation. The client executes the actions via existing mutation endpoints (or batches them via `POST /api/batch`).

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | AI assistant instruction. Max 5,000 characters. |
| `locationId` | UUID | Yes | Location ID to scope the command context. |
| `history` | array | No | Prior conversation turns. |

**Stream payload** (final `done` text is JSON):

```json
{
  "actions": [
    { "type": "add_items", "bin_id": "...", "items": [{ "name": "AAA batteries", "quantity": 4 }] },
    { "type": "add_tags", "bin_id": "...", "tags": ["consumables"] }
  ],
  "interpretation": "Add 4 AAA batteries to the Electronics bin and tag it as consumables"
}
```

Supported action types: `add_items`, `remove_items`, `modify_item`, `create_bin`, `delete_bin`, `add_tags`, `remove_tags`, `modify_tag`, `set_area`, `set_notes`, `set_icon`, `set_color`. Items in `add_items` / `create_bin` may include `{ name, quantity }`.

---

### POST /api/ai/query/stream

Read-only endpoint that answers natural-language questions about the inventory.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `question` | string | Yes | Natural-language question. Max 5,000 characters. |
| `locationId` | UUID | Yes | Location to search within. |
| `history` | array | No | Prior conversation turns. |

**Stream payload** (final `done` text is JSON):

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

### POST /api/ai/structure-text/stream

Sends raw dictated or typed text to the AI provider, which extracts and normalizes it into a clean list of inventory items. Handles filler words, quantity normalization, and deduplication.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | Raw text to structure. Max 5,000 characters. |
| `mode` | `"items"` | No | Structuring mode (only `"items"` currently). |
| `context.binName` | string | No | Bin name context. |
| `context.existingItems` | string[] | No | Items already in the bin (excluded from results). |

**Stream payload** (final `done` text is JSON):

```json
{
  "items": [
    { "name": "Phillips screwdriver", "quantity": null },
    { "name": "Flat-head screwdriver", "quantity": 2 },
    { "name": "Allen key set", "quantity": null }
  ]
}
```

There is also a **non-streaming** variant at `POST /api/ai/structure-text` (same input/output shape) for clients that don't want SSE.

---

### POST /api/ai/analyze/stream

Analyzes one or more **stored** photos (already uploaded to a bin) and streams a suggested bin name, items list, and custom-field values. Plus plan or higher.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `photoId` | UUID | No | Single photo ID. |
| `photoIds` | UUID[] | No | Multiple photo IDs (max 5). Takes precedence over `photoId`. |
| `locationId` | UUID | No | Location ID — used to inject custom-field definitions and existing tags into the prompt. |

**Stream payload** (final `done` text is JSON, the `AiSuggestions` shape):

```json
{
  "name": "Power Tools",
  "items": [
    { "name": "Cordless drill", "quantity": null },
    { "name": "Drill bits", "quantity": 12 }
  ],
  "customFields": {
    "Purchase Date": "2023-05-12"
  }
}
```

::: info Tags and notes are not AI-generated
Photo analysis returns only `name`, `items`, and (optionally) `customFields`. Tags and notes are user-provided.
:::

---

### POST /api/ai/analyze-image/stream

Same as `/analyze/stream` but accepts uploaded image files directly via `multipart/form-data` (`photos` field, up to 5 files). Used during onboarding and bulk-add when the photo isn't yet attached to a bin. Plus plan or higher.

---

### POST /api/ai/reanalyze/stream

Re-analyzes stored photos using a previous result as context, allowing the AI to refine its suggestions. Plus plan or higher.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `photoIds` | UUID[] | Yes | Photo IDs to analyze (max 5). |
| `previousResult` | object | Yes | Previous AI suggestions (`{ name, items, customFields? }`). |
| `instruction` | string | No | Optional free-form correction (e.g. "the green tool is a sander, not a drill"). |
| `locationId` | UUID | No | |

**Stream payload**: same `AiSuggestions` shape as `/analyze/stream`.

---

### POST /api/ai/reanalyze-image/stream

Same as `/reanalyze/stream` but accepts uploaded image files directly via `multipart/form-data`. Plus plan or higher.

---

### POST /api/ai/correct/stream

Refines a previous analysis result using a free-form text correction (no images). Useful when the photo was right but the AI's suggestions need a tweak.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `previousResult` | object | Yes | Previous suggestions to refine. |
| `instruction` | string | Yes | Correction instructions. Max 5,000 characters. |
| `locationId` | UUID | No | |

**Stream payload**: same `AiSuggestions` shape.

---

### POST /api/ai/reorganize/stream

Streams a bulk reorganization plan: bin renames, area moves, tag additions, and (optionally) new areas, sized to the user's selection. Plus plan or higher.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `locationId` | UUID | Yes | |
| `binIds` | UUID[] | No | Restrict to specific bins. Defaults to the entire location. Capped per plan (Plus: 10 / Pro: 40 / self-hosted: unlimited). |
| `instruction` | string | No | Free-form intent (e.g. "group by room"). |

**Stream payload**: incremental partial JSON (parse with a tolerant parser to render progress) ending in a `done` event with the full plan.

---

### POST /api/ai/reorganize-tags/stream

Suggests tag additions/renames across bins. Plus plan or higher.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `locationId` | UUID | Yes | |
| `binIds` | UUID[] | No | Restrict to specific bins. |
| `instruction` | string | No | Free-form guidance for the tag scheme. |

**Stream payload**: streaming JSON of proposed tag changes per bin.

---

### POST /api/ai/transcribe

Transcribes a single uploaded audio clip to text using the configured `quickText` provider. Used by the voice-input UI on mobile.

**Request**: `multipart/form-data` with an `audio` file field (max 25 MB).

**Response (200)**: `{ "text": "transcribed text" }`
