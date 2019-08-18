import { PlayerSourceInterface } from '../player/player_source_interface'

export { PlayerSourcesProviderInterface }

interface PlayerSourcesProviderInterface {
    supportedSources: () => Array<PlayerSourceInterface>
    getById(id: string): PlayerSourceInterface | null 
}