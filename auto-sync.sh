#!/bin/bash

# auto rsync daemon similar to lsyncd
DIRECTORY="$(git rev-parse --show-toplevel)"

if type cygpath &> /dev/null; then
	DIRECTORY="$(cygpath -w "$DIRECTORY")"
fi

if type inotifywait &> /dev/null; then

inotifywait -mrq --format '%e %w %f' \
"$DIRECTORY" \
| \
while read event path file; do
	cd "$DIRECTORY"
	bash .build/sync-files
done

fi
