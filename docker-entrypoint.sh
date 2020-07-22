#!/bin/sh
chown -R daemon:daemon /app /tmp
exec su-exec daemon:daemon $*
