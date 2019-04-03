//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface ViewController : NSViewController<NSTableViewDataSource, NSTableViewDelegate> {
    
    __weak IBOutlet NSTextField *textTextField;
    __weak IBOutlet NSTableView *tableView;
}

@property (nonatomic, strong) NSMutableArray* arguments;

- (IBAction)clearStdinPressed:(id)sender;


@end

