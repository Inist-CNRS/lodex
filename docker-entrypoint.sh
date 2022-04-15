#!/bin/sh
redis-server &
# wait $! no working on ezmaster so use sleep
sleep 1
redis-cli FLUSHALL
find /app/src/app/custom ! -user daemon -exec chown daemon:daemon {} \; &
find /tmp ! -user daemon -exec chown daemon:daemon {} \; &
exec su-exec daemon:daemon $*
