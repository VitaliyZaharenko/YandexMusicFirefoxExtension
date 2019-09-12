import { 
    MessageReceiver,
    RemoteMessage,
    RemoteMessageType,
    RemoteAgentsManager,
    RemoteAgentType,
    RemoteSender
} from "../common";

import {
    PlayerDelegateForwarder,
    RemotePlayerDelegateSender
} from "../players"

export {
    RemotePlayerDelegateBySubscriptonServer,
    RemotePlayerDelegateSubscriptionAction,
    RemotePlayerDelegateSubscriptionMessage,
    RemotePlayerDelegateBySubscriptonInterface,
    RemotePlayerDelegateBySubscriptonClient
}


enum RemotePlayerDelegateSubscriptionAction {
    Subscribe = "Subscribe",
    Unsubscribe = "Unsubscribe"
}

interface RemotePlayerDelegateSubscriptionMessage {
    action: RemotePlayerDelegateSubscriptionAction,
    agentType: RemoteAgentType
}

interface RemotePlayerDelegateBySubscriptonInterface {
    subscribe(agentType: RemoteAgentType)
    unsubscribe(agentType: RemoteAgentType)
}


class RemotePlayerDelegateBySubscriptonServer implements MessageReceiver, RemotePlayerDelegateBySubscriptonInterface {

    private subscribedAgents = new Map<RemoteAgentType, RemotePlayerDelegateSender>()

    constructor(private remoteAgentsManager: RemoteAgentsManager,
                private delegateForwarder: PlayerDelegateForwarder) {
        
    }


    subscribe(agentType: RemoteAgentType) {
        let sender = this.remoteAgentsManager.getSender(agentType)
        if (sender == null) {
            return
        }
        let delegateSender = new RemotePlayerDelegateSender(agentType.toString(), sender)
        this.subscribedAgents[agentType] = delegateSender
        this.delegateForwarder.addDelegate(delegateSender)
    }

    unsubscribe(agentType: RemoteAgentType) {
        if(!(agentType in this.subscribedAgents)) {
            return
        }
        let delegate = this.subscribedAgents[agentType]
        this.delegateForwarder.removeDelegate(delegate)
        this.subscribedAgents.delete(agentType)
    }


    onReceive(message: RemoteMessage): RemoteMessage | null {
        if (message.messageType != RemoteMessageType.RemotePlayerDelegateSubscription) {
            return null
        }

        let subscriptionMessage = message.message as RemotePlayerDelegateSubscriptionMessage
        switch(subscriptionMessage.action) {
            case RemotePlayerDelegateSubscriptionAction.Subscribe:
                this.subscribe(subscriptionMessage.agentType)
                break
            case RemotePlayerDelegateSubscriptionAction.Unsubscribe:
                this.unsubscribe(subscriptionMessage.agentType)
                break
        }

        return {
            messageType: RemoteMessageType.ConsumedEmptyResponse,
            message: {}
        }
    }
    
}


class RemotePlayerDelegateBySubscriptonClient implements RemotePlayerDelegateBySubscriptonInterface {

    constructor(private sender: RemoteSender) {

    }

    subscribe(agentType: RemoteAgentType) {
        let message = this.creteMessage(RemotePlayerDelegateSubscriptionAction.Subscribe, agentType)
        this.sender.send(message)
    }
    unsubscribe(agentType: RemoteAgentType) {
        let message = this.creteMessage(RemotePlayerDelegateSubscriptionAction.Unsubscribe, agentType)
        this.sender.send(message)
    }

    private creteMessage(action: RemotePlayerDelegateSubscriptionAction, agentType: RemoteAgentType): RemoteMessage {
        let subscriptionMessage: RemotePlayerDelegateSubscriptionMessage = {
            action: action,
            agentType: agentType
        }
        return {
            messageType: RemoteMessageType.RemotePlayerDelegateSubscription,
            message: subscriptionMessage
        }
    }    
}