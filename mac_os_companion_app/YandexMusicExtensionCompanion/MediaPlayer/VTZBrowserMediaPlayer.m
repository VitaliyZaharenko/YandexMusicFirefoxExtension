//Created by vzakharenko

#import <Foundation/Foundation.h>

// project
#import "VTZBrowserMediaPlayer.h"
#import "VTZUtils.h"
#import "VTZPlayerCapability.h"
#import "VTZRemoteMessage.h"

@implementation VTZBrowserMediaPlayer

dispatch_queue_t serialQueue;

- (instancetype) initWithView:(id<VTZMediaPlayerViewProtocol>)view {
    self = [super init];
    playerView = view;
    serialQueue = dispatch_queue_create("com.vit.zzz", DISPATCH_QUEUE_SERIAL);
    return self;
}

# pragma mark VTZMediaPlayerProtocol

- (bool)isPlaying {
    NSAssert(NO, @"NOT IMPLEMENTED");
    return NO;
}

- (void)next {
    dispatch_async(serialQueue, ^{
        VTZRemoteMessage* message = [VTZRemoteMessage playerControlWithCapability:VTZPlayerCapabilityNextTrack];
        [VTZUtils writeToStdout:[message toJsonString]];
    });
}

- (void)playPause {
    dispatch_async(serialQueue, ^{
        VTZRemoteMessage* message = [VTZRemoteMessage playerControlWithCapability:VTZPlayerCapabilityTogglePlaying];
        [VTZUtils writeToStdout:[message toJsonString]];
    });
}

- (void)prev {
    dispatch_async(serialQueue, ^{
        VTZRemoteMessage* message = [VTZRemoteMessage playerControlWithCapability:VTZPlayerCapabilityPrevTrack];
        [VTZUtils writeToStdout:[message toJsonString]];
    });
}

- (NSString *)trackName {
    NSAssert(NO, @"NOT IMPLEMENTED");
    return @"";
}


@end
