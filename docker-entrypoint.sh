#!/bin/sh
set -e

echo "==> Waiting for database and running Prisma migrations..."
until npx prisma migrate deploy; do
  echo "Prisma migration waiting for DB connection, retrying in 3 seconds..."
  sleep 3
done

echo "==> Migrations applied successfully!"
echo "==> Starting application..."
exec "$@"
