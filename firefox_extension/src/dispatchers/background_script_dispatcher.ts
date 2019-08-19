import { MessageDispatcher, MessageReceiver } from '../common/message_broker'
import { RemoteSender, RemoteMessage, RemoteMessageType, RemoteIdentity } from '../common/remote_message';
import { ActivePlayerManagerInterface } from '../players/active_player_manager';
import { BaseViewInterface } from '../common/base_view_interface'
import { BasicDispatcher } from '../dispatchers/basic_dispatcher'

import { 
    PlayerClientInterface, 
    PlayerRemoteMessage, ProvideCapabilityMessage,
} from '../player/player_interface'

export { BackgroundScriptDispatcher }

class BackgroundScriptDispatcher extends BasicDispatcher {

    constructor(
        public agent: RemoteIdentity, 
        public view: BaseViewInterface, 
        public playerManager: ActivePlayerManagerInterface){
            super(agent)
    }


    dispatch(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void): boolean {
        let consumed = super.dispatch(message, sendResponse)
        if (consumed) {
            return true
        }        
        switch (message.messageType) {
            case RemoteMessageType.Debug:
                this.handleDebugMessage(message)
                return true
            default:
                this.handleUnknownMessage(message)
                return true
        }
    }

    private handleDebugMessage(message: RemoteMessage) {
        this.view.showMessage(message.message)
    }

    private handleUnknownMessage(message: RemoteMessage) {
        this.view.showError(message)
    }
}