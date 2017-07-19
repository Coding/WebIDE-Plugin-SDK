#!/usr/bin/env bash
if [ ${PLUGIN} ]; then
    echo "pluginUrl:"${PLUGIN}
    echo "===remove origin===="    
    if [ -d "node_modules/codingIdePlugin" ]; then
        rm -rf node_modules/codingIdePlugin
    fi
    echo "===git clone====" 
    git clone ${PLUGIN} node_modules/codingIdePlugin
    echo "===install package dependency===="
    cd node_modules/codingIdePlugin && yarn install
    echo "===start build package===="    
fi
