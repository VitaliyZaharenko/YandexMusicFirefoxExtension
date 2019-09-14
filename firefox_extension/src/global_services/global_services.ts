
import { 
    RemoteMessageType, RemoteMessage, RemoteIdentity, RemoteSender, TabsManager,
    MessageReceiver 
} from '../common'

export { 
    GlobalServicesInterface, 
    GlobalServicesClient,
    GlobalServicesServer
}

interface GlobalServicesInterface {
    switchToActivePlayer()
    runNativeApp()
}

enum GlobalServicesAction {
    SwitchToPlayer = "SwitchToPlayer",
    RunNativeApp = "RunNativeApp"
}

interface GlobalServicesMessage {
    action: GlobalServicesAction
}


class GlobalServicesClient implements GlobalServicesInterface {

    constructor(
        private agent: RemoteIdentity,
        private sender: RemoteSender,
        ) {}

        switchToActivePlayer() {
            let message = this.createMessage(GlobalServicesAction.SwitchToPlayer)
            this.sender.send(message)
        }

        runNativeApp() {
            let message = this.createMessage(GlobalServicesAction.RunNativeApp)
            this.sender.send(message)
        }

        private createMessage(action: GlobalServicesAction): RemoteMessage {
            let serviceMessage: GlobalServicesMessage = {
                action: action
            }
            return {
                sender: this.agent,
                messageType: RemoteMessageType.GlobalService,
                message: serviceMessage
            }
        }
}

class GlobalServicesServer implements MessageReceiver, GlobalServicesInterface {

    public onRunNativeApp?: () => void

    constructor(
        private agent: RemoteIdentity,
        private tabsManager: TabsManager
    ) {}

    
    onReceive(message: RemoteMessage): RemoteMessage | null {

        if(!this.checkConsumed(message)) { return null }

        let serviceMessage = message.message as GlobalServicesMessage
        switch (serviceMessage.action) {
            case GlobalServicesAction.RunNativeApp:
                this.runNativeApp()
                break;
            case GlobalServicesAction.SwitchToPlayer:
                this.switchToActivePlayer()
                break;
        }

        return {
            messageType: RemoteMessageType.ConsumedEmptyResponse,
            message: {}
        }
    }


    switchToActivePlayer() {
        if (this.tabsManager.activeTab != null) {
            browser.tabs.update(this.tabsManager.activeTab, { active: true })
        }
    }
    runNativeApp() {
        if (this.onRunNativeApp) {
            this.onRunNativeApp()
        }
    }

    private checkConsumed(message: RemoteMessage): boolean {
        if(message.messageType != RemoteMessageType.GlobalService) { return false }
        return true
    }
}
