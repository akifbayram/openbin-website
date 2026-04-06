---
title: Tag Colors
---

# Tag Colors

::: tip User Guide
For a user-facing walkthrough, see [Items & Tags](/docs/guide/items-tags).
:::

Per-location color assignments for tags.

---

### GET /api/tag-colors

Lists all tag color assignments for a location.

**Query parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `location_id` | UUID | Yes | |

**Response (200)**

```json
{
  "results": [
    {
      "id": "uuid",
      "location_id": "uuid",
      "tag": "fragile",
      "color": "red-500",
      "parent_tag": null,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "count": 5
}
```

---

### PUT /api/tag-colors

Creates or updates the color for a tag in a location (upsert).

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `locationId` | UUID | Yes | |
| `tag` | string | Yes | Tag name |
| `color` | string | Yes | Color preset key |
| `parentTag` | string \| null | No | Parent tag name. Pass `null` or omit to clear. |

**Hierarchy validation**

The following constraints are enforced and return a `422` error if violated:

- A tag cannot be its own parent.
- A tag that is already a child of another tag cannot be set as a parent (single-level hierarchy only).
- A tag that already has children cannot be assigned a parent.

**Response (200)**: The saved `TagColor` object (includes `parent_tag`).

---

### DELETE /api/tag-colors/`{tag}`

Removes the color assignment for a tag.

**Path parameters**: `tag` (tag name)

**Query parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `location_id` | UUID | Yes | |

**Response (200)**: `{ "message": "Tag color removed" }`
