#!/bin/sh
set -e
cd "$(dirname "$0")"
zip -r ../dudu-scanner.zip . -x '*.DS_Store' -x 'pack.sh'
echo "packed $(cd .. && pwd)/dudu-scanner.zip"
unzip -l ../dudu-scanner.zip | head
