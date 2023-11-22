#!/bin/sh
redis-server &
# wait $! no working on ezmaster so use sleep
sleep 1
# redis-cli FLUSHALL || Disabling this command to avoid flushing the redis database
find /app/src/app/custom ! -user daemon -exec chown daemon:daemon {} \; &
find /tmp ! -user daemon -exec chown daemon:daemon {} \; &
exec su-exec daemon:daemon $*
