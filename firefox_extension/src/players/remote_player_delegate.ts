import { 
    PlayerCapability, PlayerCapabilities,
    PlayerInterface, Result,
    TrackInfo, TrackDuration,
    PlayerDelegateInterface
} from '../player'

import { 
    RemoteSender, RemoteMessage, RemoteIdentity, RemoteMessageType, MessageReceiver
} from "../common"


export { 
    RemotePlayerDelegateSender,
    RemotePlayerDelegateReceiver,
    PlayerStatusDurationMessage,
    PlayerStatusPlayingStatusMessage,
    PlayerStatusTrackInfoMessage,
    PlayerStatusLikeStatusMessage,
    PlayerStatusMessage
}


interface PlayerStatusDurationMessage {
    type: "Duration"
    duration: TrackDuration
}
interface PlayerStatusPlayingStatusMessage {
    type: "PlayingStatus"
    isPlaying: boolean
}
interface PlayerStatusTrackInfoMessage {
    type: "TrackInfo"
    trackInfo: TrackInfo
}
interface PlayerStatusLikeStatusMessage {
    type: "LikeStatus"
    isLiked: boolean
}

type PlayerStatusMessage = PlayerStatusDurationMessage | PlayerStatusPlayingStatusMessage | PlayerStatusTrackInfoMessage | PlayerStatusLikeStatusMessage



class RemotePlayerDelegateSender implements PlayerDelegateInterface {
    
    constructor(
        public connectionId: String,
        public sender: RemoteSender
    ) {}

    
    durationStatusUpdate(duration: TrackDuration) {
        let message: PlayerStatusDurationMessage = {
            type: "Duration",
            duration: duration
        }
        let remoteMessage = this.createRemoteMessage(message)
        this.sender.send(remoteMessage)
    }
    playingStatusUpdate(isPlaying: boolean) {
        let message: PlayerStatusPlayingStatusMessage = {
            type: "PlayingStatus",
            isPlaying: isPlaying
        }
        let remoteMessage = this.createRemoteMessage(message)
        this.sender.send(remoteMessage)
    }
    trackInfoUpdate(trackInfo: TrackInfo) {
        let message: PlayerStatusTrackInfoMessage = {
            type: "TrackInfo",
            trackInfo: trackInfo
        }
        let remoteMessage = this.createRemoteMessage(message)
        this.sender.send(remoteMessage)
    }
    likeStatusUpdate(isLiked: boolean) {
        let message: PlayerStatusLikeStatusMessage = {
            type: "LikeStatus",
            isLiked: isLiked
        }
        let remoteMessage = this.createRemoteMessage(message)
        this.sender.send(remoteMessage)
    }

    private createRemoteMessage(message: PlayerStatusMessage): RemoteMessage {
        let remoteMessage: RemoteMessage = {
            sender: { id: this.connectionId } as RemoteIdentity,
            messageType: RemoteMessageType.PlayerStatus,
            message: message
        }
        return remoteMessage
    } 
}

class RemotePlayerDelegateReceiver implements MessageReceiver {

    constructor(
        public connectionId,
        public delegate: PlayerDelegateInterface
    ) {}

    onReceive(message: RemoteMessage): RemoteMessage | null {
        if(!this.shouldReceive(message)) { return null }

        this.handlePlayerStatusMessage(message.message as PlayerStatusMessage)
        let result: RemoteMessage = {
            messageType: RemoteMessageType.ConsumedEmptyResponse,
            message: {}
        } 
        return result
    }

    private shouldReceive(message: RemoteMessage): boolean {
        if(!message.sender || message.sender.id != this.connectionId) {
            return false
        }
        return message.messageType == RemoteMessageType.PlayerStatus
    }

    private handlePlayerStatusMessage(message: PlayerStatusMessage) {
        switch (message.type) {
            case "Duration":
                this.delegate.durationStatusUpdate(message.duration)
                return
            case "LikeStatus":
                this.delegate.likeStatusUpdate(message.isLiked)
                return
            case "PlayingStatus":
                this.delegate.playingStatusUpdate(message.isPlaying)
                return
            case "TrackInfo":
                this.delegate.trackInfoUpdate(message.trackInfo)
        }
    }
}