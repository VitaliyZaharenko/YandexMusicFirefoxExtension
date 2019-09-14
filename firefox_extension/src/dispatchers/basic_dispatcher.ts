import { 
    MessageDispatcher, MessageReceiver,
    RemoteSender, RemoteMessage, RemoteMessageType, RemoteIdentity
} from '../common'

export { BasicDispatcher }

class BasicDispatcher implements MessageDispatcher {

    private receivers: Array<MessageReceiver> = []

    constructor(
        public agent: RemoteIdentity){
    }

    addReceiver(receiver: MessageReceiver) {
        this.receivers.push(receiver)
    }
    removeReceiver(receiver: MessageReceiver) {
        let index = this.receivers.indexOf(receiver)
        if (index >= 0) {
            this.receivers.splice(index, 1)
        }
    }

    get registeredReceivers(): Array<MessageReceiver> {
        return this.receivers
    }

    dispatch(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void): boolean {
        let consumed = this.processReceivers(message, sendResponse)
        return consumed
    }

    private processReceivers(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void): boolean {
        
        for(let receiver of this.receivers) {
            let result = receiver.onReceive(message)
            if(result == null) { continue }
            if (result.messageType == RemoteMessageType.ConsumedEmptyResponse) { return true }
            sendResponse(result)
            return true
        }
        return false
    }
}