//Created by vzakharenko

#ifndef VTZMediaPlayerProtocols_h
#define VTZMediaPlayerProtocols_h

@protocol VTZMediaPlayerProtocol

- (void) next;
- (void) prev;
- (void) playPause;
- (NSString* ) trackName;
- (bool) isPlaying;

@end


@protocol VTZMediaPlayerViewProtocol

- (void) showError: (NSError *) error;
- (void) showMessage: (NSString *) message;

@end


#endif /* VTZMediaPlayerProtocols_h */
