showMessage("From background script", false)


var port = null

browser.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.type == "background"){
    handleBackgroundAction(message.action, sendResponse)
  }
  if(message.type == "backgroundLog"){
    let sender = message.from || "SenderNotSet"
    showMessage(message.msg, `Message(${sender}): \n`)
  }
})


executeHookScriptOnYandexTab((succes) => {
  showMessage(success, "from content script")
}, (error) => {
  showError(error, "from content script")
})

browser.commands.onCommand.addListener(function(command) {
  let handler = commandHandlerMap[command] || unknownCommand
  handler(command)
});


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
  sendToPlayer("playerIsActive").then((success) => {
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
    executePromise2 = browser.tabs.executeScript(tab.id, { file: "src/yandex_music_tab_content_script.js" })
    executePromise2.then((success) => {
      showMessage("Content script injected")
    }, onError)
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

const commandHandlerMap = {
  "prev-track-command": playerPrev,
  "next-track-command": playerNext,
  "play-pause-command": playerPlayPause,
  "run-native-app-command": runNativeApp,
  "send-to-native-app-command": sendMessageToNativeApp
}


function unknownCommand(command){
  console.log("unknown command: " + command)
}

function playerNext(){
  sendToPlayer("next")
}

function playerPrev(){
  sendToPlayer("prev")
}

function playerPlayPause(){
  sendToPlayer("playPause")
}

function sendToPlayer(action, sendResponse){
  var currenTabPromise = browser.tabs.query({url: "https://music.yandex.ru/*"});
  currenTabPromise.then((tabs) => {
    if(tabs.length == 0){
      showError("No Yandex Music Tabs")
    } else {
      browser.tabs.sendMessage(tabs[0].id, { type: "playerControl", action: action} ).then((response) => {
        if(sendResponse){
          sendResponse(response)
        } else {
          showMessage(response)
        }
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
    console.log("Received: " + response);
  });
}

function sendMessageToNativeApp(message){
  port.postMessage(message || "Test debug message!");
}


// script as view

function showError(error, includePrefix = "Error(bg): \n"){
  if(includePrefix){
    console.log(includePrefix + error)
  } else {
    console.log(error)
  }
}

function showMessage(message, includePrefix = "Message(bg): \n"){
  if(includePrefix){
    console.log(includePrefix + message)
  } else {
    console.log(message)
  }
}
