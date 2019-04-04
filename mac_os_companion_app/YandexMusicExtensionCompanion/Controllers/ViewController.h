//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "VTZMediaPlayerProtocols.h"

@interface ViewController : NSViewController<NSTableViewDataSource, NSTableViewDelegate, VTZMediaPlayerViewProtocol> {
    
    __weak IBOutlet NSTextField *textTextField;
    __weak IBOutlet NSTableView *tableView;
}

@property (nonatomic, strong) NSMutableArray* arguments;

- (IBAction)clearStdinPressed:(id)sender;

- (IBAction)backButtonPressed:(id)sender;
- (IBAction)playPauseButtonPressed:(id)sender;
- (IBAction)nextButtonPressed:(id)sender;


@end

