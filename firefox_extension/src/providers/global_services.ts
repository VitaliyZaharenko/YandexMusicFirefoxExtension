import { 
    GlobalServicesProviderInterface, GlobalServiceSwitchToPlayerMessage, 
    GlobalServiceResultMessage, GlobalServiceBoolResultMessage, GlobalServiceMessage } from '../common/global_services'
import { RemoteIdentity, RemoteSender, RemoteMessage, RemoteMessageType, RemoteReceiver } from '../common/remote_message'
import { PlayerModel } from '../players/player_model'

import { MessageReceiver } from '../common/message_broker'
import { ActivePlayerManagerInterface } from '../players/active_player_manager';
import { TabsManager } from '../common/tabs_manager';

export { GlobalServicesProviderClient, GlobalServicesProviderServer }

class GlobalServicesProviderClient implements GlobalServicesProviderInterface {

    constructor(
        private agent: RemoteIdentity,
        private sender: RemoteSender,
        ) {
        }

        async switchToActivePlayer(): Promise<boolean> {

            let serviceMessage: GlobalServiceSwitchToPlayerMessage = {
                type: "SwitchToPlayer"
            }

            let message: RemoteMessage = {
                messageType: RemoteMessageType.GlobalService,
                sender: this.agent,
                message: serviceMessage
            }

            let result = (await this.sender.send(message)).message as GlobalServiceBoolResultMessage
            return result.status
        }
        scanPlayers(): Promise<Array<PlayerModel>> {
            // TODO: not implemented 
            return Promise.resolve([])
        }
        activePlayer(): Promise<PlayerModel> {
            // TODO: - not implemented
            return Promise.resolve({ title: "Empty", source: "Empty" })
        }
        setActive(model: PlayerModel): Promise<boolean> {
            // not implemented
            return Promise.resolve(false)
        }
}

class GlobalServicesProviderServer implements MessageReceiver {

    constructor(
        private agent: RemoteIdentity,
        private tabsManager: TabsManager
    ) {}

    
    onReceive(message: RemoteMessage): RemoteMessage | null {

        if(!this.checkConsumed(message)) { return null }

        let serviceMessage = message.message as GlobalServiceMessage
        switch (serviceMessage.type) {
            case "SwitchToPlayer":
                this.handleSwitchToPlayer()
                let response: GlobalServiceBoolResultMessage = {
                    type: "GlobalServiceResultBoolean",
                    status: true
                }
                let message: RemoteMessage = {
                    messageType: RemoteMessageType.GlobalServiceResult,
                    sender: this.agent,
                    message: response
                }
                return message
        }
    }


    private checkConsumed(message: RemoteMessage): boolean {
        if(message.messageType != RemoteMessageType.GlobalService) { return false }

        return true
    }

    private handleSwitchToPlayer() {
        if (this.tabsManager.activeTab != null) {
            browser.tabs.update(this.tabsManager.activeTab, { active: true })
        }
    }

}