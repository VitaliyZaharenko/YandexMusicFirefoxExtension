//Created by vzakharenko

#ifndef VTZBrowserMediaPlayer_h
#define VTZBrowserMediaPlayer_h

#import "VTZMediaPlayerProtocols.h"

@interface VTZBrowserMediaPlayer : NSObject<VTZMediaPlayerProtocol> {
    id<VTZMediaPlayerViewProtocol> playerView;
}

- (instancetype) initWithView: (id<VTZMediaPlayerViewProtocol>)view;

@end

#endif /* VTZBrowserMediaPlayer_h */
