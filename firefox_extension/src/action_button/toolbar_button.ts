import { PlayerClientUI } from '../ui/player_client_ui'
import { RemotePlayerClient } from '../players/remote_player_client'

import { 
  RemoteMessageIdentity,
  RemoteIdentity,
  BasicSender,
  RemoteMessageType
} from "../common/remote_message"
import { GlobalServicesProviderClient } from '../providers/global_services';
import { PlayerCapability, PlayerCapabilities } from '../player/capabilities';

let selfAgent = new RemoteMessageIdentity("ToolbarButtonAgent")
let sender = new BasicSender()
let remotePlayer = new RemotePlayerClient(selfAgent, sender)
let globalServiceClient = new GlobalServicesProviderClient(selfAgent, sender)

let supportedCapabilities: PlayerCapabilities = new Set([PlayerCapability.NextTrack, PlayerCapability.PreviousTrack, PlayerCapability.TogglePlaying])
let playerUI: PlayerClientUI = new PlayerClientUI(remotePlayer, supportedCapabilities, globalServiceClient)  



document.addEventListener("DOMContentLoaded", handleDomLoaded);

function handleDomLoaded(e){
  playerUI.attach(document)
}

