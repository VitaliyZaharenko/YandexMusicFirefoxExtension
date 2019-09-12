import { 
    PlayerDelegateInterface,
    TrackDuration,
    TrackInfo
} from "../player";

export { PlayerDelegateForwarder, PrintPlayerDelegate}

class PlayerDelegateForwarder implements PlayerDelegateInterface {
    
    constructor(private delegates: Array<PlayerDelegateInterface>) {}

    durationStatusUpdate(duration: TrackDuration) {
        this.delegates.forEach((delegate) => {
            delegate.durationStatusUpdate(duration)
        })
    }
    playingStatusUpdate(isPlaying: boolean) {
        this.delegates.forEach((delegate) => {
            delegate.playingStatusUpdate(isPlaying)
        })
    }
    trackInfoUpdate(trackInfo: TrackInfo) {
        this.delegates.forEach((delegate) => {
            delegate.trackInfoUpdate(trackInfo)
        })
    }
    likeStatusUpdate(isLiked: boolean) {
        this.delegates.forEach((delegate) => {
            delegate.likeStatusUpdate(isLiked)
        })
    }

    addDelegate(delegate: PlayerDelegateInterface) {
        if (this.delegates.indexOf(delegate) == -1) {
            this.delegates.push(delegate)
        }
    }
    removeDelegate(delegate: PlayerDelegateInterface) {
        let index = this.delegates.indexOf(delegate)
        if(index != -1) {
            this.delegates.splice(index, 1)
        }
    }
}

class PrintPlayerDelegate implements PlayerDelegateInterface {
    durationStatusUpdate(duration: TrackDuration) {
        console.log(duration)
    }    
    playingStatusUpdate(isPlaying: boolean) {
        console.log("isPlaying: " + isPlaying)
    }
    trackInfoUpdate(trackInfo: TrackInfo) {
        console.log(trackInfo)
    }
    likeStatusUpdate(isLiked: boolean) {
        console.log("isLiked: " + isLiked)
    }
}