
export {
    RemoteMessageType,
    RemoteMessage,
    RemoteIdentity,
    RemoteMessageIdentity,
    OnRemoteMessageCallback,
    RemoteSender, RemoteReceiver,
    BasicSender, TabSender, NativeSender,
    BasicReceiver, FromNativeReceiver
}

enum RemoteMessageType {
    ChannelMessage = "ChannelMessage",
    NativeNoResult = "NativeNoResult",
    Error = "Error",
    Debug = "Debug",
    PlayerControl = "PlayerControl",
    PlayerStatus = "PlayerStatus",
    PlayerState = "PlayerState",
    PlayerResult = "PlayerResult",
    ConsumedEmptyResponse = "ConsumedEmptyResponse",
    GlobalService = "GlobalService",
    GlobalServiceResult = "GlobalServiceResult"
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

class FromNativeReceiver implements RemoteReceiver {

    constructor(private port: browser.runtime.Port) {

    }
    register(onRemoteMessage: OnRemoteMessageCallback) {
        this.port.onMessage.addListener((message) => {
            onRemoteMessage(message as RemoteMessage, null)
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

class NativeSender implements RemoteSender {

    constructor(private port: browser.runtime.Port) {
    }

    async send(message: RemoteMessage): Promise<RemoteMessage> {
        this.port.postMessage(message)
        let result: RemoteMessage = {
            messageType: RemoteMessageType.NativeNoResult,
            message: "No result from onPost to native port message"
        }
        return result
    }
}
