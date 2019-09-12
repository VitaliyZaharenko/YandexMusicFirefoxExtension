import { 
  PlayerCapabilities, PlayerClientInterface,
 } from '../player'
import { 
  RemoteMessageIdentity,
  RemoteSender, RemoteReceiver,
  BasicSender, TabSender,
  BasicReceiver,
  RemoteIdentity,
  NativeSender,
  FromNativeReceiver,
  BaseViewInterface, ConsoleView,
  MessageDispatcher,
  TabsManager,
  MessageChannelServer, MessageConsumerInterface, MessageChannelClient, RemoteMessageType,
  RemoteAgentsManager, RemoteAgentType
} from "../common"
import {
  PlayerDelegateForwarder,
  RemotePlayerClient, RemotePlayerForwarder, RemotePlayerForwarderReceiverStyle,
  ActivePlayerManagerInterface, ActivePlayerManager, RemotePlayerDelegateReceiver, 
  PrintPlayerDelegate, RemotePlayerDelegateSender, RemotePlayerState, 
  RemotePlayerDelegateBySubscriptonServer
} from '../players'
import {
  BackgroundScriptCommandDispatcher,
  BackgroundScriptDispatcher
} from '../dispatchers'
import { 
  GlobalServicesProviderServer 
} from '../providers'

let view: BaseViewInterface = new ConsoleView()
let receiver: RemoteReceiver = new BasicReceiver()
let selfAgent: RemoteIdentity = RemoteMessageIdentity.backgroundScript
let playerManager: ActivePlayerManagerInterface = new ActivePlayerManager()
let commandDispatcher = new BackgroundScriptCommandDispatcher(view, playerManager, function(){
  runNativeApp()
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
let nativeAppPlayerForwarder

let playerDelegateForwarder = new PlayerDelegateForwarder([]) 
let remotePlayerState = new RemotePlayerState(playerDelegateForwarder)
let playerDelegateReceiver = new RemotePlayerDelegateReceiver("content->background[PlayerStatus]", remotePlayerState)
dispatcher.addReceiver(playerDelegateReceiver)
dispatcher.addReceiver(remotePlayerState)

let remoteSendersManager = new RemoteAgentsManager()
remoteSendersManager.registerSender(RemoteAgentType.Popup, runtimeSender)

let playerDelegateBySubscription = new RemotePlayerDelegateBySubscriptonServer(remoteSendersManager, playerDelegateForwarder)
dispatcher.addReceiver(playerDelegateBySubscription)


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
  remoteSendersManager.registerSender(RemoteAgentType.ContentScript, sender)
  contentChannelClient = new MessageChannelClient(sender, "content<-background")
  contentChannelServer = new MessageChannelServer(sender, "content->background", view)
  playerClient = new RemotePlayerClient(contentChannelClient)
  playerManager.active = playerClient
  dispatcher.addReceiver(contentChannelServer)
  dispatcher.addReceiver(contentChannelClient)
  playerForwarder = new RemotePlayerForwarder(playerClient)
  toolbarChannelServer.addConsumer(playerForwarder)
  nativeAppPlayerForwarder = new RemotePlayerForwarderReceiverStyle(playerManager.active)
  dispatcher.addReceiver(nativeAppPlayerForwarder)
}

async function executeContentScript(tabId) {
  try {
    await browser.tabs.executeScript(tabId, { file: "lib/build/yandex_music_content_script_bundle.js" })
  } catch (e) { } 
}


function runNativeApp() {
  console.log("running native app");
  let port = browser.runtime.connectNative("yandex_music_ui");
  let nativeSender = new NativeSender(port)
  let nativeReceiver = new FromNativeReceiver(port)
  nativeReceiver.register((message, notUsed) => {
    dispatcher.dispatch(message, notUsed)
  })
  remoteSendersManager.registerSender(RemoteAgentType.NativeApp, nativeSender)
  port.onDisconnect.addListener((p) => {
    remoteSendersManager.unregisterSenderType(RemoteAgentType.NativeApp)
    if (p.error) {
      view.showError(`Disconnected due to an error: ${p.error.message}`);
    }
  });
}
