import { 
    PlayerClientInterface,
    PlayerCapabilities, 
    PlayerCapability
} from '../player'

import { GlobalServicesProviderInterface } from "../common/global_services";
import { BaseViewInterface } from "../common/console_view";

export { PlayerClientUI }

class PlayerClientUI implements BaseViewInterface {

    private messageElement: HTMLElement
    private titleElement: HTMLElement
    private prevButton: HTMLElement
    private playPauseButton: HTMLElement
    private nextButton: HTMLElement
    private switchToPlayerButton: HTMLElement

    document: Document

    constructor(
        private remoteClient: PlayerClientInterface,
        public supportedCapabilities: PlayerCapabilities,
        private globalServiceProvider: GlobalServicesProviderInterface,
    ){  
    }

    attach(document: Document) {

        this.document = document
        this.messageElement = document.querySelector("#message-ui");
        this.titleElement = document.querySelector("#song-title");
        this.prevButton = document.querySelector("#prev-song");
        this.prevButton.addEventListener("click", this.handlePrevSongClick.bind(this));
        this.playPauseButton = document.querySelector("#play-pause");
        this.playPauseButton.addEventListener("click", this.handlePlayPauseClick.bind(this));
        this.nextButton = document.querySelector("#next-song");
        this.nextButton.addEventListener("click", this.handleNextSongClick.bind(this));
        this.switchToPlayerButton = document.querySelector("#switch-to-player-tab");
        this.switchToPlayerButton.addEventListener("click", this.handleSwitchToPlayerClick.bind(this));

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

    private handlePrevSongClick() {
        this.remoteClient.provide(PlayerCapability.PreviousTrack)
    }
    private handleNextSongClick() {
        this.remoteClient.provide(PlayerCapability.NextTrack)
    }

    private handlePlayPauseClick() {
        this.remoteClient.provide(PlayerCapability.TogglePlaying)
    }

    private handleSwitchToPlayerClick() {
        this.globalServiceProvider.switchToActivePlayer()
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
}