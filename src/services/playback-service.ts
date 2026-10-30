import TrackPlayer, { Event, State } from 'react-native-track-player';

export default async function playbackService() {
    TrackPlayer.addEventListener(Event.RemotePlay, async () => {
        try {
            await TrackPlayer.play();
        } catch (error) {
            console.error('Notification play command failed:', error);
        }
    });

    TrackPlayer.addEventListener(Event.RemotePause, async () => {
        try {
            await TrackPlayer.pause();
        } catch (error) {
            console.error('Notification pause command failed:', error);
        }
    });

    TrackPlayer.addEventListener(Event.RemotePlayPause, async () => {
        try {
            const { state } = await TrackPlayer.getPlaybackState();
            if (state === State.Playing) {
                await TrackPlayer.pause();
            } else {
                await TrackPlayer.play();
            }
        } catch (error) {
            console.error('Notification play/pause command failed:', error);
        }
    });

    TrackPlayer.addEventListener(Event.RemoteStop, async () => {
        try {
            await TrackPlayer.stop();
        } catch (error) {
            console.error('Notification stop command failed:', error);
        }
    });

    TrackPlayer.addEventListener(Event.RemoteSeek, async ({ position }) => {
        try {
            await TrackPlayer.seekTo(position);
        } catch (error) {
            console.error('Notification seek command failed:', error);
        }
    });
}
