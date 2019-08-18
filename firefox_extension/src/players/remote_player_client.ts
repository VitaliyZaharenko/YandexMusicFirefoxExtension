import { PlayerCapabilities, PlayerCapability } from "../player/capabilities";
import { RemoteSender, RemoteIdentity, RemoteMessage, RemoteMessageType } from "../common/remote_message";
import { 
    PlayerClientInterface,
    Result, 
    PlayerRemoteMessage, ProvideCapabilityMessage,
    PlayerResultRemoteMessage, PlayerResultMessage, PlayerCapabilitiesResultMessage, GetCapabilitiesMessage
} from '../player/player_interface'

import { MessageReceiver } from '../common/message_broker'

export { RemotePlayerClient, RemotePlayerClientForwarder }

class RemotePlayerClient implements PlayerClientInterface {

    constructor(private agent: RemoteIdentity, private sender: RemoteSender) {
    }


    async getCapabilities() : Promise<PlayerCapabilities> {

        let playerMessage: GetCapabilitiesMessage = { 
            type: "GetCapabilities"
        }

        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerControl,
            sender: this.agent,
            message: playerMessage
        }
        let response = await this.sender.send(message)
        let capabilities = (response.message as PlayerCapabilitiesResultMessage).result
        return capabilities
    }

    async provide(capability: PlayerCapability): Promise<Result> {
        let playerMessage: ProvideCapabilityMessage = {
            type: "ProvideCapability",
            capability: capability
        }
        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerControl,
            sender: this.agent,
            message: playerMessage
        }
        let result: Result
        try {
            let response = await this.sender.send(message)
            result = (response.message as PlayerResultMessage).result
        } catch(e) {
            throw e
        }
        return result
    }

}


class RemotePlayerClientForwarder implements MessageReceiver {

    constructor(
        private agent: RemoteIdentity,
        private forwardClient: RemoteIdentity,
        private remoteClient: PlayerClientInterface
        ) {
    }


    onReceive(message: RemoteMessage): RemoteMessage | null {
        if (!this.isConsumed(message)) { return null }
        
        let playerMessage = message.message as PlayerRemoteMessage
        switch (playerMessage.type) {
            case "ProvideCapability":
                let capability = playerMessage.capability
                this.remoteClient.provide(capability)
                
                let result: PlayerResultRemoteMessage = {
                    type: "PlayerResult",
                    result: "Success"
                }
                let message: RemoteMessage = {
                    messageType: RemoteMessageType.PlayerResult,
                    sender: this.agent,
                    message: result
                }
                return message
            case "GetCapabilities":
                // not implemented
                return {
                    messageType: RemoteMessageType.ConsumedEmptyResponse,
                    message: {}
                }
        }
    }

    private isConsumed(message: RemoteMessage): boolean {
        if(!message.sender) { return false }
        let senderId = message.sender.id
        if (senderId != this.forwardClient.id) { return false }

        if (message.messageType != RemoteMessageType.PlayerControl) { return false }
        return true
    } 
}