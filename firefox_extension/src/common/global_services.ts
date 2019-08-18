
import { PlayerModel } from '../players/player_model'

export { 
    GlobalServicesProviderInterface, GlobalServiceSwitchToPlayerMessage, GlobalServiceMessage,
    GlobalServiceBoolResultMessage, GlobalServiceResultMessage
}

interface GlobalServicesProviderInterface {

    switchToActivePlayer(): Promise<boolean>
    scanPlayers(): Promise<Array<PlayerModel>>
    activePlayer(): Promise<PlayerModel>
    setActive(model: PlayerModel): Promise<boolean>
}

interface GlobalServiceSwitchToPlayerMessage {
    type: "SwitchToPlayer"
}

type GlobalServiceMessage = GlobalServiceSwitchToPlayerMessage


interface GlobalServiceBoolResultMessage {
    type: "GlobalServiceResultBoolean",
    status: boolean
}

type GlobalServiceResultMessage = GlobalServiceBoolResultMessage