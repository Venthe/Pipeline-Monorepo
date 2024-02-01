#!/usr/bin/env sh

# Reset
Color_Off='\033[0m'       # Text Reset
Yellow='\033[0;33m'       # Yellow

echo ${VAULT_LOCAL_CONFIG}

function is_running() {
  printf "$(docker-entrypoint.sh status > /dev/null 2>&1 && printf "0" || printf $?)"
}

set -e

echo -e "${Yellow}Starting vault dev server...${Color_Off}"
docker-entrypoint.sh server -dev &
export VAULT_ADDR='http://127.0.0.1:8200'

while [[ "$(is_running)" -ne "0" ]]; do
echo -e "${Yellow}Waiting for vault to start...${Color_Off}"
  docker-entrypoint.sh status
  sleep 2
done

echo -e "${Yellow}Adding secrets...${Color_Off}"
docker-entrypoint.sh login "$VAULT_DEV_ROOT_TOKEN_ID"

cd /secrets
for d in */ ; do
    [ -L "${d%/}" ] && continue
    APPLICATION_NAME="${d%/}"
    cd $d
    echo $APPLICATION_NAME
    ls | xargs -I{} docker-entrypoint.sh kv put "secret/${APPLICATION_NAME}" @{}
    cd -
done

echo -e "${Yellow}Running server...${Color_Off}"
while [[ "$(is_running)" -eq "0" ]]; do
  sleep 5
done
