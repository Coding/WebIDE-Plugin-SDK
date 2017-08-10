#!/usr/bin/env bash
if [ ${PACKAGE_DIR} ]; then
    echo "pluginUrl:"${PACKAGE_DIR}
    echo "pluginDir: node_modules/codingIdePlugin/${PACKAGE_DIR}"
    echo "===remove origin===="    
    if [ -d "node_modules/codingIdePlugin" ]; then
        rm -rf node_modules/codingIdePlugin
    fi
    echo "===git clone====" 
    git clone ${PACKAGE_DIR} node_modules/codingIdePlugin
    echo "===install package dependency===="
    cd node_modules/codingIdePlugin && yarn install
    echo "===start build package===="    
fi
