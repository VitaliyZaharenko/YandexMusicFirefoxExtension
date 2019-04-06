//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "VTZMediaPlayerProtocols.h"

@interface PlayerViewController : NSViewController<VTZMediaPlayerViewProtocol> { }

+ (instancetype) instance;

- (instancetype) initWithCoder:(NSCoder *)coder;
- (instancetype) initWithNibName:(NSNibName)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil;

- (IBAction)backButtonPressed:(id)sender;
- (IBAction)playPauseButtonPressed:(id)sender;
- (IBAction)nextButtonPressed:(id)sender;


@end

