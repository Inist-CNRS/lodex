#!/usr/bin/env bash

echo "mongoCleanup"

cd /app/
/app/node_modules/.bin/babel-node /app/src/common/mongoCleanup.js
