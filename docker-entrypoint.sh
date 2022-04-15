#!/bin/sh
redis-server &
wait $!
redis-cli FLUSHALL
find /app/src/app/custom ! -user daemon -exec chown daemon:daemon {} \; &
find /tmp ! -user daemon -exec chown daemon:daemon {} \; &
exec su-exec daemon:daemon $*
