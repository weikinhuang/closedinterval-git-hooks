#!/bin/bash

# auto rsync daemon similar to lsyncd
DIRECTORY="$(git rev-parse --show-toplevel)"
CHANGE_DELAY=5

# if we're in cygwin, clean up for windows inotifywait
if type cygpath &> /dev/null; then
	DIRECTORY="$(cygpath -w "$DIRECTORY")"
fi

DIRMD5=$(echo "$DIRECTORY" | md5sum -t | cut -f1 -d' ')
LOCKFILE="/tmp/syncdev-$DIRMD5"
cd "$DIRECTORY"

QUIET=
while getopts "q" option; do
	case "$option" in
		q)
			QUIET=1
			;;
	esac
done

function sync-files() {
	if [[ -e "$LOCKFILE" ]]; then
		return 1
	fi
	touch "$LOCKFILE"
	sleep $CHANGE_DELAY
	if [[ -z $QUIET ]]; then
		bash .build/sync-files
	else
		bash .build/sync-files >/dev/null
	fi
	rm -f "$LOCKFILE"
}

# cleanup from previous process
rm -f "$LOCKFILE"

if type inotifywait &> /dev/null; then

inotifywait -mrq --format '%e %w %f' \
"$DIRECTORY" \
| \
while read event path file; do
	sleep 0.2
	sync-files &
done

fi
