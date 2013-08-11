#!/bin/bash

# auto rsync daemon similar to lsyncd
DIRECTORY="$(git rev-parse --show-toplevel)"
CHANGE_DELAY=1
DIRECTORY_SEPARATOR='/'
ARGS="$@"

# if we're in cygwin, clean up for windows inotifywait
if type cygpath &> /dev/null; then
	DIRECTORY="$(cygpath -w "$DIRECTORY")"
	DIRECTORY_SEPARATOR='\\'
fi

DIRMD5=$(echo "$DIRECTORY" | md5sum -t | cut -f1 -d' ')
LOCKFILE="/tmp/autocmd-$DIRMD5"
cd "$DIRECTORY"

function auto-cmd-run() {
	if [[ -e "$LOCKFILE" ]]; then
		return 1
	fi
	touch "$LOCKFILE"
	sleep $CHANGE_DELAY
	${ARGS[@]}
	rm -f "$LOCKFILE"
}

# cleanup from previous process
rm -f "$LOCKFILE"

if type inotifywait &> /dev/null; then

inotifywait -mrq --format '%e %w %f' \
"${DIRECTORY}" \
| \
while read event path file; do
	sleep 0.2
	auto-cmd-run &
done

fi
