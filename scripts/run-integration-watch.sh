#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh

echo '🟢 - Done - running tests!'

npm run test:watch