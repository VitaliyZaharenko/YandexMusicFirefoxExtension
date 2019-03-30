#!/usr/bin/env python3

import sys
import json
import struct


try:
    def getMessage():
        rawLength = sys.stdin.buffer.read(4)
        if len(rawLength) == 0:
            sys.exit(0)
        messageLength = struct.unpack('@I', rawLength)[0]
        message = sys.stdin.buffer.read(messageLength).decode('utf-8')
        return json.loads(message)

    # Encode a message for transmission,
    # given its content.
    def encodeMessage(messageContent):
        encodedContent = json.dumps(messageContent).encode('utf-8')
        encodedLength = struct.pack('@I', len(encodedContent))
        return {'length': encodedLength, 'content': encodedContent}

    # Send an encoded message to stdout
    def sendMessage(encodedMessage):
        sys.stdout.buffer.write(encodedMessage['length'])
        sys.stdout.buffer.write(encodedMessage['content'])
        sys.stdout.buffer.flush()


    with open('message.log', 'a') as f:
        f.write(str("Start receiving\n"))
        f.write(str(sys.version) + "\n")
        f.write("Arguments\n")
        for i in range(0, len(sys.argv)):
            f.write("arg{0}={1}\n".format(i, sys.argv[i]))
        f.write("Received data: \n")
    while True:

        receivedMessage = getMessage()
        with open('message.log', 'a') as f:
            f.write(str(receivedMessage))
        if receivedMessage == "ping":
            sendMessage(encodeMessage("pong3"))
except KeyboardInterrupt:
        raise
except:
    with open('error.log', 'a') as f:
        f.write(str(sys.exc_info()[0]) + "\n")
