import { 
  PlayerClientUI
} from '../ui/player_client_ui'
import { 
  ActionButtonScriptDispatcher 
} from '../dispatchers'
import { 
  RemoteMessageIdentity,
  RemoteReceiver,
  BasicReceiver,
  BasicSender,
  MessageChannelClient, MessageChannelServer, MessageConsumerInterface
} from "../common"
import {
  PlayerCapability, PlayerCapabilities
} from '../player'
import { 
  GlobalServicesProviderClient 
} from '../providers';
import { 
  RemotePlayerClient 
} from '../players';

let selfAgent = new RemoteMessageIdentity("ToolbarButtonAgent")
let sender = new BasicSender()
let globalServiceClient = new GlobalServicesProviderClient(selfAgent, sender)
let channelClient = new MessageChannelClient(sender, "toolbar->background")
let remotePlayer = new RemotePlayerClient(channelClient)
let supportedCapabilities: PlayerCapabilities = new Set([PlayerCapability.NextTrack, PlayerCapability.PreviousTrack, PlayerCapability.TogglePlaying])
let playerUI: PlayerClientUI = new PlayerClientUI(remotePlayer, supportedCapabilities, globalServiceClient)  
let dispatcher = new ActionButtonScriptDispatcher(selfAgent, playerUI)
let receiver: RemoteReceiver = new BasicReceiver()
let channelServer = new MessageChannelServer(sender, "toolbar<-background", playerUI)

dispatcher.addReceiver(channelClient)
dispatcher.addReceiver(channelServer)

receiver.register((message, sendResponse) => {
  dispatcher.dispatch(message, sendResponse)
})

document.addEventListener("DOMContentLoaded", handleDomLoaded);

function handleDomLoaded(e){
  playerUI.attach(document)
}

