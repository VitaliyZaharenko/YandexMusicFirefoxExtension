export { PlayerCapability, PlayerCapabilities };

enum PlayerCapability {
    Play = "Play",
    Pause = "Pause",
    PlayingStatus = "PlayingStatus",
    StepForward = "StepForward",
    StepBack = "StepBack",
    NextTrack = "NextTrack",
    PreviousTrack = "PreviousTrack",
    TrackInfo = "TrackInfo",
    TrackCoverImage = "TrackCoverImage",
    DurationStatus = "DurationStatus",
    Like = "Like",
    Dislike = "Dislike",
    Repeat = "Repeat"
}

type PlayerCapabilities = Set<PlayerCapability>