//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface ViewController : NSViewController {
    
    __weak IBOutlet NSTextField *textTextField;
}

- (IBAction) setText: (id) sender;

@end

