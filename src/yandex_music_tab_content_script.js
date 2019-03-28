
var detection_element_id = "vz-yandex" + browser.runtime.id.hashCode()
var yandexPrevSongElement = null
var yandexNextSongElement = null
var yandexPlayPauseElement = null
var trackTitleElement = null

var alreadyHookedElement = document.querySelector("#" + detection_element_id)

if (alreadyHookedElement == null){
  backgroundLog("Creating detection element with id=" + detection_element_id)
  addAlreadyHookedElement()
  setupHooks()
} else {
  backgroundLog("Detection element with id=" + detection_element_id + " already exists")
}


function backgroundLog(text){
  browser.runtime.sendMessage({ type: "backgroundLog", msg: text})
}

function showMessageInToolbarUI(text){
  browser.runtime.sendMessage({ type: "debug", msg: text})
}

function addAlreadyHookedElement(){
  var div = document.createElement("div")
  div.setAttribute("id", detection_element_id)
  document.body.appendChild(div)
}


function setupHooks(){
  yandexPrevSongElement = document.querySelector(".player-controls__btn_prev")
  yandexNextSongElement = document.querySelector(".player-controls__btn_next")
  yandexPlayPauseElement = document.querySelector(".player-controls__btn_pause")

  trackTitleElement = document.querySelector(".track__title")

  browser.runtime.onMessage.addListener(function(message){

    backgroundLog(message.type)
    backgroundLog(message.action)

    if(message.type == "playerControl"){
      handleCommand(message.command)
    }

    if(message.action == "next"){
      yandexNextSongElement.click()
      return
    }
    if(message.action == "prev"){
      yandexPrevSongElement.click()
      return
    }
    if(message.action == "playPause"){
      yandexPlayPauseElement.click()
      return
    }

    if(message.action == "trackTitle"){
      browser.runtime.sendMessage({ type: "trackTitle", msg: trackTitleElement.textContent })
    }

  })
}


function handleCommand(command){
  if(command == "next"){
    yandexNextSongElement.click()
  }
  if(command == "prev"){
    yandexPrevSongElement.click()
  }
}
