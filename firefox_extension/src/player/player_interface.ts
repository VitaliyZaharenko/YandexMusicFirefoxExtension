
import { PlayerCapabilities, PlayerCapability } from './capabilities'
import { TrackDuration, TrackInfo } from './track_info';

export { 
    Result, 
    PlayerInterface, PlayerDelegateInterface,
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
    delegate?: PlayerDelegateInterface

    attach: (document: Document) => PlayerCapabilities
    provide: (capability: PlayerCapability) => Result
}

interface PlayerDelegateInterface {

    durationStatusChanged(duration: TrackDuration)
    playingStatusChanged(isPlaying: boolean)
    trackInfoChanged(trackInfo: TrackInfo)
    likeStatusChanged(isLiked: boolean)
}

interface PlayerClientInterface {
    getCapabilities(): Promise<PlayerCapabilities>
    provide: (capability: PlayerCapability) => Promise<Result>
}