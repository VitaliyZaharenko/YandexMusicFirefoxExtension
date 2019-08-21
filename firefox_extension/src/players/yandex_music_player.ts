import { 
    PlayerCapability, PlayerCapabilities,
    PlayerInterface, Result,
    TrackInfo, TrackDuration,
    PlayerDelegateInterface
} from '../player'

export { YandexMusicPlayer } 

class YandexMusicPlayer implements PlayerInterface {

    capabilities: PlayerCapabilities = new Set<PlayerCapability>()
    delegate?: PlayerDelegateInterface

    attach(document: Document): PlayerCapabilities {
        this.document = document

        let capabilities = new Set<PlayerCapability>()

        this.prevSongElem = document.querySelector(".player-controls__btn_prev")
        if(this.prevSongElem) {
            capabilities.add(PlayerCapability.PreviousTrack)
        }
        this.nextSongElem = document.querySelector(".player-controls__btn_next")
        if(this.nextSongElem) {
            capabilities.add(PlayerCapability.NextTrack)
        }
        this.playPauseElem = document.querySelector(".player-controls__btn_play")
        if (this.playPauseElem) {
            capabilities.add(PlayerCapability.TogglePlaying)
            this.isPlaying = this.extractPlayingStatus()
            if(this.delegate){
                this.delegate.playingStatusChanged(this.isPlaying)
            }
        }

        this.likeButton = document.querySelector(".d-like.player-controls__btn")
        if (this.likeButton) {
            capabilities.add(PlayerCapability.ToggleLike)
            this.isLiked = this.likeButton.classList.contains("d-like_on")
            if(this.delegate) {
                this.delegate.likeStatusChanged(this.isLiked)
            }
        }

        capabilities.add(PlayerCapability.StepBack)
        capabilities.add(PlayerCapability.StepForward)

        this.strongDislikeButton = document.querySelector(".dislike.player-controls__btn")
        if (this.strongDislikeButton) {
            capabilities.add(PlayerCapability.StrongDislike)
        }
        
        this.trackTitle = document.querySelector(".track__title")
        this.trackArtists = document.querySelector(".track__artists")
        this.playerControlMain = document.querySelector(".player-controls__track-container")
        if(this.trackTitle != null && this.trackArtists != null) {
            capabilities.add(PlayerCapability.TrackInfo)
            this.setupTrackInfoObserver()
            this.trackInfo = this.extrackTrackInfo()
            if(this.delegate) {
                this.delegate.trackInfoChanged(this.trackInfo)
            }
        }

        this.progressLeft = document.querySelector(".progress__left")
        this.progressRight = document.querySelector(".progress__right")
        this.setupProgressObserver()
        this.capabilities.add(PlayerCapability.DurationStatus)


        this.capabilities = capabilities
        return capabilities
    }

    provide(capability: PlayerCapability): Result {
        switch (capability) {
            case PlayerCapability.TogglePlaying:
                this.playPauseElem.click()
                this.isPlaying = this.extractPlayingStatus()
                if(this.delegate) {
                    this.delegate.playingStatusChanged(this.isPlaying)
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
            case PlayerCapability.StepForward:
                this.handleStepForward()
            case PlayerCapability.StepBack:
                this.handleStepBack()
            case PlayerCapability.StrongDislike:
                this.handleStrongDislike()
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
        this.refreshStrongDislike()
        this.refreshTrackInfo()
        this.trackInfo = this.extrackTrackInfo()
        this.isPlaying = this.extractPlayingStatus()
        if(this.delegate) {
            this.delegate.likeStatusChanged(this.isLiked)
            this.delegate.playingStatusChanged(this.isPlaying)
            this.delegate.trackInfoChanged(this.trackInfo)
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
            this.delegate.durationStatusChanged(this.trackDuration)
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
        this.isLiked = this.likeButton.classList.contains("d-like_on")
        if(this.delegate) {
            this.delegate.likeStatusChanged(this.isLiked)
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