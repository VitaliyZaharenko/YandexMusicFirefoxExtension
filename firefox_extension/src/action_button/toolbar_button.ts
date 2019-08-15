
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

function backgroundLog(text){
  browser.runtime.sendMessage({ type: "backgroundLog", msg: text, from: "ToolbarUI"})
}

function handlePrevSongClick(e){
  browser.runtime.sendMessage({ type: "background", action: "playerPrev"})
}

function handlePlayPauseClick(e){
  browser.runtime.sendMessage({ type: "background", action: "playerPlayPause"})
}

function handleNextSongClick(e){
  browser.runtime.sendMessage({ type: "background", action: "playerNext"})
}

function handleSwitchToPlayerClick(e){
  browser.runtime.sendMessage({ type: "background", action: "playerSwitchToPlayer"})
}


function checkIfPlayerAvailable(){
  browser.runtime.sendMessage({ type: "background", action: "playerIsActive"}).then((success) => {
    if (!success) {
      showError("Response is falsive")
      return
    }
    if(success.msg == "SUCCESS"){
      showMessage("Player is Active")
    }
    if(success.msg == "FAILURE" || success.msg == "ERROR"){
      showError("Player is not available")
    }
  })
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

  checkIfPlayerAvailable()
  addHotkeys()
}


// script as view

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
