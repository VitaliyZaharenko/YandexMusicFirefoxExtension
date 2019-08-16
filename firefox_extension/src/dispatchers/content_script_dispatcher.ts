import { MessageDispatcher } from '../common/message_broker'
import { RemoteSender, RemoteMessage, RemoteMessageType, RemoteIdentity } from '../common/remote_message';
import { BaseViewInterface } from '../common/console_view';
import { 
    PlayerInterface, 
    Result, 
    PlayerRemoteMessage, ProvideCapabilityMessage,
    PlayerResultRemoteMessage, PlayerResultMessage, PlayerCapabilitiesResultMessage
} from '../player/player_interface'

import { PlayerCapability } from '../player/capabilities';

export { ContentScriptDispatcher }

class ContentScriptDispatcher implements MessageDispatcher {

    agent: RemoteIdentity
    sender: RemoteSender
    view: BaseViewInterface
    player: PlayerInterface

    constructor(agent: RemoteIdentity, sender: RemoteSender, view: BaseViewInterface, player: PlayerInterface) {
        this.agent = agent
        this.sender = sender
        this.view = view
        this.player = player
    }

    dispatch(message: RemoteMessage, sendResponse: (message: RemoteMessage) => void) {
        switch (message.messageType) {
            case RemoteMessageType.Debug:
                this.handleDebug(message)
                break
            case RemoteMessageType.PlayerControl:
                this.handlePlayer(message.message as PlayerRemoteMessage, sendResponse)
                break
            default:
                this.handleUnknown(message)
                break
        }
    }

    private handleDebug(message: RemoteMessage) {
        this.view.showMessage(message.message.toString())
    }

    private handlePlayer(message: PlayerRemoteMessage, sendResponse) {

        switch (message.type) {
        case "ProvideCapability": 
            let capability = message.capability
            let result = this.player.provide(capability)

            let provideResponse: PlayerResultRemoteMessage = {
                type: "PlayerResult",
                result: result
            }

            sendResponse({
                messageType: RemoteMessageType.PlayerResult,
                from: this.agent,
                message: provideResponse
            })
            break;
        case "GetCapabilities":
            let capabilities = this.player.capabilities
            let capabilitiesResponse: PlayerResultRemoteMessage = {
                type: "PlayerCapabilitiesResult",
                result: capabilities
            }
            sendResponse({
                messageType: RemoteMessageType.PlayerResult,
                from: this.agent,
                message: capabilitiesResponse
            })
        }
    }

    private handleUnknown(message: RemoteMessage) {
        this.view.showError("Unknown Message type")
        this.view.showError(message.message.toString())
        this.sender.send({
            messageType: RemoteMessageType.Debug,
            from: this.agent,
            message: {
                unknownMessage: message
            }
        } as RemoteMessage)
    }
}