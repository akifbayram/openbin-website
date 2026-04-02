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

## What you can do with it

Print QR label sheets and scan them with any phone camera to jump to a bin's contents. Take a photo of a bin and let AI describe what's inside instead of typing it out. Invite household members or teammates so everyone has access.

Organize bins by location and area. Search across everything by name, tag, or custom field. Move, tag, or update bins in bulk. Import from spreadsheets, export as CSV or JSON. There's also a REST API and an MCP server if you want to hook OpenBin into other tools.

## Self-hosted, no cloud required

OpenBin runs as a single Docker container with a SQLite database. No external services, no data leaving your network. Pull the image and you're running in under a minute.

If you'd rather not self-host, [OpenBin Cloud](https://cloud.openbin.app/) handles hosting for you.

## Get started

- [Installation](/docs/getting-started/) — set up OpenBin with Docker or from source
- [API Reference](/docs/api/) — integrate OpenBin with your own tools
