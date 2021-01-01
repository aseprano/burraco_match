#!/usr/bin/env sh
echo "DEBUG_MODE is ${DEBUG_MODE}"

if [ "$DEBUG_MODE" == "1" ]; then
    npm run build:live
else
    npm start
fi
