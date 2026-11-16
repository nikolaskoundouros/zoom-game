#!/bin/sh
# The one command that proves zoom-game works. Exit 0 = pass, anything else = fail.
# Written or approved by Nick. Agents may run it, never edit it.
cd "$(dirname "$0")" || exit 1
node checks/check_logic.js || exit 1
node checks/check_scene.js || exit 1
echo "verify.sh: all checks passed"
