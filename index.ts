import TrackPlayer from 'react-native-track-player';
import playbackService from './src/services/playback-service';

TrackPlayer.registerPlaybackService(() => playbackService);

require('expo-router/entry');
