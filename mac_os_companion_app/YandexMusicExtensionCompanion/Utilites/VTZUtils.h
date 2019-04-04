//Created by vzakharenko

#ifndef VTZUtils_h
#define VTZUtils_h

@interface VTZUtils: NSObject

+ (void) writeToStdout: (NSString *) message;
+ (void) startListerningStdinInBackground: (id) observer;

@end


#endif /* VTZUtils_h */
