#!/bin/sh

title=$1
message=$2

which growlnotify && growlnotify -m "$message" "$title"
