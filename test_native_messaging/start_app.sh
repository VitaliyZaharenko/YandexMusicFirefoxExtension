#!/bin/bash

DATE=`date '+%Y-%m-%d-%H_%M_%S'`
#mkdir -p logs

LOGFILE="logs/$DATE.log"

echo $0 >> "$LOGFILE"
echo $1 >> "$LOGFILE"
echo $2 >> "$LOGFILE"
echo $3 >> "$LOGFILE"

/anaconda3/bin/python3 ping_pong.py $1 $2
