#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh

docker compose up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh localhost:5433 -t 30 -- echo '🟢 - Database is ready!'

npx prisma migrate dev --name init
