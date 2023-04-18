#!/usr/bin/env bash -e

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
# echo '🟡 - Waiting for database to be ready...'
# $DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
echo '🟡 - Running migrations for test...'

npx prisma migrate dev --name test

echo '🟢 - Done - running tests!'

npm run test