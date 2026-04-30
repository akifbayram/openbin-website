# What is OpenBin?

OpenBin is an open source inventory system where AI handles the cataloging. Photograph your bins and it identifies what's inside, even across multiple containers at once. When your hands are full, dictate items by voice instead. It can also suggest how to reorganize your storage for a better layout. 

## How it works

OpenBin organizes physical storage using a hierarchy:

**Location** → **Area** → **Bin** → **Items**

- A **Location** is a shared workspace (e.g. "Home", "Garage", "Self-Storage"). All data lives inside a location.
- An **Area** is an optional sub-zone within a location (e.g. "Basement", "Bedroom") for grouping bins.
- A **Bin** is a physical container, like a tote, bin, box, drawer, or shelf. Each bin gets a unique QR code and a 6-character short code (e.g. "BINXHM").
- **Items** are the individual things stored inside a bin. 

### Typical workflow

1. [Register and create or join a location](/docs/guide/locations)
2. [Set up areas](/docs/guide/locations) to organize your space (optional)
3. Add your bins and items:
    - [Create bins](/docs/guide/bins) manually and add items yourself, or
    - [Upload photos](/docs/guide/ai/photo-analysis) and let AI detect the objects for you
4. [Print labels](/docs/guide/print-labels) and attach them to your bins
5. [Scan a label](/docs/guide/qr-scanning) to see and update what's inside

## Who it's for

Households organizing garages, closets, and storage units. Small teams tracking supplies across shared spaces. Anyone who wants to self-host their inventory data in a single Docker container.

## Key features

- **QR labels** — print sheets, scan with any phone camera to jump straight to a bin's contents
- **AI photo analysis** — snap a photo and let AI catalog what's inside instead of typing it out
- **Multi-user** — invite household members or teammates so everyone has access
- **Search & filter** — find anything by name, tag, or custom field across all your bins
- **Bulk operations** — move, tag, or update bins in batch
- **Item checkouts** — check items out of bins and return them later, with a log of who took what
- **File attachments** — upload PDFs, spreadsheets, and documents alongside bin photos
- **Bin sharing** — generate a link to share a bin's contents with anyone, no login required
- **Usage tracking** — heatmap of how often each bin is accessed, so you know what's gathering dust
- **Activity log** — admin audit trail of every change and member action across the location
- **Import & export** — CSV, JSON, and spreadsheet support
- **REST API & MCP server** — integrate OpenBin with other tools and AI assistants
- **Self-hosted** — single Docker container with SQLite, no external services required

## Choose your setup

OpenBin runs two ways: self-hosted or cloud.

**Self-host** if you want full control. A single Docker container with SQLite — no external database, no extra services. Runs on a Raspberry Pi, a NAS, or any machine with Docker installed. Requires roughly 200 MB of disk space plus whatever your photos use. You own the data, you pick the backup schedule, you decide when to update.

**Cloud** if you want to skip the setup. Sign up at [cloud.openbin.app](https://cloud.openbin.app/), create a location, and start organizing. A free tier is available with no credit card required. Backups, updates, and AI features are handled for you.

### Your data stays portable

Export your entire inventory as CSV or JSON at any time from the settings page. No lock-in. If you move between self-hosted and cloud, your data comes with you.

## Quick start

```sh
docker run -d -p 1453:1453 -v openbin_data:/data ghcr.io/akifbayram/openbin:latest
```

Open `http://localhost:1453` and create your first location. If you'd rather not self-host, [OpenBin Cloud](https://cloud.openbin.app/) handles hosting for you.

## Next steps

- [Install with Docker](/docs/getting-started/docker) — running in under a minute
- [Create your first bins](/docs/guide/bins) — set up your inventory
- [Print QR labels](/docs/guide/print-labels) — label your physical containers
- [Set up AI](/docs/guide/ai/) — optional photo analysis and smart features
- [API Reference](/docs/api/) — build integrations
