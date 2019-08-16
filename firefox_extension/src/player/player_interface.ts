
import { PlayerCapabilities, PlayerCapability } from './capabilities'

export { 
    Result, 
    PlayerInterface, 
    PlayerClientInterface, 
    PlayerRemoteMessage, ProvideCapabilityMessage, GetCapabilitiesMessage,
    PlayerResultRemoteMessage, PlayerResultMessage, PlayerCapabilitiesResultMessage
}

type Result = "Success" | "Error"


interface ProvideCapabilityMessage {
    type: "ProvideCapability"
    capability: PlayerCapability
}

interface GetCapabilitiesMessage {
    type: "GetCapabilities"
}

type PlayerRemoteMessage = ProvideCapabilityMessage | GetCapabilitiesMessage


interface PlayerResultMessage {
    type: "PlayerResult"
    result: Result
}

interface PlayerCapabilitiesResultMessage {
    type: "PlayerCapabilitiesResult"
    result: PlayerCapabilities
}

type PlayerResultRemoteMessage = PlayerResultMessage | PlayerCapabilitiesResultMessage


interface PlayerInterface {

    capabilities: PlayerCapabilities

    attach: (document: Document) => PlayerCapabilities
    provide: (capability: PlayerCapability) => Result
}

interface PlayerClientInterface {
    getCapabilities(): Promise<PlayerCapabilities>
    provide: (capability: PlayerCapability) => Promise<Result>
}