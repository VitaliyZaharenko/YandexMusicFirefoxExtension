//Created by vzakharenko

#ifndef VTZRemoteMessage_h
#define VTZRemoteMessage_h

#import "VTZPlayerCapability.h"

extern NSString* const VTZRemoteMessageTypePlayerControl;

@interface VTZRemoteMessage: NSObject

@property (strong, nonatomic) NSMutableDictionary *content;
    
+ (instancetype) playerControlWithCapability: (NSString*) capability;
- (NSString* ) toJsonString;

@end

#endif /* VTZRemoteMessage_h */
