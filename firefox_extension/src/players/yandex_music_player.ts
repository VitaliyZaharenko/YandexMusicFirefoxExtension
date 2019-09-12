import { 
    PlayerCapability, PlayerCapabilities,
    PlayerInterface, Result,
    TrackInfo, TrackDuration,
    PlayerDelegateInterface
} from '../player'

export { YandexMusicPlayer } 

class YandexMusicPlayer implements PlayerInterface {

    constructor(public requestedCapabilities: PlayerCapabilities) {}

    capabilities: PlayerCapabilities = new Set<PlayerCapability>()
    delegate?: PlayerDelegateInterface

    attach(document: Document): PlayerCapabilities {
        this.document = document

        this.capabilities = new Set<PlayerCapability>()

        this.requestedCapabilities.forEach((capability) => {
            switch (capability) {
                case PlayerCapability.NextTrack:
                    this.setupNextTrackCapability()
                    return
                case PlayerCapability.PreviousTrack:
                    this.setupPrevTrackCapability()
                    return
                case PlayerCapability.TogglePlaying:
                    this.setupTogglePlayingCapability()
                    return
                case PlayerCapability.ToggleLike:
                    this.setupToggleLikeCapability()
                    return
                case PlayerCapability.PlayingStatus:
                    this.setupPlayingStatusCapability()
                    return
                case PlayerCapability.DurationStatus:
                    this.setupDurationStatusCapability()
                    return
                case PlayerCapability.TrackInfo:
                    this.setupTrackInfoCapability()
                    return
                case PlayerCapability.LikeStatus:
                    this.setupLikeStatusCapability()
                    return
                case PlayerCapability.StepBack:
                    this.setupStepBackCapability()
                    return
                case PlayerCapability.StepForward:
                    this.setupStepForwardCapability()
                    return
                case PlayerCapability.StrongDislike:
                    this.setupStrongDislikeCapability()
                    return
                default:
                    return
            }
        })
        return this.capabilities
    }


    // setup capabilities 

    private setupNextTrackCapability() {
        this.nextSongElem = document.querySelector(".player-controls__btn_next")
        this.capabilities.add(PlayerCapability.NextTrack)
    }
    private setupPrevTrackCapability() {
        this.prevSongElem = document.querySelector(".player-controls__btn_prev")
        this.capabilities.add(PlayerCapability.PreviousTrack)
    }
    private setupTogglePlayingCapability() {
        this.playPauseElem = document.querySelector(".player-controls__btn_play")
        this.capabilities.add(PlayerCapability.TogglePlaying)
    }
    private setupToggleLikeCapability() {
        if (this.likeButton == null) {
            this.likeButton = document.querySelector(".d-like.player-controls__btn")
        }
        this.capabilities.add(PlayerCapability.ToggleLike)
    }
    private setupPlayingStatusCapability() {
        this.isPlaying = this.extractPlayingStatus()
        this.capabilities.add(PlayerCapability.PlayingStatus)
        if(this.delegate){
            this.delegate.playingStatusUpdate(this.isPlaying)
        }
    }
    private setupDurationStatusCapability() {
        this.progressLeft = document.querySelector(".progress__left")
        this.progressRight = document.querySelector(".progress__right")
        this.setupProgressObserver()
        this.capabilities.add(PlayerCapability.DurationStatus)
    }
    private setupTrackInfoCapability() {
        this.trackTitle = document.querySelector(".track__title")
        this.trackArtists = document.querySelector(".track__artists")
        this.playerControlMain = document.querySelector(".player-controls__track-container")
        this.setupTrackInfoObserver()
        this.trackInfo = this.extrackTrackInfo()
        this.capabilities.add(PlayerCapability.TrackInfo)
        if(this.delegate) {
            this.delegate.trackInfoUpdate(this.trackInfo)
        }
    }
    private setupLikeStatusCapability() {
        if (this.likeButton == null) {
            this.likeButton = document.querySelector(".d-like.player-controls__btn")
        }
        this.isLiked = this.likeButton.classList.contains("d-like_on")
        this.capabilities.add(PlayerCapability.LikeStatus)
        if(this.delegate) {
            this.delegate.likeStatusUpdate(this.isLiked)
        }
    }
    private setupStepBackCapability() {
        this.capabilities.add(PlayerCapability.StepBack)
    }
    private setupStepForwardCapability() {
        this.capabilities.add(PlayerCapability.StepForward)
    }
    private setupStrongDislikeCapability() {
        this.strongDislikeButton = document.querySelector(".dislike.player-controls__btn")
        this.capabilities.add(PlayerCapability.StrongDislike)
    }

    provide(capability: PlayerCapability): Result {

        if(!this.capabilities.has(capability)) {
            return "NotSupported"
        }

        switch (capability) {
            case PlayerCapability.TogglePlaying:
                this.playPauseElem.click()
                if(this.capabilities.has(PlayerCapability.PlayingStatus)) {
                    this.isPlaying = this.extractPlayingStatus()
                    if(this.delegate) {
                        this.delegate.playingStatusUpdate(this.isPlaying)
                    }
                }
                return "Success"
            case PlayerCapability.PreviousTrack:
                this.prevSongElem.click()
                return "Success"
            case PlayerCapability.NextTrack:
                this.nextSongElem.click()
                return "Success"
            case PlayerCapability.ToggleLike:
                this.handleToggleLike()
                return "Success"
            case PlayerCapability.StepForward:
                this.handleStepForward()
                return "Success"
            case PlayerCapability.StepBack:
                this.handleStepBack()
                return "Success"
            case PlayerCapability.StrongDislike:
                this.handleStrongDislike()
                return "Success"
            default:
                return "Error"
        }
    }

    private handleStepForward() {
        let event = new KeyboardEvent('keydown', {key: "ArrowRight", code: "ArrowRight", bubbles: true, keyCode: 39, which: 39} as any)
        this.document.dispatchEvent(event)
    }
    private handleStepBack() {
        let event = new KeyboardEvent('keydown', {key: "ArrowLeft", code: "ArrowLeft", bubbles: true, keyCode: 37, which: 37} as any)
        this.document.dispatchEvent(event)
    }
    private handleToggleLike() {
        this.likeButton.click()
        this.refreshLike()
        if(this.capabilities.has(PlayerCapability.LikeStatus)){
            this.refreshLikeStatus()   
        }
    }
    private handleStrongDislike() {
        if(this.strongDislikeButton == null || !this.document.body.contains(this.strongDislikeButton)) {
            this.refreshStrongDislike()
        }
        this.strongDislikeButton.click()
    }
    private setupTrackInfoObserver() {
        this.trackInfoObserver = new MutationObserver(this.onObserveTrackInfoDomChanges.bind(this))
        this.trackInfoObserverConfig = { characterData: false, attributes: false, childList: true, subtree: true };
        this.trackInfoObserver.observe(this.playerControlMain, this.trackInfoObserverConfig)
    }

    private onObserveTrackInfoDomChanges(mutationRecord, observer) {
        let trackChange = mutationRecord[0].target.classList.contains("player-controls__track-container")
        if (trackChange) {
            this.handleTrackChange()
        }
    } 

    private handleTrackChange() {
        this.refreshLike()
        // delegate for like called inside
        this.refreshLikeStatus()
        this.refreshStrongDislike()
        this.refreshTrackInfo()
        this.trackInfo = this.extrackTrackInfo()
        this.isPlaying = this.extractPlayingStatus()
        if(this.delegate) {
            this.delegate.playingStatusUpdate(this.isPlaying)
            this.delegate.trackInfoUpdate(this.trackInfo)
        }
    }


    private setupProgressObserver() {
        this.progressObserver = new MutationObserver(this.onObserveProgressDomChanges.bind(this))
        this.progressObserverConfig = { characterData: false, attributes: false, childList: true, subtree: false}
        this.progressObserver.observe(this.progressLeft, this.progressObserverConfig)
    }

    private onObserveProgressDomChanges(mutationRecord, observer) {
        let currentDuration = mutationRecord[0].target.textContent
        let duration = this.progressRight.textContent
        this.trackDuration = {
            currentDuration: currentDuration,
            duration: duration,
            currentProgress: this.computeProgress(currentDuration, duration)
        }
        if(this.delegate) {
            this.delegate.durationStatusUpdate(this.trackDuration)
        }
    }

    private computeProgress(current: string, overall: string): number {
        let currenTokens = current.split(":")
        let number = (+currenTokens[0]) * 60  + (+currenTokens[1])
        let overallTokens = overall.split(":")
        let overallNumber = (+overallTokens[0] * 60) + (+overallTokens[1])
        let progress = number / overallNumber
        return progress
    }

    private refreshLike() {
        this.likeButton = document.querySelector(".d-like.player-controls__btn")
    }
    private refreshLikeStatus() {
        this.isLiked = this.likeButton.classList.contains("d-like_on")    
        if(this.delegate) {
            this.delegate.likeStatusUpdate(this.isLiked)
        }
    }
    private refreshStrongDislike() {
        this.strongDislikeButton = document.querySelector(".dislike.player-controls__btn")
    }
    private refreshTrackInfo() {
        this.trackTitle = document.querySelector(".track__title")
        this.trackArtists = document.querySelector(".track__artists")
    }

    private extrackTrackInfo(): TrackInfo {
        let name = this.trackTitle.textContent
        let artists = []
        this.trackArtists.querySelectorAll("a").forEach((aElem) => { artists.push(aElem.textContent) })
        let info: TrackInfo = {
            name: name,
            artists: artists
        }
        return info
    }

    private extractPlayingStatus(): boolean {
        return this.playPauseElem.classList.contains('player-controls__btn_pause')
    }

    
    private document: Document
    private prevSongElem: HTMLElement
    private nextSongElem: HTMLElement
    private playPauseElem: HTMLElement
    private likeButton: HTMLElement
    private strongDislikeButton: HTMLElement
    private trackTitle: HTMLElement
    private trackArtists: HTMLElement
    private playerControlMain: HTMLElement
    private trackInfoObserver: MutationObserver
    private trackInfoObserverConfig: any
    private progressLeft: HTMLElement
    private progressRight: HTMLElement
    private progressObserver: MutationObserver
    private progressObserverConfig: any


    // state
    private isLiked: boolean = false
    private trackInfo: TrackInfo
    private trackDuration: TrackDuration
    private isPlaying: boolean = false

}