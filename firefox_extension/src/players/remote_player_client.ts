import { PlayerCapabilities, PlayerCapability } from "../player/capabilities";
import { RemoteSender, RemoteIdentity, RemoteMessage, RemoteMessageType } from "../common/remote_message";
import { 
    PlayerClientInterface,
    Result, 
    PlayerRemoteMessage, ProvideCapabilityMessage,
    PlayerResultRemoteMessage, PlayerResultMessage, PlayerCapabilitiesResultMessage, GetCapabilitiesMessage
} from '../player/player_interface'

export { RemotePlayerClient }

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