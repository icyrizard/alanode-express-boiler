#!/bin/sh

npm run migrate:deploy || true
pm2-runtime /app/dist/index.js