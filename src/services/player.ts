import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

let setupPromise: Promise<void> | null = null;

export function setupPlayer(): Promise<void> {
    if (!setupPromise) {
        setupPromise = TrackPlayer.setupPlayer()
            .then(() => TrackPlayer.updateOptions({
                capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
                compactCapabilities: [Capability.Play, Capability.Pause],
                progressUpdateEventInterval: 1,
                android: {
                    appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
                },
            }))
            .catch((error) => {
                setupPromise = null;
                throw error;
            });
    }

    return setupPromise;
}

export function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}