#!/bin/bash

source $(dirname "$0")/../dev.sh

nohup npm -w site run serve > /dev/null 2>&1 &
pid=$!

while true; do

  npx turbo run --filter site build
  echo 'Press any key to rebuild...'

  read -N 1 key

done

echo
kill $pid