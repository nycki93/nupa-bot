#!/bin/sh
podman run -it -v $(pwd)/config.json:/usr/src/app/config.json nupa-bot:discord
