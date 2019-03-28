

console.log("From background script");

browser.runtime.onMessage.addListener(function(message){
  if(message.type == "background"){
    browser.runtime.sendMessage({ type: "debug", msg: "From Background" })
  }
  if(message.type == "backgroundLog"){
    console.log(message.msg)
  }
})

browser.commands.onCommand.addListener(function(command) {
  if (command == "prev-track"){
    playerPrev()
  }
  if (command == "next-track"){
    console.log("next track")
    playerNext()
  }
});

function playerNext(){
  sendToPlayer("next")
}

function playerPrev(){
  sendToPlayer("prev")
}

function sendToPlayer(command){
  var currenTabPromise = browser.tabs.query({url: "https://music.yandex.ru/*"});
  currenTabPromise.then((tabs) => {
    if(tabs.length == 0){
      console.log("No Yandex Music Tabs")
    } else {
      browser.tabs.sendMessage(tabs[0].id, { type: "playerControl", command: command} )
    }
  }, (error) => {
    console.log("Send to player error: " + error)
  })
}
