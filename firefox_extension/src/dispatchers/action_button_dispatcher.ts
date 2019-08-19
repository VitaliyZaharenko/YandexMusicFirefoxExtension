import { RemoteSender, RemoteMessage, RemoteMessageType, RemoteIdentity } from '../common/remote_message';
import { BaseViewInterface } from '../common/base_view_interface'
import { BasicDispatcher } from '../dispatchers/basic_dispatcher'

export { ActionButtonScriptDispatcher }

class ActionButtonScriptDispatcher extends BasicDispatcher {

    constructor(
        public agent: RemoteIdentity, 
        public view: BaseViewInterface, 
    ){
        super(agent)
    }

    dispatch(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void): boolean {
        let consumed = super.dispatch(message, sendResponse)
        return consumed
    }
}