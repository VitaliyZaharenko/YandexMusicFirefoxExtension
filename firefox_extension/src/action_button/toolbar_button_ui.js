
tabs = browser.tabs;
var messageElement = null
var titleElement = null
var prevButton = null
var playPauseButton = null
var nextButton = null
var switchToPlayerButton = null


document.addEventListener("DOMContentLoaded", handleDomLoaded);

browser.runtime.onMessage.addListener(function(message){
  if(message.type == "trackTitle"){
    titleElement.textContent = message.msg
    return
  }
  if(message.type == "debug"){
    showWarning(message.msg)
  }
})


function showWarning(msg){
  messageElement.className = "warning-message"
  showMessage(msg)
}

function showError(msg){
  messageElement.className = "error-message"
  showMessage(msg)
}

function showMessage(msg){
  messageElement.textContent = msg;
  messageElement.style.display = "block";

  setTimeout(function() {
    messageElement.className = ""
    messageElement.textContent = "";
    messageElement.style.display = "none";
  }, 1000 * 5)
}


function backgroundLog(text){
  browser.runtime.sendMessage({ type: "backgroundLog", msg: text})
}

function getYandexMusicTab(onSuccess, onError) {
  var yandexTabPromise = tabs.query({url: "https://music.yandex.ru/*"});
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

function executeHookScriptOnYandexTab(){
  executeOnYandexMusicTab((tab) => {
    executePromise2 = tabs.executeScript(tab.id, { file: "src/yandex_music_tab_content_script.js" })
    executePromise2.then((succes) => {
      tabs.sendMessage(tab.id, { action: "trackTitle" })
    }, (error) => { showError(error) })
  })
}


function handlePrevSongClick(e){
  executeOnYandexMusicTab((tab) => {
    tabs.sendMessage(tab.id, { action: "prev" })
  })
}

function handlePlayPauseClick(e){
  executeOnYandexMusicTab((tab) => {
    tabs.sendMessage(tab.id, { action: "playPause" })
  })
}

function handleNextSongClick(e){
  executeOnYandexMusicTab((tab) => {
    tabs.sendMessage(tab.id, { action: "next" })
  })
}

function handleSwitchToPlayerClick(e){
  var currenTabPromise = tabs.query({url: "https://music.yandex.ru/*"});
  currenTabPromise.then((tabs) => {
    handleYandexMusicTab(tabs[0])
  }, (error) => {
    titleElement.textContent = error;
  })
}

function handleYandexMusicTab(tab){
  if(tab == null){
    showError("Tab is null")
    return
  }

  tabs.update(tab.id, { active: true })
}

function addHotkeys(){
  document.addEventListener("keydown", event => {
    if(event.code == "KeyO"){
      nextButton.click()
      return
    }
    if(event.code == "KeyI"){
      playPauseButton.click()
      return
    }
    if(event.code == "KeyU"){
      prevButton.click()
      return
    }

    if(event.code == "KeyQ"){
      browser.runtime.sendMessage({ type: "background" })
      return
    }

  })
}


function handleDomLoaded(e){
  messageElement = document.querySelector("#message-ui");
  titleElement = document.querySelector("#song-title");
  prevButton = document.querySelector("#prev-song");
  prevButton.addEventListener("click", handlePrevSongClick);
  playPauseButton = document.querySelector("#play-pause");
  playPauseButton.addEventListener("click", handlePlayPauseClick);
  nextButton = document.querySelector("#next-song");
  nextButton.addEventListener("click", handleNextSongClick);
  switchToPlayerButton = document.querySelector("#switch-to-player-tab");
  switchToPlayerButton.addEventListener("click", handleSwitchToPlayerClick);
  executeHookScriptOnYandexTab()
  addHotkeys()
}
