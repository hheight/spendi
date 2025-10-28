#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"

$DIR/db-startup.sh

vitest run --config ./vitest.config.integration.ts
