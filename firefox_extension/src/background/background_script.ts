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

let view: BaseViewInterface = new ConsoleView()
let receiver: RemoteReceiver = new BasicReceiver()
let selfAgent: RemoteIdentity = RemoteMessageIdentity.backgroundScript
let commandDispatcher = new BackgroundScriptCommandDispatcher(view, function(){
  console.log("request to run native app")
})

receiver.register(function(message, sendResponse) {
  let body = message.message
  console.log(body)
})

let playerClient: PlayerClientInterface

var port = null


executeHookScriptOnYandexTab((success) => {
}, (error) => {
})

function handleBackgroundAction(action, sendResponse){
  if(action == "playerIsActive"){
    checkPlayerAvailable(sendResponse)
    return
  }
  if(action == "playerNext"){
    playerNext()
    return
  }
  if(action == "playerPrev"){
    playerPrev()
    return
  }
  if(action == "playerPlayPause"){
    playerPlayPause()
    return
  }
  if(action == "playerSwitchToPlayer"){
    switchToActiveYandexTab()
    return
  }
  showError(`Unknown action =${action}`)
}

function checkPlayerAvailable(sendResponse){
  sendToPlayer("playerIsActive", (success) => {
    if(success){
      sendResponse({type: "backgroundResponse", msg: "SUCCESS"})
    } else {
      sendResponse({type: "backgroundResponse", msg: "FAILURE"})
    }
  }, (error) => {
    showError("Error when checking player availability " + error)
      sendResponse({type: "backgroundResponse", msg: "ERROR"})
  })
}

function getYandexMusicTab(onSuccess, onError) {
  var yandexTabPromise = browser.tabs.query({url: "https://music.yandex.ru/*"});
  yandexTabPromise.then((tabs) => {
    if(tabs == null || tabs.length == 0){
      onError(null)
    } else {
      onSuccess(tabs[0])
    }
  }, (error) => {
      onError(error)
  })
}

function executeOnYandexMusicTab(onSuccess){
  getYandexMusicTab((tab) => {
    onSuccess(tab)
  }, (error) => {
    showError(error)
  })
}

function executeHookScriptOnYandexTab(onSuccess, onError){
  executeOnYandexMusicTab((tab) => {
    let executePromise2 = browser.tabs.executeScript(tab.id, { file: "lib/build/yandex_music_content_script_bundle.js" })
    executePromise2.then((success) => {
      showMessage("Content script injected")

    }, onError).finally(function(){
      let sender = new TabSender(tab.id)
      playerClient = new RemotePlayerClient(selfAgent, sender)
      commandDispatcher.playerClient = playerClient
      playerClient.getCapabilities().then(function(capabilites){
        
      }).catch(function(error){
        console.log("-------------error--------")
        console.log(error)
      })
    })
  })
}

function switchToActiveYandexTab(){
  var currenTabPromise = browser.tabs.query({url: "https://music.yandex.ru/*"});
  currenTabPromise.then((tabs) => {
    handleYandexMusicTab(tabs[0])
  }, (error) => {
      showError(error)
  })
}

function handleYandexMusicTab(tab){
  if(tab == null){
    showError("Yandex tab is null")
    return
  }
  browser.tabs.update(tab.id, { active: true })
}

function injectIfNotActiveAndSend(actionFunction){
  checkPlayerAvailable((response) => {
    if(response.msg == "SUCCESS"){
      actionFunction()
    }
    if(response.msg == "FAILURE" || response.msg == "ERROR"){
      executeHookScriptOnYandexTab((success) => {
        actionFunction()
      }, (error) => {
        showError("Error when trying to inject hook script: " + error)
      })
    }
  })
}

function playerNext(){
  injectIfNotActiveAndSend(function(){
      sendToPlayer("next")
  })
}

function playerPrev(){
  injectIfNotActiveAndSend(function(){
    sendToPlayer("prev")
  })
}

function playerPlayPause(){
  injectIfNotActiveAndSend(function(){
      sendToPlayer("playPause")
  })
}

function sendToPlayer(action, onSuccess?, onError?){
  var currenTabPromise = browser.tabs.query({url: "https://music.yandex.ru/*"});
  currenTabPromise.then((tabs) => {
    if(tabs.length == 0){
      onError("No Yandex Music Tabs")
    } else {

      browser.tabs.sendMessage(tabs[0].id, { type: "playerControl", action: action} ).then((response) => {
        if(onSuccess){
          onSuccess(response)
        } else {
          showMessage(response)
        }
      }).catch((error) => {
        onError(error)
      })
    }
  }, (error) => {
    showError("Send to player error " + error)
  })
}

function runNativeApp() {
  console.log("running native app");
  port = browser.runtime.connectNative("yandex_music_ui");
  port.onMessage.addListener((response) => {
    switch (response.action){
      case "playPause":
        playerPlayPause()
        break
      case "next":
        playerNext()
        break
      case "prev":
        playerPrev()
        break
      default:
        showError("Unknown native app action: " + response.action)
        break
    }
  });
  port.onDisconnect.addListener((p) => {
    if (p.error) {
      console.log(`Disconnected due to an error: ${p.error.message}`);
    }
  });
}
