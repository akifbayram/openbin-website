# Docker Quick Start

## Prerequisites

- Docker installed

## Quick start

```bash
docker run -d \
  --name openbin \
  -p 1453:1453 \
  -e PHOTO_STORAGE_PATH=/data/photos \
  -e DATABASE_PATH=/data/openbin.db \
  -v openbin_data:/data \
  ghcr.io/akifbayram/openbin:latest
```

Open `http://localhost:1453` in your browser, register an account, and start adding bins. The database and JWT secret are created automatically on first startup.

::: warning Photos and database paths
You **must** set `PHOTO_STORAGE_PATH=/data/photos` and `DATABASE_PATH=/data/openbin.db` so that photos and the database are written to the mounted volume. Without these, photos default to `./uploads` inside the container and are lost on restart. The bundled Docker Compose file sets these for you.
:::

::: tip Production: set `JWT_SECRET` explicitly
By default, OpenBin generates a JWT signing secret and persists it to `/data/.jwt_secret`. If that file is ever lost, every existing session is invalidated. For production, set `JWT_SECRET` to a long random string in your `.env` file (or `-e JWT_SECRET=…` for `docker run`) and include it in your off-host backup strategy. See [Configuration → Security](./configuration#security).
:::

### Using Docker Compose

If you prefer Docker Compose, clone the repo and run:

```bash
git clone https://github.com/akifbayram/openbin.git
cd openbin
docker compose up -d
```

The bundled `docker-compose.yml` sets `PHOTO_STORAGE_PATH`, `DATABASE_PATH`, and the data volume for you.

## Data Persistence

All data is stored in a Docker volume mounted at `/data` inside the container:

| Path inside container | Contents |
|-----------------------|----------|
| `/data/openbin.db` | SQLite database (all bins, locations, users) |
| `/data/photos/` | Uploaded bin and avatar photos |
| `/data/backups/` | Automatic backups (if enabled) |
| `/data/.jwt_secret` | Auto-generated JWT signing secret |

The volume name depends on how you launched the container: `openbin_data` for the `docker run` example above, and `<project>_api_data` (typically `openbin_api_data`) for Docker Compose. Run `docker volume ls` to confirm. Data persists across container restarts and updates.

::: tip Volume ownership (Linux hosts)
The container runs as the `node` user (uid 1000). If you bind-mount a host directory instead of using a named volume, it must be owned by `1000:1000` or the container will exit on startup with `EACCES`. Named volumes (the default) are managed by Docker and don't need this.
:::

::: warning Backing up your data
To back up manually, copy the contents of the Docker volume or enable the built-in backup feature (see [Configuration](./configuration)). At minimum, preserve the `openbin.db` file — it contains everything except photos.
:::

## Changing the port

With `docker run`, swap the first port number: `-p 8080:1453`.

With Docker Compose, set `HOST_PORT` in your `.env` file (e.g. `HOST_PORT=8080`) and restart the container. See [Configuration](./configuration) for all options.

## Updating

Pull the latest image and restart:

```bash
# docker run
docker pull ghcr.io/akifbayram/openbin:latest
docker stop openbin && docker rm openbin
docker run -d \
  --name openbin \
  -p 1453:1453 \
  -e PHOTO_STORAGE_PATH=/data/photos \
  -e DATABASE_PATH=/data/openbin.db \
  -v openbin_data:/data \
  ghcr.io/akifbayram/openbin:latest

# Docker Compose
docker compose pull
docker compose up -d
```

The database and all data on the volume are preserved.

## Backup

### Manual backup

Copy the Docker volume data to a safe location. The database file is the critical piece:

```bash
docker cp openbin:/data/openbin.db ./openbin-backup.db
```

### Automatic backups

Enable the built-in backup feature by setting environment variables in your `.env` file:

```bash
BACKUP_ENABLED=true
BACKUP_INTERVAL=daily
BACKUP_RETENTION=7
```

Backup files are written to `/data/backups/` inside the container (the `api_data` volume). See [Configuration](./configuration) for the full backup reference.

### What's in a backup archive

Each automatic backup is a ZIP file named `backup-YYYY-MM-DDTHHMMSS.zip` containing:

| Path in ZIP | Description |
|-------------|-------------|
| `openbin.db` | Full SQLite database snapshot (SQLite installs only) |
| `openbin.sql` | PostgreSQL dump produced by `pg_dump` (PostgreSQL installs only) |
| `photos/` | All uploaded photos and generated thumbnails, organized by bin ID |

The archive contains either `openbin.db` or `openbin.sql` depending on the database engine in use. Cross-engine restore is not supported — a SQLite backup cannot be restored into a PostgreSQL instance and vice versa.

::: info JWT secret not included
The JWT signing secret (`.jwt_secret`) is **not** included in backup archives. See [Restoring the JWT secret](#restoring-the-jwt-secret) below.
:::

## Restore

### Quick restore (Docker)

1. **Stop the container** to prevent writes during restore:

   ```bash
   docker compose down
   ```

2. **Find the backup** on the Docker volume. If you kept backups on the default volume:

   ```bash
   # List available backups
   docker run --rm -v openbin_api_data:/data alpine ls /data/backups/
   ```

   If you copied backups off-host, use your local copy.

3. **Extract the database and photos** into the data volume, replacing existing files:

   ```bash
   # Extract from backup into a temp directory
   mkdir -p /tmp/openbin-restore
   unzip backup-2026-03-15T020000.zip -d /tmp/openbin-restore

   # Copy into the Docker volume
   docker run --rm \
     -v openbin_api_data:/data \
     -v /tmp/openbin-restore:/restore \
     alpine sh -c "cp /restore/openbin.db /data/openbin.db && \
                    rm -rf /data/photos && \
                    cp -r /restore/photos /data/photos && \
                    chown -R 1000:1000 /data"
   ```

   ::: tip Volume name
   The volume name is typically `openbin_api_data` or `qrcode_api_data` depending on your project directory name. Run `docker volume ls` to find the correct name.
   :::

4. **Start the container**:

   ```bash
   docker compose up -d
   ```

5. **Verify** by logging in and checking your bins, photos, and user accounts.

### Restoring the JWT secret

The `.jwt_secret` file lives at `/data/.jwt_secret` and is **not included** in backup archives. This secret signs all JWT tokens — if it changes, every user session is invalidated and users must log in again.

**If you still have the original volume** (e.g. you're restoring just the database), the `.jwt_secret` file is already in place. No action needed.

**If the volume was lost**, you have two options:

| Scenario | What to do |
|----------|------------|
| You set `JWT_SECRET` in `.env` | Nothing — the env var takes precedence over the file. Sessions survive as long as the env var stays the same. |
| You relied on the auto-generated secret | The secret is gone. OpenBin will generate a new one on next startup. All existing sessions become invalid — users will need to log in again. No data is lost. |

::: tip Recommendation
For production deployments, set `JWT_SECRET` explicitly in your `.env` file and include your `.env` file in your off-host backup strategy. This ensures sessions survive even a full volume loss.
:::

### Restoring without Docker

If you run OpenBin directly (no container), extract the backup and place the files where your environment variables point:

```bash
# Stop the server process first
unzip backup-2026-03-15T020000.zip -d /tmp/openbin-restore

# Copy database (default: ./data/openbin.db)
cp /tmp/openbin-restore/openbin.db ./data/openbin.db

# Copy photos (default: ./uploads)
rm -rf ./uploads
cp -r /tmp/openbin-restore/photos ./uploads
```

Then start the server. Check `DATABASE_PATH` and `PHOTO_STORAGE_PATH` in your `.env` if you use non-default paths.

### Verifying a restore

After starting OpenBin on restored data:

1. **Log in** — if login fails, the JWT secret changed (see above). Users can log in again with their existing passwords.
2. **Check bins** — open a bin and confirm items, tags, and notes are present.
3. **Check photos** — open a bin with photos and verify they load. Thumbnails are regenerated automatically if missing.
4. **Check user accounts** — all registered users and their roles should be intact (stored in the database).

## Running Behind a Reverse Proxy

If you place OpenBin behind Nginx, Caddy, or another reverse proxy, set `TRUST_PROXY=true` in your `.env` file so that rate limiting and secure cookie handling work correctly:

```bash
TRUST_PROXY=true
```

See your reverse proxy's documentation for configuration with OpenBin.
