#!/bin/bash
set -e

APP=/home/sarapriyain/Projects/Velynxia/apps/avatar-studio
DB_PASS='ivmJbGHfBaLDYnZfWl9ILE8usgpJ'

export PGPASSWORD=postgres
if ! psql -h localhost -U postgres -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='avatar_user';" | grep -q 1; then
  psql -h localhost -U postgres -d postgres -c "CREATE ROLE avatar_user LOGIN PASSWORD '$DB_PASS';"
else
  psql -h localhost -U postgres -d postgres -c "ALTER ROLE avatar_user WITH LOGIN PASSWORD '$DB_PASS';"
fi

if ! psql -h localhost -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='avatar_studio';" | grep -q 1; then
  psql -h localhost -U postgres -d postgres -c "CREATE DATABASE avatar_studio OWNER avatar_user;"
fi

export PGPASSWORD="$DB_PASS"
psql -h localhost -U avatar_user -d avatar_studio -tAc "SELECT current_user || ':' || current_database();"

cd "$APP"
pm2 restart avatar-backend --update-env
pm2 restart avatar-frontend --update-env

printf "BACKEND\n"
curl -sS -m 20 http://127.0.0.1:8000/health || true
printf "\nFRONTEND\n"
curl -sS -I -m 20 http://127.0.0.1:3008 | head -n 1 || true
printf "PM2\n"
pm2 ls | grep -E "avatar-backend|avatar-frontend" || true