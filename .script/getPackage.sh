#!/usr/bin/env bash
if [ ${PLUGIN} ]; then
    echo "pluginUrl:"${PLUGIN}
    if [ -d "node_modules/codingIdePlugin" ]; 
        then
        echo "===git status===="
        git -C node_modules/codingIdePlugin status
        echo "===git reset===="  
        git reset --hard              
        echo "===git pull===="
        git -C node_modules/codingIdePlugin pull
        else
        echo "===git clone===="
        git clone ${PLUGIN} node_modules/codingIdePlugin
    fi
    echo "===install package dependency===="
    cd node_modules/codingIdePlugin && yarn install
    echo "===start build package===="    
fi
