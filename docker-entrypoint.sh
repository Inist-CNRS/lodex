#!/bin/sh
redis-server &
chown -R daemon:daemon /app /tmp
exec su-exec daemon:daemon $*
