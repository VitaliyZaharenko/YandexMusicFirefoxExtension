import { 
    PlayerInterface 
} from "../player"
import { 
    YandexMusicPlayer, 
    RemotePlayerServer
} from "../players";
import { 
    BaseViewInterface, ConsoleView,
    RemoteMessageIdentity,
    BasicSender,
    BasicReceiver,
    MessageChannelClient, MessageChannelServer
} from "../common"
import { 
    ContentScriptDispatcher 
} from "../dispatchers"


let view: BaseViewInterface = new ConsoleView()
let selfAgent = new RemoteMessageIdentity("YandexMusicContentScript")
let sender = new BasicSender()
let player: PlayerInterface = new YandexMusicPlayer()
player.attach(document)
let dispatcher = new ContentScriptDispatcher(selfAgent, sender, view, player)
let channelClient = new MessageChannelClient(sender, "content->background")
let channelServer = new MessageChannelServer(sender, "content<-background", view)
dispatcher.addReceiver(channelClient)
dispatcher.addReceiver(channelServer)

let playerServer = new RemotePlayerServer(player)
channelServer.addConsumer(playerServer)


let receiver = new BasicReceiver()
receiver.register(function(message, sendResponse){
    dispatcher.dispatch(message, sendResponse)
})

