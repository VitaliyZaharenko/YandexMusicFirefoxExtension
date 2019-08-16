import { PlayerCapabilities } from "../player/capabilities"
import { PlayerInterface } from "../player/player_interface";
import { YandexMusicPlayer } from "../players/yandex_music_player";
import { BaseViewInterface, ConsoleView } from "../common/console_view"
import { ContentScriptDispatcher } from "../dispatchers/content_script_dispatcher"

import {
    RemoteMessage, 
    RemoteMessageType, 
    RemoteMessageIdentity,
    RemoteSender, RemoteReceiver,
    BasicSender, TabSender,
    BasicReceiver
} from "../common/remote_message"

let view: BaseViewInterface = new ConsoleView()
let selfAgent = new RemoteMessageIdentity("YandexMusicContentScript")
let sender = new BasicSender()
let player: PlayerInterface = new YandexMusicPlayer()
player.attach(document)
let dispatcher = new ContentScriptDispatcher(selfAgent, sender, view, player)

let receiver = new BasicReceiver()
receiver.register(function(message, sendResponse){
    dispatcher.dispatch(message, sendResponse)
})

