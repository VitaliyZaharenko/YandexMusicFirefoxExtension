import { PlayerCapability, PlayerCapabilities } from '../player/capabilities'
import { PlayerSourceInterface } from '../player/player_source_interface'
import { PlayerInterface, Result } from '../player/player_interface'

export { YandexMusicPlayer } 

class YandexMusicPlayer implements  PlayerInterface {

    capabilities: PlayerCapabilities = new Set<PlayerCapability>()

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
        this.playPauseElem = document.querySelector(".player-controls__btn_pause") ||
                           document.querySelector(".player-controls__btn_play")
        if (this.playPauseElem) {
            capabilities.add(PlayerCapability.TogglePlaying)
        }
        //this.trackTitle = document.querySelector(".track__title")

        this.capabilities = capabilities
        return capabilities
    }

    provide(capability: PlayerCapability): Result {
        switch (capability) {
            case PlayerCapability.TogglePlaying:
                this.playPauseElem.click()
                return "Success"
            case PlayerCapability.PreviousTrack:
                this.prevSongElem.click()
                return "Success"
            case PlayerCapability.NextTrack:
                this.nextSongElem.click()
                return "Success"
            default:
                return "Error"
        }
    }

    
    private document: Document
    private prevSongElem: HTMLElement
    private nextSongElem: HTMLElement
    private playPauseElem: HTMLElement
    //private trackTitle 
    

}