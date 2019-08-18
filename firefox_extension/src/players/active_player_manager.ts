
import { PlayerInterface, PlayerClientInterface } from '../player/player_interface'

export { ActivePlayerManagerInterface, ActivePlayerManager }

interface ActivePlayerManagerInterface {
    active: PlayerClientInterface
}

class ActivePlayerManager implements ActivePlayerManagerInterface {
    active: PlayerClientInterface
}