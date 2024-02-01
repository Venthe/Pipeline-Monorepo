#!/usr/bin/env bash

# TODO: Email (mailcow?)
# TODO: PGPool
# TODO: Replicated gerrit?
docker compose \
  --env-file=./.env \
  --file=./postgres.docker-compose.yml \
  --file=./rocketchat.docker-compose.yml \
  --file=./nexus.docker-compose.yml \
  --file=./openldap.docker-compose.yml \
  --file=./keycloak.docker-compose.yml \
  --file=./vault.docker-compose.yml \
  --file=./gerrit.docker-compose.yml \
  --file=./kafka.docker-compose.yml \
  up \
  --detach