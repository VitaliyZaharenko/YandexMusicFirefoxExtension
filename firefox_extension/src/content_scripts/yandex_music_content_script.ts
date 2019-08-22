import { 
    PlayerInterface, PlayerCapability 
} from "../player"
import { 
    YandexMusicPlayer, 
    RemotePlayerServer,
    RemotePlayerDelegateSender,
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
let requestedCapabilities = new Set<PlayerCapability>([
    PlayerCapability.NextTrack, PlayerCapability.PreviousTrack, PlayerCapability.TogglePlaying,
    PlayerCapability.ToggleLike, PlayerCapability.StrongDislike,
    PlayerCapability.DurationStatus, PlayerCapability.TrackInfo, PlayerCapability.LikeStatus, PlayerCapability.PlayingStatus,
    PlayerCapability.StepBack, PlayerCapability.StepForward
])
let remoteDelegate = new RemotePlayerDelegateSender("content->background[PlayerStatus]", sender)
let player: PlayerInterface = new YandexMusicPlayer(requestedCapabilities)
player.delegate = remoteDelegate
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

