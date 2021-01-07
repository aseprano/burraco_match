#!/usr/bin/env sh
echo "DEBUG_MODE is ${DEBUG_MODE}"
echo "Starting matches process"

if [ "$DEBUG_MODE" == "1" ]; then
    echo "Starting matches in live mode"
    npm run build:live
else
    echo "Starting matches in plain node"
    node build/index.js
fi
