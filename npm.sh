#!/bin/bash

DIRECTORY="$(git rev-parse --show-toplevel)"
cd "${DIRECTORY}/.build"

npm install --no-bin-links
