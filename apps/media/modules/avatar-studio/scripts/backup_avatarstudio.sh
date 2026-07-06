#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ROOT="${BACKUP_ROOT:-/srv/velynxia/avatarstudio/storage/backups}"
STORAGE_ROOT="${STORAGE_ROOT:-/srv/velynxia/avatarstudio/storage}"
DB_NAME="${PGDATABASE:-avatar_studio}"
DB_USER="${PGUSER:-avatar_user}"

mkdir -p "$BACKUP_ROOT/$TIMESTAMP"

pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_ROOT/$TIMESTAMP/database.sql"

tar -czf "$BACKUP_ROOT/$TIMESTAMP/projects.tgz" -C "$STORAGE_ROOT" projects || true
tar -czf "$BACKUP_ROOT/$TIMESTAMP/training.tgz" -C "$STORAGE_ROOT" training || true
tar -czf "$BACKUP_ROOT/$TIMESTAMP/avatars.tgz" -C "$STORAGE_ROOT" avatars || true
tar -czf "$BACKUP_ROOT/$TIMESTAMP/voices.tgz" -C "$STORAGE_ROOT" voices || true
tar -czf "$BACKUP_ROOT/$TIMESTAMP/uploads.tgz" -C "$STORAGE_ROOT" uploads || true
tar -czf "$BACKUP_ROOT/$TIMESTAMP/renders.tgz" -C "$STORAGE_ROOT" renders || true
tar -czf "$BACKUP_ROOT/$TIMESTAMP/exports.tgz" -C "$STORAGE_ROOT" exports || true

echo "Backup completed at $BACKUP_ROOT/$TIMESTAMP"
