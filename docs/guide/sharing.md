# Bin Sharing

Create a link to share a bin's contents with anyone — no login required. Useful for sending a packing list or showing someone what's in a storage unit.

::: info Permissions
Only **location admins** can create or revoke share links. Members and viewers do not see the Share option.

Bins with **Private** visibility cannot be shared. Change the bin's visibility to "Location" first, or create the share link from a non-private bin.
:::

## Creating a share link

Open a bin → overflow menu (three dots) → **Share**. Configure two settings before creating the link:

### Visibility

- **Unlisted** — only people who have the link can view the bin. The link is not indexed or discoverable.
- **Public** — the bin is visible to anyone and can be discovered.

### Expiration

Choose when the link stops working:

| Option | Duration |
|---|---|
| Never | Active until manually revoked |
| 1 hour | Expires after 1 hour |
| 24 hours | Expires after 24 hours |
| 7 days | Expires after 7 days |
| 30 days | Expires after 30 days |

Click **Create Share Link** to generate the URL.

## Sharing the link

Once created, the dialog shows the share URL with a copy button. The link follows the format `/s/<token>`. Anyone with this URL can view the bin without logging in.

The dialog also displays:

- The visibility badge (Public or Unlisted)
- A view counter showing how many times the link has been opened
- The expiration date, if one was set

## What the recipient sees

The shared page shows a read-only view of the bin:

- Bin name and area
- Photos (with thumbnails that link to full-size images)
- Items with quantities
- Notes
- Tags
- Custom field values

Recipients cannot edit anything. They do not see other bins, location details, or member information.

## Revoking a share link

Open the same Share dialog and click **Revoke Link**. The link stops working immediately. Anyone who tries to visit it sees a "no longer available" message.

Creating a new share link after revoking generates a fresh URL — the old one cannot be reactivated.

::: info
On [OpenBin Cloud](/cloud), bin sharing may require a paid plan. Self-hosted instances have no restrictions.
:::
