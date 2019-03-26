

var alreadyHookedElement = document.querySelector("#vz-yandex-plugin-hooked")

if (alreadyHookedElement == null){
  addAlreadyHookedElement()
  setupHooks()
}


function addAlreadyHookedElement(){
  var div = document.createElement("div")
  div.setAttribute("id", "vz-yandex-plugin-hooked")
  document.body.appendChild(div)
}


function setupHooks(){
  var yandexPrevSongElement = document.querySelector(".player-controls__btn_prev")
  var yandexNextSongElement = document.querySelector(".player-controls__btn_next")
  var yandexPlayPauseElement = document.querySelector(".player-controls__btn_pause")

  var trackTitle = document.querySelector(".track__title")

  browser.runtime.onMessage.addListener(function(message){
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
      browser.runtime.sendMessage({ type: "trackTitle", msg: trackTitle.textContent })
    }

  })
}
