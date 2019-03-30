//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface ViewController : NSViewController {
    
    __weak IBOutlet NSTextField *textTextField;
    __weak IBOutlet NSTextField *secondLabelTextField;
}

- (IBAction) setText: (id) sender;

@end

