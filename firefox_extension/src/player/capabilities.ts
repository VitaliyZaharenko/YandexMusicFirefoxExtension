export { PlayerCapability, PlayerCapabilities };

enum PlayerCapability {
    Play,
    Pause,
    PlayingStatus,
    StepForward,
    StepBack,
    NextTrack,
    PreviouTrack,
    TrackInfo,
    TrackCoverImage,
    DurationStatus,
    Like,
    Dislike,
    Repeat
}

type PlayerCapabilities = Set<PlayerCapability>