import { RemoteSender, RemoteMessage } from "./remote_message";

export { MessageDispatcher, MessageReceiver }

interface MessageDispatcher {

    registeredReceivers: Array<MessageReceiver>

    addReceiver(receiver: MessageReceiver)
    removeReceiver(receiver: MessageReceiver)

    dispatch: (message: RemoteMessage, sendResponse: (message: RemoteMessage) => void) => boolean
}


interface MessageReceiver {

    onReceive: (message: RemoteMessage) => RemoteMessage | null
}

