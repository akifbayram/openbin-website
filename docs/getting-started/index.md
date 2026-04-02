# Installation

## Docker (recommended)

```bash
docker run -d -p 1453:1453 -v openbin_data:/data ghcr.io/akifbayram/openbin:latest
```

Open `http://localhost:1453`, register an account, and start adding bins. The database and JWT secret are created automatically on first startup.

To change the port, swap the first `1453` (e.g. `-p 8080:1453`).

See the [Docker page](./docker) for data persistence, backups, restore, updating, and reverse proxy setup.

## Local development

For contributing or running the frontend and server separately, see [Local Development](./local-dev).

## Configuration

All environment variables have safe defaults. See the [Configuration Reference](./configuration) for AI providers, S3 storage, backup schedules, QR code modes, and more.
