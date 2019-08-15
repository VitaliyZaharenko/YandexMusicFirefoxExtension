import { PlayerCapabilities } from "../player/capabilities"


var yandexPrevSongElement = null
var yandexNextSongElement = null
var yandexPlayPauseElement = null
var trackTitleElement = null

// var alreadyHookedElement = document.querySelector("#" + detection_element_id)
//
// if (alreadyHookedElement == null){
//   backgroundLog("Creating detection element with id=" + detection_element_id)
//   addAlreadyHookedElement()
//   setupHooks()
// } else {
//   backgroundLog("Detection element with id=" + detection_element_id + " already exists")
// }

setupHooks()

function backgroundLog(text){
  browser.runtime.sendMessage({ type: "backgroundLog", msg: text, from: "yandex content script"})
}

function showMessageInToolbarUI(text){
  browser.runtime.sendMessage({ type: "debug", msg: text})
}


function setupHooks(){

  yandexPrevSongElement = document.querySelector(".player-controls__btn_prev")
  yandexNextSongElement = document.querySelector(".player-controls__btn_next")
  yandexPlayPauseElement = document.querySelector(".player-controls__btn_pause") ||
                           document.querySelector(".player-controls__btn_play")

  trackTitleElement = document.querySelector(".track__title")

  browser.runtime.onMessage.addListener(function(message, sender, sendResponse){

    if(message.type == "playerIsActive"){
      sendResponse({type: "playerIsActive", status: true})
    }

    if(message.type == "playerControl"){
      handleAction(message.action, sendResponse)
    }

    if(message.action == "trackTitle"){
      browser.runtime.sendMessage({ type: "trackTitle", msg: trackTitleElement.textContent })
    }
  })
}

function handleAction(action, sendResponse){
  if(action == "next"){
    playerNext(sendResponse)
  }
  if(action == "prev"){
    playerPrev(sendResponse)
  }
  if(action == "playPause"){
    playerPlayPause(sendResponse)
  }
  if(action == "playerIsActive"){
    playerIsActive(sendResponse)
  }
}

// player controls interface

function playerPlayPause(sendResponse){
  yandexPlayPauseElement.click()
  sendResponse({ type: "contentScriptResponse", msg: "SUCCESS" })
}

function playerPrev(sendResponse){
  yandexPrevSongElement.click()
  sendResponse({ type: "contentScriptResponse", msg: "SUCCESS" })
}

function playerNext(sendResponse){
  yandexNextSongElement.click()
  sendResponse({ type: "contentScriptResponse", msg: "SUCCESS" })
}

function playerIsActive(sendResponse){
  sendResponse({ type: "contentScriptResponse", msg: "SUCCESS" })
}

// script return value
undefined
