//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import "PlayerViewController.h"
#import "VTZUtils.h"
#import "VTZConstants.h"
#import "VTZBrowserMediaPlayer.h"
#import "VTZRemoteMessage.h"


dispatch_queue_t vcSerialQueue;

@implementation PlayerViewController {
    VTZBrowserMediaPlayer* player;
}

# pragma mark Initialization

+ (instancetype) instance {
    NSStoryboard * storyboard = [NSStoryboard storyboardWithName:@"Main" bundle:nil];
    return [storyboard instantiateControllerWithIdentifier:@"PlayerViewController"];
}


- (instancetype)initWithNibName:(NSNibName)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if(self){
        [self commonInit];
    }
    return self;
}

- (instancetype) initWithCoder:(NSCoder *)coder {
    self = [super initWithCoder:coder];
    if(self){
        [self commonInit];
    }
    return self;
}

# pragma mark Lifecycle

- (void)viewDidLoad {
    [super viewDidLoad];
    
}

# pragma mark Response to actions

- (IBAction)backButtonPressed:(id)sender {
    [player prev];
}

- (IBAction)playPauseButtonPressed:(id)sender {
    [player playPause];
}

- (IBAction)nextButtonPressed:(id)sender {
    [player next];
}

# pragma mark Notifications handling

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
    NSAssert(NO, @"NOT IMPELEMENTED");
}

- (void)showMessage:(NSString *)message {
    NSAssert(NO, @"NOT IMPELEMENTED");
}


# pragma mark Private Methods

- (void) commonInit {
    [self subscribeToNotifications];
    [VTZUtils startListerningStdinInBackground:self];
    player = [[VTZBrowserMediaPlayer alloc] initWithView:self];
    vcSerialQueue = dispatch_queue_create("com.vit.zzz.vc", DISPATCH_QUEUE_SERIAL);
}

// should be called on main thread

- (void) messageFromStdinReceived: (NSString*) message {
    //[self sendOtherMessageWithPayload:message];
    // TODO: - Implement
}

- (void) subscribeToNotifications {
    [[NSNotificationCenter defaultCenter] addObserver: self selector: @selector(handleNotification:) name: VTZApplicationStdInputNotification object: self];    
    [[NSNotificationCenter defaultCenter] addObserver: self selector: @selector(handleMediaKeys:) name: VTZApplicationDidPressMediaKeyNotification object: nil];
}

- (void) sendOtherMessageWithPayload: (NSString* )payload {
    dispatch_async(vcSerialQueue, ^{
        VTZRemoteMessage* message = [VTZRemoteMessage otherWithPayload:payload];
        [VTZUtils writeToStdout:[message toJsonString]];
    });
}

@end
