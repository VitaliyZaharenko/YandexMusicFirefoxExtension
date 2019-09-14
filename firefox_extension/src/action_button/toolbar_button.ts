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
  MessageChannelClient, MessageChannelServer, MessageConsumerInterface, RemoteMessageType, RemoteAgentType
} from "../common"
import {
  PlayerCapability, PlayerCapabilities
} from '../player'
import { 
  GlobalServicesClient 
} from '../global_services';
import { 
  RemotePlayerClient, RemotePlayerDelegateReceiver, RemotePlayerDelegateSubscriptionMessage, RemotePlayerDelegateSubscriptionAction, RemotePlayerDelegateBySubscriptonServer, RemotePlayerDelegateBySubscriptonClient 
} from '../players';

let selfAgent = new RemoteMessageIdentity("ToolbarButtonAgent")
let sender = new BasicSender()
let globalServiceClient = new GlobalServicesClient(selfAgent, sender)
let channelClient = new MessageChannelClient(sender, "toolbar->background")
let remotePlayer = new RemotePlayerClient(channelClient)
let supportedCapabilities: PlayerCapabilities = new Set([PlayerCapability.NextTrack, PlayerCapability.PreviousTrack, PlayerCapability.TogglePlaying])
let playerUI: PlayerClientUI = new PlayerClientUI(remotePlayer, supportedCapabilities, globalServiceClient)  
let dispatcher = new ActionButtonScriptDispatcher(selfAgent, playerUI)
let receiver: RemoteReceiver = new BasicReceiver()
let channelServer = new MessageChannelServer(sender, "toolbar<-background", playerUI)
let playerDelegateReceiver = new RemotePlayerDelegateReceiver(RemoteAgentType.Popup.toString(), playerUI)
let playerDelegateBySubscriptionClient = new RemotePlayerDelegateBySubscriptonClient(sender)

dispatcher.addReceiver(channelClient)
dispatcher.addReceiver(channelServer)

receiver.register((message, sendResponse) => {
  dispatcher.dispatch(message, sendResponse)
})

document.addEventListener("DOMContentLoaded", handleDomLoaded);

window.addEventListener("load", () => {
  registerPopup()
  requestCurrentState()
})
window.addEventListener("unload", unregisterPopup)

function handleDomLoaded(e){
  playerUI.attach(document)
  dispatcher.addReceiver(playerDelegateReceiver)
}


function requestCurrentState() {
  // request player state to pass it state to it's delegate
  sender.send({
    messageType: RemoteMessageType.PlayerState,
    message: {}
  })
}

function registerPopup() {
  playerDelegateBySubscriptionClient.subscribe(RemoteAgentType.Popup)
}

function unregisterPopup() {
  playerDelegateBySubscriptionClient.unsubscribe(RemoteAgentType.Popup)
}

