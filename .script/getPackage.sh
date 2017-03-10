#!/usr/bin/env bash
if [ ${PLUGIN} ]; then
    yarn add codingIdePlugin@${PLUGIN} --force
    ln -fs $(pwd)/node_modules/* node_modules/codingIdePlugin/node_modules
fi
