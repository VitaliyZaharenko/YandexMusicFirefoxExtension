//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import "ViewController.h"

@implementation ViewController


- (void)viewDidLoad {
    [super viewDidLoad];
}


- (void)setRepresentedObject:(id)representedObject {
    [super setRepresentedObject:representedObject];

}


- (IBAction) setText: (id) sender {
    textTextField.stringValue = @"Pushed";
}


@end
