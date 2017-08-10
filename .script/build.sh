#!/usr/bin/env bash
if [ ${PACKAGE_DIR} ]; then
    echo ${PACKAGE_DIR}
    VERSION=$(git describe --always --tags)
    echo current version $VERSION
    cd node_modules/codingSDK/ 
    yarn run clean
    VERSION=$VERSION yarn run build
    VERSION=$VERSION yarn run generateManifest
    echo "update dist link to plugin"
    unlink ${PACKAGE_DIR}/dist
    ln -s $(pwd)/dist ${PACKAGE_DIR}/dist
    echo "end"
fi
