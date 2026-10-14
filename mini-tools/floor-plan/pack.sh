#!/bin/sh
set -eu
cd "$(dirname "$0")"
node build.mjs
node verify.mjs
rm -f ../floor-plan.zip
zip -q -r ../floor-plan.zip index.html assets -x '*.DS_Store' '*.map'
unzip -l ../floor-plan.zip
