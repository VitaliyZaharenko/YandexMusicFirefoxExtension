
export { TrackInfo, TrackDuration }

interface TrackInfo {

    name: string
    version?: string
    artists: Array<string>
}

interface TrackDuration {
    duration: string
    currentDuration: string
    currentProgress: number
}