import { PlayerCapabilities } from '../player/capabilities'
import { 
  RemoteMessageIdentity,
  RemoteSender, RemoteReceiver,
  BasicSender, TabSender,
  BasicReceiver,
  RemoteIdentity,
  RemoteMessage,
  RemoteMessageType
} from "../common/remote_message"

import { BaseViewInterface, ConsoleView } from "../common/console_view"
import { PlayerClientInterface } from '../player/player_interface';
import { BackgroundScriptCommandDispatcher } from '../dispatchers/command_dispatcher'
import { BackgroundScriptDispatcher } from '../dispatchers/background_script_dispatcher'
import { ActivePlayerManagerInterface, ActivePlayerManager } from '../players/active_player_manager'
import { MessageDispatcher } from '../common/message_broker'
import { TabsManager } from '../common/tabs_manager';
import { GlobalServicesProviderServer } from '../providers/global_services'
import { MessageChannelServer, MessageConsumerInterface, MessageChannelClient } from '../common/message_channel';
import { RemotePlayerClient, RemotePlayerForwarder } from '../players/remote_player';

let view: BaseViewInterface = new ConsoleView()
let receiver: RemoteReceiver = new BasicReceiver()
let selfAgent: RemoteIdentity = RemoteMessageIdentity.backgroundScript
let playerManager: ActivePlayerManagerInterface = new ActivePlayerManager()
let commandDispatcher = new BackgroundScriptCommandDispatcher(view, playerManager, function(){
  console.log("request to run native app")
})
let tabManager = new TabsManager()
let globalServices = new GlobalServicesProviderServer(selfAgent, tabManager)
let dispatcher: MessageDispatcher = new BackgroundScriptDispatcher(selfAgent, view, playerManager)
let runtimeSender = new BasicSender()
let toolbarChannelServer = new MessageChannelServer(runtimeSender, "toolbar->background", view)
let toolbarChannelClient = new MessageChannelClient(runtimeSender, "toolbar<-background")
let contentChannelClient
let contentChannelServer
dispatcher.addReceiver(toolbarChannelServer)
dispatcher.addReceiver(toolbarChannelClient)
dispatcher.addReceiver(globalServices)



receiver.register(function(message, sendResponse) {
  dispatcher.dispatch(message, sendResponse)
})

let playerClient: PlayerClientInterface
let playerForwarder: RemotePlayerForwarder

var port = null

tabManager.scanTabs().then(() => {
  
  if (tabManager.sourcesTabs.length == 0 || tabManager.sourcesTabs[0].length == 0) {
    view.showError("No music tabs")
  } else {
    tabManager.activeTab = tabManager.sourcesTabs[0][0]
    registerSupportObjects(tabManager.activeTab)
    executeContentScript(tabManager.activeTab)
  }
})

tabManager.onTabClosed = (tabId, source) => {
  // TODO
}

function registerSupportObjects(tabId) {
  let sender = new TabSender(tabId)
  contentChannelClient = new MessageChannelClient(sender, "content<-background")
  contentChannelServer = new MessageChannelServer(sender, "content->background", view)
  playerClient = new RemotePlayerClient(contentChannelClient)
  playerManager.active = playerClient
  dispatcher.addReceiver(contentChannelServer)
  dispatcher.addReceiver(contentChannelClient)
  playerForwarder = new RemotePlayerForwarder(playerClient)
  toolbarChannelServer.addConsumer(playerForwarder)
}

async function executeContentScript(tabId) {
  try {
    await browser.tabs.executeScript(tabId, { file: "lib/build/yandex_music_content_script_bundle.js" })
  } catch (e) {} 
}


function runNativeApp() {
  console.log("running native app");
  port = browser.runtime.connectNative("yandex_music_ui");
  port.onMessage.addListener((response) => {


    try {
      let message = response as RemoteMessage
      dispatcher.dispatch(message, (unused)=> {})
    } catch (e) {
      view.showError("Unknown response from native app")
      view.showError(response)
      view.showError(e)
    }
  });
  port.onDisconnect.addListener((p) => {
    if (p.error) {
      view.showError(`Disconnected due to an error: ${p.error.message}`);
    }
  });
}
