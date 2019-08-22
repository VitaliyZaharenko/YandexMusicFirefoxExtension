import { 
    MessageReceiver, RemoteMessage, RemoteMessageType
} from "../common";
import { TrackInfo, TrackDuration, PlayerDelegateInterface } from "../player";

export { RemotePlayerState }

class RemotePlayerState implements PlayerDelegateInterface, MessageReceiver {


    private trackInfo: TrackInfo
    private durationInfo: TrackDuration
    private isPlaying: boolean
    private isLiked: boolean 

    constructor(private delegate: PlayerDelegateInterface) {}

    durationStatusUpdate(duration: TrackDuration) {
        this.durationInfo = duration
    }    
    playingStatusUpdate(isPlaying: boolean) {
        this.isPlaying = isPlaying
    }
    trackInfoUpdate(trackInfo: TrackInfo) {
        this.trackInfo = trackInfo
    }
    likeStatusUpdate(isLiked: boolean) {
        this.isLiked = isLiked
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