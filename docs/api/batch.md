---
title: Batch
---

# Batch

::: tip User Guide
For bulk UI operations, see [Bulk Operations](/docs/guide/bulk-operations).
:::

Execute up to 50 bin operations atomically in a single request.

---

### POST /api/batch

Executes multiple bin operations in a single request. Operations run sequentially and are **best-effort** — failures of individual operations are reported in the `errors` array while remaining successful operations are committed. The endpoint is **not transactional**: there is no global rollback if a later operation fails.

Use it for AI agents, MCP integrations, and bulk UI flows where you want one network round-trip and per-op result reporting.

Rate limits: 60/hour for JWT auth; 600/hour for API keys.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `locationId` | UUID | Yes | Location to execute operations in |
| `operations` | array | Yes | 1–50 operation objects (cap is the global `BULK_MAX_SELECTION`, default 50, configurable up to 1000) |

**Operation object fields**

| Field | Type | Applicable to | Description |
|---|---|---|---|
| `type` | string | All | Operation type (see below) |
| `bin_id` | UUID | All except `create_bin`, `rename_area`, `delete_area`, `set_tag_color` | Target bin ID |
| `bin_name` | string | All except `create_bin` | Bin name (for logging) |
| `name` | string | `create_bin`, `update_bin` | Bin name |
| `items` | (string \| object)[] | `add_items`, `remove_items`, `create_bin` | Item names or `{ name, quantity? }` objects. Quantity is supported for `add_items` and `create_bin`. |
| `item` | string | `set_item_quantity` | Item name to update. |
| `quantity` | integer or null | `set_item_quantity` | New quantity. `null` clears tracking; 0 or negative removes the item. |
| `tags` | string[] | `add_tags`, `remove_tags`, `create_bin`, `update_bin` | Tag names |
| `notes` | string | `set_notes`, `create_bin`, `update_bin` | Notes text |
| `mode` | `"set"`, `"append"`, `"clear"` | `set_notes` | Notes update mode |
| `area_id` | UUID or null | `set_area` | Area UUID; null to unassign |
| `area_name` | string | `set_area`, `create_bin`, `update_bin`, `rename_area`, `delete_area` | Area name; auto-creates if needed (for `set_area`/`create_bin`/`update_bin`) |
| `icon` | string | `set_icon`, `create_bin`, `update_bin` | Icon identifier |
| `color` | string | `set_color`, `create_bin`, `update_bin` | Color value |
| `card_style` | string | `create_bin`, `update_bin` | JSON-encoded card style configuration. |
| `custom_fields` | object | `create_bin`, `update_bin` | Map of custom field ID → string value. |
| `old_item` | string | `modify_item` | Current item name to rename |
| `new_item` | string | `modify_item` | New item name |
| `old_tag` | string | `modify_tag` | Current tag name to rename |
| `new_tag` | string | `modify_tag`, `set_tag_color` | New tag name (or tag whose color is being set) |
| `tag` | string | `set_tag_color` | The tag whose color is being set. |
| `tag_color` | string | `set_tag_color` | The color preset key to assign. |
| `parent_tag` | string \| null | `set_tag_color` | Optional parent tag for nested categories. |
| `item_ids` | UUID[] | `reorder_items` | Item UUIDs in the desired order. |
| `return_bin_id` | UUID | `return_item` | Optional override — return the item to a different bin than the origin. |
| `visibility` | `"location"` or `"private"` | `update_bin`, `create_bin` | Bin visibility |

**Supported operation types**

- **Bin lifecycle:** `create_bin`, `update_bin`, `delete_bin`, `restore_bin`, `duplicate_bin`
- **Items:** `add_items`, `remove_items`, `modify_item`, `set_item_quantity`, `reorder_items`
- **Tags:** `add_tags`, `remove_tags`, `modify_tag`, `set_tag_color`
- **Properties:** `set_area`, `set_notes`, `set_icon`, `set_color`
- **Pinning:** `pin_bin`, `unpin_bin`
- **Areas:** `rename_area`, `delete_area`
- **Checkouts:** `checkout_item`, `return_item`

**Example request**

```json
{
  "locationId": "550e8400-e29b-41d4-a716-446655440000",
  "operations": [
    {
      "type": "add_tags",
      "bin_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "bin_name": "Tools",
      "tags": ["fragile"]
    },
    {
      "type": "set_area",
      "bin_id": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      "bin_name": "Supplies",
      "area_name": "Garage"
    },
    {
      "type": "create_bin",
      "name": "New Bin",
      "items": [{ "name": "AA Battery", "quantity": 24 }, "Flashlight"],
      "tags": ["new"]
    }
  ]
}
```

**Response (200)**

```json
{
  "results": [
    {
      "type": "add_tags",
      "success": true,
      "details": "Added tags [fragile] to Tools",
      "bin_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "bin_name": "Tools"
    },
    {
      "type": "set_area",
      "success": true,
      "details": "Set area of Supplies to \"Garage\"",
      "bin_id": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      "bin_name": "Supplies"
    },
    {
      "type": "create_bin",
      "success": true,
      "details": "Created bin \"New Bin\"",
      "bin_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "bin_name": "New Bin"
    }
  ],
  "errors": []
}
```
