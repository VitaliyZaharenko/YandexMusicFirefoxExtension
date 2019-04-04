//Created by vzakharenko

#import <Foundation/Foundation.h>
#import "VTZUtils.h"
#import "VTZConstants.h"

@implementation VTZUtils

+ (void) writeToStdout: (NSString *) message {
    #pragma clang diagnostic push
    #pragma clang diagnostic ignored "-Wshorten-64-to-32"
    const char * cMessage = [message cStringUsingEncoding:NSUTF8StringEncoding];
    uint32_t len = strlen(cMessage);
    fwrite(&len, sizeof(len), 1, stdout);
    fwrite(cMessage, sizeof(char), len, stdout);
    fflush(stdout);
    #pragma clang diagnostic pop
}



+ (void) startListerningStdinInBackground: (id) observer {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
        while(YES){
            int BUFFER_SIZE = 1024;
            char string[BUFFER_SIZE];
            
            u_int32_t messageLength;
            fread(&messageLength, sizeof(messageLength), 1, stdin);
            if(messageLength >= BUFFER_SIZE){
                NSAssert(NO, @"Message length bigger than buffer");
                break;
            }
            fread(&string, sizeof(char) * messageLength, 1, stdin);
            NSString* readed = [NSString stringWithCString:string encoding:NSUTF8StringEncoding];
            NSDictionary* userInfo = @{VTZApplicationStdInputMessageKey: readed};
            [[NSNotificationCenter defaultCenter] postNotificationName:VTZApplicationStdInputNotification
                                                                object:observer
                                                              userInfo:userInfo];
        }
    });
}


@end
