import { MessageConsumerInterface } from '../common/message_channel';
import { RemoteMessage, RemoteMessageType } from './remote_message';

export { DebugConsumer }

class DebugConsumer implements MessageConsumerInterface {


    constructor(public onDebug: (message: any) => any | null ) {
    }


    shouldConsume(message: any): boolean {
        let remoteMessage = message as RemoteMessage
        return remoteMessage.messageType == RemoteMessageType.Debug
    }    
    
    async consume(message: any): Promise<any> {
        let remoteMessage = message as RemoteMessage
        return this.onDebug(remoteMessage.message)
    }




}