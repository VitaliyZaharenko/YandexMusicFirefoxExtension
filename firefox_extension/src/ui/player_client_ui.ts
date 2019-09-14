import { 
    PlayerClientInterface,
    PlayerCapabilities, 
    PlayerCapability,
    PlayerDelegateInterface,
    TrackDuration,
    TrackInfo
} from '../player'

import { 
    BaseViewInterface
} from "../common";

import {
    GlobalServicesInterface,
} from "../global_services"

export { PlayerClientUI }

class PlayerClientUI implements BaseViewInterface, PlayerDelegateInterface {
    
    private messageElement: HTMLElement
    private titleElement: HTMLElement
    private prevButton: HTMLElement
    private playPauseButton: HTMLElement
    private nextButton: HTMLElement
    private stepBackButton: HTMLElement
    private stepForwardButton: HTMLElement
    private toggleLikeButton: HTMLElement
    private dislikeButton: HTMLElement
    private progressBar: HTMLElement
    private switchToPlayerButton: HTMLElement
    private runNativeAppButton: HTMLElement

    private dislikePreventSingleClick = false
    private timer;
    private CLICK_DELAY = 200;

    document: Document

    constructor(
        private remoteClient: PlayerClientInterface,
        public supportedCapabilities: PlayerCapabilities,
        private globalServices: GlobalServicesInterface,
    ){  
    }

    attach(document: Document) {

        this.document = document
        this.messageElement = document.querySelector("#message-ui")
        this.titleElement = document.querySelector("#song-title")
        this.prevButton = document.querySelector("#prev-song")
        this.nextButton = document.querySelector("#next-song")
        this.playPauseButton = document.querySelector("#play-pause")
        this.stepBackButton = document.querySelector("#step-back")
        this.stepForwardButton = document.querySelector("#step-forward")
        this.toggleLikeButton = document.querySelector("#toggle-like")
        this.dislikeButton = document.querySelector("#dislike")
        this.progressBar = document.querySelector("#progress-bar")
        this.switchToPlayerButton = document.querySelector("#switch-to-player-tab")
        this.runNativeAppButton = document.querySelector("#run-native-app")
        this.prevButton.addEventListener("click", this.handleCapabilityClick.bind(this, PlayerCapability.PreviousTrack));
        this.playPauseButton.addEventListener("click", this.handleCapabilityClick.bind(this, PlayerCapability.TogglePlaying));
        this.nextButton.addEventListener("click", this.handleCapabilityClick.bind(this, PlayerCapability.NextTrack));
        this.stepBackButton.addEventListener('click', this.handleCapabilityClick.bind(this, PlayerCapability.StepBack))
        this.stepForwardButton.addEventListener('click', this.handleCapabilityClick.bind(this, PlayerCapability.StepForward))
        this.toggleLikeButton.addEventListener('click', this.handleCapabilityClick.bind(this, PlayerCapability.ToggleLike))
        this.switchToPlayerButton.addEventListener("click", this.handleSwitchToPlayerClick.bind(this));
        this.runNativeAppButton.addEventListener('click', this.handleRunNativeApp.bind(this))
        this.dislikeButton.addEventListener('click', this.handleDislikeSingleClick.bind(this))
        this.dislikeButton.addEventListener("dblclick", this.handleDislikeDoubleClick.bind(this))
        

        this.registerHotkeys()
    }

    private registerHotkeys() {
        document.addEventListener("keydown", event => {
            if(event.code == "KeyO"){
              this.nextButton.click()
              return
            }
            if(event.code == "KeyI"){
              this.playPauseButton.click()
              return
            }
            if(event.code == "KeyU"){
              this.prevButton.click()
              return
            }
        })
    }

    private handleCapabilityClick(capability) {
        this.remoteClient.provide(capability)
    }

    private handleDislikeSingleClick() {
        this.timer = setTimeout(() => {
            if (!this.dislikePreventSingleClick) {
                this.showMessage("Click 2 times to activate undoable action")
            }
            this.dislikePreventSingleClick = false;
          }, this.CLICK_DELAY);
    }

    private handleDislikeDoubleClick() {
        clearTimeout(this.timer);
        this.dislikePreventSingleClick = true;
        this.remoteClient.provide(PlayerCapability.StrongDislike)
    }

    private handleSwitchToPlayerClick() {
        this.globalServices.switchToActivePlayer()
        window.close()
    }

    private handleRunNativeApp() {
        this.globalServices.runNativeApp()
    }
      
    showError(msg){
        this.messageElement.className = "error-message"
        this.showPopMessage(msg)
    }
      
    showMessage(msg){
        this.messageElement.className = "warning-message"
        this.showPopMessage(msg)
    }

    private showPopMessage(text: string) {
        this.messageElement.textContent = text;
        this.messageElement.style.display = "block";
      
        setTimeout(() => {
          this.messageElement.className = ""
          this.messageElement.textContent = "";
          this.messageElement.style.display = "none";
        }, 1000 * 2)
    }

    // PLAYER INTERFACE DELEGATE 

    durationStatusUpdate(duration: TrackDuration) {
        this.progressBar.style.width = (duration.currentProgress * 100).toString() + "%"
    }
    playingStatusUpdate(isPlaying: boolean) {
        if(isPlaying) {
            this.playPauseButton.textContent = "Pause"
        } else {
            this.playPauseButton.textContent = "Play"
        }
    }

    trackInfoUpdate(trackInfo: TrackInfo) {
        let text = trackInfo.name + ""
        text += trackInfo.artists.reduce((accum, artist) => { return accum + ', ' + artist}, "")
        this.titleElement.textContent = text
    }
    likeStatusUpdate(isLiked: boolean) {
        if(isLiked) {
            this.toggleLikeButton.textContent = "Unlike"
        } else {
            this.toggleLikeButton.textContent = "Like"
        }
    }
}