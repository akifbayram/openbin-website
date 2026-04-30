# FAQ

Common questions and troubleshooting for OpenBin.

## General

### What is OpenBin?

OpenBin is an open-source inventory system that uses QR codes, photo recognition, and multi-user collaboration to make physical storage searchable. See [What is OpenBin?](/docs/) for an overview.

### Is OpenBin free?

Yes. OpenBin is open source and free to self-host. [OpenBin Cloud](https://cloud.openbin.app/) is a paid hosted option if you prefer not to manage your own server.

### Where is my data stored?

All data is stored locally in a SQLite database inside the Docker container at `/data`. Mount a volume to persist it across container restarts. No data leaves your network unless you configure an external AI provider.

## Installation

### The container won't start

Check that port 1453 isn't already in use and that the `/data` volume is writable:

```sh
docker logs openbin
```

If the logs show a permission error, ensure the volume mount has correct ownership.

### How do I update to the latest version?

Pull the latest image and recreate the container:

```sh
docker pull ghcr.io/akifbayram/openbin:latest
docker stop openbin && docker rm openbin
docker run -d --name openbin -p 1453:1453 -v openbin_data:/data ghcr.io/akifbayram/openbin:latest
```

Your data is preserved in the `openbin_data` volume.

### Can I run OpenBin behind a reverse proxy?

Yes. OpenBin works behind nginx, Caddy, Traefik, or any reverse proxy. See the [Docker guide](/docs/getting-started/docker) for example configurations.

## QR Codes & Scanning

### The QR scanner isn't working

The scanner requires camera permissions and a secure context (HTTPS or localhost). If you're accessing OpenBin over HTTP on a non-localhost address, your browser will block camera access. Set up HTTPS via a reverse proxy.

### Can I use my own QR scanner app?

Yes, if your QR code mode is set to `url`. In URL mode, QR codes encode a web address that any scanner app can open. In `app` mode (the default), codes use the `openbin://` scheme which only works with OpenBin's built-in scanner.

## AI Features

### AI isn't analyzing my photos

AI is optional and requires configuration. You need to set an AI provider (OpenAI, Anthropic, or Google Gemini) with a valid API key. Check [AI Overview](/docs/guide/ai/) for setup instructions.

### Which AI provider should I use?

All supported providers work well. Choose based on what you already have access to:

- **OpenAI** — `gpt-5-mini` (good balance of speed and accuracy)
- **Anthropic** — `claude-sonnet-4-6` (strong at detailed descriptions)
- **Google Gemini** — `gemini-3-flash-preview` (fast and cost-effective)

### Does AI data leave my network?

Yes — photos are sent to the AI provider's API for analysis. If this is a concern, you can skip AI configuration entirely. Everything else in OpenBin works without it.

## Data & Backup

### How do I back up my data?

Two options:

1. **Copy the SQLite database** — back up the `/data` directory from the container volume
2. **Use the export feature** — Settings → Data → Export as JSON or ZIP (includes photos)

See [Import & Export](/docs/guide/import-export) for details.

### Can I import from a spreadsheet?

Yes. OpenBin supports CSV, TSV, and XLSX imports with column mapping. Imports always create new bins. See [Import & Export](/docs/guide/import-export).

## Account

### How do I delete my account?

In the app: **Settings → Account → Danger Zone → Delete Account**. The dialog walks you through three steps:

1. **Review** — what gets deleted (your sole-member locations, your bins, your photos) and what's preserved (locations shared with others — your bins there stay but lose attribution).
2. **Subscription** (cloud, paid plans only) — choose whether to cancel with no refund, or cancel and refund the unused time. The default refund policy is set by the operator.
3. **Confirm** — type `delete my account` and (if you have a password) enter it.

After confirming, your account is **scheduled for deletion in 30 days**. You stay logged out, your subscription is cancelled, and a confirmation email is sent. After 30 days the account and all owned data are permanently removed.

### I deleted my account by mistake — can I recover it?

Yes, within the 30-day window. Just try to log in. The app will detect the pending deletion and offer to recover the account on the spot — no support ticket needed.

After 30 days the deletion is permanent and cannot be reversed.

### Will I be refunded if I cancel mid-period?

It depends on the policy you chose at deletion time:

- **No refund** (default) — your subscription is cancelled immediately and you keep no access. The current period's payment is forfeited.
- **Prorated refund** — the unused portion of your current billing period is refunded to your original payment method, typically within 5–10 business days.

Self-hosted instances don't have subscriptions, so neither option applies.

### What happens to my locations when I delete?

- **Sole-member locations** (just you) are deleted along with all their bins, items, and photos.
- **Shared locations** (you + others) are preserved — your co-members keep all the data. Your bins inside them stay too, but the "created by" attribution clears to nothing.
- **Locations where you're the sole admin but other members exist** — deletion is blocked. Promote another member to admin first, or remove the other members. The error message lists exactly which locations are affected.

### What happens to my data after deletion?

After the 30-day grace period:

- Your account, refresh tokens, API keys, photos, attachments, sole-member locations and their contents, and any AI/email metadata are permanently deleted.
- Bins/photos in shared locations remain but show no creator.
- Activity log entries you authored remain so other members can see the history.
- Cloud only: your billing customer record is removed and the Stripe subscription is fully cancelled.

If you want a copy of your data before deleting, export it first via **Settings → Data → Export**.

## Still stuck?

- Check the [Configuration Reference](/docs/getting-started/configuration) for all environment variables
- Ask in [Discord](https://discord.gg/W6JPZCqqx9)
- Open an issue on [GitHub](https://github.com/akifbayram/openbin)
