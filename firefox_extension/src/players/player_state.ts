import { 
    MessageReceiver, RemoteMessage, RemoteMessageType
} from "../common";
import { TrackInfo, TrackDuration, PlayerDelegateInterface } from "../player";

export { RemotePlayerState }

// act like a one-to-one forwarder and store current state
// all current state can be forced passing to delegate by receiving RemoteState message
class RemotePlayerState implements PlayerDelegateInterface, MessageReceiver {

    private trackInfo: TrackInfo
    private durationInfo: TrackDuration
    private isPlaying: boolean
    private isLiked: boolean 

    constructor(public delegate: PlayerDelegateInterface | null) {}

    durationStatusUpdate(duration: TrackDuration) {
        this.durationInfo = duration
        this.delegate.durationStatusUpdate(duration)

    }    
    playingStatusUpdate(isPlaying: boolean) {
        this.isPlaying = isPlaying
        this.delegate.playingStatusUpdate(isPlaying)
    }
    trackInfoUpdate(trackInfo: TrackInfo) {
        this.trackInfo = trackInfo
        this.delegate.trackInfoUpdate(trackInfo)
    }
    likeStatusUpdate(isLiked: boolean) {
        this.isLiked = isLiked
        this.delegate.likeStatusUpdate(isLiked)
    }


    onReceive(message: RemoteMessage): RemoteMessage | null {
        if(message.messageType != RemoteMessageType.PlayerState) { return null }

        this.delegate.durationStatusUpdate(this.durationInfo)
        this.delegate.likeStatusUpdate(this.isLiked)
        this.delegate.playingStatusUpdate(this.isPlaying)
        this.delegate.trackInfoUpdate(this.trackInfo)

        return {
            messageType: RemoteMessageType.ConsumedEmptyResponse,
            message: {}
        }
    }

}