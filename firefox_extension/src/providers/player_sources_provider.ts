import { PlayerSourceInterface } from '../player/player_source_interface'
import { PlayerSourcesProviderInterface } from './player_sources_provider_interface'
import { YandexMusicSource } from '../players/player_sources';

export { PlayerSourceProvider }

class PlayerSourceProvider implements PlayerSourcesProviderInterface {

    private static instance = new PlayerSourceProvider()
    static get shared(): PlayerSourcesProviderInterface {
        return PlayerSourceProvider.instance
    }
    private sources = [new YandexMusicSource()]

    private constructor () {}

    supportedSources(): Array<PlayerSourceInterface> {
        return this.sources
    }
    getById(id: string): PlayerSourceInterface | null {
        let index = this.sources.findIndex(function(source){
            return source.id == id
        })

        if (index != -1) {
            return this.sources[index]
        } else {
            return null
        }
    }
}