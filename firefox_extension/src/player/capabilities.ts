export { PlayerCapability, PlayerCapabilities };

enum PlayerCapability {
    TogglePlaying = "TogglePlaying",
    PlayingStatus = "PlayingStatus",
    StepForward = "StepForward",
    StepBack = "StepBack",
    NextTrack = "NextTrack",
    PreviousTrack = "PreviousTrack",
    TrackInfo = "TrackInfo",
    TrackCoverImage = "TrackCoverImage",
    DurationStatus = "DurationStatus",
    ToggleLike = "ToggleLike",
    StrongDislike = "StrongDislike",
    LikeStatus = "LikeStatus",
    Repeat = "Repeat"
}

type PlayerCapabilities = Set<PlayerCapability>