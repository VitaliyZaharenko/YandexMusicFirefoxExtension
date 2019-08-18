import { PlayerCapabilities } from '../player/capabilities'
import { 
  RemoteMessageIdentity,
  RemoteSender, RemoteReceiver,
  BasicSender, TabSender,
  BasicReceiver,
  RemoteIdentity
} from "../common/remote_message"

import { BaseViewInterface, ConsoleView } from "../common/console_view"
import { PlayerClientInterface } from '../player/player_interface';
import { RemotePlayerClient } from '../players/remote_player_client'
import { BackgroundScriptCommandDispatcher } from '../dispatchers/command_dispatcher'
import { BackgroundScriptDispatcher } from '../dispatchers/background_script_dispatcher'
import { ActivePlayerManagerInterface, ActivePlayerManager } from '../players/active_player_manager'
import { MessageDispatcher } from '../common/message_broker'
import { TabsManager } from '../common/tabs_manager';
import { GlobalServicesProviderServer } from '../providers/global_services'

let view: BaseViewInterface = new ConsoleView()
let receiver: RemoteReceiver = new BasicReceiver()
let selfAgent: RemoteIdentity = RemoteMessageIdentity.backgroundScript
let playerManager: ActivePlayerManagerInterface = new ActivePlayerManager()
let commandDispatcher = new BackgroundScriptCommandDispatcher(view, playerManager, function(){
  console.log("request to run native app")
})
let tabManager = new TabsManager()
let globasServices = new GlobalServicesProviderServer(selfAgent, tabManager)
let dispatcher: MessageDispatcher = new BackgroundScriptDispatcher(selfAgent, view, playerManager)
dispatcher.addReceiver(globasServices)

receiver.register(function(message, sendResponse) {
  dispatcher.dispatch(message, sendResponse)
})

let playerClient: PlayerClientInterface

var port = null

tabManager.scanTabs().then(() => {
  
  if (tabManager.sourcesTabs.length == 0 || tabManager.sourcesTabs[0].length == 0) {
    view.showError("No music tabs")
  } else {
    tabManager.activeTab = tabManager.sourcesTabs[0][0]
    executeContentScript(tabManager.activeTab)
  }
})

tabManager.onTabClosed = (tabId, source) => {
  // TODO
}

async function executeContentScript(tabId) {
  try {
    await browser.tabs.executeScript(tabId, { file: "lib/build/yandex_music_content_script_bundle.js" })
  } catch (e) {} 
  let sender = new TabSender(tabId)
  playerClient = new RemotePlayerClient(selfAgent, sender)
  playerManager.active = playerClient
}


function runNativeApp() {
  console.log("running native app");
  port = browser.runtime.connectNative("yandex_music_ui");
  port.onMessage.addListener((response) => {
    switch (response.action){
      case "playPause":
        //playerPlayPause()
        break
      case "next":
        //playerNext()
        break
      case "prev":
        //playerPrev()
        break
      default:
        view.showError("Unknown native app action: " + response.action)
        break
    }
  });
  port.onDisconnect.addListener((p) => {
    if (p.error) {
      console.log(`Disconnected due to an error: ${p.error.message}`);
    }
  });
}
