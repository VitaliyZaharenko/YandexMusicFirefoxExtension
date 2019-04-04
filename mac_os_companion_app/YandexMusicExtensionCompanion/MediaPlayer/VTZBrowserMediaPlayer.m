//Created by vzakharenko

#import <Foundation/Foundation.h>
#import "VTZBrowserMediaPlayer.h"
#import "VTZUtils.h"

@implementation VTZBrowserMediaPlayer

static NSString* NEXT = @"next";
static NSString* PREV = @"prev";
static NSString* PLAY_PAUSE = @"playPause";

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
        NSString* json = [self createControlJsonWithAction:NEXT];
        [VTZUtils writeToStdout:json];
    });
}

- (void)playPause {
    dispatch_async(serialQueue, ^{
        NSString* json = [self createControlJsonWithAction:PLAY_PAUSE];
        [VTZUtils writeToStdout:json];
    });
}

- (void)prev {
    dispatch_async(serialQueue, ^{
        NSString* json = [self createControlJsonWithAction:PREV];
        [VTZUtils writeToStdout:json];
    });
}

- (NSString *)trackName {
    NSAssert(NO, @"NOT IMPLEMENTED");
    return @"";
}


# pragma mark - Private Helper Methods

- (NSString *) createControlJsonWithAction: (NSString*) action {
    NSString * jsonTemplate = @"{ \"action\": \"%@\" }";
    return [NSString stringWithFormat:jsonTemplate, action];
}

@end
