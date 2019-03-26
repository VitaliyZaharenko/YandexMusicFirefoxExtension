
tabs = browser.tabs;
var errorElement = null
var titleElement = null
var prevButton = null
var playPauseButton = null
var nextButton = null
var switchToPlayerButton = null


document.addEventListener("DOMContentLoaded", handleDomLoaded);


function showError(msg){
  errorElement.textContent = msg;
  errorElement.style.display = "block";

  setTimeout(function() {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }, 1000 * 5)
}


function handlePrevSongClick(e){

}

function handlePlayPauseClick(e){

}

function handleNextSongClick(e){

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


function handleDomLoaded(e){
  errorElement = document.querySelector("#error-ui");
  titleElement = document.querySelector("#song-title");
  prevButton = document.querySelector("#prev-song");
  prevButton.addEventListener("click", handlePrevSongClick);
  playPauseButton = document.querySelector("#play-pause");
  playPauseButton.addEventListener("click", handlePlayPauseClick);
  nextButton = document.querySelector("#next-song");
  nextButton.addEventListener("click", handleNextSongClick);
  switchToPlayerButton = document.querySelector("#switch-to-player-tab");
  switchToPlayerButton.addEventListener("click", handleSwitchToPlayerClick);
}
