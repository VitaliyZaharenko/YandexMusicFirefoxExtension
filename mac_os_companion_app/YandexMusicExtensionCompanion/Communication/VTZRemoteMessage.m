//Created by vzakharenko

#import <Foundation/Foundation.h>
#import "VTZRemoteMessage.h"

NSString* const VTZRemoteMessageTypePlayerControl = @"PlayerControl";


@implementation VTZRemoteMessage

@synthesize content;

+ (instancetype) playerControlWithCapability:(NSString * const)capability {
    
    VTZRemoteMessage * message = [[VTZRemoteMessage alloc] init];
    message.content = [[NSMutableDictionary alloc] init];
    message.content[@"messageType"] = VTZRemoteMessageTypePlayerControl;
    message.content[@"message"] = @{@"type": @"ProvideCapability", @"capability": capability };
    return message;
}

- (NSString *) toJsonString {
    NSData* json = [NSJSONSerialization dataWithJSONObject: [self content]
                                                   options:NSJSONWritingPrettyPrinted
                                                     error:nil];
    return [[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding];
}



@end
