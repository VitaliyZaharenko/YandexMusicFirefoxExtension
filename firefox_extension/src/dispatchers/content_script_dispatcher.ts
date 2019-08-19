import { MessageDispatcher, MessageReceiver } from '../common/message_broker'
import { RemoteSender, RemoteMessage, RemoteMessageType, RemoteIdentity } from '../common/remote_message';
import { BaseViewInterface } from '../common/console_view';
import { 
    PlayerInterface, 
    PlayerRemoteMessage, ProvideCapabilityMessage,
    PlayerResultRemoteMessage, PlayerResultMessage, PlayerCapabilitiesResultMessage
} from '../player/player_interface'

import { BasicDispatcher } from './basic_dispatcher';

export { ContentScriptDispatcher }

class ContentScriptDispatcher extends BasicDispatcher {

    constructor(
        public agent: RemoteIdentity, 
        private sender: RemoteSender, 
        private view: BaseViewInterface, 
        private player: PlayerInterface) {
        
        super(agent)
    }

    dispatch(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void): boolean {
        let consumed = super.dispatch(message, sendResponse)
        if (consumed) { return true }

        switch (message.messageType) {
            case RemoteMessageType.Debug:
                this.handleDebug(message)
                return true
            default:
                this.handleUnknown(message)
                return true
        }
    }

    private handleDebug(message: RemoteMessage) {
        this.view.showMessage(message.message.toString())
    }
    
    private handleUnknown(message: RemoteMessage) {
        this.view.showError("Unknown Message type")
        this.view.showError(message.message.toString())
        this.sender.send({
            messageType: RemoteMessageType.Debug,
            from: this.agent,
            message: {
                unknownMessage: message
            }
        } as RemoteMessage)
    }
}