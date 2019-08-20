import { MessageConsumerInterface, MessageChannelClient } from "../common/message_channel";

import { 
    PlayerInterface, 
    Result, 
    PlayerRemoteMessage, 
    PlayerResultRemoteMessage, 
} from '../player/player_interface'
import { RemoteMessage, RemoteMessageType } from "../common/remote_message"
import { PlayerCapability, PlayerCapabilities } from "../player/capabilities"
import { PlayerClientInterface } from '../player/player_interface'
import { MessageReceiver } from "../common/message_broker";

export { RemotePlayerServer, RemotePlayerClient, RemotePlayerForwarder, RemotePlayerForwarderReceiverStyle }

class RemotePlayerServer implements MessageConsumerInterface {
    
    constructor(private player: PlayerInterface) {} 

    shouldConsume(message: any): boolean {
        let remote = message as RemoteMessage
        return remote.messageType == RemoteMessageType.PlayerControl
    }
    
    async consume(message: any): Promise<any> {
        let remote = message as RemoteMessage
        let playerMessage = remote.message as PlayerRemoteMessage

        switch (playerMessage.type) {
            case "ProvideCapability": 
                let capability = playerMessage.capability
                return this.provideCapability(capability)
            case "GetCapabilities":
                return this.getCapabilities()
            }
    }

    private provideCapability(capability: PlayerCapability): RemoteMessage {
        let result = this.player.provide(capability)
        let response: PlayerResultRemoteMessage = {
            type: "PlayerResult",
            result: result
        }
        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerResult,
            message: response
        }
        return message
    }

    private getCapabilities(): RemoteMessage {
        let capabilities = this.player.capabilities
        let capabilitiesResponse: PlayerResultRemoteMessage = {
            type: "PlayerCapabilitiesResult",
            result: capabilities
        }
        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerResult,
            message: capabilitiesResponse
        }
        return message
    }
}

class RemotePlayerClient implements PlayerClientInterface {

    constructor(private channelClient: MessageChannelClient) {}


    async getCapabilities(): Promise<PlayerCapabilities> {
        let playerMessage: PlayerRemoteMessage = {
            type: "GetCapabilities"
        }
        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerControl,
            message: playerMessage
        }

        let capabilities = await this.channelClient.send(message)
        return capabilities as Set<PlayerCapability>
    }   

    async provide(capability: PlayerCapability): Promise<Result> {
        let playerMessage: PlayerRemoteMessage = {
            type: "ProvideCapability",
            capability: capability
        }
        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerControl,
            message: playerMessage
        }
        let result = await this.channelClient.send(message)
        return result as Result
    }

}

class RemotePlayerForwarder implements MessageConsumerInterface {
    
    constructor(private playerClient: PlayerClientInterface) { }

    shouldConsume(message: any): boolean {
        let remote = message as RemoteMessage
        return remote.messageType == RemoteMessageType.PlayerControl
    }
    
    async consume(message: any): Promise<any> {
        let remote = message as RemoteMessage
        let playerMessage = remote.message as PlayerRemoteMessage

        switch (playerMessage.type) {
            case "ProvideCapability": 
                let capability = playerMessage.capability
                return this.provideCapability(capability)
            case "GetCapabilities":
                return this.getCapabilities()
            }
    }

    private async provideCapability(capability: PlayerCapability): Promise<RemoteMessage> {
        let result = await this.playerClient.provide(capability)
        let response: PlayerResultRemoteMessage = {
            type: "PlayerResult",
            result: result
        }
        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerResult,
            message: response
        }
        return message
    }

    private async getCapabilities(): Promise<RemoteMessage> {
        let capabilities = await this.playerClient.getCapabilities()
        let capabilitiesResponse: PlayerResultRemoteMessage = {
            type: "PlayerCapabilitiesResult",
            result: capabilities
        }
        let message: RemoteMessage = {
            messageType: RemoteMessageType.PlayerResult,
            message: capabilitiesResponse
        }
        return message
    }
}

class RemotePlayerForwarderReceiverStyle implements MessageReceiver {

    constructor(private playerClient: PlayerClientInterface) { }

    onReceive(message: RemoteMessage): RemoteMessage | null {
        if (message.messageType != RemoteMessageType.PlayerControl) { return null }
        let playerMessage = message.message as PlayerRemoteMessage
        switch(playerMessage.type) {
            case "GetCapabilities": 
                // NOT USED
                let result: RemoteMessage = {
                    messageType: RemoteMessageType.ConsumedEmptyResponse,
                    message: {}
                }
                return result
            case "ProvideCapability":
                let capability = playerMessage.capability
                this.playerClient.provide(capability)
                let resultProvide: RemoteMessage = {
                    messageType: RemoteMessageType.ConsumedEmptyResponse,
                    message: {}
                }
                return resultProvide
        }
    }
}