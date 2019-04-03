//Created by vzakharenko

#import "VTZApplication.h"
#import <IOKit/hidsystem/ev_keymap.h>


@implementation VTZApplication

- (void)sendEvent:(NSEvent *)event {
    
    NSEventType type = [event type];
    if(type == NSEventTypeSystemDefined){
        [self handleMediaKeyEvent:event];
    }
    [super sendEvent:event];
}

- (void) handleMediaKeyEvent: (NSEvent *) event {
    int code = (event.data1 & 0xFFFF0000) >> 16;
    int flags = (event.data1 & 0x0000FFFF);
    bool downState = ((flags & 0xFF00) >> 8) == 0xA;
    if (downState) {
        switch(code) {
            case NX_KEYTYPE_PLAY:
                [self handlePlayPausePressed];
                break;
            case NX_KEYTYPE_FAST:
            case NX_KEYTYPE_NEXT:
                [self handleNextPressed];
                break;
            case NX_KEYTYPE_REWIND:
            case NX_KEYTYPE_PREVIOUS:
                [self handlePrevPressed];
                break;
        }
    }
}

- (void) handlePrevPressed {
    
}

- (void) handlePlayPausePressed {
    
}

- (void) handleNextPressed {
    
}

@end
