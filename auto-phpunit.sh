#!/bin/bash

# auto rsync daemon similar to lsyncd
DIRECTORY="$(git rev-parse --show-toplevel)"
CHANGE_DELAY=5
DIRECTORY_SEPARATOR='/'
ARGS="$@"

# if we're in cygwin, clean up for windows inotifywait
if type cygpath &> /dev/null; then
	DIRECTORY="$(cygpath -w "$DIRECTORY")"
	DIRECTORY_SEPARATOR='\\'
fi

DIRMD5=$(echo "$DIRECTORY" | md5sum -t | cut -f1 -d' ')
LOCKFILE="/tmp/phpunitdev-$DIRMD5"
cd "$DIRECTORY"

function phpunit-files() {
	if [[ -e "$LOCKFILE" ]]; then
		return 1
	fi
	touch "$LOCKFILE"
	sleep $CHANGE_DELAY
	clear
	bash vendor/bin/phpunit $ARGS
	rm -f "$LOCKFILE"
}

# cleanup from previous process
rm -f "$LOCKFILE"

if type inotifywait &> /dev/null; then

inotifywait -mrq --format '%e %w %f' \
"${DIRECTORY}${DIRECTORY_SEPARATOR}classes" \
| \
while read event path file; do
	sleep 0.2
	phpunit-files &
done

fi
