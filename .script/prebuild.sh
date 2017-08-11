#!/usr/bin/env bash
if [ ${PACKAGE_DIR} ]; then
    cd $PACKAGE_DIR && yarn
fi
