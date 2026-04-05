# What is OpenBin?

OpenBin is an open source inventory system that turns physical storage into something searchable. Stick a QR label on a bin, snap a photo of the contents, and AI catalogs everything inside. When you need to find something later, search instead of digging through boxes.

## How it works

OpenBin organizes physical storage using a hierarchy:

**Location** → **Area** → **Bin** → **Items**

- A **Location** is a shared workspace (e.g. "Home", "Workshop"). All data lives inside a location.
- An **Area** is an optional sub-zone within a location (e.g. "Garage", "Closet") for grouping bins.
- A **Bin** is a physical container, like a box, drawer, or shelf. Each bin gets a unique QR code.
- **Items** are the individual things stored inside a bin.

### Typical workflow

1. [Register and create or join a location](/docs/guide/locations)
2. [Create bins](/docs/guide/bins) for your physical containers
3. [Print QR labels](/docs/guide/print-labels) and attach them to your bins
4. [Scan a label](/docs/guide/qr-scanning) to see what's inside

## Who it's for

Households organizing garages, closets, and storage units. Small teams tracking tools or supplies across shared spaces. Anyone who wants to self-host their inventory data in a single Docker container.

## Key features

- **QR labels** — print sheets, scan with any phone camera to jump straight to a bin's contents
- **AI photo analysis** — snap a photo and let AI catalog what's inside instead of typing it out
- **Multi-user** — invite household members or teammates so everyone has access
- **Search & filter** — find anything by name, tag, or custom field across all your bins
- **Bulk operations** — move, tag, or update bins in batch
- **Import & export** — CSV, JSON, and spreadsheet support
- **REST API & MCP server** — integrate OpenBin with other tools and AI assistants
- **Self-hosted** — single Docker container with SQLite, no external services required

## Quick start

```sh
docker run -d -p 1453:1453 -v openbin_data:/data ghcr.io/akifbayram/openbin:latest
```

Open `http://localhost:1453` and create your first location. If you'd rather not self-host, [OpenBin Cloud](https://cloud.openbin.app/) handles hosting for you.

## Next steps

- [Install with Docker](/docs/getting-started/docker) — running in under a minute
- [Create your first bins](/docs/guide/bins) — set up your inventory
- [Print QR labels](/docs/guide/print-labels) — label your physical containers
- [Set up AI](/docs/guide/ai) — optional photo analysis and smart features
- [API Reference](/docs/api/) — build integrations
