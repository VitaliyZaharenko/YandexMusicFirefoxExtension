//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import "ViewController.h"
#import "VTZUtils.h"
#import "VTZConstants.h"
#import "VTZBrowserMediaPlayer.h"

@implementation ViewController {
    NSFileHandle* pipeReadHandle;
    VTZBrowserMediaPlayer* player;
}

@synthesize arguments;

- (void)viewDidLoad {
    [super viewDidLoad];
    self.arguments = [NSMutableArray new];
    tableView.delegate = self;
    tableView.dataSource = self;
    
    [[NSNotificationCenter defaultCenter] addObserver: self selector: @selector(handleNotification:) name: VTZApplicationStdInputNotification object: self];
    
    [[NSNotificationCenter defaultCenter] addObserver: self selector: @selector(handleMediaKeys:) name: VTZApplicationDidPressMediaKeyNotification object: nil];
    
    [VTZUtils startListerningStdinInBackground:nil];
    
    player = [[VTZBrowserMediaPlayer alloc] initWithView:self];
    
}


- (void) clearStdinPressed:(id)sender {
    [self.arguments removeAllObjects];
    [tableView reloadData];
}

- (IBAction)backButtonPressed:(id)sender {
    [player prev];
}

- (IBAction)playPauseButtonPressed:(id)sender {
    [player playPause];
}

- (IBAction)nextButtonPressed:(id)sender {
    [player next];
}


- (void) handleNotification: (NSNotification *)notification {
    
    if([notification.name isEqualToString:VTZApplicationStdInputNotification]){
        NSString* message = notification.userInfo[VTZApplicationStdInputMessageKey];
        dispatch_async(dispatch_get_main_queue(), ^{
            [self messageFromStdinReceived:message];
        });
    }
}

- (void) handleMediaKeys: (NSNotification *) notification {
    if(![notification.name isEqualToString: VTZApplicationDidPressMediaKeyNotification]){
        return;
    }
    NSString * mediaKeyType = notification.userInfo[VTZApplicationDidPressMediaKeyTypeKey];
    
    if ([mediaKeyType isEqualToString:VTZApplicationDidPressMediaKeyForward]){
        [player next];
    } else if ([mediaKeyType isEqualToString:VTZApplicationDidPressMediaKeyBackward]){
        [player prev];
    } else if ([mediaKeyType isEqualToString:VTZApplicationDidPressMediaKeyPlayPause]){
        [player playPause];
    }
}


# pragma mark VTZMediaPlayerViewProtocol

- (void)showError:(NSError *)error {
    [arguments addObject:[error localizedDescription]];
    [tableView reloadData];
}

- (void)showMessage:(NSString *)message {
    [arguments addObject:message];
    [tableView reloadData];
}


# pragma mark Private Methods

// should be called in main thread

- (void) messageFromStdinReceived: (NSString*) message {
    [self.arguments addObject:message];
    [tableView reloadData];
}


# pragma mark NSTableView delegate and dataSource

- (NSInteger)numberOfRowsInTableView:(NSTableView *)tableView {
    return arguments.count;
}

- (NSView *)tableView:(NSTableView *)tableView viewForTableColumn:(NSTableColumn *)tableColumn row:(NSInteger)row {
    
    NSString * argument = self.arguments[row];
    NSTableCellView* cell = [tableView makeViewWithIdentifier:@"ArgumentCell" owner:nil];
    cell.textField.stringValue = argument;
    return cell;
}


@end
