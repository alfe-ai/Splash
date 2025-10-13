#!/usr/bin/env bash
set -euo pipefail

DOMAIN=${1:-alfe.sh}
CERT_DIR=${CERT_DIR:-/etc/letsencrypt/live/$DOMAIN}
KEY_PATH=${KEY_PATH:-$CERT_DIR/privkey.pem}
CERT_PATH=${CERT_PATH:-$CERT_DIR/fullchain.pem}
CA_PATH=${CA_PATH:-}
HOST=${HOST:-0.0.0.0}
HTTP_PORT=${HTTP_PORT:-80}
HTTPS_PORT=${HTTPS_PORT:-443}

if [[ ! -f "$KEY_PATH" ]]; then
  echo "Error: could not find TLS key at '$KEY_PATH'." >&2
  exit 1
fi

if [[ ! -f "$CERT_PATH" ]]; then
  echo "Error: could not find TLS certificate at '$CERT_PATH'." >&2
  exit 1
fi

export HOST
export HTTP_PORT
export HTTPS_PORT
export HTTPS_KEY_PATH="$KEY_PATH"
export HTTPS_CERT_PATH="$CERT_PATH"

if [[ -n "$CA_PATH" ]]; then
  if [[ ! -f "$CA_PATH" ]]; then
    echo "Error: CA bundle '$CA_PATH' was provided but does not exist." >&2
    exit 1
  fi
  export HTTPS_CA_PATH="$CA_PATH"
fi

exec node server.js
