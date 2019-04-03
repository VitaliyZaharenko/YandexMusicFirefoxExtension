//  Copyright © 2019 vzakharenko. All rights reserved.
//

#import "ViewController.h"

@implementation ViewController {
    NSFileHandle* pipeReadHandle;
}


@synthesize arguments;

- (void)viewDidLoad {
    [super viewDidLoad];
    self.arguments = [NSMutableArray new];
    tableView.delegate = self;
    tableView.dataSource = self;
    
    [[NSNotificationCenter defaultCenter] addObserver: self selector: @selector(handleNotification:) name: @"VTZStdinputNotification" object: self];
    
    [self startListerningInputStream];
    
    
}

- (void) wirteToStdout {
    #pragma clang diagnostic push
    #pragma clang diagnostic ignored "-Weverything"
    
    char testmsg[1024];
    char * some  = "Blablabla";
    uint32_t len = strlen(some);
    //sprintf(lentstr, "Len is=%u", len);
    //fwrite(lentstr, sizeof(char), strlen(lentstr), stdout);
    size_t numberWrited = fwrite(&len, sizeof(len), 1, stdout);
    size_t messageWrited = fwrite(some, sizeof(char), len, stdout);
    //fflush(stdout);
    //    sprintf(testmsg, "First write=%u, secondWrite=%u", numberWrited, messageWrited);
    //    fwrite(testmsg, sizeof(char), strlen(testmsg), stdout);
    //    fflush(stdout);
    
    fwrite("Some test message", sizeof(char), strlen("Some test message"), stderr);
    fflush(stderr);
    
    #pragma clang diagnostic pop
}

- (void) startListerningInputStream {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0), ^{
        while(YES){
            int BUFFER_SIZE = 1024;
            char string[BUFFER_SIZE];
            
            u_int32_t messageLength;
            fread(&messageLength, sizeof(messageLength), 1, stdin);
            if(messageLength >= BUFFER_SIZE){
                [self postNotificationWithMessage:@"Message length bigger than buffer"];
                break;
            }
            fread(&string, sizeof(char) * messageLength, 1, stdin);
            NSString* readed = [NSString stringWithCString:string encoding:NSUTF8StringEncoding];
            [self postNotificationWithMessage:readed];
        }
    });
}

- (void) postNotificationWithMessage: (NSString*) message {
    NSDictionary* userInfo = @{@"message": message};
    [[NSNotificationCenter defaultCenter] postNotificationName:@"VTZStdinputNotification" object:self userInfo: userInfo];
}

- (void) clearStdinPressed:(id)sender {
    [self.arguments removeAllObjects];
    [tableView reloadData];
}


- (void) handleNotification: (NSNotification *)notification {
    
    if([notification.name isEqualToString:@"VTZStdinputNotification"]){
        NSString* message = notification.userInfo[@"message"];
        dispatch_async(dispatch_get_main_queue(), ^{
            [self messageFromStdinReceived:message];
        });
    }
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
