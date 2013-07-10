#!/bin/bash

DIRECTORY="$(git rev-parse --show-toplevel)"
cd "${DIRECTORY}"

composer install
composer update

cd "${DIRECTORY}/.build"

npm install --no-bin-links
npm update --no-bin-link
