#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
$DIR/db-startup.sh

npx playwright test
