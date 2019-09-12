import { 
    RemoteSender
} from "."


export {
    RemoteAgentType,
    RemoteAgentsManager
}

enum RemoteAgentType {
    Popup = "Popup",
    NativeApp = "NativeApp",
    ContentScript = "ContentScript"
}


class RemoteAgentsManager {

    private registeredSenders = new Map<RemoteAgentType, RemoteSender>()

    getSender(agentType: RemoteAgentType): RemoteSender | null {
        if (agentType in this.registeredSenders) {
            return this.registeredSenders[agentType]
        } else {
            return null
        }
    }

    constructor(){}

    registerSender(agentType: RemoteAgentType, sender: RemoteSender) {
        this.registeredSenders[agentType] = sender
    }
    unregisterSenderType(agentType: RemoteAgentType) {
        if (agentType in this.registeredSenders) {
            this.registeredSenders.delete(agentType)
        }
    }
}