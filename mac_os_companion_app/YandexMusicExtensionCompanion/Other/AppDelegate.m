//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import "AppDelegate.h"
#import "PlayerViewController.h"

@interface AppDelegate () {
    NSStatusItem * statusItem;
    NSPopover * popover;
    NSEvent * clicksMonitor;
}

@end

@implementation AppDelegate


- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    statusItem = [[NSStatusBar systemStatusBar] statusItemWithLength:NSSquareStatusItemLength];
    statusItem.button.image = [NSImage imageNamed:@"playerIcon"];
    statusItem.button.action = @selector(playerIconTapped);
    
    popover = [[NSPopover alloc] init];
    popover.contentViewController = [PlayerViewController instance];
    
    clicksMonitor = [NSEvent addGlobalMonitorForEventsMatchingMask:NSEventMaskLeftMouseDown | NSEventMaskRightMouseDown handler: ^ (NSEvent * event){
        if (self->popover.isShown){
            [self showPlayer:NO];
        }
    }];
}


# pragma mark Private Helper Methods

- (void) playerIconTapped {
    [self showPlayer:!popover.isShown];
}

- (void) showPlayer: (BOOL) show {
    if(show){
        if(statusItem.button != nil){
            [popover showRelativeToRect:statusItem.button.bounds ofView:statusItem.button preferredEdge:NSRectEdgeMinY];
        }
    } else {
        [popover performClose:nil];
    }
    
}



@end
