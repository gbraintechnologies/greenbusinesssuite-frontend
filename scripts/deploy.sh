#!/usr/bin/env bash
# Remote deploy for the Green Business Suite frontend.
# Mirrors autobus-web/scripts/deploy.sh: pull, ensure Docker network, build, up.
set -euo pipefail

BRANCH="${DEPLOY_BRANCH:-main}"
BUILD_NO_CACHE="${BUILD_NO_CACHE:-false}"
PULL_IMAGES="${PULL_IMAGES:-true}"
NEEDS_GBS_NET="${NEEDS_GBS_NET:-true}"
HEALTH_RETRIES="${HEALTH_RETRIES:-24}"

if [ -f docker-compose.yaml ]; then
  COMPOSE_FILE="docker-compose.yaml"
elif [ -f docker-compose.yml ]; then
  COMPOSE_FILE="docker-compose.yml"
else
  echo "No docker-compose file found in $(pwd)" >&2
  exit 1
fi

compose() {
  docker compose -f "$COMPOSE_FILE" "$@"
}

ensure_network() {
  local name="$1"
  if ! docker network inspect "$name" >/dev/null 2>&1; then
    docker network create "$name"
    echo "Created network '$name'"
  fi
}

if [ "$NEEDS_GBS_NET" = "true" ]; then
  ensure_network greenbusinesssuite
fi

git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

if [ "$PULL_IMAGES" = "true" ]; then
  compose pull --ignore-buildable 2>/dev/null || true
fi

BUILD_ARGS=()
if [ "$BUILD_NO_CACHE" = "true" ]; then
  BUILD_ARGS+=(--no-cache)
fi

compose build "${BUILD_ARGS[@]}"
compose up -d --remove-orphans
docker image prune -f

echo "Waiting for frontend health..."
for i in $(seq 1 "$HEALTH_RETRIES"); do
  if docker exec gbs_frontend curl -fsS http://localhost:3000 >/dev/null 2>&1; then
    echo "Frontend healthy"
    compose ps
    exit 0
  fi
  sleep 5
done

echo "Frontend failed health check"
compose logs --tail=100 frontend
exit 1
