#!/usr/bin/env bash
set -euo pipefail

prototype_dir="$(cd "$(dirname "$0")" && pwd)"
python3 -m http.server 4173 --bind 0.0.0.0 --directory "$prototype_dir"
