
export {
    RemoteMessageType,
    RemoteMessage,
    RemoteIdentity,
    RemoteMessageIdentity,
    OnRemoteMessageCallback,
    RemoteSender, RemoteReceiver,
    BasicSender, TabSender,
    BasicReceiver
}

enum RemoteMessageType {
    Debug = "Debug",
    PlayerControl = "PlayerControl",
    PlayerResult = "PlayerResult"
}

type OnRemoteMessageCallback = (message: RemoteMessage, sendResponse: (response?: RemoteMessage) => void) => void

class RemoteIdentity {
    id: string
}

class RemoteMessageIdentity implements RemoteIdentity {

    static backgroundScript: RemoteMessageIdentity = new RemoteMessageIdentity("BackgroundScriptId")
    id: string
    constructor(id: string){
        this.id = id
    }
}

interface RemoteMessage {
    messageType: RemoteMessageType
    sender?: RemoteIdentity
    message: Object
}


interface RemoteSender {
    send: (message: RemoteMessage) => Promise<RemoteMessage>
}

interface RemoteReceiver {
    register(onRemoteMessage: OnRemoteMessageCallback)
}

class BasicReceiver implements RemoteReceiver {

    register(onRemoteMessage: OnRemoteMessageCallback) {
        browser.runtime.onMessage.addListener(function(message, sender, sendResponse){
            onRemoteMessage(message as RemoteMessage, sendResponse)
        })
    }
}

class BasicSender implements RemoteSender {
    send(message: RemoteMessage): Promise<RemoteMessage> {
        return browser.runtime.sendMessage(message)
    }
}

class TabSender implements RemoteSender {
    constructor(private tabId: number) {}
    send(message: RemoteMessage): Promise<RemoteMessage> {
        return browser.tabs.sendMessage(this.tabId, message)
    }
}
