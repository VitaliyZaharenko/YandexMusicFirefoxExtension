
import { PlayerSourceInterface } from '../player/player_source_interface'

export { YandexMusicSource }

class YandexMusicSource implements PlayerSourceInterface {
    urlPattern = "https://music.yandex.ru/*"
    id: "YandexMusic"
}