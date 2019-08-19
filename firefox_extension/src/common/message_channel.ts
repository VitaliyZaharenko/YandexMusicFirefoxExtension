import * as uuid from "uuid/v1"

import { MessageReceiver } from "../common/message_broker"
import { RemoteSender, RemoteMessage, RemoteMessageType } from "./remote_message";

import { BaseViewInterface } from "../common/console_view"

export { MessageChannelClient, MessageChannelServer, MessageConsumerInterface, ChannelMessage }


interface MessageConsumerInterface {

    shouldConsume(message): boolean
    consume(message: any): Promise<any>
}

interface ChannelMessage extends RemoteMessage {
    id: string,
    messageType: RemoteMessageType.ChannelMessage,
    channelId: string,
    message: RemoteMessage 
}

class MessageChannelClient implements MessageReceiver {

    private static TIMEOUT = 1000 * 5

    constructor(
        public sender: RemoteSender,
        private channelId: string
    ) {}


    private pendingIds = []
    private pendingCallbacks = []


    send(message: any): Promise<any> {

        let id = uuid()
        let remoteMessage: ChannelMessage = {
            id: id,
            messageType: RemoteMessageType.ChannelMessage,
            channelId: this.channelId,
            message: message
        }

        this.sender.send(remoteMessage)
        this.pendingIds.push(id)
        return new Promise((resolve, reject) => {
            this.pendingCallbacks.push({
                resolve: resolve,
                reject: reject
            })
            setTimeout(() => {
                this.rejectedByTimeout(id)
            }, MessageChannelClient.TIMEOUT)
        })
    }

    private rejectedByTimeout(pendingId) {
        let index = this.pendingIds.indexOf(pendingId)
        if (index >= 0) {
            let callbacks = this.pendingCallbacks[index]
            this.pendingIds.splice(index, 1)
            this.pendingCallbacks.splice(index, 1)
            callbacks.reject({
                messageType: RemoteMessageType.Error,
                message: "Rejected by timeout"
            })
        }
    }

    private resolvedByMessage(id, message) {
        let index = this.pendingIds.indexOf(id)
        if (index >= 0) {
            let callbacks = this.pendingCallbacks[index]
            this.pendingIds.splice(index, 1)
            this.pendingCallbacks.splice(index, 1)
            callbacks.resolve(message)
        }
    }


    onReceive(message: RemoteMessage): RemoteMessage | null {

        if(message.messageType != RemoteMessageType.ChannelMessage) { return null}
        let channelMessage = message as ChannelMessage
        if (channelMessage.channelId != this.channelId) { return null}
        this.resolvedByMessage(channelMessage.id, channelMessage.message)
        return null
    }
}

class MessageChannelServer implements MessageReceiver {

    private consumers: Array<MessageConsumerInterface> = []

    constructor(private sender: RemoteSender,
                private channelId: string,
                private view: BaseViewInterface) {}


    addConsumer(consumer: MessageConsumerInterface) {
        this.consumers.push(consumer)
    }
    removeConsumer(consumer: MessageConsumerInterface) {
        let index = this.consumers.indexOf(consumer)
        if (index >= 0) {
            this.consumers.splice(index, 1)
        }
    }

    get registeredReceivers(): Array<MessageConsumerInterface> {
        return this.consumers
    }
    

    onReceive(message: RemoteMessage): RemoteMessage | null {
        if(message.messageType != RemoteMessageType.ChannelMessage) { return null }
        let channelMessage = message as ChannelMessage
        if (channelMessage.channelId != this.channelId) { return null }
        if(!this.processConsumers(channelMessage.id, channelMessage.message)) { return null }
        return {
            messageType: RemoteMessageType.ConsumedEmptyResponse
        } as RemoteMessage
    }

    private processConsumers(id: string, message: RemoteMessage): boolean {
        for(let consumer of this.consumers) {
            if(consumer.shouldConsume(message)){
                consumer.consume(message).then((result) => {
                    let resultMessage: ChannelMessage = {
                        messageType: RemoteMessageType.ChannelMessage,
                        id: id,
                        channelId: this.channelId,
                        message: result,
                    }
                    this.sender.send(resultMessage)
                }).catch((error) => {
                    let resultMessage: ChannelMessage = {
                        messageType: RemoteMessageType.ChannelMessage,
                        id: id,
                        channelId: this.channelId,
                        message: error
                    }
                    this.sender.send(resultMessage)
                })
                return true
            }
        }
        return false
    }   
}