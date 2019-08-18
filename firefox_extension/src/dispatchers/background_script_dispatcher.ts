import { MessageDispatcher, MessageReceiver } from '../common/message_broker'
import { RemoteSender, RemoteMessage, RemoteMessageType, RemoteIdentity } from '../common/remote_message';
import { ActivePlayerManagerInterface } from '../players/active_player_manager';
import { BaseViewInterface } from '../common/base_view_interface'

import { 
    PlayerClientInterface, 
    PlayerRemoteMessage, ProvideCapabilityMessage,
} from '../player/player_interface'

export { BackgroundScriptDispatcher }

class BackgroundScriptDispatcher implements MessageDispatcher {

    private receivers: Array<MessageReceiver> = []

    constructor(
        public agent: RemoteIdentity, 
        public view: BaseViewInterface, 
        public playerManager: ActivePlayerManagerInterface){
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

    dispatch(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void) {

        this.processReceivers(message, sendResponse)
        
        switch (message.messageType) {
            case RemoteMessageType.Debug:
                this.handleDebugMessage(message)
                break;
            case RemoteMessageType.PlayerControl:
                this.handlePlayerMessage(message.message as PlayerRemoteMessage, sendResponse)
            default:
                this.handleUnknownMessage(message)
        }
    }


    private processReceivers(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void) {
        
        for(let receiver of this.receivers) {
            let result = receiver.onReceive(message)
            if(!result) { continue }

            if (result.messageType == RemoteMessageType.ConsumedEmptyResponse) { break }
            sendResponse(result)
            break
        }
    }


    private handleDebugMessage(message: RemoteMessage) {
        this.view.showMessage(message.message)
    }

    private handleUnknownMessage(message: RemoteMessage) {
        this.view.showError(message)
    }

    private handlePlayerMessage(message: PlayerRemoteMessage, sendResponse: (message: RemoteMessage) => void) {
        
        switch (message.type) {
            case "GetCapabilities":
                this.playerManager.active.getCapabilities()
                break;
            case "ProvideCapability":
                let capability = message.capability
                this.playerManager.active.provide(capability)
                break;
        }
    }
}