#!/bin/sh
test ! -d /tmp/upload && mkdir -p /tmp/upload
chown -R daemon:daemon /app /tmp
exec su-exec daemon:daemon $*
