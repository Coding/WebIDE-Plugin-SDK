#!/usr/bin/env bash
if [ ${PLUGIN} ]; then
    echo "pluginUrl:"${PLUGIN}
    if [ -d "node_modules/codingIdePlugin" ]; then
        rm -rf node_modules/codingIdePlugin
    fi
    git clone ${PLUGIN} node_modules/codingIdePlugin
    cd node_modules/codingIdePlugin && yarn install
    # ln -fs $(pwd)/node_modules/* node_modules/codingIdePlugin/node_modules
fi
