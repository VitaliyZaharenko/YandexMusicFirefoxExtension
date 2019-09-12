//Created by vzakharenko

#ifndef VTZRemoteMessage_h
#define VTZRemoteMessage_h

#import "VTZPlayerCapability.h"

extern NSString* const VTZRemoteMessageTypePlayerControl;
extern NSString* const VTZRemoteMessageTypeOther;

@interface VTZRemoteMessage: NSObject

@property (strong, nonatomic) NSMutableDictionary *content;
    
+ (instancetype) playerControlWithCapability: (NSString*) capability;
+ (instancetype) otherWithPayload: (NSString * const)payload;
- (NSString* ) toJsonString;

@end

#endif /* VTZRemoteMessage_h */
