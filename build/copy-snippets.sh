#!/bin/bash

DIR=server/dist/modes/mpx/mpxSnippets

if [ -d "$DIR" ]; then
  rm -r "$DIR"
fi

cp -r server/src/modes/mpx/mpxSnippets server/dist/modes/mpx/mpxSnippets