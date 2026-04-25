---
title: Export
---

# Export

::: tip User Guide
For a user-facing walkthrough, see [Import & Export](/docs/guide/import-export).
:::

Export location data as JSON, ZIP, or CSV; import V1/V2 format data.

---

### GET /api/locations/`{id}`/export

Exports the entire location as a V2 JSON document, **streamed** to the response (the server uses `res.write()` to avoid buffering very large exports in memory). Photos are base64-encoded and embedded within each bin's `photos` array.

**Filename**: `openbin-export-<locationId>.json`

**Limits** (enforced server-side):

| Limit | Value |
|---|---|
| Max bins per export (active + trashed) | 5,000 |
| Max total photos per export | 1,000 |
| Max photos per bin | 50 |

Beyond the bin/photo cap the request returns `422 VALIDATION_ERROR`. Use search filters or split the export into multiple location-scoped runs.

**Path parameters**: `id` (location UUID)

**Response (200)**

```json
{
  "version": 2,
  "exportedAt": "2024-01-01T00:00:00Z",
  "locationName": "My Workshop",
  "locationSettings": {
    "activityRetentionDays": 90,
    "trashRetentionDays": 30,
    "appName": "OpenBin",
    "termBin": "",
    "termLocation": "",
    "termArea": "",
    "defaultJoinRole": "member"
  },
  "bins": [
    {
      "id": "uuid",
      "shortCode": "BINXHM",
      "name": "Screws",
      "items": [
        { "name": "M3x8", "quantity": 50 },
        { "name": "M4x10", "quantity": 25 }
      ],
      "notes": "Sorted by size",
      "tags": ["hardware"],
      "icon": "Wrench",
      "color": "blue-500",
      "createdAt": "...",
      "updatedAt": "...",
      "photos": [
        {
          "id": "uuid",
          "filename": "photo.jpg",
          "mimeType": "image/jpeg",
          "data": "<base64>"
        }
      ]
    }
  ],
  "trashedBins": [ /* same shape as bins, only present when location has trash */ ],
  "areas": [{ "path": "Garage / Workbench" }],
  "tagColors": [{ "tag": "hardware", "color": "blue-500" }],
  "customFieldDefinitions": [{ "name": "Purchase Date", "position": 0 }],
  "pinnedBins": [{ "userId": "uuid", "binId": "uuid", "position": 0 }],
  "savedViews": [{ "userId": "uuid", "name": "Garage hardware", "searchQuery": "screws", "sort": "name", "filters": "{}" }],
  "members": [{ "userId": "uuid", "email": "alice@…", "role": "admin", "joinedAt": "…" }]
}
```

---

### GET /api/locations/`{id}`/export/zip

Exports the location as a ZIP file. The archive contains:

| Entry | Contents |
|---|---|
| `manifest.json` | `{ format: "openbin-zip", exportedAt, locationName, locationSettings, areas, customFieldDefinitions, tagColors, pinnedBins, savedViews, members, binCount, trashedBinCount }` |
| `bins.json` | Array of all active bins (without photo blobs) |
| `trashed-bins.json` | Soft-deleted bins (only present when there are any) |
| `photos/` | Original photo files in their native format, organized by bin ID |

**Filename**: `openbin-export-YYYY-MM-DD.zip`

**Path parameters**: `id` (location UUID)

**Response (200)**: Binary ZIP file (`application/zip`) as a download. Same export caps as the JSON endpoint.

---

### GET /api/locations/`{id}`/export/csv

Exports the location as a CSV spreadsheet with **one row per item**. Columns:

| Column | Description |
|---|---|
| `Bin Name` | The bin's name |
| `Area` | Full hierarchical area path (e.g. `Garage / Workbench`) |
| `Item` | Item name. Empty when the bin has no items (one row per bin still emitted). |
| `Quantity` | Item quantity. Empty when no quantity is tracked. |
| `Tags` | Semicolon-separated list of tags |

**Filename**: `openbin-inventory-YYYY-MM-DD.csv`

**Path parameters**: `id` (location UUID)

**Response (200)**: CSV text (`text/csv; charset=utf-8`) as a download.

---

### POST /api/locations/`{id}`/import

Imports bins and photos from a V1 or V2 export document. Supports `merge` (add to existing) and `replace` (clear all bins first) modes. Creates areas from path strings on import. **JSON body limit: 50 MB.** For larger archives, use the ZIP endpoint.

**Path parameters**: `id` (location UUID)

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | `1` or `2` | Yes | Export format version |
| `bins` | array | Yes | Bin objects matching the format version |
| `exportedAt` | string (date-time) | No | |
| `locationName` | string | No | |
| `photos` | array | No | Photo objects |
| `mode` | `"merge"` or `"replace"` | No | Default: `"merge"` |
| `dryRun` | boolean | No | When `true`, returns a preview of what would be imported without creating anything. See [Dry-Run Preview](#dry-run-preview). |

**Response (200)**

```json
{
  "imported": 42,
  "photos": 15
}
```

---

### POST /api/locations/`{id}`/import/csv

Imports bins from a CSV file upload. Uses `multipart/form-data` with a `file` field. The CSV must have columns matching the export format (`Bin Name`, `Area`, `Item`, `Quantity`, `Tags`). Multiple rows with the same bin name and area are grouped into a single bin. **File size limit: 10 MB.**

**Path parameters**: `id` (location UUID)

**Form fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | CSV file |
| `mode` | `"merge"` or `"replace"` | No | Default: `"merge"` |
| `dryRun` | `"true"` or `true` | No | When set, returns a preview without importing. See [Dry-Run Preview](#dry-run-preview). |

**Response (200)**: `{ "imported": number }`

---

### POST /api/locations/`{id}`/import/zip

Imports bins and photos from a ZIP backup file. The ZIP must contain `manifest.json` (with `"format": "openbin-zip"`), a `bins.json` file, an optional `trashed-bins.json`, and an optional `photos/` directory. Uses `multipart/form-data` with a `file` field. **File size limit: 25 MB.**

**Path parameters**: `id` (location UUID)

**Form fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | ZIP file |
| `mode` | `"merge"` or `"replace"` | No | Default: `"merge"` |
| `dryRun` | `"true"` or `true` | No | When set, returns a preview without importing. See [Dry-Run Preview](#dry-run-preview). |

**Response (200)**: `{ "imported": number, "photos": number }`

---

## Dry-Run Preview {#dry-run-preview}

All three import endpoints (JSON, CSV, and ZIP) support a dry-run mode. When you set `dryRun` to `true`, the server validates the input and returns a summary of what would happen without actually creating any bins or photos.

**Dry-run response (200)**

```json
{
  "preview": true,
  "toCreate": [
    { "name": "Screws", "itemCount": 3, "tags": ["hardware"] }
  ],
  "toSkip": [
    { "name": "Bolts", "reason": "already exists" }
  ],
  "totalBins": 2,
  "totalItems": 5
}
```

| Field | Type | Description |
|---|---|---|
| `preview` | `true` | Always `true` in a dry-run response |
| `toCreate` | array | Bins that would be created, with name, item count, and tags |
| `toSkip` | array | Bins that would be skipped (e.g. duplicates in merge mode), with the reason |
| `totalBins` | number | Total number of bins in the import payload |
| `totalItems` | number | Total number of items across all bins |

In `merge` mode, bins whose IDs already exist in the database are skipped. In `replace` mode, all bins are treated as new creates.
