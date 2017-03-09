#!/usr/bin/env bash
set -eo pipefail
if [ ${PLUGIN} ]; then
    yarn add codingIdePlugin@${PLUGIN} --force
    ln -s $(pwd)/node_modules/* node_modules/codingIdePlugin/node_modules
fi