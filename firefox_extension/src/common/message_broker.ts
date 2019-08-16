import { RemoteSender, RemoteMessage } from "./remote_message";

export { MessageDispatcher }

interface MessageDispatcher {
    sender: RemoteSender
    dispatch: (message: RemoteMessage, sendResponse: (message: RemoteMessage) => void) => void
}

