---
title: Bins
---

# Bins

::: tip User Guide
For a user-facing walkthrough, see [Bins](/docs/guide/bins).
:::

Bin CRUD, soft delete, restore, permanent deletion, QR lookup, items, tags, pinning, and photo upload.

---

### POST /api/bins

Creates a new bin. The bin's primary key (`id`) is a UUID; a separate **6-character short code** (uppercase letters only — `ABCDEFGHJKMNPQRTUVWXY`) is auto-generated from the name and exposed as `short_code`.

**Auth**: requires location membership (any role except viewer).

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Max 255 characters |
| `locationId` | UUID | Yes | Location to create the bin in |
| `items` | (string \| object)[] | No | Up to 500 initial items. Each element can be a plain string or an object `{ name, quantity? }`. See [Item format](#item-format). |
| `notes` | string | No | Max 10,000 characters |
| `tags` | string[] | No | Up to 50 tags |
| `areaId` | UUID | No | Area to assign the bin to |
| `icon` | string | No | PascalCase Lucide icon name |
| `color` | string | No | Color preset key |
| `cardStyle` | string | No | JSON-encoded card style configuration |
| `visibility` | `"location"` or `"private"` | No | Defaults to `"location"` |
| `customFields` | object | No | Map of custom field ID → string value. Only IDs defined for the location are accepted. |

**Response (201)**: The created `Bin` object.

---

### GET /api/bins

Lists non-deleted bins for a location. Supports search, filtering, sorting, and pagination.

**Query parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `location_id` | UUID | Yes | Location to query |
| `q` | string | No | Full-text search across name, items, notes, tags, ID, and area name. Uses fuzzy matching (Levenshtein distance), so minor typos still return relevant results. |
| `tag` | string | No | Filter by a single exact tag |
| `tags` | string | No | Comma-separated tag names; combined with `tag_mode` |
| `tag_mode` | `"any"` or `"all"` | No | Whether bins must match any or all of the specified tags. Default: `"any"` |
| `area_id` | string | No | Filter by area UUID. Use `__unassigned__` for bins with no area. Superseded by `areas`. |
| `areas` | string | No | Comma-separated area UUIDs. Supports `__unassigned__`. Takes precedence over `area_id`. |
| `colors` | string | No | Comma-separated color keys to filter by |
| `has_items` | `"true"` | No | Only return bins that have at least one item |
| `has_notes` | `"true"` | No | Only return bins with non-empty notes |
| `needs_organizing` | `"true"` | No | Return bins that are missing tags, area assignment, and items |
| `unused_since` | string (`YYYY-MM-DD`) | No | Return bins not used since this date (no scans, edits, or other activity since the date). |
| `sort` | `"name"`, `"created_at"`, `"updated_at"`, `"area"`, `"last_used"` | No | Default: `"updated_at"` |
| `sort_dir` | `"asc"` or `"desc"` | No | Default: `"desc"` |
| `limit` | integer (1–200) | No | Page size. When provided, `count` returns total matching rows. Default: 200 |
| `offset` | integer | No | Rows to skip (used with `limit`). Default: `0` |

**Response (200)**

```json
{
  "results": [ /* Bin objects */ ],
  "count": 150
}
```

---

### GET /api/bins/trash

Returns soft-deleted bins (those with a non-null `deleted_at`). Bins are auto-purged after the location's configured `trash_retention_days` (default 30).

**Query parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `location_id` | UUID | Yes | |

**Response (200)**: `{ results: Bin[], count: number }`

---

### GET /api/bins/lookup/`{shortCode}`

Looks up a bin by its 6-character `short_code` (separate from the UUID `id`). Used by the QR scanner and manual short-code entry. Soft-deleted bins are filtered out (returns 404 instead of 410). Enforces location membership and respects bin visibility.

**Path parameters**: `shortCode` (6 letters)

**Response (200)**: `Bin` object.

---

### GET /api/bins/pinned

Returns the authenticated user's pinned bins in the specified location, ordered by pin position.

**Query parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `location_id` | UUID | Yes | |

**Response (200)**: `{ results: Bin[], count: number }`

---

### PUT /api/bins/pinned/reorder

Reorders the authenticated user's pinned bins.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `bin_ids` | UUID[] | Yes | Bin IDs in the desired pin order |

**Response (200)**: `{ "success": true }`

---

### GET /api/bins/`{id}`

Fetches a single bin by ID.

**Path parameters**: `id` (bin ID / short code)

**Response (200)**: `Bin` object.

**Error responses**

| Status | Code | Description |
|---|---|---|
| 403 | `FORBIDDEN` | You are not a member of the bin's location |
| 404 | `NOT_FOUND` | Bin does not exist |
| 410 | `GONE` | Bin has been soft-deleted (in trash) |

---

### PUT /api/bins/`{id}`

Updates a bin. All fields are optional; only provided fields are changed. Members can update bins they created; admins can update any bin in the location.

**Path parameters**: `id` (bin ID)

**Request body**

| Field | Type | Description |
|---|---|---|
| `name` | string | Max 255 characters |
| `areaId` | UUID or null | Area assignment; null to unassign |
| `items` | (string \| object)[] | Replaces all existing items (up to 500). Accepts strings or `{ name, quantity? }` objects. |
| `notes` | string | Max 10,000 characters |
| `tags` | string[] | Replaces all existing tags (up to 50) |
| `icon` | string | PascalCase Lucide icon name |
| `color` | string | Color preset key |
| `cardStyle` | string | JSON-encoded card style configuration (max 500 characters) |
| `visibility` | `"location"` or `"private"` | |
| `customFields` | object | Map of custom field ID → string value. Replaces existing custom-field values. |

**Response (200)**: Updated `Bin` object.

---

### DELETE /api/bins/`{id}`

Soft-deletes a bin by setting `deleted_at`. The bin moves to trash and can be restored. **Admin-only.**

**Path parameters**: `id` (bin ID)

**Response (200)**: The soft-deleted `Bin` object (with `deleted_at` set).

**Errors**: `403 FORBIDDEN` if the caller is not an admin in the bin's location.

---

### POST /api/bins/`{id}`/pin

Pins a bin for the authenticated user. Idempotent. Maximum 20 pins per user per location.

**Path parameters**: `id` (bin ID)

**Response (200)**: `{ "pinned": true }`

---

### DELETE /api/bins/`{id}`/pin

Unpins a bin for the authenticated user.

**Path parameters**: `id` (bin ID)

**Response (200)**: `{ "pinned": false }`

---

### POST /api/bins/`{id}`/restore

Restores a soft-deleted bin from trash. **Admin-only.**

**Path parameters**: `id` (bin ID)

**Response (200)**: The restored `Bin` object.

---

### POST /api/bins/`{id}`/duplicate

Duplicates a bin, creating a new bin in the same location with the same items, tags, notes, area, and appearance. Photos are not copied. The new bin gets a fresh `id` and `short_code`.

**Auth**: members and above.

**Path parameters**: `id` (source bin ID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | No | Override the new bin's name. Defaults to `"<source name> (copy)"`. |

**Response (201)**: The newly created `Bin` object.

---

### POST /api/bins/`{id}`/move

Moves a bin to a different location. The user must be a member of both locations. The area assignment is cleared because areas are location-scoped.

**Path parameters**: `id` (bin ID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `locationId` | UUID | Yes | Target location ID |

**Response (200)**: Updated `Bin` object in the new location.

---

### POST /api/bins/`{id}`/change-code

Changes a bin's `short_code`. **Admin-only.** If the new code is already in use by another bin in the same location, the request is rejected — the existing bin is **not** deleted. Rate-limited by the `sensitiveAuthLimiter` (10 per 15 minutes per IP).

**Path parameters**: `id` (bin UUID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | New 6-character short code. Letters only (charset `ABCDEFGHJKMNPQRTUVWXY`). |

**Response (200)**: Updated `Bin` object with the new `short_code`.

**Errors**: `403 FORBIDDEN` if not admin, `404 NOT_FOUND` if the bin doesn't exist, `422 VALIDATION_ERROR` if the new code is already in use in the same location or has an invalid format.

---

### DELETE /api/bins/`{id}`/permanent

Permanently deletes a bin and removes its photos from storage. Only works on bins that are already soft-deleted (in trash). **Admin-only.**

**Path parameters**: `id` (bin ID)

**Response (200)**: `{ "message": "Bin permanently deleted" }`

---

### POST /api/bins/`{id}`/photos

Uploads a photo to a bin. Accepts JPEG, PNG, or WebP. Default size limit is 5 MB per file (configurable via `MAX_PHOTO_SIZE_MB`). Uses `multipart/form-data` with a `photo` file field.

**Path parameters**: `id` (bin ID)

**Response (201)**: `{ "id": "uuid" }` — only the new photo's ID is returned. Fetch the full `Photo` object via `GET /api/photos/{id}` (or `GET /api/bins/{id}` to refresh the bin and its photo list) if needed.

---

### PUT /api/bins/`{id}`/add-tags

Adds tags to a bin. Merges new tags with existing ones — does not replace.

**Path parameters**: `id` (bin ID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `tags` | string[] | Yes | Up to 50 tags to add |

**Response (200)**: `{ "id": "uuid", "tags": ["…"] }` — only the bin ID and the merged tag list are returned (slim response, not the full `Bin` object).

---

### POST /api/bins/`{id}`/items

Appends items to a bin's item list.

**Path parameters**: `id` (bin ID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `items` | (string \| object)[] | Yes | Items to add. Each element can be a plain string (`"Screwdriver"`) or an object (`{ "name": "AA Battery", "quantity": 12 }`). |

**Response (201)**

```json
{
  "items": [
    { "id": "uuid", "name": "AA Battery", "quantity": 12 },
    { "id": "uuid", "name": "Flashlight", "quantity": null }
  ]
}
```

Items with no quantity specified return `quantity: null`, meaning quantity is not tracked for that item.

---

### PUT /api/bins/`{id}`/items/`{itemId}`

Renames a single item within a bin and optionally updates its quantity.

**Path parameters**: `id` (bin ID), `itemId` (item UUID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | New item name |
| `quantity` | integer or null | No | New quantity. Pass `null` to clear quantity tracking. Omit to leave unchanged. |

**Response (200)**: Updated `BinItem` object `{ id, name, quantity }`.

---

### PATCH /api/bins/`{id}`/items/`{itemId}`/quantity

Updates only the quantity of a single item. If the new quantity is 0 or negative, the item is removed from the bin.

**Path parameters**: `id` (bin ID), `itemId` (item UUID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `quantity` | integer | Yes | New quantity. 0 or negative removes the item. |

**Response (200)**

```json
{
  "id": "uuid",
  "quantity": 10,
  "removed": false
}
```

When the item is removed (quantity ≤ 0), `removed` is `true`.

---

### DELETE /api/bins/`{id}`/items/`{itemId}`

Removes a single item from a bin.

**Path parameters**: `id` (bin ID), `itemId` (item UUID)

**Response (200)**: `{ "success": true }`

---

## Item Format {#item-format}

Throughout the API, items can be provided as either:

- **String**: `"Screwdriver"` — creates an item with no quantity tracked.
- **Object**: `{ "name": "AA Battery", "quantity": 12 }` — creates an item with a tracked quantity.

When returned, every item includes all three fields:

```json
{ "id": "uuid", "name": "AA Battery", "quantity": 12 }
```

A `quantity` of `null` means the item does not track quantity. Quantity must be a positive integer (minimum 1) when set.

---

### PUT /api/bins/`{id}`/items/reorder

Reorders items within a bin.

**Path parameters**: `id` (bin ID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `item_ids` | UUID[] | Yes | Item IDs in the desired order |

**Response (200)**: Empty body.
